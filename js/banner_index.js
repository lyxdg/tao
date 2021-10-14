window.onload = function () {
    //1 获取所有的节点
    let ulObj = $(".body-1 .shop .img-box .all ul");
    let ulLisObj = ulObj.children;
    let olObj = $(".body-1 .shop .img-box .all ol");
    let scObj = $(".body-1 .shop .img-box .all .screen");
    let arrObj = $("#arr");
    let leftObj = $("#left");
    let rightObj = $("#right");

    // 全局变量
    // 当前索引
    let index = 0;
    // 获取单张图片的宽度
    let imgW = scObj.offsetWidth;
    // 自动播放的定时器标识
    let times = null;
    // 是否能够响应点击事件
    let clickFlag = true;

    /* =================== 逻辑处理 =================== */

    /* 1. 生成序列号 */
    function createOlLi() {
        for (let i = 0; i < ulLisObj.length; i++) {
            let liObj = document.createElement("li");
            // liObj.innerHTML = i + 1;
            olObj.appendChild(liObj);
            // 给li动态绑定点击事件
            liObj.onclick = olLiClick;
        }
        olObj.children[0].classList.add("current");
        // console.log(olObj.children);
    }
    createOlLi();

    /* 2. 序列按钮点击函数实现 */
    function olLiClick() {
        index = this.innerHTML - 1;
        let target = - imgW * index;
        ulObj.style.left = target + "px";
        selector();
    }

    /* 3. 序列号变化函数 */
    function selector() {
        $(".current").classList.remove("current");
        olObj.children[index].classList.add("current");
    }

    /* 4. 鼠标移入显示左右箭头按钮 */
    scObj.parentNode.onmouseover = function () {
        arrObj.style.display = "block";
        // 停止自动播放
        clearInterval(times);
    }

    /* 5. 鼠标移出隐藏左右箭头按钮 */
    scObj.parentNode.onmouseout = function () {
        arrObj.style.display = "none";
        // 启动自动播放
        autoChange();
    }

    /* 6. 拷贝第一张图片到最后的位置 */
    function copyFirst() {
        let cloneFImg = ulLisObj[0].cloneNode(true);
        cloneFImg.style.opacity = 0.7;
        ulObj.appendChild(cloneFImg);
    }
    copyFirst();

    /* 7. 给右箭头按钮绑定点击下一张函数 */
    rightObj.onclick = function () {
        clickFlag && toNext();
    }
    function toNext() {
        clickFlag = false;
        index++;
        let target = - imgW * index;
        // 是否到达可以跳转的位置
        let status = false;

        if (index == olObj.children.length) {
            index = 0;
            status = true;
        }
        move(ulObj, { left: target }, function () {
            status && (ulObj.style.left = "0px");
            clickFlag = true;
        });
        selector();
    }

    /* 8. 给右箭头按钮绑定点击下一张函数 */
    leftObj.onclick = function () {
        clickFlag && toPre();
    }
    function toPre() {
        clickFlag = false;
        index--;
        if (index == -1) {
            index = olObj.children.length - 1;
            ulObj.style.left = - olObj.children.length * imgW + "px";
        }
        let target = - imgW * index;
        move(ulObj, { left: target }, function () {
            clickFlag = true;
        });
        selector();
    }

    /* 9. 自动播放 */
    function autoChange() {
        times = setInterval(function () {
            rightObj.onclick();
        }, 2000);
    }
    autoChange();


    /* =================== 准备函数 =================== */

    /* 
     * 0-1 获取节点函数
     * @param tag 节点的名字
     */
    function $(tag) {
        return document.querySelector(tag);
    }


    /*
     * 0-2 运动函数的封装
     * @param obj 运动的对象
     * @param target 运动的属性和目标值对象
     * @param callback 回调函数
     */
    function move(obj, target, callback) {
        // let timer = null;
        // 清除定时器，避免定时器叠加
        clearInterval(obj.timer);
        // 生成一个定时器
        obj.timer = setInterval(function () {
            // 记录达到目标值的属性的个数
            let count = 0;
            // 遍历运动属性和目标值对象
            for (let attr in target) {
                // 拿到对应属性的值 取整去掉单位
                let attrVal = parseInt(getStyle(obj, attr));
                // 计算步进值 除10是为了缓冲效果(差距越小变化越慢)
                let speed = (target[attr] - attrVal) / 10;
                // 取整提高精度
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                // 若当前值与目标值相同，则数量加1
                if (attrVal == target[attr]) count++;

                // 将数据放回页面
                obj.style[attr] = attrVal + speed + "px";
            }
            // 当达到目标值的属性值个数与目标对象的长度相同时，清除定时器
            if (count == Object.keys(target).length) {
                clearInterval(obj.timer);
                callback && callback();
            }
        }, 30);
    }

    /* 
     * 0-3 拿到非行内样式的属性值
     * @param obj 要获取属性值的对象
     * @param attr 要获取的属性值的属性
     */
    function getStyle(obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr]; // IE
        } else {
            return getComputedStyle(obj, false)[attr]; // 主流
        }
    }
}