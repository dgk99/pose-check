<template>
  <div class="login-container">
    <h1>Google 로그인</h1>
    
    <!-- 구글 로그인 버튼 위치 -->
    <div id="google-login-button" style="margin-top: 20px;"></div>
    <button @click="requestAccessToken" style="margin-top: 20px;">
      Google 계정으로 로그인
    </button>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";

// 환경변수에서 클라이언트 ID, API 주소 가져옴
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const router = useRouter();
let tokenClient = null; // 전역 변수로 저장

// 토큰 요청 함수
const requestAccessToken = () => {
  if (tokenClient) {
    tokenClient.requestAccessToken();
  } else {
    console.error("tokenClient 초기화 안됨");
  }
};

// 페이지 로드 시 실행
onMounted(async () => {
  await nextTick();

  // Google API 스크립트 불러오기
  function loadGoogleScript(callback) {
    if (window.google && window.google.accounts) {
      callback();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = callback;
    script.onerror = () => console.error("Google API 로드 실패");
    document.head.appendChild(script);
  }

  // 스크립트 로드 후 실행
  loadGoogleScript(() => {
    // 토큰 클라이언트 초기화
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: (response) => {
        console.log("Access Token:", response.access_token);

        // 백엔드에 토큰 전달해서 로그인 처리
        fetch(`${apiUrl}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: response.access_token }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("로그인 성공:", data);
            localStorage.setItem("user", JSON.stringify(data));
            router.push("/mypage");
          })
          .catch((err) => console.error("로그인 실패:", err));
      },
    });

    console.log("Google 로그인 초기화 완료");
  });
});
</script>

<style>
/* 로그인 화면 중앙 정렬 */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
</style>