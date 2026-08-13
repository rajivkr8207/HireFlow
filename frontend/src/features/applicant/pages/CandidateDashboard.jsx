import { useEffect, useState } from 'react';
import { useApplicant } from '../hook/useApplicant';
import { useAuth } from '../../auth/hook/useAuth';
import JobDetailsModal from '../components/JobDetailsModal';
import ApplyJobModal from '../components/ApplyJobModal';
import MyApplicationsList from '../components/MyApplicationsList';
import {
  Briefcase,
  Search,
  Filter,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  Eye,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';

const CATEGORIES = ['All', 'IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Other'];
const WORKMODES = ['All', 'full-time', 'part-time', 'contract', 'temporary', 'other'];

const CandidateDashboard = () => {
  const { user } = useAuth();
  const {
    jobs,
    pagination,
    myApplications,
    isLoading,
    fetchJobs,
    fetchMyApplications,
    applyJob,
    withdrawApp,
    getApplicationForJob,
  } = useApplicant();

  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'applications'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWorkmode, setSelectedWorkmode] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [detailJob, setDetailJob] = useState(null);
  const [applyJobTarget, setApplyJobTarget] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  // Initial fetch of jobs & applications
  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 9,
    };
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (selectedWorkmode !== 'All') params.workmode = selectedWorkmode;

    fetchJobs(params);
  }, [fetchJobs, currentPage, selectedCategory, selectedWorkmode]);

  // Client-side search filtering on title/company
  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.title?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.skillsRequired?.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleApplySubmit = async (applicationData) => {
    try {
      setIsApplying(true);
      await applyJob(applicationData);
      toast.success('?? Application submitted successfully!');
      setApplyJobTarget(null);
      // Refresh my applications
      fetchMyApplications();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  const activeApplicationsCount = myApplications.filter((a) => a.status !== 'withdrawn').length;

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-gray-800/80 bg-gradient-to-b from-indigo-950/40 via-gray-950 to-gray-950 px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Candidate Portal</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Find Your Next Career Opportunity
              </h1>
              <p className="text-sm text-gray-400 max-w-xl">
                Welcome back, <span className="text-indigo-400 font-semibold">{user?.fullName || 'Candidate'}</span>! Discover top job openings, submit applications, and track your progress.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 rounded-2xl border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-md">
              <div className="text-center px-2">
                <span className="text-2xl font-bold text-white">{pagination?.total || jobs.length}</span>
                <p className="text-xs font-medium text-gray-400">Open Jobs</p>
              </div>
              <div className="border-x border-gray-800 text-center px-2">
                <span className="text-2xl font-bold text-indigo-400">{myApplications.length}</span>
                <p className="text-xs font-medium text-gray-400">Total Applied</p>
              </div>
              <div className="text-center px-2">
                <span className="text-2xl font-bold text-emerald-400">{activeApplicationsCount}</span>
                <p className="text-xs font-medium text-gray-400">Active Apps</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 pt-8 border-t border-gray-800/60 mt-8">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'explore'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Explore Jobs</span>
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'applications'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <FileCheck className="h-4 w-4" />
              <span>My Applications</span>
              {myApplications.length > 0 && (
                <span className="ml-1 rounded-full bg-indigo-500/30 px-2 py-0.5 text-xs text-indigo-300">
                  {myApplications.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {activeTab === 'explore' ? (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4 space-y-4 backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search Input */}
                <div className="relative md:col-span-6">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by job title, company, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                {/* Category Selector */}
                <div className="md:col-span-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Workmode Selector */}
                <div className="md:col-span-3">
                  <select
                    value={selectedWorkmode}
                    onChange={(e) => {
                      setSelectedWorkmode(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all capitalize"
                  >
                    <option value="All">All Workmodes</option>
                    {WORKMODES.filter((w) => w !== 'All').map((wm) => (
                      <option key={wm} value={wm} className="capitalize">
                        {wm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Jobs List Grid */}
            {isLoading && filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                <p className="text-sm text-gray-400">Loading latest job postings...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-12 text-center space-y-3">
                <Building2 className="mx-auto h-12 w-12 text-gray-600" />
                <h3 className="text-lg font-semibold text-white">No Jobs Found</h3>
                <p className="text-sm text-gray-400">
                  No open postings match your filter criteria. Try clearing search or changing filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => {
                  const existingApp = getApplicationForJob(job._id);
                  const isApplied = Boolean(existingApp);

                  const locationText = typeof job.location === 'object'
                    ? [job.location?.city, job.location?.state].filter(Boolean).join(', ')
                    : job.location || 'Remote';

                  return (
                    <div
                      key={job._id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-gray-800 bg-gray-900/60 hover:border-indigo-500/50 hover:bg-gray-900 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 p-6"
                    >
                      <div className="space-y-4">
                        {/* Header Badge & Title */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-800 border border-gray-700/60 text-gray-300 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                            <Building2 className="h-5 w-5" />
                          </div>
                          {isApplied ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Applied
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                              {job.category || 'Job'}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {job.title}
                          </h3>
                          <p className="text-xs font-medium text-gray-400">{job.company}</p>
                        </div>

                        {/* Location / Workmode / Salary */}
                        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1 rounded-lg bg-gray-950 px-2.5 py-1 border border-gray-800">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            {locationText}
                          </span>
                          <span className="flex items-center gap-1 rounded-lg bg-gray-950 px-2.5 py-1 border border-gray-800 capitalize">
                            <Clock className="h-3 w-3 text-gray-500" />
                            {job.workmode || job.jobType}
                          </span>
                          {job.salary && (
                            <span className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20 text-emerald-400 font-semibold">
                              <DollarSign className="h-3 w-3" />
                              {job.salary}
                            </span>
                          )}
                        </div>

                        {/* Description snippet */}
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>

                        {/* Skills */}
                        {job.skillsRequired && job.skillsRequired.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {job.skillsRequired.slice(0, 3).map((skill, i) => (
                              <span
                                key={i}
                                className="rounded-md bg-gray-800/80 px-2 py-0.5 text-[11px] text-gray-300"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skillsRequired.length > 3 && (
                              <span className="rounded-md bg-gray-800/50 px-2 py-0.5 text-[11px] text-gray-500">
                                +{job.skillsRequired.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center space-x-2 pt-6 mt-4 border-t border-gray-800/80">
                        <button
                          onClick={() => setDetailJob(job)}
                          className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Details</span>
                        </button>

                        {isApplied ? (
                          <button
                            disabled
                            className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 opacity-90 cursor-not-allowed"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Applied</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setApplyJobTarget(job)}
                            className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>Apply</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-400">
                  Showing page <span className="font-semibold text-white">{pagination.page}</span> of{' '}
                  <span className="font-semibold text-white">{pagination.totalPages}</span> ({pagination.total} total jobs)
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="inline-flex items-center space-x-1 rounded-xl border border-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Prev</span>
                  </button>
                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="inline-flex items-center space-x-1 rounded-xl border border-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* My Applications Tab */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Your Submitted Applications</h2>
                <p className="text-xs text-gray-400">Track application status and manage active job submissions.</p>
              </div>
            </div>

            <MyApplicationsList
              applications={myApplications}
              onWithdraw={withdrawApp}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <JobDetailsModal
        job={detailJob}
        isOpen={Boolean(detailJob)}
        onClose={() => setDetailJob(null)}
        onApply={(job) => setApplyJobTarget(job)}
        isApplied={detailJob ? Boolean(getApplicationForJob(detailJob._id)) : false}
        applicationStatus={detailJob ? getApplicationForJob(detailJob._id)?.status : null}
      />

      <ApplyJobModal
        job={applyJobTarget}
        isOpen={Boolean(applyJobTarget)}
        onClose={() => setApplyJobTarget(null)}
        onSubmit={handleApplySubmit}
        isLoading={isApplying}
      />
    </div>
  );
};

export default CandidateDashboard;
