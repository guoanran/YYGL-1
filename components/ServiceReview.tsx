
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
  BellRing,
  MoreHorizontal,
  TrendingUp,
  Database,
  X,
  ExternalLink,
  ShieldCheck,
  MessageSquareQuote,
  Layers,
  Info,
  Tag,
  Monitor,
  FileText,
  Ban
} from 'lucide-react';

interface Parameter {
  name: string;
  type: string;
  required: string;
  desc: string;
}

interface ReviewItem {
  id: string;
  name: string;
  type: string;
  submitter: string;
  avatar: string;
  submitTime: string;
  status: '待审核' | '已通过' | '已驳回';
  icon: string;
  iconBg: string;
  // 详情扩展字段
  category: string;
  url: string;
  description: string;
  parameters: Parameter[];
  tags: string[];
  thumbnail: string;
  processResult?: string;
}

const MOCK_DATA: ReviewItem[] = [
  {
    id: '1',
    name: '空间查询分析服务',
    type: '空间分析服务',
    category: '自然资源',
    submitter: '刘工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    submitTime: '2023-06-15 11:30',
    status: '待审核',
    icon: 'Search',
    iconBg: 'bg-blue-50 text-blue-500',
    url: 'https://api.gis-service.com/v1/spatial-query',
    description: '提供基于行政区划、经纬度范围以及自定义几何图形的空间数据检索与叠加分析服务。支持亚秒级响应，适用于大规模地理要素的快速筛选。',
    parameters: [
      { name: 'geometry', type: 'JSON', required: '是', desc: '查询的几何图形定义' },
      { name: 'layer_id', type: 'String', required: '是', desc: '目标图层唯一标识' },
      { name: 'buffer_distance', type: 'Number', required: '否', desc: '缓冲区分析距离(米)' }
    ],
    tags: ['空间分析', '高性能', '自然资源'],
    thumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: '遥感影像处理服务',
    type: '数据处理服务',
    category: '生态环境',
    submitter: '黄技术员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    submitTime: '2023-06-14 14:20',
    status: '待审核',
    icon: 'Database',
    iconBg: 'bg-emerald-50 text-emerald-500',
    url: 'https://api.gis-service.com/v1/rs-processing',
    description: '全自动遥感影像预处理算子，包含辐射定标、大气校正及正射校正功能。针对国产高分系列卫星进行了深度算法优化。',
    parameters: [
      { name: 'image_id', type: 'String', required: '是', desc: '原始影像ID' },
      { name: 'process_type', type: 'Enum', required: '是', desc: '处理类型：RPC/ATM/RAD' }
    ],
    tags: ['遥感影像', '自动处理', '国产高分'],
    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: '空间统计分析服务',
    type: '空间分析服务',
    category: '社会综合',
    submitter: '郑研究员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    submitTime: '2023-06-12 09:45',
    status: '已通过',
    icon: 'TrendingUp',
    iconBg: 'bg-purple-50 text-purple-500',
    url: 'https://api.gis-service.com/v1/spatial-stats',
    description: '提供克里金插值、热力图生成以及莫兰指数计算等高级空间计量经济学分析功能。',
    parameters: [
      { name: 'points', type: 'Array', required: '是', desc: '采样点坐标及权重值' },
      { name: 'method', type: 'String', required: '否', desc: '统计方法选择' }
    ],
    tags: ['空间统计', '热力图', '插值算法'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bbda48658a7d?q=80&w=800&auto=format&fit=crop',
    processResult: '该服务经过性能测试，QPS达标，参数描述详尽，已准予上架。'
  },
  {
    id: '4',
    name: '地名地址匹配服务',
    type: '地理编码服务',
    category: '城市治理',
    submitter: '陈技术员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
    submitTime: '2023-06-10 16:30',
    status: '已驳回',
    icon: 'MapPin',
    iconBg: 'bg-rose-50 text-rose-500',
    url: 'https://api.gis-service.com/v1/geocoding',
    description: '将非规范的中文文本地址转换为精确的WGS84坐标点，支持语义模糊匹配与智能联想。',
    parameters: [
      { name: 'address', type: 'String', required: '是', desc: '中文文本地址' },
      { name: 'city_limit', type: 'String', required: '否', desc: '城市限制范围' }
    ],
    tags: ['地理编码', '语义识别', '城市治理'],
    thumbnail: 'https://images.unsplash.com/photo-1496560230580-27a27ec29ca4?q=80&w=800&auto=format&fit=crop',
    processResult: '驳回说明：API响应中的坐标偏移超出了行业允许范围（>50米），请核对地址库底数及纠偏算法。'
  }
];

export const ServiceReview: React.FC = () => {
  const [view, setView] = useState<'list' | 'approve'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalOpinion, setApprovalOpinion] = useState('');

  const stats = useMemo(() => {
    return {
      total: MOCK_DATA.length,
      pending: MOCK_DATA.filter(r => r.status === '待审核').length,
      approved: MOCK_DATA.filter(r => r.status === '已通过').length,
      rejected: MOCK_DATA.filter(r => r.status === '已驳回').length,
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

  const handleActionClick = (id: string) => {
    setSelectedId(id);
    setApprovalOpinion('');
    setView('approve');
  };

  const currentItem = useMemo(() => 
    MOCK_DATA.find(item => item.id === selectedId)
  , [selectedId]);

  if (view === 'approve' && currentItem) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col min-h-[600px] animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        {/* 详情头部 */}
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            {currentItem.status === '待审核' ? '服务审批详情' : '服务资源详情'}
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
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">服务名称</p>
                    <p className="text-base font-bold text-gray-800">{currentItem.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">服务类型</p>
                    <p className="text-base font-bold text-gray-800">{currentItem.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">所属类目</p>
                    <p className="text-base font-bold text-gray-800">{currentItem.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">状态</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(currentItem.status)}`}>
                      {currentItem.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">提交人</p>
                    <div className="flex items-center space-x-3">
                      <img src={currentItem.avatar} alt={currentItem.submitter} className="w-7 h-7 rounded-full" />
                      <span className="text-sm font-bold text-gray-700">{currentItem.submitter}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">提交时间</p>
                    <p className="text-sm font-bold text-gray-600">{currentItem.submitTime}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">访问地址</p>
                    <a href={currentItem.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 flex items-center hover:underline">
                      {currentItem.url} <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </a>
                  </div>
                </div>
              </section>

              {/* 2. 接口参数 */}
              <section className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                  接口参数
                </h3>
                <div className="bg-gray-50/50 rounded-3xl overflow-hidden border border-gray-100">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100/50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">参数名称</th>
                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">类型</th>
                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">是否必填</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">描述信息</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentItem.parameters.map((param, i) => (
                        <tr key={i} className="hover:bg-white transition-colors">
                          <td className="px-8 py-5 text-sm font-black text-gray-800">{param.name}</td>
                          <td className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">{param.type}</td>
                          <td className="px-6 py-5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${param.required === '是' ? 'text-amber-600 bg-amber-50' : 'text-gray-400 bg-gray-50'}`}>
                              {param.required}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm text-gray-600 font-medium italic">“{param.desc}”</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 3. 服务描述 */}
              <section className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                  服务描述
                </h3>
                <div className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap bg-gray-50/50 p-8 rounded-[2rem] border border-dashed border-gray-200">
                  {currentItem.description}
                </div>
              </section>

              {/* 4. 审批意见 (仅审批时展示) */}
              {currentItem.status === '待审核' && (
                <section className="space-y-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                    审批处理
                  </h3>
                  <div className="relative group">
                    <div className="absolute top-5 left-6">
                      <MessageSquareQuote className="w-6 h-6 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <textarea 
                      value={approvalOpinion}
                      onChange={(e) => setApprovalOpinion(e.target.value)}
                      rows={4}
                      placeholder="请输入具体的审批意见或反馈信息..."
                      className="w-full pl-16 pr-8 py-6 bg-gray-50 border border-gray-200 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-bold text-gray-700"
                    />
                  </div>
                </section>
              )}

              {/* 5. 处理记录 (已通过/驳回时展示) */}
              {(currentItem.status === '已通过' || currentItem.status === '已驳回') && (
                <section className="space-y-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                    审批结论
                  </h3>
                  <div className={`p-8 rounded-[2rem] border flex items-start ${
                    currentItem.status === '已通过' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                  }`}>
                    <div className="mr-5 mt-1">
                      {currentItem.status === '已通过' ? <CheckCircle2 className="w-8 h-8" /> : <BellRing className="w-8 h-8" />}
                    </div>
                    <div>
                      <p className="font-black text-lg mb-2 uppercase tracking-tight">审核：{currentItem.status}</p>
                      <p className="text-sm font-bold opacity-80 italic leading-relaxed">
                        “{currentItem.processResult || '暂无详细审批结论。'}”
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* 右侧侧边栏：缩略图、标签 */}
            <div className="w-full lg:w-96 space-y-12">
              <section className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center">
                  <Monitor className="w-5 h-5 mr-3 text-blue-500" />
                  服务缩略图
                </h3>
                <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-blue-500/10 group aspect-[4/3]">
                  <img 
                    src={currentItem.thumbnail} 
                    alt={currentItem.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center">
                  <Tag className="w-5 h-5 mr-3 text-blue-500" />
                  服务标签
                </h3>
                <div className="flex flex-wrap gap-3">
                  {currentItem.tags.map((tag, i) => (
                    <span key={i} className="px-5 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              <section className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <h4 className="text-sm font-black text-gray-900 mb-4 flex items-center">
                  <Info className="w-4 h-4 mr-2 text-blue-500" /> 审批提示
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium italic">
                  请在审核过程中核对服务的API规范性、参数必填项的合理性以及详情描述的准确性。通过后的服务将同步发布至算子服务大厅。
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-10 py-6 border-t border-gray-100 flex justify-end space-x-5 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.02)]">
          {currentItem.status === '待审核' ? (
            <>
              <button 
                onClick={() => setView('list')}
                className="px-10 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl text-sm font-black hover:bg-gray-50 transition-all shadow-sm active:scale-95 uppercase tracking-widest"
              >
                取消
              </button>
              <button 
                onClick={() => setView('list')}
                className="px-10 py-3 bg-rose-500 text-white rounded-2xl text-sm font-black shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 uppercase tracking-widest"
              >
                驳回
              </button>
              <button 
                onClick={() => setView('list')}
                className="px-12 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest"
              >
                通过
              </button>
            </>
          ) : (
            <button 
              onClick={() => setView('list')}
              className="px-14 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest"
            >
              关闭
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">服务审核总数</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.total}</h3>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
            <FileText className="w-7 h-7" />
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

      {/* Filter Row */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-900 font-black text-sm">筛选条件：</span>
          <div className="flex space-x-3">
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:bg-white transition-all cursor-pointer">
                <option>全部服务类型</option>
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="搜索服务名称..."
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

      {/* List Card */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
          <h4 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
            <ShieldCheck className="w-6 h-6 mr-3 text-blue-600" />
            服务资源审核列表
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
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">服务名称</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">服务类型</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">提交人</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">提交时间</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">状态</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_DATA.filter(item => item.name.includes(searchQuery)).map((item) => (
                <tr key={item.id} className="group hover:bg-blue-50/10 transition-all">
                  <td className="px-10 py-7">
                    <div className="flex items-center space-x-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${item.iconBg} transition-transform group-hover:scale-105 duration-500`}>
                        {item.icon === 'Search' && <Search className="w-6 h-6" />}
                        {item.icon === 'Database' && <Database className="w-6 h-6" />}
                        {item.icon === 'TrendingUp' && <TrendingUp className="w-6 h-6" />}
                        {item.icon === 'MapPin' && <Clock className="w-6 h-6" />}
                      </div>
                      <span className="text-sm font-black text-gray-800 line-clamp-1">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-7">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.type}</span>
                  </td>
                  <td className="px-6 py-7">
                    <div className="flex items-center space-x-3">
                      <img src={item.avatar} alt={item.submitter} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                      <span className="text-sm text-gray-600 font-bold">{item.submitter}</span>
                    </div>
                  </td>
                  <td className="px-6 py-7">
                    <span className="text-xs text-gray-400 font-bold tracking-tight">{item.submitTime}</span>
                  </td>
                  <td className="px-6 py-7 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center justify-end">
                      {item.status === '待审核' ? (
                        <button 
                          onClick={() => handleActionClick(item.id)}
                          className="text-[11px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-[0.2em] transition-all"
                        >
                          审批
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActionClick(item.id)}
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

        {/* Footer */}
        <div className="px-10 py-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
          <span className="text-[11px] text-gray-400 font-black uppercase tracking-widest">
            显示 1 到 4 条，共 12 条记录
          </span>
          <div className="flex items-center space-x-2">
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
