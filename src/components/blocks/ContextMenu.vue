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
import { ref } from "vue";

function handleTrigger(e: MouseEvent) {
  const target =
    e.composedPath().find((n): n is HTMLElement => n instanceof HTMLElement) ??
    null;

  const { items, prevent } = useContextMenu(target).get();
  menu.value = prevent ? [] : items;
}

const menu = ref<ContextMenuType[]>([]);
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger as-child @contextmenu="handleTrigger">
      <slot />
    </ContextMenuTrigger>

    <ContextMenuContent class="w-54" v-if="menu.length">
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
