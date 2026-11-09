
const API_URL = "https://hehe-art.vercel.app";

async function Dangnhap() {
    const username = document.getElementById("email").value.trim();
    const password = document.getElementById("pass").value;
    const message = document.getElementById("message");

    if (!username || !password) {
        message.textContent = "Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/login`, {
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

        console.log("STATUS:", response.status);
        console.log("DATA:", data);

        if (!response.ok) {
            message.textContent = data.message || "Đăng nhập thất bại!";
            return;
        }

        if (!data.token || !data.user) {
            message.textContent = "Server trả về dữ liệu không hợp lệ!";
            return;
        }

        message.textContent = data.message || "Đăng nhập thành công!";

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("userId", data.user.id);

        setTimeout(() => {
            window.location.href = "../../index.html";
        }, 500);

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        message.textContent = "Không thể kết nối đến server!";
    }
}

function SignIn() {
    window.location.href = "./Dangky.html";
}
