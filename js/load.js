        // ============ 预备函数 start ============

        //验证码
        var code = "";

        /* 生成验证码 */
        function createCode() {
            code = ""; // 重新初始化验证码
            var num = 4; // 验证码位数
            // 验证码内容候选数组
            var codeList = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
                'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                'Y', 'Z');
            // 循环获取每一位验证码
            for (var i = 0; i < num; i++) {
                // 随机数 * 验证码候选元素数量 = 候选元素数组下标
                code += codeList[Math.floor(Math.random() * codeList.length)];
            }
            // 将数据渲染回页面
            document.getElementById("txtCode").value = code;
        }

        // ============ 预备函数 end ============

        /* 正式的逻辑处理 */

        //加载验证码
        createCode();

        // 获取input节点对象
        var Inputs = document.getElementsByTagName('input');
        var oName = Inputs[0];
        var pwd = Inputs[1];
        var ma1 = Inputs[2];
        var ma2 = Inputs[3];
        var loadBtn = Inputs[4];
        var logingBtn = Inputs[5];

        /* 验证码校验函数 */
        function checkCode() {

            // 检验验证码输入是否有误
            var reg = new RegExp("^" + code + "$", "i");
            if (!reg.test(ma1.value)) {
                return false;
            }
            return true;
        }

        /* 登录方法 */
        loadBtn.onclick = load;

        function load() {
            if (checkCode()) {
                var nameV = oName.value;

                axios.get("php/user.php", {
                    fn: "getUser",
                    name: nameV
                }).then(data => {
                    data = JSON.parse(data);

                    // 判断是返回值里否有数据
                    if(data.length == 0){
                        console.log("该用户不存在！");
                    }

                    // 遍历查找密码
                    data.forEach(user => {
                        if (user.pwd == pwd.value) {
                            console.log("登录成功！");
                            
                            // 将登录成功的用户的id保存进localStorage里
                            localStorage.setItem("user", user.userId);

                            open("index.html","_self");
                        } else {
                            // 复原每个输入框及原始的数据
                            alert("密码与账号不匹配！");
                            pwd.value = "";
                            ma1.value = "";
                        }
                    });
                });
            }
        }

        // 注册方法
        logingBtn.onclick = function(){
            open("loging.html");
        }