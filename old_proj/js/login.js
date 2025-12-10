// 调试语句 - 确保JS文件已加载
console.log("JS文件已加载！");

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM已加载完成");
    
    // 获取表单元素
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error("错误：找不到登录表单！检查ID是否匹配");
        return;
    }
    
    console.log("成功获取表单元素");
    
    // 表单提交事件处理
    loginForm.addEventListener('submit', function(event) {
        console.log("表单提交事件触发");
        event.preventDefault(); // 阻止表单默认提交行为
        
        // 获取输入值
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        console.log("输入的用户名:", username);
        console.log("输入的密码:", password);
        
        // 简单的表单验证
        if (!username || !password) {
            console.warn("验证失败：用户名或密码为空");
            alert('请输入用户名和密码');
            return;
        }
        
        // 获取登录按钮并更新状态
        const loginBtn = document.querySelector('.login-btn');
        loginBtn.textContent = '登录中...';
        loginBtn.disabled = true;
        
        console.log("开始模拟登录请求");
        
        // 模拟API请求（实际项目中替换为真实API调用）
        performLogin(username, password);
    });
});
function performLogin(username, password) {
    // 准备请求头
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // 准备请求体
    const raw = JSON.stringify({
        "username": username,
        "pwd": password,
        "force": true  // 强制登录，踢掉其他设备登录状态
    });

    // 请求选项
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    // 显示加载状态
    // loginBtn.textContent = '登录中...';
    // loginBtn.disabled = true;

    // 发送登录请求
    console.log("发送登录请求...");
    fetch("http://115.190.40.44:8080/user/login", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log("登录响应:", result);
            
            if (result.success) {
                console.log("登录成功");
                alert('登录成功！欢迎回来，' + username);
                console.log("accessToken:"+result.accessToken)
                console.log("refreshToken:"+result.refreshToken)
                // 存储token到本地存储或cookie
                localStorage.setItem('accessToken', result.accessToken);
                localStorage.setItem('refreshToken', result.refershToken);
                
                // 跳转到主页
                window.location.href = './index.html';
            } else {
                // 根据errCode显示不同错误信息
                let errorMsg = '登录失败';
                if (result.errCode === 1) {
                    errorMsg = '用户名或密码错误';
                } else if (result.errCode === 2) {
                    errorMsg = '账户已被锁定';
                }
                throw new Error(errorMsg);
            }
        })
        .catch(error => {
            console.error("登录失败:", error);
            alert('登录失败: ' + error.message);
        })
        .finally(() => {
            console.log("恢复按钮状态");
            loginBtn.textContent = '登 录';
            loginBtn.disabled = false;
        });
}
// 模拟登录API请求函数


// 使用示例（假设loginBtn是登录按钮的DOM元素）
// const loginBtn = document.getElementById('login-btn');
// loginBtn.addEventListener('click', () => {
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;
    
//     if (!username || !password) {
//         alert('请输入用户名和密码');
//         return;
//     }
    
//     performLogin(username, password);
// });