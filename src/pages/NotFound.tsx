import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center font-arabic"
      style={{ background: '#dfecf2' }}
      dir="rtl"
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-6 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-8">عذراً، الصفحة غير موجودة</p>
        <Link 
          to="/" 
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-block"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
