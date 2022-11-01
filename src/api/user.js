import request from "@/utils/request";

// 注册
export const reqRegister = (data) => request.post("/register", data);

// 获取短信验证码(注册和登录)
export const reqCode = (mobile, type ) =>
  request.get("/code", { params: { mobile, type } });



// 用户名和密码登录
export const reqAccountLogin = ({ account, password }) =>
  request.post("/login", { account, password });

// 第三方登录
export const reqUserQQlogin = (unionId,source = 6)=>request.post('/login/social',{unionId,source})

// 第三方登录发送短信
export const reqUserQQcode = (mobile)=>request.get('/login/social/code',{params:{mobile}})

// 校验用户是否存在
export const reqUserCheckAccount = (account)=>request.get('/register/check',{params:{account}}
)

// 获取QQ完善信息的时候短信验证码
export const reqQQPatchCode = (mobile)=>request.get('/register/code',{params:{mobile}})

// 第三方注册，完善信息
export const reqUserQQLoginComplement = ({ unionId, mobile, code, account, password })=>request.post(`/login/social/${unionId}/complement`,{ unionId, mobile, code, account, password })