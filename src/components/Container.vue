<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();
</script>
<template>
  <div class="w-full">
    <span>{{ props.name }}</span>
    <div
      class="w-full flex gap-2 items-center justify-center border p-5 rounded-lg"
    >
      <slot />
    </div>
  </div>
</template>
