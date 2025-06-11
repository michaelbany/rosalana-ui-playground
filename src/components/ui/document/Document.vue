<script setup lang="ts">
import { motion } from "motion-v";
import { computed, ref } from "vue";
import UiButton from "../button/UiButton.vue";
import UiIcon from "../UiIcon.vue";

export type Document = {
  id: number | string;
  name: string;
  type: "text" | "image" | "pdf" | "spreadsheet" | "presentation";
};

const props = withDefaults(
  defineProps<{
    document: Document;
    size?: "sm" | "md" | "lg";
  }>(),
  {}
);

const sizes = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-14 h-14";
    case "md":
      return "w-22 h-22";
    case "lg":
      return "w-30 h-30";
    default:
      return "w-24 h-24";
  }
});

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

const iconSize = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-4 h-4";
    case "md":
      return "w-6 h-6";
    case "lg":
      return "w-9 h-9";
    default:
      return "w-6 h-6";
  }
});

const isHovered = ref(false);
</script>
<template>
  <UiButton
    class="h-auto flex-col gap-0 cursor-pointer"
    variant="ghost"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <motion.div
      class="relative inline-block select-none h-full"
      :animate="isHovered ? { scale: 1.05 } : { scale: 1 }"
    >
      <UiIcon
        class="text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        :name="icon"
        :class="iconSize"
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        :class="sizes"
        viewBox="0 0 24 24"
      >
        <!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE -->
        <g
          class="fill-white stroke-gray-200"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0.6"
        >
          <path
            d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
          />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </g>
      </svg>
    </motion.div>

    <p class="text-center text-sm font-medium">
      {{ props.document.name }}
    </p>
    <span class="text-xs mt-1 text-muted-foreground">
      {{
        props.document.type.charAt(0).toUpperCase() +
        props.document.type.slice(1)
      }}
    </span>
  </UiButton>
</template>
