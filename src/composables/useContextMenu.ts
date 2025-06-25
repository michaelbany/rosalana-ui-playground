import { type Ref } from "vue";

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
  checked?: Ref<boolean> | boolean;
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
    reference: HTMLElement | null
  ): HTMLElement | {} | null => {
    if (!reference) return defaultKey;
    let current: HTMLElement | null = reference;
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

  const getOrDefault = (reference: HTMLElement | null): Data => {
    const bubbleRef = bubbleReference(reference);
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
    // const reactiveItems = Array.isArray(items) ? ref(items) : items;
    if (reference)
      contextMenuState.set(reference, { items, prevent: false });
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
