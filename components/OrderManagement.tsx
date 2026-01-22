
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ClipboardList, 
  Search, 
  TrendingUp, 
  CreditCard, 
  User, 
  ShoppingBag, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  Settings2, 
  X, 
  CheckCircle, 
  FileText, 
  MapPin, 
  Coins,
  Server,
  Database,
  ListFilter,
  Wand2,
  FolderOpen,
  Info,
  CloudUpload,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileCode,
  Loader2,
  Key,
  Link as LinkIcon,
  Copy
} from 'lucide-react';

interface Props {
  title?: string;
}

interface OrderItem {
  name: string;
  price: string;
  spec?: string;
  quantity: number;
  subtotal: string;
}

interface OrderRecord {
  id: string;
  customer: string;
  productName: string;
  productImage?: string;
  category: '数据' | '服务' | '应用';
  productCategory?: string; // For display in table (e.g. '卫星数据', '无人机数据')
  amount: string;
  status: '待付款' | '待发货' | '已发货' | '已完成' | '已取消';
  time: string;
  paymentTime: string;
  paymentMethod: string;
  items: OrderItem[];
  actualPaid?: string;
}

interface DataFile {
  id: string;
  name: string;
  size: string;
  type: 'zip' | 'tif' | 'csv' | 'shp';
}

const MOCK_FILES: DataFile[] = [
  { id: 'f1', name: '海洋环境监测数据集 (2023).zip', size: '1.2 GB', type: 'zip' },
  { id: 'f2', name: '高精度地形高程数据_202305.tif', size: '850 MB', type: 'tif' },
  { id: 'f3', name: '农业遥感监测数据 (2023).csv', size: '120 MB', type: 'csv' },
  { id: 'f4', name: '城市规划GIS数据集_202304.zip', size: '2.4 GB', type: 'zip' },
  { id: 'f5', name: '生态环境评估数据_202303.csv', size: '85 MB', type: 'csv' },
  { id: 'f6', name: '气象卫星云图数据_202305.tif', size: '1.8 GB', type: 'tif' },
  { id: 'f7', name: '土地利用现状数据_202302.shp', size: '750 MB', type: 'shp' },
];

const MOCK_ORDERS: OrderRecord[] = [
  // 服务订单 (Service Orders)
  { 
    id: 'ORD-20230515-002', 
    productName: 'GIS空间分析服务', 
    productImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=100&auto=format&fit=crop',
    customer: '某规划局', 
    category: '服务', 
    productCategory: '服务订单',
    amount: '￥ 8,750.00', 
    actualPaid: '￥ 8,750.00',
    status: '待发货', 
    time: '2023-05-15 14:20:18', 
    paymentTime: '2023-05-15 14:25:00',
    paymentMethod: '对公转账',
    items: [{ name: 'GIS空间分析服务', price: '￥8,750.00', quantity: 1, subtotal: '￥8,750.00' }]
  },
  { 
    id: 'ORD-20230520-008', 
    productName: '遥感图像处理服务', 
    productImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=100&auto=format&fit=crop',
    customer: '某测绘院', 
    category: '服务', 
    productCategory: '服务订单',
    amount: '￥ 6,300.00', 
    actualPaid: '￥ 6,300.00',
    status: '已发货', 
    time: '2023-05-20 16:10:22', 
    paymentTime: '2023-05-20 16:15:00',
    paymentMethod: '在线支付',
    items: [{ name: '遥感图像处理服务', price: '￥6,300.00', quantity: 1, subtotal: '￥6,300.00' }]
  },
  // 数据订单 (Data Orders) - Updated statuses to match request
  { 
    id: 'D2601047873', 
    productName: 'Landsat8卫星数据', 
    productImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=100&auto=format&fit=crop',
    customer: '科研所A', 
    category: '数据', 
    productCategory: '卫星数据',
    amount: '￥5,343.54', 
    actualPaid: '￥5,343.54',
    status: '待发货', 
    time: '2025/06/07 08:00', 
    paymentTime: '2025/06/07 08:05',
    paymentMethod: '账户余额',
    items: [{ name: 'Landsat8卫星数据', price: '￥5,343.54', quantity: 1, subtotal: '￥5,343.54' }]
  },
  { 
    id: 'D2601047161', 
    productName: 'Sentinel-2卫星数据', 
    productImage: 'https://images.unsplash.com/photo-1529310399831-ed472b81d589?q=80&w=100&auto=format&fit=crop',
    customer: '农业公司B', 
    category: '数据', 
    productCategory: '无人机数据', 
    amount: '￥6,264.85', 
    actualPaid: '￥6,264.85',
    status: '已完成', 
    time: '2024/03/11 08:00', 
    paymentTime: '2024/03/11 08:10',
    paymentMethod: '在线支付',
    items: [{ name: 'Sentinel-2卫星数据', price: '￥6,264.85', quantity: 1, subtotal: '￥6,264.85' }]
  },
  { 
    id: 'D2601049896', 
    productName: '无人机航拍数据', 
    productImage: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=100&auto=format&fit=crop',
    customer: '测绘公司C', 
    category: '数据', 
    productCategory: '样本数据',
    amount: '￥10,560.80', 
    actualPaid: '￥10,560.80',
    status: '待发货', 
    time: '2025/11/17 08:00', 
    paymentTime: '2025/11/17 08:30',
    paymentMethod: '对公转账',
    items: [{ name: '无人机航拍数据', price: '￥10,560.80', quantity: 1, subtotal: '￥10,560.80' }]
  },
  { 
    id: 'D2601045964', 
    productName: '高分辨率影像数据', 
    productImage: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=100&auto=format&fit=crop',
    customer: '国土局D', 
    category: '数据', 
    productCategory: '自然资源数据',
    amount: '￥7,404.37', 
    actualPaid: '￥7,404.37',
    status: '已取消', 
    time: '2025/11/27 08:00', 
    paymentTime: '-',
    paymentMethod: '财政支付',
    items: [{ name: '高分辨率影像数据', price: '￥7,404.37', quantity: 1, subtotal: '￥7,404.37' }]
  },
  { 
    id: 'D2601048363', 
    productName: 'DEM地形数据', 
    productImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=100&auto=format&fit=crop',
    customer: '水利局E', 
    category: '数据', 
    productCategory: '农业农村数据',
    amount: '￥13,161.37', 
    actualPaid: '-',
    status: '待付款', 
    time: '2025/02/26 08:00', 
    paymentTime: '-',
    paymentMethod: '对公转账',
    items: [{ name: 'DEM地形数据', price: '￥13,161.37', quantity: 1, subtotal: '￥13,161.37' }]
  },
  { 
    id: 'D2601048037', 
    productName: '土地利用现状数据', 
    productImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=100&auto=format&fit=crop',
    customer: '环保局F', 
    category: '数据', 
    productCategory: '环境保护数据',
    amount: '￥12,136.07', 
    actualPaid: '￥12,136.07',
    status: '已完成', 
    time: '2025/05/10 08:00', 
    paymentTime: '2025/05/10 08:20',
    paymentMethod: '财政支付',
    items: [{ name: '土地利用现状数据', price: '￥12,136.07', quantity: 1, subtotal: '￥12,136.07' }]
  },
  { 
    id: 'D2601046428', 
    productName: 'Landsat8卫星数据', 
    productImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=100&auto=format&fit=crop',
    customer: '大学G', 
    category: '数据', 
    productCategory: '卫星数据',
    amount: '￥11,411.20', 
    actualPaid: '￥11,411.20',
    status: '待发货', 
    time: '2025/11/08 08:00', 
    paymentTime: '2025/11/08 08:05',
    paymentMethod: '科研经费',
    items: [{ name: 'Landsat8卫星数据', price: '￥11,411.20', quantity: 1, subtotal: '￥11,411.20' }]
  },
  { 
    id: 'D2601044758', 
    productName: 'Sentinel-2卫星数据', 
    productImage: 'https://images.unsplash.com/photo-1529310399831-ed472b81d589?q=80&w=100&auto=format&fit=crop',
    customer: '科技公司H', 
    category: '数据', 
    productCategory: '无人机数据', 
    amount: '￥17,772.03', 
    actualPaid: '￥17,772.03',
    status: '已完成', 
    time: '2023/10/05 08:00', 
    paymentTime: '2023/10/05 08:15',
    paymentMethod: '在线支付',
    items: [{ name: 'Sentinel-2卫星数据', price: '￥17,772.03', quantity: 1, subtotal: '￥17,772.03' }]
  },
];

export const OrderManagement: React.FC<Props> = ({ title = '订单管理' }) => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'数据' | '服务'>('数据');
  
  // Processing Modal State
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isDataAttachModalOpen, setIsDataAttachModalOpen] = useState(false);
  const [isServiceAttachModalOpen, setIsServiceAttachModalOpen] = useState(false); // Service attachment modal
  const [isSelectFileModalOpen, setIsSelectFileModalOpen] = useState(false); // New modal state
  
  // Attachment logic state
  const [attachStatus, setAttachStatus] = useState<'idle' | 'matching' | 'success'>('idle');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  // Service Attachment logic state
  const [serviceAttachMethod, setServiceAttachMethod] = useState<'auto' | 'manual'>('auto');
  const [serviceToken, setServiceToken] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('订单已成功处理');
  const [fileSearchQuery, setFileSearchQuery] = useState('');

  // Set default tab based on page title context
  useEffect(() => {
    if (title.includes('处理')) {
      setActiveTab('数据'); 
    } else {
      setActiveTab('数据');
    }
  }, [title]);

  const isProcessingMode = title === '订单处理';

  const dataPendingCount = useMemo(() => MOCK_ORDERS.filter(o => o.category === '数据' && o.status === '待发货').length, []);
  const servicePendingCount = useMemo(() => MOCK_ORDERS.filter(o => o.category === '服务' && o.status === '待发货').length, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '已完成': return 'bg-emerald-50 text-emerald-600';
      case '已发货': return 'bg-emerald-50 text-emerald-600';
      case '待付款': return 'bg-amber-50 text-amber-600';
      case '待发货': return 'bg-rose-50 text-rose-500';
      case '已取消': return 'bg-gray-100 text-gray-400';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'zip': return <FileArchive className="w-5 h-5 text-blue-500" />;
      case 'tif': return <FileImage className="w-5 h-5 text-green-500" />;
      case 'csv': return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'shp': return <FileCode className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter(order => {
      const matchesTab = order.category === activeTab;
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            order.productName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // In Processing Mode, only show 'Pending Shipment' and 'Completed'
      // 在订单处理模式下，只显示 待发货 和 已完成 的订单
      const matchesStatus = isProcessingMode 
        ? ['待发货', '已完成'].includes(order.status)
        : true;

      return matchesTab && matchesSearch && matchesStatus;
    });
  }, [activeTab, searchQuery, isProcessingMode]);

  const filteredFiles = useMemo(() => {
    return MOCK_FILES.filter(file => file.name.toLowerCase().includes(fileSearchQuery.toLowerCase()));
  }, [fileSearchQuery]);

  const handleOpenProcess = (order: OrderRecord) => {
    setSelectedOrder(order);
    
    // 如果是在“订单流转”页面（即非处理模式），点击处理时，
    // 无论是数据还是服务订单，都弹出指派人员的弹窗。
    if (!isProcessingMode) {
      setSelectedStaff('');
      setIsProcessModalOpen(true);
      return;
    }

    // 如果是在“订单处理”页面（处理模式）：
    if (order.category === '数据') {
      // 数据订单弹出挂接附件弹窗
      setAttachStatus('idle');
      setSelectedFile(null);
      setIsDataAttachModalOpen(true);
    } else if (order.category === '服务') {
      // 服务订单弹出服务挂接弹窗
      setAttachStatus('idle');
      setServiceAttachMethod('auto');
      setServiceToken('');
      setIsServiceAttachModalOpen(true);
    } else {
      // 其他类型（应用等）弹出人员指派弹窗
      setSelectedStaff('');
      setIsProcessModalOpen(true);
    }
  };

  const handleAutoAttach = () => {
    setAttachStatus('matching');
    setTimeout(() => {
      setAttachStatus('success');
      setSelectedFile(null); // Clear manual selection if auto-attaching
    }, 1500);
  };

  const handleServiceAutoAttach = () => {
    setAttachStatus('matching');
    setTimeout(() => {
      setAttachStatus('success');
    }, 1500);
  };

  const handleSelectFile = (file: DataFile) => {
    setSelectedFile(file.name);
    setIsSelectFileModalOpen(false);
    setAttachStatus('idle'); // Reset auto status if manual selection
  };

  const handleConfirmProcess = () => {
    setIsProcessModalOpen(false);
    setToastMessage('订单已成功指派至处理人员');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleConfirmDataAttach = () => {
    setIsDataAttachModalOpen(false);
    setToastMessage('数据已成功挂接并下发');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleConfirmServiceAttach = () => {
    setIsServiceAttachModalOpen(false);
    setToastMessage('服务已成功挂接并激活');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleViewDetail = (order: OrderRecord) => {
    setSelectedOrder(order);
    setView('detail');
  };

  // Detail View
  if (view === 'detail' && selectedOrder) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col min-h-screen animate-in fade-in duration-500 overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">订单详情</h2>
          <button onClick={() => setView('list')} className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
          <section className="space-y-8">
            <h3 className="text-xl font-black text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-600" /> 订单信息
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
              <div><p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">订单编号</p><p className="text-base font-bold text-gray-800">{selectedOrder.id}</p></div>
              <div><p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">订单类型</p><p className="text-base font-bold text-gray-800">{selectedOrder.category}订单</p></div>
              <div><p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">下单时间</p><p className="text-base font-bold text-gray-800">{selectedOrder.time}</p></div>
              <div><p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">支付时间</p><p className="text-base font-bold text-gray-800">{selectedOrder.paymentTime}</p></div>
              <div><p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">订单状态</p><span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
            </div>
          </section>
          <section className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center">
              <ShoppingBag className="w-6 h-6 mr-3 text-blue-600" /> 产品列表
            </h3>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">产品名称</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">单价</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">数量</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">小计金额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/10 transition-all">
                      <td className="px-8 py-6 text-sm font-bold text-gray-800">{item.name}</td>
                      <td className="px-6 py-6 text-sm font-bold text-gray-800 text-right">{item.price}</td>
                      <td className="px-6 py-6 text-sm font-black text-gray-900 text-center">{item.quantity}</td>
                      <td className="px-8 py-6 text-sm font-black text-blue-600 text-right">{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <div className="px-10 py-8 border-t border-gray-100 flex justify-end">
          <button onClick={() => setView('list')} className="px-12 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all">返回列表</button>
        </div>
      </div>
    );
  }

  // Processing Mode View (Title -> Summary -> Tabs -> List)
  if (isProcessingMode) {
    return (
      <div className="space-y-8 py-2 animate-in fade-in duration-500">
        
        {/* 1. Title Bar */}
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Settings2 className="w-8 h-8 mr-3 text-blue-600" />
            订单处理
          </h2>
          <p className="text-sm text-gray-400 font-medium mt-1">
            集中处理待发货订单，分配任务并跟踪执行状态。
          </p>
        </div>

        {/* 2. Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">数据待处理订单数</p>
              <h3 className="text-3xl font-black text-gray-900">{dataPendingCount}</h3>
            </div>
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Database className="w-7 h-7" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">服务待处理订单数</p>
              <h3 className="text-3xl font-black text-gray-900">{servicePendingCount}</h3>
            </div>
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Server className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          {/* 3. Tabs */}
          <div className="flex items-center justify-between">
             <div className="bg-gray-100/50 p-1.5 rounded-2xl inline-flex">
                <button 
                  onClick={() => setActiveTab('数据')}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === '数据' ? 'bg-white text-gray-900 shadow-md shadow-gray-200' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  数据订单
                </button>
                <button 
                  onClick={() => setActiveTab('服务')}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === '服务' ? 'bg-white text-gray-900 shadow-md shadow-gray-200' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  服务订单
                </button>
             </div>

             <div className="flex items-center space-x-4">
                <div className="relative w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="搜索订单..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all"
                  />
                </div>
                <button className="flex items-center px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
                  <ListFilter className="w-4 h-4 mr-2" />
                  筛选状态
                </button>
             </div>
          </div>

          {/* 4. List Table */}
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500">订单编号</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500">客户信息</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500">下单时间</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500">产品名称</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500">产品类别</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500">金额</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 text-center">状态</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-blue-50/10 transition-all">
                      <td className="px-8 py-6 text-sm text-gray-600 font-medium">{order.id}</td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-bold text-gray-800">{order.customer}</span>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-500">{order.time}</td>
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-3">
                          {order.productImage ? (
                            <img src={order.productImage} alt={order.productName} className="w-8 h-8 rounded-lg object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gray-100" />
                          )}
                          <span className="text-sm font-bold text-gray-800 line-clamp-1">{order.productName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-500">{order.productCategory || order.category}</td>
                      <td className="px-6 py-6 text-sm font-medium text-gray-800">{order.amount}</td>
                      <td className="px-6 py-6 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-4">
                          {order.status === '待发货' && (
                            <>
                              <button onClick={() => handleViewDetail(order)} className="text-blue-600 hover:text-blue-800 text-xs font-bold">查看</button>
                              <button onClick={() => handleOpenProcess(order)} className="text-blue-600 hover:text-blue-800 text-xs font-bold">处理</button>
                            </>
                          )}
                          {order.status !== '待发货' && (
                            <button onClick={() => handleViewDetail(order)} className="text-blue-600 hover:text-blue-800 text-xs font-bold">查看</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-8 py-20 text-center">
                        <p className="text-sm text-gray-400 font-medium">暂无订单记录</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">
                显示 1 到 {Math.min(2, filteredOrders.length)} 条，共 {filteredOrders.length} 条记录
              </span>
              <div className="flex items-center space-x-2">
                <button className="p-2 border border-gray-100 rounded-md text-gray-400 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 bg-blue-600 text-white rounded-md text-xs font-bold">1</button>
                <button className="w-8 h-8 border border-gray-100 text-gray-600 rounded-md text-xs font-bold hover:bg-gray-50">2</button>
                <button className="w-8 h-8 border border-gray-100 text-gray-600 rounded-md text-xs font-bold hover:bg-gray-50">3</button>
                <button className="p-2 border border-gray-100 rounded-md text-gray-400 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Process Order Modal (Staff Assignment - For Service Orders & Data Orders in Flow) */}
        {isProcessModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 tracking-tight">处理订单</h3>
                <button onClick={() => setIsProcessModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-gray-500">订单编号: {selectedOrder.id}</p>
                  <p className="text-sm font-medium text-gray-500">产品名称: {selectedOrder.productName}</p>
                </div>
                <div className="space-y-3 pt-2">
                  <label className="block text-sm font-bold text-gray-700">指定处理人员</label>
                  <div className="relative">
                    <select 
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                    >
                      <option value="">请选择处理人员</option>
                      <option value="王工">王工 (算子调优组)</option>
                      <option value="赵工">赵工 (算法集成部)</option>
                      <option value="孙工">孙工 (运维支持部)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="px-6 py-6 border-t border-gray-50 bg-gray-50/30 flex justify-end space-x-3">
                <button onClick={() => setIsProcessModalOpen(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all shadow-sm">取消</button>
                <button onClick={handleConfirmProcess} disabled={!selectedStaff} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95 ${selectedStaff ? 'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}>确认处理</button>
              </div>
            </div>
          </div>
        )}

        {/* Data Attachment Modal (For Data Orders in Processing Mode) */}
        {isDataAttachModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 tracking-tight">数据挂接</h3>
                    <button onClick={() => setIsDataAttachModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* Body */}
                <div className="p-8 space-y-6">
                    <p className="text-sm text-gray-500 font-medium">订单编号: <span className="text-gray-900 font-bold">{selectedOrder.id}</span></p>
                    
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">选择数据 <span className="text-rose-500">*</span></label>
                        <div className="flex space-x-4">
                            <button 
                              onClick={handleAutoAttach}
                              className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                            >
                                <Wand2 className="w-4 h-4 mr-2" /> 自动挂接
                            </button>
                            <button 
                              onClick={() => setIsSelectFileModalOpen(true)}
                              className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                            >
                                <FolderOpen className="w-4 h-4 mr-2" /> 请选择数据文件
                            </button>
                        </div>
                    </div>

                    {/* Status Info Box */}
                    {attachStatus === 'matching' && (
                      <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex items-start space-x-3 text-amber-600 animate-in fade-in duration-300">
                          <Loader2 className="w-5 h-5 shrink-0 mt-0.5 animate-spin" />
                          <p className="text-sm font-bold">正在根据"{selectedOrder.productName}"匹配数据文件...</p>
                      </div>
                    )}

                    {attachStatus === 'success' && (
                      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3 text-blue-600 animate-in fade-in duration-300">
                          <Info className="w-5 h-5 shrink-0 mt-0.5" />
                          <p className="text-sm font-bold">已根据"{selectedOrder.productName}"自动匹配相关数据文件</p>
                      </div>
                    )}

                    {selectedFile && attachStatus === 'idle' && (
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start space-x-3 text-emerald-600 animate-in fade-in duration-300">
                          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                          <p className="text-sm font-bold">已选择文件: {selectedFile}</p>
                      </div>
                    )}

                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">挂接附件</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl h-40 flex flex-col items-center justify-center bg-gray-50/30 hover:border-blue-300 hover:bg-blue-50/10 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 group-hover:text-blue-500 mb-3 transition-colors">
                                <CloudUpload className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-colors">
                                <span className="text-blue-600 underline">上传文件</span> 或拖放文件
                            </p>
                            <p className="text-xs text-gray-400 mt-1">支持 PNG, JPG, GIF 或 PDF (最大 10MB)</p>
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <div className="px-6 py-5 border-t border-gray-50 flex justify-end space-x-3 bg-gray-50/30">
                    <button onClick={() => setIsDataAttachModalOpen(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all shadow-sm">取消</button>
                    <button 
                      onClick={handleConfirmDataAttach} 
                      disabled={attachStatus !== 'success' && !selectedFile}
                      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95 ${
                        attachStatus === 'success' || selectedFile 
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      确认挂接
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* Service Attachment Modal (New for Service Orders in Processing Mode) */}
        {isServiceAttachModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 tracking-tight">服务挂接</h3>
                    <button onClick={() => setIsServiceAttachModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* Body */}
                <div className="p-8 space-y-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-500">服务信息</p>
                      <p className="text-sm font-medium text-gray-700">订单编号: {selectedOrder.id}</p>
                    </div>
                    
                    <div className="flex space-x-4">
                        <button 
                          onClick={() => { setServiceAttachMethod('auto'); handleServiceAutoAttach(); }}
                          className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center transition-all active:scale-95 ${serviceAttachMethod === 'auto' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Wand2 className="w-4 h-4 mr-2" /> 自动挂接
                        </button>
                        <button 
                          onClick={() => { setServiceAttachMethod('manual'); setAttachStatus('idle'); }}
                          className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center transition-all active:scale-95 ${serviceAttachMethod === 'manual' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Key className="w-4 h-4 mr-2" /> 输入Token
                        </button>
                    </div>

                    {/* Manual Token Input */}
                    {serviceAttachMethod === 'manual' && (
                      <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-bold text-gray-700">服务Token</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={serviceToken}
                            onChange={(e) => setServiceToken(e.target.value)}
                            placeholder="请输入服务访问Token" 
                            className="w-full pl-4 pr-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-gray-700 placeholder:text-gray-400"
                          />
                          <div className="absolute right-0 top-full mt-1 text-[10px] text-gray-400">Token有效期通常为365天，请妥善保管</div>
                        </div>
                      </div>
                    )}

                    {/* Auto Match Status */}
                    {serviceAttachMethod === 'auto' && attachStatus === 'matching' && (
                      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center space-x-3 text-blue-600 animate-in fade-in duration-300">
                          <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
                          <p className="text-sm font-bold">正在自动匹配服务链接和Token...</p>
                      </div>
                    )}

                    {serviceAttachMethod === 'auto' && attachStatus === 'success' && (
                      <div className="space-y-3 animate-in fade-in duration-300">
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                           <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-gray-700">service_9823_002_ljb</span>
                              <Copy className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500" />
                           </div>
                           <div className="text-xs text-gray-500 space-y-1">
                              <p>API访问地址: <span className="text-blue-500 underline">https://api.example.com/service/ord-20230515-002</span></p>
                              <p>有效期: 2023-05-15 至 2024-05-14</p>
                           </div>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-center space-x-2 text-blue-600">
                            <Info className="w-4 h-4 shrink-0" />
                            <p className="text-xs font-bold">已自动挂接服务链接和Token</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 pt-2">
                        <label className="block text-sm font-bold text-gray-700">挂接附件</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl h-32 flex flex-col items-center justify-center bg-gray-50/30 hover:border-blue-300 hover:bg-blue-50/10 transition-all cursor-pointer group">
                            <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 group-hover:text-blue-500 mb-2 transition-colors">
                                <CloudUpload className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-gray-600 group-hover:text-blue-600 transition-colors">
                                <span className="text-blue-600 underline">上传文件</span> 或拖放文件
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">支持 PNG, JPG, GIF 或 PDF (最大 10MB)</p>
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <div className="px-6 py-5 border-t border-gray-50 flex justify-end space-x-3 bg-gray-50/30">
                    <button onClick={() => setIsServiceAttachModalOpen(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all shadow-sm">取消</button>
                    <button 
                      onClick={handleConfirmServiceAttach}
                      disabled={serviceAttachMethod === 'auto' && attachStatus !== 'success'}
                      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95 ${
                        (serviceAttachMethod === 'manual' && serviceToken) || (serviceAttachMethod === 'auto' && attachStatus === 'success')
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      确认挂接
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* Select Data File Modal */}
        {isSelectFileModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[85vh]">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">选择数据文件</h3>
                <button onClick={() => setIsSelectFileModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    value={fileSearchQuery}
                    onChange={(e) => setFileSearchQuery(e.target.value)}
                    placeholder="搜索数据文件..." 
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold"
                  />
                </div>
              </div>

              <div className="px-8 py-4 flex items-center justify-between text-xs font-bold text-gray-400 border-b border-gray-50">
                <span>找到 {filteredFiles.length} 个文件</span>
                <div className="flex items-center space-x-2">
                  <span>每页显示:</span>
                  <button className="bg-white border border-gray-200 rounded px-2 py-1 flex items-center hover:border-blue-400 transition-colors">
                    10 <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                <div className="grid grid-cols-12 px-4 py-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                  <div className="col-span-10">文件名称</div>
                  <div className="col-span-2 text-right">大小</div>
                </div>
                {filteredFiles.map((file) => (
                  <div 
                    key={file.id}
                    onClick={() => handleSelectFile(file)}
                    className="grid grid-cols-12 items-center px-4 py-4 rounded-xl hover:bg-blue-50/50 cursor-pointer group transition-all border border-transparent hover:border-blue-100"
                  >
                    <div className="col-span-10 flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{file.name}</span>
                    </div>
                    <div className="col-span-2 text-right text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
                      {file.size}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-8 py-6 border-t border-gray-100 flex justify-end bg-gray-50/20">
                <button 
                  onClick={() => setIsSelectFileModalOpen(false)}
                  className="px-8 py-2.5 bg-white border border-gray-200 text-gray-500 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-5 duration-500">
            <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-bold">{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard "Order Flow" View (Unchanged from original implementation per request)
  return (
    <div className="space-y-8 py-2 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <ClipboardList className="w-8 h-8 mr-3 text-blue-600" />
            {title}
          </h2>
          <p className="text-sm text-gray-400 font-medium mt-1">
            {activeTab === '服务' ? '核心管理算子服务订单，监控处理与分发进度。' : '实时追踪平台数据产品的订单状态，保障业务高效流转。'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: activeTab === '服务' ? '服务总营收' : '数据总营收', value: activeTab === '服务' ? '¥854,200' : '¥1,248,300', icon: TrendingUp, color: 'blue', trend: '+12.5%' },
          { label: '订单总数', value: filteredOrders.length, icon: ShoppingBag, color: 'emerald', trend: '+8.3%' },
          { label: '待处理订单', value: filteredOrders.filter(o => o.status === '待发货').length, icon: Clock, color: 'rose', trend: '-2.1%' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-colors`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-xl">
                <span className={`text-xs font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.trend}</span>
                <span className="text-[10px] text-gray-400 ml-1.5 font-bold">较上月</span>
              </div>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/20">
          <div className="flex items-center space-x-2">
            {[
              { id: '数据', label: '数据订单' },
              { id: '服务', label: '服务订单' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === tab.id ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input 
              type="text" 
              placeholder={`搜索${activeTab}订单编号、客户、产品...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm font-bold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">订单编号</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">客户信息</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">产品名称</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">下单日期</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">金额</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">状态</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-blue-50/20 transition-all">
                  <td className="px-8 py-6 text-xs font-black text-gray-900 tracking-tight">{order.id}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{order.customer}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-bold text-gray-600 line-clamp-1">{order.productName}</span>
                  </td>
                  <td className="px-6 py-6 text-xs text-gray-400 font-bold">{order.time.split(' ')[0]}</td>
                  <td className="px-6 py-6 text-sm font-black text-gray-900">{order.amount}</td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                      <Clock className="w-3 h-3 mr-1.5" />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center space-x-3">
                      <button onClick={() => handleViewDetail(order)} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black hover:bg-blue-600 transition-all shadow-lg shadow-gray-200">详情</button>
                      {order.status === '待发货' && (
                        <button onClick={() => handleOpenProcess(order)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center">
                          <Settings2 className="w-3 h-3 mr-1" />处理
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <ShoppingBag className="w-12 h-12 text-gray-200 mb-4" />
                      <p className="text-sm font-bold text-gray-400">暂无{activeTab}订单记录</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            显示 {filteredOrders.length > 0 ? 1 : 0} 到 {filteredOrders.length} 条，共 {filteredOrders.length} 条订单
          </span>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-all"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 rounded-lg text-xs font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20">1</button>
            <button className="w-8 h-8 rounded-lg text-xs font-black text-gray-400 hover:bg-gray-100 transition-all">2</button>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-all"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Reuse Process Modal for Dispatching in Order Flow */}
      {isProcessModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 tracking-tight">处理订单</h3>
                <button onClick={() => setIsProcessModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-gray-500">订单编号: {selectedOrder.id}</p>
                  <p className="text-sm font-medium text-gray-500">产品名称: {selectedOrder.productName}</p>
                </div>
                <div className="space-y-3 pt-2">
                  <label className="block text-sm font-bold text-gray-700">指定处理人员</label>
                  <div className="relative">
                    <select 
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                    >
                      <option value="">请选择处理人员</option>
                      <option value="王工">王工 (算子调优组)</option>
                      <option value="赵工">赵工 (算法集成部)</option>
                      <option value="孙工">孙工 (运维支持部)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="px-6 py-6 border-t border-gray-50 bg-gray-50/30 flex justify-end space-x-3">
                <button onClick={() => setIsProcessModalOpen(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all shadow-sm">取消</button>
                <button onClick={handleConfirmProcess} disabled={!selectedStaff} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95 ${selectedStaff ? 'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}>确认处理</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
