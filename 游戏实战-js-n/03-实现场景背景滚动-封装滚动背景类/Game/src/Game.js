var Sprite = laya.display.Sprite;
(function () {
    function BackGround() {
        //定义背景1
        this.bg1 = null;
        //定义背景2
        this.bg2 = null;
        //初始化父类
        BackGround.__super.call(this);
        this.init();
    }
    //注册类 BackGround
    Laya.class(BackGround, "BackGround", laya.display.Sprite);
    //获取 BackGround 的原型，用于添加 BackGround 的属性、方法
    var _proto = BackGround.prototype;
    _proto.init = function () {
        //创建背景1
        this.bg1 = new Sprite();
        //加载并显示背景图1
        this.bg1.loadImage("res/background.png");
        //把背景1添加到当前容器对象里。
        this.addChild(this.bg1);

        //创建背景2
        this.bg2 = new Sprite();
        //加载并显示背景图2
        this.bg2.loadImage("res/background.png");
        //设置背景2 的坐标。
        this.bg2.pos(0, -852);
        //把背景2添加到当前容器对象里。
        this.addChild(this.bg2);
        //创建一个帧循环处理函数，用于背景位置的更新，实现背景滚动效果。
        Laya.timer.frameLoop(1, this, this.onLoop)
    }

    _proto.onLoop = function () {
        //设置背景容器由上向下移动 1px。
        this.y += 1;

        //当背景1向下移动出游戏的显示区域 480*852，则将背景1的y轴坐标,向上移动 852*2.
        if (this.bg1.y + this.y >= 852) {
            this.bg1.y -= 852 * 2;
        }
        //当背景2向下移动出游戏的显示区域 480*852，则将背景2的y轴坐标,向上移动 852*2.
        if (this.bg2.y + this.y >= 852) {
            this.bg2.y -= 852 * 2;
        }
    }

})();

(function () {
    function Game() {
        //初始化引擎，设置游戏设计宽高。
        Laya.init(480, 852);

        //创建循环滚动的背景。
        this.bg = new BackGround();
        //把背景添加到舞台上显示。
        Laya.stage.addChild(this.bg);
    }
    //注册类 Game
    Laya.class(Game, "Game");
})();

var gameInstance = new Game();