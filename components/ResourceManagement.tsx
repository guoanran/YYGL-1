
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  FileText, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Tag as TagIcon, 
  X, 
  Upload, 
  ChevronRight as ChevronRightIcon, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  MapPin, 
  ExternalLink, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle,
  Calendar as CalendarIcon
} from 'lucide-react';

interface Props {
  title?: string;
}

interface BandInfo {
  name: string;
  res: string;
  desc: string;
}

interface ResourceItem {
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
  resolution?: string;
  submitter?: string;
  submitTime?: string;
  visitUrl?: string;
  bands?: BandInfo[];
  longDesc?: string;
  tags?: string[];
  copyright?: string;
  rejectReason?: string;
}

const MOCK_RESOURCES: ResourceItem[] = [
  {
    id: 1,
    name: '高分辨率卫星遥感影像数据',
    category: '自然资源',
    type: '卫星遥感数据',
    desc: '10米分辨率多光谱卫星遥感影像，覆盖江苏省全域，支持自然资源普查。',
    status: '待审核',
    publishTime: '2023-06-15 09:23',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&h=300&auto=format&fit=crop',
    serviceMethod: '数据文件',
    resolution: '10m',
    submitter: '李工程师',
    submitTime: '2023-06-15 09:23',
    visitUrl: 'https://data.example.com/satellites-2023',
    bands: [
      { name: '红光波段', res: '10m', desc: '用于植被监测和识别' },
      { name: '近红外波段', res: '10m', desc: '用于生物量估算和植被活力评估' }
    ],
    longDesc: '高分辨率卫星遥感影像数据是我单位最新获取的高精度遥感数据产品，具有以下特点：\n\n• 空间分辨率达到10米，能够清晰识别地面细节\n• 包含多光谱波段，支持多种地物分类 and 识别\n• 数据经过辐射校正 and 几何精校正，精度高\n• 覆盖江苏省全域，数据完整性好\n\n该数据可广泛应用于国土资源调查、环境监测、城市规划等领域。',
    tags: ['卫星影像', '2023', '高分辨率'],
    copyright: '本数据仅供内部使用，未经授权不得用于商业用途。数据来源于江苏省测绘地理信息局。',
    rejectReason: '数据格式不符合要求，缺少必要的元数据信息，请补充后重新提交。'
  },
  {
    id: 2,
    name: '城市规划GIS数据集',
    category: '城市规划',
    type: '矢量数据',
    desc: '包含武汉市建成区边界、道路网络、土地利用等矢量要素，适用于城市规划分析。',
    status: '草稿中',
    publishTime: '-',
    thumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=100&h=100&auto=format&fit=crop',
    submitter: '张技术员',
    submitTime: '2023-06-20 14:12',
  },
  {
    id: 3,
    name: '高精度DEM地形数据',
    category: '水利水务',
    type: 'DEM地形数据',
    desc: '30米分辨率数字高程模型，覆盖湖北省全域，适用于地形建模与水文分析。',
    status: '已驳回',
    publishTime: '-',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=100&h=100&auto=format&fit=crop',
    submitter: '王组长',
    submitTime: '2023-06-10 16:45',
    rejectReason: '提供的坐标系与元数据说明不符，请重新校验数据坐标系信息。'
  },
  {
    id: 4,
    name: '全国水系分布矢量数据',
    category: '农业农村',
    type: '水利专题数据',
    desc: '全国主要河流、湖泊分布矢量图层，精度达到1:25万，支持流域综合治理决策。',
    status: '已通过',
    publishTime: '2023-05-22 11:30',
    thumbnail: 'https://images.unsplash.com/photo-1504062843035-e96bd2ad1892?q=80&w=100&h=100&auto=format&fit=crop',
    submitter: '赵科长',
    submitTime: '2023-05-20 09:00',
  }
];

const DATA_SOURCES = [
  "湖北省一张图",
  "咸宁一张图",
  "武汉市一张图",
  "宜昌市一张图",
  "襄阳市一张图",
  "黄石市一张图",
  "十堰市一张图",
  "荆州市一张图"
];

const PRODUCT_CATEGORY_TAGS = [
  "自然资源",
  "农业农村",
  "水利水务",
  "生态环境",
  "应急灾害",
  "城市规划",
  "住房保障",
  "交通运输",
  "智慧养老"
];

const PRESET_PRICES = [
  { label: '免费', desc: '基础分辨率数据', value: '免费' },
  { label: '500元', desc: '10米分辨率数据', value: '500' },
  { label: '1000元', desc: '5米分辨率数据', value: '1000' },
  { label: '2000元', desc: '2米分辨率数据', value: '2000' },
  { label: '5000元', desc: '1米分辨率数据', value: '5000' },
  { label: '10000元', desc: '0.5米高分辨率数据', value: '10000' },
];

export const ResourceManagement: React.FC<Props> = ({ title = '数据资源' }) => {
  const [view, setView] = useState<'list' | 'add' | 'edit' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);

  // 筛选状态
  const [statusFilter, setStatusFilter] = useState('全部状态');
  const [timeFilter, setTimeFilter] = useState('全部时间');

  // 提交审核成功弹窗状态
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

  // 删除弹窗状态
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<ResourceItem | null>(null);

  // 表单状态
  const [formName, setFormName] = useState('');
  const [publishCategory, setPublishCategory] = useState('');
  const [resolution, setResolution] = useState('');
  const [bands, setBands] = useState([{ name: '', res: '', desc: '' }]);
  const [tags, setTags] = useState<string[]>([]);
  const [copyright, setCopyright] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  const [priceType, setPriceType] = useState<'select' | 'input'>('select');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [inputPrice, setInputPrice] = useState<string>('');
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [modalPriceSearch, setModalPriceSearch] = useState('');
  const [tempSelectedPrice, setTempSelectedPrice] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [modalSearch, setModalSearch] = useState('');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [tempSelectedCategory, setTempSelectedCategory] = useState<string | null>(null);
  const [modalCategorySearch, setModalCategorySearch] = useState('');

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // 过滤资源列表
  const filteredResources = useMemo(() => {
    return MOCK_RESOURCES.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === '全部状态' || res.status === statusFilter;
      
      let matchesTime = true;
      if (timeFilter !== '全部时间') {
        const timeStr = res.submitTime !== '-' ? res.submitTime : res.publishTime;
        if (timeStr && timeStr !== '-') {
          const resDate = new Date(timeStr);
          const now = new Date();
          const targetDate = new Date();
          
          if (timeFilter === '一周内') {
            targetDate.setDate(now.getDate() - 7);
          } else if (timeFilter === '一月内') {
            targetDate.setMonth(now.getMonth() - 1);
          } else if (timeFilter === '一年内') {
            targetDate.setFullYear(now.getFullYear() - 1);
          }
          
          matchesTime = resDate >= targetDate;
        } else {
          // 如果没有时间数据，在进行时间筛选时，通常认为是“不匹配”或者“不显示”
          matchesTime = false; 
        }
      }

      return matchesSearch && matchesStatus && matchesTime;
    });
  }, [searchQuery, statusFilter, timeFilter]);

  const confirmSelection = () => {
    if (selectedSource) {
      setFormName(selectedSource);
      setResolution('10米、30米');
      setBands([
        { name: '红外波段', res: '10m', desc: '探测植被生长情况' },
        { name: '全色波段', res: '2m', desc: '高分辨率灰度图像' }
      ]);
      setTags(['一张图', '遥感影像', '2023监测']);
      setCopyright(`Copyright © 2024 ${selectedSource} 版权所有。本数据仅限内部评估及授权项目使用。`);
      setDescription(`${selectedSource}是基于最新卫星遥感技术构建的地理信息底座。集成了高分辨率影像、地形地貌及关键基础地理要素，支持城市规划、自然资源监管及灾害预防。`);
      setThumbnailUrl('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=400&auto=format&fit=crop');
    }
    setIsModalOpen(false);
  };

  const confirmPriceSelection = () => {
    if (tempSelectedPrice) {
      setSelectedPrice(tempSelectedPrice);
    }
    setIsPriceModalOpen(false);
  };

  const confirmCategorySelection = () => {
    if (tempSelectedCategory) {
      setPublishCategory(tempSelectedCategory);
    }
    setIsCategoryModalOpen(false);
  };

  const handleReset = () => {
    setFormName('');
    setPublishCategory('');
    setResolution('');
    setBands([{ name: '', res: '', desc: '' }]);
    setTags([]);
    setCopyright('');
    setDescription('');
    setThumbnailUrl(null);
    setPriceType('select');
    setSelectedPrice('');
    setInputPrice('');
    setSelectedSource(null);
    setTempSelectedPrice(null);
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

  const handleEditClick = (res: ResourceItem) => {
    setSelectedResourceId(res.id);
    setFormName(res.name);
    setPublishCategory(res.category || ''); 
    setResolution(res.resolution || '');
    setBands(res.bands || [{ name: '', res: '', desc: '' }]);
    setTags(res.tags || []);
    setCopyright(res.copyright || '');
    setDescription(res.longDesc || res.desc || '');
    setThumbnailUrl(res.thumbnail);
    setSelectedSource(res.name);
    setPriceType('select');
    setSelectedPrice('500');
    setView('edit');
  };

  const handleDeleteClick = (resource: ResourceItem) => {
    setResourceToDelete(resource);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log(`Deleting resource: ${resourceToDelete?.name}`);
    setIsDeleteModalOpen(false);
    setResourceToDelete(null);
  };

  const handleSubmitReview = () => {
    // 模拟提交审核逻辑
    setShowSubmitSuccess(true);
    setTimeout(() => {
      setShowSubmitSuccess(false);
    }, 3000);
  };

  // 详情页组件
  const ResourceDetail = () => {
    const resource = MOCK_RESOURCES.find(r => r.id === selectedResourceId);
    if (!resource) return null;

    return (
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col min-h-screen animate-in fade-in duration-500 overflow-hidden">
        {/* 头部 */}
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">数据资源详情</h2>
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
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">数据名称</p>
                    <p className="text-lg font-bold text-gray-800">{resource.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">发布类目</p>
                    <p className="text-lg font-bold text-gray-800">{resource.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">数据类型</p>
                    <p className="text-lg font-bold text-gray-800">{resource.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">服务方式</p>
                    <p className="text-lg font-bold text-gray-800">{resource.serviceMethod || '文件下载'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">分辨率</p>
                    <p className="text-lg font-bold text-gray-800">{resource.resolution || '-'}</p>
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
                    <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">数据状态</p>
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

              {/* 波段信息 */}
              {resource.bands && resource.bands.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                    波段信息
                  </h3>
                  <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100/50">
                        <tr>
                          <th className="px-8 py-5 text-sm font-bold text-gray-500">波段名称</th>
                          <th className="px-8 py-5 text-sm font-bold text-gray-500">分辨率</th>
                          <th className="px-8 py-5 text-sm font-bold text-gray-500">描述信息</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {resource.bands.map((band, i) => (
                          <tr key={i}>
                            <td className="px-8 py-5 text-sm font-bold text-gray-700">{band.name}</td>
                            <td className="px-8 py-5 text-sm font-bold text-gray-700">{band.res}</td>
                            <td className="px-8 py-5 text-sm text-gray-500">{band.desc}</td>
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
                <h4 className="text-lg font-black text-gray-900">数据缩略图</h4>
                <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-500/10 border border-gray-100">
                  <img src={resource.thumbnail} alt="Preview" className="w-full h-auto object-cover" />
                </div>
              </div>

              {/* 标签 */}
              <div className="space-y-4">
                <h4 className="text-lg font-black text-gray-900">标签信息</h4>
                <div className="flex flex-wrap gap-3">
                  {(resource.tags || ['卫星影像', '2023', '高分辨率']).map((tag, i) => (
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

              {/* 处理结果 - 根据状态条件显示 */}
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
                        : `已驳回。${resource.rejectReason || '数据格式或质量不符合要求，请重新上传。'}`
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
        {/* 表单头部 */}
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30 sticky top-0 z-10 backdrop-blur-md">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            {view === 'add' ? '新增数据资源' : '编辑数据资源'}
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">数据名称 <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="请输入数据名称" 
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">发布类目 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm text-gray-500 flex items-center justify-between hover:border-blue-500 transition-all"
                    >
                      {publishCategory || "请选择发布类目"}
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">数据选择</label>
                  <div className="relative group">
                    <button 
                      onClick={handleOpenModal}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm text-gray-500 flex items-center justify-between hover:border-blue-500 transition-all"
                    >
                      {selectedSource || "请选择数据"}
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">服务方式</label>
                  <div className="relative">
                    <select className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white appearance-none transition-all text-sm">
                      <option>请选择服务方式</option>
                      <option>API接口</option>
                      <option>文件下载</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 参数信息 */}
          <section className="space-y-8">
            <h3 className="text-base font-black text-gray-900 border-l-4 border-blue-600 pl-4">参数信息</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">分辨率信息</label>
              <input 
                type="text" 
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="如：10m、30m等" 
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm" 
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700">波段信息</label>
                <button 
                  onClick={() => setBands([...bands, { name: '', res: '', desc: '' }])}
                  className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" /> 添加波段
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  <div className="col-span-3">波段名称</div>
                  <div className="col-span-3">分辨率</div>
                  <div className="col-span-5">描述信息</div>
                  <div className="col-span-1 text-center">操作</div>
                </div>
                {bands.map((band, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <input 
                        type="text" 
                        value={band.name}
                        onChange={(e) => {
                          const newBands = [...bands];
                          newBands[idx].name = e.target.value;
                          setBands(newBands);
                        }}
                        placeholder="如：红光波段" 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none text-xs" 
                      />
                    </div>
                    <div className="col-span-3">
                      <input 
                        type="text" 
                        value={band.res}
                        onChange={(e) => {
                          const newBands = [...bands];
                          newBands[idx].res = e.target.value;
                          setBands(newBands);
                        }}
                        placeholder="如：10m" 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none text-xs" 
                      />
                    </div>
                    <div className="col-span-5">
                      <input 
                        type="text" 
                        value={band.desc}
                        onChange={(e) => {
                          const newBands = [...bands];
                          newBands[idx].desc = e.target.value;
                          setBands(newBands);
                        }}
                        placeholder="波段详细描述" 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none text-xs" 
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        disabled={bands.length === 1}
                        onClick={() => setBands(bands.filter((_, i) => i !== idx))}
                        className="p-2 text-gray-300 hover:text-rose-500 transition-colors disabled:opacity-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400">点击“添加波段”可增加新的波段信息行</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">数据缩略图</label>
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
                  <p className="text-sm font-bold text-gray-900 mb-1">点击上传或拖拽缩略图至此处</p>
                  <p className="text-xs text-gray-400">支持 PNG, JPG (最大 5MB)</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">标签信息</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black flex items-center">
                    {tag}
                    <button onClick={() => setTags(tags.filter(t => t !== tag))} className="ml-2 hover:text-blue-800">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="添加标签..." 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      if (val && !tags.includes(val)) setTags([...tags, val]);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none text-sm" 
                />
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all">添加</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">版权信息</label>
              <textarea 
                rows={4} 
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm resize-none" 
                placeholder="请输入版权说明信息..." 
              />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-700">详情描述</label>
                <button className="text-xs font-black text-amber-600 hover:text-amber-800 flex items-center uppercase tracking-widest">
                  <Edit3 className="w-3 h-3 mr-1" /> 编辑
                </button>
              </div>
              {description ? (
                 <textarea 
                    rows={6} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-8 py-10 bg-gray-50/50 border border-gray-200 rounded-[2.5rem] text-sm text-gray-700 leading-relaxed italic"
                 />
              ) : (
                <div className="w-full px-8 py-10 bg-gray-50/50 border border-gray-200 rounded-[2.5rem] text-sm text-gray-400 italic">
                  “请点击‘编辑’按钮开始编辑详情描述内容”
                </div>
              )}
            </div>
          </section>

          {/* 数据价格 */}
          <section className="space-y-6">
            <h3 className="text-base font-black text-gray-900 border-l-4 border-blue-600 pl-4">数据价格</h3>
            <div className="flex items-center space-x-8 mb-6">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="priceType" 
                  checked={priceType === 'select'} 
                  onChange={() => setPriceType('select')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                />
                <span className="ml-3 text-sm font-bold text-gray-900">选择数据价格</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="priceType" 
                  checked={priceType === 'input'} 
                  onChange={() => setPriceType('input')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                />
                <span className="ml-3 text-sm font-bold text-gray-900">输入价格</span>
              </label>
            </div>
            
            {priceType === 'select' ? (
              <div className="relative">
                <button 
                  onClick={() => setIsPriceModalOpen(true)}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm text-gray-500 flex items-center justify-between hover:border-blue-500 transition-all"
                >
                  {selectedPrice ? (selectedPrice === '免费' ? '免费' : `${selectedPrice}元`) : "请选择预设价格"}
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <input 
                  type="text" 
                  value={inputPrice}
                  onChange={(e) => setInputPrice(e.target.value)}
                  placeholder="请输入数据价格 (如：2999)" 
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm" 
                />
              </div>
            )}
          </section>

          {/* 应用案例 */}
          <section className="space-y-8 pb-10">
            <h3 className="text-base font-black text-gray-900 border-l-4 border-blue-600 pl-4">应用案例</h3>
            <div className="bg-gray-50/50 p-10 rounded-[2.5rem] border border-gray-100 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">案例名称</label>
                  <input type="text" placeholder="请输入案例名称" className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">应用行业</label>
                  <div className="relative">
                    <select className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none appearance-none text-sm">
                      <option>请选择应用行业</option>
                      <option>自然资源监测</option>
                      <option>智慧城市管理</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">案例描述</label>
                <textarea rows={4} className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none text-sm resize-none" placeholder="描述案例的核心业务场景与应用效果..." />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">案例图片</label>
                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center bg-white/50 hover:border-blue-300 transition-all cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-300 mb-2" />
                  <p className="text-xs font-bold text-gray-900 mb-1">点击上传或拖拽案例图片至此处</p>
                  <p className="text-[10px] text-gray-400">支持 PNG, JPG, GIF (最大 10MB)</p>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center uppercase tracking-[0.2em]">
                  <Plus className="w-3.5 h-3.5 mr-2" /> 添加更多案例
                </button>
              </div>
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
            重置页面参数
          </button>
          <button 
             onClick={() => setView('list')}
             className="px-10 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            保存
          </button>
        </div>

        {/* 发布类目选择弹窗 */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[80vh]">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">选择发布类目</h3>
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
                {PRODUCT_CATEGORY_TAGS.filter(l => l.includes(modalCategorySearch)).map((loc) => (
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

        {/* 预设价格选择弹窗 */}
        {isPriceModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[85vh]">
              <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">卫星影像数据价格筛选</h3>
                <button onClick={() => setIsPriceModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 border-b border-gray-50">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    value={modalPriceSearch}
                    onChange={(e) => setModalPriceSearch(e.target.value)}
                    placeholder="搜索价格区间..." 
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {PRESET_PRICES.filter(p => p.label.includes(modalPriceSearch)).map((item) => (
                  <button 
                    key={item.value}
                    onClick={() => setTempSelectedPrice(item.value)}
                    className={`w-full p-6 text-left border rounded-2xl transition-all flex flex-col space-y-1 group ${
                      tempSelectedPrice === item.value 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20' 
                        : 'bg-white text-gray-700 border-gray-100 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                  >
                    <span className="font-black text-lg tracking-tight">{item.label}</span>
                    <span className={`text-xs font-medium ${tempSelectedPrice === item.value ? 'text-white/70' : 'text-gray-400'}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>

              <div className="px-8 py-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={confirmPriceSelection}
                  className="px-12 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!tempSelectedPrice}
                >
                  确认选择
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 数据资源选择弹窗 */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">选择数据源</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 border-b border-gray-50">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder="搜索数据源..." 
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                {DATA_SOURCES.filter(s => s.includes(modalSearch)).map((source) => (
                  <button 
                    key={source}
                    onClick={() => setSelectedSource(source)}
                    className={`w-full p-6 text-left border rounded-2xl transition-all flex items-center justify-between group ${
                      selectedSource === source 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20' 
                        : 'bg-white text-gray-700 border-gray-100 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                  >
                    <span className="font-bold text-sm tracking-wide">{source}</span>
                    {selectedSource === source && (
                      <CheckCircle2 className="w-5 h-5 text-white animate-in zoom-in duration-300" />
                    )}
                  </button>
                ))}
              </div>

              <div className="px-8 py-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-gray-400">显示 1-5 条，共 20 条记录</span>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg text-xs font-black bg-blue-600 text-white">1</button>
                    <button className="w-8 h-8 rounded-lg text-xs font-black text-gray-400 border border-gray-100 hover:bg-gray-50">2</button>
                    <button className="w-8 h-8 rounded-lg text-xs font-black text-gray-400 border border-gray-100 hover:bg-gray-50">3</button>
                    <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={confirmSelection}
                    className="px-12 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedSource}
                  >
                    确认选择
                  </button>
                </div>
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
              <p className="text-gray-400 text-sm font-medium mb-1">数据资源总数</p>
              <h3 className="text-3xl font-black text-gray-900">12</h3>
            </div>
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
              <FileText className="w-7 h-7" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">已通过</p>
              <h3 className="text-3xl font-black text-gray-900">8</h3>
            </div>
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">待审核</p>
              <h3 className="text-3xl font-black text-gray-900">2</h3>
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
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-600 focus:outline-none hover:bg-gray-100 transition-colors cursor-pointer min-w-[120px]"
                    >
                        <option value="全部时间">全部时间</option>
                        <option value="一周内">一周内</option>
                        <option value="一月内">一月内</option>
                        <option value="一年内">一年内</option>
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
                placeholder="搜索数据名称..."
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
            <h4 className="text-lg font-black text-gray-900 tracking-tight">数据资源列表</h4>
            <button 
              onClick={handleAddClick}
              className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" />
              新增数据
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">编号</th>
                  <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">数据名称</th>
                  <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">发布类目</th>
                  <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">数据类型</th>
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
            <span className="text-xs text-gray-400 font-medium">显示 1 到 {filteredResources.length} 条，共 {MOCK_RESOURCES.length} 条记录</span>
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
                您正在尝试删除资源 <span className="text-gray-900 font-black">“{resourceToDelete?.name}”</span>，此操作无法撤销。
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
