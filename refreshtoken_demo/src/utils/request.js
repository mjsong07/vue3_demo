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
