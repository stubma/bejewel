Game.TutorialSequence = function Game_TutorialSequence() {
    this.mTutorialSteps = [];
};
Game.TutorialSequence.prototype = {
    mTutorialSteps: null,
    mCurStepIdx: -1,
    mRunning: true,
    mMgr: null,
    mBoardSeed: 0,
    mKillStep: null,
    Add: function Game_TutorialSequence$Add(theStep) {
        theStep.mSequence = this;
        this.mTutorialSteps.push(theStep);
    },
    AdvanceStep: function Game_TutorialSequence$AdvanceStep() {
        var wantDisableTutorials = false;
        var aStep = this.GetCurrentStep();
        if (aStep != null && aStep.mHintDlg != null && aStep.mHintDlg.mNoHintsCheckbox.IsChecked()) {
            wantDisableTutorials = true;
        }
        if (aStep != null && aStep.mTutorialId != Game.DM.ETutorial._COUNT) {
            if (wantDisableTutorials) {
                this.mMgr.SetTutorialEnabled(false);
            }
            Game.BejApp.mBejApp.mBoard.SetTutorialCleared(aStep.mTutorialId);
        }
        this.KillCurrent(
            wantDisableTutorials ||
                this.mCurStepIdx + 1 >= this.mTutorialSteps.length ||
                !this.mMgr.GetTutorialEnabled()
        );
        if (wantDisableTutorials) {
            this.mCurStepIdx = this.mTutorialSteps.length;
        } else if (this.mCurStepIdx < this.mTutorialSteps.length) {
            ++this.mCurStepIdx;
        }
        if (this.mCurStepIdx > 0) {
            aStep = this.GetCurrentStep();
            if (aStep != null) {
                aStep.mHighlightShowPct.SetConstant(1.0);
            }
        }
        return this.mCurStepIdx < this.mTutorialSteps.length;
    },
    GetCurrentStep: function Game_TutorialSequence$GetCurrentStep() {
        if (this.mCurStepIdx < this.mTutorialSteps.length && this.mCurStepIdx >= 0) {
            return this.mTutorialSteps[this.mCurStepIdx];
        }
        return null;
    },
    KillCurrent: function Game_TutorialSequence$KillCurrent(theDoFadeOut) {
        this.mKillStep = this.GetCurrentStep();
        if (this.mKillStep != null) {
            this.mKillStep.Kill(theDoFadeOut);
        }
    },
    HasTutorialQueued: function Game_TutorialSequence$HasTutorialQueued(theTutorial) {
        for (var i = 0; i < this.mTutorialSteps.length; ++i) {
            if (this.mTutorialSteps[i].mTutorialId == theTutorial) {
                return true;
            }
        }
        return false;
    },
    Update: function Game_TutorialSequence$Update() {
        var aStep = this.GetCurrentStep();
        if (aStep == null || aStep.WasFinished()) {
            while (true) {
                this.AdvanceStep();
                var thisStep = this.GetCurrentStep();
                if (thisStep == null || (this.mMgr.GetTutorialFlags() & (1 << (thisStep.mTutorialId | 0))) == 0) {
                    break;
                }
            }
        } else if (aStep != null) {
            aStep.Update();
        }
        if (
            this.mKillStep != null &&
            this.mKillStep.mArrowShowPct.get_v() + this.mKillStep.mHighlightShowPct.get_v() == 0.0
        ) {
            this.mKillStep = null;
        }
    },
    Draw: function Game_TutorialSequence$Draw(g) {
        var curStep = this.GetCurrentStep();
        if (curStep != null) {
            curStep.Draw(g);
        }
        if (this.mKillStep != null) {
            this.mKillStep.Draw(g);
        }
    },
};
Game.TutorialSequence.staticInit = function Game_TutorialSequence$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.TutorialSequence.registerClass("Game.TutorialSequence", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.TutorialSequence.staticInit();
});
