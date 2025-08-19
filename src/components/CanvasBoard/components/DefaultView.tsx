import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Layout, FileText, Eye } from 'lucide-react';
interface DefaultViewProps {
  onStartCanvas: () => void;
}
const DefaultView: React.FC<DefaultViewProps> = ({
  onStartCanvas
}) => {
  return <div className="flex items-center bg-white justify-center h-full mx-0">
      <div className="text-center space-y-8 max-w-4xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800 font-arabic">لوحة التخطيط التشاركي</h1>
          <p className="text-lg text-gray-600 font-arabic">ابدأ مشروعك الجديد أو تابع العمل على مشروع موجود</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm" onClick={onStartCanvas}>
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-arabic">جديد</h3>
              <p className="text-sm text-gray-600 text-center font-arabic">
                كانفس جديدة تماماً للبدء من الصفر
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Layout className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-arabic">قالب</h3>
              <p className="text-sm text-gray-600 text-center font-arabic">
                ابدأ بقالب جاهز معد مسبقاً
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-arabic">ملف</h3>
              <p className="text-sm text-gray-600 text-center font-arabic">
                تحليل ملف وإنتاج كانفس بالذكاء الاصطناعي
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-arabic">مراجعة</h3>
              <p className="text-sm text-gray-600 text-center font-arabic">
                مراجعة المشاريع وإنتاج تقارير
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 font-arabic">الكانفسات المحفوظة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Card key={i} className="cursor-pointer hover:shadow-md transition-all bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <Layout className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-800 font-arabic">كانفس المشروع {i}</h4>
                  <p className="text-sm text-gray-500 mt-1 font-arabic">آخر تعديل منذ {i} أيام</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>
    </div>;
};
export default DefaultView;