<script setup lang="ts">
import { useContextMenu } from "@/composables/useContextMenu";
import { onMounted, ref } from "vue";

const referenceItem = ref<HTMLElement | null>(null);

onMounted(() => {
  if (referenceItem.value) {
    useContextMenu(referenceItem.value).set(() => ([
      { label: "Text Menu" },
      { divider: true },
      { title: "Cut", icon: "ph:scissors", shortcut: "⌘X" },
      { title: "Copy", icon: "ph:copy", shortcut: "⌘C" },
      { title: "Paste", icon: "ph:paste", shortcut: "⌘V" },
      { divider: true },
      { title: "Select All", icon: "ph:list-checks", shortcut: "⌘A" },
      { title: "Find", icon: "ph:magnifying-glass", shortcut: "⌘F" },
    ]));
  }
});
</script>
<template>
  <div
    ref="referenceItem"
    class="flex h-[150px] p-3 w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
  >
    <p>
      <span class="text-blue-500 font-bold">Right-click</span>
      <span> on this area. </span>
      <span class="text-green-500">The context menu</span>
      <span> will appear even </span>
      <span class="bg-orange-500 text-white px-1 rounded">
        if you don't click directly on the set element
      </span>
    </p>
  </div>
</template>
