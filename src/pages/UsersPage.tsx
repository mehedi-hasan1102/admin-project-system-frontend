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
import { FiMail, FiUsers, FiSend, FiTrash2, FiEdit2, FiCheckCircle, FiClock } from 'react-icons/fi';

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
      <div className="mb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">User Management</h1>
          <p className="text-lg text-slate-600">Manage team members, roles, and invitations</p>
        </div>

        <div className="flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'text-slate-900 border-slate-900'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <FiUsers className="w-4 h-4" />
              Users ({users.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('invites')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'invites'
                ? 'text-slate-900 border-slate-900'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <FiSend className="w-4 h-4" />
              Invitations ({invites.length})
            </span>
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
          ) : users.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <FiUsers className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No users found.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                        <FiMail className="w-4 h-4 text-slate-400" />
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {editingUserId === user.id ? (
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="STAFF">STAFF</option>
                          </select>
                        ) : (
                          <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          <FiCheckCircle className="w-3 h-3" />
                          {user.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex items-center gap-2">
                        {editingUserId === user.id ? (
                          <Button
                            variant="secondary"
                            onClick={() => setEditingUserId(null)}
                            className="text-xs px-3 py-1"
                          >
                            Cancel
                          </Button>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingUserId(user.id)}
                              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit role"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  user.id,
                                  user.status === 'ACTIVE'
                                    ? 'INACTIVE'
                                    : 'ACTIVE'
                                )
                              }
                              className={`p-2 rounded-lg transition-colors ${
                                user.status === 'ACTIVE'
                                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                  : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                              }`}
                              title={user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
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
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showInviteForm
                  ? 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <FiSend className="w-4 h-4" />
              {showInviteForm ? 'Cancel' : 'Send Invitation'}
            </button>
          </div>

          {showInviteForm && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send New Invitation</h2>
              <form onSubmit={handleCreateInvite} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Role
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="STAFF">STAFF</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
                    <FiSend className="w-4 h-4" />
                    Send Invitation
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {invites.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <FiSend className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No pending invitations.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">
                      Expires
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invites.map((invite) => (
                    <tr key={invite.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 flex items-center gap-2">
                        <FiMail className="w-4 h-4 text-slate-400" />
                        {invite.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
                          {invite.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            invite.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-700'
                              : invite.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {invite.status === 'PENDING' && <FiClock className="w-3 h-3" />}
                          {invite.status === 'ACCEPTED' && <FiCheckCircle className="w-3 h-3" />}
                          {invite.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(invite.expiresAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {invite.status === 'PENDING' && (
                          <button
                            onClick={() => handleRevokeInvite(invite.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Revoke invitation"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
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
