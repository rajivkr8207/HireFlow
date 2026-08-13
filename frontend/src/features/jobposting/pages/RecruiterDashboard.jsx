import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useJobs } from '../hook/useJobs';
import {
  Briefcase, Plus, MapPin, Clock, Trash2, Eye,
  CheckCircle2, XCircle, PauseCircle, TrendingUp, Building2, ChevronDown
} from 'lucide-react';
import { toast } from 'react-toastify';

const STATUS_CONFIG = {
  open:   { label: 'Open',   color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  closed: { label: 'Closed', color: 'text-red-400 bg-red-500/10 border-red-500/20',            icon: XCircle },
  hold:   { label: 'On Hold', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',  icon: PauseCircle },
};

const WorkmodeBadge = ({ mode }) => {
  const colors = {
    'full-time':  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'part-time':  'bg-purple-500/10 text-purple-400 border-purple-500/20',
    contract:     'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    temporary:    'bg-orange-500/10 text-orange-400 border-orange-500/20',
    other:        'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${colors[mode] || colors.other}`}>
      {mode}
    </span>
  );
};

const StatusSelector = ({ jobId, current, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const statuses = ['open', 'closed', 'hold'];
  const cfg = STATUS_CONFIG[current] || STATUS_CONFIG.open;
  const Icon = cfg.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.color} hover:opacity-80 transition-opacity`}
      >
        <Icon className="h-3.5 w-3.5" />
        {cfg.label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-32 rounded-xl border border-gray-800 bg-gray-900 py-1 shadow-xl shadow-black/40">
          {statuses.filter((s) => s !== current).map((s) => {
            const c = STATUS_CONFIG[s];
            const I = c.icon;
            return (
              <button
                key={s}
                onClick={() => { onStatusChange(jobId, s); setOpen(false); }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-gray-800 ${c.color.split(' ')[0]}`}
              >
                <I className="h-3.5 w-3.5" /> {c.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { jobs, isLoading, error, fetchJobs, updateJobStatus, removeJob } = useJobs();

  useEffect(() => {
    fetchJobs().catch(() => {});
  }, [fetchJobs]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateJobStatus(id, status);
      toast.success(`Job marked as ${STATUS_CONFIG[status]?.label}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await removeJob(id);
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete job');
    }
  };

  const total  = jobs.length;
  const openJobs   = jobs.filter((j) => j.status === 'open').length;
  const closedJobs = jobs.filter((j) => j.status === 'closed').length;
  const holdJobs   = jobs.filter((j) => j.status === 'hold').length;

  const stats = [
    { label: 'Total Postings', value: total,      icon: Briefcase,    color: 'from-indigo-600 to-indigo-400', shadow: 'shadow-indigo-500/20' },
    { label: 'Active (Open)',  value: openJobs,   icon: CheckCircle2, color: 'from-emerald-600 to-emerald-400', shadow: 'shadow-emerald-500/20' },
    { label: 'Closed',         value: closedJobs, icon: XCircle,      color: 'from-red-600 to-red-400',        shadow: 'shadow-red-500/20' },
    { label: 'On Hold',        value: holdJobs,   icon: PauseCircle,  color: 'from-yellow-600 to-yellow-400',  shadow: 'shadow-yellow-500/20' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            Recruiter Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">Manage your job postings and track applications</p>
        </div>
        <Link
          to="/jobs/create"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-95 transition-all duration-150"
        >
          <Plus className="h-4 w-4" />
          Post a New Job
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, shadow }) => (
          <div
            key={label}
            className={`relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 p-5 shadow-lg ${shadow}`}
          >
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${color} opacity-10 blur-xl`} />
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg ${shadow}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Job Listings */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
          <p>{error}</p>
          <button onClick={() => fetchJobs()} className="mt-3 text-sm underline hover:no-underline">
            Try again
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-800 bg-gray-900/30 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600/10">
            <Briefcase className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">No job postings yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first job posting</p>
          <Link
            to="/jobs/create"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" /> Create Job Posting
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Your Job Postings</h2>
            <span className="text-xs text-gray-600">{total} total</span>
          </div>
          {jobs.map((job) => {
            const loc = job.location;
            const locationStr = [loc?.city, loc?.state, loc?.country].filter(Boolean).join(', ');
            const postedDate = new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

            return (
              <div
                key={job._id}
                className="group relative flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/40 p-5 backdrop-blur-sm transition-all duration-200 hover:border-gray-700 hover:bg-gray-900/60 sm:flex-row sm:items-center"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400">
                  <Building2 className="h-6 w-6" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-white truncate">{job.title}</h3>
                    <WorkmodeBadge mode={job.workmode} />
                  </div>
                  <p className="mt-0.5 text-sm text-gray-400 truncate">{job.company}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                    {locationStr && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {locationStr}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {job.experience}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {postedDate}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <StatusSelector
                    jobId={job._id}
                    current={job.status}
                    onStatusChange={handleStatusChange}
                  />
                  <Link
                    to={`/jobs/${job._id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-800 text-gray-500 hover:bg-indigo-600/10 hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-150"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id, job.title)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-800 text-gray-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-150"
                    title="Delete Job"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
