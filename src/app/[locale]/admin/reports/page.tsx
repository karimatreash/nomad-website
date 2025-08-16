'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    // Get all products with their order items to calculate sales
    const { data: products } = await supabase.from('products').select('*');
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, quantity, product:products(name, price)');

    if (products && orderItems) {
      const productSales = products.map(product => {
        const soldItems = orderItems.filter(item => item.product_id === product.id);
        const totalSold = soldItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalRevenue = soldItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
        
        return {
          id: product.id,
          name: product.name,
          currentStock: product.quantity,
          totalSold,
          totalRevenue,
          remainingStock: product.quantity - totalSold,
        };
      });

      setReports(productSales.sort((a, b) => b.totalSold - a.totalSold));
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  const totalRevenue = reports.reduce((sum, product) => sum + product.totalRevenue, 0);
  const totalSold = reports.reduce((sum, product) => sum + product.totalSold, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-purple-600">Sales Reports</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalSold}</div>
          <div className="text-gray-600">Total Items Sold</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
          <div className="text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">{reports.length}</div>
          <div className="text-gray-600">Products Tracked</div>
        </div>
      </div>

      {/* Product Sales Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.currentStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {product.totalSold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={product.remainingStock < 10 ? 'text-red-600 font-medium' : ''}>
                      {product.remainingStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    ${product.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 