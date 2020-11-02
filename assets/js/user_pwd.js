$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 1、定义表单验证校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value == $("[name=oldPwd]").val()) {
                return '新旧密码不能相同';
            }
        },
        repwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次密码输入不一致';
            }
        }
    })
    // 2、点击修改 发送ajax请求
    $("#form-pwd").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("密码修改失败");
                }
                layer.msg("密码修改成功");
                // 清空表单
                $("#form-pwd")[0].reset();
            }
        })
    })
    // 3、点击重置 清空表单
    $("#btn-reset").on("click", function () {
        // 清空表单
        $("#form-pwd")[0].reset();
    })
})