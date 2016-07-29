(function Game() {
    var Sprite = laya.display.Sprite;
    //定义背景容器
    var box;
    //定义背景1
    var bg1;
    //定义背景2
    var bg2;

    (function () {
        //初始化引擎，设置游戏的宽高
        Laya.init(480, 852);

        //创建一个容器，用于存放背景图。
        box = new Sprite();
        //把这容器添加到舞台。
        Laya.stage.addChild(box);

        //创建背景1
        bg1 = new Sprite();
        //加载并显示背景图1
        bg1.loadImage("res/background.png");
        //把背景1添加到容器 box 
        box.addChild(bg1);

        //创建背景2
        bg2 = new Sprite();
        //加载并显示背景图2
        bg2.loadImage("res/background.png");
        //设置背景图2的坐标
        bg2.pos(0, -852);
        //把背景2添加到容器
        box.addChild(bg2);

        //设置一个帧循环处理函数，用于背景位置的更新，实现背景滚动效果。
        Laya.timer.frameLoop(1, this, onLoop);

    })()

    /**
     * 在onLoop函数内，更新box容器的位置。
     */
    function onLoop() {
        //设置背景容器由上向下移动 1px
        box.y += 1;

        //当背景1向下移动出游戏的显示区域 480*852，则将背景1的y轴坐标,向上移动 852*2.
        if (bg1.y + box.y >= 852) {
            bg1.y -= 852 * 2;
        }

        //当背景2向下移动出游戏的显示区域 480*852，则将背景2的y轴坐标,向上移动 852*2.
        if (bg2.y + box.y >= 852) {
            bg2.y -= 852 * 2;
        }
    }
})()