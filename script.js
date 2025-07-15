// Tab switching functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Update placeholder based on selected tab
        const tabType = this.getAttribute('data-tab');
        updatePlaceholder(tabType);
    });
});

function updatePlaceholder(tabType) {
    const input = document.getElementById('facebook-link');
    const placeholders = {
        website: 'Nhập Link website cần lấy ID',
        group: 'Nhập Link group Facebook cần lấy ID',
        fanpage: 'Nhập Link fanpage Facebook cần lấy ID',
        youtube: 'Nhập Link Youtube cần lấy ID'
    };
    
    input.placeholder = placeholders[tabType] || 'Nhập Link facebook cần lấy ID';
}

// Main function to get ID
function getID() {
    const linkInput = document.getElementById('facebook-link');
    const resultDiv = document.getElementById('result');
    const idResultDiv = document.getElementById('id-result');
    
    const link = linkInput.value.trim();
    
    if (!link) {
        showError('Vui lòng nhập link Facebook!');
        return;
    }
    
    // Show loading state
    const btn = document.querySelector('.get-id-btn');
    btn.innerHTML = 'Đang xử lý...';
    btn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        try {
            const id = extractFacebookID(link);
            if (id) {
                showResult(id);
                showSuccess('Lấy ID thành công!');
            } else {
                showError('Không thể lấy ID từ link này. Vui lòng kiểm tra lại!');
            }
        } catch (error) {
            showError('Có lỗi xảy ra. Vui lòng thử lại!');
        }
        
        // Reset button
        btn.innerHTML = 'Lấy ID';
        btn.disabled = false;
    }, 1500);
}

// Function to extract Facebook ID from URL
function extractFacebookID(url) {
    // Remove any whitespace
    url = url.trim();
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    try {
        const urlObj = new URL(url);
        
        // Different patterns for Facebook URLs
        const patterns = [
            /facebook\.com\/(.+?)\/posts\/(\d+)/,
            /facebook\.com\/(.+?)\/photos\/(\d+)/,
            /facebook\.com\/profile\.php\?id=(\d+)/,
            /facebook\.com\/(.+?)(?:\/|$)/,
            /fb\.me\/(.+)/,
            /m\.facebook\.com\/(.+?)(?:\/|$)/
        ];
        
        for (let pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                // Generate a mock ID (in real implementation, you'd call Facebook API)
                return generateMockID(match[1] || match[2]);
            }
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

// Generate mock ID for demonstration
function generateMockID(identifier) {
    // In real implementation, this would call Facebook Graph API
    const mockIDs = {
        'zuck': '4',
        'facebook': '20531316728',
        'meta': '116123191726665'
    };
    
    if (mockIDs[identifier]) {
        return mockIDs[identifier];
    }
    
    // Generate pseudo-random ID based on identifier
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
        const char = identifier.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString() + Math.floor(Math.random() * 1000);
}

function showResult(id) {
    const resultDiv = document.getElementById('result');
    const idResultDiv = document.getElementById('id-result');
    
    idResultDiv.innerHTML = `
        <div style="position: relative;">
            <strong>Facebook ID:</strong> ${id}
            <button class="copy-btn" onclick="copyToClipboard('${id}')">Copy</button>
        </div>
    `;
    
    resultDiv.style.display = 'block';
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('Đã copy ID vào clipboard!');
    }).catch(() => {
        showError('Không thể copy. Vui lòng copy thủ công!');
    });
}

function showError(message) {
    removeMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.querySelector('.content-container').appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    removeMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.querySelector('.content-container').appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function removeMessages() {
    document.querySelectorAll('.error, .success').forEach(el => el.remove());
}

// Enter key support
document.getElementById('facebook-link').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getID();
    }
});
