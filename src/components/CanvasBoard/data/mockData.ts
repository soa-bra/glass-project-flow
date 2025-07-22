/**
 * @fileoverview Mock data for Canvas Board collaboration features
 * @author AI Assistant  
 * @version 1.0.0
 */

import { Participant, ChatMessage } from '@/types/canvas';

export const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    role: 'host',
    isOnline: true,
    isSpeaking: false
  },
  {
    id: '2', 
    name: 'سارة أحمد',
    role: 'user',
    isOnline: true,
    isSpeaking: true
  },
  {
    id: '3',
    name: 'محمد علي',
    role: 'guest',
    isOnline: false,
    isSpeaking: false
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '1',
    userName: 'أحمد محمد',
    message: 'مرحباً بالجميع! هيا نبدأ العمل على المشروع',
    timestamp: new Date(Date.now() - 300000),
    type: 'text'
  },
  {
    id: '2',
    userId: '2',
    userName: 'سارة أحمد',
    message: 'ممتاز! لدي بعض الأفكار للتصميم',
    timestamp: new Date(Date.now() - 120000),
    type: 'text'
  }
];

export const createNewChatMessage = (message: string): ChatMessage => ({
  id: `msg-${Date.now()}`,
  userId: 'current-user',
  userName: 'المستخدم الحالي',
  message,
  timestamp: new Date(),
  type: 'text'
});