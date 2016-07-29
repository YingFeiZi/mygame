var Sprite = laya.display.Sprite;
var Handler = laya.utils.Handler;
var Loader = laya.net.Loader;
var Animation = laya.display.Animation;
var Rectangle = laya.maths.Rectangle;
var Event = laya.events.Event;

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
    function Role() {
        Role.__super.call(this);
        //定义一个动画对象的引用
        this.body = null;
        this.init();
    }
    //注册类 BackGround
    Laya.class(Role, "Role", laya.display.Sprite);
    //获取 BackGround 的原型，用于添加 BackGround 的属性、方法
    var _proto = Role.prototype;
    _proto.init = function () {

        //创建动画模板 hero_fly
        Animation.createFrames(["war/hero_fly1.png", "war/hero_fly2.png"], "hero_fly");
        //创建动画模板 hero_down
        Animation.createFrames(["war/hero_down1.png", "war/hero_down2.png", "war/hero_down3.png", "war/hero_down4.png"], "hero_down");

        //创建一个动画作为飞机的身体
        this.body = new Animation();
        //把这个动画添加到当前容器内
        this.addChild(this.body);
        //播放动画
        this.playAction("hero_fly");
    }
    _proto.playAction = function (action) {
        //根据传入的参数动画名称，播放对应的动画。
        this.body.play(0, true, action);
        //获取动画的显示区域
        var bound = this.body.getBounds();
        //设置机身的锚点为机身的显示宽高的中心点。
        this.body.pos(-bound.width / 2, -bound.height / 2);
    }

})();

(function () {
    function Game() {
        //定义主角
        this.hero = null;
        //初始化引擎，设置游戏设计宽高。
        Laya.init(480, 852);

        //创建循环滚动的背景。
        this.bg = new BackGround();
        //把背景添加到舞台上显示。
        Laya.stage.addChild(this.bg);
        //加载飞机图集资源
        Laya.loader.load("res/atlas/war.json", Handler.create(this, this.onLoaded), null, Loader.ATLAS);
    }
    //注册类 Game
    Laya.class(Game, "Game");
    //获取 Game 的原型，用于添加 Game 的属性、方法
    var _proto = Game.prototype;
    _proto.onLoaded = function () {
        //创建一个主角
        this.hero = new Role();
        //把主角添加到舞台上
        Laya.stage.addChild(this.hero);
        //添加舞台的鼠标移动事件侦听
        Laya.stage.on(laya.events.Event.MOUSE_MOVE, this, this.onMouseMove)
    }

    _proto.onMouseMove = function () {
        //设置主角的位置与鼠标位置一致。
        this.hero.pos(Laya.stage.mouseX, Laya.stage.mouseY);
    }

})();

var gameInstance = new Game();