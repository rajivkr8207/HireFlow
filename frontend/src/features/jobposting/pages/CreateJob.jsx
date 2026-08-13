import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useJobs } from '../hook/useJobs';
import InputField from '../../../components/common/InputField';
import Button from '../../../components/common/Button';
import { ArrowLeft, Plus, X, Briefcase, MapPin, DollarSign, Tag, ListChecks, GraduationCap, Gift } from 'lucide-react';
import { toast } from 'react-toastify';

// Reusable interactive tag input
const TagInput = ({ label, icon: Icon, items, onAdd, onRemove, placeholder }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput('');
    }
  };

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-300">
        <Icon className="h-4 w-4 text-gray-500" />
        {label}
      </label>
      <div className="min-h-[80px] rounded-xl border border-gray-800 bg-gray-900/60 p-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200">
        {/* Tags */}
        <div className="mb-2 flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 px-2.5 py-0.5 text-xs text-indigo-300"
            >
              {item}
              <button type="button" onClick={() => onRemove(i)} className="ml-0.5 text-indigo-400 hover:text-red-400 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        {/* Input row */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Type and press Enter or comma to add'}
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!input.trim()}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const SECTIONS = [
  { key: 'skillsRequired', label: 'Skills Required', icon: Tag, placeholder: 'e.g. React, Node.js, MongoDB' },
  { key: 'responsibilities', label: 'Responsibilities', icon: ListChecks, placeholder: 'e.g. Design and develop REST APIs' },
  { key: 'qualifications', label: 'Qualifications', icon: GraduationCap, placeholder: 'e.g. B.Tech in Computer Science' },
  { key: 'benefits', label: 'Benefits', icon: Gift, placeholder: 'e.g. Health insurance, Remote work' },
];

const initialForm = {
  title: '', description: '', experience: '', company: '',
  city: '', state: '', country: '', pincode: '',
  salary: '', jobType: '', workmode: 'full-time', category: 'IT',
  status: 'open',
  skillsRequired: [], responsibilities: [], qualifications: [], benefits: [],
};

const CreateJob = () => {
  const navigate = useNavigate();
  const { createJob, isLoading } = useJobs();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleTagAdd = (key, value) => {
    setForm((p) => ({ ...p, [key]: [...p[key], value] }));
  };

  const handleTagRemove = (key, index) => {
    setForm((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== index) }));
  };

  const validate = () => {
    const required = ['title', 'description', 'experience', 'company', 'city', 'state', 'country', 'pincode', 'salary', 'jobType'];
    const errs = {};
    required.forEach((field) => {
      if (!form[field]?.trim()) errs[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    });
    ['skillsRequired', 'responsibilities', 'qualifications', 'benefits'].forEach((key) => {
      if (!form[key].length) errs[key] = `At least one ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await createJob(form);
      toast.success('Job posting created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create job');
    }
  };

  const selectCls = 'w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';
  const inputCls = 'bg-red-900/60 border-gray-800 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20';

  const SectionHeader = ({ children }) => (
    <h3 className="mb-4 border-b border-gray-800 pb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
      {children}
    </h3>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>
        <h1 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
          Post a New Job
        </h1>
        <p className="mt-1 text-sm text-gray-500">Fill in the details below to create your job posting</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-sm">
          <SectionHeader><Briefcase className="inline h-4 w-4 mr-1.5" />Basic Information</SectionHeader>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[
              { name: 'title', label: 'Job Title', placeholder: 'e.g. Senior React Developer' },
              { name: 'company', label: 'Company Name', placeholder: 'e.g. HireFlow Inc.' },
              { name: 'experience', label: 'Experience', placeholder: 'e.g. 2-4 years' },
              { name: 'salary', label: 'Salary', placeholder: 'e.g. ₹12-18 LPA' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">{label} <span className="text-red-500">*</span></label>
                <InputField name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} className={inputCls} />
                {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]}</p>}
              </div>
            ))}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Job Type <span className="text-red-500">*</span></label>
              <InputField name="jobType" value={form.jobType} onChange={handleChange} placeholder="e.g. Full Stack, Frontend" className={inputCls} />
              {errors.jobType && <p className="mt-1 text-xs text-red-400">{errors.jobType}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Work Mode</label>
              <select name="workmode" value={form.workmode} onChange={handleChange} className={selectCls}>
                {['full-time', 'part-time', 'contract', 'temporary', 'other'].map((v) => (
                  <option key={v} value={v} className="bg-gray-900">{v.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={selectCls}>
                {['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Other'].map((v) => (
                  <option key={v} value={v} className="bg-gray-900">{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Initial Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={selectCls}>
                {['open', 'hold', 'closed'].map((v) => (
                  <option key={v} value={v} className="bg-gray-900">{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Job Description <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the role, team, and what this person will work on..."
              className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all duration-200 resize-none ${inputCls}`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
          </div>
        </div>

        {/* Location */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-sm">
          <SectionHeader><MapPin className="inline h-4 w-4 mr-1.5" />Location</SectionHeader>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[
              { name: 'city', label: 'City', placeholder: 'e.g. Bangalore' },
              { name: 'state', label: 'State', placeholder: 'e.g. Karnataka' },
              { name: 'country', label: 'Country', placeholder: 'e.g. India' },
              { name: 'pincode', label: 'Pincode', placeholder: 'e.g. 560001' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">{label} <span className="text-red-500">*</span></label>
                <InputField name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} className={inputCls} />
                {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Tags sections */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-sm">
          <SectionHeader>Requirements & Benefits</SectionHeader>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {SECTIONS.map(({ key, label, icon, placeholder }) => (
              <div key={key}>
                <TagInput
                  label={label}
                  icon={icon}
                  items={form[key]}
                  onAdd={(v) => handleTagAdd(key, v)}
                  onRemove={(i) => handleTagRemove(key, i)}
                  placeholder={placeholder}
                />
                {errors[key] && <p className="mt-1 text-xs text-red-400">{errors[key]}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-xl border border-gray-800 px-5 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
          >
            Cancel
          </button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 px-7 py-2.5 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Posting...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" /> Publish Job
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
