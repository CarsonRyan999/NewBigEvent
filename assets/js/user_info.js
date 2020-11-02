$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 定义校验规则
    form.verify({
        name: function (value) {
            if (value.length > 6) {
                return '请输入小于6位的昵称';
            }
        }
    })
    // 1、获取用户信息 渲染到表单
    function addUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败");
                }
                form.val("form-user", res.data);
            }
        })
    }
    addUserInfo();
    // 2、点击修改发起请求
    $("#form-user").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("修改信息失败");
                }
                layer.msg("修改信息成功");
                // 重新渲染
                window.parent.getUserInfo();
            }
        })
    })
    // 3、点击重置 调用获取用户信息按钮
    $("#btn-reset").on("click", function (e) {
        e.preventDefault();
        addUserInfo();
    })
})