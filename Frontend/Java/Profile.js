
const API_URL = "https://hehe-art.vercel.app";

const token = localStorage.getItem("token");

let currentProfile = null;

function goToUpload() {
    window.location.href = "./Upload.html";
}

// Hiển thị avatar
function renderAvatar(elementId, avatarUrl, fallback) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.replaceChildren();

    if (avatarUrl) {
        const img = document.createElement("img");
        img.src = avatarUrl;
        img.alt = "Ảnh đại diện";
        element.appendChild(img);
    } else {
        element.textContent = fallback;
    }
}

// Cập nhật giao diện hồ sơ
function renderProfile(user) {
    currentProfile = user;

    const username = user.username || "";
    const displayName = user.displayName || username;
    const firstLetter = username.charAt(0).toUpperCase() || "H";

    document.getElementById("username").textContent = displayName;
    document.getElementById("nickname").textContent = "@" + username;
    document.getElementById("bio").textContent =
        user.bio || "Chưa có tiểu sử";

    renderAvatar("avatar", user.avatarUrl, firstLetter);
    renderAvatar("miniAvatar", user.avatarUrl, firstLetter);
}

// Lấy dữ liệu từ MongoDB
async function loadProfile() {
    if (!token) {
        alert("Vui lòng đăng nhập!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/profile`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Không thể tải hồ sơ!");
        }

        renderProfile(data.user || data);

    } catch (error) {
        console.error("Lỗi tải hồ sơ:", error);
        alert(error.message);
    }
}

// Mở hộp chỉnh sửa
function openEditProfile() {
    if (!currentProfile) return;

    document.getElementById("editDisplayName").value =
        currentProfile.displayName || currentProfile.username || "";

    document.getElementById("editBio").value =
        currentProfile.bio || "";

    document.getElementById("editAvatar").value = "";

    document.getElementById("editModal").classList.add("active");
}

// Đóng hộp chỉnh sửa
function closeEditProfile() {
    document.getElementById("editModal").classList.remove("active");
}

// Lưu hồ sơ
async function saveProfile() {
    const displayName =
        document.getElementById("editDisplayName").value.trim();

    const bio =
        document.getElementById("editBio").value.trim();

    const avatarFile =
        document.getElementById("editAvatar").files[0];

    if (!displayName) {
        alert("Tên hiển thị không được để trống!");
        return;
    }

    const formData = new FormData();
    formData.append("displayName", displayName);
    formData.append("bio", bio);

    if (avatarFile) {
        formData.append("avatar", avatarFile);
    }

    try {
        const res = await fetch(`${API_URL}/api/profile`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Cập nhật thất bại!");
        }

        renderProfile(data.user || data);
        closeEditProfile();

        alert("Cập nhật hồ sơ thành công!");

    } catch (error) {
        console.error("Lỗi cập nhật hồ sơ:", error);
        alert(error.message);
    }
}

// Tự động tải hồ sơ khi mở trang
document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    loadMyPosts();
});
// Định dạng ngày đăng
function formatDate(date) {
    return new Date(date).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// Tải bài đăng cá nhân
async function loadMyPosts() {
    const postGrid = document.getElementById("postGrid");
    const emptyPost = document.getElementById("emptyPost");
    const postCount = document.getElementById("postCount");

    try {
        const res = await fetch(`${API_URL}/api/my-posts`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const posts = await res.json();

        if (!res.ok) {
            throw new Error(posts.message || "Không thể tải bài đăng!");
        }

        postGrid.replaceChildren();

        postCount.textContent = posts.length;

        if (posts.length === 0) {
            emptyPost.style.display = "block";
            return;
        }

        emptyPost.style.display = "none";

        posts.forEach(post => {
            const card = document.createElement("article");
            card.className = "post-card";

            const imageContainer = document.createElement("div");
            imageContainer.className = "image-container";

            const img = document.createElement("img");
            img.src = post.imageUrl;
            img.alt = post.caption || "Artwork";
            img.loading = "lazy";

            const postInfo = document.createElement("div");
            postInfo.className = "post-info";

            const title = document.createElement("h3");
            title.textContent = post.caption || "Tác phẩm không có chú thích";

            const date = document.createElement("p");
            date.textContent = "Đăng ngày " + formatDate(post.createdAt);

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-post";
            deleteButton.textContent = "Xóa bài";
            deleteButton.onclick = () => deletePost(post._id);

            imageContainer.appendChild(img);
            postInfo.append(title, date, deleteButton);
            card.append(imageContainer, postInfo);

            postGrid.appendChild(card);
        });

    } catch (error) {
        console.error("Lỗi tải bài đăng:", error);
        alert(error.message);
    }
}

// Xóa bài đăng
async function deletePost(postId) {
    const confirmed = confirm(
        "Bạn có chắc chắn muốn xóa bài đăng này không?"
    );

    if (!confirmed) return;

    try {
        const res = await fetch(`${API_URL}/api/posts/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Xóa bài thất bại!");
        }

        alert("Đã xóa bài đăng!");

        // Tải lại danh sách và cập nhật số bài đăng
        loadMyPosts();

    } catch (error) {
        console.error("Lỗi xóa bài:", error);
        alert(error.message);
    }
}

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    const confirmLogout = confirm("Bạn có chắc muốn đăng xuất không?");

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("username");

    window.location.href = "../../index.html";
});