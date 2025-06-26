<script setup lang="ts">
import { provide, ref } from "vue";
const props = defineProps<{
  disabled?: boolean;
}>();
const emit = defineEmits([
  "start:selection",
  "update:selection",
  "end:selection",
]);

const startX = ref(0);
const startY = ref(0);
const endX = ref(0);
const endY = ref(0);
const isSelecting = ref(false);

const registeredItems = ref<HTMLElement[]>([]);

provide("registerSelectionBoxItem", (el: HTMLElement) => {
  registeredItems.value.push(el);
});
provide("unregisterSelectionBoxItem", (el: HTMLElement) => {
  registeredItems.value = registeredItems.value.filter((item) => item !== el);
});

const handleStart = (event: MouseEvent) => {
  if (props.disabled) return;
  emit("start:selection", event);
  startX.value = event.clientX;
  startY.value = event.clientY;
  endX.value = event.clientX;
  endY.value = event.clientY;
  isSelecting.value = true;
};

const handleMove = (event: MouseEvent) => {
  if (!isSelecting.value) return;
  endX.value = event.clientX;
  endY.value = event.clientY;

  const box = getSelectionBox();
  const selected = registeredItems.value.filter((el) =>
    isElementInBox(el, box)
  );
  const selectedKeys = selected.map((el) => el.dataset.selectionBoxKey);

  emit(
    "update:selection",
    {
      startX: startX.value,
      startY: startY.value,
      endX: endX.value,
      endY: endY.value,
      selected,
      selectedKeys,
    },
    event
  );
};

const handleEnd = () => {
  if (!isSelecting.value) return;
  const box = getSelectionBox();
  const selected = registeredItems.value.filter((el) =>
    isElementInBox(el, box)
  );
  const selectedKeys = selected.map((el) => el.dataset.selectionBoxKey);
  setTimeout(() => {
    emit("end:selection", {
      startX: startX.value,
      startY: startY.value,
      endX: endX.value,
      endY: endY.value,
      selected,
      selectedKeys,
    });
  }, 0); 

  isSelecting.value = false;
};

const getSelectionBox = () => {
  return new DOMRect(
    Math.min(startX.value, endX.value),
    Math.min(startY.value, endY.value),
    Math.abs(endX.value - startX.value),
    Math.abs(endY.value - startY.value)
  );
};

const isElementInBox = (el: HTMLElement, box: DOMRect) => {
  const rect = el.getBoundingClientRect();
  return !(
    rect.right < box.left ||
    rect.left > box.right ||
    rect.bottom < box.top ||
    rect.top > box.bottom
  );
};
</script>
<template>
  <div @mousedown="handleStart" @mousemove="handleMove" @mouseup="handleEnd">
    <div
      class="fixed w-full h-full z-50 pointer-events-none bg-primary/5 border"
      :style="{
        left: Math.min(startX, endX) + 'px',
        top: Math.min(startY, endY) + 'px',
        width: Math.abs(endX - startX) + 'px',
        height: Math.abs(endY - startY) + 'px',
        display: isSelecting ? 'block' : 'none',
      }"
    />
    <slot />
  </div>
</template>
