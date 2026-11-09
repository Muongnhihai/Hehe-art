const API_URL = "https://hehe-art.vercel.app";

async function Dangky() {
    const username = document.getElementById("email").value.trim();
    const password = document.getElementById("pass").value;
    const message = document.getElementById("message");

    if (!username || !password) {
        message.textContent = "Vui lòng nhập đầy đủ tài khoản và mật khẩu!";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        message.textContent = data.message || (
            response.ok ? "Đăng ký thành công!" : "Đăng ký thất bại!"
        );

    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        message.textContent = "Không kết nối được Backend!";
    }
}

function SignIn() {
    window.location.href = "./Web.html";
}

function showSupport() {
    window.location.href = "https://www.facebook.com/muong.nhi.hai";
}