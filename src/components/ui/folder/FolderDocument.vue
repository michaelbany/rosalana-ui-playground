<script setup lang="ts">
import { computed } from "vue";
import UiIcon from "../UiIcon.vue";
import type { Document } from "../document/Document.vue";

const props = withDefaults(
  defineProps<{
    document: Document;
    size?: "sm" | "md" | "lg";
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

const sizes = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-8 h-8 p-2";
    case "md":
      return "w-12 h-16 p-3";
    case "lg":
      return "w-16 h-22 p-3";
    default:
      return "w-12 h-16 p-3";
  }
});

const iconSize = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-3 h-3";
    case "md":
      return "w-4 h-4";
    case "lg":
      return "w-5 h-5";
    default:
      return "w-4 h-4";
  }
});
</script>
<template>
  <div
    class="shrink-0 bg-white rounded-sm shadow-md flex items-start justify-center text-gray-400 border"
    :class="sizes"
  >
    <UiIcon :name="icon" :class="iconSize" />
  </div>
</template>
