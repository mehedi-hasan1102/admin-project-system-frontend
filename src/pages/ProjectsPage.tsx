import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  fetchProjects,
  createProject,
  deleteProject,
  clearError,
} from '../store/slices/projectsSlice';
import { Alert, Button, LoadingSpinner } from '../components/common';
import { FiPlus, FiFolder, FiArrowRight, FiEdit2, FiTrash2, FiAward } from 'react-icons/fi';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects, isLoading, error } = useAppSelector((state) => state.projects);
  const { user } = useAppSelector((state) => state.auth);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Project name is required');
      return;
    }

    dispatch(createProject(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setFormData({ name: '', description: '' });
        setShowCreateForm(false);
      }
    });
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(projectId));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout>
      <div className="mb-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Projects</h1>
            <p className="text-lg text-slate-600">Manage and collaborate on your projects</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showCreateForm
                ? 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <FiPlus className="w-4 h-4" />
            {showCreateForm ? 'Cancel' : 'Create Project'}
          </button>
        </div>

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

        {showCreateForm && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors"
                  placeholder="Enter project description"
                  rows={4}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  <FiPlus className="w-4 h-4" />
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading && !projects.length ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <FiFolder className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg mb-2">No projects yet.</p>
            <p className="text-slate-500">Create a new project to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                    <FiFolder className="w-6 h-6 text-slate-600" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                    <FiAward className="w-3 h-3" />
                    {project.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                  {project.name}
                </h3>
                
                {project.description && (
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}
                
                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-medium transition-colors text-sm"
                    title="View project"
                  >
                    <FiArrowRight className="w-4 h-4" />
                    View
                  </button>
                  {user?.role === 'ADMIN' && (
                    <>
                      <button
                        onClick={() => navigate(`/projects/${project.id}/edit`)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit project"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete project"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
