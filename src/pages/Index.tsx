
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import { useState } from 'react';

const Index = () => {
  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[60px]">
        {/* Sidebar with dynamic width support */}
        <div className="fixed top-[60px] right-0 h-[calc(100vh-60px)] bg-soabra-solid-bg z-sidebar transition-all duration-500 ease-in-out">
          <Sidebar />
        </div>

        {/* Main Content Area - positioned to occupy 30% of interface width with full height */}
        <div className="w-[30%] h-[calc(100vh-60px)] transition-all duration-500 ease-in-out mr-[280px] p-6">
          <div className="glass rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform h-full flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-soabra-text-primary mb-4 animate-fade-in">
              مرحباً بك في SoaBra
            </h1>
            <p className="text-lg text-soabra-text-secondary animate-fade-in" style={{
              animationDelay: '0.2s'
            }}>
              نظام إدارة المشاريع جاهز للاستخدام
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
