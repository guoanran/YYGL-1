
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Wrench,
  Layers,
  ArrowUpDown,
  X,
  MessageSquare,
  CheckCircle2,
  Send,
  Info,
  Check
} from 'lucide-react';

interface CustomOrder {
  id: string;
  submitTime: string;
  appName: string;
  appDesc: string;
  appType: string;
  icon: string;
  status: '待查看' | '已反馈';
  feedbackContent?: string;
  // 截图中的详细字段
  region: string;
  startTime: string;
  endTime: string;
  frequency: string;
  requirementDesc: string;
  outputTypes: string[];
  deliveryMethod: '线上' | '线下';
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
}

const MOCK_ORDERS: CustomOrder[] = [
  {
    id: 'AC-20230602-002',
    submitTime: '2023-06-02 11:30:45',
    appName: '农业监测应用系统',
    appDesc: '作物生长监测系统',
    appType: '农业农村',
    status: '待查看',
    region: '北京市海淀区',
    startTime: '2023-06-01',
    endTime: '2023-12-31',
    frequency: '每日更新',
    requirementDesc: '开发一套农业监测应用系统，实现对农作物生长环境、生长状态的实时监测与数据分析，提供产量预测和病虫害预警功能，支持多终端访问。系统需包含数据采集模块、数据分析模块、可视化展示模块和预警模块。',
    outputTypes: ['数据报表', '可视化图表', 'API接口', '移动端应用'],
    deliveryMethod: '线上',
    contactPerson: '张经理',
    contactPhone: '139****8765',
    contactEmail: 'zhang****@agri-tech.com',
    contactAddress: '北京市海淀区中关村南大街5号',
    icon: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=100&h=100&auto=format&fit=crop'
  },
  {
    id: 'AC-20230608-005',
    submitTime: '2023-06-08 15:45:30',
    appName: '城市规划决策系统',
    appDesc: '空间规划分析工具',
    appType: '城市治理',
    status: '已反馈',
    feedbackContent: '初步技术方案已发送至客户邮箱，正在等待客户确认第二阶段的需求细节。',
    region: '上海市徐汇区',
    startTime: '2023-07-01',
    endTime: '2024-03-31',
    frequency: '每周更新',
    requirementDesc: '针对上海中心城区建设，提供亚米级精度土地利用分类与变化监测，辅助规划部门进行用地违规分析。',
    outputTypes: ['三维模型', '电子地图', '分析报告'],
    deliveryMethod: '线上',
    contactPerson: '李工',
    contactPhone: '139****1122',
    contactEmail: 'li****@city-plan.sh.cn',
    contactAddress: '上海市徐汇区漕溪北路',
    icon: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=100&h=100&auto=format&fit=crop'
  }
];

export const CustomizationManagement: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  const currentOrder = useMemo(() => 
    MOCK_ORDERS.find(o => o.id === selectedOrderId)
  , [selectedOrderId]);

  const handleAction = (id: string) => {
    setSelectedOrderId(id);
    const order = MOCK_ORDERS.find(o => o.id === id);
    if (order?.status === '已反馈') {
       setFeedbackInput(order.feedbackContent || '');
    } else {
       setFeedbackInput('');
    }
    setView('detail');
  };

  if (view === 'detail' && currentOrder) {
    return (
      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 flex flex-col min-h-screen animate-in fade-in duration-300 overflow-hidden">
        {/* 头部标题 */}
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">应用定制需求详情</h2>
          <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* 1. 基础信息 - 按照截图布局 */}
            <section className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">基础信息</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium">应用名称</p>
                  <p className="text-base text-gray-800 font-semibold">{currentOrder.appName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium">行政区划</p>
                  <p className="text-base text-gray-800 font-semibold">{currentOrder.region}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium">开始时间</p>
                  <p className="text-base text-gray-800 font-semibold">{currentOrder.startTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium">结束时间</p>
                  <p className="text-base text-gray-800 font-semibold">{currentOrder.endTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium">更新频次</p>
                  <p className="text-base text-gray-800 font-semibold">{currentOrder.frequency}</p>
                </div>
              </div>
            </section>

            {/* 2. 需求详情 */}
            <section className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">需求详情</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-400 font-medium">需求描述</p>
                <div className="p-6 bg-gray-50/80 rounded-2xl text-sm text-gray-700 leading-relaxed font-medium border border-gray-100/50">
                  {currentOrder.requirementDesc}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-400 font-medium">输出类型</p>
                <div className="flex flex-wrap gap-3">
                  {currentOrder.outputTypes.map((type, i) => (
                    <span key={i} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. 收货方式 */}
            <section className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">收货方式</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border transition-all flex items-start space-x-4 ${currentOrder.deliveryMethod === '线上' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${currentOrder.deliveryMethod === '线上' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-200 bg-white'}`}>
                    {currentOrder.deliveryMethod === '线上' && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-800 mb-1">线上交付</p>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">系统部署至客户指定云服务器</p>
                  </div>
                </div>
                <div className={`p-6 rounded-2xl border transition-all flex items-start space-x-4 ${currentOrder.deliveryMethod === '线下' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${currentOrder.deliveryMethod === '线下' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-200 bg-gray-50'}`}>
                    {currentOrder.deliveryMethod === '线下' && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-800 mb-1">线下交付</p>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">提供安装介质及上门部署服务</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. 联系信息 */}
            <section className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">联系信息</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium">联系人</p>
                  <p className="text-base text-gray-800 font-semibold">{currentOrder.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium">联系电话</p>
                  <p className="text-base text-gray-800 font-semibold">{currentOrder.contactPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium">电子邮箱</p>
                  <p className="text-base text-gray-800 font-semibold">{currentOrder.contactEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium">联系地址</p>
                  <p className="text-base text-gray-800 font-semibold">{currentOrder.contactAddress}</p>
                </div>
              </div>
            </section>

            <div className="h-px bg-gray-100 my-8" />

            {/* 5. 反馈填写区域 */}
            <section className="space-y-6 pb-20">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                反馈信息处理
              </h3>
              {currentOrder.status === '待查看' ? (
                <div className="space-y-4">
                  <textarea 
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="请输入对该定制需求的初步反馈意见、技术方案建议或下一步跟进计划..."
                    className="w-full h-40 p-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-bold text-gray-700 placeholder:italic"
                  />
                  <div className="flex items-center text-[10px] text-amber-500 font-bold">
                    <Info className="w-3.5 h-3.5 mr-1.5" /> 提交反馈后，客户可在“个人中心”实时查看，订单状态将更新为“已反馈”。
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-emerald-50/50 rounded-[1.5rem] border border-emerald-100 text-emerald-800 italic font-bold leading-relaxed">
                  “{currentOrder.feedbackContent}”
                </div>
              )}
            </section>
          </div>
        </div>

        {/* 底部按钮栏 */}
        <div className="px-10 py-6 border-t border-gray-100 flex justify-end space-x-4 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <button onClick={() => setView('list')} className="px-10 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all active:scale-95">
            返回列表
          </button>
          {currentOrder.status === '待查看' && (
            <button 
              onClick={() => setView('list')} 
              className="px-12 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center group active:scale-95"
            >
              <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
              提交反馈
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 顶部服务介绍 */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row h-auto md:h-64">
        <div className="w-full md:w-96 bg-gradient-to-br from-indigo-700 to-blue-600 relative overflow-hidden flex items-center justify-center p-8">
           <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl -ml-16 -mb-16"></div>
           </div>
           <div className="relative z-10 w-full aspect-video rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-2xl">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
                 <Wrench className="w-7 h-7" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-1 bg-white/30 rounded-full"></div>
                <div className="w-3 h-3 rounded-full border-2 border-white/50"></div>
                <div className="w-10 h-1 bg-white/30 rounded-full"></div>
              </div>
           </div>
        </div>
        <div className="flex-1 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">应用定制服务介绍</h2>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            根据您的业务需求提供专业的个性化应用开发解决方案。我们支持桌面、Web、移动端及API定制，涵盖从需求调研、设计开发到部署运维的全流程支持，赋能业务高效转型。
          </p>
        </div>
      </div>

      {/* 筛选区域 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-900 font-black text-sm">筛选条件：</span>
          <div className="flex space-x-3">
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:bg-white cursor-pointer min-w-[140px]">
                <option>全部应用类型</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:bg-white cursor-pointer min-w-[140px]">
                <option>更新时间</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-1 justify-end max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="搜索应用名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:bg-white font-bold"
            />
          </div>
          <button className="flex items-center px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </button>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <h4 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
             <Layers className="w-6 h-6 mr-3 text-blue-600" />
             应用定制订单
          </h4>
          <button className="flex items-center px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black hover:bg-blue-100 transition-all uppercase tracking-widest">
             <ArrowUpDown className="w-3.5 h-3.5 mr-2" />
             最新优先
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">订单编号</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">提交时间</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">应用详情</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">应用类型</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">状态</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_ORDERS.filter(o => o.appName.includes(searchQuery)).map((order) => (
                <tr key={order.id} className="group hover:bg-blue-50/10 transition-all">
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-gray-800">{order.id}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs text-gray-400 font-bold">{order.submitTime}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                        <img src={order.icon} alt={order.appName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-black text-gray-800 mb-1">{order.appName}</span>
                        <span className="text-[10px] text-gray-400 font-bold italic line-clamp-1">“{order.appDesc}”</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{order.appType}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      order.status === '待查看' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                       <div className={`w-1.5 h-1.5 rounded-full mr-2 inline-block ${order.status === '已反馈' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                       {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end">
                      {order.status === '待查看' ? (
                        <button 
                          onClick={() => handleAction(order.id)}
                          className="text-[11px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-[0.2em] flex items-center"
                        >
                          反馈
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAction(order.id)}
                          className="text-[11px] font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-[0.2em] flex items-center"
                        >
                          详情
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
          <span className="text-[11px] text-gray-400 font-black uppercase tracking-widest">
            显示 1 到 {MOCK_ORDERS.length} 条记录
          </span>
          <div className="flex items-center space-x-2">
            <button className="p-2.5 border border-gray-100 rounded-xl text-gray-300 hover:text-blue-600 disabled:opacity-30" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl text-xs font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20">1</button>
            <button className="w-10 h-10 rounded-xl text-xs font-black text-gray-400 border border-gray-100 hover:bg-white transition-all">2</button>
            <button className="p-2.5 border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.04);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};
