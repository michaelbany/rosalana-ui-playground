<script setup lang="ts">
import Container from './components/Container.vue';
import EditorComponent from './components/ui/editor/EditorComponent.vue';
</script>

<template>
  <div class="flex flex-col items-center p-8 max-w-5xl mx-auto">
    <Container name="Editor">
      <EditorComponent />
    </Container>
  </div>
</template>
