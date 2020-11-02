$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 1、点击登录按钮 发送ajax请求
    $("#form_login").on("submit", function (e) {
        // 阻止默认行为
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败");
                }
                layer.msg("登录成功");
                // 将token存储到locaStorage
                localStorage.setItem("token", res.token);
                // 跳转到index.html页面
                location.href = "/index.html";
            }
        })
    })
    // 2、点击切换登录和注册
    $("#link_reg").on("click", function () {
        $(".reg-box").show();
        $(".login-box").hide()
    })
    $("#link_login").on("click", function () {
        $(".reg-box").hide();
        $(".login-box").show()
    })
    // 3、点击注册 发起ajax请求
    $("#form_reg").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("注册成功");
                // 调到登录
                $("#link_login").click();
            }
        })
    })
    // 4、注册框验证规则校验
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            if (value !== $("#pwd").val()) {
                return '两次密码不一致';
            }
        }
    })
})