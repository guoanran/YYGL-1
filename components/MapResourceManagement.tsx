
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  Map as MapIcon, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Upload, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle,
  Layers,
  Globe
} from 'lucide-react';

interface Props {
  title?: string;
}

interface LayerInfo {
  name: string;
  type: string;
  desc: string;
}

interface MapResourceItem {
  id: number;
  name: string;
  category: string;
  type: string;
  desc: string;
  status: '已通过' | '已驳回' | '待审核' | '草稿中';
  publishTime: string;
  thumbnail: string;
  // 详情字段
  serviceMethod?: string;
  coordinateSystem?: string;
  submitter?: string;
  submitTime?: string;
  visitUrl?: string;
  layers?: LayerInfo[];
  longDesc?: string;
  tags?: string[];
  copyright?: string;
  rejectReason?: string;
  zoomLevel?: string;
}

const MOCK_MAP_RESOURCES: MapResourceItem[] = [
  {
    id: 1,
    name: '天地图·湖北矢量底图',
    category: '基础底图',
    type: '矢量瓦片',
    desc: '湖北省最新全要素矢量电子地图，包含水系、居民地、交通网等基础地理要素。',
    status: '已通过',
    publishTime: '2023-06-15 09:23',
    thumbnail: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&h=300&auto=format&fit=crop',
    serviceMethod: 'WMTS服务',
    coordinateSystem: 'CGCS2000',
    submitter: '地图中心',
    submitTime: '2023-06-15 09:23',
    visitUrl: 'https://map.example.com/hubei/vector',
    layers: [
      { name: '居民地', type: 'Polygon', desc: '全省居民地分布' },
      { name: '路网', type: 'LineString', desc: '高速、国道、省道及县乡道' }
    ],
    longDesc: '本底图数据源自省测绘局最新基础测绘成果，经过脱密处理。采用矢量瓦片技术发布，支持前端动态配图与高分辨率显示。适用于政府决策、公众服务等通用场景。',
    tags: ['矢量', '湖北', '电子地图'],
    copyright: '版权所有 © 湖北省测绘地理信息局',
    zoomLevel: 'L1 - L18'
  },
  {
    id: 2,
    name: '武汉市影像电子地图',
    category: '影像地图',
    type: '栅格瓦片',
    desc: '基于0.5米分辨率航空影像制作的武汉市数字正射影像图(DOM)。',
    status: '待审核',
    publishTime: '-',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=400&h=300&auto=format&fit=crop',
    submitter: '张工',
    submitTime: '2023-06-20 14:12',
    serviceMethod: 'XYZ Tiles',
    coordinateSystem: 'Web Mercator',
    zoomLevel: 'L10 - L20'
  },
  {
    id: 3,
    name: '光谷中心城三维白模',
    category: '三维地图',
    type: '3D Tiles',
    desc: '光谷中心城区域L1级建筑白模数据，支持Cesium等三维引擎加载。',
    status: '草稿中',
    publishTime: '-',
    thumbnail: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=400&h=300&auto=format&fit=crop',
    submitter: '王组长',
    submitTime: '2023-06-10 16:45'
  },
  {
    id: 4,
    name: '长江流域水系专题图',
    category: '专题地图',
    type: 'WMS服务',
    desc: '展示长江流域干流及主要支流分布、水文站点位置的专题地图服务。',
    status: '已驳回',
    publishTime: '-',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&h=300&auto=format&fit=crop',
    submitter: '赵科长',
    submitTime: '2023-05-20 09:00',
    rejectReason: '部分支流标注名称有误，且图例配置不规范，请修正后重新提交。'
  }
];

const MAP_CATEGORIES = [
  "基础底图",
  "专题地图",
  "三维地图",
  "影像地图",
  "室内地图"
];

export const MapResourceManagement: React.FC<Props> = ({ title = '地图资源' }) => {
  const [view, setView] = useState<'list' | 'add' | 'edit' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);

  // 筛选状态
  const [statusFilter, setStatusFilter] = useState('全部状态');
  const [categoryFilter, setCategoryFilter] = useState('全部类目');

  // 弹窗状态
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<MapResourceItem | null>(null);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

  // 表单状态
  const [formName, setFormName] = useState('');
  const [publishCategory, setPublishCategory] = useState('');
  const [mapType, setMapType] = useState('');
  const [coordinateSystem, setCoordinateSystem] = useState('');
  const [zoomLevel, setZoomLevel] = useState('');
  const [layers, setLayers] = useState<LayerInfo[]>([{ name: '', type: '', desc: '' }]);
  const [tags, setTags] = useState<string[]>([]);
  const [copyright, setCopyright] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [tempSelectedCategory, setTempSelectedCategory] = useState<string | null>(null);
  const [modalCategorySearch, setModalCategorySearch] = useState('');

  // 过滤列表
  const filteredResources = useMemo(() => {
    return MOCK_MAP_RESOURCES.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === '全部状态' || res.status === statusFilter;
      const matchesCategory = categoryFilter === '全部类目' || res.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter]);

  const confirmCategorySelection = () => {
    if (tempSelectedCategory) {
      setPublishCategory(tempSelectedCategory);
    }
    setIsCategoryModalOpen(false);
  };

  const handleReset = () => {
    setFormName('');
    setPublishCategory('');
    setMapType('');
    setCoordinateSystem('');
    setZoomLevel('');
    setLayers([{ name: '', type: '', desc: '' }]);
    setTags([]);
    setCopyright('');
    setDescription('');
    setThumbnailUrl(null);
    setTempSelectedCategory(null);
  };

  const handleViewDetail = (id: number) => {
    setSelectedResourceId(id);
    setView('detail');
  };

  const handleAddClick = () => {
    handleReset();
    setView('add');
  };

  const handleEditClick = (res: MapResourceItem) => {
    setSelectedResourceId(res.id);
    setFormName(res.name);
    setPublishCategory(res.category || ''); 
    setMapType(res.type || '');
    setCoordinateSystem(res.coordinateSystem || '');
    setZoomLevel(res.zoomLevel || '');
    setLayers(res.layers || [{ name: '', type: '', desc: '' }]);
    setTags(res.tags || []);
    setCopyright(res.copyright || '');
    setDescription(res.longDesc || res.desc || '');
    setThumbnailUrl(res.thumbnail);
    setView('edit');
  };

  const handleDeleteClick = (resource: MapResourceItem) => {
    setResourceToDelete(resource);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(false);
    setResourceToDelete(null);
  };

  const handleSubmitReview = () => {
    setShowSubmitSuccess(true);
    setTimeout(() => {
      setShowSubmitSuccess(false);
    }, 3000);
  };

  // 详情页组件
  const ResourceDetail = () => {
    const resource = MOCK_MAP_RESOURCES.find(r => r.id === selectedResourceId);
    if (!resource) return null;

    return (
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col min-h-screen animate-in fade-in duration-500 overflow-hidden">
        {/* 头部 */}
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">地图资源详情</h2>
          <button 
            onClick={() => setView('list')}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
            {/* 左侧主内容 */}
            <div className="flex-1 space-y-12">
              {/* 基本信息 */}
              <section className="space-y-8">
                <h3 className="text-xl font-black text-gray-900 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                  基本信息
                </h3>
                <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">地图名称</p>
                    <p className="text-lg font-bold text-gray-800">{resource.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">所属类目</p>
                    <p className="text-lg font-bold text-gray-800">{resource.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">地图类型</p>
                    <p className="text-lg font-bold text-gray-800">{resource.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">服务标准</p>
                    <p className="text-lg font-bold text-gray-800">{resource.serviceMethod || '未知'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">坐标系</p>
                    <p className="text-lg font-bold text-gray-800">{resource.coordinateSystem || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">缩放级别</p>
                    <p className="text-lg font-bold text-gray-800">{resource.zoomLevel || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">提交人</p>
                    <p className="text-lg font-bold text-gray-800">{resource.submitter || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">提交时间</p>
                    <p className="text-lg font-bold text-gray-800">{resource.submitTime || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">资源状态</p>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider mt-1 ${
                      resource.status === '已通过' ? 'bg-blue-50 text-blue-500' :
                      resource.status === '待审核' ? 'bg-amber-50 text-amber-500' :
                      resource.status === '已驳回' ? 'bg-rose-50 text-rose-500' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {resource.status}
                    </span>
                  </div>
                </div>
              </section>

              {/* 图层信息 */}
              {resource.layers && resource.layers.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                    包含图层
                  </h3>
                  <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100/50">
                        <tr>
                          <th className="px-8 py-5 text-sm font-bold text-gray-500">图层名称</th>
                          <th className="px-8 py-5 text-sm font-bold text-gray-500">几何类型</th>
                          <th className="px-8 py-5 text-sm font-bold text-gray-500">描述信息</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {resource.layers.map((layer, i) => (
                          <tr key={i}>
                            <td className="px-8 py-5 text-sm font-bold text-gray-700">{layer.name}</td>
                            <td className="px-8 py-5 text-sm font-bold text-gray-700">{layer.type}</td>
                            <td className="px-8 py-5 text-sm text-gray-500">{layer.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* 详细描述 */}
              <section className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                  详细描述
                </h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50/30 p-8 rounded-3xl border border-dashed border-gray-200">
                  {resource.longDesc || resource.desc}
                </div>
              </section>
            </div>

            {/* 右侧边栏 */}
            <div className="w-full lg:w-96 space-y-10">
              {/* 缩略图 */}
              <div className="space-y-4">
                <h4 className="text-lg font-black text-gray-900">地图预览</h4>
                <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-500/10 border border-gray-100">
                  <img src={resource.thumbnail} alt="Preview" className="w-full h-auto object-cover" />
                </div>
              </div>

              {/* 标签 */}
              <div className="space-y-4">
                <h4 className="text-lg font-black text-gray-900">标签信息</h4>
                <div className="flex flex-wrap gap-3">
                  {(resource.tags || ['地图', 'GIS']).map((tag, i) => (
                    <span key={i} className={`px-5 py-2 rounded-2xl text-xs font-bold ${
                      i === 0 ? 'bg-blue-50 text-blue-600' : 
                      i === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 版权 */}
              <div className="space-y-4">
                <h4 className="text-lg font-black text-gray-900">版权信息</h4>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-sm text-gray-500 leading-relaxed">
                  {resource.copyright || '暂无版权说明'}
                </div>
              </div>

              {/* 处理结果 */}
              {(resource.status === '已通过' || resource.status === '已驳回') && (
                <div className="space-y-4">
                  <h4 className="text-lg font-black text-gray-900">处理结果</h4>
                  <div className={`p-6 rounded-3xl border flex items-start ${
                    resource.status === '已通过' 
                      ? 'bg-blue-50 border-blue-100 text-blue-600' 
                      : 'bg-rose-50 border-rose-100 text-rose-500'
                  }`}>
                    {resource.status === '已通过' ? (
                      <CheckCircle2 className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-bold leading-relaxed">
                      {resource.status === '已通过' 
                        ? '已通过。该资源已成功通过审核，并正式同步至发布渠道。' 
                        : `已驳回。${resource.rejectReason || '资源不符合规范，请重新上传。'}`
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-10 py-6 border-t border-gray-100 flex justify-end">
          <button 
            onClick={() => setView('list')}
            className="px-12 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    );
  };

  if (view === 'detail') {
    return <ResourceDetail />;
  }

  if (view === 'add' || view === 'edit') {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col min-h-screen overflow-hidden animate-in slide-in-from-right-10 duration-500">
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30 sticky top-0 z-10 backdrop-blur-md">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            {view === 'add' ? '新增地图资源' : '编辑地图资源'}
          </h2>
          <button 
            onClick={() => setView('list')}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
          {/* 基础信息 */}
          <section className="space-y-6">
            <h3 className="text-base font-black text-gray-900 border-l-4 border-blue-600 pl-4">基础信息</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">地图名称 <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="请输入地图名称" 
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">所属类目 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm text-gray-500 flex items-center justify-between hover:border-blue-500 transition-all"
                    >
                      {publishCategory || "请选择所属类目"}
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">地图类型</label>
                  <select 
                    value={mapType}
                    onChange={(e) => setMapType(e.target.value)}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white appearance-none transition-all text-sm"
                  >
                    <option value="">请选择类型</option>
                    <option value="矢量瓦片">矢量瓦片</option>
                    <option value="栅格瓦片">栅格瓦片</option>
                    <option value="WMS服务">WMS服务</option>
                    <option value="3D Tiles">3D Tiles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">坐标系</label>
                  <input 
                    type="text" 
                    value={coordinateSystem}
                    onChange={(e) => setCoordinateSystem(e.target.value)}
                    placeholder="如：CGCS2000, Web Mercator" 
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 参数信息 */}
          <section className="space-y-8">
            <h3 className="text-base font-black text-gray-900 border-l-4 border-blue-600 pl-4">地图参数</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">缩放级别</label>
              <input 
                type="text" 
                value={zoomLevel}
                onChange={(e) => setZoomLevel(e.target.value)}
                placeholder="如：L1 - L18" 
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm" 
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700">图层信息</label>
                <button 
                  onClick={() => setLayers([...layers, { name: '', type: '', desc: '' }])}
                  className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" /> 添加图层
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  <div className="col-span-3">图层名称</div>
                  <div className="col-span-3">几何类型</div>
                  <div className="col-span-5">描述信息</div>
                  <div className="col-span-1 text-center">操作</div>
                </div>
                {layers.map((layer, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <input 
                        type="text" 
                        value={layer.name}
                        onChange={(e) => {
                          const newLayers = [...layers];
                          newLayers[idx].name = e.target.value;
                          setLayers(newLayers);
                        }}
                        placeholder="图层名称" 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none text-xs" 
                      />
                    </div>
                    <div className="col-span-3">
                      <input 
                        type="text" 
                        value={layer.type}
                        onChange={(e) => {
                          const newLayers = [...layers];
                          newLayers[idx].type = e.target.value;
                          setLayers(newLayers);
                        }}
                        placeholder="如: Polygon" 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none text-xs" 
                      />
                    </div>
                    <div className="col-span-5">
                      <input 
                        type="text" 
                        value={layer.desc}
                        onChange={(e) => {
                          const newLayers = [...layers];
                          newLayers[idx].desc = e.target.value;
                          setLayers(newLayers);
                        }}
                        placeholder="图层描述" 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none text-xs" 
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        disabled={layers.length === 1}
                        onClick={() => setLayers(layers.filter((_, i) => i !== idx))}
                        className="p-2 text-gray-300 hover:text-rose-500 transition-colors disabled:opacity-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">地图缩略图</label>
              {thumbnailUrl ? (
                <div className="relative w-64 h-40 rounded-3xl overflow-hidden shadow-lg border border-gray-100 group">
                  <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button onClick={() => setThumbnailUrl(null)} className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-white hover:border-blue-300 transition-all group cursor-pointer">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-blue-500 shadow-sm mb-4 transition-all">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">点击上传或拖拽图片至此处</p>
                  <p className="text-xs text-gray-400">支持 PNG, JPG (最大 5MB)</p>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-700">详情描述</label>
                <button className="text-xs font-black text-amber-600 hover:text-amber-800 flex items-center uppercase tracking-widest">
                  <Edit3 className="w-3 h-3 mr-1" /> 编辑
                </button>
              </div>
              <textarea 
                rows={6} 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-8 py-10 bg-gray-50/50 border border-gray-200 rounded-[2.5rem] text-sm text-gray-700 leading-relaxed italic"
                placeholder="请输入详细的地图资源描述..."
              />
            </div>
          </section>
        </div>

        {/* 底部按钮栏 */}
        <div className="px-10 py-6 border-t border-gray-100 bg-white/80 backdrop-blur-md flex justify-end items-center space-x-4">
          <button 
            onClick={() => setView('list')}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl text-sm font-black hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            返回列表
          </button>
          <button 
            onClick={handleReset}
            className="px-8 py-3 bg-gray-50 text-amber-600 border border-amber-100 rounded-2xl text-sm font-black hover:bg-amber-100 transition-all shadow-sm active:scale-95 flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重置页面
          </button>
          <button 
             onClick={() => setView('list')}
             className="px-10 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            保存
          </button>
        </div>

        {/* 类目选择弹窗 */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[80vh]">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">选择所属类目</h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 border-b border-gray-50">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    value={modalCategorySearch}
                    onChange={(e) => setModalCategorySearch(e.target.value)}
                    placeholder="搜索类目标签..." 
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 flex flex-wrap gap-3 custom-scrollbar">
                {MAP_CATEGORIES.filter(l => l.includes(modalCategorySearch)).map((loc) => (
                  <button 
                    key={loc}
                    onClick={() => setTempSelectedCategory(loc)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
                      tempSelectedCategory === loc 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20' 
                        : 'bg-white text-gray-600 border-gray-100 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
              <div className="px-8 py-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={confirmCategorySelection}
                  className="px-10 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                  disabled={!tempSelectedCategory}
                >
                  确认选择
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full min-h-[calc(100vh-12rem)] animate-in fade-in duration-500">
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">地图资源总数</p>
              <h3 className="text-3xl font-black text-gray-900">{MOCK_MAP_RESOURCES.length}</h3>
            </div>
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
              <MapIcon className="w-7 h-7" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">已发布</p>
              <h3 className="text-3xl font-black text-gray-900">
                {MOCK_MAP_RESOURCES.filter(r => r.status === '已通过').length}
              </h3>
            </div>
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">待审核</p>
              <h3 className="text-3xl font-black text-gray-900">
                {MOCK_MAP_RESOURCES.filter(r => r.status === '待审核').length}
              </h3>
            </div>
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
              <Clock className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full xl:w-auto">
            <span className="text-gray-900 font-bold text-sm shrink-0">筛选条件：</span>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-600 focus:outline-none hover:bg-gray-100 transition-colors cursor-pointer min-w-[120px]"
                    >
                        <option value="全部状态">全部状态</option>
                        <option value="草稿中">草稿中</option>
                        <option value="待审核">待审核</option>
                        <option value="已通过">已通过</option>
                        <option value="已驳回">已驳回</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-600 focus:outline-none hover:bg-gray-100 transition-colors cursor-pointer min-w-[120px]"
                    >
                        <option value="全部类目">全部类目</option>
                        {MAP_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="搜索地图名称..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-[1rem] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 shrink-0">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <h4 className="text-lg font-black text-gray-900 tracking-tight">地图资源列表</h4>
            <button 
              onClick={handleAddClick}
              className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" />
              新增地图
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">编号</th>
                  <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">地图名称</th>
                  <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">所属类目</th>
                  <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">地图类型</th>
                  <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">状态</th>
                  <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">提交时间</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredResources.map((res) => (
                  <tr key={res.id} className="group hover:bg-blue-50/20 transition-all">
                    <td className="px-8 py-6 text-sm text-gray-400 font-bold">{res.id}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={res.thumbnail} 
                          alt={res.name} 
                          className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform duration-500"
                        />
                        <span className="text-sm font-bold text-gray-900 line-clamp-1">{res.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm text-gray-500 font-medium">{res.category}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm text-gray-500 font-medium">{res.type}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        res.status === '已通过' ? 'bg-blue-50 text-blue-500' :
                        res.status === '已驳回' ? 'bg-rose-50 text-rose-500' :
                        res.status === '待审核' ? 'bg-amber-50 text-amber-500' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-sm text-gray-400 font-medium">
                      {res.submitTime || res.publishTime}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center space-x-4">
                        <button 
                          onClick={() => handleViewDetail(res.id)}
                          className="text-[11px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase"
                        >
                          查看
                        </button>
                        
                        {(res.status === '已通过' || res.status === '草稿中' || res.status === '已驳回') && (
                          <button 
                            onClick={() => handleEditClick(res)}
                            className="text-[11px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase"
                          >
                            编辑
                          </button>
                        )}
                        
                        {(res.status === '已通过' || res.status === '草稿中' || res.status === '已驳回') && (
                          <button 
                            onClick={() => handleDeleteClick(res)}
                            className="text-[11px] font-black text-rose-500 hover:text-rose-700 transition-colors uppercase"
                          >
                            删除
                          </button>
                        )}
                        
                        {res.status === '草稿中' && (
                          <button 
                            onClick={handleSubmitReview}
                            className="text-[11px] font-black text-emerald-600 hover:text-emerald-800 transition-colors uppercase"
                          >
                            提交审核
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">显示 1 到 {filteredResources.length} 条，共 {MOCK_MAP_RESOURCES.length} 条记录</span>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-lg text-xs font-black bg-blue-600 text-white shadow-lg shadow-blue-500/30">1</button>
              <button className="w-8 h-8 rounded-lg text-xs font-black text-gray-400 hover:bg-gray-100 transition-all">2</button>
              <button className="w-8 h-8 rounded-lg text-xs font-black text-gray-400 hover:bg-gray-100 transition-all">3</button>
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/10">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">确认删除该资源？</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
                您正在尝试删除地图资源 <span className="text-gray-900 font-black">“{resourceToDelete?.name}”</span>，此操作无法撤销。
              </p>
            </div>
            
            <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex items-center space-x-4">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl text-sm font-black hover:bg-gray-100 transition-all active:scale-95 shadow-sm"
              >
                取消
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-sm font-black hover:bg-rose-600 transition-all active:scale-95 shadow-xl shadow-rose-500/20"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 提交审核成功提示 */}
      {showSubmitSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-10 duration-500">
          <div className="bg-emerald-500 text-white px-8 py-4 rounded-[2rem] shadow-2xl shadow-emerald-500/30 flex items-center space-x-4">
            <div className="bg-white/20 p-1.5 rounded-full">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-base font-black tracking-tight">提交审核成功</span>
          </div>
        </div>
      )}
      
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
