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
import { Alert, LoadingSpinner } from '../components/common';
import { FiPlus, FiFolder, FiArrowRight, FiEdit2, FiTrash2, FiClock, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ITEMS_PER_PAGE = 6;

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects, isLoading, error } = useAppSelector((state) => state.projects);
  const { user } = useAppSelector((state) => state.auth);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

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
    setDeletingId(projectId);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      dispatch(deleteProject(deletingId));
      setDeletingId(null);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Filter and search logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Layout>
      <div className="min-h-screen  px-4 py-8 md:px-8 md:py-12">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-black text-slate-900 mb-3">Projects</h1>
              <p className="text-lg text-slate-600">
                {projects.length > 0
                  ? `${projects.length} active ${projects.length === 1 ? 'project' : 'projects'}`
                  : 'Create your first project to get started'}
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                showCreateForm
                  ? 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                  : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
              }`}
            >
              <FiPlus className="w-5 h-5" />
              {showCreateForm ? 'Cancel' : 'Create Project'}
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="max-w-7xl mx-auto mb-8 space-y-4">
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
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="max-w-7xl mx-auto mb-12">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Create New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                    placeholder="My Awesome Project"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all resize-none"
                    placeholder="Add a brief description of your project..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiPlus className="w-4 h-4" />
                    Create Project
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setFormError('');
                    }}
                    className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search & Filters Bar */}
        {projects.length > 0 && (
          <div className="max-w-7xl mx-auto mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search projects by name or description..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                  />
                </div>

                {/* Filter by Status */}
                <div className="flex items-center gap-2">
                  <FiFilter className="text-slate-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ARCHIVED">Archived</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>
              </div>

              {/* Filter Results Info */}
              {(searchTerm || statusFilter !== 'ALL') && (
                <div className="mt-4 flex items-center justify-between text-sm">
                  <p className="text-slate-600">
                    Found <span className="font-semibold text-slate-900">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? 's' : ''} 
                    {searchTerm && ` matching "${searchTerm}"`}
                    {statusFilter !== 'ALL' && ` with status ${statusFilter}`}
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('ALL');
                    }}
                    className="text-slate-600 hover:text-slate-900 underline transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto">
          {isLoading && !projects.length ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-xl mb-6">
                <FiFolder className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No projects yet</h3>
              <p className="text-slate-600 mb-8">Create your first project to get started collaborating</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all"
              >
                <FiPlus className="w-4 h-4" />
                Create Project
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-xl mb-6">
                <FiSearch className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No matching projects</h3>
              <p className="text-slate-600 mb-8">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-100 rounded-xl group-hover:from-slate-300 group-hover:to-slate-200 transition-all">
                        <FiFolder className="w-6 h-6 text-slate-600" />
                      </div>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        project.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : project.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-700'
                          : project.status === 'ARCHIVED'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700 transition-colors">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                      <FiClock className="w-3 h-3" />
                      {formatDate(project.createdAt)}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-semibold transition-all duration-200 text-sm"
                        title="View project"
                      >
                        <FiArrowRight className="w-4 h-4" />
                        View
                      </button>
                      {user?.role === 'ADMIN' && (
                        <>
                          <button
                            onClick={() => navigate(`/projects/${project.id}/edit`)}
                            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-105"
                            title="Edit project"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                            title="Delete project"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to{' '}
                    <span className="font-semibold text-slate-900">
                      {Math.min(startIndex + ITEMS_PER_PAGE, filteredProjects.length)}
                    </span>{' '}
                    of <span className="font-semibold text-slate-900">{filteredProjects.length}</span> projects
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                            currentPage === page
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deletingId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-6 mx-auto">
                <FiTrash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 text-center mb-3">
                Delete Project
              </h3>
              <p className="text-slate-600 text-center mb-8">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
