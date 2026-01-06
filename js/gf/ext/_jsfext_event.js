function JSFExt_OnKeyPress(e) {
    if (e.which) {
        gApp.mState.KeyChar(e.which);
    } else {
        gApp.mState.KeyChar(e.keyCode);
    }
}

function JSFExt_OnKeyDown(e) {
    gApp.mState.KeyDown(e.which);
    e = e || window.event;
    if (e.keyCode == 8) {
        return false;
    }
}

function JSFExt_OnKeyUp(e) {
    gApp.mState.KeyUp(e.which);
}

function JSFExt_FixCoords(e) {
    if (e.offsetX || e.offsetX == 0) {
        e._x = e.offsetX;
        e._y = e.offsetY;
    } else {
        e._x = e.layerX;
        e._y = e.layerY;
    }
}

function JSFExt_OnMouseMove(e) {
    JSFExt_FixCoords(e);
    gApp.mState.MouseMove(e._x / gApp.mScale, e._y / gApp.mScale);
}

function JSFExt_OnMouseDown(e) {
    JSFExt_FixCoords(e);
    gApp.mState.MouseDown(e._x / gApp.mScale, e._y / gApp.mScale);
}

function JSFExt_OnMouseUp(e) {
    JSFExt_FixCoords(e);
    gApp.mState.MouseUp(e._x / gApp.mScale, e._y / gApp.mScale);
}

// pause game when page is not visible
function JSFExt_OnVisibilityChange() {
    if (document["webkitHidden"]) {
        gApp.SetBackgrounded(true);
    } else {
        gApp.SetBackgrounded(false);
    }
}
