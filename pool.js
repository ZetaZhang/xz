//连接池Pool.js中，引入mysql模块，创建连接池对象
//引入mysql
const mysql=require('mysql');
const pool=mysql.createPool({
  host:'127.0.0.1',
  user:'root',
  password:'',
  port:'3306',
  database:'xz'
});
//导出连接池对象
module.exports=pool;