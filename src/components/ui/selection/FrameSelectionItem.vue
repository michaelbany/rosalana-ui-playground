<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
    selectionKey: string | number | undefined;
}>();

const elRef = ref<HTMLElement | null>(null);

const registerItem = inject<(el: HTMLElement) => void>(
  "registerSelectionBoxItem"
);
const unregisterItem = inject<(el: HTMLElement) => void>(
  "unregisterSelectionBoxItem"
);

onMounted(() => {
  if (elRef.value) registerItem?.(elRef.value);
});
onBeforeUnmount(() => {
  if (elRef.value) unregisterItem?.(elRef.value);
});
</script>
<template>
  <div ref="elRef" as-child :data-selection-box-key="props.selectionKey">
    <slot />
  </div>
</template>
