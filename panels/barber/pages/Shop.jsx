import React, { useEffect, useState } from 'react';

import { useAsync } from '../components/hooks';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { canManage } from '../data/config';
import { errMsg } from '../services/api';

import {
  getShopProfile,
  updateShopProfile,
  getBranches,
  createBranch,
  updateBranchStatus,
} from '../services/barberService';

import { Pill, State } from '../components/ui';
import './Shop.css';

const SHOP_FIELDS = [
  ['name', 'Shop name', 'Enter your shop name'],
  ['phone', 'Phone number', '+41 ...'],
  ['email', 'Email address', 'hello@yourshop.ch'],
  ['website', 'Website', 'https://yourshop.ch'],
  ['address', 'Street address', 'Street and building number'],
  ['city', 'City', 'Zurich'],
  ['postal_code', 'Postal code', '8001'],
  ['canton', 'Canton', 'Zurich'],
];

const EMPTY_BRANCH = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  canton: '',
};

export default function Shop() {
  const { user } = useAuth();
  const { toast } = useData();

  const {
    data: shop,
    loading: shopLoading,
    error: shopError,
    reload: reloadShop,
  } = useAsync(getShopProfile, []);

  const {
    data: branches,
    loading: branchesLoading,
    error: branchesError,
    reload: reloadBranches,
  } = useAsync(getBranches, []);

  const [shopForm, setShopForm] = useState({});
  const [branchForm, setBranchForm] = useState(EMPTY_BRANCH);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [savingShop, setSavingShop] = useState(false);
  const [savingBranch, setSavingBranch] = useState(false);
  const [updatingBranchId, setUpdatingBranchId] = useState(null);

  const editable = canManage(user.role);

  useEffect(() => {
    if (shop) setShopForm(shop);
  }, [shop]);

  const updateShopField = (key, value) => {
    setShopForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateBranchField = (key, value) => {
    setBranchForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveShop = async (e) => {
    e.preventDefault();
    setSavingShop(true);

    try {
      await updateShopProfile({
        name: shopForm.name,
        description: shopForm.description,
        phone: shopForm.phone,
        email: shopForm.email,
        website: shopForm.website,
        address: shopForm.address,
        city: shopForm.city,
        postalCode: shopForm.postal_code,
        canton: shopForm.canton,
      });

      toast('Shop profile saved successfully');
      reloadShop();
    } catch (error) {
      toast(errMsg(error));
    } finally {
      setSavingShop(false);
    }
  };

  const saveBranch = async (e) => {
    e.preventDefault();

    if (!shop?.id) {
      toast('Shop ID not found. Please reload the page.');
      return;
    }

    if (!branchForm.name.trim()) {
      toast('Please enter a branch name');
      return;
    }

    setSavingBranch(true);

    try {
      await createBranch({
        shopId: shop.id,
        name: branchForm.name.trim(),
        phone: branchForm.phone || null,
        email: branchForm.email || null,
        address: branchForm.address || null,
        city: branchForm.city || null,
        postalCode: branchForm.postalCode || null,
        canton: branchForm.canton || null,
      });

      toast('Branch created successfully');
      setBranchForm(EMPTY_BRANCH);
      setShowBranchForm(false);
      reloadBranches();
    } catch (error) {
      toast(errMsg(error));
    } finally {
      setSavingBranch(false);
    }
  };

  const toggleBranch = async (branch) => {
    const status = branch.status === 'active' ? 'inactive' : 'active';

    setUpdatingBranchId(branch.id);

    try {
      await updateBranchStatus(branch.id, status);
      toast(`Branch ${status} successfully`);
      reloadBranches();
    } catch (error) {
      toast(errMsg(error));
    } finally {
      setUpdatingBranchId(null);
    }
  };

  const activeBranches = (branches || []).filter(
    (branch) => branch.status === 'active'
  ).length;

  return (
    <div className="shop-page">
      <div className="shop-heading">
        <div>
          <span className="shop-eyebrow">BUSINESS MANAGEMENT</span>
          <h2>Shop & Branches</h2>
          <p>Manage your shop information and locations in one place.</p>
        </div>

        {shop && <span className="shop-status"><Pill s={shop.status} /></span>}
      </div>

      {/* Shop profile */}
      <State loading={shopLoading} error={shopError} onRetry={reloadShop}>
        <section className="shop-panel">
          <div className="shop-panel-heading">
            <div className="shop-panel-icon">⌂</div>
            <div>
              <h3>Shop profile</h3>
              <p>Keep your business details up to date.</p>
            </div>
          </div>

          <form onSubmit={saveShop}>
            <div className="shop-form-grid">
              {SHOP_FIELDS.map(([key, label, placeholder]) => (
                <label className="shop-field" key={key}>
                  <span>{label}</span>
                  <input
                    type={key === 'email' ? 'email' : 'text'}
                    disabled={!editable}
                    placeholder={placeholder}
                    value={shopForm[key] ?? ''}
                    onChange={(e) => updateShopField(key, e.target.value)}
                  />
                </label>
              ))}

              <label className="shop-field shop-field-wide">
                <span>About your shop</span>
                <textarea
                  rows={4}
                  disabled={!editable}
                  placeholder="Tell customers about your barbershop..."
                  value={shopForm.description ?? ''}
                  onChange={(e) =>
                    updateShopField('description', e.target.value)
                  }
                />
              </label>
            </div>

            <div className="shop-form-footer">
              <span className="shop-helper">
                {editable
                  ? 'Changes will be saved to your shop profile.'
                  : 'You do not have permission to edit this profile.'}
              </span>

              {editable && (
                <button className="shop-primary-btn" disabled={savingShop}>
                  {savingShop ? 'Saving...' : 'Save changes'}
                  {!savingShop && <span>↗</span>}
                </button>
              )}
            </div>
          </form>
        </section>
      </State>

      {/* Branch overview */}
      <section className="branches-section">
        <div className="branches-heading">
          <div>
            <span className="shop-eyebrow">YOUR LOCATIONS</span>
            <h3>Branches</h3>
            <p>Manage the different locations of your business.</p>
          </div>

          {editable && (
            <button
              className="shop-primary-btn"
              type="button"
              onClick={() => setShowBranchForm((prev) => !prev)}
            >
              <span className="shop-plus">{showBranchForm ? '−' : '+'}</span>
              {showBranchForm ? 'Close form' : 'Add branch'}
            </button>
          )}
        </div>

        <div className="branch-stats">
          <div className="branch-stat-card">
            <span className="branch-stat-icon">⌖</span>
            <div>
              <span>Total locations</span>
              <strong>{(branches || []).length}</strong>
            </div>
          </div>

          <div className="branch-stat-card">
            <span className="branch-stat-icon branch-stat-green">✓</span>
            <div>
              <span>Active branches</span>
              <strong>{activeBranches}</strong>
            </div>
          </div>
        </div>

        {/* Add branch form */}
        {showBranchForm && editable && (
          <form className="shop-panel branch-create-form" onSubmit={saveBranch}>
            <div className="shop-panel-heading">
              <div className="shop-panel-icon">+</div>
              <div>
                <h3>Add a new branch</h3>
                <p>Enter the details for your new location.</p>
              </div>
            </div>

            <div className="shop-form-grid">
              <label className="shop-field">
                <span>Branch name *</span>
                <input
                  required
                  name="name"
                  placeholder="e.g. Zurich Central"
                  value={branchForm.name}
                  onChange={(e) => updateBranchField('name', e.target.value)}
                />
              </label>

              <label className="shop-field">
                <span>Phone number</span>
                <input
                  name="phone"
                  placeholder="+41 ..."
                  value={branchForm.phone}
                  onChange={(e) => updateBranchField('phone', e.target.value)}
                />
              </label>

              <label className="shop-field">
                <span>Email address</span>
                <input
                  type="email"
                  name="email"
                  placeholder="branch@yourshop.ch"
                  value={branchForm.email}
                  onChange={(e) => updateBranchField('email', e.target.value)}
                />
              </label>

              <label className="shop-field">
                <span>Street address</span>
                <input
                  name="address"
                  placeholder="Street and building number"
                  value={branchForm.address}
                  onChange={(e) => updateBranchField('address', e.target.value)}
                />
              </label>

              <label className="shop-field">
                <span>City</span>
                <input
                  name="city"
                  placeholder="Zurich"
                  value={branchForm.city}
                  onChange={(e) => updateBranchField('city', e.target.value)}
                />
              </label>

              <label className="shop-field">
                <span>Postal code</span>
                <input
                  name="postalCode"
                  placeholder="8001"
                  value={branchForm.postalCode}
                  onChange={(e) =>
                    updateBranchField('postalCode', e.target.value)
                  }
                />
              </label>

              <label className="shop-field">
                <span>Canton</span>
                <input
                  name="canton"
                  placeholder="Zurich"
                  value={branchForm.canton}
                  onChange={(e) => updateBranchField('canton', e.target.value)}
                />
              </label>
            </div>

            <div className="shop-form-footer">
              <span className="shop-helper">
                Fields marked * are required.
              </span>

              <button className="shop-primary-btn" disabled={savingBranch}>
                {savingBranch ? 'Creating branch...' : 'Create branch'}
              </button>
            </div>
          </form>
        )}

        {/* Branch list */}
        <State
          loading={branchesLoading}
          error={branchesError}
          onRetry={reloadBranches}
        >
          {(branches || []).length > 0 ? (
            <div className="branch-grid">
              {(branches || []).map((branch) => (
                <article className="branch-card" key={branch.id}>
                  <div className="branch-card-top">
                    <div className="branch-location-icon">⌖</div>
                    <span
                      className={`branch-badge ${
                        branch.status === 'active' ? 'is-active' : 'is-inactive'
                      }`}
                    >
                      <span />
                      {branch.status}
                    </span>
                  </div>

                  <div className="branch-card-title">
                    <h4>{branch.name}</h4>
                    <p>
                      {[branch.city, branch.canton].filter(Boolean).join(', ') ||
                        'Location details not provided'}
                    </p>
                  </div>

                  <div className="branch-card-details">
                    <div>
                      <span className="branch-detail-icon">⌂</span>
                      <span>{branch.address || 'No address added'}</span>
                    </div>

                    <div>
                      <span className="branch-detail-icon">☎</span>
                      <span>{branch.phone || 'No phone added'}</span>
                    </div>

                    <div>
                      <span className="branch-detail-icon">@</span>
                      <span className="branch-email">
                        {branch.email || 'No email added'}
                      </span>
                    </div>
                  </div>

                  {editable && (
                    <div className="branch-card-footer">
                      <span>Branch ID: {branch.id}</span>
                      <button
                        type="button"
                        disabled={updatingBranchId === branch.id}
                        onClick={() => toggleBranch(branch)}
                      >
                        {updatingBranchId === branch.id
                          ? 'Updating...'
                          : branch.status === 'active'
                            ? 'Deactivate'
                            : 'Activate'}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            !branchesLoading &&
            !branchesError && (
              <div className="branch-empty">
                <div className="branch-empty-icon">⌖</div>
                <h4>No branches yet</h4>
                <p>
                  Add your first location to manage multiple shop branches.
                </p>
                {editable && (
                  <button
                    className="shop-primary-btn"
                    type="button"
                    onClick={() => setShowBranchForm(true)}
                  >
                    + Add your first branch
                  </button>
                )}
              </div>
            )
          )}
        </State>
      </section>
    </div>
  );
}