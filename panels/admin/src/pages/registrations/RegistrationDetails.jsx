import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import Notice from '../../components/ui/Notice'
import {
  approveRegistration,
  getRegistration,
  getSubscriptionPayments,
  rejectRegistration,
} from '../../services/adminService'
import { getErrorMessage } from '../../services/api'
import { formatDateTime } from '../../services/format'

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-[#929c95]">{label}</p>
      <p className="text-sm text-[#24312b] mt-1 break-words">{value || '—'}</p>
    </div>
  )
}

function formatMoney(amount, currency) {
  if (amount === null || amount === undefined || amount === '') return ''
  const value = Number(amount)
  if (!Number.isFinite(value)) return String(amount)
  try {
    return new Intl.NumberFormat('en-CH', {
      style: 'currency',
      currency: String(currency || 'CHF').toUpperCase(),
    }).format(value)
  } catch {
    return `${currency || 'CHF'} ${value.toFixed(2)}`
  }
}

function formatDay(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function RegistrationDetails() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')


const load = useCallback(async () => {
  try {
    setError('')

    const [registration, payments] = await Promise.all([
      getRegistration(id),
      getSubscriptionPayments(),
    ])

    const subscriptionId = registration?.subscription_id

    const matchingPayments = (Array.isArray(payments) ? payments : [])
      .filter(
        (payment) =>
          Number(payment.subscription_id) === Number(subscriptionId)
      )
      .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))

    const payment =
      matchingPayments.find(
        (p) => String(p.status || '').toLowerCase() === 'paid'
      ) || matchingPayments[0]

    setItem({
      ...registration,

      payment_status:
        payment?.status ?? registration?.payment_status ?? 'unpaid',

      payment_amount:
        payment?.amount ?? registration?.payment_amount ?? null,

      payment_currency:
        payment?.currency ?? registration?.payment_currency ?? null,

      payment_method:
        payment?.payment_method ??
        payment?.method ??
        registration?.payment_method ??
        null,

      payment_paid_at:
        payment?.paid_at ??
        registration?.payment_paid_at ??
        null,

      payment_reference:
        payment?.reference ??
        payment?.transaction_reference ??
        payment?.transaction_id ??
        registration?.payment_reference ??
        null,
    })
  } catch (err) {
    setError(getErrorMessage(err, 'Could not load this registration.'))
  } finally {
    setLoading(false)
  }
}, [id])


  useEffect(() => {
    load()
  }, [load])

  const handleApprove = async () => {
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      await approveRegistration(id)
      setSuccess('Registration approved. The shop owner can now sign in.')
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not approve this registration.'))
    } finally {
      setBusy(false)
    }
  }

  const handleReject = async () => {
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      await rejectRegistration(id, reason.trim())
      setRejectOpen(false)
      setReason('')
      setSuccess('Registration rejected.')
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not reject this registration.'))
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <Loader label="Loading registration..." />

  if (!item) {
    return (
      <div className="space-y-6">
        <PageHeader title="Registration" backTo="/admin/registrations" backLabel="All registrations" />
        <Notice>{error || 'Registration not found.'}</Notice>
      </div>
    )
  }

  const isPending = String(item.status).toLowerCase() === 'pending'
  console.log('Registration payment data:', item)

  // Payment details (returned by the backend with the registration)
 const paymentStatus = String(
  item.payment_status ?? item.paymentStatus ?? ''
).trim().toLowerCase()


  const isPaid = paymentStatus === 'paid'
  const amountText = formatMoney(item.payment_amount, item.payment_currency)
  const interval = String(item.billing_interval || 'monthly').toLowerCase()
  const periodLabel = ['year', 'yearly', 'annual', 'annually'].includes(interval) ? '1 year' : '1 month'
  const periodStart = formatDay(item.subscription_start_date)
  const periodEnd = formatDay(item.subscription_end_date)

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title={item.shop_name || 'Registration'}
        description={`Applied ${formatDateTime(item.created_at)}`}
        backTo="/admin/registrations"
        backLabel="All registrations"
        actions={
          isPending && (
            <>
              <Button variant="secondary" icon={XCircle} onClick={() => setRejectOpen(true)} disabled={busy}>
                Reject
              </Button>
              <Button icon={CheckCircle2} onClick={handleApprove} loading={busy}>
                Approve shop
              </Button>
            </>
          )
        }
      />

      <Notice>{error}</Notice>
      <Notice type="success">{success}</Notice>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <section className="soft-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold">Shop</h2>
            <Badge status={item.status} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Shop name" value={item.shop_name} />
            <Field label="Shop phone" value={item.shop_phone || item.phone} />
            <Field label="Address" value={item.address} />
            <Field label="Postal code" value={item.postal_code} />
            <Field label="City" value={item.city} />
            <Field label="Canton" value={item.canton} />
          </div>
        </section>

        <section className="soft-card p-6">
          <h2 className="font-display text-xl font-bold mb-5">Owner</h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Name" value={item.owner_name} />
            <Field label="Email" value={item.owner_email} />
            <Field label="Phone" value={item.owner_phone} />
            <Field label="Selected plan" value={item.plan_name} />
          </div>
        </section>

        <section className="soft-card p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold">Payment</h2>
            <Badge status={isPaid ? 'paid' : paymentStatus || 'unpaid'} />
          </div>

          <div
            className={`rounded-[14px] px-4 py-3 mb-5 text-sm font-medium ${
              isPaid ? 'bg-[#e6f3ec] text-[#1f5c43]' : 'bg-[#fdf3e1] text-[#8a5a08]'
            }`}
          >
            {isPaid
              ? `Paid for ${periodLabel}${item.plan_name ? ` (${item.plan_name} plan)` : ''}${
                  amountText ? ` - ${amountText}` : ''
                }.`
              : 'No payment received for this registration yet.'}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Field label="Amount paid" value={isPaid ? amountText : ''} />
            <Field label="Payment method" value={item.payment_method ? String(item.payment_method).replace(/^./, (c) => c.toUpperCase()) : ''} />
            <Field label="Paid on" value={item.payment_paid_at ? formatDateTime(item.payment_paid_at) : ''} />
            <Field label="Subscription status" value={item.subscription_status ? String(item.subscription_status).replace(/^./, (c) => c.toUpperCase()) : ''} />
            <Field label="Period" value={periodStart && periodEnd ? `${periodStart} to ${periodEnd}` : periodStart} />
            <Field label="Transaction reference" value={item.payment_reference} />
          </div>
        </section>
      </div>

      {item.rejection_reason && (
        <section className="soft-card p-6">
          <h2 className="font-display text-xl font-bold mb-3">Rejection reason</h2>
          <p className="text-sm text-[#536059] leading-6">{item.rejection_reason}</p>
        </section>
      )}

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject this registration?"
        description="Add a short reason. It helps the applicant understand the decision."
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} loading={busy}>
              Reject registration
            </Button>
          </>
        }
      >
        <label htmlFor="reason" className="block text-xs font-semibold text-[#536059] mb-1.5">
          Reason
        </label>
        <textarea
          id="reason"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="For example: address could not be verified."
          className="w-full rounded-[14px] bg-white border border-black/[0.07] p-3.5 text-sm placeholder:text-[#a2aaa4] focus:outline-none focus:border-[#39725a]/40 focus:ring-4 focus:ring-[#39725a]/10 mb-4"
        />
      </Modal>
    </div>
  )
}