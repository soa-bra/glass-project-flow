import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { TaskDetails } from './TaskDetails';
import { Button } from '@/components/ui/button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SprintBurndownChartProps {
  projectId: string;
}

export const SprintBurndownChart: React.FC<SprintBurndownChartProps> = ({ projectId }) => {
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<any>(null);
  // Mock data for the burndown chart
  const chartData = {
    labels: [
      'اليوم 1', 'اليوم 2', 'اليوم 3', 'اليوم 4', 'اليوم 5',
      'اليوم 6', 'اليوم 7', 'اليوم 8', 'اليوم 9', 'اليوم 10'
    ],
    datasets: [
      {
        label: 'المخطط المثالي',
        data: [50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0],
        borderColor: '#000000',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.1,
      },
      {
        label: 'التقدم الفعلي',
        data: [50, 46, 38, 32, 28, 22, 18, 12, 8, 3],
        borderColor: '#a4e2f6',
        backgroundColor: 'rgba(164, 226, 246, 0.1)',
        borderWidth: 3,
        tension: 0.1,
        fill: true,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#000000',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: 'bold'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000000',
        bodyColor: '#000000',
        borderColor: '#000000',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y} مهمة`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#000000',
          font: {
            size: 11,
            weight: 'normal'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#000000',
          font: {
            size: 11,
            weight: 'normal'
          },
          callback: (value) => `${value} مهمة`
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // Task dependencies mock data
  const taskDependencies = [
    { id: '1', name: 'إعداد البيئة', dependencies: [], status: 'done' },
    { id: '2', name: 'تصميم قاعدة البيانات', dependencies: ['1'], status: 'done' },
    { id: '3', name: 'تطوير API', dependencies: ['2'], status: 'in-progress' },
    { id: '4', name: 'تصميم الواجهات', dependencies: ['1'], status: 'in-progress' },
    { id: '5', name: 'تكامل النظام', dependencies: ['3', '4'], status: 'pending' },
    { id: '6', name: 'الاختبار النهائي', dependencies: ['5'], status: 'pending' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return '#bdeed3';
      case 'in-progress': return '#a4e2f6';
      case 'pending': return '#dfecf2';
      default: return '#f1b5b9';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done': return 'مكتمل';
      case 'in-progress': return 'قيد التنفيذ';
      case 'pending': return 'في الانتظار';
      default: return 'متوقف';
    }
  };

  const handleTaskDoubleClick = (task: any) => {
    setSelectedTaskForDetails(task);
    setShowTaskDetails(true);
  };

  if (showTaskDetails) {
    return (
      <TaskDetails
        selectedTask={selectedTaskForDetails}
        onClose={() => setShowTaskDetails(false)}
        projectId={projectId}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Header */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">مخطط السبرنت الحرق</h3>
          <Button
            variant="outline"
            onClick={() => setShowTaskDetails(true)}
          >
            تفاصيل المهام
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-black">
              المتبقي: <span className="font-bold">3 مهام</span>
            </div>
            <div className="text-sm font-medium text-black">
              الموعد النهائي: <span className="font-bold">3 أيام</span>
            </div>
          </div>
        </div>
        <p className="text-sm font-medium text-black">
          تتبع تقدم السبرنت الحالي مقارنة بالخطة المثالية
        </p>
      </div>

      {/* Chart Container */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <div className="h-[400px]">
          <Line data={chartData} options={options} />
        </div>
      </div>

      {/* Task Dependencies Timeline */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <h3 className="text-lg font-semibold text-black mb-6">تسلسل المهام والتبعيات</h3>
        
        <div className="space-y-4">
          {taskDependencies.map((task, index) => (
            <div key={task.id} className="flex items-center gap-4">
              {/* Task Number */}
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              
              {/* Task Info */}
              <div 
                className="flex-1 flex items-center justify-between p-4 bg-transparent border border-black/10 rounded-full cursor-pointer hover:shadow-md transition-shadow"
                onDoubleClick={() => handleTaskDoubleClick(task)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-black">{task.name}</span>
                  {task.dependencies.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-normal text-gray-400">يعتمد على:</span>
                      <span className="text-xs font-medium text-black">
                        {task.dependencies.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div 
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  <span className="text-sm font-medium text-black">
                    {getStatusText(task.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sprint Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">معدل الحرق</h4>
          <p className="text-2xl font-bold text-black mb-1">4.7</p>
          <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">مهمة/يوم</span>
          </div>
        </div>
        
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">الوقت المتبقي</h4>
          <p className="text-2xl font-bold text-black mb-1">3</p>
          <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">أيام عمل</span>
          </div>
        </div>
        
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">احتمالية الإنجاز</h4>
          <p className="text-2xl font-bold text-black mb-1">87%</p>
          <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">في الموعد</span>
          </div>
        </div>
      </div>
    </div>
  );
};