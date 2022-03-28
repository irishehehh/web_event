// 每次调用ajax 先会调用这个函数
// 在这个函数中可以拿到ajax提供的配置请求
$.ajaxPrefilter(function(options){
   
    options.url = 'http://api-breakingnews-web.itheima.net'+options.url
    console.log(options.url);
})