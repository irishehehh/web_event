$(function(){
    var layer= layui.layer
    var form = layui.form
    var layPage = layui.layPage
    template.defaults.imports.dataFormat = function(date){
const dt = new Date(date)
var y =dt.getFullYear()
var m = padZero( dt.getMonth() +1)
var d = padZero( dt.getDay())
var hh = padZero( dt.getHours())
var mm = padZero( dt.getMinutes())
var ss =padZero( dt.getSeconds())

return y +'-' +m +'-' +d+'-'+hh+':'+mm+':'+ss





}

// 定义补零的函数
function padZero(n){
 return   n>9?n:'0'+n
}
    // 定义一个查询对象，将来请求数据打打时候，将请求参数对象提交到服务器
    var q ={
        pagenum:1,//默认请求第一页数据
        pagesize:2,//显示几条数据
        cate_id:'',//文章分类id
        state:''//文章发布状态
    }
    initTable()
    initCate()
// 获取文章数据的方法
    function initTable(){
        $.ajax({
            method:'GET',
            url:'my/article/list',
            data:q,
            success:function(res){
                console.log(res);
                if(res.status !== 0){
                return     layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染页面数据
           var htmlstr = template('tpl-table',res)
           $('tbody').html(htmlstr)
           renderPage()
            }
        })
    }


    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败')

                }
                // 调用模板引擎渲染可选项
             var htmlstr =   template('tpl-cate',res)
             $('[name= cate_id]').html(htmlstr)
             form.render()
            }
        })
    }


    //为筛选表单绑定submit事件
     $('#form-search').on('submit',function(e){
         e.preventDefault()
         //获取表单中选中项的值
         var cate_id = $('[name = cate_id]').val()
         var state = $('[name = state]').val()
         //为查询参数对象q对应属性赋值
         q.cate_id = cate_id
         q.state = state
         //根据最新的筛选条件。重新渲染数据
         initCate()
     })
    //  定义渲染分页方法
    function renderPage(total){
        layPage.render({
            elem:'pageBox',
            count : total,
            limit:q.pagesize,
            curr:q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
            jump:function(obj,first){
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if(!first){
                    initTable()
                }
                
                
            }


        })
       
    }
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
          $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('删除文章失败！')
              }
              layer.msg('删除文章成功！')
              // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
              // 如果没有剩余的数据了,则让页码值 -1 之后,
              // 再重新调用 initTable 方法
              // 4
              if (len === 1) {
                // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                // 页码值最小必须是 1
                q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
              }
              initTable()
            }
          })
    
          layer.close(index)
        })
    })
})