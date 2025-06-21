<template>
  <div class="date-list">
    <h2>목록</h2>

    <!-- 날짜별 사진 그룹 리스트 -->
    <div
      v-for="(photos, date) in groupedPhotos"
      :key="date"
      class="date-item"
    >
      <!-- 날짜 선택 버튼 -->
      <button
        @click="$emit('select-date', date)"
        :class="{ active: selectedDate === date }"
      >
        {{ date }}
      </button>

      <!-- 해당 날짜 사진 삭제 -->
      <button @click.stop="$emit('delete-date', date)" class="delete-btn">
        삭제
      </button>
    </div>

    <!-- 새 사진 촬영 -->
    <button class="add-btn" @click="$emit('capture')">일반 사진 촬영</button>

    <!-- 선택된 날짜의 첫 번째 사진 보여주기 -->
    <div class="selected-photo-box">
      <h2>사진</h2>
      <div v-if="selectedDate && groupedPhotos[selectedDate]?.length > 0">
        <img
          :src="getPhotoUrl(groupedPhotos[selectedDate][0].photo_url)"
          class="photo"
        />
      </div>
      <div v-else>
        <p>해당 날짜에 사진이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// props: 사진 배열, 선택된 날짜, 날짜별 사진 묶음
const props = defineProps({
  photos: Array,
  selectedDate: String,
  groupedPhotos: Object,
})

// 환경변수에서 백엔드 주소 가져오기
const apiBase = import.meta.env.VITE_API_BASE_URL

// 사진 경로 만드는 함수
const getPhotoUrl = (url) => {
  if (!url || url.startsWith("https://lh3.googleusercontent.com")) return ""
  return url.startsWith("http") ? url : `${apiBase}${url}`
}
</script>

<style scoped>
/* 전체 박스 */
.date-list {
  width: 30%;
  padding: 10px;
}

/* 날짜 버튼들 */
.date-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

/* 선택된 날짜 강조 */
.date-item .active {
  background-color: red;
  color: white;
}

/* 삭제 버튼 */
.delete-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 3px 6px;
  cursor: pointer;
}

/* 촬영 버튼 */
.add-btn {
  margin-top: 10px;
  font-size: 18px;
  padding: 5px 10px;
}

/* 사진 박스 */
.selected-photo-box {
  margin-top: 20px;
}

/* 이미지 스타일 */
.photo {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border: 2px solid #ccc;
}
</style>