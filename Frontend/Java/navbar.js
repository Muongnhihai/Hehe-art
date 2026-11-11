console.log("Navbar.js đã chạy!");
(() => {
    const API_URL = "https://hehe-art.vercel.app";

    async function loadNavbarUser() {
        const authActions = document.getElementById("authActions");
        const profileBtn = document.getElementById("profileBtn");
        const avatar = document.getElementById("profileAvatar");
        const fallback = document.getElementById("avatarFallback");

        if (!authActions || !profileBtn || !avatar || !fallback) return;

        const token = localStorage.getItem("token");

        // Chưa đăng nhập
        if (!token) {
            authActions.hidden = false;
            profileBtn.hidden = true;
            return;
        }

        // Đã đăng nhập: hiện avatar
        authActions.hidden = true;
        profileBtn.hidden = false;

        const showFallback = (username) => {
            fallback.textContent = username
                ? username.charAt(0).toUpperCase()
                : "?";
            fallback.hidden = false;
            avatar.hidden = true;
        };

        showFallback(localStorage.getItem("username"));

        try {
            const response = await fetch(`${API_URL}/api/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Không thể tải thông tin người dùng");
            }

            const data = await response.json();
            const user = data.user || data;

            const username = user.username || localStorage.getItem("username");
            showFallback(username);

            if (username) {
                localStorage.setItem("username", username);
            }

            if (user.avatarUrl) {
                avatar.src = user.avatarUrl;
                avatar.hidden = false;
                fallback.hidden = true;

                avatar.onerror = () => {
                    showFallback(username);
                };
            }
        } catch (error) {
            console.error("Không tải được avatar:", error);
        }
    }

    document.addEventListener("DOMContentLoaded", loadNavbarUser);
})();
