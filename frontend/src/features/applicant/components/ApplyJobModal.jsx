import { useState } from 'react';
import { X, Send, FileText, DollarSign, Clock, Briefcase, Upload, Link as LinkIcon, Sparkles } from 'lucide-react';
import InputField from '../../../components/common/InputField';

const ApplyJobModal = ({ job, isOpen, onClose, onSubmit, isLoading }) => {
  const [uploadType, setUploadType] = useState('file'); // 'file' | 'url'
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !job) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setResumeFile(file);
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uploadType === 'file' && !resumeFile) {
      setError('Please select a resume file (PDF or DOCX)');
      return;
    }
    if (uploadType === 'url' && !resumeUrl.trim()) {
      setError('Please enter a valid resume URL');
      return;
    }

    const formData = new FormData();
    formData.append('jobId', job._id);

    if (uploadType === 'file' && resumeFile) {
      formData.append('resume', resumeFile);
    } else {
      formData.append('resume', resumeUrl.trim());
    }

    if (coverLetter.trim()) formData.append('coverLetter', coverLetter.trim());
    if (expectedSalary) formData.append('expectedSalary', expectedSalary);
    if (noticePeriod) formData.append('noticePeriod', noticePeriod);

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-gray-900/50">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Apply for Role</h3>
              <p className="text-xs text-gray-400">
                {job.title} &bull; <span className="text-indigo-400 font-medium">{job.company}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Toggle File Upload vs URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Resume Document *</label>
            <div className="flex items-center rounded-xl border border-gray-800 bg-gray-950 p-1 mb-3">
              <button
                type="button"
                onClick={() => {
                  setUploadType('file');
                  setError('');
                }}
                className={`flex-1 flex items-center justify-center space-x-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                  uploadType === 'file'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload PDF / File</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadType('url');
                  setError('');
                }}
                className={`flex-1 flex items-center justify-center space-x-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                  uploadType === 'url'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <LinkIcon className="h-3.5 w-3.5" />
                <span>Paste Resume URL</span>
              </button>
            </div>

            {uploadType === 'file' ? (
              <div className="relative border-2 border-dashed border-gray-800 hover:border-indigo-500/50 rounded-xl p-6 text-center bg-gray-950/60 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto h-8 w-8 text-indigo-400 mb-2" />
                {resumeFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-indigo-300 truncate">{resumeFile.name}</p>
                    <p className="text-xs text-gray-400">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-200">Click or drag & drop resume PDF</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB (Stored securely on ImageKit CDN)</p>
                  </div>
                )}
              </div>
            ) : (
              <InputField
                label="Resume Link (URL)"
                name="resumeUrl"
                type="url"
                placeholder="https://example.com/my-resume.pdf"
                value={resumeUrl}
                onChange={(e) => {
                  setResumeUrl(e.target.value);
                  setError('');
                }}
                icon={FileText}
              />
            )}
            {error && <p className="text-xs font-medium text-red-400 mt-1.5">{error}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Expected Salary ($ / yr)"
              name="expectedSalary"
              type="number"
              placeholder="e.g. 95000"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              icon={DollarSign}
            />

            <InputField
              label="Notice Period (Days)"
              name="noticePeriod"
              type="number"
              placeholder="e.g. 30"
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              icon={Clock}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Cover Letter <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Briefly state why you're a fit for this position..."
              className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          {/* ATS Info Notice */}
          <div className="flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-3 text-xs text-indigo-300">
            <Sparkles className="h-4 w-4 shrink-0 text-indigo-400" />
            <span>Smart ATS Scanner will analyze your resume match score immediately upon submission!</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Processing ATS & Uploading...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;
