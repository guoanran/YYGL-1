
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
  Map as MapIcon,
  Globe,
  X,
  ExternalLink,
  ShieldCheck,
  MessageSquareQuote,
  Layers,
  Info,
  Tag,
  Monitor,
  Ban,
  Maximize2
} from 'lucide-react';

interface LayerInfo {
  name: string;
  type: string;
  desc: string;
}

interface MapReviewItem {
  id: string;
  name: string;
  type: string;
  category: string;
  submitter: string;
  avatar: string;
  submitTime: string;
  status: '待审核' | '已通过' | '已驳回';
  thumbnail: string;
  // 详情扩展字段
  coordinateSystem: string;
  serviceMethod: string;
  zoomLevel: string;
  description: string;
  layers: LayerInfo[];
  tags: string[];
  url: string;
  processResult?: string;
  copyright?: string;
}

const MOCK_MAPS: MapReviewItem[] = [
  {
    id: '1',
    name: '武汉市影像电子地图',
    type: '栅格瓦片',
    category: '影像地图',
    submitter: '张工',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    submitTime: '2023-06-20 14:12',
    status: '待审核',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=400&h=300&auto=format&fit=crop',
    coordinateSystem: 'Web Mercator',
    serviceMethod: 'XYZ Tiles',
    zoomLevel: 'L10 - L20',
    description: '基于0.5米分辨率航空影像制作的武汉市数字正射影像图(DOM)，色彩均衡，无云遮挡。适用于城市规划、交通导航底图。',
    layers: [
      { name: '影像底图', type: 'Raster', desc: '全域0.5米影像' }
    ],
    tags: ['影像地图', '武汉', '高分辨率'],
    url: 'https://map.example.com/wuhan/dom',
    copyright: '版权所有 © 武汉市地理信息中心'
  },
  {
    id: '2',
    name: '天地图·湖北矢量底图',
    type: '矢量瓦片',
    category: '基础底图',
    submitter: '李主任',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    submitTime: '2023-06-15 09:23',
    status: '已通过',
    thumbnail: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&h=300&auto=format&fit=crop',
    coordinateSystem: 'CGCS2000',
    serviceMethod: 'WMTS服务',
    zoomLevel: 'L1 - L18',
    description: '湖北省最新全要素矢量电子地图，包含水系、居民地、交通网等基础地理要素。数据源自省测绘局最新基础测绘成果。',
    layers: [
      { name: '居民地', type: 'Polygon', desc: '全省居民地分布' },
      { name: '路网', type: 'LineString', desc: '高速、国道、省道' }
    ],
    tags: ['矢量', '湖北', '电子地图'],
    url: 'https://map.example.com/hubei/vector',
    processResult: '数据完整性校验通过，图层属性字段规范，准予发布。',
    copyright: '版权所有 © 湖北省测绘地理信息局'
  },
  {
    id: '3',
    name: '长江流域水系专题图',
    type: 'WMS服务',
    category: '专题地图',
    submitter: '赵科长',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    submitTime: '2023-05-20 09:00',
    status: '已驳回',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&h=300&auto=format&fit=crop',
    coordinateSystem: 'WGS84',
    serviceMethod: 'WMS',
    zoomLevel: 'L5 - L12',
    description: '展示长江流域干流及主要支流分布、水文站点位置的专题地图服务。',
    layers: [
      { name: '水系', type: 'LineString', desc: '主要河流' },
      { name: '水文站', type: 'Point', desc: '监测站点' }
    ],
    tags: ['专题图', '水利', '长江'],
    url: 'https://map.example.com/yangtze/hydro',
    processResult: '驳回原因：部分支流标注名称有误，且图例配置不符合制图规范，请修正后重新提交。',
    copyright: '版权所有 © 长江水利委员会'
  },
  {
    id: '4',
    name: '光谷中心城三维白模',
    type: '3D Tiles',
    category: '三维地图',
    submitter: '王组长',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
    submitTime: '2023-06-10 16:45',
    status: '待审核',
    thumbnail: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=400&h=300&auto=format&fit=crop',
    coordinateSystem: 'WGS84',
    serviceMethod: '3D Tiles',
    zoomLevel: '-',
    description: '光谷中心城区域L1级建筑白模数据，支持Cesium等三维引擎加载。高度还原城市肌理。',
    layers: [
      { name: '建筑白模', type: '3D Model', desc: 'L1级建筑模型' }
    ],
    tags: ['三维', '白模', '光谷'],
    url: 'https://map.example.com/guanggu/3d',
    copyright: '版权所有 © 光谷建设规划局'
  }
];

export const MapReview: React.FC = () => {
  const [view, setView] = useState<'list' | 'approve'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalOpinion, setApprovalOpinion] = useState('');

  const stats = useMemo(() => {
    return {
      total: MOCK_MAPS.length,
      pending: MOCK_MAPS.filter(r => r.status === '待审核').length,
      approved: MOCK_MAPS.filter(r => r.status === '已通过').length,
      rejected: MOCK_MAPS.filter(r => r.status === '已驳回').length,
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
    MOCK_MAPS.find(item => item.id === selectedId)
  , [selectedId]);

  // 审批/详情视图
  if (view === 'approve' && currentItem) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col min-h-[600px] animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        {/* 头部 */}
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            {currentItem.status === '待审核' ? '地图资源审批' : '地图资源详情'}
          </h2>
          <button 
            onClick={() => setView('list')}
            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
            
            {/* 左侧信息 */}
            <div className="flex-[2] space-y-12">
              {/* 1. 基础信息 */}
              <section className="space-y-8">
                <h3 className="text-xl font-black text-gray-900 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                  基础信息
                </h3>
                <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">地图名称</p>
                    <p className="text-base font-bold text-gray-800">{currentItem.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">地图类型</p>
                    <p className="text-base font-bold text-gray-800">{currentItem.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">所属类目</p>
                    <p className="text-base font-bold text-gray-800">{currentItem.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">服务标准</p>
                    <p className="text-base font-bold text-gray-800">{currentItem.serviceMethod}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">坐标系</p>
                    <p className="text-base font-bold text-gray-800">{currentItem.coordinateSystem}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">缩放级别</p>
                    <p className="text-base font-bold text-gray-800">{currentItem.zoomLevel}</p>
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
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">审核状态</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(currentItem.status)}`}>
                      {currentItem.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">服务地址</p>
                    <a href={currentItem.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 flex items-center hover:underline">
                      {currentItem.url} <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </a>
                  </div>
                </div>
              </section>

              {/* 2. 图层信息 */}
              <section className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                  图层信息
                </h3>
                <div className="bg-gray-50/50 rounded-3xl overflow-hidden border border-gray-100">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100/50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">图层名称</th>
                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">几何类型</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">描述信息</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentItem.layers.map((layer, i) => (
                        <tr key={i} className="hover:bg-white transition-colors">
                          <td className="px-8 py-5 text-sm font-black text-gray-800">{layer.name}</td>
                          <td className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">{layer.type}</td>
                          <td className="px-8 py-5 text-sm text-gray-600 font-medium italic">“{layer.desc}”</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 3. 详情描述 */}
              <section className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                  地图描述
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

            {/* 右侧侧边栏 */}
            <div className="w-full lg:w-96 space-y-12">
              <section className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center">
                  <Monitor className="w-5 h-5 mr-3 text-blue-500" />
                  地图预览
                </h3>
                <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-blue-500/10 group aspect-square relative">
                  <img 
                    src={currentItem.thumbnail} 
                    alt={currentItem.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition-colors">
                       <Maximize2 className="w-6 h-6" />
                     </button>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center">
                  <Tag className="w-5 h-5 mr-3 text-blue-500" />
                  地图标签
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
                  重点审核地图数据的坐标系兼容性、图层叠加效果以及服务响应速度。对于涉密数据，请确认其脱密处理情况。
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

  // 列表视图
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 顶部统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">地图审核总数</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.total}</h3>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
            <MapIcon className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">待审核</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.pending}</h3>
          </div>
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
            <Clock className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">已通过</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.approved}</h3>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

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
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-900 font-black text-sm">筛选条件：</span>
          <div className="flex space-x-3">
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:bg-white transition-all cursor-pointer">
                <option>全部地图类型</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:bg-white transition-all cursor-pointer">
                <option>全部状态</option>
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
              placeholder="搜索地图名称..."
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

      {/* 列表 */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
          <h4 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
            <ShieldCheck className="w-6 h-6 mr-3 text-blue-600" />
            地图资源审核列表
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
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">地图名称</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">地图类型</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">提交人</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">提交时间</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">状态</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_MAPS.filter(item => item.name.includes(searchQuery)).map((item) => (
                <tr key={item.id} className="group hover:bg-blue-50/10 transition-all">
                  <td className="px-10 py-7">
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                        <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-800 line-clamp-1">{item.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.category}</span>
                      </div>
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
            显示 1 到 {MOCK_MAPS.length} 条记录
          </span>
          <div className="flex items-center space-x-2">
            <button className="p-3 border border-gray-100 rounded-xl text-gray-300 hover:text-blue-600 transition-all disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl text-xs font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20">1</button>
            <button className="w-10 h-10 rounded-xl text-xs font-black text-gray-400 border border-gray-100 hover:bg-white transition-all">2</button>
            <button className="p-3 border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
