<script setup lang="ts">
import { useContextMenu } from "@/composables/useContextMenu";
import { onMounted, ref } from "vue";

const referenceItem = ref<HTMLElement | null>(null);

onMounted(() => {
  if (referenceItem.value) {
    // Testovací menu specifické pro tento komponent, přepisuje defaultní menu
    useContextMenu(referenceItem.value).set(() => ([
      { label: "Component Menu" },
      { divider: true },
      { title: "Refresh", icon: "lucide:refresh-cw", shortcut: "⌘R" },
      { title: "Edit", icon: "lucide:pen-line", shortcut: "⌘E" },
      { title: "Duplicate", icon: "lucide:copy", shortcut: "⌘D" },
      { divider: true },
      { title: "Help", icon: "lucide:circle-help", shortcut: "F1" },
    ]));
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
