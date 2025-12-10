// 获取DOM元素
const emailInput = document.getElementById('emailInput');
const emailCodeInput = document.getElementById('emailCodeInput');
const getEmailCodeBtn = document.getElementById('getEmailCodeBtn');
const emailLoginBtn = document.getElementById('emailLoginBtn');
const errorToast = document.getElementById('errorToast');

// 验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

// 获取验证码按钮点击事件
// getEmailCodeBtn.addEventListener('click', function() {
//     const email = emailInput.value.trim();
//
//     if (!isValidEmail(email)) {
//         alert('请输入正确的邮箱地址');
//         return;
//     }
//
//     // 倒计时60秒
//     let countdown = 60;
//     getEmailCodeBtn.disabled = true;
//     getEmailCodeBtn.textContent = `${countdown}秒后重试`;
//
//     const timer = setInterval(() => {
//         countdown--;
//         getEmailCodeBtn.textContent = `${countdown}秒后重试`;
//
//         if (countdown <= 0) {
//             clearInterval(timer);
//             getEmailCodeBtn.disabled = false;
//             getEmailCodeBtn.textContent = '获取验证码';
//         }
//     }, 1000);
//
//     // 模拟发送验证码
//     console.log(`向邮箱 ${email} 发送验证码`);
//     alert(`验证码已发送至 ${email}，请注意查收`);
// });

// 获取验证码按钮点击事件
getEmailCodeBtn.addEventListener('click', function() {
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
        alert('请输入正确的邮箱地址');
        return;
    }

    // 倒计时60秒
    let countdown = 60;
    getEmailCodeBtn.disabled = true;
    getEmailCodeBtn.textContent = `${countdown}秒后重试`;

    const timer = setInterval(() => {
        countdown--;
        getEmailCodeBtn.textContent = `${countdown}秒后重试`;

        if (countdown <= 0) {
            clearInterval(timer);
            getEmailCodeBtn.disabled = false;
            getEmailCodeBtn.textContent = '获取验证码';
        }
    }, 1000);

    // 真实发送验证码请求
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": email
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://115.190.40.44:45444/user/loginWithEmail", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('验证码发送失败');
            }
            return response.text();
        })
        .then(result => {
            console.log('验证码发送成功:', result);
            alert(`验证码已发送至 ${email}，请注意查收`);
        })
        .catch(error => {
            console.log('error', error);
            alert('验证码发送失败，请稍后重试');
            // 重置倒计时
            clearInterval(timer);
            getEmailCodeBtn.disabled = false;
            getEmailCodeBtn.textContent = '获取验证码';
        });
});


// 登录按钮点击事件
// emailLoginBtn.addEventListener('click', function() {
//     const email = emailInput.value.trim();
//     const code = emailCodeInput.value.trim();
//
//     if (!isValidEmail(email)) {
//         alert('请输入正确的邮箱地址');
//         return;
//     }
//
//     if (code.length !== 6 || !/^\d{6}$/.test(code)) {
//         alert('请输入6位数字验证码');
//         return;
//     }
//
//     // 构建请求
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//
//     const raw = JSON.stringify({
//         "email": email
//     });
//
//     const requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: raw,
//         redirect: 'follow'
//     };
//
//     // 调试功能：向后端发起请求
//     try {
//         // 实际项目中使用下面的fetch调用
//         fetch("http://115.190.40.44:45333/user/loginWithEmail", requestOptions)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('登录失败');
//                 }
//                 // 显示调试信息：成功!
//                 //alert('成功!');
//                 return response.text();
//             })
//             .then(result => {
//                 console.log('登录成功:', result);
//                 // 设置登录状态
//                 // localStorage.setItem('userLoggedIn', 'true');
//                 // localStorage.setItem('loginMethod', 'email');
//                 // localStorage.setItem('userInfo', JSON.stringify({email: email}));
//                 window.location.href = 'index.html';
//             })
//             .catch(error => {
//                 console.log('error', error);
//                 // 网络请求失败时也显示调试信息
//                 //alert('请求已发送，但后端服务未响应');
//                 // 使用模拟数据继续
//                 useMockData();
//             });
//     } catch (e) {
//         console.log('网络请求异常:', e);
//         // 使用模拟数据继续
//         useMockData();
//     }

// 为了演示，使用模拟数据
//     function useMockData() {
//         if (code === '123456') { // 模拟成功情况
//             console.log(`邮箱 ${email} 登录成功，验证码 ${code}`);
//             // 设置登录状态
//             localStorage.setItem('userLoggedIn', 'true');
//             localStorage.setItem('loginMethod', 'email');
//             localStorage.setItem('userInfo', JSON.stringify({email: email}));
//             //alert('登录成功！');
//             window.location.href = 'index.html';
//         } else { // 模拟失败情况
//             showErrorToast();
//         }
//     }
// });


// 登录按钮点击事件
emailLoginBtn.addEventListener('click', function() {
    const email = emailInput.value.trim();
    const code = emailCodeInput.value.trim();

    if (!isValidEmail(email)) {
        alert('请输入正确的邮箱地址');
        return;
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
        alert('请输入6位数字验证码');
        return;
    }

    // 构建验证码验证请求
    const requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    // 请求后端验证验证码
    fetch(`http://115.190.40.44:45444/user/verifyCode?code=${code}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('验证码验证失败');
            }
            return response.json(); // 修改为解析JSON格式响应
        })
        .then(result => {
            console.log('验证码验证成功:', result);

            // 检查响应是否成功
            if (result.success && result.errCode === 200) {
                // 存储token到localStorage
                localStorage.setItem('accessToken', result.accessToken);
                localStorage.setItem('refreshToken', result.refreshToken);

                // 写入日志
                console.log('Token存储成功:', {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                });

                // 验证成功后，设置登录状态
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('loginMethod', 'email');
                localStorage.setItem('userInfo', JSON.stringify({email: email}));

                // 跳转到首页
                window.location.href = 'index.html';
            } else {
                // 处理验证失败情况
                console.log('登录验证失败:', result);
                showErrorToast();
            }
        })
        .catch(error => {
            console.log('error', error);
            // 验证码错误提示
            showErrorToast();
        });
});


// 显示错误提示悬浮框
function showErrorToast() {
    errorToast.style.display = 'block';

    // 3秒后隐藏
    setTimeout(() => {
        errorToast.style.display = 'none';
    }, 3000);
}

registerBtn.addEventListener('click', function() {
    //alert('跳转到注册页面');
    window.location.href = 'register.html';
});
