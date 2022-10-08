import request from "@/utils/request";

// 注册
export const reqRegister = (data) => request.post("/register", data);

// 获取短信验证码(注册和登录)
export const reqCode = (mobile, type ) =>
  request.get("/code", { params: { mobile, type } });



// 用户名和密码登录
export const reqAccountLogin = ({ account, password }) =>
  request.post("/login", { account, password });
