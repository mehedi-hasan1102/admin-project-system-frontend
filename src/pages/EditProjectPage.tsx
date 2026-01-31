import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  fetchProjectById,
  updateProject,
  clearError,
} from '../store/slices/projectsSlice';
import { Alert, LoadingSpinner } from '../components/common';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

export const EditProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projectId } = useParams<{ projectId: string }>();
  const { selectedProject, isLoading, error } = useAppSelector((state) => state.projects);
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'ACTIVE' });
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (selectedProject) {
      setFormData({
        name: selectedProject.name,
        description: selectedProject.description || '',
        status: selectedProject.status,
      });
    }
  }, [selectedProject]);

  // Only ADMIN can edit
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/projects');
    }
  }, [user, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Project name is required');
      return;
    }

    if (!projectId) {
      setFormError('Project ID not found');
      return;
    }

    setIsSaving(true);
    dispatch(
      updateProject({
        projectId,
        data: formData,
      })
    ).then((result) => {
      setIsSaving(false);
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/projects');
      }
    });
  };

  if (isLoading && !selectedProject) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  if (!selectedProject) {
    return (
      <Layout>
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <p className="text-slate-600 text-lg">Project not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 -mx-4 -my-4 px-4 py-8 md:px-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-6 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Projects
            </button>

            <h1 className="text-5xl font-black text-slate-900">Edit Project</h1>
            <p className="text-lg text-slate-600 mt-3">Update project details</p>
          </div>

          {/* Alerts */}
          {error && (
            <Alert
              message={error}
              type="error"
              onClose={() => dispatch(clearError())}
            />
          )}
          {formError && (
            <Alert
              message={formError}
              type="error"
              onClose={() => setFormError('')}
            />
          )}

          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Project Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                  placeholder="Enter project name"
                  required
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all resize-none"
                  placeholder="Enter project description"
                  rows={5}
                />
              </div>

              {/* Status Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ARCHIVED">Archived</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-8 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSave className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
