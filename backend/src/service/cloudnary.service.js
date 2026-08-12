import ImageKit, { toFile } from '@imagekit/nodejs';
import Config from '../config/config.js';

const client = new ImageKit({
    privateKey: Config.image_kit,
});

class ImageService {
    async CreateAvatar(file) {
        const imgurl = await client.files.upload({
            file: await toFile(Buffer.from(file.buffer), 'file'),
            fileName: `user_${Date.now()}`,
            folder: "/user/avatar"
        });
        return imgurl
    }
}

export default new ImageService;