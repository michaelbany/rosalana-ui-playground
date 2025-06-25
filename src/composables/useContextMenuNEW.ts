import { reactive, type Reactive } from "vue";

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

const menuMap = new WeakMap<HTMLElement | {}, Reactive<ContextMenu[]>>();
const defaultItems = reactive<ContextMenu[]>([
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
]);

menuMap.set({}, defaultItems);

export function useContextMenuNew(reference: HTMLElement | null) {
  const bubbled = bubble(reference);
  const menu = getMenu(bubbled);

  return {
    menu,
    restore: () => {
      if (reference) {
        menuMap.set(reference, reactive<ContextMenu[]>([...defaultItems]));
      }
      return useContextMenuNew(reference);
    },
    set: (items: ContextMenu[]) => {
      if (reference) {
        menuMap.set(reference, reactive<ContextMenu[]>(items));
      }
      return useContextMenuNew(reference);
    },
    update: (fn: (items: ContextMenu[]) => ContextMenu[]) => {
      menuMap.set(reference || {}, reactive<ContextMenu[]>(fn(menu)));
    },
  };
}

/** Helpers */
function bubble(reference: HTMLElement | null): HTMLElement | {} | null {
  if (!reference) return {};

  let current: HTMLElement | null = reference;

  while ((current && !menuMap.has(current)) || current === document.body) {
    if (current.dataset?.preventContextMenu !== undefined) {
      return null;
    }
    current = current.parentElement;
  }

  return current || {};
}

function getMenu(reference: HTMLElement | null | {}): Reactive<ContextMenu[]> {
  if (reference === null) {
    return reactive<ContextMenu[]>([]);
  } else {
    return (reference && menuMap.get(reference)) || menuMap.get({})!;
  }
}
