import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useJobs } from '../hook/useJobs';
import {
  ArrowLeft, MapPin, DollarSign, Briefcase, Clock, Building2,
  CheckCircle2, XCircle, PauseCircle, Trash2, ChevronDown,
  Tag, ListChecks, GraduationCap, Gift, TrendingUp, Layers,
  Users, Sparkles, ExternalLink, Mail, FileText, AlertCircle,
  Video, CalendarPlus
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useInterview } from '../../interview/hooks/useInterview';
import ScheduleInterviewModal from '../../interview/components/ScheduleInterviewModal';

const STATUS_CONFIG = {
  open:   { label: 'Open',    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  closed: { label: 'Closed',  color: 'text-red-400 bg-red-500/10 border-red-500/20',             icon: XCircle },
  hold:   { label: 'On Hold', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',    icon: PauseCircle },
};

const APPLICANT_STATUS_COLORS = {
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

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-white">{value || '—'}</p>
    </div>
  </div>
);

const ListSection = ({ icon: Icon, title, items, color = 'text-indigo-400' }) => {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${color}`}>
        <Icon className="h-4 w-4" /> {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${color.replace('text-', 'bg-')}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const TagList = ({ items }) => {
  if (!items?.length) return <span className="text-sm text-gray-600">None specified</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className="rounded-full border border-indigo-500/30 bg-indigo-600/10 px-2.5 py-0.5 text-xs text-indigo-300">
          {item}
        </span>
      ))}
    </div>
  );
};

const StatusDropdown = ({ current, onSelect }) => {
  const [open, setOpen] = useState(false);
  const statuses = ['open', 'closed', 'hold'];
  const cfg = STATUS_CONFIG[current] || STATUS_CONFIG.open;
  const Icon = cfg.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${cfg.color} hover:opacity-80 transition-opacity`}
      >
        <Icon className="h-4 w-4" /> {cfg.label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-1 w-40 rounded-xl border border-gray-800 bg-gray-900 py-1 shadow-xl shadow-black/40">
          {statuses.filter((s) => s !== current).map((s) => {
            const c = STATUS_CONFIG[s];
            const I = c.icon;
            return (
              <button
                key={s}
                onClick={() => { onSelect(s); setOpen(false); }}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-800 ${c.color.split(' ')[0]}`}
              >
                <I className="h-4 w-4" /> {c.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentJob: job, isLoading, error, fetchJobDetail, updateJobStatus, removeJob, fetchJobApplicants, changeApplicantStatus } = useJobs();

  const [activeTab, setActiveTab] = useState('details');
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [expandedAtsId, setExpandedAtsId] = useState(null);

  // Interview state
  const { scheduleInterview, fetchInterviewByApplication } = useInterview();
  const [scheduleTarget, setScheduleTarget] = useState(null); // application for scheduling
  // Map: applicationId -> interviewId (populated after scheduling or fetching)
  const [interviewMap, setInterviewMap] = useState({});
  const [joiningInterviewId, setJoiningInterviewId] = useState(null);

  useEffect(() => {
    if (id) {
      fetchJobDetail(id).catch(() => {});
      loadApplicants();
    }
  }, [id, fetchJobDetail]);

  const loadApplicants = async () => {
    try {
      setLoadingApplicants(true);
      const data = await fetchJobApplicants(id);
      setApplicants(data || []);
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await updateJobStatus(id, status);
      toast.success(`Job marked as ${STATUS_CONFIG[status]?.label}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleApplicantStatusChange = async (applicationId, newStatus) => {
    try {
      await changeApplicantStatus(applicationId, newStatus);
      toast.success(`Applicant status updated to ${newStatus}`);
      setApplicants((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update applicant status');
    }
  };

  const handleScheduleInterview = async ({ applicationId, scheduledAt, title }) => {
    const interview = await scheduleInterview({ applicationId, scheduledAt, title });
    if (!interview?.data?._id) {
      throw new Error('Interview scheduled but room details missing. Please refresh.');
    }
    // Update application status in local state
    setApplicants((prev) =>
      prev.map((app) => (app._id === applicationId ? { ...app, status: 'interview' } : app))
    );
    // Store interviewId for the Join button
    setInterviewMap((prev) => ({ ...prev, [applicationId]: interview.data._id }));
    toast.success('🎉 Interview scheduled! The candidate can now join.');
  };

  const handleJoinInterviewAsRecruiter = async (applicationId) => {
    // If we already have the interviewId cached, navigate directly
    if (interviewMap[applicationId]) {
      navigate(`/interview/${interviewMap[applicationId]}`);
      return;
    }
    setJoiningInterviewId(applicationId);
    try {
      const interview = await fetchInterviewByApplication(applicationId);
      if (!interview?._id) {
        toast.error('No active interview found. Please schedule one first.');
        return;
      }
      setInterviewMap((prev) => ({ ...prev, [applicationId]: interview._id }));
      navigate(`/interview/${interview._id}`);
    } catch (err) {
      toast.error(err?.message || 'Could not load interview. Try again.');
    } finally {
      setJoiningInterviewId(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${job?.title}"? This cannot be undone.`)) return;
    try {
      await removeJob(id);
      toast.success('Job deleted successfully');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete job');
    }
  };

  if (isLoading && !job) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-red-400">{error || 'Job not found'}</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-sm text-indigo-400 underline hover:no-underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const loc = job.location;
  const locationStr = [loc?.city, loc?.state, loc?.country].filter(Boolean).join(', ');
  const postedDate = new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      {/* Header Card */}
      <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600/15 text-indigo-400">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">{job.title}</h1>
              <p className="text-base text-gray-400">{job.company}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                {locationStr && (
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {locationStr}</span>
                )}
                {loc?.pincode && <span>— {loc.pincode}</span>}
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Posted {postedDate}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 items-center gap-2">
            <StatusDropdown current={job.status} onSelect={handleStatusChange} />
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 rounded-xl border border-gray-800 px-3 py-2 text-sm font-medium text-gray-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 pt-6 mt-6 border-t border-gray-800/80">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'details'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Job Details</span>
          </button>
          <button
            onClick={() => setActiveTab('applicants')}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'applicants'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Applicants</span>
            <span className="ml-1 rounded-full bg-indigo-500/30 px-2 py-0.5 text-xs text-indigo-200">
              {applicants.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'details' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Info sidebar */}
          <div className="space-y-4 lg:col-span-1">
            <InfoCard icon={DollarSign}   label="Salary"       value={job.salary} />
            <InfoCard icon={TrendingUp}   label="Experience"   value={job.experience} />
            <InfoCard icon={Briefcase}    label="Job Type"     value={job.jobType} />
            <InfoCard icon={Layers}       label="Work Mode"    value={job.workmode?.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())} />
            <InfoCard icon={Tag}          label="Category"     value={job.category} />
            {loc?.pincode && (
              <InfoCard icon={MapPin}     label="Pincode"      value={loc.pincode} />
            )}
          </div>

          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description */}
            {job.description && (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-indigo-400">
                  <Briefcase className="h-4 w-4" /> About the Role
                </h3>
                <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">{job.description}</p>
              </div>
            )}

            {/* Skills */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-indigo-400">
                <Tag className="h-4 w-4" /> Skills Required
              </h3>
              <TagList items={job.skillsRequired} />
            </div>

            {/* Lists */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 space-y-6">
              <ListSection icon={ListChecks}    title="Responsibilities"  items={job.responsibilities}  color="text-emerald-400" />
              <ListSection icon={GraduationCap} title="Qualifications"    items={job.qualifications}    color="text-purple-400" />
              <ListSection icon={Gift}          title="Benefits"          items={job.benefits}          color="text-yellow-400" />
            </div>
          </div>
        </div>
      ) : (
        /* Applicants Section */
        <div className="space-y-4">
          {loadingApplicants ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              <p className="text-sm text-gray-400">Loading applied candidates...</p>
            </div>
          ) : applicants.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-12 text-center space-y-3">
              <Users className="mx-auto h-12 w-12 text-gray-600" />
              <h3 className="text-lg font-semibold text-white">No Applicants Yet</h3>
              <p className="text-sm text-gray-400">
                No candidates have applied to this job posting yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map((app) => {
                const candidate = app.candidateId || {};
                const userObj = candidate.userId || {};
                const isAtsExpanded = expandedAtsId === app._id;

                return (
                  <div
                    key={app._id}
                    className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 space-y-4 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Candidate Profile Info */}
                      <div className="flex items-start space-x-3 flex-1">
                        {userObj.image ? (
                          <img
                            src={userObj.image}
                            alt={userObj.fullName}
                            className="h-12 w-12 rounded-full border border-gray-700 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30">
                            {userObj.fullName ? userObj.fullName.charAt(0).toUpperCase() : 'C'}
                          </div>
                        )}
                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-white">
                            {userObj.fullName || 'Anonymous Candidate'}
                          </h4>
                          {candidate.headline && (
                            <p className="text-xs text-indigo-400 font-medium">{candidate.headline}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                            {userObj.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-gray-500" /> {userObj.email}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock className="h-3 w-3" /> Applied {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Badges & Status Selector */}
                      <div className="flex items-center flex-wrap gap-3">
                        {/* ATS Badge */}
                        {typeof app.atsScore === 'number' && (
                          <button
                            onClick={() => setExpandedAtsId(isAtsExpanded ? null : app._id)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition-all ${getATSBadgeStyle(
                              app.atsScore
                            )}`}
                            title="Click for ATS score breakdown"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>{app.atsScore}% ATS Match</span>
                            <ChevronDown className={`h-3 w-3 transition-transform ${isAtsExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}

                        {/* Application Status Selector */}
                        <select
                          value={app.status}
                          onChange={(e) => handleApplicantStatusChange(app._id, e.target.value)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider focus:outline-none capitalize transition-all ${
                            APPLICANT_STATUS_COLORS[app.status] || 'bg-gray-800 text-gray-300 border-gray-700'
                          }`}
                        >
                          <option value="applied" className="bg-gray-900 text-gray-100">applied</option>
                          <option value="screening" className="bg-gray-900 text-gray-100">screening</option>
                          <option value="shortlisted" className="bg-gray-900 text-gray-100">shortlisted</option>
                          <option value="interview" className="bg-gray-900 text-gray-100">interview</option>
                          <option value="selected" className="bg-gray-900 text-gray-100">selected</option>
                          <option value="rejected" className="bg-gray-900 text-gray-100">rejected</option>
                        </select>

                        {/* Resume Link */}
                        {app.resume && (
                          <a
                            href={app.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition-all"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Resume</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}

                        {/* Schedule Interview Button */}
                        {app.status !== 'interview' && app.status !== 'selected' && app.status !== 'rejected' && app.status !== 'withdrawn' && (
                          <button
                            onClick={() => setScheduleTarget(app)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300 hover:bg-violet-500/20 transition-all"
                          >
                            <CalendarPlus className="h-3.5 w-3.5" />
                            <span>Schedule Interview</span>
                          </button>
                        )}

                        {/* Join Interview Button */}
                        {(app.status === 'interview' || interviewMap[app._id]) && (
                          <button
                            onClick={() => handleJoinInterviewAsRecruiter(app._id)}
                            disabled={joiningInterviewId === app._id}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all disabled:opacity-60"
                          >
                            {joiningInterviewId === app._id ? (
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                            ) : (
                              <Video className="h-3.5 w-3.5" />
                            )}
                            <span>Join Interview</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Salary & Notice Period */}
                    {(app.expectedSalary || app.noticePeriod || app.coverLetter) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-800/60 text-xs">
                        {app.expectedSalary && (
                          <div className="text-gray-400">
                            Expected Salary: <span className="font-semibold text-emerald-400">${app.expectedSalary}</span>
                          </div>
                        )}
                        {app.noticePeriod && (
                          <div className="text-gray-400">
                            Notice Period: <span className="font-semibold text-gray-200">{app.noticePeriod} Days</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cover Letter */}
                    {app.coverLetter && (
                      <div className="rounded-xl bg-gray-950/80 p-3 border border-gray-800 text-xs space-y-1">
                        <span className="font-semibold text-gray-400">Cover Letter:</span>
                        <p className="text-gray-300 whitespace-pre-line leading-relaxed">{app.coverLetter}</p>
                      </div>
                    )}

                    {/* Expanded ATS Feedback */}
                    {isAtsExpanded && app.atsFeedback && (
                      <div className="pt-3 border-t border-gray-800/80 bg-gray-950/60 p-4 rounded-xl space-y-3">
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
                                  ✓ {sk}
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
          )}
        </div>
      )}
    </div>

    {/* Schedule Interview Modal */}
    <ScheduleInterviewModal
      isOpen={Boolean(scheduleTarget)}
      application={scheduleTarget}
      onClose={() => setScheduleTarget(null)}
      onScheduled={handleScheduleInterview}
    />
    </>
  );
};

export default JobDetail;
