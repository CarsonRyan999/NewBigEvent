$(function () {
    var layer = layui.layer;
    // 1、创建裁剪区域
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options);
    // 2、点击上传文件
    $("#btn-upload").on("click", function () {
        $("#File").click();
    })
    // 3、监听用户是否上传成功 成功后就将图片展示在裁剪区
    $("#File").on("change", function () {
        var files = this.files;
        if (files.length <= 0) {
            return layer.msg("请先上传文件");
        }
        layer.msg("文件上传成功");
        // 将文件转换为url地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 先销毁原来的裁剪区  改变图片地址 再创建一个裁剪区
        $image.cropper('destroy').prop('src', newImgURL).cropper(options);
    })
    // 4、点击确定  发送更换头像的请求
    $("#btn-sure").on("click", function () {
        // 创建一个 Canvas 画布
        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串      
        var dataURL = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/png');
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更换头像失败");
                }
                layer.msg("更换头像成功");
                // 重新刷新用户信息
                window.parent.getUserInfo();
            }
        })
    })
})