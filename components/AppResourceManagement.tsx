
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  AppWindow, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  ChevronLeft, 
  ChevronRight,
  X,
  Trash2,
  Edit3,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  LayoutGrid,
  History,
  Info,
  ArrowRight,
  Settings,
  FileText,
  Cpu,
  Monitor,
  MapPin,
  Upload,
  Bold,
  Italic,
  Underline,
  List,
  Link as LinkIcon,
  Tag,
  Globe,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface AppResource {
  id: string;
  name: string;
  desc: string;
  scene: string;
  status: '已通过' | '待审核' | '已驳回';
  submitTime: string;
  icon: string;
  // 扩展字段用于详情展示
  category?: string;
  visitUrl?: string;
  longDesc?: string;
  techStack?: string[];
  screenshots?: string[];
  cases?: { name: string; industry: string; desc: string }[];
  devLanguage?: string;
  version?: string;
  submitter?: string;
  tags?: string[];
  processResult?: string; // 处理结果/审核意见
}

interface SceneTemplate {
  name: string;
  config: { url: string; intro: string };
  details: string;
  tech: string;
  case: { name: string; industry: string; desc: string };
  tags?: string[];
}

const APP_CATEGORY_TAGS = [
  "自然资源",
  "农业农村",
  "水利水务",
  "生态环境",
  "应急灾害",
  "城市规划",
  "住房保障",
  "交通运输",
  "智慧养老",
  "社会综合",
  "能源建设",
  "城市治理"
];

const APP_FEATURE_TAGS = [
  "空间分析",
  "可视化",
  "实时监测",
  "预测预警",
  "决策支持"
];

const SCENE_TEMPLATES: SceneTemplate[] = [
  {
    name: '城市治理',
    config: { url: 'https://smart-city.example.com', intro: '一站式数字化城市管理决策辅助 system。' },
    details: '城市治理平台通过整合公安、城管、交通等多部门实时数据，实现城市运行状态的“一网统管”。包含人流量监测、交通拥堵预警、违建AI识别等核心子系统。',
    tech: '微服务架构, 数字孪生(Digital Twin), 大数据分析引擎, 实时视频解译算法。',
    case: { name: '智慧南京运行中心', industry: '城市治理', desc: '实现了全市域交通、安防及民生服务的统一调度，响应速度提升30%。' },
    tags: ['智慧城市', '一网统管', '大数据', 'AI识别']
  },
  {
    name: '生态环境',
    config: { url: 'https://eco-monitor.example.com', intro: '天空地一体化环境质量监测与预警平台。' },
    details: '基于卫星遥感、地面传感器及无人机巡检数据，实现对水质、空气、噪声及土壤污染的实时动态监控。支持污染源溯源分析及气象扩散模型模拟。',
    tech: '遥感遥测技术, 物联网(IoT), 多源异构数据融合算法, 扩散仿真模型。',
    case: { name: '雄安新区水环境监测', industry: '生态环境', desc: '构建了白洋淀水域全天候监测网，水质异常识别准确率达到95%以上。' },
    tags: ['环境监测', 'IoT', '污染溯源', '遥感遥测']
  },
  {
    name: '低空经济',
    config: { url: 'https://drone-manage.example.com', intro: '无人机航线规划与低空空域管理系统。' },
    details: '面向低空空域精细化管理需求，提供无人机实名登记、航线一键申报、实时飞行监控及电子围栏告警功能。支持物流配送、电力巡检等多元低空业务。',
  tech: '5G-A通信, 实时动态避障, RTK高精度定位, 复杂气象预测模型。',
    case: { name: '深圳盐田物流配送试验区', industry: '交通运输', desc: '实现了常态化无人机物流配送业务，显著缩短了最后一公里的配送耗时。' },
    tags: ['低空经济', '无人机', '航线规划', '实时监控']
  },
  {
    name: '自然资源',
    config: { url: 'https://nature-resource.example.com', intro: '自然资源调查监测与执法监管平台。' },
    details: '深度集成卫星遥感与实地执法系统，实现耕地动态监测、林木蓄积量评估及违法用地预警。支持全流程电子化审批与资源一张图管理。',
    tech: '高分影像识别, 云端影像处理, 移动协同办公技术, 知识图谱决策支持。',
    case: { name: '湖北省耕地保护一张图', industry: '自然资源', desc: '实现了全省耕地非农化、非粮化违规占用行为的分钟级告警与月度执法闭环。' },
    tags: ['自然资源', '耕地保护', '遥感监测', '一张图']
  }
];

const MOCK_APPS: AppResource[] = [
  { 
    id: 'APP-001', 
    name: '城市扩张监测系统', 
    desc: '基于遥感和GIS技术的城市发展监测工具', 
    scene: '城市规划', 
    category: '城市规划',
    status: '待审核', 
    submitTime: '2023-06-15 14:20', 
    icon: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=100&h=100&auto=format&fit=crop',
    visitUrl: 'https://app.example.com/urban-expansion',
    devLanguage: 'JavaScript, Python',
    version: 'v1.0.0',
    submitter: '吴工程师',
    tags: ['城市规划', '空间分析', '遥感监测', '城市扩张'],
    longDesc: '城市扩张监测系统是一款基于遥感和GIS技术的城市发展监测工具，旨在帮助城市规划者和决策者：\n\n• 客观评估城市扩张状况和发展趋势\n• 识别城市扩张的热点区域和潜在问题\n• 比较不同时期城市空间结构变化\n• 支持科学合理的城市规划决策\n\n系统采用机器学习算法自动提取城市建成区，结合空间分析方法量化城市扩张特征，提供直观的可视化结果 and 详细的分析报告。',
    screenshots: ['https://images.unsplash.com/photo-1551288049-bbda48658a7d?q=80&w=600&h=400&auto=format&fit=crop'],
    processResult: '该应用资源已提交审核，目前处于人工初审阶段。预计将在24小时内完成功能验证与安全性扫描。'
  },
  { 
    id: 'APP-002', 
    name: '环境质量监测系统', 
    desc: '实时环境数据采集与分析平台', 
    scene: '生态环境', 
    category: '生态环境',
    status: '已通过', 
    submitTime: '2023-06-05 09:30', 
    icon: 'https://images.unsplash.com/photo-1532187875605-2fe358a71e68?q=80&w=100&h=100&auto=format&fit=crop',
    processResult: '审核已通过。应用各项指标符合准入要求，接口稳定性良好，已正式部署至生产环境。'
  },
  { 
    id: 'APP-007', 
    name: '智能能源管理系统', 
    desc: '能源生产与输配优化管理平台', 
    scene: '能源建设', 
    category: '能源建设',
    status: '已驳回', 
    submitTime: '2023-05-10 11:15', 
    icon: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=100&h=100&auto=format&fit=crop',
    processResult: '审核不通过。原因：应用提供的API访问地址无法接通，且说明文档中缺少关于私有部署的架构说明，请修正后重新提交。'
  },
];

export const AppResourceManagement: React.FC = () => {
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [apps, setApps] = useState<AppResource[]>(MOCK_APPS);
  const [activeTab, setActiveTab] = useState('全部');

  // 删除弹窗状态
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<AppResource | null>(null);

  // 表单状态
  const [formName, setFormName] = useState('');
  const [formScene, setFormScene] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formFeature, setFormFeature] = useState(''); // 新增应用特性状态
  const [visitUrl, setVisitUrl] = useState('');
  const [appIntro, setAppIntro] = useState('');
  const [appDetails, setAppDetails] = useState('');
  const [mainTech, setMainTech] = useState('');
  const [caseName, setCaseName] = useState('');
  const [caseIndustry, setCaseIndustry] = useState('');
  const [caseDesc, setCaseDesc] = useState('');
  const [tags, setTags] = useState<string[]>([]); // 新增标签状态
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // 弹窗状态
  const [isSceneModalOpen, setIsSceneModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false); // 新增应用特性弹窗状态
  const [sceneSearch, setSceneSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [featureSearch, setFeatureSearch] = useState(''); // 新增应用特性搜索状态

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = app.name.includes(searchQuery) || app.desc.includes(searchQuery);
      const matchesTab = activeTab === '全部' || app.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [apps, searchQuery, activeTab]);

  const handleSelectScene = (template: SceneTemplate) => {
    setFormScene(template.name);
    setVisitUrl(template.config.url);
    setAppIntro(template.config.intro);
    setAppDetails(template.details);
    setMainTech(template.tech);
    setCaseName(template.case.name);
    setCaseIndustry(template.case.industry);
    setCaseDesc(template.case.desc);
    setTags(template.tags || []);
    setIsSceneModalOpen(false);
  };

  const handleSelectCategory = (cat: string) => {
    setFormCategory(cat);
    setIsCategoryModalOpen(false);
  };

  const handleSelectFeature = (feat: string) => {
    setFormFeature(feat);
    setIsFeatureModalOpen(false);
  };

  const resetForm = () => {
    setFormName('');
    setFormScene('');
    setFormCategory('');
    setFormFeature('');
    setVisitUrl('');
    setAppIntro('');
    setAppDetails('');
    setMainTech('');
    setCaseName('');
    setCaseIndustry('');
    setCaseDesc('');
    setTags([]);
    setEditingId(null);
  };

  const handleAddClick = () => {
    resetForm();
    setView('form');
  };

  const handleEditClick = (app: AppResource) => {
    setEditingId(app.id);
    setFormName(app.name);
    setFormScene(app.scene);
    setFormCategory(app.category || '');
    setVisitUrl(app.visitUrl || '');
    setAppIntro(app.desc);
    setAppDetails(app.longDesc || '');
    setMainTech(app.techStack?.join(', ') || '');
    setTags(app.tags || []);
    
    // 尝试从标签中回填特性
    const foundFeature = app.tags?.find(t => APP_FEATURE_TAGS.includes(t)) || '';
    setFormFeature(foundFeature);

    if (app.cases && app.cases.length > 0) {
      setCaseName(app.cases[0].name);
      setCaseIndustry(app.cases[0].industry);
      setCaseDesc(app.cases[0].desc);
    } else {
      setCaseName('');
      setCaseIndustry('');
      setCaseDesc('');
    }
    setView('form');
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '已通过': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case '待审核': return 'bg-amber-50 text-amber-600 border-amber-100';
      case '已驳回': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getSceneStyle = (scene: string) => {
    const styles: Record<string, string> = {
      '城市治理': 'bg-purple-50 text-purple-600 border-purple-100',
      '生态环境': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      '水利水务': 'bg-blue-50 text-blue-600 border-blue-100',
      '防灾减灾': 'bg-rose-50 text-rose-600 border-rose-100',
      '低空经济': 'bg-indigo-50 text-indigo-600 border-indigo-100',
      '社会综合': 'bg-slate-50 text-slate-600 border-slate-100',
      '能源建设': 'bg-orange-50 text-orange-600 border-orange-100',
    };
    return styles[scene] || 'bg-gray-50 text-gray-600 border-gray-100';
  };

  const handleViewDetail = (id: string) => {
    setSelectedAppId(id);
    setView('detail');
  };

  const handleDeleteClick = (app: AppResource) => {
    setAppToDelete(app);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (appToDelete) {
      setApps(prev => prev.filter(a => a.id !== appToDelete.id));
    }
    setIsDeleteModalOpen(false);
    setAppToDelete(null);
  };

  // 应用详情视图
  const AppDetailView = () => {
    const app = apps.find(a => a.id === selectedAppId);
    if (!app) return null;

    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col min-h-[600px] animate-in fade-in zoom-in-95 duration-300 overflow-hidden relative">
        {/* 详情页头部 */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-20">
          <h2 className="text-xl font-black text-gray-800 tracking-tight">应用资源详情</h2>
          <button 
            onClick={() => setView('list')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 详情内容区域 */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* 左侧：基本信息、应用描述、处理结果 */}
            <div className="flex-[2] space-y-12">
              {/* 基本信息 */}
              <section className="space-y-6">
                <h3 className="text-xl font-black text-gray-800">基本信息</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">应用名称</p>
                    <p className="text-base font-bold text-gray-700">{app.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">应用类型</p>
                    <p className="text-base font-bold text-gray-700">{app.scene}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">开发语言</p>
                    <p className="text-base font-bold text-gray-700">{app.devLanguage || 'JavaScript, Python'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">版本号</p>
                    <p className="text-base font-bold text-gray-700">{app.version || 'v1.0.0'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">提交人</p>
                    <p className="text-base font-bold text-gray-700">{app.submitter || '吴工程师'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">提交时间</p>
                    <p className="text-base font-bold text-gray-700">{app.submitTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">应用状态</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">访问地址</p>
                    <a href={app.visitUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-500 hover:underline flex items-center">
                      {app.visitUrl || 'https://app.example.com/'}
                    </a>
                  </div>
                </div>
              </section>

              {/* 应用描述 */}
              <section className="space-y-4">
                <h3 className="text-xl font-black text-gray-800">应用描述</h3>
                <div className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                  {app.longDesc || app.desc}
                </div>
              </section>

              {/* 处理结果 */}
              <section className="space-y-4">
                <h3 className="text-xl font-black text-gray-800 flex items-center">
                  处理结果
                </h3>
                <div className={`p-6 rounded-2xl border flex items-start transition-all ${
                  app.status === '已通过' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
                  app.status === '已驳回' ? 'bg-rose-50 border-rose-100 text-rose-700' : 
                  'bg-blue-50 border-blue-100 text-blue-700'
                }`}>
                  <div className="mr-4 mt-0.5">
                    {app.status === '已通过' ? <CheckCircle className="w-6 h-6" /> : 
                     app.status === '已驳回' ? <AlertTriangle className="w-6 h-6" /> : 
                     <History className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-black text-base mb-2">
                      审核结论：{app.status}
                    </p>
                    <p className="text-sm leading-relaxed opacity-80 italic font-medium">
                      “{app.processResult || '暂无详细处理说明。'}”
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* 右侧：截图与标签 */}
            <div className="flex-1 space-y-10">
              {/* 应用截图 */}
              <section className="space-y-4">
                <h3 className="text-lg font-black text-gray-800">应用截图</h3>
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100 aspect-video flex items-center justify-center">
                  {app.screenshots && app.screenshots.length > 0 ? (
                    <img src={app.screenshots[0]} alt="Screenshot" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-300 flex flex-col items-center">
                      <Monitor className="w-12 h-12 mb-2" />
                      <span className="text-xs font-bold">暂无截图</span>
                    </div>
                  )}
                </div>
              </section>

              {/* 标签信息 */}
              <section className="space-y-4">
                <h3 className="text-lg font-black text-gray-800">标签信息</h3>
                <div className="flex flex-wrap gap-3">
                  {(app.tags || ['城市规划', '空间分析', '遥感监测', '城市扩张']).map((tag, i) => {
                    const colors = [
                      'bg-blue-50 text-blue-600',
                      'bg-emerald-50 text-emerald-600',
                      'bg-purple-50 text-purple-600',
                      'bg-amber-50 text-amber-600'
                    ];
                    return (
                      <span key={i} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${colors[i % colors.length]}`}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </section>
            </div>

          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-8 py-5 border-t border-gray-100 flex justify-end bg-white">
          <button 
            onClick={() => setView('list')}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    );
  };

  if (view === 'detail') {
    return <AppDetailView />;
  }

  if (view === 'form') {
    return (
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-10 animate-in slide-in-from-right-10 duration-500 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {editingId ? '编辑应用' : '新增应用'}
          </h2>
          <button onClick={() => { setView('list'); resetForm(); }} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-12">
          {/* 1. 应用信息 */}
          <section className="space-y-6">
            <h3 className="flex items-center text-base font-black text-gray-900">
              <div className="p-1.5 bg-blue-50 rounded-lg mr-2">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              应用信息
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">
                  应用名称 <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="请输入应用名称" 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">
                  应用场景
                </label>
                <div className="relative">
                  <button 
                    onClick={() => setIsSceneModalOpen(true)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none text-left text-sm text-gray-400 flex items-center justify-between"
                  >
                    <span className={formScene ? "text-gray-900 font-bold" : ""}>{formScene || "请选择应用场景"}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">
                    发布类目 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none text-left text-sm text-gray-400 flex items-center justify-between hover:border-blue-500 transition-all"
                    >
                      <span className={formCategory ? "text-gray-900 font-bold" : ""}>{formCategory || "请选择发布类目"}</span>
                      <Tag className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">
                    应用特性 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsFeatureModalOpen(true)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none text-left text-sm text-gray-400 flex items-center justify-between hover:border-blue-500 transition-all"
                    >
                      <span className={formFeature ? "text-gray-900 font-bold" : ""}>{formFeature || "请选择应用特性"}</span>
                      <Sparkles className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. 应用配置 */}
          <section className="space-y-6">
            <h3 className="flex items-center text-base font-black text-gray-900">
              <div className="p-1.5 bg-blue-50 rounded-lg mr-2">
                <Settings className="w-4 h-4 text-blue-600" />
              </div>
              应用配置
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">应用访问地址</label>
                <input 
                  type="text" 
                  value={visitUrl}
                  onChange={(e) => setVisitUrl(e.target.value)}
                  placeholder="请输入应用访问地址" 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">应用简介</label>
                <textarea 
                  rows={1} 
                  value={appIntro}
                  onChange={(e) => setAppIntro(e.target.value)}
                  placeholder="请输入应用简介" 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm resize-none" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">
                应用封面 <span className="text-rose-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-100 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50/30 hover:bg-white hover:border-blue-300 transition-all cursor-pointer group">
                <Upload className="w-8 h-8 text-gray-300 group-hover:text-blue-500 mb-2 transition-colors" />
                <p className="text-xs font-bold text-gray-600">点击上传或拖拽应用图标至此处</p>
                <p className="text-[10px] text-gray-400 mt-1">支持 PNG, JPG (推荐尺寸 256x256px, 最大 5MB)</p>
              </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">标签信息</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => (
                    <span key={tag} className="flex items-center px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                      {tag} <X className="w-3 h-3 ml-2 cursor-pointer hover:text-blue-800" onClick={() => setTags(tags.filter(t => t !== tag))} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="输入标签后按回车添加" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val && !tags.includes(val)) setTags([...tags, val]);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm" 
                  />
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95">添加标签</button>
                </div>
            </div>
          </section>

          {/* 3. 应用详情 */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center text-base font-black text-gray-900">
                <div className="p-1.5 bg-blue-50 rounded-lg mr-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                应用详情 <span className="text-rose-500 ml-0.5">*</span>
              </h3>
              <button className="flex items-center px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-black hover:bg-amber-600 transition-all">
                <Edit3 className="w-3 h-3 mr-1" /> 编辑
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50/50 border-b border-gray-200 p-2 flex items-center space-x-4">
                <Bold className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-900" />
                <Italic className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-900" />
                <Underline className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-900" />
                <div className="w-px h-4 bg-gray-200" />
                <List className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-900" />
                <LinkIcon className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-900" />
              </div>
              <textarea 
                rows={8} 
                value={appDetails}
                onChange={(e) => setAppDetails(e.target.value)}
                placeholder="请输入应用详细描述信息..." 
                className="w-full p-4 focus:outline-none text-sm text-gray-600 font-bold placeholder:italic" 
              />
            </div>
          </section>

          {/* 4. 主要技术 */}
          <section className="space-y-6">
            <h3 className="flex items-center text-base font-black text-gray-900">
              <div className="p-1.5 bg-blue-50 rounded-lg mr-2">
                <Cpu className="w-4 h-4 text-blue-600" />
              </div>
              主要技术 <span className="text-rose-500 ml-0.5">*</span>
            </h3>
            <textarea 
              rows={3} 
              value={mainTech}
              onChange={(e) => setMainTech(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm resize-none" 
            />
          </section>

          {/* 5. 应用界面 */}
          <section className="space-y-6">
            <h3 className="flex items-center text-base font-black text-gray-900">
              <div className="p-1.5 bg-blue-50 rounded-lg mr-2">
                <Monitor className="w-4 h-4 text-blue-600" />
              </div>
              应用界面 <span className="text-rose-500 ml-0.5">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 font-bold">应用截图 1</p>
                <div className="border-2 border-dashed border-gray-100 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50/30 hover:border-blue-300 transition-all cursor-pointer group h-40">
                  <Upload className="w-6 h-6 text-gray-300 group-hover:text-blue-500 mb-2 transition-colors" />
                  <p className="text-[10px] font-bold text-gray-500">点击上传或拖拽图片至此处</p>
                  <p className="text-[9px] text-gray-400 mt-1">支持 PNG, JPG (推荐尺寸 1280x720px)</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 font-bold">应用截图 2</p>
                <div className="border-2 border-dashed border-gray-100 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50/30 hover:border-blue-300 transition-all cursor-pointer group h-40">
                  <Upload className="w-6 h-6 text-gray-300 group-hover:text-blue-500 mb-2 transition-colors" />
                  <p className="text-[10px] font-bold text-gray-500">点击上传或拖拽图片至此处</p>
                  <p className="text-[9px] text-gray-400 mt-1">支持 PNG, JPG (推荐尺寸 1280x720px)</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="flex items-center text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest">
                <Plus className="w-3.5 h-3.5 mr-1" /> 添加更多截图
              </button>
            </div>
          </section>

          {/* 6. 应用案例 */}
          <section className="space-y-6">
            <h3 className="flex items-center text-base font-black text-gray-900">
              <div className="p-1.5 bg-blue-50 rounded-lg mr-2">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              应用案例
            </h3>
            <div className="bg-gray-50/30 p-8 rounded-2xl border border-gray-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">案例名称</label>
                  <input 
                    type="text" 
                    value={caseName}
                    onChange={(e) => setCaseName(e.target.value)}
                    placeholder="请输入案例名称" 
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none text-sm" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">应用行业</label>
                  <div className="relative">
                    <select 
                      value={caseIndustry}
                      onChange={(e) => setCaseIndustry(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none appearance-none text-sm text-gray-900 font-bold"
                    >
                      <option value="">请选择应用行业</option>
                      <option value="城市治理">城市治理</option>
                      <option value="智慧农业">智慧农业</option>
                      <option value="自然资源监测">自然资源监测</option>
                      <option value="生态环境">生态环境</option>
                      <option value="交通运输">交通运输</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">案例图片</label>
                <div className="border-2 border-dashed border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center bg-white hover:border-blue-300 transition-all cursor-pointer group">
                  <Upload className="w-6 h-6 text-gray-300 group-hover:text-blue-500 mb-2" />
                  <p className="text-xs font-bold text-gray-500">点击上传或拖拽案例图片至此处</p>
                  <p className="text-[9px] text-gray-400 mt-1">支持 PNG, JPG, GIF (最大 10MB)</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">案例描述</label>
                <textarea 
                  rows={4} 
                  value={caseDesc}
                  onChange={(e) => setCaseDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none text-sm resize-none" 
                />
              </div>
              <div className="flex justify-end">
                <button className="flex items-center text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest">
                  <Plus className="w-3.5 h-3.5 mr-1" /> 添加更多案例
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* 底部操作栏 */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end space-x-4">
          <button 
            onClick={() => { setView('list'); resetForm(); }} 
            className="px-8 py-3 bg-gray-100 text-gray-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
          >
            取消
          </button>
          <button 
            onClick={() => { setView('list'); resetForm(); }} 
            className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            {editingId ? '更新应用' : '保存应用'}
          </button>
        </div>

        {/* 应用场景选择弹窗 */}
        {isSceneModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[80vh] animate-in zoom-in-95 duration-300">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
                  <LayoutGrid className="w-6 h-6 mr-3 text-blue-600" />
                  选择应用场景
                </h3>
                <button onClick={() => setIsSceneModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-xl transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 bg-gray-50/50 border-b border-gray-100">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    value={sceneSearch}
                    onChange={(e) => setSceneSearch(e.target.value)}
                    placeholder="输入场景名称进行搜索..." 
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold shadow-sm"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                {SCENE_TEMPLATES.filter(s => s.name.includes(sceneSearch)).map((template) => (
                  <button 
                    key={template.name}
                    onClick={() => handleSelectScene(template)}
                    className="w-full p-6 text-left bg-white border border-gray-100 rounded-3xl transition-all flex items-center justify-between group hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5"
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-black text-lg text-gray-900 tracking-tight">{template.name}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-bold leading-relaxed line-clamp-1 italic">
                        “{template.config.intro}”
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/20 flex justify-end">
                <button 
                  onClick={() => setIsSceneModalOpen(false)}
                  className="px-8 py-2.5 text-xs font-black text-gray-500 hover:text-gray-900 uppercase tracking-widest"
                >
                  取消选择
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 发布类目选择弹窗 */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[80vh] animate-in zoom-in-95 duration-300">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
                  <Tag className="w-6 h-6 mr-3 text-blue-600" />
                  选择发布类目
                </h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-xl transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 bg-gray-50/50 border-b border-gray-100">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="搜索类目标签..." 
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold shadow-sm"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 flex flex-wrap gap-3 custom-scrollbar">
                {APP_CATEGORY_TAGS.filter(cat => cat.includes(categorySearch)).map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold border transition-all ${
                      formCategory === cat 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20' 
                        : 'bg-white text-gray-600 border-gray-100 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/20 flex justify-end">
                <button 
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-8 py-2.5 text-xs font-black text-gray-500 hover:text-gray-900 uppercase tracking-widest"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 应用特性选择弹窗 */}
        {isFeatureModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[80vh] animate-in zoom-in-95 duration-300">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 text-blue-600" />
                  选择应用特性
                </h3>
                <button onClick={() => setIsFeatureModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-xl transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 bg-gray-50/50 border-b border-gray-100">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    value={featureSearch}
                    onChange={(e) => setFeatureSearch(e.target.value)}
                    placeholder="搜索特性标签..." 
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold shadow-sm"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 flex flex-wrap gap-3 custom-scrollbar">
                {APP_FEATURE_TAGS.filter(feat => feat.includes(featureSearch)).map((feat) => (
                  <button 
                    key={feat}
                    onClick={() => handleSelectFeature(feat)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold border transition-all ${
                      formFeature === feat 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20' 
                        : 'bg-white text-gray-600 border-gray-100 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {feat}
                  </button>
                ))}
              </div>

              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/20 flex justify-end">
                <button 
                  onClick={() => setIsFeatureModalOpen(false)}
                  className="px-8 py-2.5 text-xs font-black text-gray-500 hover:text-gray-900 uppercase tracking-widest"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">应用总数</p>
            <div className="flex items-end space-x-3">
              <h3 className="text-4xl font-black text-gray-900 leading-none">28</h3>
              <div className="flex items-center text-emerald-500 text-xs font-black mb-1">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                12.5% <span className="text-gray-300 font-medium ml-1">较上月</span>
              </div>
            </div>
          </div>
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
            <AppWindow className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">已审核</p>
            <div className="flex items-end space-x-3">
              <h3 className="text-4xl font-black text-gray-900 leading-none">23</h3>
              <div className="flex items-center text-emerald-500 text-xs font-black mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                83.3% <span className="text-gray-300 font-medium ml-1">审核通过率</span>
              </div>
            </div>
          </div>
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-[1.5rem] flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
            <CheckCircle className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">待审核</p>
            <div className="flex items-end space-x-3">
              <h3 className="text-4xl font-black text-gray-900 leading-none">5</h3>
              <div className="flex items-center text-amber-500 text-xs font-black mb-1">
                <Clock className="w-3.5 h-3.5 mr-1" />
                24 小时内 <span className="text-gray-300 font-medium ml-1">预计完成审核</span>
              </div>
            </div>
          </div>
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-[1.5rem] flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
            <History className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-gray-900 font-black text-sm tracking-tight">筛选条件:</span>
          <div className="relative">
            <select className="appearance-none pl-5 pr-12 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none hover:bg-white hover:border-blue-200 transition-all cursor-pointer">
              <option>全部应用场景</option>
              <option>城市治理</option>
              <option>生态环境</option>
              <option>低空经济</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="appearance-none pl-5 pr-12 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none hover:bg-white hover:border-blue-200 transition-all cursor-pointer"
            >
              <option value="全部">全部状态</option>
              <option value="已通过">已通过</option>
              <option value="待审核">待审核</option>
              <option value="已驳回">已驳回</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select className="appearance-none pl-5 pr-12 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none hover:bg-white hover:border-blue-200 transition-all cursor-pointer">
              <option>更新时间</option>
              <option>近一周</option>
              <option>近一月</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="搜索应用名称..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-72 pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all"
            />
          </div>
          <button className="flex items-center px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </button>
        </div>
      </div>

      {/* List Card */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/10">
          <h4 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
             <LayoutGrid className="w-6 h-6 mr-3 text-blue-600" />
             应用列表
          </h4>
          <button 
            onClick={handleAddClick}
            className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 group uppercase tracking-widest"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
            新增应用
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">编号</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">应用名称</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">发布类目</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">状态</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">提交时间</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApps.map((app) => (
                <tr key={app.id} className="group hover:bg-blue-50/20 transition-all">
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-gray-500">{app.id}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                        <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col max-w-[300px]">
                        <span className="text-sm font-black text-gray-900 leading-tight mb-1">{app.name}</span>
                        <span className="text-[11px] text-gray-400 font-medium line-clamp-1 italic">“{app.desc}”</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-bold text-gray-600">
                      {app.category || app.scene}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        app.status === '已通过' ? 'bg-emerald-500' : app.status === '待审核' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs text-gray-400 font-bold tracking-tight">{app.submitTime}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-end space-x-6">
                      <button 
                        onClick={() => handleViewDetail(app.id)}
                        className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest"
                      >
                        查看
                      </button>
                      
                      {app.status === '已通过' && (
                        <button 
                          onClick={() => handleDeleteClick(app)}
                          className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest"
                        >
                          删除
                        </button>
                      )}

                      {app.status === '待审核' && (
                        <>
                          <button className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest">撤回</button>
                        </>
                      )}

                      {app.status === '已驳回' && (
                        <>
                          <button 
                            onClick={() => handleEditClick(app)}
                            className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest"
                          >
                            编辑
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(app)}
                            className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest"
                          >
                            删除
                          </button>
                          <button className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 uppercase tracking-widest">提交审核</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-10 py-8 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/10">
          <span className="text-[11px] text-gray-400 font-black uppercase tracking-widest">
             显示 1 到 {filteredApps.length} 条，共 {apps.length} 条记录
          </span>
          <div className="flex items-center space-x-3">
             <div className="flex items-center bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold text-gray-500">
                10条/页 <ChevronDown className="w-3 h-3 ml-2" />
             </div>
             <div className="flex items-center space-x-2">
                <button className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-blue-600 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <button className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20">1</button>
                <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors font-bold text-xs">2</button>
                <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors font-bold text-xs">3</button>
                <button className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-blue-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
             </div>
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/10">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">确认删除该应用资源？</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
                您正在尝试删除应用 <span className="text-gray-900 font-black">“{appToDelete?.name}”</span>，此操作无法撤销。
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
    </div>
  );
};
