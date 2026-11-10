
const API_URL = "THAY_BANG_URL_BACKEND_CUA_BAN";

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
document.addEventListener("DOMContentLoaded", loadProfile);
