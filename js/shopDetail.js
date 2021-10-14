/* 图片放大的类 */
class ScaleImg {
  constructor() {
    this.boxObj = this.$('#showbox');
    this.smallObj = this.$('#smallImg');
    this.maskObj = this.$('#mask');
    this.bigObj = this.$('#bigImg');
    this.bImg = this.$('#imgBig');

    this.spansObj = document.querySelectorAll('#showsum span');
    this.sel = this.$(".sel");
    this.lastImg = this.$("#showlast");
    this.nextImg = this.$("#shownext");
    // 记录一共有多少张缩略图
    this.count = 0;
    // 当前显示的放大图
    this.index = 0;

    // 给每个span缩略图绑定鼠标移入事件
    this.spanEnterFn();
    // 上一张和后一张
    this.lastImg.addEventListener("click", this.showLast.bind(this));
    this.nextImg.addEventListener("click", this.showNext.bind(this));

    // 给small绑定鼠标移入,移出事件
    this.smallObj.addEventListener('mouseenter', this.enterFn.bind(this));
    this.smallObj.addEventListener('mouseleave', this.leaveFn.bind(this));

    // 绑定鼠标移动事件
    this.smallObj.addEventListener('mousemove', this.moveFn.bind(this));


  }

  /* ============= 选择放大图片的方法 ============= */

  // 给每个span缩略图绑定点击事件
  spanEnterFn() {
    // console.log(this);
    this.spansObj.forEach((span, i) => {
      this.count++;
      span.setAttribute("index", i);
      span.onmouseenter = () => {

        this.index = span.getAttribute("index");
        this.updataImg(this.index);
      }
    });
  }

  // 显示更新的方法
  updataImg(i) {
    // 添加和移除类名
    let selObj = document.querySelector(".sel");
    selObj.classList.remove("sel");
    this.spansObj[i].classList.add("sel");

    // 更改放大的图片为选中的图片
    let imgSrc = this.spansObj[i].firstElementChild.src;
    this.smallObj.firstElementChild.src = imgSrc;
    this.bImg.src = imgSrc;
  }

  // 上一张图片
  showLast() {
    // console.log("上一张");
    if (this.index == 0) {
      return;
    } else {
      this.index--;
    }
    this.updataImg(this.index);
  }

  // 下一张图片
  showNext() {
    // console.log("下一张");
    if (this.index == this.count - 1) {
      return;
    } else {
      this.index++;
    }
    this.updataImg(this.index);
  }


  /* =============== 放大的方法 =============== */

  // 移入
  enterFn() {
    // console.log(this);
    // 1 显示小方块和大图
    this.maskObj.style.display = 'block';
    this.bigObj.style.display = 'block';
  }

  // 移出
  leaveFn() {
    this.maskObj.style.display = 'none';
    this.bigObj.style.display = 'none';
  }

  // 移动
  moveFn(event) {
    // console.log(event);
    // 1 获取鼠标的实时位置
    let mx = event.pageX;
    let my = event.pageY;
    // 2 获取box的坐标值
    let boxT = this.boxObj.offsetTop;
    let boxL = this.boxObj.offsetLeft;

    // console.log(mx,my, boxL,boxT,this.maskObj.offsetWidth, this.maskObj.offsetHeight);

    // 3 计算滑块的坐标
    let tmpX = mx - boxL - this.maskObj.offsetWidth / 2;
    let tmpY = my - boxT - this.maskObj.offsetHeight / 2 - 200;

    // 3-1 计算最大的坐标
    let maxL = this.smallObj.offsetWidth - this.maskObj.offsetWidth;
    let maxT = this.smallObj.offsetHeight - this.maskObj.offsetHeight;

    // 4 判断边界值
    if (tmpX < 0) tmpX = 0
    if (tmpY < 0) tmpY = 0;

    // 最大值设置
    if (tmpX > maxL) tmpX = maxL;
    if (tmpY > maxT) tmpY = maxT;

    this.maskObj.style.left = tmpX + 'px';
    this.maskObj.style.top = tmpY + 'px';

    // 计算大图在div中,移动的最大位置
    let bigL = this.bigObj.offsetWidth - this.bImg.offsetWidth;
    let bigT = this.bigObj.offsetHeight - this.bImg.offsetHeight;

    // 计算大图的实时位置
    let tmpBigT = tmpY / maxT * bigT;
    let tmpBigL = tmpX / maxL * bigL;

    // 实时位置设置给大图
    this.bImg.style.left = tmpBigL + 'px';
    this.bImg.style.top = tmpBigT + 'px';
  }

  $(ele) {
    return document.querySelector(ele)
  }
}
new ScaleImg;


/* 
 * 购买和加入购物车的类
 * 商品详情页面界面初始化的类
 */
class buyOrAdd {
  constructor() {
    this.firstbuy = this.$("#firstbuy");
    this.addGoods = this.$("#addGoods");

    // 获取当前登录的用户id
    this.userLoad = localStorage.getItem("user");

    this.sdObj = this.$(".shopdetails");
    this.setPageGoodId();

  }

  /* 从用户数据库里取出当前页面要展示的商品的id */
  setPageGoodId() {
    axios.get("./php/user.php", {
      fn: "getUserLookGId",
      userId: this.userLoad
    }).then(data => {
      // 从用户表里拿到当前浏览的商品id
      let userLookGId = JSON.parse(data)[0]["currLookGId"];

      // 将该商品id赋值给页面
      this.sdObj.setAttribute("goodId", userLookGId);
      // 当前商品的id
      this.goodId = this.sdObj.getAttribute("goodId");
      console.log("当前商品Id:" + this.goodId);

      // this.clearDBuLookGId();

      this.initPage();

      // 给立即购买绑定点击事件
      this.firstbuy.addEventListener("click", this.buyFn.bind(this, this.goodId));
      // 给加入购物车绑定点击事件
      this.addGoods.addEventListener("click", this.addGoodFn.bind(this, this.goodId));

    });
  }

  /* 页面初始化 */
  initPage() {
    axios.get("./php/goods.php", {
      fn: "getGoodOne",
      goodId: this.goodId
    }).then(data => {
      let good = JSON.parse(data)[0];
      // console.log(good);

      // 图片部分

      // 放大镜部分的图
      let smallImgObj = this.$("#smallImg img");
      let bigImgObj = this.$("#imgBig");
      let showsumObj = this.$("#showsum");
      let SelectImgCons = showsumObj.children;
      let goodTypes = document.querySelectorAll(".shopimg");
      // console.log(goodTypes);

      let goodSrcFile = this.goodId;
      if (goodSrcFile < 10) {
        goodSrcFile = "good0" + goodSrcFile;
      }
      console.log(goodSrcFile);

      // 放大镜主体部分
      smallImgObj.src = "images/" + goodSrcFile + "/img01.webp";
      bigImgObj.src = "images/" + goodSrcFile + "/img01.webp";

      // 缩略图
      Array.from(SelectImgCons).forEach((span, i) => {
        let imgObj = span.firstElementChild;
        let index = i + 1;
        if (index < 10) {
          index = "/img0" + index;
        }
        imgObj.src = "images/" + goodSrcFile + index + ".webp";
      });

      // 商品款式部分
      goodTypes.forEach((li, i) => {
        let imgObj = li.firstElementChild.firstElementChild;
        let index = i + 1;
        if (index < 10) {
          index = "/img0" + index;
        }
        imgObj.src = "images/" + goodSrcFile + index + ".webp";
      });

      // 商品热卖部分
      this.createSaleGood();


      // 文字信息部分
      let centerboxObj = this.$(".centerbox");
      // 标题
      let imgnameObj = this.$(".imgname");
      imgnameObj.innerHTML = good.name;
      // 原价
      let oPriceObj = this.$(".Aprice samp");
      oPriceObj.innerHTML = good.oPrice;
      // 现价
      let priceObj = this.$(".price samp");
      priceObj.innerHTML = good.price;
      // 打折
      




    });
  }

  /* 热卖商品部分的渲染 */
  createSaleGood() {
    axios.get("./php/goods.php", {
      fn: "getHotGoods"
    }).then(data => {
      let goodsArr = JSON.parse(data);
      // console.log(goodsArr);
      let rightBoxObj = this.$(".rightbox");

      // 取前三个返回给页面
      for (let i = 0; i < 3; i++) {
        let good = goodsArr[i];

        let goodDiv = document.createElement("a");
        goodDiv.classList.add("pro_list_item");
        goodDiv.href = good.ahref;

        goodDiv.innerHTML = `<img src="${good.headSrc}" width="130" height="180">
            <p>￥${good.price}元</p>`;

        // console.log(goodDiv);
        rightBoxObj.append(goodDiv);
      }



    });
  }


  /* 清空数据库用户表的当前浏览商品的id */
  clearDBuLookGId() {
    axios.get("./php/user.php", {
      fn: "clearUserLookGId",
      userId: this.userLoad
    }).then(data => {

    });
  }

  /* 
   * 立即购买的方法
   */
  buyFn(goodId) {
    // console.log("购买了该商品！");
    axios.get("./php/goods.php", {
      fn: "getGoodOne",
      goodId
    }).then(data => {
      let good = JSON.parse(data)[0];
      // console.log(good);
      let count = good.count - 1;
      let outCount = good.outCount - 0 + 1;
      this.upGoodCount(good.goodId, count, outCount)

    });
  }

  /* 
   * 更新数据库的goods表里当前商品的数量
   */
  upGoodCount(goodId, count, outCount) {
    // console.log(goodId, count, outCount);
    axios.get("./php/goods.php", {
      fn: "altDataGood",
      goodId,
      count,
      outCount
    }).then(data => {
      console.log("商品数量更新成功!");
    });
  }


  /* 
   * 加入购物车的方法
   * @param target 当前点击的对象
   */
  addGoodFn(goodId) {

    axios.get("./php/goods.php", {
      fn: "getGoodOne",
      goodId
    }).then(data => {
      let goodOne = JSON.parse(data)[0];
      let count = goodOne.count;

      let uCartCount = goodOne.inCartCount;

      // console.log(count,uCartCount, Number(count) > Number(uCartCount));

      // 当该商品的库存大于购物车数量时，才能添加购物车里的商品数量
      if (Number(count) > Number(uCartCount)) {
        // let num = target.previousElementSibling.value - 0;
        // num++;

        // // 修改goods商品列表数据
        this.altGoodsCount(goodId, 1);

        // // 修改用户商品列表数据
        this.altDBlData(goodId, 1);

      } else {
        layer.msg('该商品的库存都被你拿完了');
      }

    });

  }

  /*
   * 修改数据库商品表里指定商品的数量 
   * @param goodId 商品id
   * @param num 变化的数量(分正负)
   */
  altGoodsCount(goodId, num) {

    axios.get("./php/goods.php", {
      fn: "altGoodCount",
      goodId,
      num
    }).then(data => {
      console.log("商品修改成功" + data);
    });
  }

  /* 
   * 用户表购物车数据修改的方法
   * @param goodId 商品id
   * @param num 修改为的目标商品数量
   */
  altDBlData(goodId, num = 0) {
    // 获取当前登录的用户id
    let userLoad = localStorage.getItem("user");

    axios.get("./php/user.php", {
      fn: "getUserGoods",
      userId: userLoad
    }).then(data => {

      let goodsCart = JSON.parse(data)[0]["goodsId"];
      // 购物车的商品数组
      let goodsArr = JSON.parse(goodsCart);

      // 找到对应的修改项，并修改值
      goodsArr.forEach((goods, k) => {
        if (goods.goodsId == goodId) {
          if (!num) goodsArr.splice(k, 1);
          goods.num += num;
        }
      });

      // 将购物车里的商品以json字符串的形式，进行修改
      this.altDBUserGoods(JSON.stringify(goodsArr));

    });

  }

  /*
   * 修改用户表的购物车数据的具体方法
   * @param jsonStr 购物车数据的json字符串 
   */
  altDBUserGoods(jsonStr) {
    // 获取当前登录的用户id
    let userLoad = localStorage.getItem("user");

    axios.get("./php/user.php", {
      fn: "altUserGoods",
      userId: userLoad,
      goodsId: jsonStr
    }).then(data => {
      console.log("修改用户购物车数据成功");
    });
  }

  $(ele) {
    return document.querySelector(ele)
  }
}
new buyOrAdd;