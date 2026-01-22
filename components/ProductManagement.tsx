
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Upload, 
  Download, 
  Calendar, 
  RefreshCcw, 
  X, 
  Plus, 
  Filter, 
  ArrowRight, 
  TrendingUp, 
  Tag as TagIcon, 
  Cpu, 
  BrainCircuit, 
  AppWindow, 
  Trash2, 
  AlertCircle, 
  AlertTriangle, 
  Map as MapIcon
} from 'lucide-react';

interface Props {
  title?: string;
}

interface Product {
  id: string;
  name: string;
  desc: string;
  image: string;
  updateDate: string;
  isListed: boolean;
  category: string;
  price?: string;
  type: 'data' | 'service' | 'app' | 'map';
}

const DATA_PRODUCTS: Product[] = [
  { 
    id: 'd1', 
    name: '建设用地变化数据', 
    desc: '精准识别城镇开发边界内的动态变化，提供新增建设用地、存量土地开发等关键指标分析。', 
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2023-10-20', 
    isListed: true, 
    category: '自然资源',
    price: '¥5,800/套',
    type: 'data'
  },
  { 
    id: 'd2', 
    name: '卫星数据', 
    desc: '集成多源高分辨率卫星影像，覆盖全省重点区域，支持历史影像回溯与实时观测。', 
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2023-10-24', 
    isListed: true, 
    category: '卫星数据',
    price: '按需计费',
    type: 'data'
  },
  { 
    id: 'd3', 
    name: '水稻作物分布数据', 
    desc: '基于时序遥感影像提取的水稻种植空间分布数据，包含早稻、中稻、晚稻的种植面积与位置信息。', 
    image: 'https://images.unsplash.com/photo-1536617621572-1d5f1e9d2696?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-03-15', 
    isListed: true, 
    category: '自然资源',
    price: '¥3,500/市',
    type: 'data'
  },
  { 
    id: 'd4', 
    name: '油菜作物长势数据', 
    desc: '通过反演叶面积指数（LAI）等生物物理参数，评估区域油菜生长状况，生成长势分级图。', 
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-04-02', 
    isListed: true, 
    category: '自然资源',
    price: '¥2,800/县',
    type: 'data'
  }
];

const SERVICE_PRODUCTS: Product[] = [
  { 
    id: 's1', 
    name: '图像分割算法', 
    desc: '基于深度学习的高精度图像分割服务，支持从复杂的背景中快速分离出目标区域，适用于多种地物提取场景。', 
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-01-12', 
    isListed: true, 
    category: '图像分割',
    price: '¥0.5/km²',
    type: 'service'
  },
  { 
    id: 's2', 
    name: '水稻分布解译算子', 
    desc: '针对水稻全生长周期的光谱特征进行建模，自动化识别水稻田块，排除云雾干扰，精度优于90%。', 
    image: 'https://images.unsplash.com/photo-1625246333195-58197bd47d26?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-03-20', 
    isListed: true, 
    category: '目标检测',
    price: '¥600/次',
    type: 'service'
  },
  { 
    id: 's3', 
    name: '油菜长势监测算子', 
    desc: '结合气象数据与遥感影像，自动计算油菜的NDVI等植被指数，快速生成区域长势监测报告。', 
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-03-25', 
    isListed: true, 
    category: '参数反演',
    price: '¥800/次',
    type: 'service'
  },
  { 
    id: 's4', 
    name: '玉米估产监测算子', 
    desc: '集成多源数据的作物估产模型，在玉米关键生长期进行产量预测，为农业保险与粮食收储提供数据支撑。', 
    image: 'https://images.unsplash.com/photo-1551250928-2f3b9c3729d6?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-04-10', 
    isListed: true, 
    category: '参数反演',
    price: '¥1,200/次',
    type: 'service'
  }
];

const APP_PRODUCTS: Product[] = [
  { 
    id: 'a1', 
    name: '数字孪生水利监测平台', 
    desc: '构建流域数字孪生体，集成水雨情监测、洪水演进模拟与水资源调度功能，提升水利决策的预报、预警、预演、预案能力。', 
    image: 'https://images.unsplash.com/photo-1583325958568-a261a520ebda?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-03-10', 
    isListed: true, 
    category: '水利水务',
    price: '定制咨询',
    type: 'app'
  },
  { 
    id: 'a2', 
    name: '耕地保护监测平台', 
    desc: '利用卫星遥感技术实现对耕地“非农化”、“非粮化”行为的动态监测，形成“天上看、地上查、网上管”的监管闭环。', 
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-03-15', 
    isListed: true, 
    category: '自然资源',
    price: '¥58,000/年',
    type: 'app'
  },
  { 
    id: 'a3', 
    name: '农业农村一体化平台', 
    desc: '汇聚农业生产、经营、管理、服务数据，打造一站式“三农”大数据中心，赋能乡村振兴与农业现代化管理。', 
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-03-05', 
    isListed: true, 
    category: '农业农村',
    price: '定制咨询',
    type: 'app'
  }
];

const MAP_PRODUCTS: Product[] = [
  { 
    id: 'm1', 
    name: '潜江小龙虾分布地图', 
    desc: '详细展示潜江市稻虾共作基地、小龙虾交易市场及加工企业的空间分布，服务于特色产业规划与物流配送。', 
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-04-01', 
    isListed: true, 
    category: '专题地图',
    price: '¥8,000/年',
    type: 'map'
  },
  { 
    id: 'm2', 
    name: '黄石公园分布地图', 
    desc: '覆盖黄石市各大公园绿地、口袋公园及游憩设施位置，辅助城市绿地系统规划与市民休闲导航。', 
    image: 'https://images.unsplash.com/photo-1496614932623-0a3a9743552e?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-03-28', 
    isListed: true, 
    category: '专题地图',
    price: '¥5,000/年',
    type: 'map'
  },
  { 
    id: 'm3', 
    name: '荆州景区分布地图', 
    desc: '整合荆州古城、方特东方神画等A级景区空间信息，提供旅游路线规划与客流热力分析底图。', 
    image: 'https://images.unsplash.com/photo-1568607689150-17e625c1586e?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-04-05', 
    isListed: true, 
    category: '专题地图',
    price: '¥6,500/年',
    type: 'map'
  },
  { 
    id: 'm4', 
    name: '仙桃文化场馆地图', 
    desc: '全面标注仙桃市图书馆、博物馆、体育馆及基层文化站位置，支持15分钟文化生活圈分析。', 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop', 
    updateDate: '2024-03-15', 
    isListed: true, 
    category: '专题地图',
    price: '¥4,000/年',
    type: 'map'
  }
];

const DATA_CATEGORIES = [
  { name: '全部', count: 128 },
  { name: '卫星数据', count: 45 },
  { name: '无人机数据', count: 22 },
  { name: '样本数据', count: 18 },
  { name: '自然资源', count: 31 },
  { name: '环境保护', count: 12 }
];

const SERVICE_CATEGORIES = [
  { name: '全部', count: 96 },
  { name: '图像分割', count: 24 },
  { name: '变化监测', count: 18 },
  { name: '目标检测', count: 22 },
  { name: '参数反演', count: 12 },
  { name: '特征提取', count: 10 },
  { name: '图像融合', count: 10 }
];

const APP_CATEGORIES = [
  { name: '全部', count: 156 },
  { name: '自然资源', count: 28 },
  { name: '农业农村', count: 22 },
  { name: '水利水务', count: 18 },
  { name: '生态环境', count: 15 },
  { name: '应急灾害', count: 12 },
  { name: '城市规划', count: 20 },
  { name: '住房保障', count: 10 },
  { name: '交通运输', count: 16 },
  { name: '智慧养老', count: 15 }
];

const MAP_CATEGORIES = [
  { name: '全部', count: 42 },
  { name: '基础底图', count: 12 },
  { name: '专题地图', count: 18 },
  { name: '三维地图', count: 8 },
  { name: '影像地图', count: 4 }
];

const RECOMMENDED_TAGS = ['卫星影像', '耕地监测', '自然资源', '三维建模', '交通指数'];

export const ProductManagement: React.FC<Props> = ({ title = '产品管理' }) => {
  const isData = title === '数据产品';
  const isService = title === '服务产品';
  const isApp = title === '应用产品';
  const isMap = title === '地图产品';
  
  const [products, setProducts] = useState<Product[]>(
    isApp ? APP_PRODUCTS : (isService ? SERVICE_PRODUCTS : (isMap ? MAP_PRODUCTS : DATA_PRODUCTS))
  );
  
  // Custom state for Data, Service, App, and Map Categories to allow Add/Delete
  const [customDataCategories, setCustomDataCategories] = useState(DATA_CATEGORIES);
  const [customServiceCategories, setCustomServiceCategories] = useState(SERVICE_CATEGORIES);
  const [customAppCategories, setCustomAppCategories] = useState(APP_CATEGORIES);
  const [customMapCategories, setCustomMapCategories] = useState(MAP_CATEGORIES);
  
  // Modals state
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<{name: string, count: number} | null>(null);
  
  const [activeTab, setActiveTab] = useState<'listed' | 'unlisted'>('listed');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Effect to update products when title changes
  useEffect(() => {
    if (isApp) {
      setProducts(APP_PRODUCTS);
    } else if (isService) {
      setProducts(SERVICE_PRODUCTS);
    } else if (isMap) {
      setProducts(MAP_PRODUCTS);
    } else {
      setProducts(DATA_PRODUCTS);
    }
    setActiveCategory('全部');
    setSearchQuery('');
  }, [title, isApp, isService, isMap]);

  // Dynamic categories list based on product type
  const categories = isApp ? customAppCategories : (isService ? customServiceCategories : (isMap ? customMapCategories : customDataCategories));

  const toggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isListed: !p.isListed } : p));
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesTab = activeTab === 'listed' ? p.isListed : !p.isListed;
      const matchesCategory = activeCategory === '全部' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesCategory && matchesSearch;
    });
  }, [products, activeTab, activeCategory, searchQuery]);

  const handleAddCategory = () => {
    setIsAddCategoryModalOpen(true);
  };

  const confirmAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const currentCategories = isApp ? customAppCategories : (isService ? customServiceCategories : (isMap ? customMapCategories : customDataCategories));

    // Check for duplicate
    if (currentCategories.some(c => c.name === newCategoryName)) {
      alert('该类目名称已存在！');
      return;
    }

    const newCategory = { name: newCategoryName, count: 0 };

    if (isApp) {
      setCustomAppCategories([...customAppCategories, newCategory]);
    } else if (isService) {
      setCustomServiceCategories([...customServiceCategories, newCategory]);
    } else if (isMap) {
      setCustomMapCategories([...customMapCategories, newCategory]);
    } else {
      setCustomDataCategories([...customDataCategories, newCategory]);
    }
    
    setNewCategoryName('');
    setIsAddCategoryModalOpen(false);
  };

  const handleDeleteCategoryClick = (e: React.MouseEvent, category: {name: string, count: number}) => {
    e.stopPropagation(); // Prevent activating the category
    setCategoryToDelete(category);
    
    if (category.count > 0) {
      setIsWarningModalOpen(true);
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const executeDeleteCategory = () => {
    if (categoryToDelete) {
      if (isApp) {
        setCustomAppCategories(prev => prev.filter(c => c.name !== categoryToDelete.name));
      } else if (isService) {
        setCustomServiceCategories(prev => prev.filter(c => c.name !== categoryToDelete.name));
      } else if (isMap) {
        setCustomMapCategories(prev => prev.filter(c => c.name !== categoryToDelete.name));
      } else {
        setCustomDataCategories(prev => prev.filter(c => c.name !== categoryToDelete.name));
      }
      
      if (activeCategory === categoryToDelete.name) {
        setActiveCategory('全部');
      }
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  if (!isData && !isService && !isApp && !isMap) {
    return (
      <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
          <Calendar className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 font-medium">该模块正在建设中，请优先查看“数据/服务/应用/地图产品”模块。</p>
      </div>
    );
  }

  return (
    <div className="flex gap-8 h-full min-h-[calc(100vh-12rem)]">
      {/* 左侧目录 */}
      <div className="w-64 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-4 flex flex-col shrink-0">
        <div className="px-4 py-4 mb-4 border-b border-gray-50">
          <p className="text-[10px] text-gray-400 font-bold mt-1">{title}资源目录</p>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar px-1 space-y-1.5">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm transition-all ${
                activeCategory === cat.name 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl shadow-blue-500/20 translate-x-1' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center">
                <TagIcon className={`w-3.5 h-3.5 mr-3 transition-opacity ${activeCategory === cat.name ? 'opacity-100' : 'opacity-40'}`} />
                {cat.name}
              </span>
              
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeCategory === cat.name ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
                }`}>
                  {cat.count}
                </span>
                
                {/* Delete Button - For All Product Types, not '全部' */}
                {cat.name !== '全部' && (
                  <div 
                    onClick={(e) => handleDeleteCategoryClick(e, cat)}
                    className={`p-1 rounded-full transition-all opacity-0 group-hover:opacity-100 ${
                      activeCategory === cat.name ? 'hover:bg-white/20 text-white' : 'hover:bg-rose-100 text-gray-400 hover:text-rose-500'
                    }`}
                    title="删除类目"
                  >
                    <X className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <button 
          onClick={handleAddCategory}
          className="mt-6 w-full p-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center transition-all group bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
          新增类目
        </button>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 flex flex-col space-y-8">
        {/* 顶部标题 */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="h-6 w-1 bg-blue-600 rounded-full" />
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">{title}中心</h2>
            </div>
            <p className="text-sm text-gray-400 font-medium">
              {isApp ? '多领域数字孪生与业务管控应用，驱动业务数智化转型。' : 
               isService ? '智能化算法服务托管，提供全自动的计算与解译能力。' : 
               isMap ? '汇聚多源地理信息数据，构建数字孪生基底，赋能空间智能应用。' :
               '高效管理、分发与监控您的数据资产价值。'}
            </p>
          </div>
        </div>

        {/* 搜索体验优化区域 */}
        <div className="space-y-4">
          <div className={`relative transition-all duration-500 group ${isSearchFocused ? 'scale-[1.01]' : ''}`}>
            {/* 渐变装饰 */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur opacity-10 transition-opacity duration-500 ${isSearchFocused ? 'opacity-20' : 'group-hover:opacity-15'}`} />
            
            <div className={`relative flex items-center bg-white border transition-all duration-300 rounded-[2rem] overflow-hidden ${
              isSearchFocused ? 'border-blue-500 shadow-2xl shadow-blue-500/10' : 'border-gray-100 shadow-sm'
            }`}>
              <div className="pl-7 py-5">
                <Search className={`w-6 h-6 transition-colors duration-300 ${isSearchFocused ? 'text-blue-500' : 'text-gray-300'}`} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`搜索${title}名称、行业领域或业务标签...`}
                className="flex-1 px-5 py-5 text-base font-medium placeholder:text-gray-300 focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-3 mr-4 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* 热搜标签 */}
          <div className="flex items-center px-2">
            <span className="flex items-center text-[11px] font-black text-gray-400 uppercase tracking-widest mr-4">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
              热门搜索
            </span>
            <div className="flex flex-wrap gap-2">
              {RECOMMENDED_TAGS.map(tag => (
                <button 
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-4 py-1.5 bg-white border border-gray-100 text-[11px] font-bold text-gray-500 rounded-full hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 状态切换与排序 */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-px">
          <div className="flex space-x-12">
            {(['listed', 'unlisted'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-5 text-sm font-black transition-all relative ${
                  activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                   <span>{tab === 'listed' ? '已上架' : '未上架'}</span>
                   <span className={`w-2 h-2 rounded-full ${tab === 'listed' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                </div>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full animate-in slide-in-from-left-4 duration-500" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-5 mb-5">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
              结果: <span className="text-gray-900 font-black">{filteredProducts.length}</span>
            </span>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center text-xs font-bold text-gray-500 cursor-pointer hover:text-blue-600 transition-colors">
              综合排序 <ChevronDown className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        {/* 产品网格 */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 pb-12">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-[2.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/15 hover:-translate-y-3 transition-all duration-700 flex flex-col"
                >
                  {/* 图片封面 */}
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* 状态标签 */}
                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.1em]">{product.category}</span>
                    </div>

                    <div className={`absolute top-6 right-6 px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-2xl ${
                      product.isListed ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'
                    }`}>
                      {product.isListed ? '已上架' : '未上架'}
                    </div>

                    {/* 价格悬浮 */}
                    <div className="absolute bottom-6 left-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-white text-lg font-black">{product.price}</span>
                    </div>
                    
                    {isApp && (
                       <div className="absolute bottom-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0">
                         <AppWindow className="w-5 h-5 text-white" />
                       </div>
                    )}
                    {isMap && (
                       <div className="absolute bottom-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0">
                         <MapIcon className="w-5 h-5 text-white" />
                       </div>
                    )}
                  </div>
                  
                  {/* 内容区 */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-4">
                      <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h3>
                      <div className="flex items-center mt-2 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                         <Calendar className="w-3 h-3 mr-1.5 opacity-50" />
                         更新时间: {product.updateDate}
                      </div>
                    </div>
                    
                    {/* No description text as requested */}
                    
                    <div className={`mt-auto flex items-center justify-between border-t border-gray-50 pt-6`}>
                      {!isMap && !isData && !isService && !isApp ? (
                        <button className="flex items-center text-xs font-black text-gray-400 hover:text-gray-900 transition-colors group/btn">
                          查看演示
                          <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                      ) : (
                        <div />
                      )}
                      
                      <button 
                        onClick={() => toggleStatus(product.id)}
                        className={`inline-flex items-center px-6 py-3 rounded-2xl text-[11px] font-black transition-all ${
                          product.isListed 
                            ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white hover:shadow-rose-500/25' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/25'
                        } shadow-lg active:scale-95`}
                      >
                        {product.isListed ? (
                          <>
                            <Download className="w-3.5 h-3.5 mr-2 rotate-180" />
                            下架产品
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 mr-2" />
                            发布上线
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-700">
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-full blur-[100px] scale-150 animate-pulse" />
                <div className="relative z-10 p-12 bg-white/40 backdrop-blur-3xl rounded-[4rem] border border-white shadow-2xl">
                  <img 
                    src="https://illustrations.popsy.co/gray/empty-box.svg" 
                    alt="Empty box" 
                    className="w-64 h-64 drop-shadow-2xl opacity-70 grayscale contrast-125"
                  />
                </div>
              </div>

              <div className="text-center max-w-md">
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">暂无相关资源</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-10">
                  没有找到符合搜索条件的{title}。
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('全部'); }}
                  className="group flex items-center mx-auto px-10 py-4 bg-gray-900 text-white rounded-[2rem] font-black text-sm hover:bg-blue-600 transition-all shadow-2xl shadow-gray-300 active:scale-95"
                >
                  <RefreshCcw className="w-4 h-4 mr-3 group-hover:rotate-180 transition-transform duration-700" />
                  重置筛选条件
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                {isApp ? '新增应用类目' : (isService ? '新增服务类目' : (isMap ? '新增地图类目' : '新增数据类目'))}
              </h3>
              <button onClick={() => setIsAddCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">类目名称</label>
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="请输入新类目名称..." 
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm font-bold"
                  autoFocus
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600 font-medium leading-relaxed">
                  新增的类目将立即显示在左侧导航栏中，您可以随后在该类目下发布新的{isApp ? '应用' : (isService ? '服务' : (isMap ? '地图' : '数据'))}产品。
                </p>
              </div>
            </div>
            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/20 flex justify-end space-x-3">
              <button 
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
              >
                取消
              </button>
              <button 
                onClick={confirmAddCategory}
                disabled={!newCategoryName.trim()}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/10">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">删除类目</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
                确定要删除“<span className="text-gray-900 font-black">{categoryToDelete?.name}</span>”类目吗？此操作无法撤销。
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
                onClick={executeDeleteCategory}
                className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-sm font-black hover:bg-rose-600 transition-all active:scale-95 shadow-xl shadow-rose-500/20"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cannot Delete Warning Modal */}
      {isWarningModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/10">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">无法删除</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
                该类目下包含产品数据，无法删除！<br/>请先移除该类目下的所有{isApp ? '应用' : (isService ? '服务' : (isMap ? '地图' : '数据'))}产品。
              </p>
            </div>
            <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex justify-center">
              <button 
                onClick={() => setIsWarningModalOpen(false)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-black hover:bg-gray-800 transition-all active:scale-95 shadow-xl"
              >
                我知道了
              </button>
            </div>
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
