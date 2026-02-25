<template>
  <div class="card">
    <h3>Create New Post</h3>
    <form @submit.prevent="submitPost">
      <input v-model="title" placeholder="Title" required />
      <textarea v-model="content" placeholder="Content"></textarea>
      <button type="submit">Publish Post</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { postApi } from '../api';

const emit = defineEmits(['post-created']);
const title = ref('');
const content = ref('');

const submitPost = async () => {
  await postApi.createPost(title.value, content.value);
  title.value = '';
  content.value = '';
  emit('post-created');
};
</script>