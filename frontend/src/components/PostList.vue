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
        <p class="post-meta">Author: {{ post.author }}</p>
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <p class="post-meta">Likes: {{ post.likes || 0 }}</p>
        <div class="post-actions">
          <button v-if="post.liked" class="like-btn" @click="unlikePost(post.id)">Unlike</button>
          <button v-else class="like-btn" @click="likePost(post.id)">Like</button>
          <button v-if="isOwner(post)" class="secondary" @click="startEdit(post)">Edit</button>
          <button v-if="isOwner(post)" class="danger" @click="removePost(post.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { postApi } from '../api';

const props = defineProps(['posts']);
const emit = defineEmits(['refresh']);

const editingId = ref(null);
const editData = reactive({ title: '', content: '' });

const currentUser = computed(() => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.email : null;
    } catch(e) {
        return null;
    }
});

const isOwner = (post) => currentUser.value === post.author;

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

const likePost = async (id) => {
  await postApi.likePost(id);
  emit('refresh');
};

const unlikePost = async (id) => {
  await postApi.unlikePost(id);
  emit('refresh');
};
</script>
