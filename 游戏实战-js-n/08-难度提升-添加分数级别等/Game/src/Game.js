var Sprite = laya.display.Sprite;
var Handler = laya.utils.Handler;
var Loader = laya.net.Loader;
var Animation = laya.display.Animation;
var Rectangle = laya.maths.Rectangle;
var Event = laya.events.Event;
var Pool = laya.utils.Pool;
var Browser = laya.utils.Browser;
var Stat = laya.utils.Stat;

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
        //射击类型，1=射手
        this.shootType = 0;
        //射击时间间隔
        this.shootInterval = 500;
        //下次射击时间
        this.shootTime = Browser.now() + 100;
        //当前动作
        this.action = null;
        //0=普通；1=子弹；2=弹药；3=补给品
        this.heroType = 0;
    }
    //注册类 BackGround
    Laya.class(Role, "Role", laya.display.Sprite);
    //获取 BackGround 的原型，用于添加 BackGround 的属性、方法
    var _proto = Role.prototype;
    Role.cached = false;
    _proto.init = function (type, camp, hp, speed, hitRadius, heroType) {
        //初始化角色属性
        this.type = type;
        this.camp = camp;
        this.hp = hp;
        this.speed = speed;
        this.hitRadius = hitRadius;
        this.heroType = heroType;

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
            //缓存子弹动画
            Animation.createFrames(["war/bullet1.png"], "bullet1_fly");
            //缓存UFO1
            Animation.createFrames(["war/ufo1.png"], "ufo1_fly");
            //缓存UFO2
            Animation.createFrames(["war/ufo2.png"], "ufo2_fly");
        }

        if (!this.body) {
            //创建一个动画作为飞机的身体
            this.body = new Animation();
            //设置动画播放时间间隔
            this.body.interval = 50;
            //把这个动画添加到当前容器内
            this.addChild(this.body);

            //增加动画播放完成事件监听
            this.body.on(laya.events.Event.COMPLETE, this, this.onPlayComplete);

        }

        //播放动作对应的动画
        this.playAction("fly");
    }
    _proto.onPlayComplete = function () {
        if (this.action == "down") {
            //停止动画播放
            this.body.stop();
            //隐藏此角色，通过此标记，在下一帧进行回收
            this.visible = false;
        } else if (this.action == "hit") {
            //如果当前播放的是被击动画，则继续播放飞行动画。
            this.playAction("fly");
        }
    }

    _proto.playAction = function (action) {
        //记录当前播放动画的类型
        this.action = action;
        //根据传入的参数动画名称，播放对应的动画。
        this.body.play(0, true, this.type + "_" + this.action);
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
        //子弹发射偏移位置表
        this.bulletPos = [[0], [-15, 15], [-30, 0, 30], [-45, -15, 15, 45]];
        //关卡等级
        this.level = 0;
        //积分成绩
        this.score = 0;
        //升级等级所需的成绩数量
        this.levelUpScore = 0;
        //子弹级别
        this.bulletLevel = 0;
        //敌机被击半径表
        this.radius = [18, 33, 80];

        //初始化引擎，设置游戏设计宽高。
        Laya.init(480, 852);
        //创建循环滚动的背景。
        this.bg = new BackGround();
        //把背景添加到舞台上显示。
        Laya.stage.addChild(this.bg);
        //显示FPS
        Stat.show(0,50);
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
        this.hero.init("hero", 0, 5, 0, 30, 0);
        //设置主角的位置
        this.hero.pos(240, 700);
        //设置射击类型
        this.hero.shootType = 1;
        //把主角添加到舞台上
        Laya.stage.addChild(this.hero);
        //添加舞台的鼠标移动事件侦听
        Laya.stage.on(laya.events.Event.MOUSE_MOVE, this, this.onMouseMove)

        //创建主循环
        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    _proto.onLoop = function () {
        //遍历所有的飞机，更新飞机状态。
        for (var i = Laya.stage.numChildren - 1; i > -1; i--) {
            var role = Laya.stage.getChildAt(i);
            if (role && role.speed) {
                //根据飞机速度更改位置
                role.y += role.speed;

                //如果角色移动到显示区域以外，则移除角色，并将此角色对方放入回收池。
                //如果此角色被击落，则移除角色，并将此角色对方放入回收池。
                if (role.y > 1000 || !role.visible || (role.heroType == 1 && role.y < -20)) {
                    //从舞台移除
                    role.removeSelf();
                    //回收之前，重置属性信息
                    role.visible = true;
                    //回收到对象池
                    Laya.Pool.recover("role", role);
                }
            }
            //处理发射子弹逻辑
            if (role.shootType > 0) {
                //获取当前时间
                var time = Laya.Browser.now();
                //如果当前时间大于下次射击时间
                if (time > role.shootTime) {
                    //更新下次射击时间
                    role.shootTime = time + role.shootInterval;

                    //根据不同的子弹类型，设置不同的数量及位置
                    var pos = this.bulletPos[role.shootType - 1];
                    for (var index = 0; index < pos.length; index++) {
                        //从对象池里面创建一个子弹
                        var bullet = Pool.getItemByClass("role", Role);
                        bullet.init("bullet1", role.camp, 1, -4 - role.shootType - Math.floor(this.level / 15), 1, 1);
                        //设置子弹发射初始化位置
                        bullet.pos(role.x, role.y - role.hitRadius - 10);
                        //添加到舞台上
                        Laya.stage.addChild(bullet);
                    }
                }
            }
        }

        //检测碰撞，原理：获取角色对象，一一对比之间的位置，判断是否击中
        var n = Laya.stage.numChildren;
        for (i = Laya.stage.numChildren - 1; i > 0; i--) {
            //获取橘色对象1
            var role1 = Laya.stage.getChildAt(i);
            //如果角色已经死亡，则忽略
            if (role1.hp < 1) continue;
            for (var j = i - 1; j > 0; j--) {
                //如果角色已经死亡，则忽略
                if (!role1.visible) continue;
                //获取角色对象2
                var role2 = Laya.stage.getChildAt(j);
                //如果角色未死亡，并且阵营不同，才进行碰撞
                if (role2.hp > 0 && role1.camp != role2.camp) {
                    //计算碰撞区域
                    var hitRadius = role1.hitRadius + role2.hitRadius;
                    //根据距离判断是否碰撞
                    if (Math.abs(role1.x - role2.x) < hitRadius && Math.abs(role1.y - role2.y) < hitRadius) {
                        //碰撞后掉血
                        this.lostHp(role1, 1);
                        this.lostHp(role2, 1);

                        //每掉一滴血，积分+1
                        this.score++;
                        //积分大于升级积分，则升级
                        if (this.score > this.levelUpScore) {
                            //升级关卡
                            this.level++;
                            //提高下一级的升级难度
                            this.levelUpScore += this.level * 5;
                        }
                    }
                }
            }
        }

        if (this.hero.hp < 1) {
            Laya.timer.clear(this, this.onLoop);
            console.log("Game over!")
        }

        //关卡越高，创建敌机间隔越短
        var cutTime = this.level < 30 ? this.level * 2 : 60;
        //关卡越高，敌机飞行速度越高
        var speedUp = Math.floor(this.level / 6);
        //关卡越高，敌机血量越高
        var hpUp = Math.floor(this.level / 8);
        //关卡越高，敌机数量越多
        var numUp = Math.floor(this.level / 10);

        //生成小飞机
        if (Laya.timer.currFrame % (80 - cutTime) === 0) {
            this.createEnemy(0, 2 + numUp, 3 + speedUp, 1);
        }

        //生成中型飞机
        if (Laya.timer.currFrame % (150 - cutTime * 2) === 0) {
            this.createEnemy(1, 1 + numUp, 2 + speedUp, 2 + hpUp * 2);
        }

        //生成BOSS
        if (Laya.timer.currFrame % (900 - cutTime * 4) === 0) {
            this.createEnemy(2, 1, 1 + speedUp, 10 + hpUp * 6);
        }
    }

    _proto.lostHp = function (role, lostHp) {
        role.hp -= lostHp;
        if (role.heroType === 2) {
            //每吃一个子弹升级道具，子弹升一级
            this.bulletLevel++;
            //子弹每升2级，子弹数量增加1，最大数量限制在4个
            this.hero.shootType = Math.min(Math.floor(this.bulletLevel / 2) + 1, 4);
            //子弹级别越高，发射频率越快
            this.hero.shootInterval = 500 - 20 * (this.bulletLevel > 20 ? 20 : this.bulletLevel);
            //隐藏道具，下个循环进行回收
            role.visible = false;
        } else if (role.heroType === 3) {
            //每吃一个血瓶，血量增加1
            this.hero.hp++;
            //设置最大血量不超过10
            if (this.hero.hp > 10) this.hero.hp = 10;
            //隐藏道具
            role.visible = false;
        } else if (role.hp > 0) {
            //如果未死亡，则播放爆炸动画
            role.playAction("hit");
        } else {
            //如果死亡，则播放爆炸动画
            if (role.heroType > 0) {
                //隐藏，下个循环进行回收
                role.visible = false;
            } else {
                role.playAction("down");
                //打死boss掉落血瓶或子弹升级道具
                if (role.type == "enemy3") {
                    //
                    var type = Math.random() < 0.7 ? 2 : 3;
                    var item = Pool.getItemByClass("role", Role);
                    item.init("ufo" + (type - 1), role.camp, 1, 1, 15, type);
                    item.pos(role.x, role.y);
                    Laya.stage.addChild(item);
                }
            }
        }
    }

    _proto.onMouseMove = function () {
        //设置主角的位置与鼠标位置一致。
        this.hero.pos(Laya.stage.mouseX, Laya.stage.mouseY);
    }

    _proto.createEnemy = function createEnemy(type, num, speed, hp) {
        for (var i = 0; i < num; i++) {
            //创建一个敌机对象。
            var enemy = Pool.getItemByClass("role", Role);
            //初始化敌机的角色属性。
            enemy.init("enemy" + (type + 1), 1, hp, speed, this.radius[type]);
            //设置敌机的随机位置。
            enemy.pos(Math.random() * 400 + 40, -Math.random() * 200 - 100);
            //添加敌机到舞台上。
            Laya.stage.addChild(enemy);
        }
    }

})();

var gameInstance = new Game();
