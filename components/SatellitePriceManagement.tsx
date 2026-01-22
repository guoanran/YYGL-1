
// ... keep imports
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Satellite,
  X,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SatellitePrice {
  id: string;
  type: string;
  dataType: string;
  resolution: string;
  price: string;
  validFrom: string;
  validTo: string;
  status: '启用' | '停用';
}

const MOCK_DATA: SatellitePrice[] = [
  { id: '1', type: 'GF1', dataType: '全色+多光谱融合', resolution: '2m', price: '1200.00', validFrom: '2023-01-01', validTo: '至今', status: '启用' },
  { id: '2', type: 'GF1', dataType: '多光谱影像', resolution: '8m', price: '800.00', validFrom: '2023-01-01', validTo: '至今', status: '启用' },
  { id: '3', type: 'GF2', dataType: '全色影像', resolution: '0.8m', price: '2500.00', validFrom: '2023-01-01', validTo: '至今', status: '启用' },
  { id: '4', type: 'GF2', dataType: '全色+多光谱融合', resolution: '0.8m', price: '3200.00', validFrom: '2023-01-01', validTo: '至今', status: '启用' },
  { id: '5', type: '哨兵数据', dataType: '多光谱影像', resolution: '10m', price: '300.00', validFrom: '2023-01-01', validTo: '至今', status: '启用' },
  { id: '6', type: '哨兵数据', dataType: 'SAR影像', resolution: '10m', price: '450.00', validFrom: '2023-01-01', validTo: '至今', status: '启用' },
  { id: '7', type: 'Landsat8', dataType: '多光谱影像', resolution: '30m', price: '200.00', validFrom: '2023-01-01', validTo: '至今', status: '停用' },
  { id: '8', type: 'Landsat9', dataType: '多光谱影像', resolution: '30m', price: '220.00', validFrom: '2023-06-01', validTo: '至今', status: '停用' },
];

export const SatellitePriceManagement: React.FC = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [prices, setPrices] = useState<SatellitePrice[]>(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPrice, setEditingPrice] = useState<SatellitePrice | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // 表单受控状态
  const [formData, setFormData] = useState<Partial<SatellitePrice>>({
    type: '',
    dataType: '',
    resolution: '',
    price: '',
    validFrom: '',
    validTo: '至今',
    status: '启用'
  });

  const filteredData = useMemo(() => {
    return prices.filter(p => 
      p.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.dataType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [prices, searchQuery]);

  const handleAdd = () => {
    setEditingPrice(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      type: '',
      dataType: '',
      resolution: '',
      price: '',
      validFrom: today,
      validTo: '至今',
      status: '启用'
    });
    setView('form');
  };

  const handleEdit = (price: SatellitePrice) => {
    setEditingPrice(price);
    setFormData(price);
    setView('form');
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该价格条目吗？')) {
      setPrices(prev => prev.filter(p => p.id !== id));
      const newSelected = new Set(selectedIds);
      newSelected.delete(id);
      setSelectedIds(newSelected);
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`确定要删除选中的 ${selectedIds.size} 项卫星影像价格吗？`)) {
      setPrices(prev => prev.filter(p => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredData.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSave = () => {
    if (!formData.type || !formData.dataType || !formData.price) {
      alert('请填写完整必填信息');
      return;
    }

    if (editingPrice) {
      setPrices(prev => prev.map(p => p.id === editingPrice.id ? { ...p, ...formData as SatellitePrice } : p));
    } else {
      const newPrice: SatellitePrice = {
        ...formData as SatellitePrice,
        id: Math.random().toString(36).substr(2, 9)
      };
      setPrices(prev => [newPrice, ...prev]);
    }
    setView('list');
  };

  if (view === 'form') {
    return (
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col min-h-[600px] animate-in slide-in-from-right-10 duration-500 overflow-hidden">
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            {editingPrice ? '编辑卫星影像价格' : '新建卫星影像价格'}
          </h2>
          <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 p-10 space-y-8 custom-scrollbar overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">卫星类型 <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                placeholder="如: GF1, Landsat8" 
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all text-sm font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">数据类型 <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                value={formData.dataType}
                onChange={e => setFormData({...formData, dataType: e.target.value})}
                placeholder="如: 多光谱影像, 全色融合" 
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all text-sm font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">分辨率 <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                value={formData.resolution}
                onChange={e => setFormData({...formData, resolution: e.target.value})}
                placeholder="如: 0.8m, 10m" 
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all text-sm font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">单价 (元/景) <span className="text-rose-500">*</span></label>
              <input 
                type="number" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="0.00" 
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all text-sm font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">有效期至</label>
              <input 
                type="date" 
                value={formData.validTo === '至今' ? '' : formData.validTo}
                onChange={e => setFormData({...formData, validTo: e.target.value || '至今'})}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all text-sm font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">状态</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none appearance-none cursor-pointer text-sm font-bold"
              >
                <option value="启用">启用</option>
                <option value="停用">停用</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-10 py-6 border-t border-gray-100 flex justify-end space-x-4">
          <button 
            onClick={() => setView('list')}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl text-sm font-black hover:bg-gray-50 transition-all active:scale-95"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            className="px-10 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            保存生效
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 顶部筛选器 - 依照截图设计 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">卫星类型</p>
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:bg-white cursor-pointer min-w-[140px]">
                <option>全部卫星</option>
                <option>GF系列</option>
                <option>Landsat系列</option>
                <option>哨兵系列</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">数据分辨率</p>
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:bg-white cursor-pointer min-w-[140px]">
                <option>全部分辨率</option>
                <option>0.5m-2m</option>
                <option>2m-10m</option>
                <option>10m以上</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[280px]">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">关键词搜索</p>
            <div className="relative flex items-center">
              <div className="absolute left-4">
                <Search className="w-4 h-4 text-gray-300" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索卫星名称或数据类型..." 
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:bg-white transition-all shadow-inner"
              />
              <button className="ml-3 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center active:scale-95">
                搜索
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleAdd}
            className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black shadow-2xl shadow-gray-400/20 hover:bg-blue-600 transition-all active:scale-95 flex items-center uppercase tracking-widest"
          >
            <Plus className="w-4 h-4 mr-2" />
            新建价格
          </button>
          <button 
            onClick={handleBatchDelete}
            disabled={selectedIds.size === 0}
            className={`px-8 py-3 rounded-2xl text-xs font-black shadow-sm transition-all active:scale-95 flex items-center uppercase tracking-widest border ${
              selectedIds.size > 0 
                ? 'bg-white border-rose-100 text-rose-500 hover:bg-rose-50' 
                : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            批量删除 {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
          </button>
        </div>
      </div>

      {/* 列表区域 - 依照截图设计 */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={filteredData.length > 0 && selectedIds.size === filteredData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center cursor-pointer hover:text-gray-900 transition-colors">
                    卫星类型 <ArrowUpDown className="w-3 h-3 ml-1.5 opacity-30" />
                  </div>
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center cursor-pointer hover:text-gray-900 transition-colors">
                    数据类型 <ArrowUpDown className="w-3 h-3 ml-1.5 opacity-30" />
                  </div>
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center cursor-pointer hover:text-gray-900 transition-colors">
                    分辨率 <ArrowUpDown className="w-3 h-3 ml-1.5 opacity-30" />
                  </div>
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                   <div className="flex items-center cursor-pointer hover:text-gray-900 transition-colors">
                    单价(元/景) <ArrowUpDown className="w-3 h-3 ml-1.5 opacity-30" />
                  </div>
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center cursor-pointer hover:text-gray-900 transition-colors">
                    有效日期 <ArrowUpDown className="w-3 h-3 ml-1.5 opacity-30" />
                  </div>
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                   <div className="flex items-center justify-center cursor-pointer hover:text-gray-900 transition-colors">
                    状态 <ArrowUpDown className="w-3 h-3 ml-1.5 opacity-30" />
                  </div>
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className={`group hover:bg-blue-50/10 transition-all ${selectedIds.has(item.id) ? 'bg-blue-50/20' : ''}`}>
                  <td className="px-8 py-6 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(item.id)}
                      onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                        <Satellite className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-black text-gray-800">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm text-gray-600 font-bold">{item.dataType}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm text-gray-500 font-medium tracking-tight">{item.resolution}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-black text-gray-900">{item.price}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col text-[11px] font-bold text-gray-400 leading-tight">
                      <span>{item.validFrom}</span>
                      <span>至 {item.validTo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      item.status === '启用' ? 'text-emerald-500 bg-emerald-50 border border-emerald-100' : 'text-gray-400 bg-gray-50 border border-gray-100'
                    }`}>
                       {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end space-x-5">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-[11px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors flex items-center"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" />
                        编辑
                      </button>
                      {item.status === '停用' && (
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-[11px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest transition-colors flex items-center"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          删除
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页区域 */}
        <div className="px-10 py-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
          <span className="text-[11px] text-gray-400 font-black uppercase tracking-widest">
            显示 1 到 {filteredData.length} 条，共 {prices.length} 条记录
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
