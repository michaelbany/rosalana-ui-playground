export type ContextMenu = {
  title?: string;
  icon?: string;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
  divider?: boolean;
  label?: string;
  items?: ContextMenu[];
};

type Data = { items: ContextMenu[]; prevent: boolean };
const contextMenuState = new WeakMap<HTMLElement | {}, Data>();

const defaultKey = {};

const defaultItems: ContextMenu[] = [
  { label: "Main Menu" },
  { divider: true },
  { title: "Open", icon: "ph:folder-open", shortcut: "⌘O" },
  { title: "Save", icon: "ph:floppy-disk", shortcut: "⌘S" },
  { title: "Export", icon: "ph:export", shortcut: "⇧⌘E" },
  { divider: true },
  { title: "Edit", icon: "ph:pencil", shortcut: "⌘E" },
  {
    title: "Share",
    icon: "ph:share-network",
    items: [
      { title: "Email", icon: "ph:envelope", shortcut: "⌘M" },
      { title: "Slack", icon: "logos:slack", shortcut: "⌘L" },
      { title: "Copy Link", icon: "ph:link", shortcut: "⌘C" },
    ],
  },
  { divider: true },
  { title: "Preferences", icon: "ph:gear", shortcut: "⌘," },
  { title: "Help", icon: "ph:question", shortcut: "F1" },
  { divider: true },
  { title: "Log out", icon: "ph:sign-out", shortcut: "⇧⌘Q" },
];

contextMenuState.set(defaultKey, { items: defaultItems, prevent: false });

export function useContextMenu(reference: HTMLElement | null) {
  const bubbleReference = (
    ref: HTMLElement | null
  ): HTMLElement | {} | null => {
    if (!ref) return defaultKey;
    let current: HTMLElement | null = ref;
    while (
      (current && !contextMenuState.has(current)) ||
      current === document.body
    ) {
      if (current.dataset?.preventContextMenu !== undefined) {
        return null;
      }
      current = current.parentElement;
    }
    return current || defaultKey;
  };

  const getOrDefault = (ref: HTMLElement | null): Data => {
    const bubbleRef = bubbleReference(ref);
    if (bubbleRef === null) {
      return { items: [], prevent: true };
    } else {
      return (
        (bubbleRef && contextMenuState.get(bubbleRef)) ||
        contextMenuState.get(defaultKey)!
      );
    }
  };

  const get = () => getOrDefault(reference);

  const set = (items: ContextMenu[]) => {
    if (reference) contextMenuState.set(reference, { items, prevent: false });
  };

  const setDefault = () => {
    if (reference)
      contextMenuState.set(reference, { items: defaultItems, prevent: false });
  };

  const prevent = (value = true) => {
    if (!reference) return;
    const { items } = getOrDefault(reference);
    contextMenuState.set(reference, { items, prevent: value });
  };

  const unsubscribe = () => {
    if (reference) contextMenuState.delete(reference);
  };

  return {
    get,
    set,
    setDefault,
    prevent,
    unsubscribe,
  };
}

export function isInputLike (el: EventTarget | null): el is HTMLInputElement | HTMLTextAreaElement | HTMLDivElement {
  return !!el && (
    (el as HTMLElement).isContentEditable ||
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement
  )
}

/** prototype */
const recreatedNative: ContextMenu[] = [
  /* ---------- Navigace ---------- */
  {
    title   : 'Back',
    icon    : 'lucide:chevron-left',
    shortcut: '⌘[',
    disabled: window.history.state === null,
    action  : () => window.history.back()
  },
  {
    title   : 'Forward',
    icon    : 'lucide:chevron-right',
    shortcut: '⌘]',
    disabled: window.history.length < 2,
    action  : () => window.history.forward()
  },
  {
    title   : 'Reload',
    icon    : 'ph:arrow-clockwise-bold',
    shortcut: '⌘R',
    action  : () => location.reload()
  },

  { divider: true },

  /* ---------- Stránka ---------- */
  {
    title: 'Save page as…',
    icon : 'ph:floppy-disk',
    shortcut: '⌘S',
    action: () => document.execCommand?.('save')   // některé prohlížeče
  },
  {
    title   : 'Print…',
    icon    : 'ph:printer',
    shortcut: '⌘P',
    action  : () => window.print()
  },
  {
    title: 'View page source',
    icon : 'ph:code',
    shortcut: '⌥⌘U',
    action: () => location.href = 'view-source:' + location.href
  },

  { divider: true },

  /* ---------- Clipboard ---------- */
  {
    title   : 'Cut',
    icon    : 'ph:scissors',
    shortcut: '⌘X',
    disabled: !isInputLike(document.activeElement),
    action  : () => document.execCommand?.('cut')
  },
  {
    title   : 'Copy',
    icon    : 'ph:copy',
    shortcut: '⌘C',
    disabled: !window.getSelection()?.toString(),
    action  : () => navigator.clipboard.writeText(window.getSelection()!.toString())
  },
  {
    title   : 'Paste',
    icon    : 'ph:clipboard',
    shortcut: '⌘V',
    disabled: !isInputLike(document.activeElement),
    action  : async () => {
      const text = await navigator.clipboard.readText()
      const el   = document.activeElement as HTMLInputElement
      if (isInputLike(el)) document.execCommand?.('insertText', false, text)
    }
  },

  { divider: true },

  /* ---------- Vývojářské ---------- */
  ...(import.meta.env.DEV
    ? [{
        title   : 'Inspect element',
        icon    : 'ph:brackets-angle',
        shortcut: '⌥⌘I',
        action  : () => { /* noop – v Chromu F12 */ }
      }] as ContextMenu[]
    : [])
]

