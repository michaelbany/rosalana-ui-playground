<script setup lang="ts">
import { computed, ref } from "vue";
import type { Folder } from "../ui/folder/Folder.vue";
import FolderComponent from "../ui/folder/Folder.vue";

const folders: Folder[] = [
  {
    id: 1,
    name: "Pracovní projekty",
    documents: [
      { id: 1, name: "Specifikace API", type: "text" },
      { id: 2, name: "Wireframy", type: "image" },
      { id: 3, name: "Roadmap Q3", type: "spreadsheet" },
      { id: 4, name: "Profile Photo", type: "image" },
    ],
  },
  {
    id: 2,
    name: "Osobní dokumenty",
    documents: [
      { id: 4, name: "Životopis", type: "image" },
      { id: 5, name: "Motivační dopis", type: "text" },
      { id: 6, name: "Fotka na pas", type: "image" },
    ],
  },
  {
    id: 3,
    name: "Faktury",
    documents: [
      { id: 7, name: "Faktura 2024-01", type: "spreadsheet" },
      { id: 8, name: "Faktura 2024-02", type: "pdf" },
    ],
  },
  {
    id: 4,
    name: "Prezentace",
    documents: [{ id: 9, name: "Firemní prezentace", type: "presentation" }],
  },
  {
    id: 5,
    name: "Smlouvy",
    documents: [],
  },
  {
    id: 6,
    name: "Cestování",
    documents: [
      { id: 10, name: "Letenky", type: "pdf" },
      { id: 11, name: "Itinerář", type: "text" },
      { id: 12, name: "Fotky z dovolené", type: "image" },
    ],
  },
  {
    id: 7,
    name: "Škola",
    documents: [
      { id: 13, name: "Zápisky z přednášek", type: "text" },
      { id: 14, name: "Prezentace na seminář", type: "presentation" },
    ],
  },
  {
    id: 8,
    name: "Hudba",
    documents: [
      { id: 15, name: "Playlist 2024", type: "text" },
      { id: 16, name: "Noty", type: "pdf" },
    ],
  },
  {
    id: 9,
    name: "Recepty",
    documents: [
      { id: 17, name: "Babiččin koláč", type: "text" },
      { id: 18, name: "Fotka dortu", type: "image" },
    ],
  },
  {
    id: 10,
    name: "Sport",
    documents: [
      { id: 19, name: "Tréninkový plán", type: "spreadsheet" },
      { id: 20, name: "Výsledky závodů", type: "pdf" },
    ],
  },
];

const size = ref<"sm" | "md" | "lg">("md");
const color = ref<"blue" | "green" | "red" | "orange" | "gray">("blue");

const gridSize = computed(() => {
  switch (size.value) {
    case "sm":
      return "grid-cols-[repeat(auto-fit,minmax(120px,1fr))]";
    case "md":
      return "grid-cols-[repeat(auto-fit,minmax(150px,1fr))]";
    case "lg":
      return "grid-cols-[repeat(auto-fit,minmax(180px,1fr))]";
    default:
      return "grid-cols-[repeat(auto-fit,minmax(150px,1fr))]";
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
    <div class="grid gap-4" :class="gridSize">
      <FolderComponent
        v-for="f in folders"
        :key="f.id"
        :folder="f"
        :color="color"
        :size="size"
        @click="() => console.log(`Folder clicked:`, f)"
      />
    </div>
  </div>
</template>
