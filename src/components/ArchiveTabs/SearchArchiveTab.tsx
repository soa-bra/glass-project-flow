
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Calendar } from 'lucide-react';

interface SearchArchiveTabProps {
  categoryTitle: string;
  categoryType: string;
}

export const SearchArchiveTab: React.FC<SearchArchiveTabProps> = ({ 
  categoryTitle, 
  categoryType 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث في {categoryTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={`البحث في ${categoryTitle}...`}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                بحث
              </button>
            </div>
            
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                الفلاتر
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Calendar className="h-4 w-4" />
                التاريخ
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>نتائج البحث</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>أدخل كلمات البحث لعرض النتائج</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
