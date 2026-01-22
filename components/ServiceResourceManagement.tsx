
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  Filter, 
  Settings, 
  CheckCircle2, 
  Hourglass,
  ChevronLeft, 
  ChevronRight,
  X,
  ArrowUpRight,
  Trash2,
  Upload,
  Info,
  Layers,
  FileText,
  MapPin,
  ExternalLink,
  Edit,
  CircleHelp,
  Check,
  AlertTriangle,
  Tag
} from 'lucide-react';

interface Parameter {
  name: string;
  type: string;
  required: string;
  defaultValue?: string;
  desc: string;
}

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  url: string;
  status: '草稿中' | '待审核' | '已通过' | '已驳回';
  updateTime: string;
  category?: string;
  type?: string; // 新增：服务类型
  // 详情扩展字段
  method?: string;
  submitter?: string;
  submitTime?: string;
  parameters?: Parameter[];
  tags?: string[];
  processResult?: string;
}

interface OperatorSource {
  id: string;
  name: string;
  type: string;
  version: string;
  url: string;
  intro: string;
  parameters: Parameter[];
  detail: string;
  case: { name: string; industry: string; desc: string };
  tags: string[];
}

interface PriceOption {
  id: string;
  label: string;
  description: string;
  value: string;
}

const SERVICE_CATEGORY_TAGS = [
  "语义分割",
  "变化监测",
  "目标监测",
  "参数反演",
  "特征提取",
  "图像融合"
];

const MOCK_PRICES: PriceOption[] = [
  { id: 'p1', label: '500元 / 次', description: '适用于基础规模的算子调用', value: '500' },
  { id: 'p2', label: '1000元 / 次', description: '适用于中等规模的算子调用', value: '1000' },
  { id: 'p3', label: '2000元 / 次', description: '适用于大规模、高频率的算子调用', value: '2000' },
  { id: 'p4', label: '5000元 / 次', description: '企业级旗舰型算子调用套餐', value: '5000' },
  { id: 'p5', label: '定制报价', description: '根据具体需求进行非标定价', value: 'custom' },
  { id: 'p6', label: '免费试用', description: '限时限次免费调用', value: '0' },
  { id: 'p7', label: '800元 / 次', description: '阶梯定价 A 档', value: '800' },
  { id: 'p8', label: '1500元 / 次', description: '阶梯定价 B 档', value: '1500' },
];

const MOCK_OPERATORS: OperatorSource[] = [
  {
    id: 'op-1',
    name: '高精度建筑物提取算子',
    type: '图像识别',
    version: 'v2.1.0',
    url: 'https://api.ai-gis.com/v1/extract-building',
    intro: '基于深度残差网络的建筑物轮廓自动提取算子，支持多种遥感影像格式。',
    parameters: [
      { name: 'image_url', type: '字符串', required: '是', defaultValue: '', desc: '原始影像访问地址' },
      { name: 'threshold', type: '数值', required: '否', defaultValue: '0.5', desc: '置信度阈值' }
    ],
    detail: '本算子采用先进的Mask R-CNN架构，针对城市密集区域 and 农村分散建筑进行了专项优化。提取精度在验证集上达到92%以上。支持亚分级精度输出，可直接对接城市管理违建巡查系统。',
    case: { name: '某市违建巡查项目', industry: '城市规划', desc: '通过该算子实现了全市域周度动态巡查，发现违建疑似点200余处。' },
    tags: ['建筑物识别', '深度学习', '自动提取']
  },
  {
    id: 'op-2',
    name: '地表覆盖分类模型(10类)',
    type: '分类模型',
    version: 'v1.0.5',
    url: 'https://api.ai-gis.com/v2/land-cover',
    intro: '全自动地表覆盖类型识别，支持耕地、林地、草地、水域等10大类地物。',
    parameters: [
      { name: 'area_id', type: '字符串', required: '是', defaultValue: '', desc: '行政区划代码' },
      { name: 'year', type: '字符串', required: '是', defaultValue: '2023', desc: '年份' }
    ],
    detail: '采用全球通用的地物分类标准，结合本地化训练集。支持多时相数据对比，生成年度地表覆盖动态变化报告。',
    case: { name: '自然资源普查', industry: '自然资源', desc: '用于年度变更调查工作，极大减少了人工外业核查的工作量。' },
    tags: ['地物分类', '多光谱', '自然资源']
  }
];

const MOCK_SERVICES: ServiceItem[] = [
  {
    id: 'SRV-001',
    name: '遥感数据查询服务',
    description: '遥感数据查询服务提供多源遥感数据检索与获取能力，支持按时间、区域、传感器等条件进行查询。',
    url: 'https://service.example.com/remote-sensing/query',
    status: '草稿中',
    updateTime: '2023-06-15 14:30',
    method: 'API接口',
    type: '算子服务',
    submitter: '张工程师',
    submitTime: '2023-06-15 14:30',
    category: '语义分割',
    tags: ['遥感数据', 'API', '数据查询'],
    parameters: [
      { name: 'datasetId', type: 'string', required: '是', desc: '数据集ID' },
      { name: 'bbox', type: 'array', required: '否', desc: '查询范围边界框' },
      { name: 'timeRange', type: 'array', required: '否', desc: '时间范围' }
    ],
    processResult: '服务处于草稿状态，等待提交审核'
  },
  {
    id: 'SRV-002',
    name: '变化检测分析服务',
    description: '提供多时相影像变化检测与分析能力',
    url: 'https://service.example.com/analysis/change-detection',
    status: '待审核',
    updateTime: '2023-06-10 10:20',
    method: 'API接口',
    type: '算子服务',
    submitter: '王工程师',
    submitTime: '2023-06-10 10:15',
    category: '变化监测',
    tags: ['变化检测', '算法服务'],
    parameters: [
      { name: 'pre_image', type: 'string', required: '是', desc: '前时相影像ID' },
      { name: 'post_image', type: 'string', required: '是', desc: '后时相影像ID' }
    ],
    processResult: '已提交审核，预计2个工作日内完成审核'
  },
  {
    id: 'SRV-003',
    name: '高精度建筑物提取',
    description: '自动提取影像中的建筑物轮廓',
    url: 'https://service.example.com/analysis/building-extraction',
    status: '已通过',
    updateTime: '2023-06-08 09:15',
    submitTime: '2023-06-08 09:00',
    method: 'API接口',
    type: '模型服务',
    submitter: '李工程师',
    category: '目标监测',
    tags: ['建筑物', 'AI提取']
  },
  {
    id: 'SRV-004',
    name: '植被覆盖率计算',
    description: '计算指定区域的植被覆盖指数',
    url: 'https://service.example.com/analysis/vegetation',
    status: '已驳回',
    updateTime: '2023-06-05 16:45',
    submitTime: '2023-06-05 10:00',
    method: 'API接口',
    type: '算子服务',
    submitter: '赵工程师',
    category: '参数反演',
    processResult: '算法精度不达标，请优化模型后重新提交'
  }
];

export const ServiceResourceManagement: React.FC<{ title?: string }> = ({ title }) => {
  const [view, setView] = useState<'list' | 'add' | 'edit' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<ServiceItem[]>(MOCK_SERVICES);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // 删除对话框状态
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);

  // 表单受控状态
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [selectedOp, setSelectedOp] = useState<OperatorSource | null>(null);
  const [serviceUrl, setServiceUrl] = useState('');
  const [concurrence, setConcurrence] = useState('100');
  const [parameters, setParameters] = useState<Parameter[]>([{ name: '', type: '字符串', required: '是', defaultValue: '', desc: '' }]);
  const [intro, setIntro] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [detail, setDetail] = useState('');
  const [caseInfo, setCaseInfo] = useState({ name: '', industry: '', desc: '' });
  const [priceType, setPriceType] = useState<'select' | 'input'>('select');
  const [selectedPriceLabel, setSelectedPriceLabel] = useState('请选择算子服务价格');

  // 弹窗状态
  const [isOpModalOpen, setIsOpModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [priceModalSearch, setPriceModalSearch] = useState('');

  const handleResetForm = () => {
    setFormName('');
    setFormCategory('');
    setSelectedOp(null);
    setServiceUrl('');
    setConcurrence('100');
    setParameters([{ name: '', type: '字符串', required: '是', defaultValue: '', desc: '' }]);
    setIntro('');
    setTags([]);
    setDetail('');
    setCaseInfo({ name: '', industry: '', desc: '' });
    setSelectedPriceLabel('请选择算子服务价格');
  };

  const addParameter = () => {
    setParameters([...parameters, { name: '', type: '字符串', required: '是', defaultValue: '', desc: '' }]);
  };

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleSelectOp = (op: OperatorSource) => {
    setSelectedOp(op);
    setFormName(op.name);
    setServiceUrl(op.url);
    setIntro(op.intro);
    setParameters(op.parameters);
    setTags(op.tags);
    setDetail(op.detail);
    setCaseInfo(op.case);
    setIsOpModalOpen(false);
  };

  const handleSelectCategory = (cat: string) => {
    setFormCategory(cat);
    setIsCategoryModalOpen(false);
  };

  const handleSelectPrice = (price: PriceOption) => {
    setSelectedPriceLabel(price.label);
    setIsPriceModalOpen(false);
  };

  const handleViewDetail = (id: string) => {
    setSelectedServiceId(id);
    setView('detail');
  };

  const handleEditClick = (service: ServiceItem) => {
    setSelectedServiceId(service.id);
    setFormName(service.name);
    setFormCategory(service.category || '');
    setServiceUrl(service.url);
    setIntro(service.description);
    setParameters(service.parameters || [{ name: '', type: '字符串', required: '是', defaultValue: '', desc: '' }]);
    setTags(service.tags || []);
    setDetail(service.description);
    const matchingOp = MOCK_OPERATORS.find(op => op.url === service.url);
    setSelectedOp(matchingOp || null);
    setView('edit');
  };

  const handleDeleteClick = (service: ServiceItem) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      setServices(services.filter(s => s.id !== serviceToDelete.id));
    }
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case '草稿中': return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[11px] rounded-md border border-gray-200 font-bold">草稿中</span>;
      case '待审核': return <span className="px-3 py-1 bg-[#fefce8] text-[#854d0e] text-[11px] rounded-md border border-[#fef08a] font-bold">待审核</span>;
      case '已通过': return <span className="px-3 py-1 bg-[#f0fdf4] text-[#166534] text-[11px] rounded-md border border-[#bbf7d0] font-bold">已通过</span>;
      case '已驳回': return <span className="px-3 py-1 bg-[#fef2f2] text-[#991b1b] text-[11px] rounded-md border border-[#fecaca] font-bold">已驳回</span>;
      default: return null;
    }
  };

  const filteredServices = services.filter(s => s.name.includes(searchQuery));

  if (view === 'detail') {
    const service = services.find(s => s.id === selectedServiceId);
    if (!service) return null;

    return (
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col min-h-screen animate-in fade-in duration-500 overflow-hidden relative">
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">服务资源详情</h2>
          <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-12">
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-8 tracking-tight">基本信息</h3>
                <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-2 tracking-wider">服务名称</p>
                    <p className="text-base font-bold text-gray-800">{service.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-2 tracking-wider">服务方式</p>
                    <p className="text-base font-bold text-gray-800">{service.method || 'API接口'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-2 tracking-wider">提交人</p>
                    <p className="text-base font-bold text-gray-800">{service.submitter || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-2 tracking-wider">提交时间</p>
                    <p className="text-base font-bold text-gray-800">{service.submitTime || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 font-bold mb-2 tracking-wider">发布类目</p>
                    <p className="text-base font-bold text-gray-800">{service.category || '未设置'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 font-bold mb-2 tracking-wider">服务状态</p>
                    <StatusBadge status={service.status} />
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 font-bold mb-2 tracking-wider">访问地址</p>
                    <a href={service.url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 font-medium hover:underline flex items-center">
                      {service.url} <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-6 tracking-tight">接口参数</h3>
                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400">参数名称</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400">类型</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400">是否必填</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400">描述</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {service.parameters?.map((p, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 text-sm font-bold text-gray-800">{p.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{p.type}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{p.required}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 tracking-tight">服务描述</h3>
                <div className="text-sm text-gray-600 leading-relaxed font-medium">
                  {service.description}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 tracking-tight">处理结果</h3>
                <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 text-sm text-gray-500 font-medium">
                  {service.processResult || '暂无处理记录'}
                </div>
              </section>
            </div>

            <div className="w-full lg:w-80">
              <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-6">
                <h4 className="text-base font-black text-gray-900 tracking-tight">服务标签</h4>
                <div className="flex flex-wrap gap-2">
                  {service.tags?.map((tag, i) => (
                    <span 
                      key={i} 
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        i % 3 === 0 ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                        i % 3 === 1 ? 'bg-indigo-50 text-indigo-500 border-indigo-100' : 
                        'bg-sky-50 text-sky-600 border-sky-100'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-6 border-t border-gray-100 flex justify-end bg-white">
          <button 
            onClick={() => setView('list')}
            className="px-10 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    );
  }

  if (view === 'add' || view === 'edit') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-screen animate-in slide-in-from-right-10 duration-500 overflow-hidden relative">
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{view === 'add' ? '新增服务' : '编辑服务'}</h2>
          <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-slate-50/10">
          <section className="space-y-4">
            <h3 className="flex items-center text-sm font-bold text-gray-900 border-l-4 border-blue-600 pl-3">
              <Info className="w-4 h-4 mr-2 text-blue-500" /> 基础信息
            </h3>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  服务名称 <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="请输入服务名称" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">服务选择</label>
                <div className="space-y-2">
                  <div className="relative">
                    <button 
                      onClick={() => setIsOpModalOpen(true)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center justify-between hover:border-blue-500 transition-colors"
                    >
                      {selectedOp ? selectedOp.name : "请选择服务"}
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 flex items-center">
                    <CircleHelp className="w-3 h-3 mr-1" /> 点击选择需要关联的算子资源，选择后将自动同步相关参数 and 描述
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">发布类目 <span className="text-rose-500 font-bold ml-0.5">*</span></label>
                <div className="relative">
                  <button 
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center justify-between hover:border-blue-500 transition-colors"
                  >
                    <span className={formCategory ? "text-gray-900 font-bold" : ""}>{formCategory || "请选择发布类目"}</span>
                    <Tag className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="flex items-center text-sm font-bold text-gray-900 border-l-4 border-blue-600 pl-3">
              <Layers className="w-4 h-4 mr-2 text-blue-500" /> 参数配置
            </h3>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">服务地址 <span className="text-rose-500 font-bold">*</span></label>
                  <input 
                    type="text" 
                    value={serviceUrl}
                    onChange={(e) => setServiceUrl(e.target.value)}
                    placeholder="请输入服务地址" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">最大并发数</label>
                  <input 
                    type="text" 
                    value={concurrence}
                    onChange={(e) => setConcurrence(e.target.value)}
                    placeholder="请输入最大并发数" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">输入参数配置</label>
                <div className="border border-gray-100 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/50 text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-bold border-b border-gray-100">参数名称</th>
                        <th className="px-4 py-3 font-bold border-b border-gray-100">参数类型</th>
                        <th className="px-4 py-3 font-bold border-b border-gray-100">是否必填</th>
                        <th className="px-4 py-3 font-bold border-b border-gray-100">默认值</th>
                        <th className="px-4 py-3 font-bold border-b border-gray-100">描述</th>
                        <th className="px-4 py-3 font-bold border-b border-gray-100 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {parameters.map((param, i) => (
                        <tr key={i}>
                          <td className="px-3 py-3">
                            <input type="text" value={param.name} placeholder="参数名称" className="w-full px-3 py-1.5 border border-gray-100 rounded focus:border-blue-500 focus:outline-none" />
                          </td>
                          <td className="px-3 py-3">
                            <div className="relative">
                              <select value={param.type} className="w-full appearance-none px-3 py-1.5 border border-gray-100 rounded focus:border-blue-500 focus:outline-none pr-8">
                                <option>字符串</option>
                                <option>数值</option>
                                <option>布尔值</option>
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="relative">
                              <select value={param.required} className="w-full appearance-none px-3 py-1.5 border border-gray-100 rounded focus:border-blue-500 focus:outline-none pr-8">
                                <option>是</option>
                                <option>否</option>
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <input type="text" value={param.defaultValue} placeholder="默认值" className="w-full px-3 py-1.5 border border-gray-100 rounded focus:border-blue-500 focus:outline-none" />
                          </td>
                          <td className="px-3 py-3">
                            <input type="text" value={param.desc} placeholder="描述" className="w-full px-3 py-1.5 border border-gray-100 rounded focus:border-blue-500 focus:outline-none" />
                          </td>
                          <td className="px-3 py-3 text-center">
                            <button onClick={() => removeParameter(i)} className="text-rose-500 p-1.5 hover:bg-rose-50 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={addParameter} className="mt-3 flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 ml-auto uppercase tracking-wider">
                  <Plus className="w-3.5 h-3.5 mr-1" /> 添加参数
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  服务简介 <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea 
                  rows={3} 
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="请输入服务的简单功能说明" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">服务封面</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:border-blue-300 transition-all group cursor-pointer">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">点击上传或拖拽文件至此处</p>
                  <p className="text-[10px] text-gray-400">支持 PNG, JPG, GIF (最大 5MB)</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">标签项</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => (
                    <span key={tag} className="flex items-center px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
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
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" 
                  />
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95">添加标签</button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">服务价格</label>
                <div className="flex items-center space-x-6 mb-4">
                  <label className="flex items-center text-sm text-gray-700 font-bold cursor-pointer">
                    <input type="radio" checked={priceType === 'select'} onChange={() => setPriceType('select')} className="w-4 h-4 text-blue-600 mr-2" />
                    选择价格
                  </label>
                  <label className="flex items-center text-sm text-gray-700 font-bold cursor-pointer">
                    <input type="radio" checked={priceType === 'input'} onChange={() => setPriceType('input')} className="w-4 h-4 text-blue-600 mr-2" />
                    输入价格
                  </label>
                </div>
                {priceType === 'select' ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsPriceModalOpen(true)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center justify-between hover:border-blue-500 transition-colors"
                    >
                      {selectedPriceLabel}
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="请输入价格"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" 
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-l-4 border-blue-600 pl-3">
              <h3 className="flex items-center text-sm font-bold text-gray-900">
                <FileText className="w-4 h-4 mr-2 text-blue-500" /> 详情描述
              </h3>
              <button className="text-[10px] font-bold text-blue-600 flex items-center hover:underline">
                <Edit className="w-3 h-3 mr-1" /> 切换富文本编辑
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <textarea 
                rows={6} 
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none" 
              />
            </div>
          </section>

          <section className="space-y-4 pb-12">
            <h3 className="flex items-center text-sm font-bold text-gray-900 border-l-4 border-blue-600 pl-3">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" /> 应用案例
            </h3>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">案例名称</label>
                  <input 
                    type="text" 
                    value={caseInfo.name}
                    onChange={(e) => setCaseInfo({...caseInfo, name: e.target.value})}
                    placeholder="请输入案例名称" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">应用行业</label>
                  <div className="relative">
                    <select 
                      value={caseInfo.industry}
                      onChange={(e) => setCaseInfo({...caseInfo, industry: e.target.value})}
                      className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-sm text-gray-500"
                    >
                      <option value="">请选择应用行业</option>
                      <option value="气象减灾">气象减灾</option>
                      <option value="土地资源">土地资源</option>
                      <option value="城市规划">城市规划</option>
                      <option value="自然资源">自然资源</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">案例图片</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:border-blue-300 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-gray-900 mb-1">点击上传或拖拽案例图片至此处</p>
                  <p className="text-[10px] text-gray-400">支持 PNG, JPG, GIF (最大 10MB)</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">案例描述</label>
                <textarea 
                  rows={4} 
                  value={caseInfo.desc}
                  onChange={(e) => setCaseInfo({...caseInfo, desc: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-sm resize-none" 
                />
              </div>
              <button className="flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 ml-auto uppercase tracking-[0.2em]">
                <Plus className="w-3.5 h-3.5 mr-1" /> 添加更多案例
              </button>
            </div>
          </section>
        </div>

        <div className="px-8 py-5 border-t border-gray-100 flex justify-end space-x-3 bg-white z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <button onClick={() => setView('list')} className="px-8 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">取消</button>
          <button onClick={() => setView('list')} className="px-10 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
            {view === 'add' ? '保存服务' : '更新服务'}
          </button>
        </div>

        {isOpModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[80vh]">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">选择算子服务</h3>
                <button onClick={() => setIsOpModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 border-b border-gray-100 bg-slate-50/30">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder="输入算子名称或分类搜索..." 
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {MOCK_OPERATORS.filter(op => op.name.includes(modalSearch) || op.type.includes(modalSearch)).map((op) => (
                  <div 
                    key={op.id}
                    onClick={() => handleSelectOp(op)}
                    className={`w-full p-5 text-left border rounded-2xl transition-all cursor-pointer flex items-center justify-between group ${
                      selectedOp?.id === op.id 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20' 
                        : 'bg-white text-gray-700 border-gray-100 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-bold text-base">{op.name}</span>
                        <span className={`ml-3 px-2 py-0.5 text-[10px] font-bold rounded ${selectedOp?.id === op.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{op.version}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-xs font-medium ${selectedOp?.id === op.id ? 'text-white/70' : 'text-gray-400'}`}>分类: {op.type}</span>
                        <span className={`text-xs font-medium truncate max-w-[300px] ${selectedOp?.id === op.id ? 'text-white/60' : 'text-gray-400'}`}>{op.intro}</span>
                      </div>
                    </div>
                    {selectedOp?.id === op.id ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    )}
                  </div>
                ))}
              </div>

              <div className="px-8 py-6 border-t border-gray-100 bg-slate-50/30 flex justify-between items-center">
                <span className="text-xs text-gray-400">共 {MOCK_OPERATORS.length} 个算子可用</span>
                <button onClick={() => setIsOpModalOpen(false)} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">取消</button>
              </div>
            </div>
          </div>
        )}

        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-300">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 flex items-center tracking-tight">
                  <Tag className="w-6 h-6 mr-3 text-blue-500" /> 选择发布类目
                </h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 bg-gray-50/50 border-b border-gray-100">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="搜索类目标签..." 
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold shadow-sm"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 flex flex-wrap gap-3 custom-scrollbar">
                {SERVICE_CATEGORY_TAGS.filter(cat => cat.includes(categorySearch)).map((cat) => (
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

        {isPriceModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-300">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 flex items-center tracking-tight">
                  <Tag className="w-5 h-5 mr-3 text-blue-500" /> 选择服务价格
                </h3>
                <button onClick={() => setIsPriceModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 border-b border-gray-50 bg-slate-50/20">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    value={priceModalSearch}
                    onChange={(e) => setPriceModalSearch(e.target.value)}
                    placeholder="输入价格关键词或描述搜索..." 
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {MOCK_PRICES.filter(p => p.label.includes(priceModalSearch) || p.description.includes(priceModalSearch)).map((price) => (
                  <button 
                    key={price.id}
                    onClick={() => handleSelectPrice(price)}
                    className={`w-full p-5 text-left border rounded-2xl transition-all flex items-center justify-between group ${
                      selectedPriceLabel === price.label
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20' 
                        : 'bg-white text-gray-700 border-gray-100 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div>
                      <span className="block font-black text-base mb-1">{price.label}</span>
                      <span className={`text-xs font-medium ${selectedPriceLabel === price.label ? 'text-white/70' : 'text-gray-400'}`}>
                        {price.description}
                      </span>
                    </div>
                    {selectedPriceLabel === price.label ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    )}
                  </button>
                ))}
              </div>

              <div className="px-8 py-6 border-t border-gray-100 bg-slate-50/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-white transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg text-xs font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20">1</button>
                  <button className="w-8 h-8 rounded-lg text-xs font-black text-gray-400 border border-gray-100 hover:bg-white transition-all">2</button>
                  <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={() => setIsPriceModalOpen(false)} className="px-8 py-2.5 text-sm font-black text-gray-500 hover:text-gray-900 transition-colors bg-gray-100/50 rounded-xl">
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
    <div className="space-y-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">服务总数</p>
            <h3 className="text-3xl font-bold text-gray-900">{services.length}</h3>
            <p className="mt-2 text-xs flex items-center text-emerald-500 font-bold">
              <ChevronDown className="w-3 h-3 rotate-180 mr-1" /> 15.3% <span className="text-gray-400 font-medium ml-1">较上月</span>
            </p>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <Settings className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">已通过</p>
            <h3 className="text-3xl font-bold text-gray-900">18</h3>
            <p className="mt-2 text-xs flex items-center text-emerald-500 font-bold">
              <ChevronDown className="w-3 h-3 rotate-180 mr-1" /> 8.7% <span className="text-gray-400 font-medium ml-1">较上月</span>
            </p>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">待审核</p>
            <h3 className="text-3xl font-bold text-gray-900">6</h3>
            <p className="mt-2 text-xs flex items-center text-emerald-500 font-bold">
              <Hourglass className="w-3 h-3 mr-1" /> 3 天内 <span className="text-gray-400 font-medium ml-1">平均处理时间</span>
            </p>
          </div>
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
            <Hourglass className="w-7 h-7" />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-gray-900 font-bold text-sm">筛选条件：</span>
          <div className="flex space-x-3">
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none">
                <option>全部状态</option>
                <option>草稿中</option>
                <option>待审核</option>
                <option>已通过</option>
                <option>已驳回</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none">
                <option>全部更新时间</option>
                <option>近一周</option>
                <option>近一月</option>
                <option>近一年</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="搜索服务名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <h4 className="text-xl font-bold text-gray-900">服务列表</h4>
          <button 
            onClick={() => { handleResetForm(); setView('add'); }}
            className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            新增服务
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">编号</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">服务名称</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">发布类目</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">服务类型</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">提交时间</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 text-sm font-medium text-gray-500">{service.id}</td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-bold text-gray-900">{service.name}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm text-gray-600 font-medium">{service.category || '-'}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm text-gray-600 font-medium">{service.type || '-'}</span>
                  </td>
                  <td className="px-6 py-6">
                    <StatusBadge status={service.status} />
                  </td>
                  <td className="px-6 py-6 text-sm text-gray-500 font-medium">
                    {service.submitTime || service.updateTime}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end space-x-3 text-xs font-bold">
                      {/* 查看按钮始终存在 */}
                      <button 
                        onClick={() => handleViewDetail(service.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        查看
                      </button>
                      
                      {/* 基于状态的动态操作 */}
                      {service.status === '草稿中' && (
                        <>
                          <button 
                            onClick={() => handleEditClick(service)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            编辑
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(service)}
                            className="text-red-500 hover:text-red-700"
                          >
                            删除
                          </button>
                          <button className="text-emerald-600 hover:text-emerald-700">提交审核</button>
                        </>
                      )}

                      {/* 待审核状态下仅有查看 */}
                      {service.status === '待审核' && null}

                      {(service.status === '已驳回' || service.status === '已通过') && (
                        <>
                          <button 
                            onClick={() => handleEditClick(service)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            编辑
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(service)}
                            className="text-red-500 hover:text-red-700"
                          >
                            删除
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">显示 1 到 {filteredServices.length} 条，共 {services.length} 条记录</span>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg text-xs font-black bg-blue-600 text-white shadow-lg shadow-blue-500/30">1</button>
            <button className="w-8 h-8 rounded-lg text-xs font-black text-gray-400 hover:bg-gray-100">2</button>
            <button className="w-8 h-8 rounded-lg text-xs font-black text-gray-400 hover:bg-gray-100">3</button>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/10">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">确认删除该服务资源？</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
                您正在尝试删除服务资源 <span className="text-gray-900 font-black">“{serviceToDelete?.name}”</span>，此操作无法撤销。
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
