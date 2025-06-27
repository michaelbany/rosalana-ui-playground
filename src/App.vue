<script setup lang="ts">
import Container from "./components/Container.vue";
/** @ts-ignore */
import Editor from "./components/ui/editor/Editor.vue";
import Finder, { type FolderOrDocument } from "./components/blocks/Finder.vue";
import ContextMenu from "./components/blocks/ContextMenu.vue";
import TestComponent from "./components/ui/test/TestComponent.vue";
import TestComponent2 from "./components/ui/test/TestComponent2.vue";
import TestWithText from "./components/ui/test/TestWithText.vue";
import TestPreventedByParam from "./components/ui/test/TestPreventedByParam.vue";

const items: FolderOrDocument[] = [
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
    tags: [{ name: "urgent", color: "red", icon: "lucide:alert-triangle" }],
  },
  {
    type: "folder",
    color: "orange",
    item: {
      id: 2,
      name: "Osobní dokumenty",
      documents: [
        { id: 4, name: "Životopis.png", type: "image" },
        { id: 5, name: "Motivační dopis.txt", type: "text" },
        { id: 6, name: "Fotka na pas.png", type: "image" },
      ],
    },
    tags: [{ name: "to review", color: "blue", icon: "lucide:eye" }],
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
    tags: [{ name: "in progress", color: "gray", icon: "lucide:loader" }],
  },
  {
    type: "folder",
    item: {
      id: 5,
      name: "Smlouvy",
      documents: [],
    },
    tags: [{ name: "favorite", color: "orange", icon: "lucide:star" }],
  },
  {
    type: "folder",
    color: "green",
    item: {
      id: 6,
      name: "Cestování",
      documents: [
        { id: 10, name: "Letenky.pdf", type: "pdf" },
        { id: 11, name: "Itinerář.txt", type: "text" },
        { id: 12, name: "Fotky z dovolené.png", type: "image" },
      ],
    },
    tags: [
      { name: "to review", color: "blue", icon: "lucide:eye" },
      { name: "favorite", color: "orange", icon: "lucide:star" },
    ],
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
    color: "gray",
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
    color: "red",
    item: { id: 21, name: "Poznámky.txt", type: "text" },
    tags: [{ name: "in progress", color: "gray", icon: "lucide:loader" }],
  },
  {
    type: "document",
    item: { id: 22, name: "Obrázek.png", type: "image" },
  },
  {
    type: "document",
    item: { id: 23, name: "Prezentace.pptx", type: "presentation" },
    tags: [{ name: "done", color: "green", icon: "lucide:check" }],
  },
  {
    type: "document",
    color: "orange",
    item: { id: 24, name: "Tabulka.xlsx", type: "spreadsheet" },
  },
];
</script>

<template>
  <ContextMenu>
    <div class="w-full h-full">
      <div class="flex flex-col items-center p-8 max-w-5xl mx-auto">
        <Container name="Editor">
          <Editor />
        </Container>

        <Container name="Context Menu">
          <TestComponent />
          <TestComponent2 />
          <TestWithText />
          <TestPreventedByParam />
        </Container>

        <Container name="Folder">
          <Finder
            :items="items"
            @click="(i) => console.log('clicked', i)"
            @select="(i) => console.log('Selected:', i)"
          />
        </Container>
      </div>
    </div>
  </ContextMenu>
</template>
