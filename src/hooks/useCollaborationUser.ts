import { useState, useEffect } from 'react';
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
 * Hook لإدارة هوية المستخدم في التعاون المباشر
 * يحفظ الهوية في localStorage لثباتها عبر الجلسات
 */
export function useCollaborationUser(): CollaborationUser & {
  updateName: (name: string) => void;
  updateColor: (color: string) => void;
} {
  const [user, setUser] = useState<CollaborationUser>(() => {
    // محاولة استرجاع البيانات المحفوظة
    const savedId = localStorage.getItem(USER_ID_KEY);
    const savedName = localStorage.getItem(USER_NAME_KEY);
    const savedColor = localStorage.getItem(USER_COLOR_KEY);

    // إنشاء معرف جديد إذا لم يوجد
    const id = savedId || `user-${nanoid(8)}`;
    const name = savedName || 'مستخدم سوبرا';
    const color = savedColor || USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];

    // حفظ القيم الجديدة
    if (!savedId) localStorage.setItem(USER_ID_KEY, id);
    if (!savedName) localStorage.setItem(USER_NAME_KEY, name);
    if (!savedColor) localStorage.setItem(USER_COLOR_KEY, color);

    return { id, name, color };
  });

  const updateName = (name: string) => {
    localStorage.setItem(USER_NAME_KEY, name);
    setUser(prev => ({ ...prev, name }));
  };

  const updateColor = (color: string) => {
    localStorage.setItem(USER_COLOR_KEY, color);
    setUser(prev => ({ ...prev, color }));
  };

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
