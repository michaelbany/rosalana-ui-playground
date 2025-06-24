<script setup lang="ts">
import { useContextMenu } from "@/composables/useContextMenu";
import { onMounted, ref } from "vue";

const referenceItem = ref<HTMLElement | null>(null);

onMounted(() => {
  if (referenceItem.value) {
    // Testovací menu specifické pro tento komponent, přepisuje defaultní menu
    useContextMenu(referenceItem.value).set([
      { label: "Component Menu" },
      { divider: true },
      { title: "Refresh", icon: "ph:sync", shortcut: "⌘R" },
      { title: "Edit", icon: "ph:gear", shortcut: "⌘E" },
      { title: "Duplicate", icon: "ph:copy", shortcut: "⌘D" },
      { divider: true },
      { title: "Help", icon: "ph:question", shortcut: "F1" },
    ]);
  }
});
</script>
<template>
  <div
    ref="referenceItem"
    class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
  >
    Test Component
  </div>
</template>
