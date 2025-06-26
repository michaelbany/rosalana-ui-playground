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
};

type Data = { items: () => ContextMenu[]; prevent: boolean };

const menuMap = new WeakMap<HTMLElement | {}, Data>();

const defaultKey = {};

const defaultItems = () => [
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
