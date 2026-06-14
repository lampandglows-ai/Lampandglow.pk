import { useNavigate } from 'react-router-dom'

export default function CartPage({
  cart,
  cartItemsCount,
  cartTotal,
  handleRemoveFromCart,
  handleUpdateCartQuantity,
  onCheckout,
}) {
  const navigate = useNavigate()

  const formatPrice = (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return ''
    return new Intl.NumberFormat('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <section className="min-h-screen bg-[#4C2600] bg-[radial-gradient(circle_at_top_left,rgba(255,218,3,0.18),transparent_34%),linear-gradient(180deg,#4C2600_0%,#2b1500_52%,#4C2600_100%)] px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#FFDA03]">Your Cart</h1>
            <p className="mt-1 text-xs sm:text-sm text-yellow-100/85">
              Review your selected items, adjust quantities, and proceed to checkout.
            </p>
          </div>
          <p className="text-xs sm:text-sm text-yellow-100/85">
            {cartItemsCount === 0
              ? 'Your cart is empty.'
              : `${cartItemsCount} item${cartItemsCount > 1 ? 's' : ''} in cart`}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#FFDA03]/30 bg-[#4C2600]/50 p-6 text-center text-sm text-yellow-100/85">
            <p>Your cart is empty. Start by adding a lamp, table, or decor piece.</p>
            <div className="mt-4 flex justify-center gap-3 text-xs">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center rounded-full bg-[#FFDA03] px-4 py-2 text-xs font-semibold text-[#4C2600] hover:bg-yellow-300"
              >
                Browse Products
              </button>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center rounded-full border border-[#FFDA03]/30 bg-[#FFDA03]/10 px-4 py-2 text-xs font-medium text-[#FFDA03] hover:bg-[#FFDA03]/20"
              >
                View Categories
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 items-start">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-[#FFDA03]/30 bg-[#4C2600]/50 p-3 sm:p-4"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1 text-xs sm:text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#FFDA03]">
                          {item.product.category}
                        </p>
                        <h2 className="text-sm font-semibold text-white">{item.product.name}</h2>
                        {item.bulbOption && (
                          <p className="text-[11px] text-yellow-100/85">{item.bulbOption}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-[11px] text-yellow-100/85 hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-yellow-100/85">Rs.{formatPrice(item.unitPrice ?? item.product.price)} each</p>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-[11px] text-yellow-100/85" htmlFor={`qty-${item.product.id}`}>
                        Qty
                      </label>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateCartQuantity(item.id, Number(e.target.value) || 1)
                        }
                        className="w-16 rounded-full border border-[#FFDA03]/30 bg-[#FFDA03]/10 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FFDA03]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-2xl border border-[#FFDA03]/30 bg-[#FFDA03]/10 p-4 flex flex-col gap-3 text-sm">
              <h2 className="text-sm font-semibold text-[#FFDA03]">Order Summary</h2>
              <div className="space-y-1 text-xs text-yellow-100/85">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs.{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated shipping</span>
                  <span>{cartTotal >= 5000 ? 'Free' : 'Rs.200'}</span>
                </div>
                <div className="flex justify-between font-semibold pt-1 border-t border-[#FFDA03]/30 mt-1 text-[#FFDA03]">
                  <span>Total</span>
                  <span>
                    Rs.{formatPrice(cartTotal + (cartTotal >= 5000 || cartTotal === 0 ? 0 : 200))}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onCheckout?.()}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#FFDA03] px-4 py-2 text-xs font-semibold text-[#4C2600] hover:bg-yellow-300"
              >
                Checkout
              </button>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center rounded-full border border-[#FFDA03]/30 bg-[#FFDA03]/10 px-4 py-2 text-xs font-medium text-[#FFDA03] hover:bg-[#FFDA03]/20"
              >
                Continue Shopping
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}
