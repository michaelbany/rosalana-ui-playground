<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import UiButton from "../button/UiButton.vue";
import { motion } from "motion-v";
import DocumentComponent from "./FolderDocument.vue";
import type { Document } from "../document/Document.vue";
import type {
  FinderColor,
  FinderSize,
  FinderTag,
} from "@/components/blocks/Finder.vue";
import { getTheme } from "@/components/blocks/colors";
import UiIcon from "../UiIcon.vue";
import { useContextMenu } from "@/composables/useContextMenu";

export type Folder = {
  id: number;
  name: string;
  documents: Document[];
};

const props = withDefaults(
  defineProps<{
    folder: Folder;
    size?: FinderSize;
    tags?: FinderTag[];
    color?: FinderColor;
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
const currentColor = ref<FinderColor>(props.color);

watch(
  () => props.color,
  (newColor) => {
    currentColor.value = newColor;
  },
  { immediate: true }
);

const folderColor = computed(() => {
  const color = getTheme(currentColor.value);
  return {
    back: [color["500"], color["600"]],
    front: [color["400"], color["500"]],
    stroke: [color["50"], color["100"]],
  };
});

const selectColor = computed(() => {
  return `bg-${currentColor.value}-500 text-white`;
});

const folderRef = ref<HTMLElement | null>(null);
const unwrap = (r: any) =>
  r instanceof HTMLElement ? r : (r?.$el as HTMLElement | null);

onMounted(() => {
  const el = unwrap(folderRef.value);
  if (el) {
    useContextMenu(el).set(() => [
      { label: `${props.folder.name} Folder` },
      { divider: true },
      { title: "Open", icon: "lucide:folder-open", shortcut: "Enter" },
      { title: "Rename", icon: "lucide:folder-pen", shortcut: "F2" },
      { title: "Delete", icon: "lucide:trash", shortcut: "Delete" },
      { divider: true },
      {
        title: "Color",
        items: [
          {
            title: "Blue",
            icon: "lucide:circle-small.text-blue-500",
            checked: currentColor.value === "blue",
            action: () => (currentColor.value = "blue"),
          },
          {
            title: "Red",
            icon: "lucide:circle-small.text-red-500",
            checked: currentColor.value === "red",
            action: () => (currentColor.value = "red"),
          },
          {
            title: "Green",
            icon: "lucide:circle-small.text-green-500",
            checked: currentColor.value === "green",
            action: () => (currentColor.value = "green"),
          },
          {
            title: "Orange",
            icon: "lucide:circle-small.text-orange-500",
            checked: currentColor.value === "orange",
            action: () => (currentColor.value = "orange"),
          },
          {
            title: "Gray",
            icon: "lucide:circle-small.text-gray-500",
            checked: currentColor.value === "gray",
            action: () => (currentColor.value = "gray"),
          },
        ],
      },
      {
        title: "Tags",
        items: [
          {
            title: "Urgent",
            icon: "lucide:alert-triangle",
            checked: props.tags?.some((tag) => tag.name === "urgent"),
            action: () => {
              if (props.tags) {
                const tagIndex = props.tags.findIndex(
                  (tag) => tag.name === "urgent"
                );
                if (tagIndex !== -1) {
                  props.tags.splice(tagIndex, 1);
                } else {
                  props.tags.push({
                    name: "urgent",
                    color: "red",
                    icon: "lucide:alert-triangle",
                  });
                }
              }
            },
          },
          {
            title: "To Review",
            icon: "lucide:eye",
            checked: props.tags?.some((tag) => tag.name === "to review"),
            action: () => {
              if (props.tags) {
                const tagIndex = props.tags.findIndex(
                  (tag) => tag.name === "to review"
                );
                if (tagIndex !== -1) {
                  props.tags.splice(tagIndex, 1);
                } else {
                  props.tags.push({
                    name: "to review",
                    color: "blue",
                    icon: "lucide:eye",
                  });
                }
              }
            },
          },
          {
            title: "In Progress",
            icon: "lucide:loader",
            checked: props.tags?.some((tag) => tag.name === "in progress"),
            action: () => {
              if (props.tags) {
                const tagIndex = props.tags.findIndex(
                  (tag) => tag.name === "in progress"
                );
                if (tagIndex !== -1) {
                  props.tags.splice(tagIndex, 1);
                } else {
                  props.tags.push({
                    name: "in progress",
                    color: "gray",
                    icon: "lucide:loader",
                  });
                }
              }
            },
          },
          {
            title: "Favorite",
            icon: "lucide:star",
            checked: props.tags?.some((tag) => tag.name === "favorite"),
            action: () => {
              if (props.tags) {
                const tagIndex = props.tags.findIndex(
                  (tag) => tag.name === "favorite"
                );
                if (tagIndex !== -1) {
                  props.tags.splice(tagIndex, 1);
                } else {
                  props.tags.push({
                    name: "favorite",
                    color: "orange",
                    icon: "lucide:star",
                  });
                }
              }
            },
          },
        ],
      },
    ]);
  }
});
</script>

<template>
  <UiButton
    ref="folderRef"
    class="h-auto flex-col gap-0 cursor-pointer select-none"
    :aria-label="`${props.folder.name}, ${props.folder.documents.length} documents`"
    variant="ghost"
    @click.stop="handleSelectOrClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @focus="isHovered = true"
    @blur="isHovered = false"
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
          <linearGradient
            :id="`back-gradient-${folder.id}`"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" :stop-color="folderColor?.back[0]" />
            <!-- blue-500 -->
            <stop offset="100%" :stop-color="folderColor?.back[1]" />
            <!-- blue-600 -->
          </linearGradient>
          <linearGradient
            :id="`back-stroke-${folder.id}`"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
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
          :fill="`url(#back-gradient-${folder.id})`"
          :stroke="`url(#back-stroke-${folder.id})`"
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
          <linearGradient
            :id="`front-gradient-${folder.id}`"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" :stop-color="folderColor?.front[0]" />
            <!-- blue-400 -->
            <stop offset="100%" :stop-color="folderColor?.front[1]" />
            <!-- blue-600 -->
          </linearGradient>
          <linearGradient
            :id="`front-stroke-${folder.id}`"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" :stop-color="folderColor?.stroke[0]" />
            <!-- blue-50 -->
            <stop offset="100%" :stop-color="folderColor?.stroke[1]" />
            <!-- blue-100 -->
          </linearGradient>
        </defs>

        <path
          :fill="`url(#front-gradient-${folder.id})`"
          :stroke="`url(#front-stroke-${folder.id})`"
          stroke-width="0.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
        />

        <g
          v-for="(tag, i) in props.tags?.slice(0, 3) || []"
          :key="i"
          :transform="`translate(${18 - 6 * i}, 16)`"
        >
          <circle
            cx="0"
            cy="0"
            r="2.5"
            stroke-width="0.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :stroke="`url(#front-stroke-${folder.id})`"
            :fill="
              tag.icon ? getTheme(tag.color)['200'] : getTheme(tag.color)['400']
            "
          />
          <UiIcon
            v-if="tag.icon"
            :name="tag.icon"
            width="3"
            height="3"
            :style="{ color: getTheme(tag.color)['500'] }"
            x="-1.5"
            y="-1.5"
          />
        </g>
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
