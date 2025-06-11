<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { computed } from "vue"

interface Props {
  /** Název ve formátu set:icon (např. mdi:home) nebo set-icon (mdi-home) */
  name: string
  /** 1em, 24, "2rem", … – pokud chceš raději tailwind třídy, ponech null  */
  size?: string | number | null
  class?: any
}

const props = withDefaults(defineProps<Props>(), {
  size: null,
  class: "",
})

/**
 * Iconify používá „set:icon“. Pokud uživatel napíše „mdi-home“, převedeme na „mdi:home“.
 */
const iconKey = computed(() =>
  props.name.includes(":") ? props.name : props.name.replace("-", ":"),
)
</script>

<template>
  <!-- • inline-block kvůli zarovnání s textem
       • [width]/[height] nastavíme jen když má uživatel size prop -->
  <Icon
    :icon="iconKey"
    v-bind="
      props.size
        ? { width: props.size, height: props.size }
        : {}
    "
    :class="['inline-block', props.class]"
  />
</template>
