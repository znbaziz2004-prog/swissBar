
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Mail,
  Phone,
  Search,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  Clock3,
  Reply,
  Eye,
  X,
} from 'lucide-react'

import {
  getContactMessages,
  updateContactMessageStatus,
} from '../../services/adminService'

const statusStyles = {
  new: 'bg-amber-50 text-amber-700 ring-amber-200',
  read: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  replied: 'bg-blue-50 text-blue-700 ring-blue-200',
}

const formatDate = (value) => {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return date.toLocaleString()
}

export default function ContactMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadMessages = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getContactMessages()
      setMessages(data)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Could not load contact messages.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase()

    return messages.filter((item) => {
      const matchesStatus =
        filter === 'all' || item.status === filter

      const matchesSearch =
        !query ||
        [item.name, item.email, item.phone, item.message]
          .some((value) =>
            String(value ?? '').toLowerCase().includes(query),
          )

      return matchesStatus && matchesSearch
    })
  }, [messages, search, filter])

  const counts = useMemo(
    () => ({
      total: messages.length,
      new: messages.filter((item) => item.status === 'new').length,
      read: messages.filter((item) => item.status === 'read').length,
      replied: messages.filter((item) => item.status === 'replied').length,
    }),
    [messages],
  )

  const changeStatus = async (item, status) => {
    setUpdatingId(item.id)
    setError('')
    setNotice('')

    try {
      await updateContactMessageStatus(item.id, status)

      const updated = { ...item, status }

      setMessages((current) =>
        current.map((message) =>
          message.id === item.id ? updated : message,
        ),
      )

      setSelected((current) =>
        current?.id === item.id ? updated : current,
      )

      setNotice('Message status updated successfully.')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Could not update message status.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const openMessage = async (item) => {
    setSelected(item)

    if (item.status === 'new') {
      await changeStatus(item, 'read')
    }
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            Customer Support
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Contact Messages
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review customer inquiries and manage their status.
          </p>
        </div>

        <button
          onClick={loadMessages}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {notice && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Messages', value: counts.total, icon: MessageSquare, tone: 'text-slate-700 bg-slate-100' },
          { label: 'New Messages', value: counts.new, icon: Mail, tone: 'text-amber-700 bg-amber-50' },
          { label: 'Read Messages', value: counts.read, icon: Eye, tone: 'text-emerald-700 bg-emerald-50' },
          { label: 'Replied', value: counts.replied, icon: CheckCircle2, tone: 'text-blue-700 bg-blue-50' },
        ].map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <span className={`rounded-xl p-2.5 ${card.tone}`}>
                  <Icon size={19} />
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">
                {card.value}
              </p>
            </div>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Customer Inquiries
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredMessages.length} message(s) found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search messages..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:w-64"
              />
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading contact messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">
              <MessageSquare size={28} />
            </span>
            <h3 className="mt-4 font-semibold text-slate-900">
              No messages found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Contact</th>
                  <th className="px-5 py-4 font-semibold">Message</th>
                  <th className="px-5 py-4 font-semibold">Received</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMessages.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Message #{item.id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <a
                        href={`mailto:${item.email}`}
                        className="flex items-center gap-2 text-slate-600 hover:text-emerald-700"
                      >
                        <Mail size={14} />
                        {item.email}
                      </a>
                      <a
                        href={`tel:${item.phone}`}
                        className="mt-2 flex items-center gap-2 text-slate-500 hover:text-emerald-700"
                      >
                        <Phone size={14} />
                        {item.phone}
                      </a>
                    </td>

                    <td className="max-w-xs px-5 py-4">
                      <p className="line-clamp-2 text-slate-600">
                        {item.message}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {formatDate(item.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
                          statusStyles[item.status] || statusStyles.new
                        }`}
                      >
                        {item.status || 'new'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openMessage(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-message-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Customer Inquiry
                </p>
                <h2 id="contact-message-title" className="mt-2 text-xl font-bold text-slate-900">
                  {selected.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Message #{selected.id} · {formatDate(selected.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close message"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-emerald-300"
                >
                  <Mail className="shrink-0 text-emerald-700" size={18} />
                  <span className="min-w-0">
                    <span className="block text-xs text-slate-400">Email</span>
                    <span className="block break-all text-sm font-medium text-slate-800">
                      {selected.email}
                    </span>
                  </span>
                </a>
                <a
                  href={`tel:${selected.phone}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-emerald-300"
                >
                  <Phone className="shrink-0 text-emerald-700" size={18} />
                  <span>
                    <span className="block text-xs text-slate-400">Phone</span>
                    <span className="block text-sm font-medium text-slate-800">
                      {selected.phone}
                    </span>
                  </span>
                </a>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Message
                </h3>
                <p className="mt-2 whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  {selected.message}
                </p>
              </div>

              <div>
                <label
                  htmlFor="message-status"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Message status
                </label>
                <select
                  id="message-status"
                  value={selected.status || 'new'}
                  disabled={updatingId === selected.id}
                  onChange={(event) =>
                    changeStatus(selected, event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500 disabled:opacity-50"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
                <p className="mt-2 text-xs text-slate-500">
                  Update this status after reviewing or replying to the customer.
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Swiss Barber inquiry #${selected.id}`)}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  <Reply size={16} />
                  Reply by Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
