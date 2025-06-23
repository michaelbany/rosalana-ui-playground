<script setup lang="ts">
import { useContextMenu } from '@/composables/useContextMenu';
import { onMounted, ref } from 'vue';


const referenceItem = ref<HTMLElement | null>(null);

onMounted(() => {
    if (referenceItem.value) {
        useContextMenu(referenceItem.value, [])
    }
})
</script>
<template>
  <div
    ref="referenceItem"
    class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
  >
    Test Component
  </div>
</template>
