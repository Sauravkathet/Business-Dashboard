import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend }: { title: string, value: string, change: string, icon: any, trend: 'up' | 'down' }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="flex items-center gap-1 text-sm">
      {trend === 'up' ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-rose-500" />}
      <span className={trend === 'up' ? 'text-emerald-500 font-medium' : 'text-rose-500 font-medium'}>{change}</span>
      <span className="text-slate-400">vs last month</span>
    </div>
  </div>
);

const data = [
  { name: 'Mon', revenue: 4000, tasks: 24 },
  { name: 'Tue', revenue: 3000, tasks: 18 },
  { name: 'Wed', revenue: 2000, tasks: 32 },
  { name: 'Thu', revenue: 2780, tasks: 29 },
  { name: 'Fri', revenue: 1890, tasks: 15 },
  { name: 'Sat', revenue: 2390, tasks: 10 },
  { name: 'Sun', revenue: 3490, tasks: 8 },
];

export const Dashboard: React.FC = () => {
  const { tasks, inventory } = useStore();

  const activeTasks = tasks.filter(t => t.status !== 'Done').length;
  const lowStockItems = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$48,294" change="+12.5%" icon={TrendingUp} trend="up" />
        <StatCard title="Active Users" value="2,300" change="+4.1%" icon={Users} trend="up" />
        <StatCard title="Pending Tasks" value={activeTasks.toString()} change="-2.4%" icon={Clock} trend="down" />
        <StatCard title="Low Inventory" value={lowStockItems.toString()} change="+14%" icon={ShoppingBag} trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Revenue Overview</h3>
            <select className="text-sm border-slate-200 rounded-md text-slate-500 focus:ring-primary-500 border p-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Chart / Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Task Completion</h3>
          <div className="h-48 w-full mb-6">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px'}} />
                <Bar dataKey="tasks" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Recent Activity</h4>
            <div className="flex items-start gap-3">
               <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500"></div>
               <div>
                 <p className="text-sm text-slate-800 font-medium">New Order #4292</p>
                 <p className="text-xs text-slate-400">2 minutes ago</p>
               </div>
            </div>
            <div className="flex items-start gap-3">
               <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
               <div>
                 <p className="text-sm text-slate-800 font-medium">Task "Web Update" Completed</p>
                 <p className="text-xs text-slate-400">1 hour ago</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
