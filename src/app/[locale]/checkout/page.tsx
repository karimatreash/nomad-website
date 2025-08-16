'use client';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';

export default function CheckoutPage() {
  const { cart } = useCart();
  const { locale } = useTranslations();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'السعودية',
    paymentMethod: 'card',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const subtotal = cart.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal > 200 ? 0 : 30;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setStep(3); // Success step
  };

  if (cart.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              إتمام الطلب
            </h1>
            <p className="text-xl text-text-secondary">
              أكمل عملية الشراء باتباع الخطوات التالية
            </p>
          </div>
        </div>
      </div>

      <div className="container-responsive section-padding">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNumber 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-4 ${
                    step > stepNumber ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 text-sm text-text-secondary">
            <span className={step >= 1 ? 'text-primary font-semibold' : ''}>معلومات الشحن</span>
            <span className={`mx-8 ${step >= 2 ? 'text-primary font-semibold' : ''}`}>الدفع</span>
            <span className={step >= 3 ? 'text-primary font-semibold' : ''}>التأكيد</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-6 font-cairo">
                  معلومات الشحن
                </h2>
                
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2 font-cairo">
                        الاسم الأول *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="input-primary font-cairo"
                        placeholder="الاسم الأول"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2 font-cairo">
                        اسم العائلة *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="input-primary font-cairo"
                        placeholder="اسم العائلة"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2 font-cairo">
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input-primary font-cairo"
                        placeholder="البريد الإلكتروني"
                        dir="ltr"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2 font-cairo">
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="input-primary font-cairo"
                        placeholder="رقم الهاتف"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 font-cairo">
                      العنوان *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="input-primary font-cairo"
                      placeholder="العنوان الكامل"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2 font-cairo">
                        المدينة *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="input-primary font-cairo"
                        placeholder="المدينة"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2 font-cairo">
                        الرمز البريدي *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="input-primary font-cairo"
                        placeholder="الرمز البريدي"
                        dir="ltr"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2 font-cairo">
                        البلد *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="input-primary font-cairo"
                      >
                        <option value="السعودية">السعودية</option>
                        <option value="الإمارات">الإمارات</option>
                        <option value="الكويت">الكويت</option>
                        <option value="قطر">قطر</option>
                        <option value="البحرين">البحرين</option>
                        <option value="عمان">عمان</option>
                      </select>
                    </div>
            </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      className="btn-primary w-full text-lg py-4 font-cairo"
                    >
                      التالي: الدفع
            </button>
                  </div>
          </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-6 font-cairo">
                  طريقة الدفع
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-4 font-cairo">
                      اختر طريقة الدفع
                    </label>
                    <div className="space-y-4">
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <div className="mr-3">
                          <div className="font-medium text-text-primary font-cairo">بطاقة ائتمان</div>
                          <div className="text-sm text-text-secondary font-cairo">فيزا، ماستركارد، أمريكان إكسبرس</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <div className="mr-3">
                          <div className="font-medium text-text-primary font-cairo">PayPal</div>
                          <div className="text-sm text-text-secondary font-cairo">دفع آمن عبر PayPal</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <div className="mr-3">
                          <div className="font-medium text-text-primary font-cairo">الدفع عند الاستلام</div>
                          <div className="text-sm text-text-secondary font-cairo">ادفع عند استلام طلبك</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="btn-outline flex-1 font-cairo"
                    >
                      السابق
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="btn-primary flex-1 text-lg py-4 font-cairo disabled:opacity-50"
                    >
                      {loading ? 'جاري معالجة الطلب...' : 'إتمام الطلب'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-text-primary mb-4 font-cairo">
                  تم إتمام الطلب بنجاح!
                </h2>
                <p className="text-text-secondary mb-8 font-cairo">
                  شكراً لك! تم استلام طلبك وسيتم إرسال تأكيد عبر البريد الإلكتروني
                </p>
                
                <div className="space-y-4">
                                              <a href={`/${locale}/products`} className="btn-primary font-cairo">
                              متابعة التسوق
                            </a>
                  <a href="/orders" className="btn-outline font-cairo">
                    عرض الطلبات
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-text-primary mb-6 font-cairo">
                ملخص الطلب
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={`${item.product?.id}-${item.size}-${index}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.product?.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name_ar || item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text-primary text-sm font-cairo">
                        {item.product?.name_ar || item.product?.name}
                      </h4>
                      <p className="text-sm text-text-secondary font-cairo">
                        المقاس: {item.size} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-primary font-cairo">
                        {(item.product?.price || 0) * item.quantity} ريال
                      </p>
                    </div>
                </div>
              ))}
            </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
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
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-text-primary font-cairo">الإجمالي:</span>
                    <span className="text-lg font-bold text-text-primary font-cairo">{total} ريال</span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t border-gray-200">
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