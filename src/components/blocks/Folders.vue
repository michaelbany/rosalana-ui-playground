<script setup lang="ts">
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
];
</script>
<template>
  <div class="w-full">
    <h2 class="text-2xl font-bold mb-4">Folders</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <FolderComponent v-for="f in folders" :key="f.id" :folder="f" size="lg" />
    </div>
  </div>
</template>
