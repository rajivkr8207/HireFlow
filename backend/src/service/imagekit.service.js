import ImageKit from "@imagekit/nodejs";
import Config from "../config/config.js";

const imagekit = new ImageKit({
  publicKey: Config.imagekit_public_key,
  privateKey: Config.imagekit_private_key,
  urlEndpoint: Config.imagekit_url_endpoint,
});

class ImageKitService {
  /**
   * Upload a user avatar image.
   * @param {Express.Multer.File} file - multer file object (memory storage)
   * @returns {Promise<{ url: string, fileId: string }>}
   */
  async uploadAvatar(file) {
    const result = await imagekit.upload({
      file: file.buffer,
      fileName: `avatar_${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`,
      folder: "/user/avatar",
    });
    return { url: result.url, fileId: result.fileId };
  }

  /**
   * Upload a document file (PDF / image / etc.).
   * @param {Express.Multer.File} file - multer file object (memory storage)
   * @param {string} documentName - human-readable name for the document
   * @returns {Promise<{ url: string, fileId: string }>}
   */
  async uploadDocument(file, documentName) {
    const safeName = documentName.replace(/\s+/g, "_");
    const result = await imagekit.upload({
      file: file.buffer,
      fileName: `doc_${safeName}_${Date.now()}`,
      folder: "/documents",
    });
    return { url: result.url, fileId: result.fileId };
  }

  /**
   * Delete a file from ImageKit by its fileId.
   * @param {string} fileId
   */
  async deleteFile(fileId) {
    await imagekit.deleteFile(fileId);
  }
}

export default new ImageKitService();
