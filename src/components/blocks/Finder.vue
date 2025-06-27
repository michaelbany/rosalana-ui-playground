<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Folder } from "../ui/folder/Folder.vue";
import FolderComponent from "../ui/folder/Folder.vue";
import DocumentComponent, { type Document } from "../ui/document/Document.vue";
import UiInput from "../ui/input/UiInput.vue";
import { useContextMenu } from "@/composables/useContextMenu";
import FrameSelection from "../ui/selection/FrameSelection.vue";
import FrameSelectionItem from "../ui/selection/FrameSelectionItem.vue";
import { useSelect } from "@/composables/useSelect";

export type FinderColor = "blue" | "green" | "red" | "orange" | "gray";
export type FinderSize = "sm" | "md" | "lg";

export type FolderOrDocument =
  | {
      type: "folder";
      color?: FinderColor;
      item: Folder;
      tags?: FinderTag[];
    }
  | {
      type: "document";
      color?: FinderColor;
      item: Document;
      tags?: FinderTag[];
    }
  | { type: "empty"; item: null };

export type FinderTag = {
  name: string;
  color: FinderColor;
  icon?: string;
};

const props = withDefaults(
  defineProps<{
    items: FolderOrDocument[];
    selected?: FolderOrDocument[];
    preventSelect?: boolean;
  }>(),
  {
    items: () => [],
  }
);

const emit = defineEmits(["select", "click"]);

const items = computed(() => {
  const filtered = props.items.filter((item) => {
    if (search.value.trim() === "") return true;

    const searchLower = search.value.toLowerCase();
    if (item.type === "folder") {
      return item.item.name.toLowerCase().includes(searchLower);
    } else if (item.type === "document") {
      return item.item.name.toLowerCase().includes(searchLower);
    }
  });

  const filteredLength = props.items.length - filtered.length;

  if (filteredLength > 0) {
    const emptyItems: FolderOrDocument[] = Array.from(
      { length: filteredLength },
      () => ({ type: "empty", item: null })
    );

    filtered.push(...emptyItems);
  }

  return filtered;
});

const search = ref("");
const size = ref<"sm" | "md" | "lg">("md");
const color = ref<"blue" | "green" | "red" | "orange" | "gray">("blue");

const { selected, select, setSelected, clear, isSelected } =
  useSelect<FolderOrDocument>(items);

const handleCursorSelection = (selection: any) => {
  if (props.preventSelect) return;

  const { selectedKeys } = selection;

  const items = props.items.filter((item) =>
    selectedKeys.includes(`${item.type}-${item.item?.id}`)
  );

  setSelected(items);
  emit("select", selected.value);
};

const isFrameSelecting = ref(false);

const handleSelectItem = (item: FolderOrDocument, e: PointerEvent) => {
  if (item.type === "empty") return; // Ignorovat prázdné položky

  if (e.shiftKey) {
    select(item, 'shift');
  } else if (e.ctrlKey || e.metaKey) {
    select(item, 'ctrl');
  } else {
    select(item);
  }
  
  emit("select", selected.value);
};

const handleDeselect = () => {
  if (isFrameSelecting.value) return;
  clear();
  emit("select", selected.value);
};

const gridSize = computed(() => {
  switch (size.value) {
    case "sm":
      return "grid-cols-[repeat(auto-fit,120px)]";
    case "md":
      return "grid-cols-[repeat(auto-fit,150px)]";
    case "lg":
      return "grid-cols-[repeat(auto-fit,180px)]";
    default:
      return "grid-cols-[repeat(auto-fit,150px)]";
  }
});

const finderRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (finderRef.value) {
    useContextMenu(finderRef.value).set(() => [
      { label: "Finder" },
      { divider: true },
      { title: "New Folder", icon: "lucide:folder-plus", shortcut: "⌘N" },
      { title: "New Document", icon: "lucide:file-plus", shortcut: "⌘D" },
      { divider: true },
      { title: "Refresh", icon: "lucide:refresh-cw", shortcut: "F5" },
      { title: "Settings", icon: "lucide:settings", shortcut: "⌘," },
    ]);
  }
});
</script>
<template>
  <div class="w-full" data-prevent-context-menu>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold mb-4">Folders</h2>
      <div class="space-x-2">
        <select v-model="size" class="border rounded p-2">
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
        <select v-model="color" class="border rounded p-2">
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="gray">Gray</option>
        </select>
      </div>
    </div>

    <UiInput
      class="mb-4 w-min text-sm"
      placeholder="Search..."
      :aria-label="'Search documents and folders'"
      v-model="search"
      name="search"
      autocomplete="off"
    />

    <FrameSelection
      @selecting="(ref) => (isFrameSelecting = ref)"
      @update:selection="handleCursorSelection"
      :disabled="props.preventSelect"
    >
      <div
        v-if="items.length > 0 && !items.every((item) => item.type === 'empty')"
        class="grid gap-4 justify-between w-full"
        ref="finderRef"
        :class="gridSize"
        @click="handleDeselect"
      >
        <template v-for="item in items" :key="item?.item?.id">
          <FrameSelectionItem :selection-key="`${item.type}-${item.item?.id}`">
            <FolderComponent
              v-if="item.type === 'folder'"
              :folder="item.item"
              :color="item.color || color"
              :size="size"
              :tags="item.tags || []"
              :selected="isSelected(item)"
              @select="(e) => handleSelectItem(item, e)"
              @click="emit('click', item.item)"
              :prevent-select="props.preventSelect"
            />
            <DocumentComponent
              v-else-if="item.type === 'document'"
              :document="item.item"
              :size="size"
              :color="item.color || color"
              :tags="item.tags || []"
              :selected="isSelected(item)"
              @select="(e) => handleSelectItem(item, e)"
              @click="emit('click', item.item)"
              :prevent-select="props.preventSelect"
            />
            <div v-else class="pointer-events-none select-none w-full" />
          </FrameSelectionItem>
        </template>
      </div>
      <div
        v-else
        class="text-center text-sm text-gray-400 my-8 w-full"
        @click="handleDeselect"
      >
        No items found.
      </div>
    </FrameSelection>
  </div>
</template>
