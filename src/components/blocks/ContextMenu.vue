<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuCheckboxItem,
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
import { ref, unref } from "vue";

function handleTrigger(e: MouseEvent) {
  const target =
    e.composedPath().find((n): n is HTMLElement => n instanceof HTMLElement) ??
    null;

  const { menu: targetMenu } = useContextMenu(target);
  console.log(
    targetMenu
      ? { items: targetMenu.items?.(), prevent: targetMenu.prevent }
      : "No context menu set"
  );

  menu.value = targetMenu?.prevent ? [] : targetMenu?.items?.() ?? [];

  const dx = e.clientX - last.x;
  const dy = e.clientY - last.y;
  const dt = Date.now() - last.time;
  const nearAndFast = dx * dx + dy * dy < 100 && dt < 1000; // 10 px & 1 s

  if (!menu.value.length || (wasOpen.value && nearAndFast)) {
    e.stopImmediatePropagation();
    wasOpen.value = false;
  } else {
    wasOpen.value = true;
  }

  last = { x: e.clientX, y: e.clientY, time: Date.now() };
}

const menu = ref<ContextMenuType[]>([]);
const wasOpen = ref(false);
let last = { x: 0, y: 0, time: 0 }; // last mouse position and time
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

        <template v-else-if="item.title && !item.items">
          <ContextMenuCheckboxItem
            v-if="item.checked !== undefined"
            :disabled="item.disabled"
            @select="item.action?.()"
            :model-value="unref(item.checked)"
          >
            {{ item.title }}
          </ContextMenuCheckboxItem>

          <ContextMenuItem
            v-else
            :disabled="item.disabled"
            @select="item.action?.()"
          >
            {{ item.title }}
            <ContextMenuShortcut v-if="item.shortcut">
              {{ item.shortcut }}
            </ContextMenuShortcut>
          </ContextMenuItem>
        </template>

        <ContextMenuSub v-else-if="item.title && item.items">
          <ContextMenuSubTrigger> {{ item.title }}</ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-48">
            <template v-for="(child, k) in item.items" :key="`child-${k}`">
              <ContextMenuSeparator v-if="child.divider" />

              <template v-else>
                <ContextMenuCheckboxItem
                  v-if="child.checked !== undefined"
                  :disabled="child.disabled"
                  @select="child.action?.()"
                  :model-value="unref(child.checked)"
                >
                  {{ child.title }}
                </ContextMenuCheckboxItem>

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
            </template>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </template>
    </ContextMenuContent>
  </ContextMenu>
</template>
