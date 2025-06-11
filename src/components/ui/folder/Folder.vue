<script setup lang="ts">
import { computed, ref } from "vue";
import type { Document } from "./Document.vue";
import UiButton from "../button/UiButton.vue";
import { motion } from "motion-v";
import DocumentComponent from "./Document.vue";

export type Folder = {
  id: number;
  name: string;
  documents: Document[];
};

const props = withDefaults(
  defineProps<{
    folder: Folder;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    size: "md",
  }
);

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
      <!-- Zadní strana: prostý obdélník -->
      <motion.svg
        class="absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
        :class="sizes"
        viewBox="0 0 24 24"
        :initial="{ transform: 'scale(1)' }"
        :animate="
          isHovered ? { transform: 'scale(0.9)' } : { transform: 'scale(1)' }
        "
      >
        <defs>
          <linearGradient id="back-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="oklch(62.3% 0.214 259.815)" />
            <!-- blue-500 -->
            <stop offset="100%" stop-color="oklch(42.4% 0.199 265.638)" />
            <!-- blue-600 -->
          </linearGradient>
          <linearGradient id="back-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="oklch(97% 0.014 254.604)" />
            <!-- blue-50 -->
            <stop offset="100%" stop-color="oklch(93.2% 0.032 255.585)" />
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
            <DocumentComponent :document="props.folder.documents[2]" :size="props.size" />
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
            <DocumentComponent :document="props.folder.documents[1]" :size="props.size" />
          </motion.div>

          <motion.div
            class="absolute -translate-x-1/2 -translate-y-1/2"
            v-if="props.folder.documents[0]"
          >
            <DocumentComponent :document="props.folder.documents[0]" :size="props.size" />
          </motion.div>
        </motion.div>
      </div>

      <!-- Přední strana -->
      <motion.svg
        class="relative z-10"
        xmlns="http://www.w3.org/2000/svg"
        :class="sizes"
        viewBox="0 0 24 24"
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
            <stop offset="0%" stop-color="oklch(70.7% 0.165 254.624)" />
            <!-- blue-400 -->
            <stop offset="100%" stop-color="oklch(62.3% 0.214 259.815)" />
            <!-- blue-600 -->
          </linearGradient>
          <linearGradient id="front-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="oklch(97% 0.014 254.604)" />
            <!-- blue-50 -->
            <stop offset="100%" stop-color="oklch(93.2% 0.032 255.585)" />
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

    <p class="text-center text-sm font-medium">
      {{ props.folder.name }}
    </p>
    <span class="text-xs mt-1 text-muted-foreground">
      {{ props.folder.documents.length }} documents
    </span>
  </UiButton>
</template>
