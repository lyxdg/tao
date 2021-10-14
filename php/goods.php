<?php
// 引入mysql文件
include('./mysql.php');
// 获取访问的方法
$fn = $_GET['fn'];
// 调用方法
$fn();

// 添加数据的方法
function addGood(){
  $headSrc = $_GET['headSrc'];
  $price = $_GET['price'];
  $name = $_GET['name'];
  $describle = $_GET['describle'];
  $shop = $_GET['shop'];
 
  $sql = "insert into goods values(null,'$headSrc','$price','$name','$describle','$shop')";
  $res = query($sql);
  echo $res;
}


// 商品列表获取所有商品信息
function getGoods(){
  $sql = "select * from goods";
  $res = select($sql);
  print_r(json_encode($res));
}

// 商品列表获取所有商品信息
function getHotGoods(){
  $sql = "select * from goods order by outCount DESC";
  $res = select($sql);
  print_r(json_encode($res));
}

// 获取数据的方法
function getGood(){
  // 规定每一页数据长度
  $length = 20;
  
  // 当前页码数
  $page = $_GET['page'];
  // 开始位置  (当前页码-1)*长度 
  $start = ($page-1)*$length;

  // 获取长度
  $sql1 = 'select  count(id) cou from goods';
  $res = select($sql1);
  $count = $res[0]['cou'];
  // 计算总的页数
  $cPage = ceil($count/$length);
  // print_r( $cPage);die;

  $sql = "select * from goods order by id limit $start, $length";
  $res = select($sql);
  print_r(json_encode([
    'pData'=>$res,
    'cPage'=> $cPage
  ]));
}

// 只获取一条数据的方法
function getGoodOne(){
  $goodId = $_GET["goodId"];
  $sql = "select * from goods where goodId = $goodId";
  $res = select($sql);
  print_r(json_encode($res));
}

// 修改指定商品数量的方法
function altDataGood(){
  $goodId = $_GET["goodId"];
  $count = $_GET['count'];
  $outCount = $_GET['outCount'];

  $sql = "update goods set count = '$count',outCount = '$outCount' where goodId = $goodId";
  $res = query($sql);
  echo $res;
}

// 修改指定商品被加入购物车的数量的方法
function altGoodCount(){
  $goodId = $_GET["goodId"];
  $num = $_GET["num"];

  $selSql = "select inCartCount from goods where goodId = $goodId";
  $selRes = select($selSql);

  $inCartCount = $selRes[0]["inCartCount"] + $num;
  // print_r($inCartCount);

  $sql = "update goods set inCartCount = '$inCartCount' where goodId = $goodId";
  $res = query($sql);
  echo $res;
}

// 删除数据的方法
function delGood(){
  $goodId = $_GET['infoId'];
  $sql = 'delete from goods where goodId='.$goodId;
  $res = query($sql);
  echo $res;
}

// 获取数据列表长度的方法
function getCountGood(){
  // $length = 1;
  // 获取长度
  $sql1 = 'select  count(goodId) cou from goods';
  $res = select($sql1);
  $count = $res[0]['cou'];
  // 计算总的页数
  // $cPage = ceil($count/$length);
  echo $count;
}
?>