
var Palyer = require("player");

cc.Class({
    extends: cc.Component,

    properties: {

        target: cc.Node,
        pos: cc.Vec2,

        prefab: {
            default: null,
            type: cc.Prefab,
        },

        sprite: {
            default: null,
            type: cc.SpriteFrame,
        },

        target1: {
            default: null,
            type: cc.Node,
            displayName: "NodeX",
            tooltip: "this is node",
        },
        pos1: new cc.Vec2(10, 10),

        // 数组
        strArr: [cc.String],

        // 数组的 default 必须设置为 []
        strArr1: {
            default: [],
            type: [cc.String],
        },

        // geter setter
        width: {
            get: function() {
                return this._width;
            },
            set: function(val) {
                this._width = val;
            },
        },

        // Player 组件
        playerScript: {
            default: null,
            type: Palyer,
        },

        texture: {
            default: null,
            type: cc.Texture2D,
        },


    },

    sayHelloEvent: function(msg) {
        cc.log("sayHelloEvent: " + msg);
    },

    onLoad () {
        this.jsLearn();

        // 获取组件所在的节点
        var node = this.node;
        // 获取节点上其他组件
        var label = this.node.getComponent(cc.Label);
        if (label) {
            label.String = "hello";
        }
        else {
            cc.log("not found cc.Label");
        }

        this.playerScript.testFunc();

        this.node.getChildByName("label");
        cc.find("Cannon 01/Barrel/SFX", this.node);
        // 当 cc.find 只传入第一个参数时，将从场景根节点开始逐级查找：
        var tmpNode = cc.find("Canvas/Menu/Back");

        // 默认
        this.node.active = true;

        // 创建新节点
        var node = new cc.Node("Sprite");
        var sp = node.addComponent(cc.Sprite);
        sp.SpriteFrame = this.sprite;
        //this.node.addChild(node);
        node.parent = this.node;

        // 克隆
        var scene = cc.director.getScene();
        var node = cc.instantiate(this.target);
        node.parent = scene;
        node.setPosition(0, 0);

        // 创建预制体（和克隆一样）
        var tmpPrefab = cc.instantiate(this.prefab);
        tmpPrefab.parent = scene;

        // cc.isValid 判断当前节点是否已经被销毁
        if (cc.isValid(tmpPrefab)) {
            cc.log("isValid!");
        }
        // 2秒后销毁
        setTimeout(function(){
            tmpPrefab.destroy();
            cc.log("destroy!");
        }.bind(this), 2000);

        // 常驻节点，场景切换时不被自动销毁
        cc.game.addPersistRootNode(this.node);
        // 取消常驻节点
        //cc.game.removePersistRootNode(this.node);

        // 加载场景
        //cc.director.loadScene("MyScene", onSceneLaunched);
        // 预加载场景
        // cc.director.preloadScene("MyScene", function() {
        //     cc.log("next scene preloaded!");
        // });
        //之后在合适的时间调用 loadScene，就可以真正切换场景。
        //cc.director.loadScene("table");

        // 动态加载assets/resources下资源：
        var self = this;
        cc.loader.loadRes("score", function(err, prefab){
            var node = cc.instantiate(prefab);
            node.parent = self.node;
            cc.log("cc.loader.loadres!");
        })

        // 加载spriteFrame
        cc.loader.loadRes("box", cc.SpriteFrame, function(err, spriteFrame) {
            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        
        // 加载 SpriteAtlas（图集），并且获取其中的一个 SpriteFrame
        // 注意 atlas 资源文件（plist）通常会和一个同名的图片文件（png）放在一个目录下, 所以需要在第二个参数指定资源类型
        // cc.resources.load("test assets/sheep", cc.SpriteAtlas, function (err, atlas) {
        //     var frame = atlas.getSpriteFrame('sheep_down_0');
        //     sprite.spriteFrame = frame;
        // });

        // 释放
        //cc.loader.release("score", cc.Prefab);

        // 资源批量加载
        cc.loader.loadResDir("helolo", cc.SpriteFrame, function(error, assets) {
            cc.log("资源批量加载error: " + error);
        });

        // 加载远程资源
        var remoteUrl = "https://n.sinaimg.cn/news/transform/300/w550h550/20201029/5c25-kcaeqzy1057220.jpg";
        cc.loader.load(remoteUrl, function(err, texture) {
            cc,log("加载远程资源1");
        });

        // 远程 url 不带图片后缀名，此时必须指定远程图片文件的类型
        // remoteUrl = "http://unknown.org/emoji?id=124982374";
        // cc.loader.load({url: remoteUrl, type: 'png'}, function() {
        //     cc,log("加载远程资源2");
        // });

        // 用绝对路径加载设备存储内的资源，比如相册
        var absoultPath = "/dara/data/some/path/to/image.png";
        cc.loader.load(absoultPath, function() {
            cc,log("用绝对路径加载设备存储内的资源");
        });

        // 资源释放
        /*
        // 直接释放某个贴图
        cc.loader.release(texture);
        // 释放一个 prefab 以及所有它依赖的资源
        var deps = cc.loader.getDependsRecursively('prefabs/sample');
        cc.loader.release(deps);
        // 如果在这个 prefab 中有一些和场景其他部分共享的资源，你不希望它们被释放，可以将这个资源从依赖列表中删除
        var deps = cc.loader.getDependsRecursively('prefabs/sample');
        var index = deps.indexOf(texture2d._uuid);
        if (index !== -1)
            deps.splice(index, 1);
        cc.loader.release(deps);
        */

        // 事件监听
        this.node.on("mousedown", function(event) {
            cc.log("mousedown event1");
        });
        // 也绑定调用者
        this.node.on("mousedown", function(event) {
            cc.log("mousedown event2");
        }).bind(this);
        // or 
        this.node.on("mousedown", this.sayHelloEvent, this);
        // 发射事件, 最多只支持传递 5 个事件参数
        this.node.emit("mousedown", "hell me");
        // 关闭事件监听
        this.node.off("mousedown", this.sayHelloEvent, this)
        
        // 事件派送
        this.node.on("foobar", function(event) {
            cc.log("recv foobar event");
        });
        setTimeout(function(){
            self.node.dispatchEvent(new cc.Event.EventCustom("foobar", true));
        }, 3);
        //this.node.dispatchEvent(new cc.Event.EventCustom("foobar", true));
        // 截获事件，事件不在向上冒泡传递
        // 停止冒泡阶段，事件将不会继续向父节点传递，当前节点的剩余监听器仍然会接收到事件
        this.node.on("foobar", function(event) {
            //event.stopPropagation();
        });


        // 缓动动作(对cc.Action的包装) 链式执行
        cc.tween(this.node).to(1, {position: cc.v2(10, 10), angle: 360})
        .to(1, {scale: 2}).start();

        // 计时器
        this.scheCount = 0
        this.scheduleCallabck = function() {
            if (this.scheCount == 3) {
                this.unschedule(this.scheduleCallabck);
            }
            cc.log("scheduleCallabck");
            this.scheCount++;
        };
        this.schedule(this.scheduleCallabck, 1);

        // 网络接口
        // XMLHttpRequest
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            cc.log("XMLHttpRequest callback");
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var resp = xhr.responseText;
                cc.log(resp);
            }
        };
        //xhr.open("GET", "https://www.ip138.com/", true);
        //xhr.send();

        // websocket
        let ws = new WebSocket("ws://echo.websocket.org");
        ws.onopen = function(event) {
            console.log("Send Text WS was opened.");
        };
        ws.onmessage = function(event) {
            //console.log("response text msg: " + event.data);
        };
        ws.onerror = function(event) {
            console.log("Send Text fired an error");
        };
        ws.onclose = function(event) {
            console.log("WebSocket instance closed.");
        };

        setTimeout(function() {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send("Hello WebSocket, I'm a text message.");
            }
            else {
                console.log("WebSocket instance wasn't ready...");
            }
        }, 3);

        // 对象池 cc.NodePool
        this.pool = new cc.NodePool();
        for (let i = 0; i < 10; i++) {
            let obj = cc.instantiate(this.prefab);
            this.pool.put(obj);
        }
        let myObj = null;
        if (this.pool.size() > 0) {
            myObj = this.pool.get();
        }
        else {
            myObj = cc.instantiate(this.prefab);
        }

        // 模块化脚本
        // 游戏开始时会自动 require 所有脚本，这时每个模块内部定义的代码就会被执行一次，
        // 之后无论又被 require 几次，返回的始终是同一份实例。
        // module.exports = xx 导出变量，供其他地方require使用
        module.exports.foo = function() {
            cc.log("module.exports.foo");
        };

        // 分包加载
        // 分包加载目前只支持各类小游戏，如微信小游戏、OPPO 小游戏等。

        // 插件脚本？？？

        // js入门
        // 声明变量 var
        var b = true;
        var check = b ? 1 : 2;

        // 数组, 所以从0开始
        var arry = [1, 2, 3];
        arry.push(10);
        //cc.log(arry[0]);

        //js对象 object
        var myProfile = {
            name: "Jare Guo",
            email: "blabla@gmail.com",
            'zip code': 12345,
            isInvited: true
        };

        var myString = "egfrgfrg";
        var str = myString.replace("e", "k");
        cc.log(str);

        // 运算符， 推荐使用 === 运算符来比较两个值
        var a = "12";
        // a == 12; // true
        // a === 12; // false
        // 比较
        var bb = a !== 11;
        // 非
        var bc = !bb;

        // 在每一行结束时写一个;，尽管在 JavaScript 里行尾的; 是可以忽略的

        // ts入门
        // todo

        // CCClass进阶
        // 类型判断 a instanceof A;
        // 继承关系判断 cc.isChildClassOf(sub, base);

        // 静态变量和静态方法
        // var staticSp = cc.Class({
        //     statics: {
        //         // 声明静态变量
        //         count: 0,
        //         // 声明静态方法
        //         getBounds: function() {

        //         },
        //     }
        // });
        // 上面代码等价于：
        // var staticSp = cc.Class({ ... });
        // // 声明静态变量
        // Sprite.count = 0;
        // // 声明静态方法
        // Sprite.getBounds = function (spriteList) {
        //     // ...
        // };

        // 定义在类的外面 (局部)
        // 局部方法
        // function doLoad (sprite) {
        //     // ...
        // };
        // // 局部变量
        // var url = "foo.png";

        // 继承 函数重写
        // 父类被重写的方法并不会被 CCClass 自动调用,要调用可以 this._super();
        // 属性被反序列化的过程紧接着发生在构造函数执行之后

        // js调试调试
        // win模拟器调试js: devtools://devtools/bundled/inspector.html?v8only=true&ws=127.0.0.1:5086/00010002-0003-4004-8005-000600070008
        // 调试android: devtools://devtools/bundled/inspector.html?v8only=true&ws={10.0.3.15}:6086/00010002-0003-4004-8005-000600070008

        // 定制项目构建流程?

        
















    },

    // 一个组件从初始化到激活，再到最终销毁的完整生命周期函数调用顺序为：onLoad -> onEnable -> start -> update -> lateUpdate -> onDisable -> onDestroy。
    // start会在onLoad之后，update之前执行，
    start () {

    },

    update (dt) {

    },

    // js learn：
    jsLearn: function() {
        var MySpriteExt = cc.Class ({
            name: 'MySpriteExtxx',
            ctor: function() {
                cc.log("MySpriteExt ctor");
            },
        });

        var MyImage = cc.Class({
            name: "MyImage",
            extends: MySpriteExt,
            ctor: function() {
                cc.log("MyImage ctor");
            },
        });

        cc.log('hello');
        var obj = new MySpriteExt();
        cc.log(obj instanceof MySpriteExt); // true

        var obj1 = new MyImage();
    },





});
