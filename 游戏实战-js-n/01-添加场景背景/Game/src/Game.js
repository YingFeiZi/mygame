(function Game() {
    var Sprite = laya.display.Sprite;
    (function () {
        //初始化引擎，设置游戏的宽高
        Laya.init(480, 852);

        //创建一个精灵
        var bg = new Sprite();
        //加载并显示背景图
        bg.loadImage("res/background.png");
        //把这个精灵添加到舞台
        Laya.stage.addChild(bg);
    })()
})()