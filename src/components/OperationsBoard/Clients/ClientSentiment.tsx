import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, AlertTriangle, Meh, Calendar, Phone, Mail } from 'lucide-react';

interface SentimentData {
  clientId: string;
  clientName: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  lastInteraction: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ClientSentimentProps {
  sentimentData: SentimentData[];
}

export const ClientSentiment: React.FC<ClientSentimentProps> = ({ sentimentData }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Heart className="w-5 h-5 text-green-500" />;
      case 'negative':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Meh className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'إيجابي';
      case 'negative':
        return 'سلبي';
      default:
        return 'محايد';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskText = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'خطر عالي';
      case 'medium':
        return 'خطر متوسط';
      case 'low':
        return 'خطر منخفض';
      default:
        return 'غير محدد';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="glass-enhanced rounded-[40px]">
      <CardHeader>
        <CardTitle className="text-right font-arabic flex items-center gap-2">
          <Heart className="w-5 h-5" />
          تحليل مشاعر العملاء
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sentimentData.map((client) => (
            <div key={client.clientId} className="bg-white/20 rounded-2xl p-4 hover:bg-white/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="text-right flex-1">
                  <h4 className="font-medium text-sm">{client.clientName}</h4>
                  <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    آخر تفاعل: {client.lastInteraction}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getSentimentIcon(client.sentiment)}
                  <span className={`font-bold text-lg ${getScoreColor(client.score)}`}>
                    {client.score}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mb-3">
                <Badge className={getSentimentColor(client.sentiment)}>
                  {getSentimentText(client.sentiment)}
                </Badge>
                <Badge className={getRiskColor(client.riskLevel)}>
                  {getRiskText(client.riskLevel)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="bg-gray-200 h-2 rounded-full">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      client.score >= 80 ? 'bg-green-500' : 
                      client.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${client.score}%` }}
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1">
                    <Phone className="w-3 h-3" />
                    اتصال
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1">
                    <Mail className="w-3 h-3" />
                    إيميل
                  </Button>
                </div>
              </div>

              {client.riskLevel === 'high' && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-700 text-right">
                    ⚠️ يتطلب متابعة عاجلة - خطر فقدان العميل
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-600">
                {sentimentData.filter(c => c.sentiment === 'positive').length}
              </p>
              <p className="text-xs text-gray-600">عملاء راضون</p>
            </div>
            <div>
              <p className="text-lg font-bold text-yellow-600">
                {sentimentData.filter(c => c.sentiment === 'neutral').length}
              </p>
              <p className="text-xs text-gray-600">عملاء محايدون</p>
            </div>
            <div>
              <p className="text-lg font-bold text-red-600">
                {sentimentData.filter(c => c.sentiment === 'negative').length}
              </p>
              <p className="text-xs text-gray-600">عملاء غير راضين</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};