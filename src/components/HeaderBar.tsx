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
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
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

const notificationMenuWidth = 320;
const searchMenuWidth = 270;
const userMenuWidth = 224;
const notificationViewportGap = 12;

const getAnchoredMenuPosition = (
  anchor: HTMLElement | null,
  width: number,
  align: 'start' | 'end' = 'end',
) => {
  if (!anchor || typeof window === 'undefined') return { top: 0, left: 0 };

  const rect = anchor.getBoundingClientRect();
  const maxLeft = Math.max(notificationViewportGap, window.innerWidth - width - notificationViewportGap);
  const preferredLeft = align === 'start' ? rect.left : rect.right - width;
  const left = Math.min(Math.max(preferredLeft, notificationViewportGap), maxLeft);

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
    id: 'customers-box',
    label: 'صندوق العملاء',
    description: 'بطاقات العملاء وبياناتهم المرتبطة بالمشاريع',
    section: 'home',
    keywords: ['صندوق العملاء', 'بطاقات العملاء', 'بيانات العميل', 'عميل'],
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
    id: 'add-task-modal',
    label: 'نافذة إضافة مهمة',
    description: 'نافذة إنشاء مهمة جديدة داخل المشروع',
    section: 'planning',
    keywords: ['إضافة مهمة', 'اضافة مهمة', 'مهمة جديدة', 'نافذة مهمة'],
    requiredPermissions: ['planning:view'],
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
  app: 'bg-[#BDEED3]',
  message: 'bg-[#A4E2F6]',
  task: 'bg-[#FBE2AA]',
  alert: 'bg-[#D9D2FE]',
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
  'project-basic-info',
  'project-customer-info',
  'project-tasks-tab',
  'project-partnerships-tab',
  'project-contract-tab',
  'task-box',
  'customers-box',
  'add-task-modal',
  'departments',
  'planning',
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
  const [selectedChatId, setSelectedChatId] = useState(chats[0].id);
  const [showChatList, setShowChatList] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasOpenedNotifications, setHasOpenedNotifications] = useState(false);
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

  const hasNewNotifications = !hasOpenedNotifications && notifications.some((notification) => notification.isNew);
  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || chats[0];
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

    if (openOverlay === 'notifications') {
      setHasOpenedNotifications(true);
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

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const openOnly = (overlay: HeaderOverlay) => {
    if (overlay === 'search') {
      setSearchMenuPosition(getAnchoredMenuPosition(searchButtonRef.current, searchMenuWidth, 'end'));
    }

    if (overlay === 'notifications') {
      setNotificationMenuPosition(getAnchoredMenuPosition(notificationButtonRef.current, notificationMenuWidth, 'end'));
    }

    if (overlay === 'user') {
      setUserMenuPosition(getAnchoredMenuPosition(userButtonRef.current, userMenuWidth, 'start'));
    }

    setOpenOverlay((current) => (current === overlay ? null : overlay));
  };

  const handleRefresh = () => {
    setOpenOverlay(null);
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
  };

  const handleSearchSelect = (item: SearchItem) => {
    if (item.section) setActiveSection(item.section);
    setOpenOverlay(null);
    setSearchValue('');
    setPendingSearchItem(item);
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

  const handleLogout = async () => {
    setOpenOverlay(null);
    await signOut();
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
    <header data-testid="app-header" className="fixed top-0 right-0 left-0 h-[60px] my-0 py-[65px] px-[5px] bg-slate-100" style={{ zIndex: 'var(--z-header)' }}>
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
              <RefreshCcw className="w-[20px] h-[20px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
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
                      <div className="max-h-[300px] overflow-y-auto pl-1">
                        {notifications.length === 0 ? (
                          <div className="px-3 py-4 text-center text-sm text-black">لا توجد إشعارات</div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                dir="rtl"
                                className="flex min-h-[52px] items-center gap-2 rounded-3xl bg-white/55 px-3 py-2 transition hover:bg-white/75"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-gray-300 transition hover:bg-white hover:text-gray-400 active:scale-95"
                                  aria-label="حذف الإشعار"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <span dir="rtl" className="flex-1 text-right text-sm text-black">
                                  {notification.text}
                                </span>
                                <span
                                  className={`h-2 w-2 flex-shrink-0 rounded-full ${notificationColors[notification.type]}`}
                                />
                                {notification.isNew && (
                                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                                )}
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
              <div className={iconCircleClass}>
                <MessageCircle className="w-[20px] h-[20px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
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
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
};

export default HeaderBar;
