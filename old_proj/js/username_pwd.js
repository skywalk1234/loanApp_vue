const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

// 存储登录后的token
let authData = {
    accessToken: null,
    refreshToken: null
};

// 切换密码可见性
togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

// 验证账号和密码
function validateInputs() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username) {
        alert('请输入账号');
        return false;
    }

    if (!password) {
        alert('请输入密码');
        return false;
    }

    return true;
}

// 登录按钮点击事件
loginBtn.addEventListener('click', async function() {
    if (!validateInputs()) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        // 显示加载状态
        loginBtn.disabled = true;
        loginBtn.textContent = '登录中...';
        console.log("username{}", username)
        // 发送登录请求
        const response = await fetch('http://115.190.40.44:45444/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                pwd: password,
                force: true
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || '登录失败');
        }

        // 存储token
        authData = {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        };

        // 可以存储到localStorage或sessionStorage中
        localStorage.setItem('authData', JSON.stringify(authData));
        
        // 设置统一的登录状态标识，与邮箱登录保持一致
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('loginMethod', 'password');
        localStorage.setItem('userInfo', JSON.stringify({username: username}));

        console.log('登录成功，token已存储', authData);
        //alert('登录成功！');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('登录失败:', error);
        alert(`登录失败: ${error.message}`);
    } finally {
        // 恢复按钮状态
        loginBtn.disabled = false;
        loginBtn.textContent = '登录';
    }
});

// 注册按钮点击事件
registerBtn.addEventListener('click', function() {
    //alert('跳转到注册页面');
    window.location.href = 'register.html';
});

// 其他登录方式点击事件
document.querySelectorAll('.quick-method').forEach(method => {
    method.addEventListener('click', function() {
        const type = this.querySelector('span').textContent;
        alert(`暂未开放${type}登录功能`);
    });
});

// 回车键登录
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        loginBtn.click();
    }
});