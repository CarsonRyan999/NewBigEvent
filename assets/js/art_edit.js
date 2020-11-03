$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 获取要编辑的id
    var id = location.search.replace(/\?/, "");

    // 1、发起ajax 渲染多选框
    function renderArtCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章类别失败");
                }
                var htmlStr = template("tpl-select", res);
                $("[name=cate_id]").html(htmlStr);
                // 告诉layui重新渲染
                form.render();
                // 填充表单
                getArtData();
            }
        })
    }
    renderArtCate();
    // 2、通过文章id 获取文章数据 并填充表单
    function getArtData() {
        $.ajax({
            method: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章数据失败");
                }
                // 填充表单数据
                form.val("form-edit", res.data);
                // 2、初始化富文本编辑器
                initEditor();
                // 3、初始化图片裁剪器
                var $image = $('#image');
                // 改变src属性
                $image.prop("src", "http://ajax.frontend.itheima.net" + res.data.cover_img);
                // 裁剪选项
                var options = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview'
                }
                // 初始化裁剪区域
                $image.cropper(options);
            }
        })
    }

    // 4、选择文件
    $("#chooseCover").on("click", function () {
        $("#coverFile").click();
    })
    // 5、监听是否上传文件
    $("#coverFile").on("change", function () {
        var files = this.files;
        if (files.length <= 0) {
            return layer.msg("请先上传文件");
        }
        layer.msg("文件上传成功");
        // 将文件转换为url地址
        var newImgUrl = URL.createObjectURL(files[0]);
        // 去掉之前的裁剪区 改变图片地址 然后重新开启裁剪区
        $("#image").cropper("destroy").prop("src", newImgUrl).cropper({
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        });
    })
    // 定义文章的状态
    var state = null;
    // 6、点击发布或存为草稿 改变状态
    $("#btn-pub").on("click", function () {
        state = "已发布";
    })
    $("#btn-save").on("click", function () {
        state = '草稿';
    })
    // 7、点击发布 发起ajax请求
    $("#form-edit").on("submit", function (e) {
        e.preventDefault();
        // 创建FormData对象
        // 需要上传文件 必须要用这个对象
        var fd = new FormData(this);
        // 将发布状态添加进fd对象
        fd.append("state", state);
        $("#image").cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 将文件二进制数据添加进对象
            fd.append("cover_img", blob);
            $.ajax({
                method: "POST",
                url: "/my/article/edit",
                data: fd,
                // 发布文件对象 必须设置以下两个属性
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("文章发布失败");
                    }
                    layer.msg("发布成功");
                    // 跳到文章列表页面
                    location.href = '/article/art_list.html';
                }
            })
        })

    })
})