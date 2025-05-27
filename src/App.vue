<script setup lang="ts">
import Container from "./components/Container.vue";
import UiButton from "./components/ui/button/UiButton.vue";

</script>

<template>
  <div class="flex flex-col items-center p-8 max-w-5xl mx-auto">
    
    <Container name="Button">
      <UiButton variant="destructive">Hello</UiButton>
    </Container>
  </div>
</template>
