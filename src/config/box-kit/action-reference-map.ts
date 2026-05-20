export type ActionButtonRef =
  | 'ACT-BTN-P01'
  | 'ACT-BTN-P02'
  | 'ACT-BTN-P03'
  | 'ACT-BTN-S01'
  | 'ACT-BTN-S02'
  | 'ACT-BTN-S03'
  | 'ACT-BTN-PSA01'
  | 'ACT-BTN-PSA02'
  | 'ACT-BTN-PSA03'
  | 'ACT-BTN-SSA01'
  | 'ACT-BTN-SSA02'
  | 'ACT-BTN-SSA03';

export type ActionMenuRef = 'ACT-MNU-W01' | 'ACT-MNU-B01';

export type ActionStatusRef =
  | 'ACT-STS-S01'
  | 'ACT-STS-S02'
  | 'ACT-STS-W01'
  | 'ACT-STS-W02'
  | 'ACT-STS-E01'
  | 'ACT-STS-E02'
  | 'ACT-STS-I01'
  | 'ACT-STS-I02'
  | 'ACT-STS-AN01'
  | 'ACT-STS-AN02'
  | 'ACT-STS-P01'
  | 'ACT-STS-SC01'
  | 'ACT-STS-O01';

export type ModalWindowRef = 'MDL-WND-D01';

export type ActionButtonFamily =
  | 'primary'
  | 'secondary'
  | 'primarySensitiveAction'
  | 'secondarySensitiveAction';

export type ActionButtonContent = 'iconAndText' | 'textOnly' | 'iconOnly';

export const ACTION_BUTTON_REFERENCE_MAP = {
  'ACT-BTN-P01': { family: 'primary', content: 'iconAndText', sensitive: false },
  'ACT-BTN-P02': { family: 'primary', content: 'textOnly', sensitive: false },
  'ACT-BTN-P03': { family: 'primary', content: 'iconOnly', sensitive: false },
  'ACT-BTN-S01': { family: 'secondary', content: 'iconAndText', sensitive: false },
  'ACT-BTN-S02': { family: 'secondary', content: 'textOnly', sensitive: false },
  'ACT-BTN-S03': { family: 'secondary', content: 'iconOnly', sensitive: false },
  'ACT-BTN-PSA01': { family: 'primarySensitiveAction', content: 'iconAndText', sensitive: true },
  'ACT-BTN-PSA02': { family: 'primarySensitiveAction', content: 'textOnly', sensitive: true },
  'ACT-BTN-PSA03': { family: 'primarySensitiveAction', content: 'iconOnly', sensitive: true },
  'ACT-BTN-SSA01': { family: 'secondarySensitiveAction', content: 'iconAndText', sensitive: true },
  'ACT-BTN-SSA02': { family: 'secondarySensitiveAction', content: 'textOnly', sensitive: true },
  'ACT-BTN-SSA03': { family: 'secondarySensitiveAction', content: 'iconOnly', sensitive: true },
} as const satisfies Record<ActionButtonRef, {
  family: ActionButtonFamily;
  content: ActionButtonContent;
  sensitive: boolean;
}>;

export const ACTION_MENU_REFERENCE_MAP = {
  'ACT-MNU-W01': { surface: 'glass', usage: 'window' },
  'ACT-MNU-B01': { surface: 'solid', usage: 'boardOrBox' },
} as const satisfies Record<ActionMenuRef, {
  surface: 'glass' | 'solid';
  usage: 'window' | 'boardOrBox';
}>;

export const ACTION_STATUS_REFERENCE_MAP = {
  'ACT-STS-S01': { variant: 'success', style: 'filled', background: '#bdeed3', foreground: '#000000' },
  'ACT-STS-S02': { variant: 'successOutline', style: 'outline', background: 'transparent', foreground: '#d9d2fd', border: '#d9d2fd' },
  'ACT-STS-W01': { variant: 'warning', style: 'filled', background: '#fbe2aa', foreground: '#000000' },
  'ACT-STS-W02': { variant: 'warningOutline', style: 'outline', background: 'transparent', foreground: '#fbe2aa', border: '#fbe2aa' },
  'ACT-STS-E01': { variant: 'error', style: 'filled', background: '#f1b5b9', foreground: '#000000' },
  'ACT-STS-E02': { variant: 'errorOutline', style: 'outline', background: 'transparent', foreground: '#f1b5b9', border: '#f1b5b9' },
  'ACT-STS-I01': { variant: 'info', style: 'filled', background: '#a4e2f6', foreground: '#000000' },
  'ACT-STS-I02': { variant: 'infoOutline', style: 'outline', background: 'transparent', foreground: '#a4e2f6', border: '#a4e2f6' },
  'ACT-STS-AN01': { variant: 'actionNed', style: 'filled', background: '#d9d2fd', foreground: '#000000' },
  'ACT-STS-AN02': { variant: 'actionNedOutline', style: 'outline', background: 'transparent', foreground: '#d9d2fd', border: '#d9d2fd' },
  'ACT-STS-P01': { variant: 'primary', style: 'filled', background: '#f8f9fa', foreground: '#000000', border: '#efefef' },
  'ACT-STS-SC01': { variant: 'secondary', style: 'filled', background: '#d9d2fd', foreground: '#000000' },
  'ACT-STS-O01': { variant: 'outline', style: 'outline', background: 'transparent', foreground: '#000000', border: '#000000' },
} as const satisfies Record<ActionStatusRef, {
  variant: string;
  style: 'filled' | 'outline';
  background: string;
  foreground: string;
  border?: string;
}>;

export const MODAL_WINDOW_REFERENCE_MAP = {
  'MDL-WND-D01': {
    family: 'standardDialogWindow',
    overlay: 'softDarkBlur',
    surface: 'cleanWhite',
    direction: 'rtl',
    usesWindowMenuRef: 'ACT-MNU-W01',
  },
} as const satisfies Record<ModalWindowRef, {
  family: 'standardDialogWindow';
  overlay: 'softDarkBlur';
  surface: 'cleanWhite';
  direction: 'rtl';
  usesWindowMenuRef: ActionMenuRef;
}>;

export function resolveLegacyActionButtonRef(options: {
  variant?: 'primary' | 'secondary';
  destructive?: boolean;
  hasIcon?: boolean;
  hasChildren?: boolean;
}): ActionButtonRef {
  const { variant = 'primary', destructive = false, hasIcon = false, hasChildren = true } = options;
  const family: ActionButtonFamily = destructive
    ? variant === 'primary'
      ? 'primarySensitiveAction'
      : 'secondarySensitiveAction'
    : variant === 'primary'
      ? 'primary'
      : 'secondary';

  const content: ActionButtonContent = hasIcon && hasChildren ? 'iconAndText' : hasIcon ? 'iconOnly' : 'textOnly';

  const match = Object.entries(ACTION_BUTTON_REFERENCE_MAP).find(([, value]) => value.family === family && value.content === content);
  return (match?.[0] as ActionButtonRef | undefined) ?? 'ACT-BTN-P02';
}

export function resolveLegacyActionMenuRef(surface: 'glass' | 'solid' = 'solid'): ActionMenuRef {
  return surface === 'glass' ? 'ACT-MNU-W01' : 'ACT-MNU-B01';
}

export function resolveLegacyActionStatusRef(tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'): ActionStatusRef {
  switch (tone) {
    case 'success':
      return 'ACT-STS-S01';
    case 'warning':
      return 'ACT-STS-W01';
    case 'danger':
      return 'ACT-STS-E01';
    case 'info':
      return 'ACT-STS-I01';
    case 'neutral':
    default:
      return 'ACT-STS-O01';
  }
}
