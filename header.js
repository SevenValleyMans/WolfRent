// header.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";

// (1) Firebase 프로젝트 설정 (질문에서 주신 index.html의 firebaseConfig 그대로)
const firebaseConfig = {
  apiKey: "AIzaSyDDv6vVR1NHSgl8ZWHBZDqYqdWDHfX8KHM",
  authDomain: "wolf-rent-28e6c.firebaseapp.com",
  projectId: "wolf-rent-28e6c",
  storageBucket: "wolf-rent-28e6c.firebasestorage.app",
  messagingSenderId: "516126424503",
  appId: "1:516126424503:web:0a08118517990925883c32",
  measurementId: "G-R8JKZ86N6N"
};

// (2) Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// (3) 공통 로직: onAuthStateChanged + 구글 로그인 버튼 처리
document.addEventListener("DOMContentLoaded", () => {
  const googleLoginBtn = document.getElementById("googleLogin");

  // A. 로그인 상태 변화 감지
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("이미 로그인됨:", user);
      // 구글 로그인 버튼 숨기기
      if (googleLoginBtn) {
        googleLoginBtn.style.display = "none";
      }
      // 사용자 이름 표시
      showUserName(user.displayName);
    } else {
      console.log("로그인 안 됨");
      // 로그인되지 않은 상태라면, 로그인 버튼 보이기
      if (googleLoginBtn) {
        googleLoginBtn.style.display = "inline-block";
      }
    }
  });

  // B. 구글 로그인 버튼 클릭 이벤트
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", (event) => {
      event.preventDefault();
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("로그인 성공:", result.user);
          if (googleLoginBtn) {
            googleLoginBtn.style.display = "none";
          }
          // 사용자 이름 표시
          showUserName(result.user.displayName);
        })
        .catch((error) => {
          console.error("로그인 오류:", error);
        });
    });
  } else {
    console.error("구글 로그인 버튼을 찾을 수 없습니다.");
  }
});

// (4) 사용자 이름 표시 함수
function showUserName(name) {
  // 혹시 이미 표시돼 있으면 중복 추가 방지
  if (document.getElementById("userNameSpan")) return;

  const userNameElement = document.createElement("span");
  userNameElement.id = "userNameSpan";
  userNameElement.textContent = name;
  userNameElement.style.fontSize = "20px";
  userNameElement.style.color = "#fff";
  userNameElement.style.marginLeft = "10px";

  const googleLoginContainer = document.querySelector(".googleLogin");
  if (googleLoginContainer) {
    googleLoginContainer.appendChild(userNameElement);
  }
}
