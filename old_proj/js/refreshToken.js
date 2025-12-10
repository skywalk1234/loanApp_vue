// 全局变量存储定时器ID
let refreshTokenInterval;

// 刷新token的函数
async function refreshToken() {
    const myHeaders = new Headers();
    // 从localStorage获取refreshToken
    const authData = JSON.parse(localStorage.getItem('authData'));
    const refreshToken = authData?.refreshToken;
    const accessToken = authData?.accessToken;

    if (!refreshToken) {
        console.log('No refresh token available, skipping token refresh');
        return;
    }

    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json");

    // 构建请求体
    const raw = JSON.stringify({
        "refresh_token": refreshToken
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("http://115.190.40.44:45444/refresh", requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // 保存新的token到localStorage
        const newAuthData = {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        };

        localStorage.setItem('authData', JSON.stringify(newAuthData));
        console.log('Tokens refreshed successfully');

        // 重置定时器
        resetRefreshInterval();

        return newAuthData;
    } catch (error) {
        console.log('Error refreshing token:', error);
        // 可以在这里添加token刷新失败的处理逻辑
        // 比如跳转到登录页面或显示错误提示
        return null;
    }
}

// 重置定时器
function resetRefreshInterval() {
    // 清除现有定时器
    if (refreshTokenInterval) {
        clearInterval(refreshTokenInterval);
    }

    // 设置新的定时器（5分钟 = 300000毫秒）
    refreshTokenInterval = setInterval(refreshToken, 300000);
}

// 初始化token刷新机制
function initTokenRefresh() {
    // 立即执行一次刷新
    refreshToken();

    // 然后设置定时器
    resetRefreshInterval();
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已有authData
    const authData = JSON.parse(localStorage.getItem('authData'));

    if (authData && authData.refreshToken) {
        initTokenRefresh();
    } else {
        console.log('No auth data found, skipping token refresh initialization');
        // 这里可以添加跳转到登录页面的逻辑，但不强制跳转，允许页面继续运行
    }
});

// 当页面可见性变化时（比如从后台标签页切换回来）检查是否需要刷新
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // 页面变为可见状态，检查token是否需要刷新
        const authData = JSON.parse(localStorage.getItem('authData'));
        if (authData && authData.refreshToken) {
            refreshToken();
        } else {
            console.log('No auth data found when page became visible');
        }
    }
}, 'javascript');

// 页面卸载时清除定时器
window.addEventListener('beforeunload', function() {
    if (refreshTokenInterval) {
        clearInterval(refreshTokenInterval);
    }
});