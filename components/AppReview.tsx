
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  CheckCircle2,
  LayoutGrid,
  MoreHorizontal,
  X,
  ExternalLink,
  ShieldCheck,
  MessageSquareQuote,
  Monitor,
  Info,
  Tag,
  Cpu,
  Layers,
  Ban
} from 'lucide-react';

interface AppParameter {
  name: string;
  type: string;
  required: string;
  desc: string;
}

interface AppReviewItem {
  id: string;
  name: string;
  type: string;
  category: string;
  submitter: string;
  avatar: string;
  submitTime: string;
  status: '待审核' | '已通过' | '已驳回';
  icon: string;
  // 详情扩展字段
  visitUrl: string;
  version: string;
  description: string;
  parameters: AppParameter[];
  techStack: string[];
  tags: string[];
  processResult?: string;
}

const MOCK_APPS: AppReviewItem[] = [
  {
    id: '1',
    name: '城市扩张监测系统',
    type: '城市规划',
    category: '规划监测',
    submitter: '吴工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    submitTime: '2023-06-15 14:20',
    status: '待审核',
    icon: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&h=300&auto=format&fit=crop',
    visitUrl: 'https://app.smartcity.com/urban-growth',
    version: 'v2.1.0',
    description: '集成多时相遥感分析引擎，自动识别城市边界蔓延趋势，为国土空间规划提供量化支撑。支持动态热力图分析与违建红线预警。',
    parameters: [
      { name: 'region_code', type: 'String', required: '是', desc: '行政区划代码' },
      { name: 'compare_year', type: 'Int', required: '是', desc: '对比年份' },
      { name: 'resolution', type: 'Float', required: '否', desc: '分析分辨率(m)' }
    ],
    techStack: ['React', 'Python', 'PostGIS', 'TensorFlow'],
    tags: ['城市规划', '遥感分析', '辅助决策']
  },
  {
    id: '2',
    name: '农业长势监测平台',
    type: '农业监测',
    category: '智慧农业',
    submitter: '马技术员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    submitTime: '2023-06-14 09:15',
    status: '待审核',
    icon: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=400&h=300&auto=format&fit=crop',
    visitUrl: 'https://app.agri-monitor.com/crop-status',
    version: 'v1.5.2',
    description: '通过反演NDVI植被指数，实时监控农作物生长状态。提供旱涝预警、肥力评估及预估产量计算功能，支持农情报告自动导出。',
    parameters: [
      { name: 'crop_type', type: 'Enum', required: '是', desc: '作物种类：WHEAT/CORN/RICE' },
      { name: 'sensor_id', type: 'String', required: '是', desc: '物联设备ID' }
    ],
    techStack: ['Vue3', 'Node.js', 'ECharts', 'Sentinel-Hub'],
    tags: ['智慧农业', '长势评估', '产量预测']
  },
  {
    id: '3',
    name: '环境质量评价系统',
    type: '环境保护',
    category: '环境监测',
    submitter: '林研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
    submitTime: '2023-06-12 16:40',
    status: '已通过',
    icon: 'https://images.unsplash.com/photo-1532187875605-2fe358a71e68?q=80&w=400&h=300&auto=format&fit=crop',
    visitUrl: 'https://env.report.com/quality-assessment',
    version: 'v3.0.0',
    description: '全自动环境空气、水质质量评价系统。支持AQI、WQI实时计算与历史趋势分析。',
    parameters: [
      { name: 'station_id', type: 'String', required: '是', desc: '监测站点ID' }
    ],
    techStack: ['Java Spring', 'React', 'Elasticsearch'],
    tags: ['环境保护', '空气质量', '水质监测'],
    processResult: '该应用已通过安全测试与性能压力测试，界面符合UI规范，准予上架。'
  },
  {
    id: '4',
    name: '地质灾害预警App',
    type: '应急灾害',
    category: '安全防护',
    submitter: '陈队长',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    submitTime: '2023-06-10 10:30',
    status: '已驳回',
    icon: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&h=300&auto=format&fit=crop',
    visitUrl: 'https://app.safety-warn.com/geo-hazard',
    version: 'v0.9.8-beta',
    description: '面向滑坡、泥石流高风险区域的实时监测预警App，支持传感器告警推送。',
    parameters: [
      { name: 'device_token', type: 'String', required: '是', desc: '推送令牌' }
    ],
    techStack: ['Flutter', 'Go', 'Redis'],
    tags: ['地灾预警', '应急管理', '实时监控'],
    processResult: '驳回说明：移动端App在低带宽环境下登录存在异常，且部分传感器协议解析不完整，请优化后再报。'
  }
];

export const AppReview: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalOpinion, setApprovalOpinion] = useState('');

  const stats = useMemo(() => {
    return {
      total: MOCK_APPS.length,
      pending: MOCK_APPS.filter(r => r.status === '待审核').length,
      approved: MOCK_APPS.filter(r => r.status === '已通过').length,
      rejected: MOCK_APPS.filter(r => r.status === '已驳回').length,
    };
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '待审核': return 'bg-amber-50 text-amber-600 border-amber-100';
      case '已通过': return 'bg-blue-50 text-blue-600 border-blue-100';
      case '已驳回': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const currentApp = useMemo(() => 
    MOCK_APPS.find(app => app.id === selectedId)
  , [selectedId]);

  const handleActionClick = (id: string) => {
    setSelectedId(id);
    setApprovalOpinion('');
    setView('detail');
  };

  if (view === 'detail' && currentApp) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col min-h-[600px] animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        {/* 详情头部 */}
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            {currentApp.status === '待审核' ? '应用审批详情' : '应用资源详情'}
          </h2>
          <button 
            onClick={() => setView('list')}
            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 详情内容区域 */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
            {/* 左侧主要信息 */}
            <div className="flex-[2] space-y-12">
              {/* 1. 基础信息 */}
              <section className="space-y-8">
                <h3 className="text-xl font-black text-gray-900 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                  基础信息
                </h3>
                <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">应用名称</p>
                    <p className="text-base font-bold text-gray-800">{currentApp.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">应用类型</p>
                    <p className="text-base font-bold text-gray-800">{currentApp.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">所属类目</p>
                    <p className="text-base font-bold text-gray-800">{currentApp.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">版本号</p>
                    <p className="text-base font-bold text-gray-800">{currentApp.version}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">状态</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(currentApp.status)}`}>
                      {currentApp.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">提交人</p>
                    <div className="flex items-center space-x-3">
                      <img src={currentApp.avatar} alt={currentApp.submitter} className="w-7 h-7 rounded-full" />
                      <span className="text-sm font-bold text-gray-700">{currentApp.submitter}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">访问地址</p>
                    <a href={currentApp.visitUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 flex items-center hover:underline">
                      {currentApp.visitUrl} <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </a>
                  </div>
                </div>
              </section>

              {/* 2. 应用描述 */}
              <section className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                  详情描述
                </h3>
                <div className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap bg-gray-50/50 p-8 rounded-[2rem] border border-dashed border-gray-200">
                  {currentApp.description}
                </div>
              </section>

              {/* 3. 审批逻辑 (仅审批模式) */}
              {currentApp.status === '待审核' && (
                <section className="space-y-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                    审批意见
                  </h3>
                  <div className="relative group">
                    <div className="absolute top-5 left-6">
                      <MessageSquareQuote className="w-6 h-6 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <textarea 
                      value={approvalOpinion}
                      onChange={(e) => setApprovalOpinion(e.target.value)}
                      rows={4}
                      placeholder="请输入详细的审批意见..."
                      className="w-full pl-16 pr-8 py-6 bg-gray-50 border border-gray-200 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-bold text-gray-700"
                    />
                  </div>
                </section>
              )}

              {/* 4. 审核结论 (仅详情模式) */}
              {(currentApp.status === '已通过' || currentApp.status === '已驳回') && (
                <section className="space-y-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                    审批结论
                  </h3>
                  <div className={`p-8 rounded-[2rem] border flex items-start ${
                    currentApp.status === '已通过' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                  }`}>
                    <div className="mr-5 mt-1">
                      {currentApp.status === '已通过' ? <CheckCircle2 className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8 text-rose-500" />}
                    </div>
                    <div>
                      <p className="font-black text-lg mb-2 uppercase tracking-tight">结论：{currentApp.status}</p>
                      <p className="text-sm font-bold opacity-80 italic leading-relaxed">
                        “{currentApp.processResult || '暂无详细记录。'}”
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* 右侧边栏 */}
            <div className="w-full lg:w-96 space-y-12">
              <section className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center">
                  <Monitor className="w-5 h-5 mr-3 text-blue-500" />
                  应用缩略图
                </h3>
                <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-blue-500/10 group aspect-[4/3]">
                  <img src={currentApp.icon} alt={currentApp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center">
                  <Cpu className="w-5 h-5 mr-3 text-blue-500" />
                  技术栈
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentApp.techStack.map((tech, i) => (
                    <span key={i} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100">
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center">
                  <Tag className="w-5 h-5 mr-3 text-blue-500" />
                  应用标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentApp.tags.map((tag, i) => (
                    <span key={i} className="px-5 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* 底部按钮栏 */}
        <div className="px-10 py-6 border-t border-gray-100 flex justify-end space-x-5 bg-white">
          {currentApp.status === '待审核' ? (
            <>
              <button onClick={() => setView('list')} className="px-10 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl text-sm font-black hover:bg-gray-50 transition-all uppercase tracking-widest active:scale-95">取消</button>
              <button onClick={() => setView('list')} className="px-10 py-3 bg-rose-500 text-white rounded-2xl text-sm font-black shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all uppercase tracking-widest active:scale-95">驳回</button>
              <button onClick={() => setView('list')} className="px-12 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95">通过</button>
            </>
          ) : (
            <button onClick={() => setView('list')} className="px-14 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95">关闭详情</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">应用审核总数</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.total}</h3>
          </div>
          <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner">
            <LayoutGrid className="w-7 h-7" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">待审核</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.pending}</h3>
          </div>
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
            <Clock className="w-7 h-7" />
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">已通过</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.approved}</h3>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">已驳回</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.rejected}</h3>
          </div>
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all shadow-inner">
            <Ban className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* 筛选区域 */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-900 font-black text-sm">筛选条件：</span>
          <div className="flex space-x-3">
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:bg-white transition-all cursor-pointer">
                <option>全部应用类型</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:bg-white transition-all cursor-pointer">
                <option>全部状态</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:bg-white transition-all cursor-pointer">
                <option>提交时间</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-1 justify-end max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input 
              type="text"
              placeholder="搜索应用名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:bg-white transition-all font-bold"
            />
          </div>
          <button className="flex items-center px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </button>
        </div>
      </div>

      {/* 应用列表 */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-50">
          <h4 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
            <Layers className="w-6 h-6 mr-3 text-blue-600" />
            应用资源审核列表
          </h4>
          <button className="flex items-center px-5 py-2 bg-blue-50 text-blue-600 rounded-xl text-[11px] font-black hover:bg-blue-100 transition-all uppercase tracking-widest">
             <ArrowUpDown className="w-3.5 h-3.5 mr-2" />
             最新优先
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">应用名称</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">应用类型</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">提交人</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">提交时间</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">状态</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_APPS.filter(app => app.name.includes(searchQuery)).map((app) => (
                <tr key={app.id} className="group hover:bg-blue-50/10 transition-all">
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                        <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-800">{app.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{app.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{app.type}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-3">
                      <img src={app.avatar} alt={app.submitter} className="w-8 h-8 rounded-full border border-gray-100 shadow-sm" />
                      <span className="text-sm text-gray-700 font-bold">{app.submitter}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs text-gray-400 font-bold tracking-tight">{app.submitTime}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-end">
                      {app.status === '待审核' ? (
                        <button 
                          onClick={() => handleActionClick(app.id)}
                          className="text-[11px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-[0.2em] transition-all"
                        >
                          审批
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActionClick(app.id)}
                          className="text-[11px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-[0.2em] transition-all"
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

        {/* 分页 */}
        <div className="px-10 py-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
          <span className="text-[11px] text-gray-400 font-black uppercase tracking-widest">
            显示 1 到 {MOCK_APPS.length} 条记录
          </span>
          <div className="flex items-center space-x-3">
            <button className="p-3 border border-gray-100 rounded-xl text-gray-300 hover:text-blue-600 transition-all disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl text-xs font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20">1</button>
            <button className="w-10 h-10 rounded-xl text-xs font-black text-gray-400 border border-gray-100 hover:bg-white transition-all">2</button>
            <button className="w-10 h-10 rounded-xl text-xs font-black text-gray-400 border border-gray-100 hover:bg-white transition-all">3</button>
            <button className="p-3 border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
