消息页面需要和后端建立webSocket连接

建立连接之前先用localStorage中的accessToken发送请求，请求代码样例如下

~~~javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "");

var requestOptions = {
   method: 'GET',
   headers: myHeaders,
   redirect: 'follow'
};

fetch("http://115.190.40.44:45444/ws-ticket", requestOptions)
   .then(response => response.text())
   .then(result => console.log(result))
   .catch(error => console.log('error', error));
~~~

响应样例如下

~~~json
{
    "code": 200,
    "success": true,
    "ticket": "6dc05c8c-3205-4a71-bcb2-5db5f67e75c1"
}
~~~

用返回的这个ticket作为参数建立websocket连接

 ws://115.190.40.44:45444/ws/?ticket=${encodeURIComponent(ticket)



后端推送的消息介绍如下

类型分为系统通知，贷款通知，还款通知（也就是type 0-2）
消息类型统一为
{
"type" : 1,
"msg": "信息"
}

拿到消息后渲染在前端页面上

这个websocket必须是全局的，在进入主页面Home的时候就去连接，并且连接成功之后不再断开，如果接收到了后端发来的消息，提醒用户去消息页面Message查看





### 1. **使用全局状态管理（如 Pinia 或 Vuex）**

不要把消息列表和未读数量存在某个页面组件的 `data()` 或 `ref` 里。
 应创建一个**全局 Store**（例如叫 `messageStore`），专门负责：

- 存储所有已接收的消息列表
- 记录未读消息数量
- 提供“标记已读”等操作方法

这样即使消息页面组件被销毁/重建，数据依然保留在 Store 中。

------

### 2. **在 WebSocket 收到消息时，更新全局 Store**

当 WebSocket 客户端接收到新消息：

- 立即把消息**推入 `messageStore` 的消息列表**
- **未读计数 +1**
- 同时可触发浏览器通知（可选）

> 这一步必须在**全局作用域**（比如一个独立的 WebSocket 管理模块）中完成，而不是在某个 Vue 页面组件里监听。

------

### 3. **底部导航栏从 Store 读取未读数**

导航栏组件（通常是 App 根组件的一部分）通过 `computed` 属性**订阅 `messageStore.unreadCount`**。
 只要未读数变化，图标上的红点或数字会自动更新。

------

### 4. **消息页面打开时，直接读取 Store 中的历史消息**

消息页面组件在 `onMounted` 或 `setup()` 中：

- 直接从 `messageStore` 获取已有消息列表渲染
- 可选择调用 `store.markAllAsRead()` 将未读数清零（根据产品需求）

因为数据在 Store 里，所以**不会因为组件重建而丢失**。