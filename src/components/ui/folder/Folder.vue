<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import UiButton from "../button/UiButton.vue";
import { motion } from "motion-v";
import DocumentComponent from "./FolderDocument.vue";
import type { Document } from "../document/Document.vue";

export type Folder = {
  id: number;
  name: string;
  documents: Document[];
};

const props = withDefaults(
  defineProps<{
    folder: Folder;
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
      return "w-16 h-16";
    case "md":
      return "w-24 h-24";
    case "lg":
      return "w-32 h-32";
    default:
      return "w-24 h-24";
  }
});

const isHovered = ref(false);

const folderColor = computed(() => {
  switch (props.color) {
    case "blue":
      return {
        back: [
          "oklch(62.3% 0.214 259.815)", // blue-500
          "oklch(42.4% 0.199 265.638)", // blue-600
        ],
        front: [
          "oklch(70.7% 0.165 254.624)", // blue-400
          "oklch(62.3% 0.214 259.815)", // blue-500
        ],
        stroke: [
          "oklch(97% 0.014 254.604)", // blue-50
          "oklch(93.2% 0.032 255.585)", // blue-100
        ],
      };
    case "green":
      return {
        back: [
          "oklch(62.3% 0.19 145)", // emerald-500
          "oklch(49.2% 0.16 145)", // emerald-600
        ],
        front: [
          "oklch(70.7% 0.15 145)", // emerald-400
          "oklch(62.3% 0.19 145)", // emerald-500
        ],
        stroke: [
          "oklch(97% 0.015 145)", // emerald-50
          "oklch(93.2% 0.035 145)", // emerald-100
        ],
      };
    case "red":
      return {
        back: [
          "oklch(62.3% 0.22 29.2)", // red-500
          "oklch(49.2% 0.19 29.2)", // red-600
        ],
        front: [
          "oklch(70.7% 0.17 29.2)", // red-400
          "oklch(62.3% 0.22 29.2)", // red-500
        ],
        stroke: [
          "oklch(97% 0.02 29.2)", // red-50
          "oklch(93.2% 0.04 29.2)", // red-100
        ],
      };
    case "orange":
      return {
        back: [
          "oklch(80% 0.18 60)", // orange-500
          "oklch(70% 0.16 60)", // orange-600
        ],
        front: [
          "oklch(88% 0.14 60)", // orange-400
          "oklch(80% 0.18 60)", // orange-500
        ],
        stroke: [
          "oklch(98% 0.02 60)", // orange-50
          "oklch(95% 0.04 60)", // orange-100
        ],
      };
    case "gray":
      return {
        back: [
          "oklch(80% 0.01 270)", // gray-400
          "oklch(65% 0.01 270)", // gray-500
        ],
        front: [
          "oklch(90% 0.008 270)", // gray-200
          "oklch(80% 0.01 270)", // gray-400
        ],
        stroke: [
          "oklch(98% 0.005 270)", // gray-50
          "oklch(93% 0.008 270)", // gray-100
        ],
      };
    default:
      return {
        back: [
          "oklch(62.3% 0.214 259.815)", // blue-500
          "oklch(42.4% 0.199 265.638)", // blue-600
        ],
        front: [
          "oklch(70.7% 0.165 254.624)", // blue-400
          "oklch(62.3% 0.214 259.815)", // blue-500
        ],
        stroke: [
          "oklch(97% 0.014 254.604)", // blue-50
          "oklch(93.2% 0.032 255.585)", // blue-100
        ],
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
</script>

<template>
  <UiButton
    class="h-auto flex-col gap-0 cursor-pointer"
    :aria-label="`${props.folder.name}, ${props.folder.documents.length} documents`"
    variant="ghost"
    @click.stop="handleSelectOrClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :class="props.selected ? 'bg-accent' : ''"
  >
    <motion.div
      class="relative inline-block select-none h-full"
      :animate="isHovered ? { scale: 1.05 } : { scale: 1 }"
    >
      <!-- Zadní strana: prostý obdélník -->
      <motion.svg
        class="absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
        :class="sizes"
        viewBox="0 0 24 24"
        tabindex="-1"
        :initial="{ transform: 'scale(1)' }"
        :animate="
          isHovered ? { transform: 'scale(0.9)' } : { transform: 'scale(1)' }
        "
      >
        <defs>
          <linearGradient id="back-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" :stop-color="folderColor?.back[0]" />
            <!-- blue-500 -->
            <stop offset="100%" :stop-color="folderColor?.back[1]" />
            <!-- blue-600 -->
          </linearGradient>
          <linearGradient id="back-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" :stop-color="folderColor?.stroke[0]" />
            <!-- blue-50 -->
            <stop offset="100%" :stop-color="folderColor?.stroke[1]" />
            <!-- blue-100 -->
          </linearGradient>
        </defs>

        <rect
          x="2"
          y="4"
          width="20"
          height="16"
          rx="2"
          fill="url(#back-gradient)"
          stroke="url(#back-stroke)"
          stroke-width="0.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </motion.svg>

      <!-- Slot pro dokumenty -->
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          v-if="props.folder.documents.length"
          :initial="{ opacity: 0 }"
          :animate="
            isHovered
              ? { opacity: 1, scale: 1, y: -15 }
              : { opacity: 0, scale: 0.6, y: 0 }
          "
        >
          <motion.div
            class="absolute"
            v-if="props.folder.documents[2]"
            :animate="
              isHovered
                ? { rotate: 15, x: '-35%', y: '-40%' }
                : { rotate: 0, x: '-50%', y: '-50%' }
            "
            :transition="{ delay: 0.1, type: 'tween', duration: 0.2 }"
          >
            <DocumentComponent
              :document="props.folder.documents[2]"
              :size="props.size"
            />
          </motion.div>

          <motion.div
            v-if="props.folder.documents[1]"
            class="absolute"
            :animate="
              isHovered
                ? { rotate: 10, x: '-40%', y: '-50%' }
                : { rotate: 0, x: '-50%', y: '-50%' }
            "
            :transition="{ delay: 0.05, type: 'tween', duration: 0.2 }"
          >
            <DocumentComponent
              :document="props.folder.documents[1]"
              :size="props.size"
            />
          </motion.div>

          <motion.div
            class="absolute -translate-x-1/2 -translate-y-1/2"
            v-if="props.folder.documents[0]"
          >
            <DocumentComponent
              :document="props.folder.documents[0]"
              :size="props.size"
            />
          </motion.div>
        </motion.div>
      </div>

      <!-- Přední strana -->
      <motion.svg
        class="relative z-10"
        xmlns="http://www.w3.org/2000/svg"
        :class="sizes"
        viewBox="0 0 24 24"
        tabindex="-1"
        :animate="
          isHovered
            ? {
                transform:
                  'perspective(100px) rotateX(-10deg) translateY(10px)',
              }
            : { transform: 'perspective(100px) rotateX(0deg) translateY(0px)' }
        "
      >
        <defs>
          <linearGradient id="front-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" :stop-color="folderColor?.front[0]" />
            <!-- blue-400 -->
            <stop offset="100%" :stop-color="folderColor?.front[1]" />
            <!-- blue-600 -->
          </linearGradient>
          <linearGradient id="front-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" :stop-color="folderColor?.stroke[0]" />
            <!-- blue-50 -->
            <stop offset="100%" :stop-color="folderColor?.stroke[1]" />
            <!-- blue-100 -->
          </linearGradient>
        </defs>

        <path
          fill="url(#front-gradient)"
          stroke="url(#front-stroke)"
          stroke-width="0.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
        />
      </motion.svg>
    </motion.div>

    <p
      class="text-center text-sm font-medium"
      :class="props.selected ? `${selectColor} rounded-sm px-1` : ''"
    >
      {{ props.folder.name }}
    </p>
    <span class="text-xs mt-1 text-muted-foreground">
      {{ props.folder.documents.length }} documents
    </span>
  </UiButton>
</template>
