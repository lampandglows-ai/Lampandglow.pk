import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import classNames from '../utils/classNames.js'

export default function CheckoutPage({ cart, cartTotal, onPlaceOrder }) {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [placedOrderId, setPlacedOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')

  const shipping = cartTotal >= 150 || cartTotal === 0 ? 0 : 12
  const grandTotal = cartTotal + shipping

  const handleSubmit = async () => {
    if (!isLoggedIn()) {
      setError('Please login to place an order.')
      navigate('/login')
      return
    }

    if (cart.length === 0) {
      setError('Your cart is empty.')
      return
    }

    const required = [fullName, phone, addressLine1, city]
    if (required.some((v) => !String(v).trim())) {
      setError('Please fill in required address details.')
      return
    }

    setError('')
    setLoading(true)

    const order = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      note: note.trim(),
      paymentMethod,
      items: cart.map((item) => ({
        id: item.id,
        productId: item.product?.id,
        name: item.product?.name,
        image: item.product?.image,
        quantity: item.quantity,
        unitPrice: item.unitPrice ?? item.product?.price,
        bulbOption: item.bulbOption,
      })),
      subtotal: cartTotal,
      shipping,
      total: grandTotal,
    }

    try {
      const orderId = await onPlaceOrder(order)
      if (orderId) {
        setPlacedOrderId(String(orderId))
      } else {
        setError('Failed to place order. Please try again.')
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (placedOrderId || (placedOrderId === '' && cart.length === 0)) {
    return (
      <section className="w-full px-0 py-10 sm:py-14 bg-[#4C2600]">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#FFDA03]/20 p-6 sm:p-8 bg-[#5c3418]">
            <p className="text-xs font-semibold text-white/80">
              Order placed
            </p>
            <h1 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Thank you for your order
            </h1>
            <p className="mt-3 text-sm text-white/70">
              {placedOrderId ? `Your order id is ${placedOrderId}.` : 'Your order has been created.'}
            </p>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#FFDA03]/20 p-4 bg-[#5c3418]">
                <p className="text-xs font-semibold text-white/80">
                  Payment method
                </p>
                <div className="mt-3 space-y-2 text-sm text-white/70">
                  {paymentMethod === 'cod' ? (
                    <>
                      <p className="font-semibold">Cash on Delivery (COD)</p>
                      <p>Your order will arrive at your address. Please have the exact payment amount ready.</p>
                      <p className="text-xs mt-1 text-amber-400">Note: 50% advance payment required via Bank Deposit. Remaining 50% will be paid on delivery.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">Bank Deposit</p>
                      <p>Please transfer the full amount to our bank account. We will process your order once payment is confirmed.</p>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-[#FFDA03]/20 p-4 bg-[#5c3418]">
                <p className="text-xs font-semibold text-white/80">
                  Order summary
                </p>
                <div className="mt-3 space-y-1 text-xs text-white/70">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-1 border-t border-[#FFDA03]/20 mt-1">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2 text-xs font-semibold text-white hover:bg-amber-700"
              >
                Continue Shopping
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center rounded-full border border-[#FFDA03]/20 px-5 py-2 text-xs font-semibold bg-transparent text-white hover:bg-[#5c3418]/40"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full px-0 py-10 sm:py-14 bg-[#4C2600]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Checkout
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-white/70">
              Enter your delivery address. Payment will be collected on delivery.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-xs font-semibold underline underline-offset-4 text-white/80 hover:text-white"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border p-4 text-xs border-rose-700 bg-rose-950/30 text-rose-200">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 items-start">
          <div className="rounded-2xl border border-[#FFDA03]/20 p-5 sm:p-6 bg-[#5c3418]">
            <p className="text-xs font-semibold text-white/80">
              Shipping details
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-white/80">
                  Full name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#FFDA03]/20 px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-[#4C2600] text-white focus:ring-amber-500 placeholder:text-white/40"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/80">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#FFDA03]/20 px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-[#4C2600] text-white focus:ring-amber-500 placeholder:text-white/40"
                  placeholder="03xx xxxxxxx"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/80">
                  Email (optional)
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#FFDA03]/20 px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-[#4C2600] text-white focus:ring-amber-500 placeholder:text-white/40"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/80">
                  City
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#FFDA03]/20 px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-[#4C2600] text-white focus:ring-amber-500 placeholder:text-white/40"
                  placeholder="Sahiwal"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-white/80">
                  Address line 1
                </label>
                <input
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#FFDA03]/20 px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-[#4C2600] text-white focus:ring-amber-500 placeholder:text-white/40"
                  placeholder="Street, house, area"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-white/80">
                  Address line 2 (optional)
                </label>
                <input
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#FFDA03]/20 px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-[#4C2600] text-white focus:ring-amber-500 placeholder:text-white/40"
                  placeholder="Apartment, floor, landmark"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/80">
                  State (optional)
                </label>
                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#FFDA03]/20 px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-[#4C2600] text-white focus:ring-amber-500 placeholder:text-white/40"
                  placeholder="Punjab"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/80">
                  Postal code (optional)
                </label>
                <input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#FFDA03]/20 px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-[#4C2600] text-white focus:ring-amber-500 placeholder:text-white/40"
                  placeholder="57000"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-white/80">
                  Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-[#FFDA03]/20 px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-[#4C2600] text-white focus:ring-amber-500 placeholder:text-white/40"
                  placeholder="Any delivery instructions"
                />
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-[#FFDA03]/20 p-5 sm:p-6 bg-[#5c3418]">
            <p className="text-xs font-semibold text-white/80">
              Payment method
            </p>

            {/* Payment Method Options */}
            <div className="mt-4 space-y-3">
              {/* Cash on Delivery */}
              <label
                className={classNames(
                  'flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition',
                  paymentMethod === 'cod'
                    ? 'border-amber-500 bg-amber-900/20'
                    : 'border-[#FFDA03]/20 hover:border-[#FFDA03]/30'
                )}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-0.5 accent-amber-600"
                />
                <div className="text-sm">
                  <p className="font-semibold text-white/90">Cash on Delivery (COD)</p>
                  <p className="text-xs mt-0.5 text-white/60">Pay at your doorstep on delivery.</p>
                </div>
              </label>

              {/* Bank Deposit */}
              <label
                className={classNames(
                  'flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition',
                  paymentMethod === 'bank'
                    ? 'border-amber-500 bg-amber-900/20'
                    : 'border-[#FFDA03]/20 hover:border-[#FFDA03]/30'
                )}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-0.5 accent-amber-600"
                />
                <div className="text-sm">
                  <p className="font-semibold text-white/90">Bank Deposit</p>
                  <p className="text-xs mt-0.5 text-white/60">Full payment via bank transfer before dispatch.</p>
                </div>
              </label>
            </div>

            {/* Conditional Bank Details */}
            <div className="mt-4 rounded-xl border border-[#FFDA03]/20 p-4 bg-[#5c3418]">
              <p className="text-xs font-semibold text-white/80">
                Bank Account Details
              </p>
              <div className="mt-2 space-y-1 text-xs text-white/70">
                <p><span className="font-semibold">Bank Name:</span> Bank Alfalah</p>
                <p><span className="font-semibold">Account Title:</span> Lamp & Glow</p>
                <p><span className="font-semibold">Account Number:</span> 0051-1006789012</p>
                <p><span className="font-semibold">IBAN:</span> PK95ALFH000511006789012</p>
              </div>
              {paymentMethod === 'cod' && (
                <div className="mt-3 rounded-lg border p-3 text-xs border-amber-700/50 bg-amber-900/20 text-amber-200">
                  <p className="font-semibold">Advance Payment Required (50%)</p>
                  <p className="mt-1">Please deposit <span className="font-bold">50% ({'Rs.'}{Math.round((cartTotal + shipping) * 0.5).toLocaleString()})</span> of the order total to the above bank account. The remaining <span className="font-bold">50% ({'Rs.'}{Math.round((cartTotal + shipping) * 0.5).toLocaleString()})</span> will be collected as Cash on Delivery when your order arrives.</p>
                </div>
              )}
              {paymentMethod === 'bank' && (
                <p className="mt-3 text-xs text-white/60">
                  Please transfer the full amount <span className="font-semibold">({'Rs.'}{(cartTotal + shipping).toLocaleString()})</span> and share the payment receipt via WhatsApp for faster processing.
                </p>
              )}
            </div>

            <div className="mt-5 rounded-xl border border-[#FFDA03]/20 p-4 bg-[#5c3418]">
              <p className="text-xs font-semibold text-white/80">
                Order summary
              </p>
              <div className="mt-3 space-y-1 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-semibold pt-1 border-t border-[#FFDA03]/20 mt-1">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-amber-600 px-5 py-2 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Order
            </button>

            <button
              type="button"
              onClick={() => navigate('/')} 
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[#FFDA03]/20 px-5 py-2 text-xs font-semibold bg-transparent text-white hover:bg-[#5c3418]/40"
            >
              Continue Shopping
            </button>
          </aside>
        </div>
      </div>
    </section>
  )
}
