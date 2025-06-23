<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { ContextMenuSeparator, type ContextMenuSeparatorProps } from "reka-ui";
import { tv } from "tailwind-variants";

const props = defineProps<
  ContextMenuSeparatorProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = reactiveOmit(props, "class");

const variants = tv({ base: "bg-border -mx-1 my-1 h-px" });
</script>

<template>
  <ContextMenuSeparator
    data-slot="context-menu-separator"
    v-bind="delegatedProps"
    :class="variants({ class: props.class })"
  />
</template>
