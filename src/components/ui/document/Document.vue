<script setup lang="ts">
import { motion } from "motion-v";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import UiButton from "../button/UiButton.vue";
import UiIcon from "../UiIcon.vue";
import type {
  FinderColor,
  FinderSize,
  FinderTag,
} from "@/components/blocks/Finder.vue";
import { getTheme } from "@/components/blocks/colors";
import { useContextMenu } from "@/composables/useContextMenu";

export type Document = {
  id: number | string;
  name: string;
  type: "text" | "image" | "pdf" | "spreadsheet" | "presentation";
};

const props = withDefaults(
  defineProps<{
    document: Document;
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
  return {
    icon: `text-${currentColor.value}-300`,
    grid: `stroke-${currentColor.value}-50 fill-${currentColor.value}-100`,
    stroke: `stroke-${currentColor.value}-200`,
  };
});

const selectColor = computed(() => {
  return `bg-${currentColor.value}-500 text-white`;
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

const documentRef = ref<HTMLElement | null>(null);
const unwrap = (r: any) =>
  r instanceof HTMLElement ? r : (r?.$el as HTMLElement | null);

onMounted(() => {
  const el = unwrap(documentRef.value);
  if (el) {
    useContextMenu(el).set(() => [
      { title: "Open", icon: "lucide:file-input", shortcut: "Enter" },
      { title: "Rename", icon: "lucide:file-pen", shortcut: "F2" },
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
          {
            title: "Done",
            icon: "lucide:circle-check",
            checked: props.tags?.some((tag) => tag.name === "done"),
            action: () => {
              if (props.tags) {
                const tagIndex = props.tags.findIndex(
                  (tag) => tag.name === "done"
                );
                if (tagIndex !== -1) {
                  props.tags.splice(tagIndex, 1);
                } else {
                  props.tags.push({
                    name: "done",
                    color: "green",
                    icon: "lucide:check",
                  });
                }
              }
            },
          },
        ],
      },
      { divider: true },
      { title: "Properties", icon: "lucide:info", shortcut: "Ctrl+I" },
    ]);
  }
});
</script>
<template>
  <UiButton
    ref="documentRef"
    class="h-auto flex-col gap-0 cursor-pointer select-none w-full"
    variant="ghost"
    :aria-label="`${props.document.name}, ${props.document.type}`"
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
          <pattern
            :id="`grid-${document.id}`"
            width="2"
            height="2"
            patternUnits="userSpaceOnUse"
          >
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
            :fill="`url(#grid-${document.id})`"
          />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" fill="url(#grid)" />
        </g>
        <g
          v-for="(tag, i) in props.tags?.slice(0, 2) || []"
          :key="i"
          :transform="`translate(${16.5 - 6 * i}, 18.5)`"
        >
          <circle
            cx="0"
            cy="0"
            r="2.5"
            stroke-width="0.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :stroke="getTheme(tag.color)['50']"
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
