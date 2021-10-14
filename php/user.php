<?php
// 指定文件字符编码，必须放开头
header("content-type:text/html;charset=utf-8");
// 引入mysql文件
include('./mysql.php');
// 获取访问的方法
$fn = $_GET['fn'];
// 调用方法
$fn();

/* ================== 用户的方法 =================== */
// 添加用户方法
function addUser(){
  $name = $_GET['name'];
  $pwd = $_GET['pwd'];
  $sql = "insert into User values(null,'$name','$pwd',null)";
  $res = query($sql);
  echo $res;
}

// 获取用户方法
function getUser(){
  $name = $_GET['name'];
  $sql = "select * from User where user='$name'";
  $res = select($sql);
  print_r(json_encode($res));
}

// 修改用户密码方法
function altUserPwd(){
  $userId = $_GET['userId'];
  $pwd = $_GET['pwd'];
  $sql = "update User set pwd = '$pwd' where userId = $userId";
  $res = query($sql);
  echo $res;
}

// 获取用户名称的方法
function getUserName(){
  $userId = $_GET['userId'];
  $sql = "select user from User where userId = $userId";
  $res = select($sql);
  print_r(json_encode($res));
}

// 获取用户当前浏览的商品的id的方法
function getUserLookGId(){
  $userId = $_GET['userId'];
  $sql = "select currLookGId from User where userId = $userId";
  $res = select($sql);
  print_r(json_encode($res));
}

// 获取用户的购物车里的商品和数量
function getUserGoods(){
  $userId = $_GET['userId'];
  $sql = "select goodsId from User where userId = $userId";
  $res = select($sql);
  print_r(json_encode($res));
}

// 修改用户的购物车里指定商品（goodId）数量的方法
function altUserGoods(){
  $userId = $_GET['userId'];
  $goodsId = $_GET['goodsId'];

  $sql = "update User set goodsId = '$goodsId' where userId = $userId";
  $res = query($sql);
  echo $res;
}

// 清空用户当前浏览的商品的id的方法
function clearUserLookGId(){
  $userId = $_GET['userId'];
  $sql = "update User set currLookGId = null where userId = $userId";
  $res = query($sql);
  echo $res;
}

// 修改用户当前浏览的商品的id的方法
function altUserLookGId(){
  $userId = $_GET['userId'];
  $currLookGId = $_GET['currLookGId'];
  $sql = "update User set currLookGId = '$currLookGId' where userId = $userId";
  $res = query($sql);
  echo $res;
}

// 清空用户的购物车列表
function clearUserGoods(){
  $userId = $_GET['userId'];

  $sql = "update User set goodsId = null where userId = $userId";
  $res = query($sql);
  echo $res;
}




// 删除用户数据的方法
function delGood(){
  $userId = $_GET['userId'];
  $sql = 'delete from User where userId='.$userId;
  $res = query($sql);
  echo $res;
}


// 写错的方法（删掉）
function altUserGoodsDelete(){
  $userId = $_GET['userId'];

  $goodsId = $_GET['goodsId'];
  $num = $_GET['num'];
  
  $selSql = "select goodsId from User where userId = $userId";
  $selRes = select($selSql);
  
  $goods = json_decode($selRes[0]["goodsId"]);
  // print_r($goods);

  foreach($goods as $k=>$good){
    print_r($good);
    echo "<br/>"; 
    // if($goodsId == $good["goodsId"]){
    //   $good["num"] += $num;
    // };
  }
  echo "<br/>"; 
  print_r($goods);

  

  // $sql = "update User set goodsId = '$goodsId' where userId = $userId";
  // $res = query($sql);
  // echo $res;
}


?>