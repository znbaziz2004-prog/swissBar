
import React, { useState } from 'react';
import { useAsync } from '../components/hooks';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { canManage } from '../data/config';
import { errMsg } from '../services/api';
import {
  getStaff,
  createStaff,
  updateStaff,
  updateStaffStatus,
  getBranches,
} from '../services/barberService';
import { Pill, State, ini } from '../components/ui';

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

export default function Staff() {
  const { user } = useAuth();
  const { toast } = useData();

  const { data, loading, error, reload } = useAsync(getStaff, []);
  const { data: branches } = useAsync(getBranches, []);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...initialForm });

  const isEditing = editingId !== null;
  const canEditStaff = canManage(user.role);

  const resetForm = () => {
    setForm({ ...initialForm });
    setEditingId(null);
    setShowForm(false);
  };

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
      resetForm();
      reload();
    } catch (e) {
      toast(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (staff) => {
    setEditingId(staff.id);

    setForm({
      name: staff.user_name || '',
      display_name: staff.display_name || '',
      email: staff.user_email || '',
      phone: staff.user_phone || staff.phone || '',
      password: '',
      role: staff.user_role || 'barber',
      branch_id:
        staff.branch_id != null
          ? String(staff.branch_id)
          : '',
      bio: staff.bio || '',
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Backend currently supports these staff fields.
      // Password is intentionally excluded.
      const payload = {
        name: form.name,
        display_name: form.display_name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        branch_id: form.branch_id
          ? Number(form.branch_id)
          : null,
        bio: form.bio,
      };

      await updateStaff(editingId, payload);

      toast('Staff member updated successfully');
      resetForm();
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

      toast('Staff status updated successfully');
      reload();
    } catch (e) {
      toast(errMsg(e));
    }
  };

  return (
    <div className="staff-page">
      <div className="page-head staff-page-head">
        <div>
          <h2>Staff Members</h2>
          <p className="muted">
            Manage your team, staff details and branch assignments.
          </p>
        </div>

        {canEditStaff && (
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setEditingId(null);
                setForm({ ...initialForm });
                setShowForm(true);
              }
            }}
          >
            {showForm && !isEditing ? 'Cancel' : '+ Add Staff'}
          </button>
        )}
      </div>

      {showForm && canEditStaff && (
        <form
          className="card form-grid staff-form"
          onSubmit={isEditing ? handleUpdate : handleCreate}
        >
          <div className="full staff-form-heading">
            <div>
              <span className="staff-eyebrow">
                TEAM MANAGEMENT
              </span>
              <h3>
                {isEditing
                  ? 'Edit Staff Member'
                  : 'Add New Staff Member'}
              </h3>
              <p className="muted">
                {isEditing
                  ? 'Update the staff member’s information below.'
                  : 'Enter the details to add someone to your team.'}
              </p>
            </div>

            <button
              type="button"
              className="btn ghost"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>
          </div>

          <label>
            Full Name *
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              autoComplete="name"
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
            Email Address *
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="staff@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Phone Number
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              autoComplete="tel"
            />
          </label>

          {!isEditing && (
            <label>
              Password *
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                minLength={8}
                autoComplete="new-password"
                required
              />
            </label>
          )}

          <label>
            Staff Role *
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
              placeholder="Write a short introduction (optional)"
            />
          </label>

          <div className="full staff-form-actions">
            <button
              type="button"
              className="btn ghost"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="btn primary"
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create Staff Member'}
            </button>
          </div>
        </form>
      )}

      <State
        loading={loading}
        error={error}
        onRetry={reload}
      >
        <div className="grid g3 staff-grid">
          {(data || []).map((staff) => (
            <div className="card person staff-card" key={staff.id}>
              <div className="staff-card-top">
                <span className="av">
                  {ini(staff.display_name || staff.user_name)}
                </span>

                <Pill s={staff.status} />
              </div>

              <h3 className="staff-card-name">
                {staff.display_name || staff.user_name}
              </h3>

              <p className="staff-card-role">
                {(staff.user_role || 'staff')
                  .replace('_', ' ')
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </p>

              {staff.branch_name && (
                <p className="staff-card-branch">
                  {staff.branch_name}
                </p>
              )}

              <div className="staff-card-contact">
                <span aria-hidden="true">✉</span>
                <span>{staff.user_email}</span>
              </div>

              {staff.user_phone && (
                <div className="staff-card-contact">
                  <span aria-hidden="true">☎</span>
                  <span>{staff.user_phone}</span>
                </div>
              )}

              {canEditStaff && (
                <div className="staff-card-actions">
                  <button
                    type="button"
                    className="btn ghost sm"
                    onClick={() => handleEdit(staff)}
                  >
                    Edit Details
                  </button>

                  <button
                    type="button"
                    className="btn ghost sm"
                    onClick={() => toggle(staff)}
                  >
                    {staff.status === 'active'
                      ? 'Deactivate'
                      : 'Activate'}
                  </button>
                </div>
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

      <style>{`
        .staff-page {
          width: 100%;
          min-width: 0;
        }

        .staff-page-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .staff-page-head h2 {
          margin: 0 0 7px;
          font-size: clamp(23px, 2vw, 29px);
          font-weight: 750;
          letter-spacing: -0.7px;
        }

        .staff-page-head .muted {
          margin: 0;
          line-height: 1.6;
        }

        .staff-form {
          box-sizing: border-box;
          width: 100%;
          margin-bottom: 28px;
          padding: clamp(18px, 3vw, 30px);
          gap: 20px;
          border: 1px solid #e2eae5;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 8px 28px rgba(23, 73, 58, 0.055);
        }

        .staff-form-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          padding-bottom: 18px;
          border-bottom: 1px solid #eaf0ec;
        }

        .staff-form-heading h3 {
          margin: 7px 0;
          color: #17493a;
          font-size: 21px;
          font-weight: 750;
        }

        .staff-form-heading p {
          margin: 0;
          line-height: 1.5;
        }

        .staff-eyebrow {
          color: #6b907d;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .staff-form label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
          color: #344a3f;
          font-size: 13px;
          font-weight: 650;
        }

        .staff-form input,
        .staff-form select,
        .staff-form textarea {
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
          min-height: 44px;
          padding: 11px 13px;
          border: 1px solid #dce6df;
          border-radius: 10px;
          background: #fbfdfb;
          color: #20372c;
          font: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color 160ms ease, box-shadow 160ms ease,
            background 160ms ease;
        }

        .staff-form textarea {
          min-height: 95px;
          resize: vertical;
        }

        .staff-form input:focus,
        .staff-form select:focus,
        .staff-form textarea:focus {
          border-color: #43876b;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(67, 135, 107, 0.12);
        }

        .staff-form-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
          padding-top: 18px;
          border-top: 1px solid #eaf0ec;
        }

        .staff-grid {
          align-items: stretch;
        }

        .staff-card {
          box-sizing: border-box;
          min-width: 0;
          padding: 22px;
          border: 1px solid #e5ece7;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(23, 73, 58, 0.045);
          transition: transform 180ms ease, box-shadow 180ms ease,
            border-color 180ms ease;
        }

        .staff-card:hover {
          transform: translateY(-3px);
          border-color: #c8ddd0;
          box-shadow: 0 12px 28px rgba(23, 73, 58, 0.09);
        }

        .staff-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .staff-card .av {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          border: 1px solid #dcebe1;
          border-radius: 15px;
          background: #edf5ef;
          color: #17493a;
          font-size: 17px;
          font-weight: 800;
        }

        .staff-card-name {
          margin: 0 0 6px;
          overflow-wrap: anywhere;
          color: #20382d;
          font-size: 17px;
          font-weight: 750;
        }

        .staff-card-role {
          margin: 0 0 5px;
          color: #438064;
          font-size: 13px;
          font-weight: 700;
        }

        .staff-card-branch {
          margin: 0 0 15px;
          color: #74847a;
          font-size: 12px;
        }

        .staff-card-contact {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 10px;
          color: #617168;
          font-size: 12px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .staff-card-contact span:first-child {
          flex-shrink: 0;
          color: #438064;
        }

        .staff-card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #edf1ee;
        }

        .staff-card-actions .btn {
          max-width: 100%;
        }

        @media (max-width: 600px) {
          .staff-page-head {
            align-items: flex-start;
          }

          .staff-form-heading {
            flex-direction: column;
          }

          .staff-form-actions {
            flex-wrap: wrap;
          }

          .staff-form-actions .btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
