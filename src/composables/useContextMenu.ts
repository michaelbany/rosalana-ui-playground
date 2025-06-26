export type ContextMenu = {
  title?: string;
  icon?: string;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
  divider?: boolean;
  label?: string;
  items?: ContextMenu[];
  selected?: boolean;
  checked?: boolean;
  class?: string;
};

type Data = { items: () => ContextMenu[]; prevent: boolean };

const menuMap = new WeakMap<HTMLElement | {}, Data>();

const defaultKey = {};

const defaultItems = () => [
  { label: "Menu" },
  { divider: true },
  { title: "Open", icon: "lucide:folder", shortcut: "⌘O" },
  { title: "Save", icon: "lucide:save", shortcut: "⌘S" },
  { title: "Export", icon: "lucide:upload", shortcut: "⇧⌘E" },
  { divider: true },
  { title: "Edit", icon: "ph:pencil", shortcut: "⌘E" },
  {
    title: "Share",
    icon: "lucide:share-2",
    items: [
      { title: "Email", icon: "lucide:mail", shortcut: "⌘M" },
      { title: "Slack", icon: "logos:slack-icon", shortcut: "⌘L" },
      { title: "Copy Link", icon: "lucide:link-2", shortcut: "⌘C" },
    ],
  },
  { divider: true },
  { title: "Preferences", icon: "lucide:settings", shortcut: "⌘," },
  { title: "Help", icon: "lucide:circle-help", shortcut: "F1" },
  { divider: true },
  { title: "Log out", icon: "lucide:log-out", shortcut: "⇧⌘Q" },
];

menuMap.set(defaultKey, { items: defaultItems, prevent: false });

export function useContextMenu(reference: HTMLElement | null) {
  const bubbled = bubble(reference);
  const menu = getMenu(bubbled);

  return {
    menu,
    restore: () => {
      if (reference) {
        menuMap.set(reference, { items: defaultItems, prevent: false });
      }
      return useContextMenu(reference);
    },
    set: (items: () => ContextMenu[]) => {
      if (reference) {
        menuMap.set(reference, { items, prevent: false });
      }
      return useContextMenu(reference);
    },
    update: (fn: (items: ContextMenu[]) => ContextMenu[]) => {
      if (!reference) return;

      menuMap.set(reference, {
        items: () => fn(menu.items()),
        prevent: false,
      });

      return useContextMenu(reference);
    },
    prevent: (value = true) => {
      if (reference) {
        menuMap.set(reference, { items: menu.items, prevent: value });
      }

      return useContextMenu(reference);
    },
  };
}

/** Helpers */
function bubble(reference: HTMLElement | null): HTMLElement | {} | null {
  if (!reference) return defaultKey;

  let current: HTMLElement | null = reference;

  while ((current && !menuMap.has(current)) || current === document.body) {
    if (current.dataset?.preventContextMenu !== undefined) {
      return null;
    }
    current = current.parentElement;
  }

  return current || defaultKey;
}

function getMenu(reference: HTMLElement | null | {}): Data {
  if (reference === null) {
    return { items: () => [], prevent: true };
  } else {
    return (reference && menuMap.get(reference)) || menuMap.get(defaultKey)!;
  }
}
