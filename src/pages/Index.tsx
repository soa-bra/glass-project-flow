import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import { useState } from 'react';
const Index = () => {
  return <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic px-0 mx-px">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[60px] mx-0 px-[207px] my-[100px] py-[10px]">
        {/* Sidebar with dynamic width support */}
        <div className="fixed top-[60px] right-0 h-[calc(100vh-60px)] bg-soabra-solid-bg z-sidebar transition-all duration-500 ease-in-out my-[55px] px-[5px] py-0">
          <Sidebar />
        </div>

        {/* Main Content Area - responsive to sidebar changes */}
        <div className="flex-1 transition-all duration-500 ease-in-out ml-[80px] p-6 py-0 mx-[240px] px-[26px] my-[2px]">
          <div className="glass rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform mx-[81px] px-0 my-[15px] py-[45px]">
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
    </div>;
};
export default Index;