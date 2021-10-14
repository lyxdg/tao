class Carts {
    constructor() {
        // 当前登录用户的商品店铺数组
        this.shops = [];

        // 获取页面数据
        this.getLSData();

        // 存放当前页面选中的店铺有多少
        this.ckShopCount = 0;

        // 存放当前页面选中的商品有多少
        this.ckOCount = 0;

        // 两个全选按钮
        this.allChecks = document.querySelectorAll(".check-all");
        this.allChecks[0].addEventListener("click", this.allCheckFn.bind(this, 1));
        this.allChecks[1].addEventListener("click", this.allCheckFn.bind(this, 0));

        // 店铺伪数组
        this.shopChecks = document.getElementsByClassName("J_CheckBoxShop");

        // 商品选择框伪数组
        this.oneChecks = document.getElementsByClassName("j-checkbox");

        // 给购物车列表容器绑定点击事件
        this.ConDivObj = this.$(".cart-item-list");
        this.ConDivObj.addEventListener("click", this.ConDivObjFn.bind(this));

        // 给结算模块绑定点击事件
        this.totalConObj = this.$(".cart-floatbar");
        this.totalConObj.addEventListener("click", this.totalConObjFn.bind(this));

        this.totalNP();

    }

    /* 购物车列表容器点击事件的处理函数 */
    ConDivObjFn(event) {
        let target = event.target;
        // console.log(target.className);

        // 点击了店铺的选中框
        if (target.className == "J_CheckBoxShop") {
            this.shopCheckFn(target);
        }

        // 点击了商品的选中框
        if (target.className == "j-checkbox") {
            this.oneClickFn(target);
        }

        // 点击里商品的数量添加按钮
        if (target.className == "increment") {
            this.addFn(target);
        }

        // 点击了商品的数量减少按钮
        if (target.className == "decrement") {
            this.reduceFn(target);
        }

        // 点击了商品删除按钮
        if (target.className == "delete") {
            this.deleteFn(target);
        }
    }

    /* 结算模块按钮列表点击事件处理函数 */
    totalConObjFn(event) {
        let target = event.target;
        // console.log(target);

        // 点击了清空购物车按钮
        if (target.className == "clear-all") {
            this.clearAllFn();
        }

        // 点击了删除选中的商品
        if (target.className == "remove-batch") {
            this.removeCheckG(1, target);
        }

        // 点击了结算
        if (target.className == "btn-area") {
            this.removeCheckG(2, target);
        }
    }

    /*
     * 结算和删除选中的商品 
     * @param state 从哪一个方法进来的 1：删除按钮 2：结算按钮
     * @param target 点击的对象
     * @param oneChecks 所有商品的选择框
     */
    removeCheckG(state, target, oneChecks = null) {
        // console.log(this.oneChecks);
        let that = this;

        this.oneChecks = oneChecks || this.oneChecks;
        // this.oneChecks = document.getElementsByClassName("j-checkbox");

        let info = "";
        if (state == 1) {
            info = "是否确认删除所有选中的商品？";
        } else if (state == 2) {
            let PayPrice = target.previousElementSibling.lastElementChild.innerHTML;
            info = "确认支付!" + PayPrice + "元！";
        }

        layer.confirm(info, {
            btn: ['确定', '取消'] //按钮
        }, function (index) {

            Array.from(that.oneChecks).forEach(one => {
                let goodObj = one.parentNode.parentNode;
                // 当前商品所在的店铺
                let shopObj = goodObj.parentNode;
                // 当前登录用户购物车里该店铺商品的伪数组
                let shopGoods = shopObj.getElementsByClassName("j-checkbox");
                let goodId = goodObj.getAttribute("goods-id");

                // 选中状态，数量和小计都加到结算模块的数量和总计上
                if (one.checked) {
                    console.log(goodObj, shopObj, shopGoods, goodId);

                    that.deleteGood(goodObj, shopObj, shopGoods, goodId);


                }
            });

            layer.close(index);
        });

    }

    /*
     * 删除商品的具体方法 
     * @param goodObj 当前商品节点
     * @param shopObj 当前商品所在的店铺节点
     * @param shopGoods 当前商品所在的店铺下所有的商品节点集合
     * @param goodId 当前商品的id
     */
    deleteGood(goodObj, shopObj, shopGoods, goodId) {
        let that = this;
        // 删除当前商品
        goodObj.remove();

        // 购物车里该店铺下商品种类的数量
        let usgCount = shopGoods.length;
        console.log(shopGoods, usgCount);
        // 当该用户购物车里的该店铺的商品数量为0时，删除该店铺
        if (usgCount == 0) {
            let shopName = shopObj.getAttribute("shopName");
            let shopIndex = that.shops.indexOf(shopName);
            that.shops.splice(shopIndex, 1);
            shopObj.remove();
        }

        // 获取当前商品在购物车里的数量
        let num = goodObj.querySelector(".itxt").value;
        // 修改goods商品列表数据
        that.altGoodsCount(goodId, -num);
        // 修改用户商品列表数据
        that.altDBlData(goodId, 0);

        // 当所有商品都清空时，即店铺的数量为0时，页面的显示情况
        if (that.shops.length == 0) {
            let container = document.querySelector(".w");
            let goodsCartContent = document.querySelector(".cart-warp");
            let pObj = document.createElement("p");
            pObj.innerHTML = "这里竟然什么也没有！";
            container.insertBefore(pObj, goodsCartContent);
            goodsCartContent.style.display = "none";

            that.clearUserGood();

        } else {
            // that.getLSData();
            // 重新获取数据一定要在页面数据改变之后
            goodObj.firstElementChild.firstElementChild.checked && that.totalNP();
        }
    }


    /* 
     * 清空购物车按钮的点击事件
     */
    clearAllFn() {

        let that = this;

        layer.confirm('是否确认清空购物车？', {
            btn: ['确定', '取消'] //按钮
        }, function (index) {

            that.clearUserGood();
            that.getLSData();

            layer.close(index);
        });


    }

    /* 
     * 清空用户表购物车里的数据
     */
    clearUserGood() {
        // 获取当前登录的用户id
        let userLoad = localStorage.getItem("user");

        axios.get("./php/user.php", {
            fn: "clearUserGoods",
            userId: userLoad
        }).then(data => {
            console.log("用户表清空成功");
        });
    }



    /*  备份的常用
    axios.get("./php/user.php", {
        fn: "getUserGoods",
        userId: userLoad
    }).then(data => {
            
        let goodsCart = JSON.parse(data)[0]["goodsId"];
        console.log(goodsCart);
    });

    */



    /* 
     * 添加数量按钮的点击事件
     * @param target 当前点击的对象
     */
    addFn(target) {
        let goodId = target.parentNode.parentNode.parentNode.getAttribute("goods-id");

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
                let num = target.previousElementSibling.value - 0;
                num++;
                target.previousElementSibling.value = num;

                let goodCont = target.parentNode.parentNode.parentNode;
                let otherNum = goodCont.querySelector(".p-type").lastElementChild;
                otherNum.innerHTML = "数量：" + num;


                // 修改goods商品列表数据
                this.altGoodsCount(goodId, 1);

                // 修改用户商品列表数据
                this.altOneNP(target, num);

            } else {
                layer.msg('该商品的库存都被你拿完了');
            }

        });

    }

    /* 
     * 减少数量按钮的点击事件
     * @param target 当前点击的对象
     */
    reduceFn(target) {
        let goodId = target.parentNode.parentNode.parentNode.getAttribute("goods-id");

        let goodCont = target.parentNode.parentNode.parentNode;

        let num = target.nextElementSibling.value - 0;
        num--;
        if (num == 0) {
            let deleteObj = goodCont.querySelector(".delete");
            this.deleteFn(deleteObj);
            return;
        }

        // 修改goods商品列表数据
        this.altGoodsCount(goodId, -1);


        target.nextElementSibling.value = num;

        let otherNum = goodCont.querySelector(".p-type").lastElementChild;
        otherNum.innerHTML = "数量：" + num;

        // 修改用户商品列表数据
        this.altOneNP(target, num);
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
            console.log("商品修改成功" + goodId + ":" + num);
        });
    }

    /* 
     * 单个商品数量和小计变化处理函数
     * @param target 当前点击的对象
     * @num 当前商品的数量
     */
    altOneNP(target, num) {
        let goodObj = target.parentNode.parentNode.parentNode;
        let onePrice = goodObj.querySelector(".p-price em").innerHTML;

        goodObj.querySelector(".p-sum em").innerHTML = onePrice * num;

        // 只有加减选中的商品数量时，才更新总结模块的数据
        if (target.innerHTML == "+" || target.innerHTML == "-") {
            goodObj.firstElementChild.firstElementChild.checked && this.totalNP();
        } else {
            this.totalNP();
        }


        // 修改数据库里的数据
        this.altDBlData(goodObj.getAttribute("goods-id"), num);
    }

    /* 
     * 删除按钮的点击事件
     * @param target 当前点击的对象
     */
    deleteFn(target) {
        console.log("222");
        let that = this;

        // 当前商品
        let goodObj = target.parentNode.parentNode;
        // 当前商品所在的店铺
        let shopObj = goodObj.parentNode;
        // 当前登录用户购物车里该店铺商品的伪数组
        let shopGoods = shopObj.getElementsByClassName("j-checkbox");

        let goodId = goodObj.getAttribute("goods-id");
        // console.log(goodId, usgCount);

        layer.confirm('是否确认删除？', {
            btn: ['确定', '取消'] //按钮
        }, function (index) {

            that.deleteGood(goodObj, shopObj, shopGoods, goodId);

            layer.close(index);
        });



    }


    /* 
     * 数据库购物车数据修改的方法
     * @param goodId 商品id
     * @param num 修改为的目标商品数量
     */
    async altDBlData(goodId, num = 0) {
        // 获取当前登录的用户id
        let userLoad = localStorage.getItem("user");

       await axios.get("./php/user.php", {
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
                    goods.num = num;
                }
            });

            // 将购物车里的商品以json字符串的形式，进行修改
            this.altDBUserGoods(JSON.stringify(goodsArr));

        });

    }

    /*
     * 修改用户的数据库购物车数据的具体方法
     * @param jsonStr 购物车数据的json字符串 
     */
    async altDBUserGoods(jsonStr) {
        // 获取当前登录的用户id
        let userLoad = localStorage.getItem("user");

        await axios.get("./php/user.php", {
            fn: "altUserGoods",
            userId: userLoad,
            goodsId: jsonStr
        }).then(data => {
            console.log("修改用户购物车数据成功" + jsonStr);
        });
    }


    /* 
     * 全选按钮点击事件处理函数
     */
    allCheckFn(index, event) {
        let acStatus = event.target.checked;
        // 让另一个全选状态改变
        this.allChecks[index].checked = acStatus;

        // 让店铺的选择框变化
        Array.from(this.shopChecks).forEach(shop => {
            shop.checked = acStatus;
        });

        Array.from(this.oneChecks).forEach(one => {
            one.checked = acStatus;
        });

        // 当前页面选中的店铺数量和商品数量的更改
        if (acStatus) {
            this.ckShopCount = this.shopChecks.length;
            this.ckOCount = this.oneChecks.length;
        } else {
            this.ckShopCount = 0;
            this.ckOCount = 0;
        }
        // this.ckOCount = acStatus ? this.oneChecks.length : 0;

        this.totalNP();
    }

    /* 
     * 店铺选择框的点击事件
     * @param target 当前点击的对象
     */
    shopCheckFn(target) {
        // 获取当前的选中状态
        let shopCkStatus = target.checked;
        let shopObj = target.parentNode.parentNode;
        // 该店铺下商品的伪数组
        let shopGoods = shopObj.querySelectorAll(".j-checkbox");

        // 当前点击为选中状态
        if (shopCkStatus) {
            this.ckShopCount++;

            // 让店铺里原来没有选中的店铺的数量加到选中上
            Array.from(shopGoods).forEach(good => {
                if (!good.checked) {
                    this.ckOCount++;
                }
            });

            // 当所有店铺都选中时，让全选选中
            if (this.ckShopCount == this.shopChecks.length) {
                this.allChecks[0].checked = true;
                this.allChecks[1].checked = true;
            }
        } else {
            this.ckShopCount--;
            this.ckOCount -= shopGoods.length;
            this.allChecks[0].checked = false;
            this.allChecks[1].checked = false;
        }

        // 更改该店铺下商品的选中状态
        Array.from(shopGoods).forEach(good => {
            good.checked = shopCkStatus;
        });

        this.totalNP();
    }

    /* 
     * 商品选择框的点击事件
     * @param target 当前点击的对象
     */
    oneClickFn(target) {
        // 获取当前的选中状态
        let ocStatus = target.checked;
        // 获取该商品所在的店铺
        let shopObj = target.parentNode.parentNode.parentNode;
        let shopCkObj = shopObj.firstElementChild.firstElementChild;
        // 该店铺里商品选中的数量
        let shopCkCount = 0;
        // 该店铺下商品的伪数组
        let shopGoods = shopObj.querySelectorAll(".j-checkbox");

        Array.from(shopGoods).forEach(good => {
            if (good.checked) shopCkCount++;
        });

        // console.log(shopCkCount);

        if (ocStatus) {
            // 当前点击为选中时,让选中的商品数量加一
            this.ckOCount++;

            // 当店铺里的商品全选中时，让当前店铺全选也选中
            if (shopCkCount == shopGoods.length) {
                shopCkObj.checked = true;
                this.ckShopCount++;
            }

            // 当购物车里的商品全部选中时，让两个全选按钮也选中
            if (this.ckOCount == this.oneChecks.length) {
                this.allChecks[0].checked = true;
                this.allChecks[1].checked = true;
            }
        } else {
            // 只有店铺原本为选中状态时，选中的店铺数量才减一
            if (shopCkObj.checked) {
                console.log("店铺选中数量减一");
                this.ckShopCount--;
            }
            // 当前点击为取消选中时，让全选按钮和店铺全选也不选中
            shopCkObj.checked = false;
            this.ckOCount = this.ckOCount > 0 ? --this.ckOCount : 0;
            this.allChecks[0].checked = false;
            this.allChecks[1].checked = false;
        }
        // 更新总结模块数据
        this.totalNP();
    }


    /* 更新选中的商品数量总和和价格总和 */
    totalNP(oneChecks = null) {
        // console.log(this.ckShopCount, this.ckOCount);

        let totalNum = 0;
        let totalPrice = 0;

        this.oneChecks = oneChecks || this.oneChecks;

        Array.from(this.oneChecks).forEach(one => {
            let cartItem = one.parentNode.parentNode;
            // 选中状态，数量和小计都加到结算模块的数量和总计上
            if (one.checked) {
                totalNum += cartItem.querySelector(".itxt").value - 0;
                totalPrice += cartItem.querySelector(".p-sum em").innerHTML - 0;
            }
        });

        // 将更改后的数据渲染回页面
        this.$(".amount-sum em").innerHTML = totalNum;
        this.$(".price-sum em").innerHTML = "￥" + (totalPrice.toFixed(2));

    }


    /* 获取页面数据 */
    getLSData() {
        // let that = this;
        this.shops = [];
        // 获取当前登录的用户id
        let userLoad = localStorage.getItem("user");

        // 获取当前登录用户的购物车数据
        axios.get("./php/user.php", {
            fn: "getUserGoods",
            userId: userLoad
        }).then(data => {
            let goodsCart = JSON.parse(data)[0]["goodsId"];
            // let goodsCart = null;

            // 获取商品列表的相关节点
            let container = document.querySelector(".w");
            let goodsCartContent = document.querySelector(".cart-warp");
            // console.log(goodsCart);

            if (goodsCart) {
                // 将拿到的json数据转化为数组对象
                goodsCart = JSON.parse(goodsCart);

                // 显示商品列表的容器
                goodsCartContent.style.display = "block";

                // 删除购物车为空才显示的节点
                let pObj = document.querySelector(".w p");
                if (pObj) {
                    pObj.remove();
                }

                // 循环显示商品数据到页面
                goodsCart.forEach(goods => {
                    this.GoodInfo(goods.goodsId, goods.num);
                });


            } else {
                let pObj = document.createElement("p");
                pObj.innerHTML = "这里竟然什么也没有！";
                container.insertBefore(pObj, goodsCartContent);
                goodsCartContent.style.display = "none";

            }

        });
    }

    /* 
     * 获取指定id商品信息添加到页面
     * @param goodId 商品id
     * @param uGoodNum 商品数量
     */
    GoodInfo(goodId, uGoodNum) {
        axios.get("./php/goods.php", {
            fn: "getGoodOne",
            goodId
        }).then(data => {
            let good = JSON.parse(data)[0];
            // console.log(good,good["shop"]);
            let shopName = good.shop;

            // 获取商品列表的节点
            let goodsContent = document.querySelector(".cart-item-list");

            // 店铺的节点
            let shopDiv = null;
            // console.log(shop);
            if (this.shops.indexOf(shopName) != -1) {
                shopDiv = document.querySelector("div[shopName ='" + shopName + "']");
            } else {
                this.shops.push(shopName);
                shopDiv = document.createElement("div");
                shopDiv.setAttribute("shopName", shopName);
                // 店铺的头部信息
                let headHtml = `<div class="J_ItemHead">
                <input class="J_CheckBoxShop" type="checkbox" name="orders[]">
                <span>${good.shop}</span>
                </div>`;
                shopDiv.innerHTML = headHtml;
            }

            // 购物车里该店铺的商品
            let goodDiv = document.createElement("div");
            goodDiv.classList.add("cart-item");
            goodDiv.setAttribute("goods-id", good.goodId);

            // 商品的部分信息
            let goodHtml = `<div class="p-checkbox" style="width: 95px!important">
            <input type="checkbox" name="" id="" class="j-checkbox">
        </div>
        <div class="p-goods">
            <div class="p-img">
                <img src="${good.headSrc}" alt="">
            </div>
            <div class="p-msg">
                <div class="descript">${good.describle}</div>
                <div class="p-type">
                    <span>类别：360g</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>数量：${uGoodNum}</span>
                </div>
            </div>
        </div>
        <div class="p-price">￥<em>${good.price}</em></div>
        <div class="p-num">
            <div class="quantity-form">
                <a href="javascript:;" class="decrement">-</a>
                <input type="text" class="itxt" value="${uGoodNum}">
                <a href="javascript:;" class="increment">+</a>
            </div>
        </div>
        <div class="p-sum">￥<em>${(good.price * uGoodNum).toFixed(2)}</em></div>
        <div class="p-action"><a class="delete" href="javascript:;">删除</a></div>
            `;
            goodDiv.innerHTML = goodHtml;
            // 将该商品追加到相应的店铺下面
            shopDiv.appendChild(goodDiv);

            // 将店铺的节点追加到页面
            goodsContent.appendChild(shopDiv);

            // console.log(shopDiv);

        });
    }



    /* 
     * 获取节点
     * @param tag 选择器
     */
    $(tag) {
        return document.querySelector(tag);
    }
}

new Carts;