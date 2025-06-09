
import { Search, Bell, CircleUser, Settings, Menu, RotateCcw } from 'lucide-react';

const HeaderBar = () => {
  return (
    <header className="h-[70px] bg-white shadow-lg border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-8">
        {/* Logo/Brand - Right Side */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold text-gray-800">
              SoaBra
            </h1>
            <div className="text-sm text-gray-500">
              نظام إدارة المشاريع
            </div>
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="البحث في المشاريع والمهام..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>
        </div>

        {/* Action Icons - Left Side */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors group">
            <RotateCcw className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:rotate-180 transition-all duration-300" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors group relative">
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors group">
            <CircleUser className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors group">
            <Settings className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors group">
            <Menu className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
