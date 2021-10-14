class isOnload {
    constructor() {
        this.isOnload();
    }

    // 登录判断方法
    isOnload() {
        console.log("进入了登录判断方法");
        // 从localStorage里拿取当前登录用户的信息
        let userLoad = localStorage.getItem("user");

        // 判断是否有用户登录，如果未登录强制去登录界面
        if (!userLoad) {
            open("load.html", "_self");
        } else {
            let orangeObj = document.querySelector(".orange");

            // 若存在请登录的按钮，则将此节点文本改为当前登录的用户的用户名
            if(orangeObj){

                axios.get("./php/user.php", {
                    fn: "getUserName",
                    userId: userLoad
                }).then(data => {
                    let userName = JSON.parse(data)[0]["user"];
                    let loadObj =  orangeObj.firstElementChild;
                    loadObj.innerHTML = userName;
                    loadObj.href = "#none";
                    // 绑定退出登录的方法(未写)
                    loadObj.addEventListener("click",this.outLoad.bind(this,loadObj));
                });
            }

        }
    }

    outLoad(loadObj){
        layer.confirm('是否确认退出登录？', {
            btn: ['确定', '取消'] //按钮
        }, function (index) {

            localStorage.removeItem("user");
            loadObj.href ="./load.html";
            layer.close(index);
        });
    }
}

new isOnload;