import { useState, useEffect } from 'react';
import { ChevronDown, TrendingDown, TrendingUp, X } from 'lucide-react';
import Gauge from './Gauge';

export default function DashboardPreview() {
  const [t1, setT1] = useState<'products' | 'orders'>('products');
  const [t3, setT3] = useState<'revenue' | 'earnings'>('revenue');
  const [big, setBig] = useState('6,896');

  useEffect(() => {
    fetch('/api/earnings/summary')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.completedOrders != null && setBig(String(d.completedOrders)))
      .catch(() => {});
  }, []);

  return (
    <div id="dashboard" className="px-3 sm:px-4 pb-4">
      <div className="scm-tray p-4 sm:p-6 w-full max-w-[880px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="scm-card p-5">
            <div className="flex justify-between text-[13px] mb-3">
              <span className="text-[#ef4d23] font-medium">Orders</span>
              <span className="text-neutral-500">This Month</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[28px] font-semibold">{big}</span>
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 rounded-full px-2 py-0.5 text-[11px]">
                <TrendingDown className="w-3 h-3" />-3,382 (33%)
              </span>
            </div>
            <p className="text-[12px] text-neutral-500 mt-1 mb-3">Compared to yesterday</p>
            <p className="text-center text-[12px] text-neutral-600 mb-2">Month Target achieved</p>
            <Gauge value={92} showLabels min="389K" max="425K" />
            <div className="mt-4 bg-neutral-100 rounded-full p-1 flex">
              {(['products', 'orders'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setT1(k)}
                  className={`flex-1 text-[12px] py-1.5 rounded-full capitalize ${t1 === k ? 'bg-white shadow-sm font-medium' : 'text-neutral-500'}`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="scm-card p-5 flex flex-col gap-3">
            {[
              ['Show figures for', 'This month'],
              ['Compare period by', 'Month-to-date (MTD)'],
            ].map(([label, val]) => (
              <div key={label}>
                <label className="block text-[12px] text-neutral-700 mb-1.5">{label}</label>
                <div className="flex justify-between border border-neutral-200 rounded-lg px-3 py-2 text-sm">
                  {val}
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                </div>
              </div>
            ))}
            {[
              ['Ste targets (This month)', '10'],
              ['Ste targets (This year)', '100'],
            ].map(([label, val]) => (
              <div key={label}>
                <label className="block text-[12px] text-neutral-700 mb-1.5">{label}</label>
                <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
                  <span className="px-3 py-2 bg-neutral-50 text-neutral-500 border-r">#</span>
                  <input readOnly defaultValue={val} className="flex-1 px-3 py-2 text-sm outline-none" />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 mt-1">
              <button type="button" className="bg-[#ef4d23] text-white rounded-lg px-5 py-2 text-sm">
                Save
              </button>
              <button type="button" className="text-sm underline text-neutral-700">
                Cancel
              </button>
              <X className="w-5 h-5 ml-auto text-neutral-500" />
            </div>
          </div>

          <div className="scm-card p-5 sm:col-span-2 lg:col-span-1">
            <div className="flex justify-between text-[13px] mb-3">
              <span className="text-[#ef4d23] font-medium">Earnings</span>
              <span className="text-neutral-500">today</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[28px] font-semibold">0</span>
              <span className="inline-flex items-center gap-1 bg-neutral-100 rounded-full px-2 py-0.5 text-[11px]">
                <TrendingUp className="w-3 h-3" />0
              </span>
            </div>
            <p className="text-[12px] text-neutral-500 my-3">Compared to yesterday</p>
            <Gauge value={68} color="#9ca3af" />
            <div className="mt-4 bg-neutral-100 rounded-full p-1 flex">
              {(['revenue', 'earnings'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setT3(k)}
                  className={`flex-1 text-[12px] py-1.5 rounded-full capitalize ${t3 === k ? 'bg-white shadow-sm font-medium' : 'text-neutral-500'}`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
