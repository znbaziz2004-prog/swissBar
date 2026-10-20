import React, { useState } from 'react';
import { useAsync } from '../components/hooks';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { canManage } from '../data/config';
import { errMsg } from '../services/api';
import {
  getStaff,
  createStaff,
  updateStaffStatus,
  getBranches,
} from '../services/barberService';
import { Pill, State, ini } from '../components/ui';

export default function Staff() {
  const { user } = useAuth();
  const { toast } = useData();

  const {
    data,
    loading,
    error,
    reload,
  } = useAsync(getStaff, []);

  const { data: branches } = useAsync(getBranches, []);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    name: '',
    display_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'barber',
    branch_id: '',
    bio: '',
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        branch_id: form.branch_id
          ? Number(form.branch_id)
          : null,
      };

      await createStaff(payload);

      toast('Staff member created successfully');

      setForm(initialForm);
      setShowForm(false);
      reload();
    } catch (e) {
      toast(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (staff) => {
    try {
      const newStatus =
        staff.status === 'active' ? 'inactive' : 'active';

      await updateStaffStatus(staff.id, newStatus);

      toast('Staff updated');
      reload();
    } catch (e) {
      toast(errMsg(e));
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Staff Members</h2>
          <p className="muted">
            Manage your barbers and team members.
          </p>
        </div>

        {canManage(user.role) && (
          <button
            className="btn primary"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? 'Cancel' : '+ Add Staff'}
          </button>
        )}
      </div>

      {showForm && canManage(user.role) && (
        <form className="card form-grid" onSubmit={handleCreate}>
          <h3 className="full">Add New Staff Member</h3>

          <label>
            Full Name *
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Display Name
            <input
              name="display_name"
              value={form.display_name}
              onChange={handleChange}
              placeholder="Name shown in bookings"
            />
          </label>

          <label>
            Email *
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Password *
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </label>

          <label>
            Role *
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="barber">Barber</option>
              <option value="receptionist">Receptionist</option>
              <option value="manager">Manager</option>
            </select>
          </label>

          <label>
            Branch
            <select
              name="branch_id"
              value={form.branch_id}
              onChange={handleChange}
            >
              <option value="">No branch selected</option>

              {(branches || []).map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name ||
                    branch.branch_name ||
                    `Branch ${branch.id}`}
                </option>
              ))}
            </select>
          </label>

          <label className="full">
            Bio
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Short staff introduction (optional)"
            />
          </label>

          <div className="full">
            <button
              className="btn primary"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Creating...' : 'Create Staff Member'}
            </button>
          </div>
        </form>
      )}

      <State
        loading={loading}
        error={error}
        onRetry={reload}
      >
        <div className="grid g3">
          {(data || []).map((staff) => (
            <div className="card person" key={staff.id}>
              <span className="av">
                {ini(staff.display_name || staff.user_name)}
              </span>

              <b>
                {staff.display_name || staff.user_name}
              </b>

              <br />

              <small style={{ textTransform: 'capitalize' }}>
                {staff.user_role}
                {staff.branch_name
                  ? ` · ${staff.branch_name}`
                  : ''}
              </small>

              <p style={{ margin: '12px 0' }}>
                <Pill s={staff.status} />
              </p>

              <small>{staff.user_email}</small>

              {canManage(user.role) && (
                <p style={{ marginTop: 12 }}>
                  <button
                    className="btn ghost sm"
                    onClick={() => toggle(staff)}
                  >
                    {staff.status === 'active'
                      ? 'Deactivate'
                      : 'Activate'}
                  </button>
                </p>
              )}
            </div>
          ))}
        </div>

        {!loading &&
          !error &&
          (data || []).length === 0 && (
            <div className="card empty">
              No staff members found. Click Add Staff to create one.
            </div>
          )}
      </State>
    </div>
  );
}