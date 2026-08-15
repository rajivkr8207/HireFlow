import {
    AccessToken,
} from 'livekit-server-sdk';

import Config from '../config/Config.js';

export const createLiveKitToken = async ({
    roomName,
    userId,
    userName,
    isRecruiter = true,
}) => {
    const token = new AccessToken(
        Config.livekit_api_key,
        Config.livekit_api_secret,
        {
            identity: String(userId),
            name: userName,
            ttl: '2h',
        },
    );

    token.addGrant({
        roomJoin: true,
        room: roomName,

        canPublish: true,
        canSubscribe: true,

        canPublishData: true,

        ...(isRecruiter && {
            roomAdmin: true,
        }),
    });

    return token.toJwt();
};