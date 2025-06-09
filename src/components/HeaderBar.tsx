
import { ArrowLeft, ArrowRight, Bell, CircleUser, Menu, Search, Plus, RefreshCw } from 'lucide-react';

const HeaderBar = () => {
  return (
    <header className="fixed top-0 right-0 left-0 h-[60px] bg-soabra-header-bg z-header">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Side - Navigation and Action Icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-black/10 rounded-lg transition-colors">
            <ArrowRight className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <button className="p-2 hover:bg-black/10 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <button className="p-2 hover:bg-black/10 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <button className="p-2 hover:bg-black/10 rounded-lg transition-colors">
            <Plus className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <button className="p-2 hover:bg-black/10 rounded-lg transition-colors">
            <RefreshCw className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <button className="p-2 hover:bg-black/10 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <button className="p-2 hover:bg-black/10 rounded-lg transition-colors">
            <CircleUser className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <button className="p-2 hover:bg-black/10 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-soabra-text-primary" />
          </button>
        </div>

        {/* Right Side - Logo/Brand */}
        <div className="text-right">
          <h1 className="text-lg font-medium text-soabra-text-primary">
            SoaBra
          </h1>
          <div className="text-xs text-soabra-text-secondary">
            نظام إدارة المشاريع
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
