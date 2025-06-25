<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  useContextMenu,
  type ContextMenu as ContextMenuType,
} from "@/composables/useContextMenu";
import { useMouse } from "@vueuse/core";
import { ref } from "vue";

const { x: currentMouseX, y: currentMouseY } = useMouse();

function handleTrigger(e: MouseEvent) {
  const target =
    e.composedPath().find((n): n is HTMLElement => n instanceof HTMLElement) ??
    null;

  const { items, prevent } = useContextMenu(target).get();
  menu.value = prevent ? [] : items;

  const isNearLastPosition =
    Math.abs(currentMouseX.value - lastMousePosition.x) < 10 &&
    Math.abs(currentMouseY.value - lastMousePosition.y) < 10;

  if (!menu.value.length || (wasOpen.value && isNearLastPosition)) {
    e.stopImmediatePropagation();
    wasOpen.value = false;
    lastMousePosition.x = 0;
    lastMousePosition.y = 0;
  } else {
    wasOpen.value = true;
    lastMousePosition.x = currentMouseX.value;
    lastMousePosition.y = currentMouseY.value;
  }
}

const menu = ref<ContextMenuType[]>([]);
const wasOpen = ref(false);
const lastMousePosition = { x: 0, y: 0 };
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger as-child @contextmenu.capture="handleTrigger">
      <slot />
    </ContextMenuTrigger>

    <ContextMenuContent class="w-54">
      <template v-for="(item, i) in menu" :key="i">
        <ContextMenuLabel v-if="item.label">
          {{ item.label }}
        </ContextMenuLabel>
        <ContextMenuSeparator v-else-if="item.divider" />
        <ContextMenuItem
          v-else-if="item.title && !item.items"
          :disabled="item.disabled"
          @select="item.action?.()"
        >
          {{ item.title }}
          <ContextMenuShortcut v-if="item.shortcut">
            {{ item.shortcut }}
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub v-else-if="item.title && item.items">
          <ContextMenuSubTrigger> {{ item.title }}</ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-48">
            <template v-for="(child, k) in item.items" :key="`child-${k}`">
              <ContextMenuSeparator v-if="child.divider" />
              <ContextMenuItem
                v-else
                :disabled="child.disabled"
                @select="item.action?.()"
              >
                {{ child.title }}
                <ContextMenuShortcut v-if="child.shortcut">
                  {{ child.shortcut }}
                </ContextMenuShortcut>
              </ContextMenuItem>
            </template>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </template>
    </ContextMenuContent>
  </ContextMenu>
</template>
