import { useState } from 'react';
import { X, Calendar, Clock, Briefcase, AlertCircle, Loader2, Video } from 'lucide-react';

const ScheduleInterviewModal = ({ isOpen, onClose, application, onScheduled }) => {
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [title, setTitle] = useState('Technical Interview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !application) return null;

  const candidateName =
    application?.candidateId?.userId?.fullName ||
    application?.candidateId?.fullName ||
    application?.candidateName ||
    'Candidate';

  const jobTitle = application?.jobId?.title || 'This Position';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!scheduledDate || !scheduledTime) {
      setError('Please select both date and time for the interview.');
      return;
    }

    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
    if (scheduledAt <= new Date()) {
      setError('Interview must be scheduled in the future.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onScheduled({ applicationId: application._id, scheduledAt: scheduledAt.toISOString(), title });
      // Reset form
      setScheduledDate('');
      setScheduledTime('');
      setTitle('Technical Interview');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to schedule interview. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Min date: today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-gray-700/60 bg-gray-900 shadow-2xl shadow-black/60 animate-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Schedule Interview</h2>
              <p className="text-xs text-gray-400">Set up a video interview via Daily.co</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Candidate Info Banner */}
        <div className="mx-5 mt-5 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
          <Briefcase className="h-4 w-4 shrink-0 text-amber-400" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-amber-300">{candidateName}</p>
            <p className="truncate text-xs text-amber-400/70">For: {jobTitle}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Interview Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Interview Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Technical Round 1"
              className="w-full rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5" /> Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                min={today}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-700 bg-gray-800/60 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all [color-scheme:dark]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                <Clock className="h-3.5 w-3.5" /> Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-700 bg-gray-800/60 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Info note */}
          <p className="text-xs text-gray-500 flex items-start gap-1.5">
            <span className="mt-0.5 shrink-0">💡</span>
            A private Daily.co video room will be created. Both you and the candidate will get a join link.
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  Schedule Interview
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
