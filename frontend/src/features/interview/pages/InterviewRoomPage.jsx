import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../auth/hook/useAuth';
import { useInterview } from '../hooks/useInterview';
import LiveKitVideoCall from '../components/LiveKitVideoCall';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  User,
  Building2,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Wifi,
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    SCHEDULED: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    ONGOING: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    COMPLETED: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[status] || styles.SCHEDULED
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

const InterviewRoomPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { joinInterview } = useInterview();

  const [meetingData, setMeetingData] = useState(null); // { roomUrl, token, interview, userRole }
  const [loadStatus, setLoadStatus] = useState('loading'); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState('');
  const [callEnded, setCallEnded] = useState(false);

  const loadMeeting = useCallback(async () => {
    setLoadStatus('loading');
    try {
      const data = await joinInterview(interviewId);
      setMeetingData(data);
      setLoadStatus('ready');
    } catch (err) {
      setErrorMsg(err.message || 'Could not join interview room.');
      setLoadStatus('error');
    }
  }, [interviewId, joinInterview]);

  useEffect(() => {
    if (interviewId) loadMeeting();
  }, [interviewId, loadMeeting]);

  const handleLeave = () => {
    setCallEnded(true);
  };

  const formatDateTime = (dt) => {
    if (!dt) return '—';
    const d = new Date(dt);
    return d.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const interview = meetingData?.interview;
  const recruiter = interview?.recruiterId;
  const candidate = interview?.candidateId;
  const job = interview?.applicationId?.jobId;
  const isRecruiter = meetingData?.userRole === 'recruiter';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Nav Bar */}
      <div className="sticky top-0 z-30 border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => navigate(isRecruiter ? '/dashboard' : '/candidate-dashboard')}
            className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5">
              <Wifi className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-300">
                {callEnded ? 'Call Ended' : loadStatus === 'ready' ? 'Live' : 'Connecting...'}
              </span>
            </div>
            {interview && <StatusBadge status={interview.status} />}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Loading State */}
        {loadStatus === 'loading' && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400">Connecting to interview room...</p>
          </div>
        )}

        {/* Error State */}
        {loadStatus === 'error' && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-white">Unable to Join Interview</h2>
              <p className="text-sm text-gray-400 max-w-md">{errorMsg}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadMeeting}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all"
              >
                Retry
              </button>
              <button
                onClick={() => navigate(-1)}
                className="rounded-xl border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* Call Ended State */}
        {callEnded && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-white">Interview Ended</h2>
              <p className="text-sm text-gray-400">
                You have left the meeting. Thank you for your time!
              </p>
            </div>
            <button
              onClick={() => navigate(isRecruiter ? '/dashboard' : '/candidate-dashboard')}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        )}

        {/* Ready State — Main Interview View */}
        {loadStatus === 'ready' && !callEnded && meetingData && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Video Call — Main Area */}
            <div className="xl:col-span-3">
              <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4" style={{ height: '600px' }}>
                <LiveKitVideoCall
                  serverUrl={meetingData.serverUrl || meetingData.roomUrl}
                  token={meetingData.token}
                  userName={user?.fullName || user?.name || 'Participant'}
                  onLeave={handleLeave}
                />
              </div>
            </div>

            {/* Sidebar — Interview Info */}
            <div className="xl:col-span-1 space-y-4">
              {/* Job Info */}
              {job && (
                <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Position
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{job.title}</p>
                      <p className="text-xs text-gray-400">{job.company}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Scheduled Time */}
              {interview?.scheduledAt && (
                <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Scheduled
                  </h3>
                  <div className="flex items-start gap-2 text-sm text-gray-300">
                    <Calendar className="h-4 w-4 mt-0.5 text-indigo-400 shrink-0" />
                    <span>{formatDateTime(interview.scheduledAt)}</span>
                  </div>
                </div>
              )}

              {/* Participants */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Participants
                </h3>
                <div className="space-y-2">
                  {recruiter && (
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                        {recruiter.fullName?.[0]?.toUpperCase() || 'R'}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{recruiter.fullName}</p>
                        <p className="text-[11px] text-purple-400">Recruiter</p>
                      </div>
                    </div>
                  )}
                  {candidate && (
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                        {candidate.fullName?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{candidate.fullName}</p>
                        <p className="text-[11px] text-emerald-400">Candidate</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Your Role */}
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-400" />
                  <p className="text-xs text-gray-400">
                    You are joining as{' '}
                    <span className="font-semibold text-indigo-300 capitalize">
                      {meetingData.userRole}
                    </span>
                  </p>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {isRecruiter
                    ? 'You have host privileges for this meeting.'
                    : 'Your recruiter will start the session shortly.'}
                </p>
              </div>

              {/* Tips */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-4 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Quick Tips
                </h3>
                {[
                  'Ensure your camera and microphone are working.',
                  'Use a stable internet connection.',
                  'Find a quiet, well-lit environment.',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                    <p className="text-xs text-gray-400">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRoomPage;
