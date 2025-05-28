<script setup lang="ts">
import { ref } from "vue";
import Container from "./components/Container.vue";
import NewButton from "./components/ui/button/NewButton.vue";
import UiButton from "./components/ui/button/UiButton.vue";

const buttonText = ref("Hello World");
const loading = ref(false);

const handleClick = () => {
  if (buttonText.value === "Hello World") {
    buttonText.value = "Michael!";
  } else {
    buttonText.value = "Hello World";
  }
};

const toggleLoading = () => {
  loading.value = !loading.value;
};
</script>

<template>
  <div class="flex flex-col items-center p-8 max-w-5xl mx-auto">
    <Container name="Button">
      <UiButton :variant="'destructive'" @click="toggleLoading">Toggle Loading</UiButton>
      <UiButton :variant="'destructive'" @click="handleClick">Change Text</UiButton>
      <NewButton :loading="loading">{{ buttonText }}</NewButton>
    </Container>
  </div>
</template>
