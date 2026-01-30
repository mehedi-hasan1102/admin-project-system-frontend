import React from 'react';
import { Layout } from '../components/Layout';
import { useAppSelector } from '../hooks/redux';

export const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600">
          You are logged in as <span className="font-semibold">{user?.role}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">🎯 Role</h2>
          <p className="text-3xl font-bold text-blue-600">{user?.role}</p>
          <p className="text-gray-600 text-sm mt-2">
            Your current role determines what features you can access.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">📧 Email</h2>
          <p className="text-lg text-gray-800">{user?.email}</p>
          <p className="text-gray-600 text-sm mt-2">
            Your registered email address for this account.
          </p>
        </div>
      </div>

      {user?.role === 'ADMIN' && (
        <div className="mt-6 bg-white shadow rounded-lg p-6 border-l-4 border-yellow-400 bg-yellow-50">
          <h2 className="text-lg font-bold text-gray-900 mb-2">👑 Admin Features Available</h2>
          <ul className="text-gray-700 list-disc list-inside space-y-1">
            <li>Manage users and their roles</li>
            <li>Create and send invitations</li>
            <li>Edit and delete projects</li>
            <li>View all system projects</li>
            <li>Deactivate user accounts</li>
          </ul>
        </div>
      )}

      {user?.role !== 'ADMIN' && (
        <div className="mt-6 bg-white shadow rounded-lg p-6 border-l-4 border-blue-400 bg-blue-50">
          <h2 className="text-lg font-bold text-gray-900 mb-2">💼 Member Features Available</h2>
          <ul className="text-gray-700 list-disc list-inside space-y-1">
            <li>View and manage your projects</li>
            <li>Create new projects</li>
            <li>Collaborate with team members</li>
            <li>View project details</li>
          </ul>
        </div>
      )}
    </Layout>
  );
};
