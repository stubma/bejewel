GameFramework.resources.popanim.PopAnimObjectPos = function GameFramework_resources_popanim_PopAnimObjectPos() {
    GameFramework.resources.popanim.PopAnimObjectPos.mInstCount++;
};
GameFramework.resources.popanim.PopAnimObjectPos.prototype = {
    mTransform: null,
    mData: null,
    mColor: 0,
    mAnimFrameNum: 0,
    Duplicate: function GameFramework_resources_popanim_PopAnimObjectPos$Duplicate() {
        var aPopAnimObjectPos = new GameFramework.resources.popanim.PopAnimObjectPos();
        aPopAnimObjectPos.mTransform = this.mTransform;
        aPopAnimObjectPos.mData = this.mData;
        aPopAnimObjectPos.mColor = this.mColor;
        aPopAnimObjectPos.mAnimFrameNum = this.mAnimFrameNum;
        return aPopAnimObjectPos;
    },
};
GameFramework.resources.popanim.PopAnimObjectPos.staticInit =
    function GameFramework_resources_popanim_PopAnimObjectPos$staticInit() {
        GameFramework.resources.popanim.PopAnimObjectPos.mInstCount = 0;
    };

JSFExt_AddInitFunc(function () {
    GameFramework.resources.popanim.PopAnimObjectPos.registerClass(
        "GameFramework.resources.popanim.PopAnimObjectPos",
        null
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.popanim.PopAnimObjectPos.staticInit();
});
