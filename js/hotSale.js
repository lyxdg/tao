class HotSale{
    constructor(){
        this.SaleContainer = this.$(".pro_list");
        // console.log(this.SaleContainer);
        this.createSaleGood();
    }

    createSaleGood(){
        axios.get("./php/goods.php", {
            fn: "getHotGoods"
        }).then(data => {
            let goodsArr = JSON.parse(data);
            // console.log(goodsArr);

            // 取前四个返回给页面
            for(let i = 0; i < 4; i ++){
                let good = goodsArr[i];
                let price = good.price;
                let intPart = Math.floor(price);
                let floatPart = price - intPart;

                // 格式化小数部分
                floatPart = Math.floor(floatPart * 100);
                if(floatPart < 10){
                    floatPart = "0" + floatPart;
                }
                // console.log(intPart,floatPart);

                let goodDiv = document.createElement("a");
                goodDiv.classList.add("pro_list_item");
                goodDiv.href = "#none";

                goodDiv.addEventListener("click",this.jumpGoodDetail.bind(this,good.goodId,good.ahref));

                goodDiv.innerHTML = `<div class="img">
                <img src="${good.headSrc}" alt="">
                </div>
                <div>${good.describle}</div>
                <div style="font-size: 14px;color: #E1251B;">¥<span style="font-size: 17px;">${intPart}</span>.${floatPart}</div>`;
            
                // console.log(goodDiv);
                this.SaleContainer.append(goodDiv);
            }

            

        });
    }

    /* 
     * 将用户表的当前浏览商品id设置为点击的商品
     */
    jumpGoodDetail(goodId, addr) {
        let userLoad = localStorage.getItem("user");
        axios.get("./php/user.php", {
            fn: "altUserLookGId",
            userId: userLoad,
            currLookGId: goodId
        }).then(data => {
            console.log(goodId, addr);

            // 设置成功后再跳转到商品详情页面
            open(addr, "_blank");
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
new HotSale;