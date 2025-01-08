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
