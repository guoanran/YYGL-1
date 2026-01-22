
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  LayoutDashboard, 
  Package, 
  Database, 
  ShieldCheck, 
  ClipboardList, 
  Wrench, 
  BadgeDollarSign,
  ChevronLeft, 
  ChevronRight, 
  DatabaseZap,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavItem {
  label: string;
  path?: string;
  icon: any;
  children?: { label: string; path: string }[];
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const navItems: NavItem[] = [
    { label: '首页', path: '/dashboard', icon: LayoutDashboard },
    { 
      label: '产品管理', 
      icon: Package,
      children: [
        { label: '数据产品', path: '/product/data' },
        { label: '服务产品', path: '/product/service' },
        { label: '应用产品', path: '/product/app' },
        { label: '地图产品', path: '/product/map' },
      ]
    },
    { 
      label: '资源管理', 
      icon: Database,
      children: [
        { label: '数据资源', path: '/resource/data' },
        { label: '服务资源', path: '/resource/service' },
        { label: '应用资源', path: '/resource/app' },
        { label: '地图资源', path: '/resource/map' },
      ]
    },
    { 
      label: '资源审核', 
      icon: ShieldCheck,
      children: [
        { label: '数据审核', path: '/review/data' },
        { label: '服务审核', path: '/review/service' },
        { label: '应用审核', path: '/review/app' },
        { label: '地图审核', path: '/review/map' },
      ]
    },
    { 
      label: '订单管理', 
      icon: ClipboardList,
      children: [
        { label: '订单流转', path: '/order/data' },
        { label: '订单处理', path: '/order/service' },
      ]
    },
    { label: '定制管理', path: '/custom', icon: Wrench },
    { 
      label: '价格管理', 
      icon: BadgeDollarSign,
      children: [
        { label: '卫星影像价格', path: '/price/satellite' },
        { label: '算子服务价格', path: '/price/service' },
      ]
    },
  ];

  // 默认展开包含当前路径的父菜单
  useEffect(() => {
    navItems.forEach(item => {
      if (item.children?.some(child => child.path === currentPath)) {
        setOpenMenus(prev => ({ ...prev, [item.label]: true }));
      }
    });
  }, []);

  const toggleSubMenu = (label: string) => {
    if (isCollapsed) return;
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path?: string) => path ? currentPath === path : false;
  const isParentActive = (item: NavItem) => {
    if (item.path) return isActive(item.path);
    return item.children?.some(child => child.path === currentPath);
  };

  return (
    <div className="min-h-screen flex bg-[#f4f7fe]">
      {/* Sidebar */}
      <aside 
        className={`${
          isCollapsed ? 'w-20' : 'w-72'
        } flex-shrink-0 bg-gradient-to-b from-[#1a237e] to-[#121858] text-white flex flex-col fixed h-full z-50 transition-all duration-300 ease-in-out shadow-2xl`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 overflow-hidden border-b border-white/10">
          <div className="flex items-center space-x-3 min-w-max">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md shadow-inner text-blue-300">
              <DatabaseZap className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold tracking-tight whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                运营管理中心
              </span>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 bg-white text-[#1a237e] p-1 rounded-full shadow-lg hover:scale-110 transition-transform z-50 border border-blue-100"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {navItems.map((item) => (
            <div key={item.label}>
              {/* Main Menu Item */}
              <div
                onClick={() => item.path ? navigate(item.path) : toggleSubMenu(item.label)}
                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all relative group cursor-pointer ${
                  isParentActive(item) 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-900/40' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isParentActive(item) ? 'opacity-100' : 'opacity-80'}`} />
                {!isCollapsed && (
                  <>
                    <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap">
                      {item.label}
                    </span>
                    {item.children && (
                      <ChevronDown className={`ml-auto w-4 h-4 transition-transform duration-300 ${openMenus[item.label] ? 'rotate-180' : ''}`} />
                    )}
                  </>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/10">
                    {item.label}
                  </div>
                )}
              </div>

              {/* Sub Menu Items */}
              {!isCollapsed && item.children && openMenus[item.label] && (
                <div className="mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-300">
                  <div className="border-l border-white/10 ml-6 pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
                          isActive(child.path)
                            ? 'text-blue-300 bg-white/5'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 mt-auto space-y-2 border-t border-white/10">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="User" 
                className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white/20"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate">光谷信息</span>
                <span className="text-[10px] opacity-60 font-medium tracking-widest uppercase">超级管理员</span>
              </div>
              <Settings className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
            </div>
          )}
          {isCollapsed && (
             <div className="flex justify-center p-3">
               <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="User" 
                  className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white/20 cursor-pointer"
                />
             </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-72'} min-h-screen`}>
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-10 sticky top-0 z-40 bg-[#f4f7fe]/80 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {navItems.find(i => isParentActive(i))?.label || 'Overview'}
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative p-3 bg-white text-gray-400 hover:text-blue-600 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            </div>
            
            <div className="flex items-center space-x-3 bg-white pl-2 pr-4 py-2 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-none mb-0.5">控制台</p>
                <p className="text-[10px] text-gray-400 font-medium">快捷进入</p>
              </div>
            </div>

            <button className="p-3 bg-white text-gray-400 hover:text-rose-500 rounded-2xl shadow-sm border border-gray-100 hover:bg-rose-50 transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-10 pb-10">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};
