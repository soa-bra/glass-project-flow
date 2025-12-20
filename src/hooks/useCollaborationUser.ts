import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';

const USER_ID_KEY = 'supra_collab_user_id';
const USER_NAME_KEY = 'supra_collab_user_name';
const USER_COLOR_KEY = 'supra_collab_user_color';

// ألوان محددة مسبقاً للمستخدمين
const USER_COLORS = [
  '#3DBE8B', // أخضر
  '#3DA8F5', // أزرق
  '#F6C445', // أصفر
  '#E5564D', // أحمر
  '#9B59B6', // بنفسجي
  '#E67E22', // برتقالي
  '#1ABC9C', // فيروزي
  '#E91E63', // وردي
];

interface CollaborationUser {
  id: string;
  name: string;
  color: string;
}

/**
 * دالة للحصول على بيانات المستخدم من localStorage أو إنشاء بيانات جديدة
 */
function getOrCreateUserData(): CollaborationUser {
  try {
    let id = localStorage.getItem(USER_ID_KEY);
    let name = localStorage.getItem(USER_NAME_KEY);
    let color = localStorage.getItem(USER_COLOR_KEY);

    if (!id) {
      id = `user-${nanoid(8)}`;
      localStorage.setItem(USER_ID_KEY, id);
    }
    if (!name) {
      name = 'مستخدم سوبرا';
      localStorage.setItem(USER_NAME_KEY, name);
    }
    if (!color) {
      color = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
      localStorage.setItem(USER_COLOR_KEY, color);
    }

    return { id, name, color };
  } catch {
    // Fallback for SSR or localStorage errors
    return {
      id: `user-${nanoid(8)}`,
      name: 'مستخدم سوبرا',
      color: USER_COLORS[0],
    };
  }
}

/**
 * Hook لإدارة هوية المستخدم في التعاون المباشر
 * يحفظ الهوية في localStorage لثباتها عبر الجلسات
 */
export function useCollaborationUser(): CollaborationUser & {
  updateName: (name: string) => void;
  updateColor: (color: string) => void;
} {
  // استخدام lazy initialization لتجنب مشاكل React
  const [user, setUser] = useState<CollaborationUser>(getOrCreateUserData);

  const updateName = useCallback((name: string) => {
    try {
      localStorage.setItem(USER_NAME_KEY, name);
    } catch { /* ignore */ }
    setUser(prev => ({ ...prev, name }));
  }, []);

  const updateColor = useCallback((color: string) => {
    try {
      localStorage.setItem(USER_COLOR_KEY, color);
    } catch { /* ignore */ }
    setUser(prev => ({ ...prev, color }));
  }, []);

  return {
    ...user,
    updateName,
    updateColor,
  };
}

/**
 * دالة مساعدة للحصول على معرف المستخدم بدون hook
 * مفيدة للاستخدام خارج React components
 */
export function getCollaborationUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = `user-${nanoid(8)}`;
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

/**
 * دالة مساعدة للحصول على اسم المستخدم
 */
export function getCollaborationUserName(): string {
  return localStorage.getItem(USER_NAME_KEY) || 'مستخدم سوبرا';
}

/**
 * دالة مساعدة للحصول على لون المستخدم
 */
export function getCollaborationUserColor(): string {
  let color = localStorage.getItem(USER_COLOR_KEY);
  if (!color) {
    color = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
    localStorage.setItem(USER_COLOR_KEY, color);
  }
  return color;
}
