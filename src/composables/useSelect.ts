import { ref, type Ref } from "vue";

export function useSelect<T>(items: Ref<T[]>) {
  const selected: Ref<T[]> = ref([]);
  let lastSelectedIndex: number = -1;

  function select(
    item: T,
    options: { shiftKey?: boolean; ctrlKey?: boolean } = {}
  ) {
    if (options.shiftKey) {
      try {
        range(item);
        console.log("[useSelect]: Shift key pressed");
      } catch (error) {
        toggle(item);
      }
    } else if (options.ctrlKey) {
      console.log("[useSelect]: Ctrl key pressed");
      toggle(item, true);
    } else {
      console.log("[useSelect]: No key pressed");
      toggle(item);
    }

    lastSelectedIndex = items.value.indexOf(item);
    if (lastSelectedIndex === -1) {
      console.warn("[useSelection]: Item not found in the list");
    }
  }

  function toggle(item: T, multiselect: boolean = false) {
    if (multiselect) {
      const index = selected.value.indexOf(item);
      if (index > -1) {
        selected.value.splice(index, 1);
      } else {
        selected.value.push(item);
      }
    } else {
      selected.value = [item];
    }
  }

  function range(item: T) {
    const currentIndex = getIndex(item);
    const referenceIndex = lastSelectedIndex !== -1 ? lastSelectedIndex : 0;
    if (currentIndex === -1) return;
    if (referenceIndex === -1) throw new Error("no reference index found");

    const start = Math.min(referenceIndex, currentIndex);
    const end = Math.max(referenceIndex, currentIndex);
    selected.value = items.value.slice(start, end + 1);
  }

  function setSelected(items: T[]) {
    selected.value = items;
  }

  function getIndex(item: T): number {
    const index = items.value.indexOf(item);
    if (index === -1) {
      console.warn("[useSelect]: Item not found in the list");
    }
    return index;
  }

  function selectAll() {
    selected.value = [...items.value];
    lastSelectedIndex = -1;
  }

  function clear() {
    console.log("[useSelect]: Clearing selection");
    selected.value = [];
    lastSelectedIndex = -1;
  }

  function isSelected(item: T): boolean {
    return selected.value.includes(item);
  }

  return {
    selected,
    select,
    setSelected,
    selectAll,
    clear,
    isSelected,
  };
}
