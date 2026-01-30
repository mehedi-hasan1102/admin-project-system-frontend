import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  fetchUsers,
  deactivateUser,
  changeUserRole,
  clearError as clearUsersError,
} from '../store/slices/usersSlice';
import {
  createInvite,
  fetchInvites,
  revokeInvite,
} from '../store/slices/invitesSlice';
import { Alert, Button, LoadingSpinner } from '../components/common';

export const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector((state) => state.users);
  const { invites } = useAppSelector((state) => state.invites);
  const [activeTab, setActiveTab] = useState<'users' | 'invites'>('users');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'STAFF' });
  const [formError, setFormError] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUsers({}));
    dispatch(fetchInvites());
  }, [dispatch]);

  const handleCreateInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    if (!inviteForm.email.trim()) {
      setFormError('Email is required');
      return;
    }

    dispatch(createInvite(inviteForm)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setInviteForm({ email: '', role: 'STAFF' });
        setShowInviteForm(false);
        dispatch(fetchInvites());
      }
    });
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    dispatch(deactivateUser({ userId, status: newStatus }));
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    dispatch(changeUserRole({ userId, role: newRole }));
    setEditingUserId(null);
  };

  const handleRevokeInvite = (inviteId: string) => {
    if (window.confirm('Are you sure you want to revoke this invitation?')) {
      dispatch(revokeInvite(inviteId)).then(() => {
        dispatch(fetchInvites());
      });
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">User Management</h1>

        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('invites')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'invites'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Invitations ({invites.length})
          </button>
        </div>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          onClose={() => dispatch(clearUsersError())}
        />
      )}
      {formError && (
        <Alert
          message={formError}
          type="error"
          onClose={() => setFormError('')}
        />
      )}

      {activeTab === 'users' && (
        <div>
          {isLoading && !users.length ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {editingUserId === user.id ? (
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className="px-2 py-1 border border-gray-300 rounded"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="STAFF">STAFF</option>
                          </select>
                        ) : (
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            user.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        {editingUserId === user.id ? (
                          <Button
                            variant="secondary"
                            onClick={() => setEditingUserId(null)}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="secondary"
                              onClick={() => setEditingUserId(user.id)}
                              className="text-xs"
                            >
                              Edit Role
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() =>
                                handleStatusChange(
                                  user.id,
                                  user.status === 'ACTIVE'
                                    ? 'INACTIVE'
                                    : 'ACTIVE'
                                )
                              }
                              className="text-xs"
                            >
                              {user.status === 'ACTIVE'
                                ? 'Deactivate'
                                : 'Activate'}
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'invites' && (
        <div>
          <div className="mb-6">
            <Button onClick={() => setShowInviteForm(!showInviteForm)}>
              {showInviteForm ? '✕ Cancel' : '+ Send Invitation'}
            </Button>
          </div>

          {showInviteForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Send New Invitation</h2>
              <form onSubmit={handleCreateInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="STAFF">STAFF</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" isLoading={isLoading}>
                    Send Invitation
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowInviteForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {invites.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg">No pending invitations.</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Expires
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invites.map((invite) => (
                    <tr key={invite.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {invite.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          {invite.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            invite.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : invite.status === 'ACCEPTED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {invite.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(invite.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {invite.status === 'PENDING' && (
                          <Button
                            variant="danger"
                            onClick={() => handleRevokeInvite(invite.id)}
                            className="text-xs"
                          >
                            Revoke
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};
