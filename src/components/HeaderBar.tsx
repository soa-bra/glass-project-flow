
import { ArrowLeft, ArrowRight } from 'lucide-react';

const HeaderBar = () => {
  return (
    <header className="fixed top-0 right-0 left-0 h-[60px] bg-soabra-sidebar-bg z-header border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4">
        {/* Navigation Icons - Right Side */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowRight className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-soabra-text-primary" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-soabra-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Center Title */}
        <div className="text-heading-main">
          نظام إدارة المشاريع - SoaBra
        </div>

        {/* Action Icons - Left Side */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-soabra-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-soabra-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-soabra-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-soabra-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-soabra-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
