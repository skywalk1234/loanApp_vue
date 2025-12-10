const CACHE_NAME = 'loan-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/login1.html',
  '/loan.html',
  '/message.html',
  '/mine.html',
  '/register.html',
  '/forgotPassword.html',
  '/styles.css',
  '/css/login.css',
  '/js/login.js',
  '/js/register.js',
  '/js/messageUtils.js',
  '/js/webSocket.js',
  '/js/refreshToken.js',
  // '/icons/app_icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// 安装Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 如果缓存中有请求的资源，直接返回
        if (response) {
          return response;
        }
        
        // 克隆请求
        var fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(function(response) {
          // 检查是否收到有效的响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 克隆响应
          var responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});