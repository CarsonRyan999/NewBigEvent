$.ajaxPrefilter(function (options) {
    options.url = "http://ajax.frontend.itheima.net" + options.url;
    // 给接口带有/my/ 的添加请求头 
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    // 防止用户修改地址 进入首页
    options.complete = function (res) {
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            // 清空token
            localStorage.removeItem("token");
            // 跳回登录页面
            location.href = "/login.html";
        }
    }
})