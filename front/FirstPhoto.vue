<template>
    <div class="fixed-photo-box">
      <h2>처음 찍은 사진</h2>
      <!-- 사진 있을 때만 이미지 보여주기 -->
      <img :src="getPhotoUrl(photoUrl)" class="fixed-photo" v-if="photoUrl" />
      <!-- 고정시킬 대표 사진 촬영 버튼 -->
      <button @click="$emit('capture')">대표 사진 촬영</button>
    </div>
  </template>
  
  <script setup>
  // 사진 경로 설정
  const props = defineProps({
    photoUrl: String
  })
  
  const getPhotoUrl = (url) => {
    if (!url || url.startsWith("https://lh3.googleusercontent.com")) return ""
    return url.startsWith("http") ? url : `http://210.101.236.158.nip.io:5002${url}`
  }
  </script>
  
  <style scoped>
  /* 전체 박스 설정 */
  .fixed-photo-box {
    width: 30%;
    padding: 10px;
  }
  /* 사진 설정 */
  .fixed-photo {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    border: 2px solid #ccc;
  }
  </style>