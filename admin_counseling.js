import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();
const adminMessagesContainer = document.getElementById("admin-messages");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // 관리자인지 확인하는 로직
        const adminEmails = ["hermann8hesse@gmail.com", "dlrkdgml0716@gmail.com"];
        if (!adminEmails.includes(user.email)) {
            alert("관리자만 접근할 수 있습니다.");
            window.location.href = "/index.html";
            return;
        }

        // 모든 고민 메시지 로드
        loadAllCounselingMessages();
    } else {
        alert("로그인 후 이용 가능합니다.");
        window.location.href = "/login.html";
    }
});

// Firestore에서 모든 고민 불러오기
async function loadAllCounselingMessages() {
    const querySnapshot = await getDocs(collection(db, "counseling"));
    adminMessagesContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const messageId = doc.id;

        // 고민 메시지 카드 생성
        const messageItem = document.createElement("div");
        messageItem.className = "message-card";
        messageItem.innerHTML = `
          <strong>${data.userName}:</strong> ${data.message}
          <p><strong>현재 답변:</strong> ${data.답변 || "아직 답변이 없습니다."}</p>
          <textarea id="reply-${messageId}" placeholder="답변을 입력하세요"></textarea>
          <button onclick="submitReply('${messageId}')">답변 저장</button>
        `;
        adminMessagesContainer.appendChild(messageItem);
    });
}

// Firestore에 답변 업데이트
window.submitReply = async function (messageId) {
    const replyText = document.getElementById(`reply-${messageId}`).value.trim();
    if (!replyText) {
        alert("답변을 입력하세요.");
        return;
    }

    try {
        const messageRef = doc(db, "counseling", messageId);
        await updateDoc(messageRef, { 답변: replyText });
        alert("답변이 저장되었습니다.");
        loadAllCounselingMessages(); // 새로고침
    } catch (error) {
        console.error("답변 저장 중 오류:", error);
        alert("답변 저장에 실패했습니다.");
    }
};
