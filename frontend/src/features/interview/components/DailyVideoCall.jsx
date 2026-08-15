import { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { Loader2, AlertCircle, Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';

const DailyVideoCall = ({ roomUrl, token, userName, onLeave }) => {
  const containerRef = useRef(null);
  const callFrameRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | joining | joined | error | left
  const [errorMessage, setErrorMessage] = useState('');
  const [participants, setParticipants] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  useEffect(() => {
    if (!roomUrl || !token || !containerRef.current) return;

    let callFrame;

    const initCall = async () => {
      try {
        setStatus('loading');

        callFrame = DailyIframe.createFrame(containerRef.current, {
          showLeaveButton: false, // we handle our own
          showFullscreenButton: true,
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '16px',
          },
        });

        callFrameRef.current = callFrame;

        callFrame.on('joining-meeting', () => setStatus('joining'));
        callFrame.on('joined-meeting', () => {
          setStatus('joined');
          setParticipants(Object.keys(callFrame.participants()).length);
        });
        callFrame.on('participant-joined', () =>
          setParticipants(Object.keys(callFrame.participants()).length),
        );
        callFrame.on('participant-left', () =>
          setParticipants(Object.keys(callFrame.participants()).length),
        );
        callFrame.on('left-meeting', () => {
          setStatus('left');
          if (onLeave) onLeave();
        });
        callFrame.on('error', (evt) => {
          setStatus('error');
          setErrorMessage(evt?.errorMsg || 'An error occurred in the video call.');
        });

        await callFrame.join({ url: roomUrl, token, userName });
      } catch (err) {
        setStatus('error');
        setErrorMessage(err?.message || 'Failed to initialize video call.');
      }
    };

    initCall();

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomUrl, token]);

  const handleLeave = async () => {
    if (callFrameRef.current) {
      await callFrameRef.current.leave();
    } else if (onLeave) {
      onLeave();
    }
  };

  const toggleMute = async () => {
    if (!callFrameRef.current) return;
    await callFrameRef.current.setLocalAudio(isMuted); // setLocalAudio(true) = unmute
    setIsMuted(!isMuted);
  };

  const toggleCamera = async () => {
    if (!callFrameRef.current) return;
    await callFrameRef.current.setLocalVideo(isCamOff);
    setIsCamOff(!isCamOff);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Status bar */}
      {status !== 'joined' && (
        <div className="flex items-center justify-center py-3">
          {(status === 'loading' || status === 'joining') && (
            <div className="flex items-center gap-2 text-sm text-indigo-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{status === 'loading' ? 'Preparing video room...' : 'Joining meeting...'}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMessage}</span>
            </div>
          )}
          {status === 'left' && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>You have left the meeting.</span>
            </div>
          )}
        </div>
      )}

      {/* Video Frame */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 rounded-2xl overflow-hidden border border-gray-700/60 bg-gray-900"
        style={{ minHeight: '480px' }}
      />

      {/* Control Bar */}
      {status === 'joined' && (
        <div className="flex items-center justify-between mt-4 px-2">
          {/* Participants count */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800/60 px-3 py-2 text-xs text-gray-300">
            <Video className="h-3.5 w-3.5 text-indigo-400" />
            <span>{participants} participant{participants !== 1 ? 's' : ''}</span>
          </div>

          {/* Center controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                isMuted
                  ? 'border-red-500/40 bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <button
              onClick={handleLeave}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 hover:bg-red-500 active:scale-95 transition-all"
              title="Leave Interview"
            >
              <PhoneOff className="h-5 w-5" />
            </button>

            <button
              onClick={toggleCamera}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                isCamOff
                  ? 'border-red-500/40 bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              title={isCamOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isCamOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </button>
          </div>

          {/* Spacer to balance layout */}
          <div className="w-24" />
        </div>
      )}
    </div>
  );
};

export default DailyVideoCall;
