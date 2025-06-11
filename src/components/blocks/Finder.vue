<script setup lang="ts">
import { computed, ref } from "vue";
import type { Folder } from "../ui/folder/Folder.vue";
import FolderComponent from "../ui/folder/Folder.vue";
import DocumentComponent, { type Document } from "../ui/document/Document.vue";
import UiInput from "../ui/input/UiInput.vue";

type FolderOrDocument =
  | { type: "folder"; item: Folder }
  | { type: "document"; item: Document }
  | { type: "empty"; item: null };

const rawItems: FolderOrDocument[] = [
  {
    type: "folder",
    item: {
      id: 1,
      name: "Pracovní projekty",
      documents: [
        { id: 1, name: "Specifikace API.txt", type: "text" },
        { id: 2, name: "Wireframy.png", type: "image" },
        { id: 3, name: "Roadmap Q3.xlsx", type: "spreadsheet" },
        { id: 4, name: "Profile Photo.png", type: "image" },
      ],
    },
  },
  {
    type: "folder",
    item: {
      id: 2,
      name: "Osobní dokumenty",
      documents: [
        { id: 4, name: "Životopis.png", type: "image" },
        { id: 5, name: "Motivační dopis.txt", type: "text" },
        { id: 6, name: "Fotka na pas.png", type: "image" },
      ],
    },
  },
  {
    type: "folder",
    item: {
      id: 3,
      name: "Faktury",
      documents: [
        { id: 7, name: "Faktura 2024-01.xlsx", type: "spreadsheet" },
        { id: 8, name: "Faktura 2024-02.pdf", type: "pdf" },
      ],
    },
  },
  {
    type: "folder",
    item: {
      id: 4,
      name: "Prezentace",
      documents: [
        { id: 9, name: "Firemní prezentace.pptx", type: "presentation" },
      ],
    },
  },
  {
    type: "folder",
    item: {
      id: 5,
      name: "Smlouvy",
      documents: [],
    },
  },
  {
    type: "folder",
    item: {
      id: 6,
      name: "Cestování",
      documents: [
        { id: 10, name: "Letenky.pdf", type: "pdf" },
        { id: 11, name: "Itinerář.txt", type: "text" },
        { id: 12, name: "Fotky z dovolené.png", type: "image" },
      ],
    },
  },
  {
    type: "folder",
    item: {
      id: 7,
      name: "Škola",
      documents: [
        { id: 13, name: "Zápisky z přednášek.txt", type: "text" },
        { id: 14, name: "Prezentace na seminář.pptx", type: "presentation" },
      ],
    },
  },
  {
    type: "folder",
    item: {
      id: 8,
      name: "Hudba",
      documents: [
        { id: 15, name: "Playlist 2024.txt", type: "text" },
        { id: 16, name: "Noty.pdf", type: "pdf" },
      ],
    },
  },
  {
    type: "folder",
    item: {
      id: 9,
      name: "Recepty",
      documents: [
        { id: 17, name: "Babiččin koláč.txt", type: "text" },
        { id: 18, name: "Fotka dortu.png", type: "image" },
      ],
    },
  },
  {
    type: "folder",
    item: {
      id: 10,
      name: "Sport",
      documents: [
        { id: 19, name: "Tréninkový plán.xlsx", type: "spreadsheet" },
        { id: 20, name: "Výsledky závodů.pdf", type: "pdf" },
      ],
    },
  },
  {
    type: "document",
    item: { id: 21, name: "Poznámky.txt", type: "text" },
  },
  {
    type: "document",
    item: { id: 22, name: "Obrázek.png", type: "image" },
  },
  {
    type: "document",
    item: { id: 23, name: "Prezentace.pptx", type: "presentation" },
  },
  {
    type: "document",
    item: { id: 24, name: "Tabulka.xlsx", type: "spreadsheet" },
  },
];

const items = computed(() => {
  const filtered = rawItems.filter((item) => {
    if (search.value.trim() === "") return true;

    const searchLower = search.value.toLowerCase();
    if (item.type === "folder") {
      return item.item.name.toLowerCase().includes(searchLower);
    } else if (item.type === "document") {
      return item.item.name.toLowerCase().includes(searchLower);
    }
  });

  const filteredLength = rawItems.length - filtered.length;

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
      placeholder="Search folders..."
      :aria-label="'Search folders'"
      v-model="search"
      name="search"
      autocomplete="off"
    />

    <div
      class="grid gap-4 justify-between"
      :class="gridSize"
      @click="() => (selectedItems = [])"
    >
      <template v-for="(item, i) in items" :key="i">
        <FolderComponent
          v-if="item.type === 'folder'"
          :key="item.item.id"
          :folder="item.item"
          :color="color"
          :size="size"
          :selected="selectedItems.includes(item)"
          @select="(e) => handleSelectItem(item, e)"
          @click="() => console.log(`Folder clicked:`, item.item)"
        />
        <DocumentComponent
          v-else-if="item.type === 'document'"
          :document="item.item"
          :size="size"
          :color="color"
          :selected="selectedItems.includes(item)"
          @select="(e) => handleSelectItem(item, e)"
          @click="() => console.log(`Document clicked:`, item.item)"
        />
        <div v-else class="pointer-events-none select-none" />
      </template>
    </div>
  </div>
</template>
