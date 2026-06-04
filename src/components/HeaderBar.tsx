import {
  Bell,
  LogOut,
  MessageCircle,
  Moon,
  RefreshCcw,
  Search,
  Settings,
  Sun,
  User,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';

type HeaderOverlay = 'search' | 'notifications' | 'messages' | 'user' | null;
type NotificationType = 'app' | 'message' | 'task' | 'alert';

interface SearchItem {
  id: string;
  label: string;
  description: string;
  section: string;
  keywords: string[];
  requiredPermissions: string[];
  selector?: string;
}

interface NotificationItem {
  id: string;
  text: string;
  type: NotificationType;
  isNew: boolean;
}

interface ChatItem {
  id: string;
  name: string;
  preview: string;
  messages: string[];
}

const iconButtonClass =
  'p-2 hover:bg-white/20 transition-colors group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20';

const iconCircleClass =
  'w-[50px] h-[50px] bg-transparent border border-black rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 active:scale-95';

const glassStyle = {
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(14px) saturate(1.15)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.15)',
  border: '1px solid rgba(255,255,255,0.72)',
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.24), 0 0 0 1px rgba(255,255,255,0.28)',
};

const searchItems: SearchItem[] = [
  {
    id: 'home',
    label: 'الرئيسية',
    description: 'لوحة البداية ومؤشرات العمل',
    section: 'home',
    keywords: ['الرئيسية', 'لوحة', 'مؤشرات', 'home'],
    requiredPermissions: ['home:view'],
  },
  {
    id: 'projects',
    label: 'لوحة المشاريع',
    description: 'إدارة المشاريع، التبويبات، والصناديق',
    section: 'home',
    keywords: ['مشاريع', 'إدارة المشروع', 'صناديق', 'تبويبات', 'projects'],
    requiredPermissions: ['projects:view'],
  },
  {
    id: 'project-tabs',
    label: 'تبويبات إدارة المشاريع',
    description: 'المالي، إدارة المشاريع، التسويق، الموارد البشرية، العملاء',
    section: 'home',
    keywords: ['المالي', 'إدارة المشاريع', 'التسويق', 'الموارد البشرية', 'العملاء', 'تبويبات'],
    requiredPermissions: ['projects:view'],
  },
  {
    id: 'project-box',
    label: 'صندوق المشاريع',
    description: 'بطاقات ولوحات المشاريع الحالية',
    section: 'home',
    keywords: ['صندوق المشاريع', 'بطاقات المشاريع', 'المشاريع', 'لوحة المشاريع'],
    requiredPermissions: ['projects:view'],
  },
  {
    id: 'task-box',
    label: 'صندوق المهام',
    description: 'مهام ومشاريع قيد المتابعة',
    section: 'planning',
    keywords: ['صندوق المهام', 'المهام', 'مهام ومشاريع', 'tasks'],
    requiredPermissions: ['planning:view'],
  },
  {
    id: 'departments',
    label: 'الإدارات',
    description: 'أقسام وإدارات التطبيق',
    section: 'departments',
    keywords: ['الإدارات', 'الأقسام', 'departments'],
    requiredPermissions: ['departments:view'],
  },
  {
    id: 'planning',
    label: 'التخطيط التضامني',
    description: 'لوحات التخطيط والمهام المشتركة',
    section: 'planning',
    keywords: ['تخطيط', 'التخطيط التضامني', 'مهام', 'planning'],
    requiredPermissions: ['planning:view'],
  },
  {
    id: 'archive',
    label: 'الأرشيف',
    description: 'العناصر المؤرشفة وسجلاتها',
    section: 'archive',
    keywords: ['أرشيف', 'الأرشيف', 'archive'],
    requiredPermissions: ['archive:view'],
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    description: 'إعدادات النظام والحساب',
    section: 'settings',
    keywords: ['إعدادات', 'حساب', 'settings'],
    requiredPermissions: ['settings:view'],
  },
  {
    id: 'profile',
    label: 'الحساب الشخصي',
    description: 'اختصار إعدادات الملف الشخصي',
    section: 'settings',
    keywords: ['حسابي', 'الحساب الشخصي', 'profile'],
    requiredPermissions: ['settings:profile'],
  },
  {
    id: 'project-basic-info',
    label: 'تبويب المعلومات الأساسية',
    description: 'تبويب داخل نافذة إضافة أو تعديل مشروع',
    section: 'home',
    keywords: ['المعلومات الأساسية', 'اسم المشروع', 'وصف المشروع', 'مدير المشروع'],
    requiredPermissions: ['projects:view'],
  },
  {
    id: 'project-customer-info',
    label: 'تبويب بيانات العميل',
    description: 'بيانات العميل داخل نافذة المشروع',
    section: 'home',
    keywords: ['بيانات العميل', 'العميل', 'customer'],
    requiredPermissions: ['projects:view'],
  },
  {
    id: 'project-tasks-tab',
    label: 'تبويب المهام',
    description: 'مهام المشروع داخل نافذة المشروع',
    section: 'home',
    keywords: ['المهام', 'مهام المشروع', 'tasks'],
    requiredPermissions: ['projects:view'],
  },
  {
    id: 'project-partnerships-tab',
    label: 'تبويب الشراكات',
    description: 'شراكات المشروع داخل نافذة المشروع',
    section: 'home',
    keywords: ['الشراكات', 'شركاء', 'partnerships'],
    requiredPermissions: ['projects:view'],
  },
  {
    id: 'project-contract-tab',
    label: 'تبويب العقد',
    description: 'تفاصيل العقد داخل نافذة المشروع',
    section: 'home',
    keywords: ['العقد', 'قيمة العقد', 'contract'],
    requiredPermissions: ['projects:view'],
  },
];

const notificationColors: Record<NotificationType, string> = {
  app: 'bg-[#3e494c]',
  message: 'bg-[#7c8f96]',
  task: 'bg-[#4f766f]',
  alert: 'bg-[#c69b55]',
};

const initialNotifications: NotificationItem[] = [
  { id: 'n1', text: 'تم تحديث حالة مشروع جديد', type: 'app', isNew: true },
  { id: 'n2', text: 'وصلت رسالة من فريق التنفيذ', type: 'message', isNew: true },
  { id: 'n3', text: 'مهمة بانتظار المراجعة', type: 'task', isNew: false },
  { id: 'n4', text: 'تنبيه: موعد تسليم قريب', type: 'alert', isNew: false },
  { id: 'n5', text: 'تمت أرشفة عنصر من لوحة المشروع', type: 'app', isNew: false },
  { id: 'n6', text: 'تحديث جديد في صندوق المهام', type: 'task', isNew: false },
];

const chats: ChatItem[] = [
  {
    id: 'c1',
    name: 'فريق إدارة المشروع',
    preview: 'هل تم اعتماد التحديث الأخير؟',
    messages: ['هل تم اعتماد التحديث الأخير؟', 'نراجع التفاصيل الآن.'],
  },
  {
    id: 'c2',
    name: 'الدعم الداخلي',
    preview: 'تم فتح طلبك بنجاح.',
    messages: ['تم فتح طلبك بنجاح.', 'سنشاركك النتيجة فور الانتهاء.'],
  },
  {
    id: 'c3',
    name: 'فريق المهام',
    preview: 'هناك مهمة جديدة في الانتظار.',
    messages: ['هناك مهمة جديدة في الانتظار.', 'يرجى مراجعتها قبل نهاية اليوم.'],
  },
];

const readStoredPermissions = () => {
  if (typeof window === 'undefined') return searchItems.flatMap((item) => item.requiredPermissions);

  const storedPermissions =
    window.localStorage.getItem('soabra:user-permissions') ||
    window.localStorage.getItem('userPermissions');

  if (!storedPermissions) return searchItems.flatMap((item) => item.requiredPermissions);

  try {
    const parsed = JSON.parse(storedPermissions);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const getVisibleSearchItems = (permissions: string[]): SearchItem[] => {
  if (typeof document === 'undefined') return [];

  const values = Array.from(
    document.querySelectorAll<HTMLElement>('h1, h2, h3, button, [role="tab"], [data-search-label]'),
  )
    .map((element, index) => {
      const label = element.dataset.searchLabel || element.textContent?.replace(/\s+/g, ' ').trim();
      if (!label || label.length < 3 || label.length > 48) return null;

      if (!element.id) element.id = `header-search-target-${index}`;

      return {
        id: `visible-${element.id}`,
        label,
        description: 'عنصر ظاهر في الواجهة الحالية',
        section: '',
        keywords: [label],
        requiredPermissions: [],
        selector: `#${element.id}`,
      };
    })
    .filter((item): item is SearchItem => Boolean(item));

  return values.filter((item) =>
    item.requiredPermissions.every((permission) => permissions.includes(permission)),
  );
};

const HeaderBar = () => {
  const { setActiveSection } = useNavigation();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [openOverlay, setOpenOverlay] = useState<HeaderOverlay>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedChatId, setSelectedChatId] = useState(chats[0].id);
  const [showChatList, setShowChatList] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [visibleSearchItems, setVisibleSearchItems] = useState<SearchItem[]>([]);
  const headerActionsRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const hasNewNotifications = notifications.some((notification) => notification.isNew);
  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || chats[0];

  const availableSearchItems = useMemo(
    () =>
      [...searchItems, ...visibleSearchItems].filter((item) =>
        item.requiredPermissions.every((permission) => userPermissions.includes(permission)),
      ),
    [userPermissions, visibleSearchItems],
  );

  const filteredSearchItems = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return availableSearchItems.slice(0, 5);

    return availableSearchItems
      .filter((item) =>
        [item.label, item.description, ...item.keywords].some((value) =>
          value.toLowerCase().includes(query),
        ),
      )
      .slice(0, 6);
  }, [availableSearchItems, searchValue]);

  useEffect(() => {
    setUserPermissions(readStoredPermissions());
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerActionsRef.current && !headerActionsRef.current.contains(event.target as Node)) {
        setOpenOverlay(null);
        if (!searchValue.trim()) setSearchValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchValue]);

  useEffect(() => {
    if (openOverlay === 'search') {
      setVisibleSearchItems(getVisibleSearchItems(userPermissions));
      window.setTimeout(() => searchInputRef.current?.focus(), 120);
    }

    if (openOverlay === 'notifications') {
      setNotifications((items) => items.map((item) => ({ ...item, isNew: false })));
    }
  }, [openOverlay, userPermissions]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const openOnly = (overlay: HeaderOverlay) => {
    setOpenOverlay((current) => (current === overlay ? null : overlay));
  };

  const handleRefresh = () => {
    if (isRefreshing) return;

    setOpenOverlay(null);
    setIsRefreshing(true);
    window.setTimeout(() => window.location.reload(), 220);
  };

  const handleSearchSelect = (item: SearchItem) => {
    if (item.section) setActiveSection(item.section);
    setOpenOverlay(null);
    setSearchValue('');

    window.setTimeout(() => {
      const target = item.selector
        ? document.querySelector(item.selector)
        : Array.from(document.querySelectorAll<HTMLElement>('h1, h2, h3, button, [role="tab"]')).find(
            (element) => element.textContent?.includes(item.label),
          );

      (target || document.querySelector('main, [data-main-content], .overflow-hidden'))?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 120);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((items) => items.filter((item) => item.id !== id));
  };

  const handleThemeToggle = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    document.documentElement.classList.toggle('dark', nextMode);
    window.localStorage.setItem('theme', nextMode ? 'dark' : 'light');
  };

  const handleProfileShortcut = () => {
    setActiveSection('settings');
    setOpenOverlay(null);
  };

  const handleLogout = () => {
    window.dispatchEvent(new CustomEvent('soabra:logout-requested'));
    setOpenOverlay(null);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setShowChatList(false);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setMessageText('');
  };

  return (
    <header className="fixed top-0 right-0 left-0 h-[60px] z-header my-0 py-[65px] px-[5px] bg-slate-100">
      <div className="flex items-center justify-between h-full px-0">
        {/* Logo/Brand - Left Side aligned with sidebar menu */}
        <div className="text-right ml-4 mx-[5px] flex items-center">
          {!imageError ? (
            <img
              src="/lovable-uploads/9a8b8ed4-b3d6-4ecf-b62c-e6c1eba8c3d4.png"
              alt="SoaBra Logo"
              className="h-12 w-auto object-contain transition-opacity duration-300"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{
                opacity: imageLoaded ? 1 : 0.7,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            />
          ) : (
            <div className="">
              <span className="text-soabra-text-primary font-bold text-lg font-arabic">
                SoaBra
              </span>
            </div>
          )}
        </div>

        {/* Center - Empty for balance */}
        <div className="flex-1" />

        {/* Action Icons - Right Side: بحث ← تحديث ← تنبيهات ← رسائل ← مستخدم */}
        <div ref={headerActionsRef} className="relative flex items-center gap-0 px-0 mx-0">
          <div className="relative p-2">
            <motion.div
              layout
              className={`border border-black bg-transparent flex items-center transition-all duration-300 ${
                openOverlay === 'search'
                  ? 'h-[50px] w-[270px] rounded-full px-4 gap-2'
                  : 'h-[50px] w-[50px] rounded-full justify-center'
              }`}
            >
              {openOverlay === 'search' && (
                <input
                  ref={searchInputRef}
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  onBlur={() => {
                    if (!searchValue.trim()) window.setTimeout(() => setOpenOverlay(null), 140);
                  }}
                  placeholder="ابحث في التطبيق"
                  className="min-w-0 flex-1 bg-transparent text-right text-sm text-black placeholder:text-[#3e494c]/60 outline-none"
                />
              )}
              <button
                type="button"
                onClick={() => openOnly('search')}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                aria-label="بحث"
              >
                <Search className="w-[20px] h-[20px] text-[#3e494c]" />
              </button>
            </motion.div>

            <AnimatePresence>
              {openOverlay === 'search' && filteredSearchItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute top-[64px] right-2 w-[270px] rounded-[26px] p-2"
                  style={glassStyle}
                >
                  <div className="flex flex-col gap-2">
                    {filteredSearchItems.map((item) => (
                      <button
                        key={item.id}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSearchSelect(item)}
                        className="rounded-3xl px-3 py-2 text-right transition hover:bg-white/70 active:scale-[0.98]"
                      >
                        <span className="block text-sm font-medium text-black">{item.label}</span>
                        <span className="block text-xs text-[#3e494c]/70">{item.description}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className={iconButtonClass} onClick={handleRefresh} aria-label="تحديث">
            <div className={iconCircleClass}>
              <RefreshCcw
                className={`w-[20px] h-[20px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
            </div>
          </button>

          <div className="relative">
            <button
              className={iconButtonClass}
              onClick={() => openOnly('notifications')}
              aria-label="الإشعارات"
            >
              <div className={`${iconCircleClass} relative`}>
                <Bell className="w-[20px] h-[20px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
                {hasNewNotifications && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-slate-100" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {openOverlay === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="absolute top-[64px] left-2 w-[320px] rounded-[28px] p-3"
                  style={glassStyle}
                >
                  <div className="max-h-[300px] overflow-y-auto pl-1">
                    {notifications.length === 0 ? (
                      <div className="px-3 py-4 text-center text-sm text-black">لا توجد إشعارات</div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="flex min-h-[52px] items-center gap-2 rounded-3xl bg-white/55 px-3 py-2 text-right transition hover:bg-white/75"
                          >
                            <span
                              className={`h-3 w-3 flex-shrink-0 rounded-full ${notificationColors[notification.type]}`}
                            />
                            {notification.isNew && (
                              <span className="h-3 w-3 flex-shrink-0 rounded-full bg-red-500" />
                            )}
                            <span className="flex-1 text-sm text-black">{notification.text}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-black transition hover:bg-white active:scale-95"
                              aria-label="حذف الإشعار"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button className={iconButtonClass} onClick={() => openOnly('messages')} aria-label="الرسائل">
              <div className={iconCircleClass}>
                <MessageCircle className="w-[20px] h-[20px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </button>
          </div>

          <div className="relative">
            <button className={iconButtonClass} onClick={() => openOnly('user')} aria-label="المستخدم">
              <div className={iconCircleClass}>
                <User className="w-[20px] h-[20px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </button>

            <AnimatePresence>
              {openOverlay === 'user' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute top-[64px] left-0 w-56"
                >
                  <div className="flex flex-col items-start gap-2">
                    <button
                      type="button"
                      onClick={handleThemeToggle}
                      className="relative flex w-full items-center justify-between overflow-hidden rounded-3xl px-3 py-2 text-right text-black transition hover:bg-white/70 active:scale-[0.98]"
                      style={glassStyle}
                    >
                      <span className="flex items-center gap-2 text-sm">
                        {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        {isDarkMode ? 'الوضع الداكن' : 'الوضع الفاتح'}
                      </span>
                      <span className="flex h-9 w-[86px] items-center justify-between rounded-full border border-black/45 bg-transparent p-1">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                            !isDarkMode ? 'bg-black text-white' : 'text-black'
                          }`}
                          aria-hidden="true"
                        >
                          <Sun className="h-4 w-4" />
                        </span>
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                            isDarkMode ? 'bg-black text-white' : 'text-black'
                          }`}
                          aria-hidden="true"
                        >
                          <Moon className="h-4 w-4" />
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleProfileShortcut}
                      className="flex w-full items-center gap-2 rounded-3xl px-3 py-2 text-right text-sm text-black transition hover:bg-white/70 active:scale-[0.98]"
                      style={glassStyle}
                    >
                      <Settings className="h-4 w-4" />
                      الحساب الشخصي
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-3xl px-3 py-2 text-right text-sm text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
                      style={glassStyle}
                    >
                      <LogOut className="h-4 w-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {openOverlay === 'messages' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-[#2A3437]/35 p-4 backdrop-blur-md"
            onMouseDown={() => setOpenOverlay(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 18, scale: 0.98, filter: 'blur(8px)' }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="w-[min(860px,calc(100vw-32px))] rounded-[30px] p-4 md:p-6"
              style={glassStyle}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-black">الرسائل</h2>
                <button
                  type="button"
                  onClick={() => setOpenOverlay(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black text-black transition hover:bg-white/70 active:scale-95"
                  aria-label="إغلاق الرسائل"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid h-[min(520px,70vh)] grid-cols-1 overflow-hidden rounded-[24px] bg-white/25 md:grid-cols-[260px_1fr]">
                <div className={`${showChatList ? 'block' : 'hidden'} border-black/10 md:block md:border-l`}>
                  <div className="flex h-full flex-col gap-2 overflow-y-auto p-3">
                    {chats.map((chat) => (
                      <button
                        key={chat.id}
                        type="button"
                        onClick={() => handleChatSelect(chat.id)}
                        className={`rounded-3xl px-3 py-3 text-right transition hover:bg-white/75 active:scale-[0.98] ${
                          selectedChatId === chat.id ? 'bg-white/80' : 'bg-white/40'
                        }`}
                      >
                        <span className="block text-sm font-medium text-black">{chat.name}</span>
                        <span className="block truncate text-xs text-[#3e494c]/70">{chat.preview}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`${showChatList ? 'hidden' : 'flex'} h-full flex-col md:flex`}>
                  <div className="flex items-center gap-2 border-b border-black/10 p-3">
                    <button
                      type="button"
                      onClick={() => setShowChatList(true)}
                      className="rounded-full px-3 py-1 text-sm text-black transition hover:bg-white/70 md:hidden"
                    >
                      رجوع
                    </button>
                    <span className="font-medium text-black">{selectedChat.name}</span>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto p-4">
                    {selectedChat.messages.map((message, index) => (
                      <div
                        key={`${selectedChat.id}-${index}`}
                        className={`w-fit max-w-[82%] rounded-3xl px-4 py-2 text-sm text-black ${
                          index % 2 === 0 ? 'mr-auto bg-white/80' : 'bg-[#dfeaf0]'
                        }`}
                      >
                        {message}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 border-t border-black/10 p-3">
                    <input
                      value={messageText}
                      onChange={(event) => setMessageText(event.target.value)}
                      placeholder="اكتب رسالة"
                      className="min-w-0 flex-1 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-right text-sm text-black outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      className="rounded-full bg-black px-4 py-2 text-sm text-white transition hover:bg-black/80 active:scale-95"
                    >
                      إرسال
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default HeaderBar;
