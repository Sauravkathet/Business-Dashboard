import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Search, Filter, AlertTriangle, CheckCircle } from 'lucide-react';

export const Inventory: React.FC = () => {
  const { inventory } = useStore();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'In Stock': return 'text-emerald-600 bg-emerald-50';
      case 'Low Stock': return 'text-amber-600 bg-amber-50';
      case 'Out of Stock': return 'text-rose-600 bg-rose-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventory</h2>
          <p className="text-slate-500 text-sm">Track stock levels and prices</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search SKU or Name..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
            Add Item
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                    <Package className="w-4 h-4" />
                  </div>
                  {item.name}
                </td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.sku}</td>
                <td className="px-6 py-4 text-slate-600">{item.category}</td>
                <td className="px-6 py-4 text-slate-800 font-semibold">{item.quantity}</td>
                <td className="px-6 py-4 text-slate-600">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status === 'Low Stock' && <AlertTriangle className="w-3 h-3" />}
                    {item.status === 'Out of Stock' && <AlertTriangle className="w-3 h-3" />}
                    {item.status === 'In Stock' && <CheckCircle className="w-3 h-3" />}
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs">{item.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
