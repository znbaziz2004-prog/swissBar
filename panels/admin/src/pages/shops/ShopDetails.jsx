
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Ban,
  CalendarDays,
  CheckCircle2,
  Scissors,
  Star,
  Users,
} from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import Notice from '../../components/ui/Notice'
import StatCard from '../../components/ui/StatCard'
import {
  getShop,
  toggleShopFeatured,
  updateShopStatus,
} from '../../services/adminService'
import { getErrorMessage } from '../../services/api'
import { formatCurrency, formatDate } from '../../services/format'

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-[#929c95]">
        {label}
      </p>
      <p className="text-sm text-[#24312b] mt-1 break-words">
        {value || '—'}
      </p>
    </div>
  )
}

export default function ShopDetails() {
  const { id } = useParams()

  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmSuspend, setConfirmSuspend] = useState(false)

  const [showFeaturedModal, setShowFeaturedModal] = useState(false)
  const [featuredPriority, setFeaturedPriority] = useState('')

  const load = useCallback(async () => {
    try {
      setShop(await getShop(id))
      setError('')
    } catch (err) {
      setError(
        getErrorMessage(err, 'Could not load this shop.')
      )
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const changeStatus = async (status) => {
    setBusy(true)
    setError('')
    setSuccess('')

    try {
      await updateShopStatus(id, status)
      setConfirmSuspend(false)

      const messages = {
        active: 'Shop activated.',
        inactive: 'Shop deactivated.',
        suspended: 'Shop suspended.',
      }

      setSuccess(messages[status] || 'Shop status updated.')
      await load()
    } catch (err) {
      setError(
        getErrorMessage(err, 'Could not update shop status.')
      )
    } finally {
      setBusy(false)
    }
  }

  const openFeaturedModal = () => {
    const currentPriority = Number(shop?.featured_priority)

    setFeaturedPriority(
      currentPriority > 0 ? String(currentPriority) : ''
    )
    setError('')
    setSuccess('')
    setShowFeaturedModal(true)
  }

  const handleFeatured = async () => {
    const positionText = featuredPriority.trim()
    const position =
      positionText === '' ? null : Number(positionText)

    if (
      position !== null &&
      (!Number.isSafeInteger(position) || position < 1)
    ) {
      setError('Position must be a positive whole number.')
      return
    }

    setBusy(true)
    setError('')
    setSuccess('')

    try {
      await toggleShopFeatured(id, true, position)

      setShowFeaturedModal(false)
      setSuccess(
        position === null
          ? 'Shop featured without a specific position.'
          : `Shop featured at position #${position}.`
      )

      await load()
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Could not update featured position.'
        )
      )
    } finally {
      setBusy(false)
    }
  }

  const removeFeatured = async () => {
    setBusy(true)
    setError('')
    setSuccess('')

    try {
      await toggleShopFeatured(id, false, null)

      setShowFeaturedModal(false)
      setSuccess('Shop removed from featured.')
      await load()
    } catch (err) {
      setError(
        getErrorMessage(err, 'Could not remove featured status.')
      )
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <Loader label="Loading shop..." />
  }

  if (!shop) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Shop"
          backTo="/admin/shops"
          backLabel="All shops"
        />
        <Notice>{error || 'Shop not found.'}</Notice>
      </div>
    )
  }

  const shopStatus = String(shop.status).toLowerCase()
  const stats = shop.stats || {}

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title={shop.name}
        description={[shop.city, shop.canton].filter(Boolean).join(', ')}
        backTo="/admin/shops"
        backLabel="All shops"
        actions={
          <>
            <Button
              variant="secondary"
              icon={Star}
              onClick={openFeaturedModal}
              disabled={busy}
            >
              {Number(shop.is_featured)
                ? 'Change featured position'
                : 'Make featured'}
            </Button>

            {shopStatus === 'active' && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => changeStatus('inactive')}
                  loading={busy}
                >
                  Deactivate shop
                </Button>

                <Button
                  variant="danger"
                  icon={Ban}
                  onClick={() => setConfirmSuspend(true)}
                  disabled={busy}
                >
                  Suspend shop
                </Button>
              </>
            )}

            {(shopStatus === 'inactive' ||
              shopStatus === 'suspended') && (
              <Button
                icon={CheckCircle2}
                onClick={() => changeStatus('active')}
                loading={busy}
              >
                Activate shop
              </Button>
            )}

            {shopStatus === 'pending' && (
              <div className="flex items-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
                Registration pending approval
              </div>
            )}
          </>
        }
      />

      <Notice>{error}</Notice>
      <Notice type="success">{success}</Notice>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Appointments"
          value={stats.appointments ?? 0}
          subtitle="All time"
          icon={CalendarDays}
          iconClass="bg-[#e3ebe8] text-[#21483a]"
        />

        <StatCard
          title="Customers"
          value={stats.customers ?? 0}
          subtitle="Unique customers"
          icon={Users}
        />

        <StatCard
          title="Staff"
          value={stats.staff ?? 0}
          subtitle="Active barbers"
          icon={Scissors}
          iconClass="bg-[#ece8df] text-[#806d59]"
        />

        <StatCard
          title="Revenue"
          value={formatCurrency(stats.revenue)}
          subtitle="Completed bookings"
          icon={CheckCircle2}
          iconClass="bg-[#e8eee5] text-[#39725a]"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <section className="soft-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold">
              Shop details
            </h2>
            <Badge status={shop.status} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Name" value={shop.name} />
            <Field label="Phone" value={shop.phone} />
            <Field label="Email" value={shop.email} />
            <Field label="Address" value={shop.address} />
            <Field label="Postal code" value={shop.postal_code} />
            <Field label="Canton" value={shop.canton} />
            <Field label="Joined" value={formatDate(shop.created_at)} />
            <Field
              label="Featured"
              value={
                Number(shop.is_featured)
                  ? `Yes${Number(shop.featured_priority) > 0
                    ? ` — Position #${shop.featured_priority}`
                    : ' — No position set'}`
                  : 'No'
              }
            />
          </div>
        </section>

        <section className="soft-card p-6">
          <h2 className="font-display text-xl font-bold mb-5">
            Owner and plan
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Owner" value={shop.owner_name} />
            <Field label="Owner email" value={shop.owner_email} />
            <Field label="Owner phone" value={shop.owner_phone} />
            <Field label="Plan" value={shop.plan_name} />
            <Field label="Subscription" value={shop.subscription_status} />
            <Field
              label="Renews on"
              value={formatDate(shop.subscription_ends_at)}
            />
          </div>
        </section>
      </div>

      <Modal
        open={showFeaturedModal}
        onClose={() => {
          if (!busy) setShowFeaturedModal(false)
        }}
        size="sm"
        title={
          Number(shop.is_featured)
            ? 'Change featured position'
            : 'Feature this shop'
        }
        description="Choose the shop's position in Best in the Region. Leave empty to show it after shops with numbered positions."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setShowFeaturedModal(false)}
              disabled={busy}
            >
              Cancel
            </Button>

            {Number(shop.is_featured) > 0 && (
              <Button
                variant="danger"
                onClick={removeFeatured}
                loading={busy}
              >
                Remove featured
              </Button>
            )}

            <Button onClick={handleFeatured} loading={busy}>
              Save position
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <label
            htmlFor="featuredPriority"
            className="block text-sm font-medium text-[#24312b]"
          >
            Display position
          </label>

          <input
            id="featuredPriority"
            type="number"
            min="1"
            step="1"
            value={featuredPriority}
            onChange={(e) => setFeaturedPriority(e.target.value)}
            placeholder="e.g. 1"
            disabled={busy}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#21483a]"
          />

          <p className="text-xs text-gray-500">
            Position 1 appears first, position 2 second, and so on.
            Leave empty to place this shop after numbered shops.
          </p>
        </div>
      </Modal>

      <Modal
        open={confirmSuspend}
        onClose={() => setConfirmSuspend(false)}
        size="sm"
        title="Suspend this shop?"
        description="The shop will disappear from search and customers will not be able to book until you activate it again."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setConfirmSuspend(false)}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={() => changeStatus('suspended')}
              loading={busy}
            >
              Suspend shop
            </Button>
          </>
        }
      />
    </div>
  )
}
