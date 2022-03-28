// 每次调用ajax 先会调用这个函数
// 在这个函数中可以拿到ajax提供的配置请求
$.ajaxPrefilter(function(options){
   
    options.url = 'http://api-breakingnews-web.itheima.net'+options.url
    
    // 统一为有权限的接口 设置headers
    if(options.url.indexOf('/my') !== -1){
        options.headers ={
            Authorization:localStorage.getItem('token') || ''
        }
    }


    // 全局统一挂载complete 回调函数
    options.complete = function(res){
         //  console.log('执行了complete');
         console.log(res)
         // 在complete回调函数中可以使用res.responseJSON
         // 拿到服务器响应回来的数据
          if(res.responseJSON.status ===1 && res.responseJSON.message === '身份认证失败！'){
         //     // 强制清空token
              localStorage.removeItem('token')
         //     //强制跳转到登录页面
              location.href ='/login.html'
          
     }

    }
    
})