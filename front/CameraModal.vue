<template>
    <div class="camera-modal">
      <!-- 실시간 카메라 영상 -->
      <video ref="video" autoplay playsinline></video>
      <!-- 촬영 & 닫기 버튼 -->
      <button @click="capture">촬영</button>
      <button @click="$emit('close')">닫기</button>
      <canvas ref="canvas" style="display: none;"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, defineEmits } from 'vue'
  
  const props = defineProps({
    mode: String 
  })
  
  const emit = defineEmits(['captured', 'close'])
  
  const video = ref(null)
  const canvas = ref(null)
  let stream = null
  // 컴포넌트 뜰 때 카메라 켜기
  onMounted(async () => {
    stream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.value.srcObject = stream
  })
  // 꺼질 때 카메라 정지
  onBeforeUnmount(() => {
    if (stream) stream.getTracks().forEach(track => track.stop())
  })
  // 촬영 기능
  const capture = () => {
    const context = canvas.value.getContext('2d')
    canvas.value.width = video.value.videoWidth
    canvas.value.height = video.value.videoHeight
    context.drawImage(video.value, 0, 0)
    canvas.value.toBlob(blob => {
      if (blob) {
        emit('captured', blob)
      }
    }, 'image/jpeg')
  }
  </script>
  
  <style scoped>
  /* 카메라 표시 박스 창 설정 */
  .camera-modal {
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    padding: 1rem;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  /* 비디오 화면은 넓이는 100%, 최대 500px로 맞춤 */
  video {
    width: 100%;
    max-width: 500px;
    margin-bottom: 1rem;
  }
  </style>