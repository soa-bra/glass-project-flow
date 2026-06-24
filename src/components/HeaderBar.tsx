import {
  Bell,
  Check,
  LogOut,
  MessageCircle,
  Moon,
  RefreshCcw,
  Search,
  Send,
  Settings,
  Sun,
  User,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/contexts/NavigationContext';

type HeaderOverlay = 'search' | 'notifications' | 'messages' | 'user' | null;
type NotificationType = 'app' | 'message' | 'task' | 'alert';
type ChatSender = 'me' | 'team';

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
  createdAt: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  sentAt: string;
}

interface ChatItem {
  id: string;
  name: string;
  preview: string;
  unread: boolean;
  messages: ChatMessage[];
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

const notificationMenuWidth = 320;
const searchMenuWidth = 270;
const userMenuWidth = 224;
const viewportGap = 12;
const notificationsStorageKey = 'soabra:header-notifications';
const chatsStorageKey = 'soabra:header-chats';

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const nowIso = () => new Date().toISOString();

const formatTime = (value: string) =>
  new Intl.DateTimeFormat('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

const getAnchoredMenuPosition = (
  anchor: HTMLElement | null,
  width: number,
  align: 'start' | 'end' = 'end',
) => {
  if (!anchor || typeof window === 'undefined') return { top: 0, left: 0 };

  const rect = anchor.getBoundingClientRect();
  const maxLeft = Math.max(viewportGap, window.innerWidth - width - viewportGap);
  const preferredLeft = align === 'start' ? rect.left : rect.right - width;
  const left = Math.min(Math.max(preferredLeft, viewportGap), maxLeft);

  return {
    top: rect.bottom + 8,
    left,
  };
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
    id: 'finance-board',
    label: 'لوحة المالي',
    description: 'تبويب ولوحة المالي داخل إدارة المشاريع',
    section: 'home',
    keywords: ['المالي', 'مالي', 'تمويل', 'ميزانية', 'الفواتير', 'finance'],
    requiredPermissions: ['projects:view'],
  },
  {
    id: 'marketing-board',
    label: 'لوحة التسويق',
    description: 'تبويب ولوحة التسويق داخل إدارة المشاريع',
    section: 'home',
    keywords: ['التسويق', 'تسويق', 'marketing', 'حملات'],
    requiredPermissions: ['projects:view'],
  },
  {
    id: 'hr-board',
    label: 'لوحة الموارد البشرية',
    description: 'تبويب ولوحة الموارد البشرية',
    section: 'home',
    keywords: ['الموارد البشرية', 'موارد', 'بشرية', 'فريق', 'اعضاء الفريق', 'hr'],
    requiredPermissions: ['projects:view'],
  },
  {
    id: 'customers-board',
    label: 'لوحة العملاء',
    description: 'تبويب ولوحة العملاء داخل إدارة المشاريع',
    section: 'home',
    keywords: ['العملاء', 'عملاء', 'عميل', 'بيانات العميل', 'customers'],
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
    id: 'add-project-modal',
    label: 'نافذة إضافة مشروع جديد',
    description: 'نافذة إنشاء مشروع والتبويبات الخاصة بها',
    section: 'home',
    keywords: ['إضافة مشروع', 'اضافة مشروع', 'مشروع جديد', 'نافذة مشروع', 'حفظ المشروع'],
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
    id: 'planning',
    label: 'التخطيط التضامني',
    description: 'لوحات التخطيط والمهام المشتركة',
    section: 'planning',
    keywords: ['تخطيط', 'التخطيط التضامني', 'مهام', 'planning'],
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
];

const notificationColors: Record<NotificationType, string> = {
  app: 'bg-[#BDEED3]',
  message: 'bg-[#A4E2F6]',
  task: 'bg-[#FBE2AA]',
  alert: 'bg-[#D9D2FE]',
};

const initialNotifications: NotificationItem[] = [
  { id: 'n1', text: 'تم تحديث حالة مشروع جديد', type: 'app', isNew: true, createdAt: nowIso() },
  { id: 'n2', text: 'وصلت رسالة من فريق التنفيذ', type: 'message', isNew: true, createdAt: nowIso() },
  { id: 'n3', text: 'مهمة بانتظار المراجعة', type: 'task', isNew: false, createdAt: nowIso() },
  { id: 'n4', text: 'تنبيه: موعد تسليم قريب', type: 'alert', isNew: false, createdAt: nowIso() },
];

const initialChats: ChatItem[] = [
  {
    id: 'c1',
    name: 'فريق إدارة المشروع',
    preview: 'هل تم اعتماد التحديث الأخير؟',
    unread: true,
    messages: [
      { id: 'c1-m1', text: 'هل تم اعتماد التحديث الأخير؟', sender: 'team', sentAt: nowIso() },
      { id: 'c1-m2', text: 'نراجع التفاصيل الآن.', sender: 'me', sentAt: nowIso() },
    ],
  },
  {
    id: 'c2',
    name: 'الدعم الداخلي',
    preview: 'تم فتح طلبك بنجاح.',
    unread: false,
    messages: [
      { id: 'c2-m1', text: 'تم فتح طلبك بنجاح.', sender: 'team', sentAt: nowIso() },
      { id: 'c2-m2', text: 'سنشاركك النتيجة فور الانتهاء.', sender: 'team', sentAt: nowIso() },
    ],
  },
  {
    id: 'c3',
    name: 'فريق المهام',
    preview: 'هناك مهمة جديدة في الانتظار.',
    unread: true,
    messages: [
      { id: 'c3-m1', text: 'هناك مهمة جديدة في الانتظار.', sender: 'team', sentAt: nowIso() },
      { id: 'c3-m2', text: 'يرجى مراجعتها قبل نهاية اليوم.', sender: 'team', sentAt: nowIso() },
    ],
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

const readStoredArray = <T,>(key: string, fallback: T[]): T[] => {
  if (typeof window === 'undefined') return fallback;

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || 'null');
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const persistArray = <T,>(key: string, value: T[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const normalizeArabicSearch = (value: string) => {
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0640\u064B-\u065F\u0670]/g, '')
    .replace(/[إأآٱا]/g, 'ا')
    .replace(/[ةه]/g, 'ه')
    .replace(/[ىي]/g, 'ي')
    .replace(/[ؤو]/g, 'و')
    .replace(/[ئء]/g, '')
    .replace(/[^\u0600-\u06FFa-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized
    .split(' ')
    .map((token) => token.replace(/^ال/, ''))
    .filter(Boolean)
    .join(' ');
};

const isSubsequence = (query: string, target: string) => {
  let targetIndex = 0;

  for (const char of query) {
    targetIndex = target.indexOf(char, targetIndex);
    if (targetIndex === -1) return false;
    targetIndex += 1;
  }

  return true;
};

const itemMatchesQuery = (item: SearchItem, query: string) => {
  const normalizedQuery = normalizeArabicSearch(query);
  if (!normalizedQuery) return true;

  const corpus = normalizeArabicSearch([item.label, item.description, ...item.keywords].join(' '));
  const compactQuery = normalizedQuery.replace(/\s/g, '');
  const compactCorpus = corpus.replace(/\s/g, '');
  const queryTokens = normalizedQuery.split(' ').filter(Boolean);

  return (
    corpus.includes(normalizedQuery) ||
    compactCorpus.includes(compactQuery) ||
    queryTokens.every((token) => corpus.includes(token) || isSubsequence(token, compactCorpus))
  );
};

const defaultSearchPriority = [
  'projects',
  'project-tabs',
  'project-box',
  'finance-board',
  'marketing-board',
  'hr-board',
  'customers-board',
  'add-project-modal',
  'task-box',
  'planning',
  'departments',
  'archive',
  'settings',
  'profile',
  'home',
];

const getDefaultSearchRank = (item: SearchItem) => {
  const index = defaultSearchPriority.indexOf(item.id);
  return index === -1 ? defaultSearchPriority.length : index;
};

const getSearchScore = (item: SearchItem, query: string) => {
  const normalizedQuery = normalizeArabicSearch(query);
  const normalizedLabel = normalizeArabicSearch(item.label);
  const normalizedDescription = normalizeArabicSearch(item.description);
  const normalizedKeywords = normalizeArabicSearch(item.keywords.join(' '));

  if (normalizedLabel === normalizedQuery) return 0;
  if (normalizedLabel.startsWith(normalizedQuery)) return 1;
  if (normalizedLabel.includes(normalizedQuery)) return 2;
  if (normalizedKeywords.includes(normalizedQuery)) return 3;
  if (normalizedDescription.includes(normalizedQuery)) return 4;
  return 5 + getDefaultSearchRank(item);
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
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return values.filter((item) =>
    item.requiredPermissions.every((permission) => permissions.includes(permission)),
  );
};

const HeaderBar = () => {
  const { navigationState, setActiveSection } = useNavigation();
  const { signOut } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [openOverlay, setOpenOverlay] = useState<HeaderOverlay>(null);
  const [searchValue, setSearchValue] = useState('');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [chatThreads, setChatThreads] = useState(initialChats);
  const [selectedChatId, setSelectedChatId] = useState(initialChats[0].id);
  const [showChatList, setShowChatList] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [visibleSearchItems, setVisibleSearchItems] = useState<SearchItem[]>([]);
  const [pendingSearchItem, setPendingSearchItem] = useState<SearchItem | null>(null);
  const [searchMenuPosition, setSearchMenuPosition] = useState({ top: 0, left: 0 });
  const [notificationMenuPosition, setNotificationMenuPosition] = useState({ top: 0, left: 0 });
  const [userMenuPosition, setUserMenuPosition] = useState({ top: 0, left: 0 });
  const headerActionsRef = useRef<HTMLDivElement | null>(null);
  const searchButtonRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const notificationButtonRef = useRef<HTMLDivElement | null>(null);
  const userButtonRef = useRef<HTMLDivElement | null>(null);
  const searchPopoverRef = useRef<HTMLDivElement | null>(null);
  const notificationPopoverRef = useRef<HTMLDivElement | null>(null);
  const userPopoverRef = useRef<HTMLDivElement | null>(null);
  const messagesPopoverRef = useRef<HTMLDivElement | null>(null);

  const hasNewNotifications = notifications.some((notification) => notification.isNew);
  const hasUnreadMessages = chatThreads.some((chat) => chat.unread);
  const selectedChat = chatThreads.find((chat) => chat.id === selectedChatId) || chatThreads[0];
  const canUsePortal = typeof document !== 'undefined';

  const availableSearchItems = useMemo(
    () =>
      [...searchItems, ...visibleSearchItems].filter((item) =>
        item.requiredPermissions.every((permission) => userPermissions.includes(permission)),
      ),
    [userPermissions, visibleSearchItems],
  );

  const filteredSearchItems = useMemo(() => {
    const query = searchValue.trim();
    if (!query) {
      return [...availableSearchItems].sort((a, b) => getDefaultSearchRank(a) - getDefaultSearchRank(b)).slice(0, 12);
    }

    return availableSearchItems
      .filter((item) => itemMatchesQuery(item, query))
      .sort((a, b) => getSearchScore(a, query) - getSearchScore(b, query))
      .slice(0, 12);
  }, [availableSearchItems, searchValue]);

  const updateNotifications = (updater: (items: NotificationItem[]) => NotificationItem[]) => {
    setNotifications((items) => {
      const nextItems = updater(items);
      persistArray(notificationsStorageKey, nextItems);
      return nextItems;
    });
  };

  const updateChatThreads = (updater: (items: ChatItem[]) => ChatItem[]) => {
    setChatThreads((items) => {
      const nextItems = updater(items);
      persistArray(chatsStorageKey, nextItems);
      return nextItems;
    });
  };

  const findSearchTarget = (item: SearchItem) => {
    if (item.selector) {
      const selectedTarget = document.querySelector<HTMLElement>(item.selector);
      if (selectedTarget) return selectedTarget;
    }

    const targetTerms = [item.label, item.description, ...item.keywords]
      .map(normalizeArabicSearch)
      .filter((term) => term.length >= 2);

    return Array.from(
      document.querySelectorAll<HTMLElement>(
        'h1, h2, h3, button, [role="tab"], [data-search-label], [aria-label]',
      ),
    ).find((element) => {
      const text = [
        element.dataset.searchLabel,
        element.getAttribute('aria-label'),
        element.textContent,
      ]
        .filter(Boolean)
        .join(' ');
      const normalizedText = normalizeArabicSearch(text);
      if (!normalizedText) return false;

      return targetTerms.some((term) => normalizedText.includes(term) || term.includes(normalizedText));
    });
  };

  const scrollToSearchTarget = (item: SearchItem, attempt = 0) => {
    const target = findSearchTarget(item);

    if (!target && attempt < 8) {
      window.setTimeout(() => scrollToSearchTarget(item, attempt + 1), 120);
      return;
    }

    const fallbackTarget = document.querySelector<HTMLElement>('main, [data-main-content], .overflow-hidden');
    const destination = target || fallbackTarget;

    if (target && (target.tagName === 'BUTTON' || target.getAttribute('role') === 'tab')) {
      target.click();
    }

    window.setTimeout(() => {
      destination?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      if (target) target.focus({ preventScroll: true });
      setPendingSearchItem(null);
    }, target ? 80 : 0);
  };

  useEffect(() => {
    setUserPermissions(readStoredPermissions());
    setNotifications(readStoredArray(notificationsStorageKey, initialNotifications));
    setChatThreads(readStoredArray(chatsStorageKey, initialChats));
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideHeaderAction = headerActionsRef.current?.contains(target);
      const isInsideOverlay = [
        searchPopoverRef.current,
        notificationPopoverRef.current,
        userPopoverRef.current,
        messagesPopoverRef.current,
      ].some((element) => element?.contains(target));

      if (!isInsideHeaderAction && !isInsideOverlay) {
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
  }, [openOverlay, userPermissions]);

  useEffect(() => {
    if (!pendingSearchItem) return;

    const timeoutId = window.setTimeout(() => {
      scrollToSearchTarget(pendingSearchItem);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [navigationState.activeSection, pendingSearchItem]);

  useEffect(() => {
    if (!['search', 'notifications', 'user'].includes(openOverlay || '')) return;

    const updateMenuPositions = () => {
      if (openOverlay === 'search') {
        setSearchMenuPosition(getAnchoredMenuPosition(searchButtonRef.current, searchMenuWidth, 'end'));
      }

      if (openOverlay === 'notifications') {
        setNotificationMenuPosition(getAnchoredMenuPosition(notificationButtonRef.current, notificationMenuWidth, 'end'));
      }

      if (openOverlay === 'user') {
        setUserMenuPosition(getAnchoredMenuPosition(userButtonRef.current, userMenuWidth, 'start'));
      }
    };

    updateMenuPositions();
    window.addEventListener('resize', updateMenuPositions);
    window.addEventListener('scroll', updateMenuPositions, true);

    return () => {
      window.removeEventListener('resize', updateMenuPositions);
      window.removeEventListener('scroll', updateMenuPositions, true);
    };
  }, [openOverlay]);

  const openOnly = (overlay: HeaderOverlay) => {
    if (overlay === 'search') {
      setSearchMenuPosition(getAnchoredMenuPosition(searchButtonRef.current, searchMenuWidth, 'end'));
      window.setTimeout(() => {
        setSearchMenuPosition(getAnchoredMenuPosition(searchButtonRef.current, searchMenuWidth, 'end'));
      }, 320);
    }

    if (overlay === 'notifications') {
      setNotificationMenuPosition(getAnchoredMenuPosition(notificationButtonRef.current, notificationMenuWidth, 'end'));
      updateNotifications((items) => items.map((item) => ({ ...item, isNew: false })));
    }

    if (overlay === 'messages') {
      updateChatThreads((items) => items.map((chat) => (chat.id === selectedChatId ? { ...chat, unread: false } : chat)));
    }

    if (overlay === 'user') {
      setUserMenuPosition(getAnchoredMenuPosition(userButtonRef.current, userMenuWidth, 'start'));
    }

    setOpenOverlay((current) => (current === overlay ? null : overlay));
  };

  const handleRefresh = () => {
    const refreshedAt = nowIso();
    setOpenOverlay(null);
    setIsRefreshing(true);
    setVisibleSearchItems(getVisibleSearchItems(userPermissions));
    window.dispatchEvent(
      new CustomEvent('soabra:refresh-current-section', {
        detail: {
          section: navigationState.activeSection,
          timestamp: Date.now(),
        },
      }),
    );
    window.dispatchEvent(new Event('focus'));
    setActiveSection(navigationState.activeSection);
    updateNotifications((items) => [
      {
        id: createId('refresh'),
        text: `تم تحديث قسم ${navigationState.activeSection}`,
        type: 'app',
        isNew: true,
        createdAt: refreshedAt,
      },
      ...items,
    ].slice(0, 12));
    window.setTimeout(() => setIsRefreshing(false), 650);
  };

  const handleSearchSelect = (item: SearchItem) => {
    if (item.section) setActiveSection(item.section);
    setOpenOverlay(null);
    setSearchValue('');
    setPendingSearchItem(item);
  };

  const handleDeleteNotification = (id: string) => {
    updateNotifications((items) => items.filter((item) => item.id !== id));
  };

  const handleClearNotifications = () => {
    updateNotifications(() => []);
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

  const handleLogout = async () => {
    setOpenOverlay(null);
    await signOut();
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setShowChatList(false);
    updateChatThreads((items) => items.map((chat) => (chat.id === chatId ? { ...chat, unread: false } : chat)));
  };

  const handleSendMessage = () => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) return;

    const sentAt = nowIso();
    updateChatThreads((items) =>
      items.map((chat) => {
        if (chat.id !== selectedChatId) return chat;

        return {
          ...chat,
          preview: trimmedMessage,
          messages: [
            ...chat.messages,
            {
              id: createId('message'),
              text: trimmedMessage,
              sender: 'me',
              sentAt,
            },
          ],
        };
      }),
    );
    updateNotifications((items) => [
      {
        id: createId('message-sent'),
        text: `تم إرسال رسالة إلى ${selectedChat.name}`,
        type: 'message',
        isNew: true,
        createdAt: sentAt,
      },
      ...items,
    ].slice(0, 12));
    setMessageText('');
  };

  return (
    <header data-testid="app-header" className="fixed top-0 right-0 left-0 h-[60px] my-0 py-[65px] px-[5px] bg-slate-100" style={{ zIndex: 'var(--z-header)' }}>
      <div className="flex items-center justify-between h-full px-0">
        <div className="text-right ml-4 mx-[5px] flex items-center">
          {!imageError ? (
            <img
              src="/lovable-uploads/9a8b8ed4-b3d6-4ecf-b62c-e6c1eba8c3d4.png"
              alt="SoaBra Logo"
              className="h-12 w-auto object-contain transition-opacity duration-300"
              onError={() => setImageError(true)}
              onLoad={() => setImageLoaded(true)}
              style={{
                opacity: imageLoaded ? 1 : 0.7,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            />
          ) : (
            <div>
              <span className="text-soabra-text-primary font-bold text-lg font-arabic">
                SoaBra
              </span>
            </div>
          )}
        </div>

        <div className="flex-1" />

        <div ref={headerActionsRef} className="relative flex items-center gap-0 px-0 mx-0">
          <div ref={searchButtonRef} className="relative p-2">
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

            {canUsePortal &&
              createPortal(
                <AnimatePresence>
                  {openOverlay === 'search' && filteredSearchItems.length > 0 && (
                    <motion.div
                      ref={searchPopoverRef}
                      initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      data-testid="header-search-popover"
                      className="fixed max-h-[430px] w-[270px] overflow-y-auto rounded-[26px] p-2"
                      style={{
                        ...glassStyle,
                        top: searchMenuPosition.top,
                        left: searchMenuPosition.left,
                        zIndex: 'var(--z-popover)',
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        {filteredSearchItems.map((item) => (
                          <button
                            key={item.id}
                            type="button"
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
                </AnimatePresence>,
                document.body,
              )}
          </div>

          <button type="button" className={iconButtonClass} onClick={handleRefresh} aria-label="تحديث">
            <div className={iconCircleClass}>
              <RefreshCcw className={`w-[20px] h-[20px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : ''}`} />
            </div>
          </button>

          <div ref={notificationButtonRef} className="relative">
            <button
              type="button"
              className={iconButtonClass}
              onClick={() => openOnly('notifications')}
              aria-label="الإشعارات"
            >
              <div className={`${iconCircleClass} relative`}>
                <span className="relative flex h-[20px] w-[20px] items-center justify-center">
                  <Bell className="w-[20px] h-[20px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
                  {hasNewNotifications && (
                    <span className="absolute right-0 top-0 h-1.5 w-1.5 translate-x-1 -translate-y-0.5 rounded-full bg-red-500" />
                  )}
                </span>
              </div>
            </button>

            {canUsePortal &&
              createPortal(
                <AnimatePresence>
                  {openOverlay === 'notifications' && (
                    <motion.div
                      ref={notificationPopoverRef}
                      initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      data-testid="header-notifications-popover"
                      className="fixed w-[320px] rounded-[28px] p-3"
                      style={{
                        ...glassStyle,
                        top: notificationMenuPosition.top,
                        left: notificationMenuPosition.left,
                        zIndex: 'var(--z-popover)',
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between px-2">
                        <span className="text-sm font-medium text-black">الإشعارات</span>
                        {notifications.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearNotifications}
                            className="rounded-full px-2 py-1 text-xs text-[#3e494c] transition hover:bg-white/70"
                          >
                            مسح الكل
                          </button>
                        )}
                      </div>
                      <div className="max-h-[300px] overflow-y-auto pl-1">
                        {notifications.length === 0 ? (
                          <div className="px-3 py-4 text-center text-sm text-black">لا توجد إشعارات</div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                dir="rtl"
                                className="flex min-h-[58px] items-center gap-2 rounded-3xl bg-white/55 px-3 py-2 transition hover:bg-white/75"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-gray-300 transition hover:bg-white hover:text-gray-400 active:scale-95"
                                  aria-label="حذف الإشعار"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <div className="min-w-0 flex-1 text-right">
                                  <span dir="rtl" className="block text-sm text-black">
                                    {notification.text}
                                  </span>
                                  <span className="block text-xs text-[#3e494c]/60">{formatTime(notification.createdAt)}</span>
                                </div>
                                <span
                                  className={`h-2 w-2 flex-shrink-0 rounded-full ${notificationColors[notification.type]}`}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>,
                document.body,
              )}
          </div>

          <div className="relative">
            <button type="button" className={iconButtonClass} onClick={() => openOnly('messages')} aria-label="الرسائل">
              <div className={`${iconCircleClass} relative`}>
                <MessageCircle className="w-[20px] h-[20px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
                {hasUnreadMessages && (
                  <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-red-500" />
                )}
              </div>
            </button>
          </div>

          <div ref={userButtonRef} className="relative">
            <button type="button" className={iconButtonClass} onClick={() => openOnly('user')} aria-label="المستخدم">
              <div className={iconCircleClass}>
                <User className="w-[20px] h-[20px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </button>

            {canUsePortal &&
              createPortal(
                <AnimatePresence>
                  {openOverlay === 'user' && (
                    <motion.div
                      ref={userPopoverRef}
                      initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      data-testid="header-user-popover"
                      className="fixed w-56"
                      style={{
                        top: userMenuPosition.top,
                        left: userMenuPosition.left,
                        zIndex: 'var(--z-popover)',
                      }}
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
                </AnimatePresence>,
                document.body,
              )}
          </div>
        </div>
      </div>

      {canUsePortal &&
        createPortal(
          <AnimatePresence>
            {openOverlay === 'messages' && (
              <motion.div
                ref={messagesPopoverRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                data-testid="header-messages-popover"
                className="fixed inset-0 flex items-center justify-center bg-[#2A3437]/35 p-4 backdrop-blur-md"
                style={{ zIndex: 'var(--z-modal-backdrop)' }}
                onMouseDown={() => setOpenOverlay(null)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.98, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 18, scale: 0.98, filter: 'blur(8px)' }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  className="w-[min(860px,calc(100vw-32px))] rounded-[30px] p-4 md:p-6"
                  style={{ ...glassStyle, zIndex: 'var(--z-modal-content)' }}
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
                        {chatThreads.map((chat) => (
                          <button
                            key={chat.id}
                            type="button"
                            onClick={() => handleChatSelect(chat.id)}
                            className={`rounded-3xl px-3 py-3 text-right transition hover:bg-white/75 active:scale-[0.98] ${
                              selectedChatId === chat.id ? 'bg-white/80' : 'bg-white/40'
                            }`}
                          >
                            <span className="flex items-center justify-between gap-2 text-sm font-medium text-black">
                              {chat.unread ? <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> : <span />}
                              <span className="truncate">{chat.name}</span>
                            </span>
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
                        {selectedChat.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`w-fit max-w-[82%] rounded-3xl px-4 py-2 text-sm text-black ${
                              message.sender === 'me' ? 'mr-auto bg-white/80' : 'bg-[#dfeaf0]'
                            }`}
                          >
                            <span className="block">{message.text}</span>
                            <span className="mt-1 block text-[10px] text-[#3e494c]/60">{formatTime(message.sentAt)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 border-t border-black/10 p-3">
                        <input
                          value={messageText}
                          onChange={(event) => setMessageText(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') handleSendMessage();
                          }}
                          placeholder="اكتب رسالة"
                          className="min-w-0 flex-1 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-right text-sm text-black outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                          className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm text-white transition hover:bg-black/80 active:scale-95 disabled:cursor-not-allowed disabled:bg-black/40"
                        >
                          <Send className="h-4 w-4" />
                          إرسال
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
};

export default HeaderBar;
