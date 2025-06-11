<script setup lang="ts">
import { motion } from "motion-v";
import { computed, onUnmounted, ref } from "vue";
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
    color?: "blue" | "green" | "red" | "orange" | "gray";
    selected?: boolean;
    preventSelect?: boolean;
  }>(),
  {
    size: "md",
    color: "blue",
  }
);

const emit = defineEmits(["click", "select"]);

let clickTimeout: ReturnType<typeof setTimeout> | null = null;

const handleSelectOrClick = (event: PointerEvent) => {
  if (props.preventSelect) {
    emit("click", event);
  } else {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      emit("click", event);
    } else {
      emit("select", event); // vždy emit select na první klik
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
      }, 250);
    }
  }
};

onUnmounted(() => {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    clickTimeout = null;
  }
});

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

const colors = computed(() => {
  switch (props.color) {
    case "blue":
      return {
        icon: "text-blue-300",
        grid: "stroke-blue-50 fill-blue-100",
        stroke: "stroke-blue-200",
      };
    case "green":
      return {
        icon: "text-green-300",
        grid: "stroke-green-50 fill-green-100",
        stroke: "stroke-green-200",
      };
    case "red":
      return {
        icon: "text-red-300",
        grid: "stroke-red-50 fill-red-100",
        stroke: "stroke-red-200",
      };
    case "orange":
      return {
        icon: "text-orange-300",
        grid: "stroke-orange-50 fill-orange-100",
        stroke: "stroke-orange-200",
      };
    case "gray":
      return {
        icon: "text-gray-300",
        grid: "stroke-gray-50 fill-gray-100",
        stroke: "stroke-gray-200",
      };
    default:
      return {
        icon: "text-blue-300",
        grid: "stroke-blue-50 fill-blue-100",
        stroke: "stroke-blue-200",
      };
  }
});

const selectColor = computed(() => {
  switch (props.color) {
    case "blue":
      return "bg-blue-500 text-white";
    case "green":
      return "bg-green-500 text-white";
    case "red":
      return "bg-red-500 text-white";
    case "orange":
      return "bg-orange-500 text-white";
    case "gray":
      return "bg-gray-500 text-white";
    default:
      return "bg-blue-500 text-white";
  }
});

const isHovered = ref(false);
</script>
<template>
  <UiButton
    class="h-auto flex-col gap-0 cursor-pointer"
    variant="ghost"
    :aria-label="`${props.document.name}, ${props.document.type}`"
    @click.stop="handleSelectOrClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :class="props.selected ? 'bg-accent' : ''"
  >
    <motion.div
      class="relative inline-block select-none h-full"
      :animate="isHovered ? { scale: 1.05 } : { scale: 1 }"
    >
      <UiIcon
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        :name="icon"
        :class="[iconSize, colors.icon]"
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        :class="sizes"
        viewBox="0 0 24 24"
      >
        <defs>
          <!-- Pattern for grid -->
          <pattern id="grid" width="2" height="2" patternUnits="userSpaceOnUse">
            <path
              d="M 10 0 L 0 0 0 10"
              :class="colors.grid"
              stroke-width="0.6"
            />
          </pattern>
        </defs>

        <g
          :class="colors.stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0.6"
        >
          <path
            d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
            fill="url(#grid)"
          />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" fill="url(#grid)" />
        </g>
      </svg>
    </motion.div>

    <p
      class="text-center text-sm font-medium"
      :class="props.selected ? `${selectColor} rounded-sm px-1` : ''"
    >
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
