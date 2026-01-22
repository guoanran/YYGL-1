
import React from 'react';
import { 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, ComposedChart, Line
} from 'recharts';
import { Package, Database, ShoppingCart, FileText, TrendingUp, TrendingDown, Globe, Info } from 'lucide-react';

const statsData = [
  { label: '总产品数', value: 128, trend: 12.5, icon: Package, color: 'blue' },
  { label: '总资源数据', value: 356, trend: 8.3, icon: Database, color: 'emerald' },
  { label: '总订单数据', value: 248, trend: -2.1, icon: ShoppingCart, color: 'orange' },
  { label: '总定制需求', value: 47, trend: 15.7, icon: FileText, color: 'green' },
];

const trendData = [
  { month: '1月', revenue: 120000, orders: 45 },
  { month: '2月', revenue: 155000, orders: 52 },
  { month: '3月', revenue: 135000, orders: 48 },
  { month: '4月', revenue: 195000, orders: 70 },
  { month: '5月', revenue: 170000, orders: 62 },
  { month: '6月', revenue: 215000, orders: 85 },
];

const orderDist = [
  { name: '数据', value: 60, color: '#3B82F6' },
  { name: '服务', value: 25, color: '#6366F1' },
  { name: '应用', value: 15, color: '#94A3B8' },
];

const productDist = [
  { name: '数据', value: 50, color: '#10B981' },
  { name: '服务', value: 30, color: '#34D399' },
  { name: '应用', value: 20, color: '#A7F3D0' },
];

const resourceDist = [
  { name: '数据', value: 70, color: '#F59E0B' },
  { name: '服务', value: 20, color: '#FBBF24' },
  { name: '应用', value: 10, color: '#FEF3C7' },
];

const tagCloud = [
  { text: '无人机数据', size: 32, color: 'text-blue-600', top: '20%', left: '30%' },
  { text: '卫星影像', size: 28, color: 'text-cyan-500', top: '45%', left: '15%' },
  { text: '交通运输', size: 24, color: 'text-indigo-600', top: '15%', left: '55%' },
  { text: '自然资源', size: 22, color: 'text-emerald-500', top: '65%', left: '25%' },
  { text: '生态环境', size: 20, color: 'text-green-500', top: '40%', left: '65%' },
  { text: '能源建设', size: 18, color: 'text-purple-500', top: '75%', left: '50%' },
  { text: '低空经济', size: 18, color: 'text-sky-500', top: '30%', left: '45%' },
  { text: '水利水务', size: 16, color: 'text-teal-500', top: '55%', left: '80%' },
  { text: '防灾减灾', size: 14, color: 'text-rose-500', top: '10%', left: '20%' },
  { text: '应急管理', size: 14, color: 'text-orange-500', top: '85%', left: '35%' },
  { text: '数字城市', size: 16, color: 'text-slate-600', top: '50%', left: '40%' },
  { text: '智慧政务', size: 12, color: 'text-gray-400', top: '70%', left: '10%' },
  { text: '城市安全', size: 12, color: 'text-gray-400', top: '5%', left: '40%' },
];

const MiniDonut = ({ title, data, total }: { title: string, data: any[], total: string }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</span>
      <span className="text-lg font-bold text-gray-900">{total}</span>
      <div className="mt-2 space-y-1">
        {data.map((item, i) => (
          <div key={i} className="flex items-center text-[10px]">
            <div className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: item.color }} />
            <span className="text-gray-500 truncate w-16">{item.name}</span>
            <span className="ml-auto font-medium text-gray-700">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
    <div className="w-24 h-24 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={28}
            outerRadius={38}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-[10px] font-bold text-gray-400">比例</div>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 py-2">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">运营概览</h2>
        <p className="text-sm text-gray-400 font-medium">欢迎回来，这是您今天的平台运行报告。</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-${stat.color === 'blue' ? 'blue-500' : stat.color === 'emerald' ? 'emerald-500' : stat.color === 'orange' ? 'orange-500' : 'green-500'}`} />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                <div className="mt-2 flex items-center">
                  {stat.trend > 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-bold ${stat.trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {Math.abs(stat.trend)}%
                  </span>
                  <span className="text-xs text-gray-400 ml-1">较上月</span>
                </div>
              </div>
              <div className={`p-4 rounded-2xl bg-${stat.color === 'blue' ? 'blue-50' : stat.color === 'emerald' ? 'emerald-50' : stat.color === 'orange' ? 'orange-50' : 'green-50'} text-${stat.color === 'blue' ? 'blue-600' : stat.color === 'emerald' ? 'emerald-600' : stat.color === 'orange' ? 'orange-600' : 'green-600'}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Income & Order Trend (Expanded) */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-xl font-bold text-gray-900 tracking-tight">业务增长趋势</h4>
              <p className="text-xs text-gray-400 mt-1 font-medium">营收与订单成交量的综合关联分析</p>
            </div>
            <div className="flex bg-gray-50 rounded-xl p-1 text-xs border border-gray-100">
              <button className="px-5 py-2 bg-white rounded-lg shadow-sm text-blue-600 font-bold">近半年</button>
              <button className="px-5 py-2 text-gray-400 hover:text-gray-600 font-bold transition-colors">近一年</button>
            </div>
          </div>
          
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                  tickFormatter={(val) => `￥${val/1000}k`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '16px'
                  }} 
                />
                <Bar 
                  yAxisId="left"
                  dataKey="revenue" 
                  name="营收金额"
                  fill="url(#barGradient)" 
                  radius={[8, 8, 0, 0]} 
                  barSize={40} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  name="订单数量"
                  stroke="#F59E0B" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#F59E0B', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-12 text-xs font-bold">
            <div className="flex items-center text-gray-400">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
              营收金额 (L)
            </div>
            <div className="flex items-center text-gray-400">
              <div className="w-6 h-1 bg-amber-500 rounded-full mr-3" />
              订单量 (R)
            </div>
          </div>
        </div>

        {/* Insight Panels (Vertical Distributions) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col h-full">
            <h4 className="text-base font-bold text-gray-900 mb-6 flex items-center tracking-tight">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <Info className="w-4 h-4 text-blue-500" />
              </div>
              多维分布洞察
            </h4>
            <div className="space-y-4 flex-1">
              <MiniDonut title="订单来源分布" data={orderDist} total="248 笔" />
              <MiniDonut title="产品类别占比" data={productDist} total="128 件" />
              <MiniDonut title="资源库构成" data={resourceDist} total="356 项" />
            </div>
            <button className="mt-8 w-full py-4 text-sm font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
              查看详细数据报表
            </button>
          </div>
        </div>
      </div>

      {/* Earth-shaped Word Cloud Section */}
      <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 overflow-hidden relative">
        {/* Background blobs for depth */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10 flex justify-between items-center mb-10">
          <div>
            <h4 className="text-xl font-bold text-gray-900 flex items-center tracking-tight">
              <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
                <Globe className="w-5 h-5" />
              </div>
              资源标签全景图
            </h4>
            <p className="text-sm text-gray-400 mt-1 font-medium">深度覆盖 40+ 业务垂直领域</p>
          </div>
          <span className="text-xs text-gray-400 font-bold bg-gray-50 px-4 py-2 rounded-full border border-gray-100">实时计算更新</span>
        </div>
        
        <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
          {/* Earth Visual Base */}
          <div className="absolute w-[440px] h-[440px] rounded-full bg-gradient-to-br from-blue-50 via-white to-indigo-100 shadow-[inset_0_0_100px_rgba(59,130,246,0.08)] flex items-center justify-center">
            <div className="absolute inset-0 border border-blue-100/40 rounded-full" />
            <div className="absolute w-[1px] h-full bg-blue-100/20 left-1/2" />
            <div className="absolute w-full h-[1px] bg-blue-100/20 top-1/2" />
            <div className="absolute inset-16 border border-blue-50/40 rounded-full" />
            <div className="absolute inset-32 border border-blue-50/20 rounded-full" />
          </div>

          {/* Floating Tags Container */}
          <div className="relative w-[500px] h-[500px]">
            <style>
              {`
                @keyframes float {
                  0%, 100% { transform: translateY(0px) translateX(0px); }
                  33% { transform: translateY(-15px) translateX(5px); }
                  66% { transform: translateY(5px) translateX(-10px); }
                }
                .floating-tag {
                  animation: float 6s ease-in-out infinite;
                  white-space: nowrap;
                  cursor: pointer;
                  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .floating-tag:hover {
                  transform: scale(1.25) translateY(-5px);
                  z-index: 50;
                  filter: drop-shadow(0 15px 15px rgba(59, 130, 246, 0.2));
                }
              `}
            </style>
            
            {tagCloud.map((tag, idx) => (
              <div 
                key={idx}
                className={`absolute floating-tag ${tag.color} font-black tracking-tight`}
                style={{ 
                  top: tag.top, 
                  left: tag.left, 
                  fontSize: `${tag.size}px`,
                  animationDelay: `${idx * 0.4}s`,
                  animationDuration: `${5 + Math.random() * 3}s`
                }}
              >
                {tag.text}
              </div>
            ))}
            
            {['环境监测', '海洋监测', '森林防火', '智能物流', '智慧农业', '交通管制'].map((t, idx) => (
              <div 
                key={`bg-${idx}`}
                className="absolute text-gray-300 font-bold text-xs floating-tag"
                style={{ 
                  top: `${10 + idx * 15}%`, 
                  left: `${5 + idx * 18}%`,
                  animationDelay: `${idx * 0.7}s`,
                  opacity: 0.4
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
