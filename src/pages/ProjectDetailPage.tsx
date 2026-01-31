import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProjectById, clearError } from '../store/slices/projectsSlice';
import { Alert, LoadingSpinner } from '../components/common';
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiUser,
  FiTag,
} from 'react-icons/fi';
import { useState } from 'react';

export const ProjectDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projectId } = useParams<{ projectId: string }>();
  type User = {
    id: string;
    name: string;
    // add other user fields if needed
  };

  type Project = {
    id: string;
    name: string;
    description?: string;
    status: string;
    createdBy: string | User;
    createdAt: string;
    teamMembers?: { userId: string | User; role: string }[];
    // add other project fields if needed
  };

  const { selectedProject, isLoading, error } = useAppSelector(
    (state) => state.projects
  ) as {
    selectedProject: Project | null;
    isLoading: boolean;
    error: string | null;
  };
  const { user } = useAppSelector((state) => state.auth);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [projectId, dispatch]);

  const handleDeleteProject = () => {
    if (projectId) {
      setDeletingId(projectId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      case 'ARCHIVED':
        return 'bg-slate-100 text-slate-700';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
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
        <div className="max-w-4xl mx-auto min-h-screen  px-4 py-8 md:px-8 md:py-12">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-6 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-slate-600 text-lg">Project not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen  px-4 py-8 md:px-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-6 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Projects
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <Alert
              message={error}
              type="error"
              onClose={() => dispatch(clearError())}
            />
          )}

          {/* Main Card */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-black text-slate-900 mb-3">
                    {selectedProject.name}
                  </h1>
                  <div className="flex flex-wrap gap-3 items-center">
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                        selectedProject.status
                      )}`}
                    >
                      <FiTag className="w-4 h-4 mr-2" />
                      {selectedProject.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {user?.role === 'ADMIN' && (
                  <div className="flex gap-3 ml-6">
                    <button
                      onClick={() => navigate(`/projects/${selectedProject.id}/edit`)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all"
                      title="Edit project"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteProject}
                      className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-semibold transition-all"
                      title="Delete project"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-8">
              {/* Description */}
              {selectedProject.description && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Description
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-base whitespace-pre-wrap">
                    {selectedProject.description}
                  </p>
                </div>
              )}

              {/* Project Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-200">
                {/* Created By */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <FiUser className="w-5 h-5 text-slate-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Created By</h3>
                  </div>
                  <p className="text-slate-600 ml-11">
                    {typeof selectedProject.createdBy === 'string'
                      ? selectedProject.createdBy
                      : selectedProject.createdBy?.name || 'Unknown'}
                  </p>
                </div>

                {/* Created At */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <FiClock className="w-5 h-5 text-slate-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Created</h3>
                  </div>
                  <p className="text-slate-600 ml-11">
                    {formatDate(selectedProject.createdAt)}
                  </p>
                </div>
              </div>

              {/* Team Members (if any) */}
              {selectedProject.teamMembers && selectedProject.teamMembers.length > 0 && (
                <div className="pt-6 border-t border-slate-200">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Team Members ({selectedProject.teamMembers.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <p className="font-semibold text-slate-900">
                          {typeof member.userId === 'string'
                            ? member.userId
                            : member.userId?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          <span className="inline-flex items-center px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs font-semibold">
                            {member.role}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deletingId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-6 mx-auto">
                <FiTrash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 text-center mb-3">
                Delete Project
              </h3>
              <p className="text-slate-600 text-center mb-8">
                Are you sure you want to delete this project? This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Delete logic would go here
                    setDeletingId(null);
                  }}
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
