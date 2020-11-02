$(function () {
    getUserInfo();
})
var layer = layui.layer;
// 1、获取用户信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg("获取用户信息失败");
            }
            renderUserInfo(res.data);
        }
    })
}
// 2、根据用户信息 渲染头像
function renderUserInfo(data) {
    var name = data.nickname || data.username;
    // 渲染用户名
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    // 如果用户有头像 就渲染头像
    if (data.user_pic) {
        $(".layui-nav-img").prop("src",data.user_pic).show();
        $(".text-avatar").hide();
    // 如果用户没有头像 就将用户名的第一个字的大写 作为头像
    } else {
        $(".text-avatar").html(name[0].toUpperCase()).show();
        $(".layui-nav-img").hide();
    }
}