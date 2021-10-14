
/* 
 * 将用户表的当前浏览商品id设置为点击的商品
 */
function jumpGoodDetail(goodId, addr) {
    console.log(111);
    let userLoad = localStorage.getItem("user");
    axios.get("./php/user.php", {
        fn: "altUserLookGId",
        userId:userLoad,
        currLookGId: goodId
    }).then(data => {
        console.log(goodId,addr);
        
        // 设置成功后再跳转到商品详情页面
        open(addr, "_blank");
    });

}

// 页面数据刷新的方法
function upPageData() {
    // 获取json数据
    axios.get("./php/goods.php", {
        fn: "getGoods"
    }).then(data => {

        data = JSON.parse(data);
        // console.log(data);

        data.forEach(goods => {

            // 渲染到页面
            $("#cont").appendChild(createGoodDiv(goods));

        });

        // lazyLoad(); // 数据库数据不充足时可以保留扩充第一次的页面数据
        window.onscroll = lazyLoad;

    });
}
upPageData();

function createEle(tag){
    return document.createElement(tag);
}

function createGoodDiv(goods){
    // 一整个商品
    let divObj = document.createElement("div");
    divObj.className = "good";

    // 商品部分信息展示
    let aObj = document.createElement("a");
    aObj.href = "#none";


    let html = ` <img src="${goods.headSrc}" alt="">
    <div class="num">已售${goods.outCount}件</div>
    <div>${goods.name}</div>
    <div class="price">￥${goods.price}</div>
    <div>价格:<span>￥${goods.oPrice}</span></div>`;
    aObj.innerHTML = html;
 
    aObj.addEventListener('click',jumpGoodDetail.bind(null,goods.goodId,goods.ahref));
    divObj.appendChild(aObj);

    // 加入购物车按钮
    let addObj = createEle("a");
    addObj.href = "#none";
    addObj.innerHTML = "加入购物车";
    addObj.addEventListener("click",addCart.bind(null,goods.goodId,1));
    divObj.appendChild(addObj);

    // 立即购买按钮
    let buyObj = createEle("a");
    buyObj.href = "#none";
    buyObj.innerHTML = "立即购买";
    buyObj.addEventListener("click",buyGood.bind(null,goods.goodId));
    divObj.appendChild(buyObj);
    return divObj;
}


// 计算购物车里商品的总数
function cartGoodCount() {
    // 获取当前登录的用户id
    let userLoad = localStorage.getItem("user");

    // 获取当前登录用户的购物车数据
    axios.get("./php/user.php", {
        fn: "getUserGoods",
        userId: userLoad
    }).then(data => {
        let goodsCart = JSON.parse(data)[0]["goodsId"];
        let toatlNum = 0;
        if (goodsCart) {
            // 将拿到的json数据转化为数组对象
            goodsCart = JSON.parse(goodsCart);

            // 循环累计购物车里商品数量
            goodsCart.forEach(goods => {
                toatlNum += goods.num;
            });
            // console.log(toatlNum);
        } else {
            toatlNum = 0;
        }

        // 将购物车的商品数量显示到页面上
        let cartGoodCountObj = document.querySelector(".cartGoodCount");
        cartGoodCountObj.innerHTML = toatlNum;
    });
}
cartGoodCount();


// 加入购物车点击事件处理函数
function addCart(goodsId, num) {
    // 从localStorage里拿取当前登录的用户数据
    let userLoad = localStorage.getItem("user");
    let goodsCart = null;

    // 构建一个对象
    let cGoods = {
        goodsId,
        num
    };

    axios.get("./php/user.php", {
        fn: "getUserGoods",
        userId: userLoad
    }).then(data => {
        // console.log(JSON.parse(data)[0]["goodsId"]);
        goodsCart = JSON.parse(data)[0]["goodsId"];

        if (goodsCart) {
            // 1. 当购物车里有数据时
            // 1-1. 将拿到的json数据转化为数组对象
            goodsCart = JSON.parse(goodsCart);
            // 用于表示该商品在购物车里是否存在
            let goodEx = null;

            // 1-2. 查找当前点击商品是否在购物车里
            goodsCart.forEach(goods => {
                if (goods.goodsId == goodsId) {
                    // 商品存在,就将该商品对象返回到外部
                    goodEx = goods;
                }
            });

            // 1-3. 商品是否存在购物车里的分别处理
            if (goodEx) {
                // 商品存在的处理
                goodEx.num = goodEx.num - 0 + (num - 0);
            } else {
                // 将当前商品的对象加入购物车数组里
                goodsCart.push(cGoods);
            }

            // 1-4. 更新当前登录用户的购物车数据
            upUserGoods(JSON.stringify(goodsCart));

        } else {
            // 2. 当购物车里没有数据时
            // 将构建的对象以数组的形式转化为json字符串，更新到当前登录用户的购物车里
            upUserGoods(JSON.stringify([cGoods]));
        }
    });
}

// 立即购买点击事件的处理
function buyGood(goodId) {

    axios.get("./php/goods.php", {
        fn: "getGoodOne",
        goodId
    }).then(data => {
        let good = JSON.parse(data)[0];
        // console.log(good);
        let count = good.count - 1;
        let outCount = good.outCount - 0 + 1;
        upGoodCount(good.goodId, count, outCount);

    });

}

// 更新当前商品的数量
function upGoodCount(goodId, count, outCount) {
    // console.log(goodId, count, outCount);
    axios.get("./php/goods.php", {
        fn: "altDataGood",
        goodId,
        count,
        outCount
    }).then(data => {
        console.log("商品数量更新成功!");
        upPageData();
    });
}

// 更新当前登录用户的购物车数据
function upUserGoods(jsonStr) {
    let userLoad = localStorage.getItem("user");

    axios.get("./php/user.php", {
        fn: "altUserGoods",
        userId: userLoad,
        goodsId: jsonStr
    }).then(data => {
        console.log("用户购物车更新成功!");
        cartGoodCount();
    });
}

/* ====================== 懒加载 ====================== */

// 获取数据库里商品列表总数
let length = null;

function Goodslength() {
    axios.get("./php/goods.php", {
        fn: "getCountGood"
    }).then(data => {
        // console.log(data);
        length = data;
    });
}

// 懒加载
function lazyLoad() {
    let line = document.querySelector("#goods .line");
    // let goodsList = document.querySelectorAll(".good");
    let goodsList = document.getElementsByClassName("good");
    let h = window.innerHeight; // 可视高度

    let scroll = document.documentElement.scrollTop; //滚动条高度

    // console.log(goodsList,goodsList.length,goodsList[goodsList.length - 1]);

    let conH = goodsList[goodsList.length - 1].offsetTop; //内容

    // 无限加载
    if (conH < scroll + h) {
        console.log("1111");

        Goodslength();
        axios.get("./php/goods.php", {
            fn: "getGoods"
        }).then(data => {
            let goodsArr = JSON.parse(data);

            // 可在此处加加载动画
            setTimeout(function () {
                for (let i = 0; i < 20; i++) {
                    let index = Math.floor(Math.random() * length);
                    let goods = goodsArr[index];
                    // console.log(index);
                    
                    line.appendChild(createGoodDiv(goods));
                }
            }, 1000);

        });

    }

}

