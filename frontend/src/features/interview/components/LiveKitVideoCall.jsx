import { useState } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  GridLayout,
  ParticipantTile,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import { AlertCircle, PhoneOff } from 'lucide-react';

const CustomVideoConference = ({ onLeave }) => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <div className="relative flex flex-col h-full w-full bg-gray-950 rounded-2xl overflow-hidden">
      {/* Video Grid */}
      <div className="flex-1 p-3 min-h-0">
        <GridLayout tracks={tracks} className="h-full w-full">
          <ParticipantTile />
        </GridLayout>
      </div>

      {/* Audio Renderer */}
      <RoomAudioRenderer />

      {/* Control Bar */}
      <div className="p-3 border-t border-gray-800 bg-gray-900/90 backdrop-blur-md flex items-center justify-between">
        <ControlBar
          controls={{
            microphone: true,
            camera: true,
            screenShare: true,
            chat: false,
            leave: false,
          }}
          className="bg-transparent border-none text-white"
        />

        <button
          onClick={onLeave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium text-sm shadow-lg shadow-red-600/30 active:scale-95 transition-all cursor-pointer"
          title="Leave Interview"
        >
          <PhoneOff className="h-4 w-4" />
          <span>Leave Call</span>
        </button>
      </div>
    </div>
  );
};

const LiveKitVideoCall = ({ serverUrl, token, userName, onLeave }) => {
  const [errorMsg, setErrorMsg] = useState('');

  if (!serverUrl || !token) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-3 text-red-400">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm font-medium">Missing LiveKit server URL or access token.</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={serverUrl}
      onDisconnected={onLeave}
      onError={(err) => setErrorMsg(err?.message || 'LiveKit connection error')}
      data-lk-theme="default"
      className="h-full w-full rounded-2xl overflow-hidden border border-gray-800 bg-gray-950"
    >
      {errorMsg ? (
        <div className="flex flex-col items-center justify-center h-full space-y-3 text-red-400">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      ) : (
        <CustomVideoConference onLeave={onLeave} />
      )}
    </LiveKitRoom>
  );
};

export default LiveKitVideoCall;
