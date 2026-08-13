import User from "./user.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const registerUser = async ({ fullName, username, email, password, mobile, image, role }) => {
    const existingUser = await User.findOne({ $or: [{ email }, { username }, { mobile }] });
    if (existingUser) {
        throw new ApiError(409, "User with this email, username, or mobile already exists");
    }
    const user = await User.create({ fullName, username, email, password, mobile, image, role });
    return user;
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (!user.isActive) {
        throw new ApiError(403, "Account is deactivated. Contact admin.");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }
    user.lastLoginAt = new Date();
    await user.save();
    user.password = undefined;
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    return { user, accessToken, refreshToken };
};

export const logoutUser = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return;
};

export const refreshAccessToken = async (incomingRefreshToken) => {
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }
    const jwt = (await import("jsonwebtoken")).default;
    const config = (await import("../../config/config.js")).default;

    const decoded = jwt.verify(incomingRefreshToken, config.jwt_refresh_secret);
    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    return { accessToken, refreshToken };
};

export const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

export const editUserProfile = async (id, { fullName, username }) => {
    const user = await User.findByIdAndUpdate(
        id,
        { fullName, username },
        { new: true, runValidators: true }
    );
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

export const changeUserPassword = async (id, { oldPassword, newPassword }) => {
    const user = await User.findById(id).select("+password");
    if (!user) throw new ApiError(404, "User not found");

    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) throw new ApiError(401, "Old password is incorrect");

    user.password = newPassword;  // pre-save hook hashes it
    await user.save();
    return { message: "Password changed successfully" };
};
