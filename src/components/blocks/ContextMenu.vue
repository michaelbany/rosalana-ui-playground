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
import type { ContextMenuItem as ContextMenuItemType } from "@/composables/useContextMenu";

const handleTrigger = (e: MouseEvent) => {
  console.log("Context menu triggered", e);
};

const menu: ContextMenuItemType[] = [
  { label: "My Account" },
  { divider: true },
  { title: "Profile", icon: "ph:user", shortcut: "⇧⌘P" },
  { title: "Billing", icon: "ph:credit-card", shortcut: "⌘B" },
  { title: "Settings", icon: "ph:gear", shortcut: "⌘S" },
  { title: "Keyboard shortcuts", icon: "ph:keyboard", shortcut: "⌘K" },
  { divider: true },
  { title: "Team", icon: "ph:users", shortcut: "⇧⌘T" },
  {
    title: "Invite Users",
    icon: "ph:user-plus",
    items: [
      { title: "Email", icon: "ph:envelope", shortcut: "⇧⌘E" },
      { title: "Facebook", icon: "logos:facebook", shortcut: "⇧⌘F" },
      { title: "Twitter", icon: "logos:twitter", shortcut: "⇧⌘T" },
      { divider: true },
      { title: "More", icon: "ph:plus-circle", disabled: true },
    ],
  },
  { title: "Settings", icon: "ph:gear", shortcut: "⌘S" },
  { title: "Keyboard shortcuts", icon: "ph:keyboard", shortcut: "⌘K" },
  { divider: true },
  { title: "Github", icon: "ph:github-logo" },
  { title: "Support", icon: "ph:lifebuoy" },
  { title: "API", icon: "ph:cloud", disabled: true },
  { divider: true },
  { title: "Sign out", icon: "ph:sign-out" },
];
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger as-child @click.right="handleTrigger">
      <slot />
    </ContextMenuTrigger>

    <ContextMenuContent class="w-64">
      <template v-for="(item, i) in menu" :key="i">
        <ContextMenuLabel v-if="item.label" inset>
          {{ item.label }}
        </ContextMenuLabel>
        <ContextMenuSeparator v-else-if="item.divider" />
        <ContextMenuItem
          inset
          v-else-if="item.title && !item.items"
          :disabled="item.disabled"
        >
          {{ item.title }}
          <ContextMenuShortcut v-if="item.shortcut">
            {{ item.shortcut }}
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub v-else-if="item.title && item.items">
          <ContextMenuSubTrigger inset> {{ item.title }}</ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-48">
            <template v-for="(child, k) in item.items" :key="`child-${k}`">
              <ContextMenuSeparator v-if="child.divider" />
              <ContextMenuItem v-else :disabled="child.disabled">
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
