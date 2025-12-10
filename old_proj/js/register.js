/**
 * 注册页面 JavaScript 逻辑
 * 包含表单验证和注册请求
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const registerBtn = document.getElementById('registerBtn');
    const realnameAuthBtn = document.getElementById('realnameAuth');
    const smsBtn = document.querySelector('.sms-btn');
    const registerForm = document.querySelector('.register-form');

    // 实名认证状态
    let faceVerified = false;
    let faceData = null;

    // 注册按钮点击事件
    registerBtn.addEventListener('click', handleRegister);

    // 实名认证按钮点击事件
    // realnameAuthBtn.addEventListener('click', function() {
    //     alert('实名认证（人脸识别）功能待接入');
    //     // 模拟实名认证成功
    //     faceVerified = true;
    //     faceData = '模拟人脸数据';
    //     this.innerHTML = '<i class="fas fa-check-circle"></i> 已实名认证';
    //     this.style.background = 'linear-gradient(135deg, #0f4c81, #1a3a5f)';
    // });

    // 获取验证码按钮点击事件
    smsBtn.addEventListener('click', function() {
        const email = document.getElementById('email').value;
        if (!validateEmail(email)) {
            alert('请输入正确的邮箱');
            return;
        }
        sendEmailCode(email)
        // 这里应该调用发送验证码的API
        // alert(`验证码已发送到邮箱，请注意查收: ${phone}`);

        // 倒计时效果
        let countdown = 60;
        this.disabled = true;
        const timer = setInterval(() => {
            countdown--;
            this.textContent = `${countdown}秒后重试`;
            if (countdown <= 0) {
                clearInterval(timer);
                this.textContent = '获取验证码';
                this.disabled = false;
            }
        }, 100);
    });
    // 请求后端发送邮箱验证码的函数
    function sendEmailCode(email) {
        fetch('http://115.190.40.44:45444/user/registerVerifyCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('验证码已发送到邮箱，请注意查收: ' + email);
                    console.log(data);
                    // console.log(data.token)
                    localStorage.setItem('token', data.token);
                } else {
                    alert('验证码发送失败：' + data.message);
                    console.log(data.message);
                }
            })
    }
    // 注册处理函数
    function handleRegister() {
        // 获取表单数据
        const formData = getFormData();
        console.log(formData)
        // 验证表单数据
        const isValid = validateForm(formData);
        if (!isValid) return;

        // 检查是否完成实名认证
        // if (!faceVerified) {
        //     alert('请先完成实名认证');
        //     return;
        // }

        // 准备提交数据
        const requestData = {
            // email: formData.email,
            // face: faceData,
            // id_card: formData.idCard,
            username: formData.username,
            pwd: formData.password,
            phone: formData.phone,
            email: formData.email,
            code: formData.smsCode,
            token: localStorage.getItem('token'),
            // username: formData.phone // 使用手机号作为用户名
        };

        // 发送注册请求
        registerUser(requestData);
    }

    // 获取表单数据
    function getFormData() {
        return {
            phone: document.getElementById('phone').value.trim(),
            password: document.getElementById('password').value.trim(),
            confirmPassword: document.getElementById('confirmPassword').value.trim(),
            smsCode: document.getElementById('smsCode').value.trim(),
            username: document.getElementById('UserName').value.trim(),
            // idCard: document.getElementById('idCard').value.trim(),
            email: document.getElementById('email').value.trim()
        };
    }

    // 验证表单数据
    function validateForm(data) {
        // 验证手机号
        if (!validatePhone(data.phone)) {
            alert('请输入正确的11位手机号码');
            return false;
        }

        // 验证密码
        if (!validatePassword(data.password)) {
            alert('密码长度需在6-20位之间，且包含字母和数字');
            return false;
        }

        // 验证确认密码
        if (data.password !== data.confirmPassword) {
            alert('两次输入的密码不一致');
            return false;
        }

        // 验证验证码
        if (!data.smsCode || data.smsCode.length !== 6) {
            alert('请输入6位验证码');
            return false;
        }

        // 验证真实姓名
        // if (!data.realName) {
        //     alert('请输入真实姓名');
        //     return false;
        // }
        //
        // // 验证身份证号
        // if (!validateIdCard(data.idCard)) {
        //     alert('请输入正确的18位身份证号码');
        //     return false;
        // }
        //
        // 验证邮箱（可选）
        if (data.email && !validateEmail(data.email)) {
            alert('请输入有效的电子邮箱');
            return false;
        }

        return true;
    }

    // 验证手机号
    function validatePhone(phone) {
        return /^1[3-9]\d{9}$/.test(phone);
    }

    // 验证密码
    function validatePassword(password) {
        return password.length >= 6 && password.length <= 20 &&
            /[a-zA-Z]/.test(password) && /\d/.test(password);
    }

    // 验证身份证号（简单验证）
    // function validateIdCard(idCard) {
    //     return /^\d{17}[\dXx]$/.test(idCard);
    // }

    // 验证邮箱
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // 注册用户
    function registerUser(data) {
        // 显示加载状态
        registerBtn.disabled = true;
        registerBtn.textContent = '注册中...';
        console.log("最终要提交的表单{}", data)
        // 发送POST请求
        fetch('http://115.190.40.44:45444/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('注册成功！');
                    // 注册成功后可以跳转到登录页面
                    window.location.href = '../username_pwd.html';
                } else {
                    alert(`注册失败: ${data.errCode || '未知错误'}`);
                }
            })
            .catch(error => {
                console.error('注册请求错误:', error);
                alert('网络错误，请稍后重试');
            })
            .finally(() => {
                // 恢复按钮状态
                registerBtn.disabled = false;
                registerBtn.textContent = '注册';
            });
    }
});