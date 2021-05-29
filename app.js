//引入express模块
const express=require('express');
//引入用户路由器模块
const userRouter=require('./router/user.js');
//引入body-parser中间件
const bodyParser=require('body-parser');
//
//创建WEB服务器
const app=express();
//设置端口
app.listen(8080);
//使用body-parser中间件，将post请求的数据解析成对象
app.use(bodyParser.urlencoded({
	extended:false//是否使用第三方模块解析为对象
	}));
//挂载用户路由器,添加前缀/v1/users
app.use('/v1/users',userRouter);

//添加错误处理中间件，拦截所有产生的错误
app.use( (err,req,res,next)=>{
  //err拦截到的错误
  //console.log(err);
  //一旦出现错误，响应500，服务器端错误
  res.send({"code":500,"msg":"服务器端错误"});

});

