# Token刷新服务使用说明

## 概述

为了解决多个页面重复编写accessToken刷新逻辑的问题，我创建了一个专门的token服务模块和mixin，使得token刷新可以在多个页面中复用。

## 文件结构

```
src/
├── services/
│   ├── api.js          # 现有的API服务，已集成token刷新功能
│   └── token.js        # 新的token服务模块
└── mixins/
    └── tokenRefresh.js  # Token刷新mixin
```

## 使用方法

### 方法1：使用Mixin（推荐）

在需要刷新token的页面中，只需要引入mixin即可：

```javascript
<script>
import tokenRefreshMixin from '@/mixins/tokenRefresh'

export default {
  name: 'YourPage',
  mixins: [tokenRefreshMixin],
  // 其他组件逻辑...
}
</script>
```

这样，页面在创建时会自动调用token刷新逻辑。

### 方法2：手动调用

如果需要手动控制token刷新时机，可以直接调用tokenService：

```javascript
import { tokenService } from '@/services/api'

export default {
  methods: {
    async yourMethod() {
      // 手动刷新token
      const success = await tokenService.refreshAccessToken()
      if (success) {
        console.log('Token刷新成功')
      }
    }
  }
}
```

### 方法3：使用通用请求方法

对于需要自动处理token过期的API请求，可以使用`requestWithTokenRefresh`：

```javascript
import { requestWithTokenRefresh } from '@/services/api'

// 在API服务中使用
async someApiCall() {
  return await requestWithTokenRefresh(async () => {
    return await api.get('/some-endpoint')
  })
}
```

## Token服务API

### tokenService.refreshAccessToken()
刷新accessToken，返回boolean值表示成功或失败。

### tokenService.getAccessToken()
获取当前accessToken。

### tokenService.getRefreshToken()
获取当前refreshToken。

### tokenService.setTokens(accessToken, refreshToken)
设置新的token。

### tokenService.clearTokens()
清除所有token。

## 更新后的页面

以下页面已经更新为使用新的token刷新机制：

1. **Loan.vue**（借款页面）- 使用mixin自动刷新
2. **LoanRecords.vue**（借款记录页面）- 使用mixin自动刷新
3. **Profile.vue**（个人中心页面）- 使用mixin自动刷新
4. **Message.vue**（消息页面）- 使用mixin自动刷新

## 优点

1. **代码复用**：避免了在每个页面重复编写相同的token刷新逻辑
2. **统一维护**：token刷新逻辑集中在一个地方，便于维护和修改
3. **自动处理**：使用mixin可以自动处理，无需手动干预
4. **错误处理**：统一的错误处理逻辑
5. **向后兼容**：保留了手动调用的灵活性

## 后续扩展

如果需要添加更多的token管理功能（如token过期时间检查、自动续期等），只需要在`token.js`文件中添加相应的方法即可。