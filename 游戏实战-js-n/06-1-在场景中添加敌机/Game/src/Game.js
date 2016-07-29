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
        //定义角色类型
        this.type = null;
        //角色阵营：0=我方，1=敌方。
        this.camp = 0;
        //血量
        this.hp = 0;
        //飞行速度
        this.speed = 0;
        //攻击半径
        this.hitRadius = 0;
    }
    //注册类 BackGround
    Laya.class(Role, "Role", laya.display.Sprite);
    //获取 BackGround 的原型，用于添加 BackGround 的属性、方法
    var _proto = Role.prototype;
    Role.cached = false;
    _proto.init = function (type, camp, hp, speed, hitRadius) {
        //初始化角色属性
        this.type = type;
        this.camp = camp;
        this.hp = hp;
        this.speed = speed;
        this.hitRadius = hitRadius;

        if (!Role.cached) {
            Role.cached = true;
            //缓存动画模板： hero_fly
            Animation.createFrames(["war/hero_fly1.png", "war/hero_fly2.png"], "hero_fly");
            //缓存动画模板： hero_down
            Animation.createFrames(["war/hero_down1.png", "war/hero_down2.png", "war/hero_down3.png", "war/hero_down4.png"], "hero_down");
            //缓存动画模板： enemy1_fly
            Animation.createFrames(["war/enemy1_fly1.png"], "enemy1_fly");
            //缓存enemy1_down动画
            Animation.createFrames(["war/enemy1_down1.png", "war/enemy1_down2.png", "war/enemy1_down3.png", "war/enemy1_down4.png"], "enemy1_down");
            //缓存enemy2_fly动画
            Animation.createFrames(["war/enemy2_fly1.png"], "enemy2_fly");
            //缓存enemy2_down动画
            Animation.createFrames(["war/enemy2_down1.png", "war/enemy2_down2.png", "war/enemy2_down3.png", "war/enemy2_down4.png"], "enemy2_down");
            //缓存enemy2_hit动画
            Animation.createFrames(["war/enemy2_hit.png"], "enemy2_hit");
            //缓存enemy3_fly动画
            Animation.createFrames(["war/enemy3_fly1.png", "war/enemy3_fly2.png"], "enemy3_fly");
            //缓存enemy3_down动画
            Animation.createFrames(["war/enemy3_down1.png", "war/enemy3_down2.png", "war/enemy3_down3.png", "war/enemy3_down4.png", "war/enemy3_down5.png", "war/enemy3_down6.png"], "enemy3_down");
            //缓存enemy3_hit动画
            Animation.createFrames(["war/enemy3_hit.png"], "enemy3_hit");
        }

        if (!this.body) {
            //创建一个动画作为飞机的身体
            this.body = new Animation();
            //把这个动画添加到当前容器内
            this.addChild(this.body);
        }

        //播放动作对应的动画
        this.playAction("fly");
    }
    _proto.playAction = function (action) {
        //根据传入的参数动画名称，播放对应的动画。
        this.body.play(0, true, this.type + "_" + action);
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
        //初始化主角的属性值
        this.hero.init("hero", 0, 1, 0, 30);
        //设置主角的位置
        this.hero.pos(240, 700);
        //把主角添加到舞台上
        Laya.stage.addChild(this.hero);
        //添加舞台的鼠标移动事件侦听
        Laya.stage.on(laya.events.Event.MOUSE_MOVE, this, this.onMouseMove)

        //创建敌人
        this.createEnemy(5);
    }

    _proto.onMouseMove = function () {
        //设置主角的位置与鼠标位置一致。
        this.hero.pos(Laya.stage.mouseX, Laya.stage.mouseY);
    }
    _proto.hps = [1, 2, 10];
    _proto.speeds = [3, 2, 1];
    _proto.radius = [15, 30, 70];

    _proto.createEnemy = function (num) {
        for (var i = 0; i < num; i++) {
            //取一个随机数0~1
            var r = Math.random();
            //根据随机数，随机敌机的类型。
            var type = r < 0.7 ? 0 : r < 0.95 ? 1 : 2;

            //创建一个敌机对象。
            var enemy = new Role();
            //初始化敌机的角色属性。
            enemy.init("enemy" + (type + 1), 1, this.hps[type], this.speeds[type], this.radius[type]);
            //设置敌机的随机位置。
            enemy.pos(Math.random() * 400 + 40, Math.random() * 200);
            //添加敌机到舞台上。
            Laya.stage.addChild(enemy);
        }
    }

})();

var gameInstance = new Game();