var oNavContentData = [{
        title: '标题1',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题2',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题3',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题4',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题5',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题6',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题7',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题8',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题9',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题10',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题11',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题12',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题13',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
    {
        title: '标题14',
        list1: [1, 2, 3, 4, 5],
        list2: [1, 2, 3, 4, 5],
        list3: [1, 2, 3, 4, 5]
    },
]
var oNavItemBox = document.getElementById('left-items');
var oNavItemLi = document.querySelectorAll('.left-items-li'); //列表内容
var oNavContent = document.getElementById('left-items-content'); //内容区域

/* 
 * 给左侧导航绑定鼠标移入（内容区显示）移出（内容区隐藏）效果
 */
oNavItemLi.forEach((item, index) => {
    item.onmouseover = function () {
        oNavContent.style.display = 'block';
        oNavContent.innerText = oNavContentData[index].title;
    }
    item.onmouseout = function () {
        oNavContent.style.display = 'none';
        oNavContent.innerText = '';
    }
});


class PageLoad {
    constructor() {
        this.haveGood = this.$('.body-2');
        this.hotOneGoods = this.$('.body-3 .content');

        this.userLoad = localStorage.getItem("user");

        // 获取数据库里商品列表总数
        this.length = null;
        this.Goodslength();

        this.createBody2Goods();
        this.createBody3Goods();
    }

    /* 
     * 有好货的商品生成
     */
    createBody2Goods() {
        // 定义一个商品数组
        let goodArr = [];
        axios.get("./php/goods.php", {
            fn: "getGoods"
        }).then(data => {
            goodArr = JSON.parse(data);

            for (let i = 0; i < 2; i++) {
                // 板块容器
                let itemObj = document.createElement("div");
                itemObj.classList.add("item");

                // 标题
                let titleObj = document.createElement("div");
                titleObj.classList.add("title");
                titleObj.innerHTML = ` <img src="./img/body-2-logo-1.jpg" alt="">
                <span>与品质生活不期而遇</span>`;
                itemObj.appendChild(titleObj);


                for (let j = 0; j < 2; j++) {
                    let contentObj = document.createElement("div");
                    contentObj.classList.add("content");
                    for (let k = 0; k < 3; k++) {
                        let goodObj = document.createElement("a");
                        goodObj.classList.add("content-item");

                        // 随机一个下标
                        let index = Math.floor(Math.random() * this.length);
                        // 跳转的地址
                        let addr = goodArr[index]["ahref"];
                        // goodObj.href = addr;
                        // goodObj.target = "_blank";

                        goodObj.href = "#none";

                        goodObj.onclick = this.jumpGoodDetail.bind(this, goodArr[index]["goodId"], addr);

                        goodObj.innerHTML = `<img src="${goodArr[index]["headSrc"]}" alt="">
                        <p class="desc1">小狗图案不锈钢皂</p>
                        <p class="desc2">小狗图案不锈钢皂</p>
                        <p class="desc3">13673人说好</p>`;

                        contentObj.appendChild(goodObj);
                    }
                    itemObj.appendChild(contentObj);
                }

                this.haveGood.appendChild(itemObj);

            }

        });

    }

    /* 
     * 将用户表的当前浏览商品id设置为点击的商品
     */
    jumpGoodDetail(goodId, addr) {

        axios.get("./php/user.php", {
            fn: "altUserLookGId",
            userId: this.userLoad,
            currLookGId: goodId
        }).then(data => {

            // 设置成功后再跳转到商品详情页面
            open(addr, "_blank");
        });

    }

    /* 
     * 热卖单品的商品生成
     */
    createBody3Goods() {
        // 获取json数据
        axios.get("./php/goods.php", {
            fn: "getGoods"
        }).then(data => {

            data = JSON.parse(data);
            // console.log(data);

            for (let i = 0; i < 10; i++) {
                let goods = data[i];
                // 当数据量不足时，从数据库的商品里水机
                if (!goods) {
                    let index = Math.floor(Math.random() * this.length);
                    goods = data[index];
                }

                let goodObj = document.createElement("a");
                goodObj.classList.add("item");
                goodObj.href = "#none";

                goodObj.onclick = this.jumpGoodDetail.bind(this, goods.goodId, goods.ahref);

                let html = `
                <img src="${goods.headSrc}" alt="">
                <p class="desc-1">${goods.name}</p>
                <p class="desc-2">评价：17705 收藏：6875</p>
                <p></p>`;
                goodObj.innerHTML = html;

                // 将数据渲染回页面
                this.hotOneGoods.appendChild(goodObj);

            }

        });
    }

    /* 获取数据库里商品列表总数 */
    Goodslength() {
        axios.get("./php/goods.php", {
            fn: "getCountGood"
        }).then(data => {
            // console.log(data);
            this.length = data;
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

new PageLoad;