'use client';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleQuantityChange = (productId: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, size, newQuantity);
  };

  const handleRemoveItem = (productId: string, size: string) => {
    removeFromCart(productId, size);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    router.push('/checkout');
  };

  const subtotal = cart.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal > 200 ? 0 : 30;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-cairo">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4 font-cairo">
            سلة التسوق فارغة
          </h2>
          <p className="text-text-secondary mb-8 font-cairo">
            لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
          </p>
          <Link href="/products" className="btn-primary font-cairo">
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              سلة التسوق
            </h1>
            <p className="text-xl text-text-secondary">
              راجع منتجاتك قبل إتمام الطلب
            </p>
          </div>
        </div>
      </div>

      <div className="container-responsive section-padding">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-2xl font-bold text-text-primary mb-6 font-cairo">
                المنتجات ({cart.length})
              </h2>
              
              <div className="space-y-6">
                {cart.map((item, index) => (
                  <div key={`${item.product?.id}-${item.size}-${index}`} className="flex gap-4 p-4 border border-gray-200 rounded-xl">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.product?.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name_ar || item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary mb-2 font-cairo">
                        {item.product?.name_ar || item.product?.name}
                      </h3>
                      <p className="text-sm text-text-secondary mb-2 font-cairo">
                        المقاس: {item.size}
                      </p>
                      {item.product?.color && (
                        <p className="text-sm text-text-secondary mb-2 font-cairo">
                          اللون: {item.product.color}
                        </p>
                      )}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.product?.id || '', item.size, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors font-cairo"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-x border-gray-300 font-cairo">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product?.id || '', item.size, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors font-cairo"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.product?.id || '', item.size)}
                          className="text-error hover:text-error-dark text-sm font-cairo"
                        >
                          إزالة
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-lg text-text-primary font-cairo">
                        {(item.product?.price || 0) * item.quantity} ريال
                      </p>
                      {item.product?.originalPrice && item.product.originalPrice > (item.product?.price || 0) && (
                        <p className="text-sm text-text-secondary line-through font-cairo">
                          {item.product.originalPrice * item.quantity} ريال
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    cart.forEach(item => removeFromCart(item.product_id, item.size));
                  }}
                  className="btn-ghost font-cairo"
                >
                  إفراغ السلة
                </button>
                <Link href="/products" className="btn-outline font-cairo">
                  متابعة التسوق
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-text-primary mb-6 font-cairo">
                ملخص الطلب
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-text-secondary font-cairo">المجموع الفرعي:</span>
                  <span className="font-semibold font-cairo">{subtotal} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary font-cairo">الشحن:</span>
                  <span className="font-semibold font-cairo">
                    {shipping === 0 ? 'مجاني' : `${shipping} ريال`}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="text-sm text-success font-cairo">
                    أضف {(200 - subtotal).toFixed(0)} ريال أخرى للحصول على شحن مجاني
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-text-primary font-cairo">الإجمالي:</span>
                    <span className="text-lg font-bold text-text-primary font-cairo">{total} ريال</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className="btn-primary w-full text-lg py-4 font-cairo disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري التحميل...' : 'إتمام الطلب'}
              </button>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2 font-cairo">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  شحن مجاني للطلبات فوق 200 ريال
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2 font-cairo">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  إرجاع مجاني خلال 30 يوم
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary font-cairo">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  دفع آمن ومشفر
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 