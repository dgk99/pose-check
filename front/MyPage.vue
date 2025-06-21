<template>
  <div class="mypage-container">
    <h1>마이페이지</h1>
    <p>이메일: {{ user.email }}</p>

    <div class="content-container">
      <!-- 대표 사진 컴포넌트 -->
      <FirstPhoto
        :photo-url="user.photoUrl"
        @capture="uploadFirstPhotoFromCamera"
      />

      <!-- 일반 사진 목록 컴포넌트 -->
      <PhotoList
        :photos="photos"
        :selected-date="selectedDate"
        :grouped-photos="groupedPhotos"
        @delete-date="deletePhotosByDate"
        @capture="uploadNormalPhotoFromCamera"
        @select-date="(date) => selectedDate = date"
      />
    </div>

    <!-- 카메라 모달: 촬영 시 보여짐 -->
    <CameraModal
      v-if="showCamera"
      :mode="cameraMode"
      @captured="handleCaptured"
      @close="showCamera = false"
    />

    <!-- 로그아웃 & 탈퇴 버튼 -->
    <button class="logout-btn" @click="logout">로그아웃</button>
    <button @click="deleteAccount">회원 탈퇴</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

import FirstPhoto from '@/components/withAPI/FirstPhoto.vue'
import PhotoList from '@/components/withAPI/PhotoList.vue'
import CameraModal from '@/components/withAPI/CameraModal.vue'

// 환경변수에서 API 주소 가져옴
const apiBase = import.meta.env.VITE_API_BASE_URL

// 사용자 정보 / 사진 관련 상태
const user = ref({ email: '', name: '', photoUrl: '' })
const photos = ref([])
const selectedDate = ref('')
const showCamera = ref(false)
const cameraMode = ref('normal')

// 날짜별 사진 묶기
const groupedPhotos = computed(() => {
  const grouped = {}
  photos.value.forEach(photo => {
    const date = new Date(photo.uploaded_at).toLocaleDateString('sv-SE')
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(photo)
  })
  return Object.fromEntries(Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])))
})

// 로컬스토리지에서 로그인된 사용자 정보 불러오기
const fetchUserData = () => {
  const stored = JSON.parse(localStorage.getItem('user'))
  if (stored) {
    user.value.email = stored.email
    user.value.name = stored.name
  }
}

// 대표 사진 불러오기
const fetchFirstPhoto = async () => {
  try {
    const res = await axios.get(`${apiBase}/api/user/first-photo/${user.value.email}`)
    user.value.photoUrl = res.data.photoUrl
  } catch {
    user.value.photoUrl = ''
  }
}

// 일반 사진들 불러오기
const fetchPhotos = async () => {
  const res = await axios.get(`${apiBase}/api/photos/by-date/${user.value.email}/all`)
  photos.value = res.data.filter(p => p.is_first !== 1)

  // 날짜 목록 중 가장 최신 날짜 선택
  const dates = Object.keys(groupedPhotos.value)
  if (dates.length > 0) selectedDate.value = dates[0]
}

// 일반 사진 촬영 요청
const uploadNormalPhotoFromCamera = () => {
  cameraMode.value = 'normal'
  showCamera.value = true
}

// 대표 사진 촬영 요청
const uploadFirstPhotoFromCamera = () => {
  cameraMode.value = 'first'
  showCamera.value = true
}

// 촬영 완료 시 실행 (사진 업로드)
const handleCaptured = async (blob) => {
  const formData = new FormData()
  formData.append('photo', blob, 'captured.jpg')
  formData.append('user_email', user.value.email)

  if (cameraMode.value === 'first') {
    const res = await axios.post(`${apiBase}/api/photos/first`, formData)
    user.value.photoUrl = res.data.photoUrl
  } else {
    const res = await axios.post(`${apiBase}/api/photos/add`, formData)
    const newPhoto = {
      id: res.data.id,
      photo_url: res.data.photoUrl,
      uploaded_at: res.data.uploaded_at,
    }
    photos.value.push(newPhoto)
    selectedDate.value = new Date(newPhoto.uploaded_at).toLocaleDateString('sv-SE')
  }

  showCamera.value = false
}

// 날짜별 사진 삭제
const deletePhotosByDate = async (date) => {
  await axios.delete(`${apiBase}/api/photos/delete-by-date/${user.value.email}/${date}`)
  photos.value = photos.value.filter(p => new Date(p.uploaded_at).toLocaleDateString('sv-SE') !== date)
  await fetchFirstPhoto() // 대표 사진 다시 불러오기
}

// 로그아웃: 로컬스토리지 초기화
const logout = () => {
  localStorage.removeItem('user')
  window.location.href = '/'
}

// 회원 탈퇴
const deleteAccount = async () => {
  if (!confirm('정말 탈퇴하시겠습니까?')) return
  await axios.delete(`${apiBase}/api/user/delete/${user.value.email}`)
  logout()
}

// 초기 데이터 불러오기
onMounted(() => {
  fetchUserData()
  fetchFirstPhoto()
  setTimeout(() => fetchPhotos(), 300) // 약간의 딜레이 줌
})
</script>

<style scoped>
/* 전체 마이페이지 스타일 */
.mypage-container {
  text-align: center;
  margin-top: 20px;
}

/* 콘텐츠 영역: 좌우 배치 */
.content-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
}

/* 로그아웃 버튼 */
.logout-btn {
  margin-top: 30px;
  padding: 8px 16px;
}
</style>