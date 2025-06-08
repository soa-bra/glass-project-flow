
import { ArrowLeft, ArrowRight, Bell, CircleUser, Menu, Search } from 'lucide-react';

const HeaderBar = () => {
  return (
    <header className="fixed top-0 right-0 left-0 h-[60px] bg-soabra-sidebar-bg z-header border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-6">
        {/* Navigation Icons - Left Side */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowRight className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-soabra-text-primary" />
          </button>
        </div>

        {/* Center - Empty for balance */}
        <div className="flex-1" />

        {/* Logo and Action Icons - Right Side */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <CircleUser className="w-5 h-5 text-soabra-text-primary" />
          </button>
          
          {/* Logo/Brand */}
          <div className="text-right mr-4">
            <h1 className="text-lg font-medium text-soabra-text-primary">
              SoaBra
            </h1>
            <div className="text-xs text-soabra-text-secondary">
              نظام إدارة المشاريع
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
