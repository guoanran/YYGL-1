
import React from 'react';
import { 
  Edit3, 
  Save, 
  RotateCcw, 
  AlertCircle, 
  TrendingUp, 
  BadgeDollarSign,
  ChevronRight,
  Zap,
  Layers,
  Settings2
} from 'lucide-react';

interface Props {
  title?: string;
}

const pricingRules = [
  { group: '科研教育', discount: '8.5折', active: true, target: '所有高校与科研所' },
  { group: '政府机关', discount: '9.0折', active: true, target: '省级及以上行政单位' },
  { group: '战略合作伙伴', discount: '7.0折', active: false, target: '签有长期战略协议客户' },
  { group: '新用户首单', discount: '立减500', active: true, target: '注册30天内首次采购' },
];

export const PriceManagement: React.FC<Props> = ({ title = '价格策略中枢' }) => {
  return (
    <div className="space-y-8 py-2 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <BadgeDollarSign className="w-8 h-8 mr-3 text-blue-600" />
            {title}
          </h2>
          <p className="text-sm text-gray-400 font-medium mt-1">全局管理各产品线的折扣模型与动态调价算法。</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-3 text-gray-400 hover:text-rose-500 bg-white border border-gray-100 rounded-2xl transition-all">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button className="flex items-center px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all group">
            <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            同步策略生效
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Customer Discount Section */}
        <div className="xl:col-span-7 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mr-4 shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">客户群体折扣集</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">针对不同层级的合作主体设定差异化定价</p>
              </div>
            </div>
            <button className="px-5 py-2 bg-white border border-gray-100 text-blue-600 rounded-xl text-[10px] font-black hover:shadow-md transition-all uppercase">
              新增分组
            </button>
          </div>

          <div className="p-10 space-y-6">
            {pricingRules.map((rule, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl transition-all group">
                <div className="flex-1 flex items-center">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors mr-6 shadow-sm">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="font-black text-gray-900 mr-3">{rule.group}</span>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest ${
                        rule.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {rule.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-bold">{rule.target}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">优惠幅度</p>
                    <span className="text-2xl font-black text-blue-600 tracking-tight">{rule.discount}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-3 text-gray-400 hover:text-blue-600 bg-white border border-gray-100 rounded-2xl transition-all shadow-sm">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-3 text-gray-400 hover:text-rose-500 bg-white border border-gray-100 rounded-2xl transition-all shadow-sm">
                      <Settings2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Pricing AI Section */}
        <div className="xl:col-span-5 flex flex-col gap-8">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden group">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center mb-10">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl mr-5">
                  <TrendingUp className="w-8 h-8 text-blue-100" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">智能动态调价引擎</h3>
                  <p className="text-xs text-blue-200 font-bold mt-1 uppercase tracking-widest">基于实时热度的价格预测</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 mb-10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black uppercase tracking-widest text-blue-200">引擎运行状态</span>
                  <span className="flex items-center text-[10px] font-black bg-emerald-400 text-white px-3 py-1 rounded-full animate-pulse">
                    RUNNING
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed italic opacity-80">
                  “系统将根据近期资源下载频次、库存冗余及竞品均价，自动为 40+ 核心产品线推荐最优定价区间。”
                </p>
              </div>

              <button className="w-full py-5 bg-white text-blue-600 rounded-[1.5rem] font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-900/40">
                立即开启智能化试算
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex-1">
            <h4 className="text-base font-black text-gray-900 flex items-center mb-6 tracking-tight">
              <AlertCircle className="w-5 h-5 mr-3 text-amber-500" />
              最近价格波动预警
            </h4>
            <div className="space-y-6">
              {[
                { name: '卫星数据/高分10m', diff: '+5.2%', time: '2小时前' },
                { name: '算法服务/植被识别', diff: '-2.1%', time: '5小时前' },
                { name: '应用产品/智慧农业', diff: '+12.5%', time: '昨天' },
              ].map((alert, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-4 ${alert.diff.startsWith('+') ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors">{alert.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs font-black mr-4 ${alert.diff.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{alert.diff}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
