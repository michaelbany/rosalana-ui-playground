
export type ContextMenuItem = {
  title?: string;
  icon?: string;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
  divider?: boolean;
  label?: string;
  items?: ContextMenuItem[];
};

export function useContextMenu(
  reference: (HTMLElement | null),
  items: ContextMenuItem[]
) {
  console.log(reference);
}
