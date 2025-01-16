document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const messageElement = document.getElementById("loginMessage");

    // 간단한 유효성 검사
    if (!username || !password) {
        messageElement.textContent = "아이디와 비밀번호를 입력하세요.";
        return;
    }

    messageElement.style.color = "green";
    messageElement.textContent = "로그인 성공!";

    // 데이터 처리 로직 (예: 서버에 전송)
    console.log({
        username: username,
        password: password
    });
});
