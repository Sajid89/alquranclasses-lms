import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-sdk-ng';

const client = createClient({ mode: 'rtc', codec: 'vp8' });

export const joinChannel = async (appId, token, channel, uid) => {
    await client.join(appId, channel, token, uid);
    const [microphoneTrack, cameraTrack] = await createMicrophoneAndCameraTracks();
    await client.publish([microphoneTrack, cameraTrack]);
    return { microphoneTrack, cameraTrack };
};

export const leaveChannel = async () => {
    client.leave();
};