<template>
  <div>
    <div v-for="post in posts" :key="post.id" class="post-item">
      <div v-if="editingId === post.id">
        <input v-model="editData.title" />
        <textarea v-model="editData.content"></textarea>
        <div class="post-actions">
          <button @click="saveEdit(post.id)">Save</button>
          <button class="secondary" @click="editingId = null">Cancel</button>
        </div>
      </div>

      <div v-else>
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <div class="post-actions">
          <button class="secondary" @click="startEdit(post)">Edit</button>
          <button class="danger" @click="removePost(post.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { postApi } from '../api';

defineProps(['posts']);
const emit = defineEmits(['refresh']);

const editingId = ref(null);
const editData = reactive({ title: '', content: '' });

const startEdit = (post) => {
  editingId.value = post.id;
  editData.title = post.title;
  editData.content = post.content;
};

const saveEdit = async (id) => {
  await postApi.updatePost(id, editData.title, editData.content);
  editingId.value = null;
  emit('refresh');
};

const removePost = async (id) => {
  await postApi.deletePost(id);
  emit('refresh');
};
</script>