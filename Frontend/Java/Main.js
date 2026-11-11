
const API_URL = "https://hehe-art.vercel.app";

// Tải toàn bộ tranh lên Gallery

async function loadGallery() {
    const gallery = document.getElementById("artGallery");

    if (!gallery) {
        console.log("Trang này không có phần tử #artGallery");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/posts`);
        if (!res.ok) throw new Error("HTTP " + res.status);

        const posts = await res.json();
        console.log("Dữ liệu bài đăng:", posts);

        gallery.replaceChildren();

        posts.forEach(post => {
            const card = document.createElement("article");
            card.className = "art-card";

            const img = document.createElement("img");
            img.src = post.imageUrl;
            img.alt = "Tranh";
            img.loading = "lazy";
            img.onerror = () => {
                console.error("Không tải được ảnh:", post.imageUrl);
            };

            const author = document.createElement("p");
            author.className = "art-author";

            const username = typeof post.author === "object"
                ? post.author?.username
                : post.author;

            author.textContent = "@" + (username || post.username || "unknown");

            // Caption
            const caption = document.createElement("p");
            caption.className = "art-caption";
            caption.textContent = post.caption || "";

            card.append(img, author, caption);
            gallery.append(card);
        });

    } catch (err) {
        console.error("Không tải được Gallery:", err);
        gallery.textContent = "Không thể tải Gallery. Vui lòng thử lại sau.";
    }
}

loadGallery();

// LIGHTBOX
const lightbox = document.getElementById("artLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxAuthor = document.getElementById("lightboxAuthor");
const closeLightbox = document.getElementById("closeLightbox");
const gallery = document.getElementById("artGallery");

if (gallery && lightbox && lightboxImage && lightboxAuthor && closeLightbox) {

    gallery.addEventListener("click", function (e) {
        const img = e.target.closest(".art-card img");
        if (!img) return;

        const card = img.closest(".art-card");
        const author = card?.querySelector(".art-author");

        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt || "Tranh phóng to";
        lightboxAuthor.textContent = author?.textContent || "";

        lightbox.classList.add("active");
    });

    function closeArtLightbox() {
        lightbox.classList.remove("active");
        lightboxImage.src = "";
    }

    closeLightbox.addEventListener("click", closeArtLightbox);

    lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) closeArtLightbox();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeArtLightbox();
    });
}

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
