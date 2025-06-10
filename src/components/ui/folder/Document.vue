<script setup lang="ts">
import { computed } from "vue";
import UiIcon from "../UiIcon.vue";

export type Document = {
  id: number | string;
  name: string;
  type: "text" | "image" | "pdf" | "spreadsheet" | "presentation";
};

const props = withDefaults(
  defineProps<{
    document: Document;
  }>(),
  {}
);

const icon = computed(() => {
  switch (props.document.type) {
    case "text":
      return "lucide:letter-text";
    case "image":
      return "lucide:image";
    case "pdf":
      return "lucide:layout-list";
    case "spreadsheet":
      return "lucide:bar-chart-big";
    case "presentation":
      return "lucide:presentation";
    default:
      return "lucide:file";
  }
});
</script>
<template>
  <div
    class="h-22 w-16 shrink-0 bg-white rounded-sm shadow-md flex items-start justify-center p-3 text-gray-400 border"
  >
    <UiIcon :name="icon" class="w-5 h-5" />
  </div>
</template>
