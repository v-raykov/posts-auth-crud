<template>
  <div id="app">
    <nav>
      <h1>Viktor - 21105</h1>
      <button v-if="token" @click="logout">Logout</button>
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
const posts = ref([]);

const checkAuth = () => {
  token.value = localStorage.getItem('token');
  if (token.value) fetchPosts();
};

const fetchPosts = async () => {
  const { data } = await postApi.getPosts();
  posts.value = data;
};

const logout = () => {
  localStorage.removeItem('token');
  token.value = null;
  posts.value = [];
};

onMounted(checkAuth);
</script>