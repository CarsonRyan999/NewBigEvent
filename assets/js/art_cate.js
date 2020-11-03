$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 1、渲染文章数据
    function renderArtCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("数据获取失败");
                }
                // 调用模板引擎
                var htmlStr = template("tpl-cate", res);
                $("tbody").html(htmlStr);
            }
        })
    }
    renderArtCate();

    // 2、点击添加分类 弹出弹出层
    var index = null;
    $("#add-cate").on("click", function () {
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $("#tpl-addCate").html(),
            area: ['500px', '250px'],
            offset: ['180px', '400px']
        });
    })
    // 3、点击确认添加按钮 发起ajax请求
    $("body").on("submit", "#form-addCate", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("添加分类失败");
                }
                layer.msg("添加分类成功");
                // 重新渲染文章列表
                renderArtCate();
                // 关闭弹出层
                layer.close(index);
            }
        })
    })
    // 清空表单
    $("body").on("click", "#reset-artCate", function () {
        $("#form-addCate")[0].reset();
    })
    // 4、点击编辑按钮 弹出弹出层
    var editIndex = null;
    $("tbody").on("click", "#edit-artCate", function () {
        editIndex = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $("#tpl-editCate").html(),
            area: ['500px', '250px'],
            offset: ['180px', '400px']
        });
        var id = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章数据失败");
                }
                form.val("form-editCate", res.data);
            }
        })
    })
    // 5、点击确认修改 发起ajax请求
    $("body").on("submit", "#form-editCate", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("文章修改失败");
                }
                layer.msg("文章修改成功");
                // 重新渲染文章列表
                renderArtCate()
                // 关闭弹出层
                layer.close(editIndex);
            }
        })
    })
    // 6、点击删除按钮 发起ajax请求
    $("tbody").on("click", "#btn-delete", function () {
        var id = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/my/article/deletecate/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("删除文章失败");
                }
                layer.msg("删除文章成功");
                // 重新渲染
                renderArtCate();
            }
        })
    })
})