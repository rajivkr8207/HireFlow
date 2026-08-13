import { X, Building2, MapPin, DollarSign, Briefcase, Calendar, CheckCircle2, Award, FileText, Send } from 'lucide-react';

const JobDetailsModal = ({ job, isOpen, onClose, onApply, isApplied, applicationStatus }) => {
  if (!isOpen || !job) return null;

  const locationText = typeof job.location === 'object'
    ? [job.location?.city, job.location?.state, job.location?.country].filter(Boolean).join(', ')
    : job.location || 'Location Not Specified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-800 bg-gray-900/90 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{job.title}</h2>
              <p className="text-sm font-medium text-indigo-400">{job.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-gray-950 border border-gray-800/60">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-indigo-400" /> Location
              </span>
              <p className="text-xs font-semibold text-gray-200 truncate">{locationText}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Salary
              </span>
              <p className="text-xs font-semibold text-gray-200">{job.salary || 'Competitive'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-purple-400" /> Workmode
              </span>
              <p className="text-xs font-semibold text-gray-200 capitalize">{job.workmode || job.jobType}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-amber-400" /> Experience
              </span>
              <p className="text-xs font-semibold text-gray-200">{job.experience || 'N/A'}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" /> Job Description
            </h3>
            <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed bg-gray-950/40 p-4 rounded-xl border border-gray-800/40">
              {job.description}
            </p>
          </div>

          {/* Skills Required */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-400" /> Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-lg bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 border border-indigo-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Key Responsibilities
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.qualifications && job.qualifications.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Qualifications
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {job.qualifications.map((qual, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Perks & Benefits
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((b, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-lg bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 border border-purple-500/20"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 border-t border-gray-800 bg-gray-900/90 px-6 py-4 backdrop-blur-md flex items-center justify-between">
          <div className="text-xs text-gray-400">
            Posted {new Date(job.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Close
            </button>

            {isApplied ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-4 w-4" />
                Applied ({applicationStatus || 'Submitted'})
              </span>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onApply(job);
                }}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all"
              >
                <Send className="h-4 w-4" />
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
