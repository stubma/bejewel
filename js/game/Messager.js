Game.Messager = function Game_Messager() {
    this.mMessages = [];
    this.mFont = null;
    this.mDefaultLife = 1.0;
    this.mJustification = Game.Messager.EJustification.eJustification_Left;
}
Game.Messager.prototype = {
    Draw_fadeAt : 0.5,
    mJustification : null,
    mDefaultLife : 0,
    mFont : null,
    mMessages : null,
    mDefaultColor : 0,
    Init : function Game_Messager$Init(i_font, i_defaultColor, i_defaultLife) {
        if(i_defaultColor === undefined) {
            i_defaultColor = ~0;
        }
        if(i_defaultLife === undefined) {
            i_defaultLife = 2.5;
        }
        this.mFont = i_font;
        this.mDefaultColor = i_defaultColor;
        this.mDefaultLife = i_defaultLife;
    },
    GetMessageCount : function Game_Messager$GetMessageCount() {
        return this.mMessages.length;
    },
    AddMessageColor : function Game_Messager$AddMessageColor(i_msg, i_color, i_life) {
        if(i_life === undefined) {
            i_life = -1.0;
        }
        this.AddMessageColorLife(i_msg, i_color, i_life);
    },
    AddMessage : function Game_Messager$AddMessage(i_msg, i_life) {
        if(i_life === undefined) {
            i_life = -1.0;
        }
        this.AddMessageColorLife(i_msg, this.mDefaultColor, i_life);
    },
    AddMessageColorLife : function Game_Messager$AddMessageColorLife(i_msg, i_color, i_life) {
        var newMsg = new Game.MessagerMsg();
        newMsg.LifeLeft = i_life < 0.0 ? this.mDefaultLife : i_life;
        newMsg.TextColor = i_color;
        newMsg.Text = i_msg;
        this.mMessages.push(newMsg);
    },
    Update : function Game_Messager$Update() {
        for(var idx = this.mMessages.length - 1; idx >= 0; --idx) {
            this.mMessages[idx].LifeLeft -= 0.01;
            if(this.mMessages[idx].LifeLeft <= 0.0) {
                this.mMessages.removeAt(idx);
            }
        }
    },
    Draw : function Game_Messager$Draw(g, theX, theY) {
        if(theX === undefined) {
            theX = 0;
        }
        if(theY === undefined) {
            theY = 0;
        }
        if(this.mFont == null) {
            return;
        }
        var yPos = theY;
        var xPos = theX;
        g.SetFont(this.mFont);
        for(var idx = (this.mMessages.length | 0) - 1; idx >= 0; --idx) {
            var msg = this.mMessages[idx];
            yPos -= ((Math.max(20, (g.mFont.GetHeight() | 0))) | 0);
            if(this.mJustification == Game.Messager.EJustification.eJustification_Right) {
                xPos = 0 - (g.mFont.StringWidth(msg.Text) | 0);
            }
            var c1;
            var c2;
            if(msg.LifeLeft < this.Draw_fadeAt) {
                c1 = GameFramework.gfx.Color.RGBAToInt(0, 0, 0, ((msg.LifeLeft / this.Draw_fadeAt * 255.0) | 0));
                c2 = GameFramework.gfx.Color.UInt_AToInt(msg.TextColor & 0xffffff, ((msg.LifeLeft / this.Draw_fadeAt * 255.0) | 0));
            } else {
                c1 = GameFramework.gfx.Color.BLACK_RGB;
                c2 = msg.TextColor;
            }
            var _t1 = g.PushColor(c1);
            try {
                g.DrawString(msg.Text, xPos + 1, yPos + 1);
            } finally {
                _t1.Dispose();
            }
            var _t2 = g.PushColor(c2);
            try {
                g.DrawString(msg.Text, xPos, yPos);
            } finally {
                _t2.Dispose();
            }
        }
    },
    GetJustification : function Game_Messager$GetJustification() {
        return this.mJustification;
    },
    SetJustification : function Game_Messager$SetJustification(i_val) {
        this.mJustification = i_val;
    }
}
Game.Messager.staticInit = function Game_Messager$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.Messager.registerClass('Game.Messager', null);
});
JSFExt_AddStaticInitFunc(function() {
    Game.Messager.staticInit();
});
Game.Messager.EJustification = {};
Game.Messager.EJustification.staticInit = function Game_Messager_EJustification$staticInit() {
    Game.Messager.EJustification.eJustification_Left = 0;
    Game.Messager.EJustification.eJustification_Right = 1;
}
JSFExt_AddInitFunc(function() {
    Game.Messager.EJustification.staticInit();
});