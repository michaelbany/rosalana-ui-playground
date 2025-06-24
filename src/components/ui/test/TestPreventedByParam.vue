<script setup lang="ts">
import { useContextMenu } from "@/composables/useContextMenu";
import { onMounted, ref } from "vue";
</script>
<template>
  <div
    data-prevent-context-menu
    class="flex h-[150px] p-3 w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
  >
    Prevented By Data Attribute
  </div>
</template>
