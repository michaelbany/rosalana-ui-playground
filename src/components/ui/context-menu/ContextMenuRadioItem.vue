<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import {
  ContextMenuItemIndicator,
  ContextMenuRadioItem,
  type ContextMenuRadioItemEmits,
  type ContextMenuRadioItemProps,
  useForwardPropsEmits,
} from "reka-ui";
import { tv } from "tailwind-variants";
import UiIcon from "../UiIcon.vue";

const props = defineProps<
  ContextMenuRadioItemProps & { class?: HTMLAttributes["class"] }
>();
const emits = defineEmits<ContextMenuRadioItemEmits>();

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);

const variants = tv({
  base: `focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
});
</script>

<template>
  <ContextMenuRadioItem
    data-slot="context-menu-radio-item"
    v-bind="forwarded"
    :class="variants({ class: props.class })"
  >
    <span
      class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
    >
      <ContextMenuItemIndicator>
        <UiIcon name="lucide:circle" class="size-2 fill-current" />
      </ContextMenuItemIndicator>
    </span>
    <slot />
  </ContextMenuRadioItem>
</template>
