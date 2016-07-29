//Laya.init(600, 400);
var Sprite = laya.display.Sprite;
var Handler = laya.utils.Handler;
var Loader = laya.net.Loader;
var Animation = laya.display.Animation;
var Rectangle = laya.maths.Rectangle;
var Event = laya.events.Event;
var Pool = laya.utils.Pool;
var Browser = laya.utils.Browser;
var Stat = laya.utils.Stat;
var SoundManager = laya.media.SoundManager;
const   gamewid = 480;
const   gamehei = 852;

//背景类
(function(){
    function BackGround(){
        var bg1 = null;
        var bg2 = null;
        BackGround.__super.call(this);
        this.init();
    }

    Laya.class(BackGround, "BackGround", Laya.Sprite);
    var __pro = BackGround.prototype;

    __pro.init = function() {
        this.bg1 = new Sprite();
        this.bg1.loadImage("res/background.png");
        this.addChild(this.bg1);

        this.bg2 = new Sprite();
        this.bg2.loadImage("res/background.png");
        this.bg2.pos(0, -852);
        this.addChild(this.bg2);
        
        Laya.timer.frameLoop(1, this, this.onLoop);

    }
    __pro.onLoop = function () {
        this.y += 1;
        if(this.bg1.y + this.y > gamehei){
            this.bg1.y -= gamehei * 2;
        }
        if(this.bg2.y + this.y > gamehei){
            this.bg2.y -= gamehei * 2;
        }
    }

})();


//角色类
(function () {
    function Role() {
        Role.__super.call(this); 
        this.body = null;
        this.init();
    }

    Laya.class(Role, "Role", laya.display.Sprite);
    var __pro = Role.prototype;   
    __pro.init = function () {
        Animation.createFrames(["war/hero_fly1.png", "war/hero_fly2.png"], "hero_fly");
        Animation.createFrames(["war/hero_down1.png", "war/hero_down2.png", "war/hero_down3.png", "war/hero_down4.png"], "hero_down");
        this.body = new Animation();
        //this.body.loadImages(["war/hero_fly1.png","war/hero_fly2.png"]);
        //this.body.play();
        this.addChild(this.body);        
        this.playAction("hero_fly");
    }
    __pro.playAction = function (action) {
        this.body.play(0, true, action);
        var bound = this.body.getBounds();
        this.body.pos(-bound.width / 2, -bound.height /2);
    }

})(); 







(function () {
    
    function Game() {
        
        Laya.init(gamewid, gamehei); //初始引擎
        this.bg = new BackGround();  //创建背景
        Laya.stage.addChild(this.bg);   //添加背景
        Laya.loader.load("res/atlas/war.json", Laya.Handler.create(this, this.onLoaded), null, Laya.Loader.ATLAS);
    }
    Laya.class(Game, "Game"); //注册类
    var __pro = Game.prototype;//获取类原型
    __pro.onLoaded = function onLoaded(){
        var hero = new Role();
        Laya.stage.addChild(hero);
        Laya.stage.on(laya.events.Event.MOUSE_MOVE, this, this.onMouseMove);
    }
    __pro.onMouseMove = function () {
        this.hero.pos(Laya.stage.mouseX, Laya.stage.mouseY);
    }

})();

var Gamestar = new Game();
