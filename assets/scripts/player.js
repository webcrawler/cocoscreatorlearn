// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
		jumpHeight: 0,
		jumpDuration: 0,
		maxMoveSpeed: 0,
        accel: 0,
        
        // 跳跃音效
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },
    },
	
	runJumpAction(){
		var jumpUp = cc.tween().by(this.jumpDuration, {y: this.jumpHeight}, {easing: 'sineOut'});
		var jumpDown = cc.tween().by(this.jumpDuration, {y: -this.jumpHeight}, {easing: 'sineIn'});
		var tween = cc.tween().sequence(jumpUp, jumpDown).call(this.playJumpSound, this);
		return cc.tween().repeatForever(tween)
    },
    
    playJumpSound: function () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },
	
    // onKeyDown (event) {
    //     // set a flag when key pressed
    //     switch(event.keyCode) {
    //         case cc.macro.KEY.a:
    //             this.accLeft = true;
	// 			this.accRight = false
    //             break;
    //         case cc.macro.KEY.d:
    //             this.accRight = true;
	// 			this.accLeft = false;
    //             break;
    //     }
    // },

    // onKeyUp (event) {
    //     // unset a flag when key released
    //     switch(event.keyCode) {
    //         case cc.macro.KEY.a:
    //             this.accLeft = false;
    //             break;
    //         case cc.macro.KEY.d:
    //             this.accRight = false;
    //             break;
    //     }
    // },

    onLoad () {
		var jumpAction = this.runJumpAction();
		cc.tween(this.node).then(jumpAction).start();
		
		this.accLeft = false;
		this.accRight = false;
		this.xSpeed = 0;
		
		// 初始化键盘输入监听
		//cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		//cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUP, this);

        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.on('touchstart', this.onTouchStart, this);
        touchReceiver.on('touchend', this.onTouchEnd, this);
    },
    
    onTouchStart (event) {
        var touchLoc = event.getLocation();
        if (touchLoc.x >= cc.winSize.width/2) {
            this.accLeft = false;
            this.accRight = true;
        } else {
            this.accLeft = true;
            this.accRight = false;
        }
    },

    onTouchEnd (event) {
        this.accLeft = false;
        this.accRight = false;
    },
	
	onDestroy () {
        // 取消键盘输入监听
        //cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        //cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
       
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.off('touchstart', this.onTouchStart, this);
        touchReceiver.off('touchend', this.onTouchEnd, this);
    },

    testFunc: function() {
        cc.log("js learn call");
    },

    start () {

    },

    update (dt) {
		        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
            //cc.log("左");
        }
        else if (this.accRight) {
            this.xSpeed += this.accel * dt;
            //cc.log("右");
        }

       // cc.log("this.xSpeed = " + this.xSpeed);
        //cc.log(Math.abs(this.xSpeed));
        //cc.log(this.maxMoveSpeed);

        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;

        
	},
});
