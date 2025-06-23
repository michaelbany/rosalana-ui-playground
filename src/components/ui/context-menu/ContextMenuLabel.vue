<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { ContextMenuLabel, type ContextMenuLabelProps } from "reka-ui";
import { tv } from "tailwind-variants";

const props = defineProps<
  ContextMenuLabelProps & { class?: HTMLAttributes["class"]; inset?: boolean }
>();

const delegatedProps = reactiveOmit(props, "class");

const variants = tv({
  base: "text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
});
</script>

<template>
  <ContextMenuLabel
    data-slot="context-menu-label"
    :data-inset="inset ? '' : undefined"
    v-bind="delegatedProps"
    :class="variants({ class: props.class })"
  >
    <slot />
  </ContextMenuLabel>
</template>
