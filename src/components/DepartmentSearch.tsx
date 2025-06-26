
import { Search } from 'lucide-react';

interface DepartmentSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const DepartmentSearch = ({ searchQuery, onSearchChange }: DepartmentSearchProps) => {
  return (
    <div className="relative mb-6">
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <Search className="w-5 h-5 text-[#3e494c]/50" />
      </div>
      <input
        type="text"
        placeholder="البحث في الإدارات..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pr-12 pl-4 py-3 rounded-xl text-right border-2 border-white/30 focus:border-[#3e494c]/50 outline-none transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.4)',
          fontFamily: 'IBM Plex Sans Arabic'
        }}
      />
    </div>
  );
};

export default DepartmentSearch;
