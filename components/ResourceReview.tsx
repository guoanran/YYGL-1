
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Clock, 
  CheckCircle, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  ListFilter,
  X,
  Monitor,
  Check,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Info,
  Calendar,
  Layers,
  MapPin,
  Tag,
  History,
  CheckCircle2,
  MessageSquareQuote,
  Copyright,
  Ban
} from 'lucide-react';

interface Props {
  title?: string;
}

interface BandInfo {
  name: string;
  res: string;
  desc: string;
}

interface ReviewRecord {
  id: string;
  name: string;
  type: string;
  submitter: string;
  avatar: string;
  submitTime: string;
  status: '待审核' | '已通过' | '已驳回';
  thumbnail: string;
  // 详情字段
  category?: string;
  visitUrl?: string;
  devLanguage?: string;
  version?: string;
  longDesc?: string;
  tags?: string[];
  screenshots?: string[];
  processResult?: string; // 审核处理结果
  resolution?: string;
  serviceMethod?: string;
  bands?: BandInfo[];
  copyright?: string;
}

const MOCK_RECORDS: ReviewRecord[] = [
  { 
    id: '1', 
    name: '高分辨率卫星遥感影像数据', 
    type: '数据资源', 
    category: '自然资源',
    submitter: '李工程师', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Erik',
    submitTime: '2023-06-15 09:23', 
    status: '待审核',
    resolution: '10m',
    serviceMethod: '文件下载',
    visitUrl: 'https://data-center.example.com/satellite-2023',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=100&h=100&auto=format&fit=crop',
    bands: [
      { name: '红光波段', res: '10m', desc: '用于植被监测' },
      { name: '近红外波段', res: '10m', desc: '用于生物量估算' }
    ],
    longDesc: '该资源包含了高精度的空间地理要素数据，支持多领域的空间分析与决策应用。影像覆盖了核心经济区域，数据质量经过严格校正。',
    tags: ['卫星影像', '2023', '高分辨率'],
    copyright: '版权所有 © 2023 光谷信息数据采集中心。未经许可，不得用于商业用途。',
    screenshots: ['https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop']
  },
  { 
    id: '2', 
    name: '城市扩张监测系统', 
    type: '应用资源', 
    category: '城市规划',
    submitter: '吴工程师', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Erik',
    submitTime: '2023-06-15 14:20', 
    status: '待审核',
    version: 'v1.0.0',
    devLanguage: 'JavaScript, Python',
    visitUrl: 'https://app.example.com/urban-expansion',
    tags: ['城市规划', '空间分析', '遥感监测'],
    longDesc: '城市扩张监测系统是一款基于遥感和GIS技术的城市发展监测工具，旨在帮助城市规划者和决策者客观评估城市扩张状况和发展趋势。',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=100&h=100&auto=format&fit=crop',
    copyright: '版权所有 © 2023 智慧城市研发中心。'
  },
  { 
    id: '3', 
    name: '高精度DEM地形数据', 
    type: '数据资源', 
    category: '水利水务',
    submitter: '赵工程师', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    submitTime: '2023-06-12 10:15', 
    status: '已通过',
    resolution: '30m',
    serviceMethod: '文件下载',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=100&h=100&auto=format&fit=crop',
    processResult: '该资源已通过审核。数据精度符合行业标准，元数据描述完整，已正式入库。',
    longDesc: '全国范围高精度DEM数据，支持水文分析、灾害评估等多种应用。',
    copyright: '版权所有 © 2023 国家地理信息局。',
    bands: [{ name: '高程波段', res: '30m', desc: '地形起伏特征' }]
  },
  { 
    id: '4', 
    name: '多光谱遥感数据', 
    type: '数据资源', 
    category: '自然资源',
    submitter: '陈研究员', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    submitTime: '2023-06-10 16:30', 
    status: '已驳回',
    resolution: '10m',
    serviceMethod: 'API接口',
    thumbnail: 'https://images.unsplash.com/photo-1504062843035-e96bd2ad1892?q=80&w=100&h=100&auto=format&fit=crop',
    processResult: '驳回意见：提交的数据包中缺少必要的坐标系定义文件（.prj），且影像云量较高。',
    longDesc: '覆盖重点林区的多光谱遥感数据，旨在支持森林火灾预警。',
    copyright: '版权所有 © 2023 环境保护监测站。'
  },
];

export const ResourceReview: React.FC<Props> = ({ title = '资源审核' }) => {
  const [view, setView] = useState<'list' | 'approve'>('list');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('全部状态');
  const [activeType, setActiveType] = useState('全部数据类型');
  const [approvalOpinion, setApprovalOpinion] = useState('');

  const stats = useMemo(() => {
    return {
      total: MOCK_RECORDS.length,
      pending: MOCK_RECORDS.filter(r => r.status === '待审核').length,
      approved: MOCK_RECORDS.filter(r => r.status === '已通过').length,
      rejected: MOCK_RECORDS.filter(r => r.status === '已驳回').length,
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

  const filteredRecords = useMemo(() => {
    return MOCK_RECORDS.filter(record => {
      const matchesSearch = record.name.includes(searchQuery);
      const matchesStatus = activeStatus === '全部状态' || record.status === activeStatus;
      const matchesType = activeType === '全部数据类型' || record.type === activeType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, activeStatus, activeType]);

  const handleApproveClick = (id: string) => {
    setSelectedRecordId(id);
    setApprovalOpinion('');
    setView('approve');
  };

  // 审批/详情视图组件
  const ApproveDetailView = () => {
    const record = MOCK_RECORDS.find(r => r.id === selectedRecordId);
    if (!record) return null;

    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col min-h-[600px] animate-in fade-in zoom-in-95 duration-300 overflow-hidden relative">
        {/* 头部 */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-20">
          <h2 className="text-xl font-black text-gray-800 tracking-tight">
            {record.status === '待审核' ? '资源审批' : '资源详情'}
          </h2>
          <button 
            onClick={() => setView('list')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 详情内容 */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* 左侧主要信息 */}
            <div className="flex-[2] space-y-12">
              {/* 1. 基本信息 */}
              <section className="space-y-6">
                <h3 className="text-xl font-black text-gray-800 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                  基本信息
                </h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">资源名称</p>
                    <p className="text-base font-bold text-gray-700">{record.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">资源类型</p>
                    <p className="text-base font-bold text-gray-700">{record.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">
                      {record.type === '应用资源' ? '开发语言' : '服务方式'}
                    </p>
                    <p className="text-base font-bold text-gray-700">
                      {record.type === '应用资源' ? (record.devLanguage || 'JavaScript, Python') : (record.serviceMethod || '文件下载')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">
                       {record.type === '应用资源' ? '版本号' : '分辨率'}
                    </p>
                    <p className="text-base font-bold text-gray-700">
                       {record.type === '应用资源' ? (record.version || 'v1.0.0') : (record.resolution || '-')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">提交人</p>
                    <p className="text-base font-bold text-gray-700">{record.submitter}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">提交时间</p>
                    <p className="text-base font-bold text-gray-700">{record.submitTime}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-400 font-medium mb-1">审核状态</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                </div>
              </section>

              {/* 2. 波段信息 (仅数据资源展示) */}
              {record.type === '数据资源' && record.bands && record.bands.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-xl font-black text-gray-800 flex items-center">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                    波段信息
                  </h3>
                  <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100/50">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">波段名称</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">分辨率</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">描述信息</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {record.bands.map((band, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4 text-sm font-bold text-gray-700">{band.name}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-700">{band.res}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{band.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* 3. 详情描述 */}
              <section className="space-y-4">
                <h3 className="text-xl font-black text-gray-800 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                  详情描述
                </h3>
                <div className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
                  {record.longDesc || '暂无详细描述信息。'}
                </div>
              </section>

              {/* 4. 审批意见 (仅审批模式展示) */}
              {record.status === '待审核' && (
                <section className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-xl font-black text-gray-800 flex items-center">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                    审批意见
                  </h3>
                  <div className="relative group">
                    <div className="absolute top-4 left-5">
                      <MessageSquareQuote className="w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <textarea 
                      value={approvalOpinion}
                      onChange={(e) => setApprovalOpinion(e.target.value)}
                      rows={4}
                      placeholder="请输入具体的审核处理意见或备注信息..."
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-medium text-gray-700"
                    />
                  </div>
                </section>
              )}

              {/* 5. 处理结果 (仅详情模式展示) */}
              {(record.status === '已通过' || record.status === '已驳回') && (
                <section className="space-y-4">
                  <h3 className="text-xl font-black text-gray-800 flex items-center">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                    处理结果
                  </h3>
                  <div className={`p-6 rounded-2xl border flex items-start ${
                    record.status === '已通过' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
                    'bg-rose-50 border-rose-100 text-rose-700'
                  }`}>
                    <div className="mr-4 mt-0.5">
                      {record.status === '已通过' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-black text-base mb-2">
                        审核结论：{record.status}
                      </p>
                      <p className="text-sm leading-relaxed opacity-80 italic font-medium">
                        “{record.processResult || '暂无详细处理说明。审核流程已归档。'}”
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* 右侧辅助信息 */}
            <div className="flex-1 space-y-10">
              {/* 1. 缩略图/截图 */}
              <section className="space-y-4">
                <h3 className="text-lg font-black text-gray-800">资源缩略图</h3>
                <div className="bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 aspect-video flex items-center justify-center shadow-2xl shadow-blue-500/5">
                  {record.screenshots && record.screenshots.length > 0 ? (
                    <img src={record.screenshots[0]} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : record.thumbnail ? (
                    <img src={record.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-300 flex flex-col items-center">
                      <Monitor className="w-12 h-12 mb-2" />
                      <span className="text-xs font-bold">暂无图片</span>
                    </div>
                  )}
                </div>
              </section>

              {/* 2. 标签信息 */}
              <section className="space-y-4">
                <h3 className="text-lg font-black text-gray-800">标签信息</h3>
                <div className="flex flex-wrap gap-3">
                  {(record.tags || ['数据分析', '空间地理']).map((tag, i) => {
                    const colors = ['bg-blue-50 text-blue-600', 'bg-emerald-50 text-emerald-600', 'bg-purple-50 text-purple-600'];
                    return (
                      <span key={i} className={`px-4 py-1.5 rounded-xl text-xs font-bold ${colors[i % colors.length]}`}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </section>

              {/* 3. 版权信息 */}
              <section className="space-y-4">
                <h3 className="text-lg font-black text-gray-800 flex items-center">
                   <Copyright className="w-5 h-5 mr-2 text-gray-400" />
                   版权信息
                </h3>
                <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 text-xs text-gray-500 leading-relaxed font-medium italic">
                  {record.copyright || '暂无版权说明。该资源版权归属原提供方所有。'}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="px-8 py-5 border-t border-gray-100 flex justify-end space-x-4 bg-white z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          {record.status === '待审核' ? (
            <>
              <button 
                onClick={() => setView('list')}
                className="px-8 py-2.5 bg-gray-100 text-gray-500 rounded-lg font-bold text-sm hover:bg-gray-200 transition-all shadow-sm"
              >
                取消
              </button>
              <button 
                onClick={() => setView('list')}
                className="px-8 py-2.5 bg-rose-500 text-white rounded-lg font-bold text-sm shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
              >
                驳回
              </button>
              <button 
                onClick={() => setView('list')}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >
                通过
              </button>
            </>
          ) : (
            <button 
              onClick={() => setView('list')}
              className="px-12 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              关闭
            </button>
          )}
        </div>
      </div>
    );
  };

  if (view === 'approve') {
    return <ApproveDetailView />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">审核总数</p>
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
            <CheckCircle className="w-7 h-7" />
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

      {/* 筛选栏 */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-900 font-black text-sm tracking-tight">筛选条件：</span>
          <div className="flex space-x-3">
            <div className="relative">
              <select 
                value={activeType}
                onChange={(e) => setActiveType(e.target.value)}
                className="appearance-none pl-5 pr-12 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none hover:bg-white transition-all cursor-pointer"
              >
                <option>全部数据类型</option>
                <option>数据资源</option>
                <option>服务资源</option>
                <option>应用资源</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={activeStatus}
                onChange={(e) => setActiveStatus(e.target.value)}
                className="appearance-none pl-5 pr-12 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none hover:bg-white transition-all cursor-pointer"
              >
                <option>全部状态</option>
                <option>待审核</option>
                <option>已通过</option>
                <option>已驳回</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-1 justify-end">
          <div className="relative group w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="搜索资源名称..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
            <ListFilter className="w-4 h-4 mr-2" />
            筛选
          </button>
        </div>
      </div>

      {/* 列表卡片 */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-50">
          <h4 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
            <ShieldCheck className="w-6 h-6 mr-3 text-blue-600" />
            {title}列表
          </h4>
          <div className="flex items-center bg-blue-50 text-blue-600 px-5 py-2 rounded-xl text-[11px] font-black cursor-pointer hover:bg-blue-100 transition-all uppercase tracking-widest">
             <ArrowUpDown className="w-3.5 h-3.5 mr-2" />
             最新优先
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">资源名称</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">资源类型</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">提交人</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">提交时间</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">状态</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="group hover:bg-blue-50/10 transition-all">
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                        <img src={record.thumbnail} alt={record.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-black text-gray-700 line-clamp-1">{record.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{record.type}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-3">
                      <img src={record.avatar} alt={record.submitter} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                      <span className="text-sm text-gray-600 font-bold">{record.submitter}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs text-gray-400 font-bold tracking-tight">{record.submitTime}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-end space-x-6">
                      {record.status === '待审核' ? (
                        <button 
                          onClick={() => handleApproveClick(record.id)}
                          className="text-[11px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-[0.2em]"
                        >
                          审批
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleApproveClick(record.id)}
                          className="text-[11px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-[0.2em]"
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
            显示 1 到 {filteredRecords.length} 条，共 {MOCK_RECORDS.length} 条记录
          </span>
          <div className="flex items-center space-x-3">
            <button className="p-3 border border-gray-100 rounded-xl text-gray-300 hover:text-blue-600 hover:bg-white transition-all disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl text-xs font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20">1</button>
            <button className="w-10 h-10 rounded-xl text-xs font-black text-gray-400 border border-gray-100 hover:bg-white transition-all">2</button>
            <button className="w-10 h-10 rounded-xl text-xs font-black text-gray-400 border border-gray-100 hover:bg-white transition-all">3</button>
            <button className="p-3 border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
