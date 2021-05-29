//创建服务器
const express=require('express');
//创建路由器对象
const r=express.Router();
//引入连接池对象
const pool=require('../pool.js');
//添加注册路由
//1.用户注册
//http://127.0.0.1:8080/v1/users/reg
r.post('/reg',(req,res,next)=>{
  //1.1获取post请求的数据
  let obj=req.body;
  //console.log(obj); 
  //1.2验证各项数据是否为空
  if(!obj.uname){
	//json方法将js对象转为json对象
    res.json({"code":401,"msg":"uname不能为空"});
	//阻止往后执行
	//这是函数内，使用return
	return;
  }
  if(!obj.upwd){
     res.json({"code":402,"msg":"upwd不能为空"});
	 return;
  }
  if(!obj.email){
     res.json({"code":403,"msg":"email不能为空"});
	 return;
  }
  if(!obj.phone){
     res.json({"code":404,"msg":"phone不能为空"});
	 return;
  }
  //验证手机号码格式
  //手机号码规则
  let reg=/^1[3-9]\d{9}$/;
  //如果手机号码不正确
  if(!reg.test(obj.phone)){
     res.json({"code":405,"msg":"phone格式有误"});
	 return;
  } 
  //1.3执行SQL命令
   pool.query('inser into xz_user set ?',[obj],(err,result)=>{
     if(err){
	   //如果数据库执行出现错误，交给下一个错误处理中间件
       next(err);
	   //阻止往后执行
	   return;
	 };
     //console.log(result);
	 if(result.affectedRows===0){
	   res.json({"code":201,"msg":"注册失败"});
	   return;
	 }
     res.json({"code":200,"msg":"注册成功"});
   })  
});

//2.练习：在user.js中编写用户登录的路由post /login，获取post请求的数据，验证各项是否为空，执行SQL命令，如果查询到了用户名和密码同时匹配的数据，就是登录成功，否则登录失败
 r.post('/login',(req,res,next)=>{
   //获取数据
   let obj=req.body;
   //console.log(obj);
   //2.2验证用户名密码是否为空
   if(!obj.uname){	
    res.json({"code":401,"msg":"uname不能为空"});	
	return;
  }
  if(!obj.upwd){
     res.json({"code":402,"msg":"upwd不能为空"});
	 return;
  }
  //2.3执行SQL命令
  /*
  pool.query('select upwd from xz_user where uname=?',[obj.uname],(err,result)=>{
     if(err){
	   next(err);
	   return;
	 }
	 //console.log(result);    
	 //查询的结果是数组，如果是空数组，说明没有该用户
	 if(result.length===0){
        res.json({"code":403,"msg":"没有该用户"});
	    return;
	 }
	 let pwd=result[0].upwd;
	 if(obj.upwd===pwd){
	    res.json({"code":200,"msg":"登录成功"});
	 }else{
	   res.json({"code":404,"msg":"密码错误"});
	 }
	// console.log(pwd);
  
  });
  */
  pool.query('select * from xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],(err,result)=>{
	if(err){
		//如果有错误交给下一个中间件处理
		next(err);
		return;
	}
	console.log(result);
	//查询的结果是数组，如果是空数组说明登录失败，否则登录失败
	if(result.length !== 0){
		//表示登录成功
		res.send({"code":200,"msg":'登录成功'});	
	}else{
		//否则登录失败
		res.send({"code":201,"msg":'登录失败'});
	}
  });
   
});
//3.修改用户资料(put /)
r.put('/',(req,res,next)=>{
  //3.1获取post传递的数据(uid,email,phone,user_name,gender)
  let obj=req.body;
  let errcode=401;//错误状态码
  //3.2验证各项数据是否为空
  for(let k in obj){
	//k属性名 obj[k]属性值
	//如果属性值为空，提示属性名这项不能为空
    if(!obj[k]){
	  res.json({"code":errcode,"msg":`${k}不能为空`});	
	  return;  
	} 
	errcode++;//错误码加1
  }  
  //3.3执行SQL命令，修改用户的数据
  pool.query('update xz_user set ? where uid=?',[obj,obj.uid],(err,result)=>{
    if(err){
	  next(err);
	  return;
	}
	if(result.affectedRows===0){
	   res.json({"code":201,"msg":"修改失败"});
	   return;
	 }
     res.json({"code":200,"msg":"修改成功"});

  })


});
//4.添加查找员工接口 get  /编号
r.get('/:uid',(req,res,next)=>{
  //4.1获取路由传参的数据
  let uidObj=req.params;
  //4.2执行SQL命令
  pool.query('select uid,uname,email,phone from xz_user where uid=?',[uidObj.uid],(err,result)=>{
    if(err){
	  //交给下一个中间件处理
	  next(err);
	  return;
	}
	//如果是空数组，说明用户不存在，否则查找到了
	if(result.length===0){
	  res.json({"code":201,"msg":"该用户不存在"});
	}else{
	  res.json({"code":200,"msg":"查询成功","data":result});
	}
  });  
});

//5.添加删除员工接口
r.delete('/:uid',(req,res,next)=>{
  let uidObj=req.params;
  pool.query('delete from xz_user where uid=?',[uidObj.uid],(err,result)=>{
    if(err){
	  next(err);
	  return;
	}
	if(result.affectedRows===0){
	   res.json({"code":201,"msg":"删除失败"});
	   return;
	 }
     res.json({"code":200,"msg":"删除成功"});
  });
})

//导出路由器对象
module.exports=r;