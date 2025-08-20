// Internal Metrics Dashboard
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { Activity, Zap, Users, Database, RefreshCw, Download } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface MetricsData {
  performance: Array<{
    timestamp: string;
    fps: number;
    latency: number;
    memoryUsage: number;
  }>;
  events: Array<{
    event_type: string;
    count: number;
    avg_duration?: number;
  }>;
  users: Array<{
    date: string;
    active_users: number;
    new_users: number;
  }>;
  boards: Array<{
    board_id: string;
    event_count: number;
    avg_performance: number;
  }>;
}

export default function InternalMetricsPage() {
  const { user, loading, hasPermission } = useAuth();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');

  // Check authorization
  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        // Check if user is admin/host for any board or has specific permissions
        const { data, error } = await supabase
          .from('board_permissions')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'host')
          .limit(1);

        setIsAuthorized(!error && data && data.length > 0);
      } else {
        setIsAuthorized(false);
      }
    };

    if (!loading) {
      checkAuth();
    }
  }, [user, loading]);

  const fetchMetrics = async () => {
    setRefreshing(true);
    try {
      const timeFilter = getTimeFilter(timeRange);
      
      // Performance metrics
      const { data: perfData } = await supabase
        .from('telemetry_events')
        .select('created_at, metadata')
        .eq('event_type', 'performance_metrics')
        .gte('created_at', timeFilter)
        .order('created_at', { ascending: true });

      // Event aggregations
      const { data: eventData } = await supabase
        .from('telemetry_events')
        .select('event_type, metadata, created_at')
        .gte('created_at', timeFilter);

      // Process data
      const processedMetrics: MetricsData = {
        performance: perfData?.map(item => {
          const metadata = item.metadata as any;
          return {
            timestamp: new Date(item.created_at).toLocaleTimeString('ar-SA'),
            fps: metadata?.fps || 0,
            latency: metadata?.latency || 0,
            memoryUsage: Math.round((metadata?.memoryUsage || 0) / 1024 / 1024), // MB
          };
        }) || [],
        
        events: aggregateEvents(eventData || []),
        
        users: generateUserStats(eventData || []),
        
        boards: aggregateBoardStats(eventData || [])
      };

      setMetrics(processedMetrics);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchMetrics();
    }
  }, [isAuthorized, timeRange]);

  const getTimeFilter = (range: string): string => {
    const now = new Date();
    switch (range) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const aggregateEvents = (data: any[]) => {
    const eventCounts: Record<string, number> = {};
    data.forEach(item => {
      eventCounts[item.event_type] = (eventCounts[item.event_type] || 0) + 1;
    });
    
    return Object.entries(eventCounts).map(([event_type, count]) => ({
      event_type,
      count
    }));
  };

  const generateUserStats = (data: any[]) => {
    const dailyUsers: Record<string, Set<string>> = {};
    data.forEach(item => {
      const date = new Date(item.created_at).toDateString();
      if (!dailyUsers[date]) dailyUsers[date] = new Set();
      if (item.user_id) dailyUsers[date].add(item.user_id);
    });

    return Object.entries(dailyUsers).map(([date, userSet]) => ({
      date: new Date(date).toLocaleDateString('ar-SA'),
      active_users: userSet.size,
      new_users: Math.floor(userSet.size * 0.1), // Approximate
    }));
  };

  const aggregateBoardStats = (data: any[]) => {
    const boardStats: Record<string, { count: number; totalPerf: number; perfCount: number }> = {};
    
    data.forEach(item => {
      if (item.board_id) {
        if (!boardStats[item.board_id]) {
          boardStats[item.board_id] = { count: 0, totalPerf: 0, perfCount: 0 };
        }
        boardStats[item.board_id].count++;
        
        if (item.metadata?.fps) {
          boardStats[item.board_id].totalPerf += item.metadata.fps;
          boardStats[item.board_id].perfCount++;
        }
      }
    });

    return Object.entries(boardStats).map(([board_id, stats]) => ({
      board_id: board_id.slice(0, 8) + '...',
      event_count: stats.count,
      avg_performance: stats.perfCount > 0 ? Math.round(stats.totalPerf / stats.perfCount) : 0,
    }));
  };

  const exportData = () => {
    if (!metrics) return;
    
    const dataStr = JSON.stringify(metrics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `metrics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isAuthorized === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>غير مخول</CardTitle>
          </CardHeader>
          <CardContent>
            <p>ليس لديك صلاحية للوصول إلى صفحة المقاييس الداخلية.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">المقاييس الداخلية</h1>
          <p className="text-muted-foreground">لوحة معلومات الأداء والتحليلات</p>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="1h">آخر ساعة</option>
            <option value="24h">آخر 24 ساعة</option>
            <option value="7d">آخر 7 أيام</option>
          </select>
          <Button onClick={fetchMetrics} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Activity className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">متوسط FPS</p>
                <p className="text-2xl font-bold">
                  {metrics?.performance.length ? 
                    Math.round(metrics.performance.reduce((acc, curr) => acc + curr.fps, 0) / metrics.performance.length) 
                    : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Zap className="w-8 h-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الأحداث</p>
                <p className="text-2xl font-bold">
                  {metrics?.events.reduce((acc, curr) => acc + curr.count, 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Users className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">المستخدمون النشطون</p>
                <p className="text-2xl font-bold">
                  {metrics?.users[metrics.users.length - 1]?.active_users || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Database className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">اللوحات النشطة</p>
                <p className="text-2xl font-bold">{metrics?.boards.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="events">الأحداث</TabsTrigger>
          <TabsTrigger value="users">المستخدمون</TabsTrigger>
          <TabsTrigger value="boards">اللوحات</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>مقاييس الأداء</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={metrics?.performance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="fps" stroke="hsl(var(--primary))" name="FPS" />
                  <Line type="monotone" dataKey="latency" stroke="hsl(var(--accent))" name="Latency (ms)" />
                  <Line type="monotone" dataKey="memoryUsage" stroke="hsl(var(--secondary))" name="Memory (MB)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>توزيع الأحداث</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={metrics?.events || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="event_type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={metrics?.users || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="active_users" stroke="hsl(var(--primary))" name="المستخدمون النشطون" />
                  <Line type="monotone" dataKey="new_users" stroke="hsl(var(--accent))" name="المستخدمون الجدد" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boards">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات اللوحات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={metrics?.boards || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="board_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="event_count" fill="hsl(var(--primary))" name="عدد الأحداث" />
                  <Bar dataKey="avg_performance" fill="hsl(var(--accent))" name="متوسط الأداء" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}