<template>
  <div class="w-full h-full flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <div class="flex justify-start items-center gap-1">
        <UiButton
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'text-red-500': editor?.isActive('bold') }"
          size="icon"
          variant="secondary"
        >
          <UiIcon name="lucide:bold" />
        </UiButton>
        <UiButton
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'text-red-500': editor?.isActive('italic') }"
          size="icon"
          variant="secondary"
        >
          <UiIcon name="lucide:italic" />
        </UiButton>
        <UiButton
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'text-red-500': editor?.isActive('strike') }"
          size="icon"
          variant="secondary"
        >
          <UiIcon name="lucide:strikethrough" />
        </UiButton>
      </div>
      <div class="flex justify-start items-center gap-1">
        <UiButton
          @click="editor.chain().focus().undo().run()"
          size="icon"
          variant="secondary"
        >
          <UiIcon name="lucide:undo" />
        </UiButton>
        <UiButton
          @click="editor.chain().focus().redo().run()"
          size="icon"
          variant="secondary"
        >
          <UiIcon name="lucide:redo" />
        </UiButton>
      </div>
    </div>
    <div>
      <EditorContent :editor="editor" class="w-full h-full" />
    </div>
    <pre>
      {{ editor?.getJSON() }}
    </pre>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import UiButton from "../button/UiButton.vue";
import UiIcon from "../UiIcon.vue";
import { onBeforeMount, ref } from "vue";

const editor = useEditor({
  editorProps: {
    attributes: {
      class: "prose prose-md focus:outline-none",
    },
  },
  content: "<p>I'm running Tiptap with Vue.js. 🎉</p>",
  extensions: [StarterKit],
});
</script>
