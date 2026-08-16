import ImageKit, { toFile } from '@imagekit/nodejs';
import Config from '../config/Config.js';

const imagekit = new ImageKit({
  privateKey: Config.imagekit_private_key,
});

class ImageKitService {
  async uploadAvatar(file) {
    const fileObj = file.buffer
      ? await toFile(Buffer.from(file.buffer), file.originalname || 'avatar')
      : file;
    const result = await imagekit.files.upload({
      file: fileObj,
      fileName: `avatar_${Date.now()}_${(file.originalname || 'avatar').replace(/\s+/g, '_')}`,
      folder: '/user/avatar',
    });
    return { url: result.url, fileId: result.fileId };
  }

  async uploadDocument(file, documentName) {
    console.log('UploadDocument called:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      hasBuffer: !!file?.buffer,
    });

    const safeName = documentName
      ? documentName.replace(/\s+/g, '_')
      : 'doc';

    let fileObj;

    if (file.buffer) {
      console.log('Converting buffer to File object');

      fileObj = await toFile(
        Buffer.from(file.buffer),
        file.originalname || `${safeName}.pdf`,
      );

      console.log('File object created successfully');
      console.log('File object:', fileObj);
    } else if (file.path) {
      console.log('Using file path:', file.path);

      fileObj = file.path;
    } else {
      throw new Error(
        'Invalid file object: no buffer or path',
      );
    }

    console.log('BEFORE IMAGEKIT UPLOAD');

    const result = await imagekit.files.upload({
      file: fileObj,
      fileName: `doc_${safeName}_${Date.now()}`,
      folder: '/documents',
    });

    console.log('AFTER IMAGEKIT UPLOAD');

    console.log('imagekit file:', result);

    return {
      url: result.url,
      fileId: result.fileId,
    };
  }

  async deleteFile(fileId) {
    await imagekit.files.deleteFile(fileId);
  }
}

export default new ImageKitService();
