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

(function () {
    var gamewid = 480;
    var gamehei = 852
    function Game() {
        Laya.init(gamewid, gamehei);

        this.box = new Sprite();
        Laya.stage.addChild(this.box);

        this.bg1 = new Sprite();
        this.bg1.loadImage("res/background.png");
        //Laya.stage.addChild(this.bg1);
        this.box.addChild(this.bg1);

        this.bg2 = new Sprite();
        this.bg2.loadImage("res/background.png");
        //Laya.stage.addChild(this.bg2);
        this.bg2.pos(0, -852);
        this.box.addChild(this.bg2);
        
        Laya.timer.frameLoop(1, this, this.onLoop);
    }
    Laya.class(Game, "Game");
    var __pro = Game.prototype;
    __pro.onLoop = function onLoop() {
        this.box.y += 1;
        if(this.bg1.y + this.box > gamehei){
            this.bg1.y -= gamehei * 2;
        }
        if(this.bg2.y + this.box > gamehei){
            this.bg2.y -= gamehei * 2;
        }
    }

})();

var Gamestar = new Game();
