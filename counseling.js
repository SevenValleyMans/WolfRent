import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyDDv6vVR1NHSgl8ZWHBZDqYqdWDHfX8KHM",
  authDomain: "wolf-rent-28e6c.firebaseapp.com",
  projectId: "wolf-rent-28e6c",
  storageBucket: "wolf-rent-28e6c.firebasestorage.app",
  messagingSenderId: "516126424503",
  appId: "1:516126424503:web:0a08118517990925883c32",
  measurementId: "G-R8JKZ86N6N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM 요소 참조
const counselingForm = document.getElementById("counseling-form");
const messagesContainer = document.getElementById("messages");

// 로그인 상태 확인 및 메시지 로드
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("로그인 사용자:", user);
    await loadCounselingMessages(user.uid);

    // 상담 제출 이벤트 핸들러 추가
    counselingForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const messageInput = document.getElementById("message");
      const message = messageInput.value.trim();

      if (!message) {
        alert("메시지를 입력하세요.");
        return;
      }

      try {
        await addDoc(collection(db, "counseling"), {
          userId: user.uid,
          userName: user.displayName || "익명",
          message: message,
          timestamp: new Date() // 현재 시간
        });

        alert("상담이 성공적으로 제출되었습니다.");
        messageInput.value = ""; // 입력 필드 초기화
        await loadCounselingMessages(user.uid); // 메시지 다시 로드
      } catch (error) {
        console.error("상담 제출 중 오류:", error);
        alert("상담 제출에 실패했습니다. 다시 시도해주세요.");
      }
    });
  } else {
    console.log("로그인되지 않음");
    messagesContainer.innerHTML = "<p>로그인 후 상담 기록을 확인하세요.</p>";
  }
});

// Firestore에서 고민 메시지와 답변 로드
async function loadCounselingMessages(userId) {
  const q = query(collection(db, "counseling"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  messagesContainer.innerHTML = ""; // 기존 메시지 초기화
  if (querySnapshot.empty) {
    messagesContainer.innerHTML = "<p>상담 기록이 없습니다.</p>";
    return;
  }

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const messageItem = document.createElement("div");
    messageItem.className = "message-card";

    // 고민 메시지 표시
    messageItem.innerHTML = `
      <p><strong>📩 고민:</strong> ${data.message}</p>
      <p><strong>🕒 날짜:</strong> ${new Date(data.timestamp.toDate()).toLocaleString()}</p>
    `;

    // 답변이 있을 경우 표시
    if (data.답변) {
      messageItem.innerHTML += `
        <p class="reply"><strong>💬 답변:</strong> ${data.답변}</p>
      `;
    } else {
      messageItem.innerHTML += `
        <p class="reply"><em>아직 답변이 없습니다.</em></p>
      `;
    }

    messagesContainer.appendChild(messageItem);
  });
}
