let imageBase64 = null;
let selectedTheme = '';

function createFirework() {
    const firework = document.createElement('div');
    firework.className = 'firecracker';
    firework.style.left = Math.random() * window.innerWidth + 'px';
    firework.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    document.querySelector('.firework').appendChild(firework);

    setTimeout(() => {
        firework.remove();
    }, 3000);
}

function showThemeForm() {
    const homeContent = document.getElementById('homeContent');
    const themeContainer = document.getElementById('themeContainer');

    homeContent.classList.add('hide');
    setTimeout(() => {
        homeContent.style.display = 'none';
        themeContainer.style.display = 'block';
        themeContainer.classList.add('show');
    }, 500);
}

function selectTheme(themeId) {
    selectedTheme = themeId;
    document.getElementById('selectedTheme').value = themeId;
    
    const themeContainer = document.getElementById('themeContainer');
    const formContainer = document.getElementById('formContainer');

    themeContainer.classList.remove('show');
    if (themeId === "02"){
        document.getElementById("form-image").style.display = "none";
        document.getElementById("image").removeAttribute("required");
    }
    setTimeout(() => {
        themeContainer.style.display = 'none';
        formContainer.style.display = 'block';
        formContainer.classList.add('show');
    }, 500);
}

setInterval(createFirework, 300);

function previewImage(event) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('imagePreviewImg');
    const file = event.target.files[0];

    if (file) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function () {
            if (reader.result) {
                img.src = reader.result.toString();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        console.error('Could not get canvas context');
                        return;
                    }

                    let width = img.width;
                    let height = img.height;
                    const maxSize = 600;

                    if (width > height && width > maxSize) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

                    if (previewImg) {
                        previewImg.style.display = 'block';
                        previewImg.setAttribute('src', compressedBase64);
                        imageBase64 = compressedBase64;
                    }
                }
            }
        }
        reader.readAsDataURL(file);
    }
}

document.getElementById('wishForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const loadingEl = document.getElementById('loading');
    const formContainerEl = document.getElementById('formContainer');
    const successMessageEl = document.getElementById('successMessage');
    const wishLinkEl = document.getElementById('wishLink');
    const nameInput = document.getElementById('name');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const imageInput = selectedTheme === "01" ? document.getElementById('image') : null;

    if (!nameInput || !titleInput || !contentInput || 
        !loadingEl || !formContainerEl || !successMessageEl || !wishLinkEl) {
        alert('Có lỗi xảy ra: Không tìm thấy các trường form');
        return;
    }

    // Kiểm tra điều kiện tùy theo theme
    if (selectedTheme == "01") {
        if (!nameInput.value || !titleInput.value || !contentInput.value || !imageInput?.files[0]) {
            alert('Vui lòng điền đầy đủ thông tin và chọn hình ảnh');
            return;
        }
    } else {
        if (!selectedTheme || !nameInput.value || !titleInput.value || !contentInput.value) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }
    }

    loadingEl.classList.add('show');

    try {
        const formData = new FormData();
        formData.append('name', nameInput.value);
        formData.append('title', titleInput.value);
        formData.append('content', contentInput.value);
        formData.append('theme_id', selectedTheme);
        
        // Chỉ thêm ảnh nếu là theme 01
        if (selectedTheme === "01" && imageInput?.files[0]) {
            formData.append('image', imageInput.files[0]);
        }

        const response = await fetch('/api/v1/saveData', {
            method: 'POST',
            headers: {
                'x-api-key': api_key
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Network response was not ok');
        }

        const result = await response.json();

        if (result.error === 0) {
            formContainerEl.style.display = 'none';
            successMessageEl.style.display = 'block';

            wishLinkEl.innerHTML = `${window.location.origin}/${result.id}`;
            wishLinkEl.href = `${window.location.origin}/${result.id}`;
        } else {
            alert('Có lỗi xảy ra: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi gửi lời chúc: ' + error.message);
    } finally {
        loadingEl.classList.remove('show');
    }
});