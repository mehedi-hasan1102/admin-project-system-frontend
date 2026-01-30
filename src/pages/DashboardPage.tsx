import React from 'react';
import { Layout } from '../components/Layout';
import { useAppSelector } from '../hooks/redux';
import { FiMail, FiShield, FiCheckCircle, FiUsers, FiSend, FiEdit3, FiEye, FiLock } from 'react-icons/fi';

export const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Layout>
      <div className="mb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-lg text-slate-600">Welcome back, <span className="font-semibold text-slate-900">{user?.name}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Role</p>
                <h3 className="text-2xl font-bold text-slate-900">{user?.role}</h3>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-lg">
                <FiShield className="w-6 h-6 text-slate-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              Your current role determines what features you can access.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Email</p>
                <h3 className="text-lg font-bold text-slate-900 truncate">{user?.email}</h3>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-lg">
                <FiMail className="w-6 h-6 text-slate-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              Your registered email address.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Account Status</p>
                <h3 className="text-2xl font-bold text-slate-900">Active</h3>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              Your account is active and ready to use.
            </p>
          </div>
        </div>
      </div>

      {user?.role === 'ADMIN' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Admin Features</h2>
          <div className="bg-linear-to-br from-amber-50 via-orange-50 to-red-50 border border-amber-200 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg shrink-0">
                <FiShield className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Administrative Privileges</h3>
                <p className="text-slate-600">You have full system access to manage users, projects, and configurations.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiUsers className="w-5 h-5 text-amber-600" />
                  <p className="font-semibold text-slate-900">User Management</p>
                </div>
                <p className="text-sm text-slate-600">Manage users and their roles</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiSend className="w-5 h-5 text-amber-600" />
                  <p className="font-semibold text-slate-900">Invitations</p>
                </div>
                <p className="text-sm text-slate-600">Create and send invitations</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiEdit3 className="w-5 h-5 text-amber-600" />
                  <p className="font-semibold text-slate-900">Project Control</p>
                </div>
                <p className="text-sm text-slate-600">Edit and delete projects</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiEye className="w-5 h-5 text-amber-600" />
                  <p className="font-semibold text-slate-900">View All</p>
                </div>
                <p className="text-sm text-slate-600">View all system projects</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiLock className="w-5 h-5 text-amber-600" />
                  <p className="font-semibold text-slate-900">Account Control</p>
                </div>
                <p className="text-sm text-slate-600">Deactivate user accounts</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiShield className="w-5 h-5 text-amber-600" />
                  <p className="font-semibold text-slate-900">Full Access</p>
                </div>
                <p className="text-sm text-slate-600">Complete system control</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role !== 'ADMIN' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Member Features</h2>
          <div className="bg-linear-to-br from-blue-50 via-cyan-50 to-slate-50 border border-blue-200 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg shrink-0">
                <FiCheckCircle className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Team Member Access</h3>
                <p className="text-slate-600">You can collaborate on projects and manage your own content.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiEye className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-slate-900">View Projects</p>
                </div>
                <p className="text-sm text-slate-600">View and manage your projects</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiEdit3 className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-slate-900">Create Projects</p>
                </div>
                <p className="text-sm text-slate-600">Create new projects</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiUsers className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-slate-900">Collaboration</p>
                </div>
                <p className="text-sm text-slate-600">Collaborate with team members</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiCheckCircle className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-slate-900">View Details</p>
                </div>
                <p className="text-sm text-slate-600">View project details</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiEdit3 className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-slate-900">Edit Content</p>
                </div>
                <p className="text-sm text-slate-600">Update project information</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiUsers className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-slate-900">Team Access</p>
                </div>
                <p className="text-sm text-slate-600">Team collaboration tools</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
