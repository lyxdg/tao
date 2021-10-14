        // ============ 预备函数 start ============

        /* 将正则值替换为xx */
        function getLength(str) {
            return str.replace(/[^\x00-xff]/g, "xx").length;
        }

        /* 检测是否密码为连续的相同字符 */
        function findStr(str, n) {
            var tmp = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charAt(i) == n) {
                    tmp++;
                }
            }
            return tmp;
        }

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
        var pwd2 = Inputs[2];
        var ma1 = Inputs[3];
        var ma2 = Inputs[4];
        var subt = Inputs[5];

        // 获取p节点对象 (ap中的P为大写)
        var aP = document.getElementsByTagName('p');
        var name_msg = aP[0];
        var pwd_msg = aP[1];
        var pwd2_msg = aP[2];
        var ma = aP[3];

        // 其他

        // 字符个数统计
        var count = document.getElementById('count');
        // 密码强度
        var aEm = document.getElementsByTagName('em');
        // 用户名长度
        var name_length = 0;
        // 违法的输入的个数统计
        var k = 1;

        // 正则 

        //1.数字、字母(不分大小写)、汉字、下划线
        //2. 5-25字符，推荐使用中文
        //\u4e00-\u9fa5(这是汉字的范围)
        var re = /[^\w\u4e00-\u9fa5]/g;
        var re_n = /[^\d]/g;
        var re_t = /[^a-zA-Z]/g;


        // 1. 用户名
        /* 1_1. 获取焦点事件 */
        oName.onfocus = function () {
            name_msg.style.display = "block";
            name_msg.innerHTML = '<i class="ati"></i>5-25个字符';
        }

        /* 1_2. 键盘事件 计算用户名长度 */
        oName.onkeyup = function () {
            count.style.visibility = "visible";
            name_length = getLength(this.value);
            count.innerHTML = name_length + "个字符";

            // 当用户名长度为0时隐藏
            if (name_length == 0) {
                count.style.visibility = "hidden";
            }
        }

        /* 1_3. 失去焦点事件 用户名填写信息提示 */
        oName.onblur = function () {
            // 含有非法字符
            var re = /[^\w\u4e00-\u9fa5]/g;
            if (re.test(this.value)) {
                name_msg.innerHTML = '<i class="err"></i>含有非法字符';
            }
            // 不能为空
            else if (this.value == "") {
                name_msg.innerHTML = '<i class="err"></i>不能为空';
            }
            // 长度超过25个字符
            else if (name_length > 25) {
                name_msg.innerHTML = '<i class="err"></i>长度超过25个字符';
            }
            // 长度少于6个字符
            else if (name_length < 6) {
                name_msg.innerHTML = '<i class="err"></i>长度少于6个字符';
            }
            // ok
            else {
                name_msg.innerHTML = '<i class="ok"></i>ok';
            }
        }

        // 2. 密码

        /* 2_1. 获取焦点事件 显示密码设置要求 */
        pwd.onfocus = function () {
            pwd_msg.style.display = "block";
            pwd_msg.innerHTML = '<i class="ati"></i>6-16个字符，请使用字母加数字或符号的组合密码，不能单独使用字母、数字或符号。';
        }

        /* 2_2. 键盘事件 判断密码强度等级 */
        pwd.onkeyup = function () {
            // 大于5字符"中"
            if (this.value.length > 5) {
                aEm[1].className = "active";
                // 密码强度大于中时，移除禁用属性，可以输入确认密码
                pwd2.removeAttribute("disabled");
                pwd2_msg.style.display = "block";
            } else {
                aEm[1].className = "";
                pwd2_msg.style.display = "none";
                // 密码强度小于中时，重新设置为禁用状态，不可以输入确认密码
                pwd2.disabled = "true";

            }
            // 大于10个字符"强"
            if (this.value.length > 10) {
                aEm[2].className = "active";
                // pwd2_msg.style.display = "block";
            } else {
                aEm[2].className = "";
            }

        }

        /* 2_3. 失去焦点事件 显示密码提示信息 */
        pwd.onblur = function () {
            var m = findStr(pwd.value, pwd.value[0]);

            //不能为空
            if (this.value == "") {
                pwd_msg.innerHTML = '<i class="err"></i>不能为空';
            }
            //不能全用相同字符
            else if (m == this.value.length) {
                pwd_msg.innerHTML = '<i class="err"></i>不能全使用相同字符';
            }
            //长度应为6-16个字符
            else if (this.value.length < 6 || this.value.length > 16) {
                pwd_msg.innerHTML = '<i class="err"></i>长度应为6-16个字符';
            }
            //不能全为数字
            else if (!re_n.test(this.value)) {
                pwd_msg.innerHTML = '<i class="err"></i>不能全为数字';
            }
            //不能全为字母
            else if (!re_t.test(this.value)) {
                pwd_msg.innerHTML = '<i class="err"></i>不能全为字母';
            }
            //ok
            else {
                pwd_msg.innerHTML = '<i class="err"></i>ok';

            }
            pwd2.onblur();

        }

        // 3. 确认密码  失去焦点事件 判断与密码1是否一致
        pwd2.onblur = function () {
            if (this.value != pwd.value) {
                pwd2_msg.innerHTML = '<i class="err"></i>两次输入密码不一致！';
            } else {
                pwd2_msg.innerHTML = '<i class="err"></i>ok！';
            }
        }

        // 4. 验证码 失去焦点事件 判断是否与自动生成的验证码一致
        ma1.onblur = function () {
            var reg = new RegExp("^" + code + "$", "i");
            // console.log(reg.test(ma1.value));
            if (reg.test(ma1.value)) {
                // 一致 ok
                ma.innerHTML = '<i class="ati"></i>ok';
            } else {
                // 不一致 有误重新生成验证码
                ma.innerHTML = '<i class="ati"></i>验证码输入有误';
                // code = "";
                createCode(); //生成新的验证码
            }
        }


        /* 提交前的验证函数 */
        function check() {

            // 用户名
            name_length = getLength(oName.value);
            if (oName.value == "") {

                name_msg.style.display = "block";
                name_msg.innerHTML = '<i class="ati"></i>请输入用户名';
                k = k + 1;
            } else if (re.test(oName.value)) {
                name_msg.innerHTML = '<i class="err"></i>含有非法字符';
                k = k + 1;
            }
            // 长度超过25个字符
            else if (name_length > 25) {
                k = k + 1;
            }
            // 长度少于6个字符
            else if (name_length < 6) {
                k = k + 1;
            } else {
                k = k + 0;
            }

            // 密码
            var m = findStr(pwd.value, pwd.value[0]);
            // 不能为空
            if (pwd.value == "") {
                pwd_msg.style.display = "block";
                k = k + 1;
            }
            // 不能用相同字符
            else if (m == pwd.value.length) {
                k = k + 1;
            }
            // 长度应为6-16个字符
            else if (pwd.value.length < 6 || pwd.value.length > 16) {
                k = k + 1;
            }
            // 不能全为数字
            else if (!re_n.test(pwd.value)) {
                k = k + 1;
            }
            // 不能全为字母
            else if (!re_t.test(pwd.value)) {
                k = k + 1;
            }
            // ok
            else {
                k = k + 0;

            }

            // 确认密码
            if (pwd2.value != pwd.value) {
                pwd2_msg.innerHTML = '<i class="err"></i>两次输入密码不一致！';
                k = k + 1;
            } else {
                k = k + 0;
            }

            // 检验验证码输入是否有误
            var reg = new RegExp("^" + code + "$", "i");
            if (!reg.test(ma1.value)) {
                k = k + 1;
            } else {
                k = k + 0;
            }

            //下面的操作计算check函数的返回值
            if (k != 1) {
                return false;
            } else {
                aEm[1].className = "";
                subt.value = '正在提交';
                subt.disabled = 'true';
                return true;
            }

        }

        /* 注册方法 */
        subt.onclick = login;

        function login() {
            if (check()) {
                console.log("进入了注册方法");

                var nameV = oName.value;
                var pwdV = pwd.value;
                console.log(nameV, pwdV);

                axios.get("php/user.php", {
                    fn: "addUser",
                    name: nameV,
                    pwd: pwdV
                }).then(data => {
                    console.log("注册成功！");
                    open("load.html","_self");
                    // 复原每个输入框及原始的数据
                    subt.value = '同意协议并注册';
                    oName.value = "";
                    pwd.value = "";
                    pwd2.value = "";
                    ma1.value = "";
                    name_length = 0;
                    k = 1;
                });
            }
        }