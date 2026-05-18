import { useNavigate } from 'react-router-dom'

export default function OrdersPage({ orders }) {
  const navigate = useNavigate()

  return (
    <section className="w-full px-0 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">My Orders</h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-600">
              Track your orders and view details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-xs font-semibold text-stone-700 underline underline-offset-4 hover:text-stone-900"
          >
            Back
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center text-sm text-stone-600">
            You haven’t placed any orders yet.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Order #{order.id}</p>
                    <p className="mt-1 text-xs text-stone-500">{order.date}</p>
                    {order.city ? (
                      <p className="mt-1 text-xs text-stone-600">{order.city}{order.address ? `, ${order.address}` : ''}</p>
                    ) : null}
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm font-semibold text-amber-700">
                      ${Number(order.total ?? 0).toFixed(2)}
                    </p>
                    {order.status ? (
                      <span className="mt-2 inline-flex rounded-full bg-stone-100 px-2 py-1 text-[11px] font-semibold text-stone-700">
                        {order.status}
                      </span>
                    ) : null}
                  </div>
                </div>

                {Array.isArray(order.items) && order.items.length > 0 ? (
                  <p className="mt-3 text-xs text-stone-600">Items: {order.items.join(', ')}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
