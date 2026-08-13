import { useState } from 'react';
import { Briefcase, Building2, MapPin, ExternalLink, Trash2, Clock, Sparkles, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';

const statusBadgeStyles = {
  applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shortlisted: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  screening: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  interview: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  selected: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  withdrawn: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const getATSBadgeStyle = (score = 0) => {
  if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  if (score >= 60) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
  if (score >= 40) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  return 'bg-red-500/10 text-red-400 border-red-500/30';
};

const MyApplicationsList = ({ applications, onWithdraw, isLoading }) => {
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [expandedAtsId, setExpandedAtsId] = useState(null);

  const handleWithdrawClick = async (id) => {
    if (window.confirm('Are you sure you want to withdraw this job application?')) {
      try {
        setWithdrawingId(id);
        await onWithdraw(id);
        toast.success('Application withdrawn');
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to withdraw application');
      } finally {
        setWithdrawingId(null);
      }
    }
  };

  if (isLoading && (!applications || applications.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        <p className="text-sm text-gray-400">Loading your applications...</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-12 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800/60 text-gray-400">
          <Briefcase className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">No Applications Yet</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            You haven't applied to any job postings yet. Explore open roles and kickstart your career!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const job = app.jobId || {};
        const isWithdrawn = app.status === 'withdrawn';
        const isWithdrawingThis = withdrawingId === app._id;
        const isAtsExpanded = expandedAtsId === app._id;

        const locationText = typeof job.location === 'object'
          ? [job.location?.city, job.location?.state, job.location?.country].filter(Boolean).join(', ')
          : job.location || 'N/A';

        return (
          <div
            key={app._id}
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 p-6 ${
              isWithdrawn
                ? 'border-gray-800/60 bg-gray-900/20 opacity-70'
                : 'border-gray-800 bg-gray-900/60 hover:border-gray-700 hover:bg-gray-900'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Job & Company Info */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-300">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors">
                      {job.title || 'Position Unavailable'}
                    </h4>
                    <p className="text-xs font-medium text-gray-400">{job.company || 'Company N/A'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-500" />
                    {locationText}
                  </span>
                  {job.salary && (
                    <span className="font-medium text-emerald-400">
                      ${job.salary}
                    </span>
                  )}
                  {job.workmode && (
                    <span className="capitalize px-2 py-0.5 rounded-md bg-gray-800 text-gray-300">
                      {job.workmode}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Badges & Actions */}
              <div className="flex items-center justify-between md:justify-end flex-wrap gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-800">
                {/* ATS Score Badge */}
                {typeof app.atsScore === 'number' && (
                  <button
                    onClick={() => setExpandedAtsId(isAtsExpanded ? null : app._id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition-all ${getATSBadgeStyle(
                      app.atsScore
                    )}`}
                    title="Click to view ATS Score Breakdown"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{app.atsScore}% ATS Match</span>
                    {isAtsExpanded ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                )}

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border capitalize ${
                    statusBadgeStyles[app.status] || 'bg-gray-800 text-gray-300 border-gray-700'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {app.status}
                </span>

                {/* Resume Link */}
                {app.resume && (
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl border border-gray-800 bg-gray-950 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all"
                  >
                    <span>View Resume</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                {/* Withdraw Action */}
                {!isWithdrawn && app.status === 'applied' && (
                  <button
                    onClick={() => handleWithdrawClick(app._id)}
                    disabled={isWithdrawingThis}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                  >
                    {isWithdrawingThis ? (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    <span>Withdraw</span>
                  </button>
                )}
              </div>
            </div>

            {/* ATS Score Details Dropdown */}
            {isAtsExpanded && app.atsFeedback && (
              <div className="mt-4 pt-4 border-t border-gray-800/80 bg-gray-950/60 p-4 rounded-xl space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> ATS Match Analysis Report
                  </span>
                  <span className="text-xs font-bold text-white bg-indigo-600/30 px-2 py-0.5 rounded-md border border-indigo-500/30">
                    Score: {app.atsScore} / 100
                  </span>
                </div>

                <p className="text-xs text-gray-300 italic bg-gray-900/60 p-2.5 rounded-lg border border-gray-800">
                  "{app.atsFeedback.summary}"
                </p>

                {app.atsFeedback.matchedSkills && app.atsFeedback.matchedSkills.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1 mb-1.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Matched Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.atsFeedback.matchedSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-500/20"
                        >
                          ? {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {app.atsFeedback.missingSkills && app.atsFeedback.missingSkills.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1 mb-1.5">
                      <AlertCircle className="h-3 w-3 text-amber-400" /> Missing / Unmatched Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.atsFeedback.missingSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300 border border-amber-500/20"
                        >
                          ! {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MyApplicationsList;
