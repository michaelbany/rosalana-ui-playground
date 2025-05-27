<script setup lang="ts">
import Container from "./components/Container.vue";
import NewButton from "./components/ui/button/NewButton.vue";
import UiButton from "./components/ui/button/UiButton.vue";
</script>

<template>
  <div class="flex flex-col items-center p-8 max-w-5xl mx-auto">
    <Container name="Button">
      <UiButton variant="destructive">Hello</UiButton>
      <NewButton>New</NewButton>
    </Container>
  </div>
</template>
