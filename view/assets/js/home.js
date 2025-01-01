let imageBase64 = null;

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

function showWishForm() {
    const homeContent = document.getElementById('homeContent');
    const formContainer = document.getElementById('formContainer');
    
    homeContent.classList.add('hide');
    
    setTimeout(() => {
        homeContent.style.display = 'none';
        formContainer.style.display = 'block';
        
        // Trigger reflow
        formContainer.offsetHeight;
        
        formContainer.classList.add('show');
    }, 500);
}

setInterval(createFirework, 300);

function previewImage(event) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('imagePreviewImg');
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            previewImg.style.display = 'block';
            previewImg.src = reader.result;
            imageBase64 = reader.result;
        }
        reader.readAsDataURL(file);
    }
}

document.getElementById('wishForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Show loading spinner
    document.getElementById('loading').classList.add('show');

    const wishData = {
        name: document.getElementById('name').value,
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        image: imageBase64
    };

    try {
        const response = await fetch('/api/v1/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': api_key
            },
            body: JSON.stringify(wishData)
        });

        const result = await response.json();

        if (result.error === 0) {
            document.getElementById('formContainer').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('wishLink').textContent = `${window.location.origin}/${result.id}`;
        } else {
            alert('Có lỗi xảy ra: ' + result.message);
        }
    } catch (error) {
        alert(`Có lỗi xảy ra khi gửi lời chúc.\n${error}`);
    } finally {
        document.getElementById('loading').classList.remove('show');
    }
});