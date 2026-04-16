<template>
  <div id="app">
    <nav>
      <h1>Viktor - 21105</h1>
      <div v-if="token">
        <span>Logged as: {{ user.email }}</span>
        <button @click="logout">Logout</button>
      </div>
    </nav>

    <div v-if="!token">
      <LoginForm @auth-success="checkAuth" />
    </div>

    <div v-else>
      <PostForm @post-created="fetchPosts" />
      <hr />
      <PostList :posts="posts" @refresh="fetchPosts" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LoginForm from './components/LoginForm.vue';
import PostForm from './components/PostForm.vue';
import PostList from './components/PostList.vue';
import { postApi } from './api';

const token = ref(null);
const user = ref(null);
const posts = ref([]);

const checkAuth = () => {
  token.value = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  user.value = userStr ? JSON.parse(userStr) : null;
  if (token.value) fetchPosts();
};

const fetchPosts = async () => {
  const { data } = await postApi.getPosts();
  posts.value = data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  token.value = null;
  user.value = null;
  posts.value = [];
};

onMounted(checkAuth);
</script>
