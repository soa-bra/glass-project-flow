import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, 
  Kanban, 
  FileText, 
  Home,
  ArrowRight 
} from 'lucide-react';

const NavigationMenu: React.FC = () => {
  const location = useLocation();

  const navigationItems = [
    {
      path: '/',
      title: 'الرئيسية',
      description: 'لوحة التحكم الرئيسية',
      icon: Home,
      color: 'bg-blue-500'
    },
    {
      path: '/approvals',
      title: 'نظام الموافقات',
      description: 'إدارة ومراجعة طلبات الموافقة',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      path: '/kanban',
      title: 'لوحة كانبان',
      description: 'إدارة المهام مع حدود WIP ومراقبة SLA',
      icon: Kanban,
      color: 'bg-purple-500'
    },
    {
      path: '/audit',
      title: 'سجل التدقيق',
      description: 'مراقبة وتتبع الأحداث والتفاعلات',
      icon: FileText,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-right mb-6">الميزات الجديدة</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Card className={`p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
                isActive 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-transparent hover:border-primary/20'
              }`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-right">{item.title}</h3>
                    <p className="text-sm text-muted-foreground text-right leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  <Button 
                    variant={isActive ? "default" : "outline"} 
                    size="sm" 
                    className="w-full"
                  >
                    {isActive ? 'الصفحة الحالية' : 'انتقل إلى الصفحة'}
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </Button>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-right">
          💡 هذه الميزات مطورة بتقنيات حديثة وجاهزة للتكامل مع قاعدة البيانات
        </p>
      </div>
    </div>
  );
};

export default NavigationMenu;