$(function () {
    var form = layui.form;
    var layer = layui.layer;
    var laypage = layui.laypage;
    // 定义查询字符串
    var q = {
        pagenum: 1,  // 所在分页
        pagesize: 2, // 每页几条
        cate_id: '', // 文章类别
        state: ''  // 文章状态
    }
    // 定时格式化时间函数
    template.defaults.imports.formData = function (data) {
        var date = new Date(data);

        var y = date.getFullYear();
        var m = addZero(date.getMonth() + 1);
        var d = addZero(date.getDate());

        var hh = addZero(date.getHours());
        var mm = addZero(date.getMinutes());
        var ss = addZero(date.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    // 定义补零函数
    function addZero(t) {
        return t < 10 ? '0' + t : t;
    }
    // 1、获取文章列表数据
    function getArtList() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败");
                }
                // 调用模板引擎
                var htmlStr = template("tpl-artCate", res);
                // 渲染页面
                $("tbody").html(htmlStr);
                // 渲染分页
                renderArtPage(res.total);
            }
        })
    }
    getArtList();
    // 2、获取分类数据
    function getArtCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类失败");
                }
                var htmlStr = template("tpl-select", res);
                $("[name=cate_id]").html(htmlStr);
                // 告诉layui 重新渲染表单
                form.render();
            }
        })
    }
    getArtCate();
    // 3、点击筛选发起ajax请求
    $("#form-filter").on("submit", function (e) {
        e.preventDefault();
        // 改变查询字符串数据 然后再发请求
        q.cate_id = $("[name=cate_id]").val();
        q.state = $("[name=state]").val();
        getArtList();
    })

    // 4、发起ajax请求  由条数决定 渲染多少分页
    function renderArtPage(total) {
        // 执行一个laypage实例
        laypage.render({
            elem: 'page',//注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页的条数
            curr: q.pagenum, // 当前所在页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 切换分页和调用render方法都会触发jump回调
            jump: function (obj, first) {
                // 改变查询字符串的所在页
                q.pagenum = obj.curr;
                // 改变查询字符串的条数
                q.pagesize = obj.limit;
                // 只有当点击分页的时候再去获取文章列表
                // 防止调用render方法时  自动调用 形成死循环
                // 通过render方法调用 first 为true
                // 通过点击分页调用  first  为false
                if (!first) {
                    getArtList();
                }
            }
        });
    }
    // 5、点击删除按钮  发起ajax请求
    function removeArtData() {
        $("tbody").on("click", ".btn-delete", function () {
            // 获取当前页面有几个按钮 每个按钮代表一条数据
            var len = $(".btn-delete").length;
            var id = $(this).attr("data-id");
            layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
                $.ajax({
                    method: "GET",
                    url: "/my/article/delete/" + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg("删除文章失败!");
                        }
                        layer.msg("删除文章成功");
                        // 如果只有一个按钮就代表只有一条数据
                        // 删除完之后就没有了 就跳到上一页
                        if (len === 1) {
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        }
                        // 重新获取
                        getArtList();
                        // 关闭弹出层
                        layer.close(index);
                    }
                })

            });

        })
    }
    removeArtData();
    // 6、点击编辑按钮 跳转到编辑页面
    $("tbody").on("click", "#btn-edit", function () {
        // 获取当前要编辑的文章id
        var id = $(this).attr("data-id");
        // 跳转到编辑页面 并将id以查询字符串的方式传到编辑页面
        location.href = "/article/art_edit.html?" + id;
    })
})