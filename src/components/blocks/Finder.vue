<script setup lang="ts">
import { computed, ref } from "vue";
import type { Folder } from "../ui/folder/Folder.vue";
import FolderComponent from "../ui/folder/Folder.vue";
import DocumentComponent, { type Document } from "../ui/document/Document.vue";
import UiInput from "../ui/input/UiInput.vue";

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
}

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

const selectedItems = ref<FolderOrDocument[]>([]);

const lastClickedItem = ref<FolderOrDocument | null>(null);

const handleSelectItem = (item: FolderOrDocument, e: PointerEvent) => {
  if (item.type === "empty") return; // Ignorovat prázdné položky
  if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
    selectedItems.value = [item];
    lastClickedItem.value = item; // Zapamatování referenčního bodu
  } else {
    if (e.shiftKey) {
      // Shift+click - od reference k aktuálnímu
      const referenceItem = lastClickedItem.value || selectedItems.value[0];

      if (referenceItem && referenceItem.type !== "empty") {
        const referenceIndex = items.value.findIndex(
          (i) => i.item?.id === referenceItem.item.id
        );
        const currentIndex = items.value.findIndex(
          (i) => i.item?.id === item.item.id
        );

        if (referenceIndex !== -1 && currentIndex !== -1) {
          const start = Math.min(referenceIndex, currentIndex);
          const end = Math.max(referenceIndex, currentIndex);
          selectedItems.value = items.value.slice(start, end + 1);
        }
      } else {
        // Fallback pokud není reference
        selectedItems.value = [item];
        lastClickedItem.value = item;
      }
    } else {
      // Ctrl/Cmd+click - toggle selection
      const index = selectedItems.value.findIndex(
        (selected) => selected.item?.id === item.item.id
      );

      if (index !== -1) {
        selectedItems.value.splice(index, 1);
      } else {
        selectedItems.value.push(item);
      }
    }
  }

  emit("select", selectedItems.value);
};

const handleDeselect = () => {
  selectedItems.value = [];
  lastClickedItem.value = null;
  emit("select", selectedItems);
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
</script>
<template>
  <div class="w-full">
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

    <div
      v-if="items.length > 0 && !items.every((item) => item.type === 'empty')"
      class="grid gap-4 justify-between"
      :class="gridSize"
      @click="handleDeselect"
    >
      <template v-for="(item, i) in items" :key="i">
        <FolderComponent
          v-if="item.type === 'folder'"
          :key="item.item.id"
          :folder="item.item"
          :color="item.color || color"
          :size="size"
          :tags="item.tags || []"
          :selected="selectedItems.includes(item)"
          @select="(e) => handleSelectItem(item, e)"
          @click="emit('click', item.item)"
          :prevent-select="props.preventSelect"
        />
        <DocumentComponent
          v-else-if="item.type === 'document'"
          :document="item.item"
          :size="size"
          :color="item.color || color"
          :selected="selectedItems.includes(item)"
          @select="(e) => handleSelectItem(item, e)"
          @click="emit('click', item.item)"
          :prevent-select="props.preventSelect"
        />
        <div v-else class="pointer-events-none select-none" />
      </template>
    </div>

    <div
      v-else
      class="text-center text-sm text-gray-400 my-8"
      @click="handleDeselect"
    >
      No items found.
    </div>
  </div>
</template>
