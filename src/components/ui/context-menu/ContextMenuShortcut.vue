<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { tv } from "tailwind-variants";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const variants = tv({
  base: "text-muted-foreground ml-auto text-xs tracking-widest",
});
</script>

<template>
  <span
    data-slot="context-menu-shortcut"
    :class="variants({ class: props.class })"
  >
    <slot />
  </span>
</template>
