import { ArrowLeft, ArrowRight, Bell, CircleUser, Menu, Search, RefreshCcw, Settings } from 'lucide-react';
const HeaderBar = () => {
  return <header className="fixed top-0 right-0 left-0 h-[60px] bg-soabra-sidebar-bg z-header py-[55px] my-0 px-[25px]">
      <div className="flex items-center justify-between h-full px-[5px]">
        {/* Logo/Brand - Left Side aligned with sidebar menu */}
        <div className="text-right ml-4">
          <h1 className="text-lg font-medium text-soabra-text-primary">
            SoaBra
          </h1>
          <div className="text-xs text-soabra-text-secondary">
            نظام إدارة المشاريع
          </div>
        </div>

        {/* Center - Empty for balance */}
        <div className="flex-1" />

        {/* Action Icons - Right Side: بحث ← تحديث ← تنبيهات ← مستخدم ← إعدادات */}
        <div className="flex items-center gap-4 px-0 mx-0">
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
              <Search className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
              <RefreshCcw className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
              <Bell className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
              <CircleUser className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
              <Settings className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </button>
        </div>
      </div>
    </header>;
};
export default HeaderBar;