import ImageKit, { toFile } from "@imagekit/nodejs";
import Config from "../config/config.js";

const imagekit = new ImageKit({
  publicKey: Config.imagekit_public_key,
  privateKey: Config.imagekit_private_key,
  urlEndpoint: Config.imagekit_url_endpoint,
});

class ImageKitService {
  async uploadAvatar(file) {
    const fileObj = file.buffer ? await toFile(Buffer.from(file.buffer), file.originalname || "avatar") : file;
    const result = await imagekit.files.upload({
      file: fileObj,
      fileName: `avatar_${Date.now()}_${(file.originalname || "avatar").replace(/\s+/g, "_")}`,
      folder: "/user/avatar",
    });
    return { url: result.url, fileId: result.fileId };
  }

  async uploadDocument(file, documentName) {
    const safeName = documentName ? documentName.replace(/\s+/g, "_") : "doc";
    const fileObj = file.buffer ? await toFile(Buffer.from(file.buffer), file.originalname || `${safeName}.pdf`) : file;
    const result = await imagekit.files.upload({
      file: fileObj,
      fileName: `doc_${safeName}_${Date.now()}`,
      folder: "/documents",
    });
    console.log('imagekit file', result);
    return { url: result.url, fileId: result.fileId };
  }

  async deleteFile(fileId) {
    await imagekit.files.deleteFile(fileId);
  }
}

export default new ImageKitService();
