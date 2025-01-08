# vue3_demo
 vue3相关的代码例子

# token的校验流程
1. 用户在登录页面输入账号进行登录，拿到短token 和 长token
2. 用户每次请求数据都会带上短token
3. 服务器验证有效就会返回保护数据
4. 如果token无效，就是拿长token去换取最新的token
5. 然后用最新token重新发起请求
6. 服务器校验有效返回保护资源
7. 如果长token无效，则需要跳到登录页面，重新登录获取短token和长token
 

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/0a6f6b9cfd324e1397fbf34586d18a39~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1736404923&x-orig-sign=%2FoO%2BcIHSlM70QKIZeH9PD4EPjNo%3D)

# 为什么要设计长token呢？
如果是单机部署确实无需这么折腾，直接跟服务端商量，加长token的有效期也是可以达到，
1. 正常token时间应该越短越好，以防泄漏，但是像微信这种我们多久没有重新登录过，也是因为我们一直有用refreshtoken重新刷新登录的状态，也就是越用越长时间有效。
2. 主要应用在单点登录的场景，如集成微信接口时候的auth2.0 ，，也可以找到refreshtoken的影子

## cookie+session 
cas（Central Authentication Service）中央认证服务
1. 用户请求认证服务器，验证用户身份后， 认证服务生成标识1（即sessionId），并记录在内存（或redis）
2. 返回标识1给客户端，客户端通过cookie带上标识1 请求业务系统
3. 业务系统基于标识1 去认证服务器判断是否有效
4. 认证服务器通过对比内存是否存在 标识1，有则返回保护数据
5. 没有则，提示用户重新登录

### 优点
1. 统一管理，想那个用户下线就下线，及时。
2. 部署方便只需要一台
### 缺点
1. 所有权限都要经过认证服务器，所有会有大量的请求
2. 当业务系统扩容的时候，认证服务器也要同步扩容
3. 一旦挂了，所有业务系统都用不了

## jwt 方案
jwt是一种算法+密钥生成的唯一值，无状态，可以部署在不同的业务服务器上，包括认证服务器，当然里面也有有效期。
1. 用户请求认证服务器，验证用户身份后， 通过jwt生成token 
2. 返回token给客户端，客户端存储在localstorage，请求的时候带上token
3. 业务服务器直接获取token，根据jwt判断是否有效


![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/c001561dbe0045aa80e8fa210b3cab3e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1736409531&x-orig-sign=l452%2FkCbGdFEZydS3E7V489E9LY%3D)

### 优点
1. 无状态，无需服务器托管，每次业务服务器不用再质询认证服务器
2. 甚至无需认证中心都能认证，只要知道算法+密钥即可
3. 多少终端都可以
### 缺点
1. 无法统一管理用户，让用户下线等

## token + refreshtoken 
1. 用户请求认证服务器，验证用户身份后， 通过jwt生成token 和 refreshtoken 
2. 返回给客户端，客户端存储在localstorage，请求的时候带上token
3. 业务服务器直接获取token，根据jwt判断是否有效
4. token有效返回保护数据
5. token失败，则通过refreshtoken请求认证服务器获取token



![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/0638e93524c34064a3ada7acc9b35314~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1736409563&x-orig-sign=p6NQrd359hDUsN71kklQYTZtKw4%3D)


失败后的请求逻辑 
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/2e5bc82fc94c4680ace14c940b2cf2cf~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1736409811&x-orig-sign=vw1nb6HK9eLB2nJ78Tgt5ZjrdxU%3D)

## 优点
1. 使用token有效减少了频繁访问认证服务器
2. 使用refreshtoken可以让客户端过一段时间回来认证服务器，确认一下最新的状态。


# 前端实现
src/utils/request.js
```js
import axios from "axios";
import refreshToken from 'refreshToken'
const init = axios.create({});

// 响应拦截
init.interceptors.response.use(async (res) => { 
  if (res.headers.authorization) {
    const token = res.headers.authorization.replace('Bearer ','');//清空重新赋值
    setToken(token);
    window.localStorage.setItem('token',token)
    ins.default.headers.Authorization = `Bearer ${token}`
  }

  if (res.headers.refreshToken) {
    const refreshToken = res.headers.refreshToken.replace( 'Bearer ','')//清空重新赋值 
    window.localStorage.setItem('refreshToken',refreshToken)
  }
  if (res.data.code === 401 && !res.config.isRefreshToken ) {
    //根据 refreshtoken 重新获取token
    await refreshToken();
    res.config.headers.Authorization =  `Bearer ${window.localStorage.getItem('refreshToken')}`
    const resp = await ins.request(res.config);
  } 
  return res.data;
});

```
/src/utils/refreshToken.js
```js
import request from "./request";

let promise;
export async function refreshToken() {
  //当同一个时间遇到 重复请求时，不进行重复请求获取token
  if (promise) {
    return promise;
  }
  promise = new Promise(async (resole) => {
    let resp = await request.get("/refresh_token", {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("refreshToken")}`,
      },
      isRefreshToken: true, //新增一个自定义的属性
    });
    resole(resp.code === 0);
  });
  promise.finally(() => {
    promise = null
  })
  return promise
}


```