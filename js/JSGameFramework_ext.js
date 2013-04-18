// log flag
var TRACE = true;

// Debug with file:// url
// chrome need add --allow-file-access-from-files option
var LOCAL_DEBUG = true;

///////////////////////////////////////////////////////////////////////////////
// PrimeSharp Globals

window['ss'] = {
    version : '0.6.1.0',

    isUndefined : function(o) {
        return (o === undefined);
    },

    isNull : function(o) {
        return (o === null);
    },

    isNullOrUndefined : function(o) {
        return (o === null) || (o === undefined);
    }
};

(function() {
    function merge(target) {
        target = target || {};
        foreach(arguments, function(o) {
            if(o) {
                forIn(o, function(v, n) {
                    target[n] = v;
                });
            }
        }, 1);
        return target;
    }

    function forIn(obj, callback) {
        for(var x in obj) {
            callback(obj[x], x);
        }
    }

    function foreach(arr, callback, start) {
        var cancelled;
        if(arr) {
            if(!(arr instanceof Array || (typeof (arr.length) === 'number' && (typeof (arr.callee) === "function" || (arr.item && typeof (arr.nodeType) === "undefined") && !arr.addEventListener && !arr.attachEvent)))) {
                arr = [arr];
            }
            for(var i = start || 0, l = arr.length; i < l; i++) {
                if(callback(arr[i], i)) {
                    cancelled = true;
                    break;
                }
            }
        }
        return !cancelled;
    }

    var notLoading = 0, // not loading itself or any dependencies
        loading = 1,    // currently loading itself (dependencies have already loaded, executionDependencies may or may not be done)
        loadingCo = 2,  // loaded but waiting for executionDependencies
        loaded = 3,     // loaded self and all deps/codeps and execution callback executed
        attachEvent = !!document.attachEvent;

    function foreachScriptInfo(arr, callback) {
        var cancelled;
        if(arr) {
            for(var i = 0, l = arr.length; i < l; i++) {
                if(callback(getScriptInfo(arr[i]))) {
                    cancelled = true;
                    break;
                }
            }
        }
        return !cancelled;
    }

    function toIndex(arr) {
        // converts an array of strings into an object/index
        var obj = {};
        foreach(arr, function(name) {
            obj[name] = true;
        });
        return obj;
    }

    function getCompositeDependencies(composite, executionDependencies) {
        // gets the dependencies this composite script has by merging the dependencies of its
        // contained scripts, excluding any dependencies that are a part of the composite.
        var dependencies = [];
        foreachScriptInfo(composite.contains, function(scriptInfo) {
            foreach(lazyget(scriptInfo, executionDependencies ? "executionDependencies" : "dependencies"), function(name) {
                // composite.contains is an array of dependencies. _contains is a dictionary for fast lookup.
                // It was built when the composite was defined.
                if(!composite._contains[name]) {
                    dependencies.push(name);
                }
            });
        });
        return dependencies;
    }

    function getDependencies(scriptInfo, executionDependencies) {
        // determines the dependencies this script has, taking into account it may have been selected
        // to be loaded as part of a composite script, or it may BE a composite script.
        // If so, its dependencies are the set of all dependencies of all the scripts in the composite
        // that are not within the composite.
        var dependencies;
        if(scriptInfo.contains) {
            dependencies = getCompositeDependencies(scriptInfo, executionDependencies);
        } else {
            var composite = scriptInfo._composite;
            if(composite) {
                dependencies = getCompositeDependencies(composite, executionDependencies);
            } else {
                dependencies = lazyget(scriptInfo, executionDependencies ? "executionDependencies" : "dependencies");
            }
        }
        return dependencies;
    }

    function requireParents(scriptInfo) {
        forIn(scriptInfo["_parents"], function(parentInfo) {
            // if any parent dependency is trying to load as part of a composite, the composite
            // should get the first chance to execute.
            forIn(parentInfo["_composites"], function(composite) {
                requireScript(composite, null, null, true);
            });
            requireScript(parentInfo, null, null, true);
        });
    }

    function getScriptInfo(name) {
        return resolveScriptInfo(name) || (ss.scripts[name] = { name : name });
    }

    function requireScript(scriptInfo, callback, session, readOnly) {
        return ss.loader._requireScript(scriptInfo, callback, session, readOnly);
    }

    function requireAll(scriptInfos, callback, session, readOnly) {
        var waiting;
        foreach(scriptInfos, function(dependency) {
            dependency = resolveScriptInfo(dependency);
            waiting |= requireScript(dependency, callback, session, readOnly);
        });
        return waiting;
    }

    function resolveScriptInfo(nameOrScriptInfo) {
        var info = typeof (nameOrScriptInfo) === "string" ? (ss.scripts[nameOrScriptInfo] || ss.composites[nameOrScriptInfo]) : (nameOrScriptInfo ? (nameOrScriptInfo.script || nameOrScriptInfo) : null);
        if(info && !info._isScript) {
            info = null;
        }
        return info;
    }

    function state(scriptInfo, newState) {
        var ret = (scriptInfo._state = newState || scriptInfo._state) || 0;
        // if this is a composite script, mirror the state it its contained scripts
        if(newState) {
            foreachScriptInfo(scriptInfo.contains, function(scriptInfo) {
                state(scriptInfo, newState);
            });
        }
        return ret;
    }

    function isLoaded(scriptInfo) {
        return !scriptInfo || (state(scriptInfo) > loadingCo);
    }

    function getAndDelete(obj, field) {
        var r = obj[field];
        delete obj[field];
        return r;
    }

    function foreachCall(obj, field, args) {
        // calls all the functions in an array of functions and deletes
        // the array from the containing object.
        foreach(getAndDelete(obj, field), function(callback) {
            callback.apply(null, args || []);
        });
    }

    function lazyget(obj, name, value) {
        // aids in lazily adding to an array or object that may not exist yet
        // also makes it simple to get a field from an object that may or may not be defined
        // e.g. lazyget(null, "foo") // undefined
        return obj ? (obj[name] = obj[name] || value) : value;
    }

    function lazypush(obj, name, value) {
        lazyget(obj, name, []).push(value);
    }

    function lazyset(obj, name, key, value) {
        lazyget(obj, name, {})[key] = value;
    }

    function listenOnce(target, name, ieName, callback, isReadyState, isScript) {
        function onEvent() {
            // this closure causes a circular reference with the dom element (target)
            // because it is added as a handler to the target, so target->onEvent,
            // and onEvent references the target through the parameter, onEvent->target.
            // However both sides are removed when the event fires -- the handler is removed
            // and the target is set to null.
            if(!attachEvent || !isReadyState || /loaded|complete/.test(target.readyState)) {
                if(attachEvent) {
                    target.detachEvent(ieName || ("on" + name), onEvent);
                } else {
                    target.removeEventListener(name, onEvent, false);
                    if(isScript) {
                        target.removeEventListener("error", onEvent, false);
                    }
                }
                callback.apply(target);
                target = null;
            }
        }

        if(attachEvent) {
            target.attachEvent(ieName || ("on" + name), onEvent);
        } else {
            target.addEventListener(name, onEvent, false);
            if(isScript) {
                target.addEventListener("error", onEvent, false);
            }
        }
    }

    function raiseDomReady() {
        if(ss._domReady) {
            var cb = getAndDelete(ss, "_domReadyQueue");
            foreach(cb, function(c) {
                c();
            });
        }
    }

    function raiseOnReady() {
        var ready = ss._ready;
        if(!ready && ss._domReady && !(ss.loader && ss.loader._loading)) {
            ss._ready = ready = true;
        }
        if(ready) {
            var cb = getAndDelete(ss, "_readyQueue");
            foreach(cb, function(c) {
                c();
            });
        }
    }

    var ssAPI = {
        debug : true,
        scripts : {},
        composites : {},
        _domLoaded : function() {
            function domReady() {
                if(!ss._domReady) {
                    ss._domReady = true;
                    raiseDomReady();
                    raiseOnReady();
                }
            }

            listenOnce(window, "load", null, domReady);

            var check;
            if(attachEvent) {
                if((window == window.top) && document.documentElement.doScroll) {
                    // timer/doscroll trick works only when not in a frame
                    var timeout, er, el = document.createElement("div");
                    check = function() {
                        try {
                            el.doScroll("left");
                        } catch(er) {
                            timeout = window.setTimeout(check, 0);
                            return;
                        }
                        el = null;
                        domReady();
                    };
                    check();
                } else {
                    // in a frame this is the only reliable way to fire before onload, however
                    // testing has shown it is not much better than onload if at all better.
                    // using a <script> element with defer="true" is much better, but you have to
                    // document.write it for the 'defer' to work, and that wouldnt work if this
                    // script is being loaded dynamically, a reasonable possibility.
                    // There is no known way of detecting whether the script is loaded dynamically or not.
                    listenOnce(document, null, "onreadystatechange", domReady, true);
                }
            } else if(document.addEventListener) {
                listenOnce(document, "DOMContentLoaded", null, domReady);
            }
        },
        onDomReady : function(callback) {
            lazypush(this, "_domReadyQueue", callback);
            raiseDomReady();
        },
        onReady : function(callback) {
            lazypush(this, "_readyQueue", callback);
            raiseOnReady();
        },
        require : function(features, completedCallback, userContext) {
            // create a unique ID for this require session, used to ensure we are listening to
            // each script on each iteration only once.
            var session = ss.loader._session++, iterating, loaded;

            function raiseCallback() {
                // call the callback but not if the dom isn't ready
                if(completedCallback) {
                    ss.onDomReady(function() {
                        completedCallback(features, userContext)
                    });
                }
            }

            function allLoaded() {
                // called each time any script from the scripts list or their descendants are loaded.
                // Each time we re-play the requires operation, which allows us to recalculate the dependency
                // tree in case a loaded script has added to it, and also to recalculate additional composites
                // to load. It also makes it possible for the parent scripts of any given types to change.

                // Note that when scripts are loading simultaniously, the browser will sometimes execute 
                // more than one script before raising the scriptElement.load/readyStateChange event, which means
                // two or more script-loader aware scripts might all call registerScript() before the 'getHandler'
                // method for the first fires. In that scenario, once the handler does get called for the executed
                // scripts, they will all call this 'allLoaded' handler, and all might find that all the required
                // scripts have been loaded. To simply protect against calling the callback multiple times, we 
                // just ensure it is called once.
                if(!loaded && !iterating && !iteration()) {
                    loaded = true;
                    raiseCallback();
                }
                // when the loader is finished after the domready event, it should
                // raise the ready event.
                raiseOnReady();
            }

            function iteration() {
                iterating = true;
                var resolvedScripts = [];
                foreach(features, function(feature) {
                    feature = resolveScriptInfo(feature);
                    if(feature) {
                        var contains = feature.contains;
                        if(contains) {
                            foreachScriptInfo(contains, function(scriptInfo) {
                                resolvedScripts.push(scriptInfo);
                            });
                        } else {
                            resolvedScripts.push(feature);
                        }
                    }
                });
                if(ss.loader.combine) {
                    ss.loader._findComposites(resolvedScripts);
                }
                var waiting = requireAll(resolvedScripts, allLoaded, session);
                iterating = false;
                return waiting;
            }

            allLoaded();
        },
        loadScripts : function(scriptUrls, completedCallback, userContext) {
            this.loader._loadScripts(scriptUrls, completedCallback, userContext);
        },
        loader : {
            combine : true,
            basePath : null,
            _loading : 0,
            _session : 0,
            _init : function() {
                var scripts = document.getElementsByTagName("script"), selfUrl = scripts.length ? scripts[scripts.length - 1].src : null;
                this.basePath = selfUrl ? (selfUrl.slice(0, selfUrl.lastIndexOf("/"))) : "";
            },
            _loadSrc : function(src, callback) {
                var script = merge(document.createElement('script'), { type : 'text/javascript', src : src }), loaded = lazyget(this, "_loadedScripts", {});
                // First take inventory of all the script elements on the page so we can quickly detect whether a particular script has already
                // loaded or not. This is done frequently in case a script element is added by any other means separate from the loader.
                // For example, a script that loads could create a script element when it executes.
                // Urls found are stored in _loadedScripts so even script elements that have been removed will be remembered.
                foreach(document.getElementsByTagName("script"), function(script) {
                    var src = script.src;
                    if(src) {
                        loaded[src] = true;
                    }
                });
                if(loaded[script.src]) {
                    if(callback) {
                        callback();
                    }
                } else {
                    listenOnce(script, "load", "onreadystatechange", callback, true, true);
                    this._loading++;
                    loaded[script.src] = true;
                    document.getElementsByTagName("head")[0].appendChild(script);
                }
            },
            _load : function(scriptInfo, callback, session) {
                var waiting;
                if(isLoaded(scriptInfo)) {
                    callback();
                } else {
                    waiting = true;
                    var notifyList = lazyget(scriptInfo, "_notify", []), key = "session" + session;
                    if(!notifyList[key]) {
                        notifyList[key] = true;
                        notifyList.push(callback);
                    }
                    if(state(scriptInfo) < loading) {
                        state(scriptInfo, loading);
                        this._loadSrc(this._getUrl(scriptInfo), this._getHandler(scriptInfo));
                    }
                }
                return waiting;
            },
            _getUrl : function(scriptInfo) {
                var debug = ss.debug, name = scriptInfo.name, path = (debug ? (scriptInfo.debugUrl || scriptInfo.releaseUrl) : scriptInfo.releaseUrl).replace(/\{0\}/, name) || "";
                if(path.substr(0, 2) === "%/") {
                    var basePath = this.basePath, hasSlash = (basePath.charAt(basePath.length - 1) === "/");
                    path = basePath + (hasSlash ? "" : "/") + path.substr(2);
                }
                return path;
            },
            _getHandler : function(scriptInfo) {
                return function() {
                    // this === <script> element
                    ss.loader._loading--;
                    if(state(scriptInfo) < loadingCo) {
                        // dont do this if its already marked as 'loaded',
                        // which may happen if the script contains a registerScript() call.
                        state(scriptInfo, loadingCo);
                    }
                    foreachCall(scriptInfo, "_notify");
                    // if it is a composite also notify anyone waiting on any of its contained scripts
                    foreachScriptInfo(scriptInfo.contains, function(scriptInfo) {
                        foreachCall(scriptInfo, "_notify");
                    });
                }
            },
            _findComposites : function(scripts) {
                // given a list of top level required scripts, determines all the composite scripts that should load during the process
                // of loading those scripts. Returns an index indicating for each script in the dependency tree, which composite script
                // should load in its place.
                var scriptSet = {}, compositeMapping = {}, foundAny;
                // first filter out already loaded scripts and expand their dependencies, building
                // up the 'scriptSet' index.
                function visit(script) {
                    script = resolveScriptInfo(script);
                    var currentState = state(script);
                    if(currentState < loading && !script._composite) {
                        // unloaded script, eligible for composite selection
                        scriptSet[script.name] = script;
                        foundAny = true;
                        foreach(script["dependencies"], visit);
                    }
                    if(currentState < loaded) {
                        // this scripts executionDependencies may not be loaded,
                        // also check them for composite candidates
                        foreach(script["executionDependencies"], visit);
                    }
                }

                foreach(scripts, visit);
                if(foundAny) {
                    // scriptSet is now a dictionary of every unloaded dependency in the tree
                    // not already designated to load as part of a composite script.
                    // now enumerate all composites looking for those that contain nothing but
                    // scripts in this set.
                    forIn(ss.composites, function(composite) {
                        if(foreachScriptInfo(composite.contains, function(contained) {
                            if(!scriptSet[contained.name]) {
                                return true;
                            }
                        })) {
                            // all of the scripts this composite contains need to be loaded.
                            // But selecting this composite for the scripts it contains could offset
                            // other previously selected composites (in this same execution context)
                            // that contain any of the same scripts.
                            // To ensure maximum coverage of scripts within composites, only select this
                            // composite if doing so would result in less http requests. The number of http
                            // requests saved by a composite is the number of scripts it contains, minus 1.
                            // For example, a composite of 3 scripts takes 1 request, normally 3. 3-1=2.
                            var offsets = {}, offsetCount = 0;
                            foreach(composite.contains, function(name) {
                                var otherCandidate = compositeMapping[name];
                                if(otherCandidate && !offsets[otherCandidate.name]) {
                                    offsets[otherCandidate.name] = otherCandidate;
                                    offsetCount += otherCandidate.contains.length - 1;
                                }
                            });
                            if(composite.contains.length - 1 > offsetCount) {
                                // if offsetting a previously selected composite, unselect that composite
                                // for each of its contains.
                                forIn(offsets, function(offset) {
                                    foreach(offset.contains, function(name) {
                                        delete compositeMapping[name];
                                    });
                                });
                                // select this composite for each script it contains
                                foreach(composite.contains, function(name) {
                                    compositeMapping[name] = composite;
                                });
                            }
                        }
                    });
                    forIn(compositeMapping, function(composite, name) {
                        ss.scripts[name]._composite = composite;
                    });
                }
            },
            _loadScripts : function(scriptUrls, completedCallback, userContext) {
                var index = -1, loaded = lazyget(this, "_loadedScripts", {});
                // clone the array so outside changes to it do not affect this asynchronous enumeration of it
                scriptUrls = scriptUrls instanceof Array ? Array.apply(null, scriptUrls) : [scriptUrls];
                function scriptLoaded(first) {
                    if(!first) {
                        ss.loader._loading--;
                    }
                    if(++index < scriptUrls.length) {
                        ss.loader._loadSrc(scriptUrls[index], scriptLoaded);
                    } else {
                        if(completedCallback) {
                            completedCallback(scriptUrls, userContext);
                        }
                        raiseOnReady();
                    }
                }

                scriptLoaded(true);
            },
            _requireScript : function(scriptInfo, callback, session, readOnly) {
                // readonly: caller is only interested in knowing if this script is ready for it's execution callback,
                // it should not cause any dependencies to start loading. If it is, it is executed.
                var waiting;
                if(!isLoaded(scriptInfo)) {
                    var waitForDeps = requireAll(getDependencies(scriptInfo), callback, session, readOnly), waitForDepsCo = requireAll(getDependencies(scriptInfo, true), callback, session, readOnly);
                    if(!waitForDeps && !waitForDepsCo && state(scriptInfo) === loadingCo) {
                        // the script has no more dependencies, executionDependencies, itself has already loaded,
                        // but has not yet been confirmed to have been loaded. This is it.
                        // A script that supports executionDependencies might also support an 'execution callback',
                        // a wrapper function that allows us to load the script without executing it.
                        // We then call the callback once its executionDependencies have loaded.
                        state(scriptInfo, loaded);
                        // there can be only one, but this is a dirty trick to call this field if it exists
                        // and delete it in a consise way.
                        foreachCall(scriptInfo, "_callback");
                        // Now that this script has loaded, see if any of its parent scripts are waiting for it
                        // We only need to do this in readOnly mode since otherwise, a require() call is coming
                        // again anyway.
                        if(readOnly) {
                            var contains = scriptInfo.contains;
                            if(contains) {
                                foreachScriptInfo(contains, function(scriptInfo) {
                                    requireParents(scriptInfo);
                                });
                            } else {
                                requireParents(getScriptInfo(scriptInfo));
                            }
                        }
                    } else if(!readOnly && !waitForDeps) {
                        // if all dependencies are loaded & executed, now load this script,
                        // or the dependency it was selected for. Some executionDependencies may still be loading
                        this._load(scriptInfo._composite || scriptInfo, callback, session);
                    }
                    waiting |= (waitForDeps || waitForDepsCo);
                }
                return waiting || !isLoaded(scriptInfo);
            },
            _registerParents : function(scriptInfo) {
                // tell each script it depends on that this script depends on it
                function register(dependency) {
                    var depInfo = getScriptInfo(dependency);
                    lazyset(depInfo, "_parents", scriptInfo.name, scriptInfo);
                }

                foreach(scriptInfo["dependencies"], register);
                foreach(scriptInfo["executionDependencies"], register);
            },
            defineScript : function(scriptInfo) {
                var scripts = ss.scripts, name = scriptInfo.name, contains = scriptInfo.contains;
                if(contains) {
                    var composites = ss.composites;
                    composites[name] = scriptInfo = merge(composites[name], scriptInfo);
                    // create an index of its contents for more efficient lookup later
                    scriptInfo._contains = toIndex(contains);
                    // tell each script it contains that it is a part of this composite script
                    foreachScriptInfo(contains, function(contain) {
                        lazyset(contain, "_composites", name, scriptInfo);
                    });
                } else {
                    scriptInfo = scripts[name] = merge(scripts[name], scriptInfo);
                    this._registerParents(scriptInfo);
                }
                if(scriptInfo.isLoaded) {
                    scriptInfo._state = loaded;
                }
                scriptInfo._isScript = true;
            },
            defineScripts : function(defaultScriptInfo, scriptInfos) {
                foreach(scriptInfos, function(scriptInfo) {
                    ss.loader.defineScript(merge(null, defaultScriptInfo, scriptInfo));
                });
            },
            registerScript : function(name, executionDependencies, executionCallback) {
                var scriptInfo = getScriptInfo(name);
                scriptInfo._callback = executionCallback;
                var existingList = lazyget(scriptInfo, "executionDependencies", []), existing = toIndex(existingList);
                // add only the items that don't already exist
                foreach(executionDependencies, function(executionDependency) {
                    if(!existing[executionDependency]) {
                        existingList.push(executionDependency);
                    }
                });
                this._registerParents(scriptInfo);

                // the getHandler() script element event listener also sets the next state and calls
                // the execution callback. But we do it here also since this might occur when a script
                // loader script is referenced statically without an explicit call to load it, in which
                // case there is no script element listener.
                state(scriptInfo, loadingCo);
                requireScript(scriptInfo, null, null, true);
            }
        } // loader
    };
    merge(ss, ssAPI);

    ss.loader._init();
    ss._domLoaded();
})();

///////////////////////////////////////////////////////////////////////////////
// Object Extensions

Object.__typeName = 'Object';
Object.__baseType = null;

Object.getKeyCount = function Object$getKeyCount(d) {
    var count = 0;
    for(var n in d) {
        count++;
    }
    return count;
}

Object.clearKeys = function Object$clearKeys(d) {
    for(var n in d) {
        delete d[n];
    }
}

Object.keyExists = function Object$keyExists(d, key) {
    return d[key] !== undefined;
}

///////////////////////////////////////////////////////////////////////////////
// Function Extensions

Function.prototype.invoke = function Function$invoke() {
    return this.apply(null, arguments);
}

///////////////////////////////////////////////////////////////////////////////
// Boolean Extensions

Boolean.__typeName = 'Boolean';

Boolean.parse = function Boolean$parse(s) {
    return (s.toLowerCase() == 'true');
}

///////////////////////////////////////////////////////////////////////////////
// Number Extensions

Number.__typeName = 'Number';

Number.parse = function Number$parse(s) {
    if(!s || !s.length) {
        return 0;
    }
    if((s.indexOf('.') >= 0) || (s.indexOf('e') >= 0) || s.endsWith('f') || s.endsWith('F')) {
        return parseFloat(s);
    }
    return parseInt(s, 10);
}

Number.prototype.format = function Number$format(format) {
    if(format == "0.0") {
        return this.toFixed(1);
    }
    if(format == "0.00") {
        return this.toFixed(2);
    }
    if(format == "0.000") {
        return this.toFixed(3);
    }
    if(format == "00") {
        var aStr = this.toString();
        if(aStr.length == 1) {
            return "0" + aStr;
        }
        return aStr;
    }
    if(format == "000") {
        var aStr = this.toString();
        if(aStr.length == 1) {
            return "00" + aStr;
        }
        if(aStr.length == 2) {
            return "0" + aStr;
        }
        return aStr;
    }
    if(ss.isNullOrUndefined(format) || (format.length == 0) || (format == 'i')) {
        return this.toString();
    }
    return this._netFormat(format, false);
}

Number.prototype.localeFormat = function Number$format(format) {
    if(ss.isNullOrUndefined(format) || (format.length == 0) || (format == 'i')) {
        return this.toLocaleString();
    }
    return this._netFormat(format, true);
}

Number._commaFormat = function Number$_commaFormat(number, groups, decimal, comma) {
    var decimalPart = null;
    var decimalIndex = number.indexOf(decimal);
    if(decimalIndex > 0) {
        decimalPart = number.substr(decimalIndex);
        number = number.substr(0, decimalIndex);
    }

    var negative = number.startsWith('-');
    if(negative) {
        number = number.substr(1);
    }

    var groupIndex = 0;
    var groupSize = groups[groupIndex];
    if(number.length < groupSize) {
        return decimalPart ? number + decimalPart : number;
    }

    var index = number.length;
    var s = '';
    var done = false;
    while(!done) {
        var length = groupSize;
        var startIndex = index - length;
        if(startIndex < 0) {
            groupSize += startIndex;
            length += startIndex;
            startIndex = 0;
            done = true;
        }
        if(!length) {
            break;
        }

        var part = number.substr(startIndex, length);
        if(s.length) {
            s = part + comma + s;
        } else {
            s = part;
        }
        index -= length;

        if(groupIndex < groups.length - 1) {
            groupIndex++;
            groupSize = groups[groupIndex];
        }
    }

    if(negative) {
        s = '-' + s;
    }
    return decimalPart ? s + decimalPart : s;
}

Number.prototype._netFormat = function Number$_netFormat(format, useLocale) {
    var nf = useLocale ? ss.CultureInfo.CurrentCulture.numberFormat : ss.CultureInfo.InvariantCulture.numberFormat;

    var s = '';
    var precision = -1;

    if(format.length > 1) {
        precision = parseInt(format.substr(1));
    }

    var fs = format.charAt(0);
    switch(fs) {
        case 'd':
        case 'D':
            s = parseInt(Math.abs(this)).toString();
            if(precision != -1) {
                s = s.padLeft(precision, '0');
            }
            if(this < 0) {
                s = '-' + s;
            }
            break;
        case 'x':
        case 'X':
            s = parseInt(Math.abs(this)).toString(16);
            if(fs == 'X') {
                s = s.toUpperCase();
            }
            if(precision != -1) {
                s = s.padLeft(precision, '0');
            }
            break;
        case 'e':
        case 'E':
            if(precision == -1) {
                s = this.toExponential();
            } else {
                s = this.toExponential(precision);
            }
            if(fs == 'E') {
                s = s.toUpperCase();
            }
            break;
        case 'f':
        case 'F':
        case 'n':
        case 'N':
            if(precision == -1) {
                precision = nf.numberDecimalDigits;
            }
            s = this.toFixed(precision).toString();
            if(precision && (nf.numberDecimalSeparator != '.')) {
                var index = s.indexOf('.');
                s = s.substr(0, index) + nf.numberDecimalSeparator + s.substr(index + 1);
            }
            if((fs == 'n') || (fs == 'N')) {
                s = Number._commaFormat(s, nf.numberGroupSizes, nf.numberDecimalSeparator, nf.numberGroupSeparator);
            }
            break;
        case 'c':
        case 'C':
            if(precision == -1) {
                precision = nf.currencyDecimalDigits;
            }
            s = Math.abs(this).toFixed(precision).toString();
            if(precision && (nf.currencyDecimalSeparator != '.')) {
                var index = s.indexOf('.');
                s = s.substr(0, index) + nf.currencyDecimalSeparator + s.substr(index + 1);
            }
            s = Number._commaFormat(s, nf.currencyGroupSizes, nf.currencyDecimalSeparator, nf.currencyGroupSeparator);
            if(this < 0) {
                s = String.format(nf.currencyNegativePattern, s);
            } else {
                s = String.format(nf.currencyPositivePattern, s);
            }
            break;
        case 'p':
        case 'P':
            if(precision == -1) {
                precision = nf.percentDecimalDigits;
            }
            s = (Math.abs(this) * 100.0).toFixed(precision).toString();
            if(precision && (nf.percentDecimalSeparator != '.')) {
                var index = s.indexOf('.');
                s = s.substr(0, index) + nf.percentDecimalSeparator + s.substr(index + 1);
            }
            s = Number._commaFormat(s, nf.percentGroupSizes, nf.percentDecimalSeparator, nf.percentGroupSeparator);
            if(this < 0) {
                s = String.format(nf.percentNegativePattern, s);
            } else {
                s = String.format(nf.percentPositivePattern, s);
            }
            break;
    }

    return s;
}

///////////////////////////////////////////////////////////////////////////////
// Math Extensions

Math.truncate = function Math$truncate(n) {
    return (n >= 0) ? Math.floor(n) : Math.ceil(n);
}

///////////////////////////////////////////////////////////////////////////////
// String Extensions

String.__typeName = 'String';
String.Empty = '';

String.compare = function String$compare(s1, s2, ignoreCase) {
    if(ignoreCase) {
        if(s1) {
            s1 = s1.toUpperCase();
        }
        if(s2) {
            s2 = s2.toUpperCase();
        }
    }
    s1 = s1 || '';
    s2 = s2 || '';

    if(s1 == s2) {
        return 0;
    }
    if(s1 < s2) {
        return -1;
    }
    return 1;
}

String.prototype.compareTo = function String$compareTo(s, ignoreCase) {
    return String.compare(this, s, ignoreCase);
}

String.concat = function String$concat() {
    if(arguments.length === 2) {
        return arguments[0] + arguments[1];
    }
    return Array.prototype.join.call(arguments, '');
}

String.prototype.endsWith = function String$endsWith(suffix) {
    if(!suffix.length) {
        return true;
    }
    if(suffix.length > this.length) {
        return false;
    }
    return (this.substr(this.length - suffix.length) == suffix);
}

String.equals = function String$equals1(s1, s2, ignoreCase) {
    return String.compare(s1, s2, ignoreCase) == 0;
}

String._format = function String$_format(format, values, useLocale) {
    if(!String._formatRE) {
        String._formatRE = /(\{[^\}^\{]+\})/g;
    }

    return format.replace(String._formatRE, function(str, m) {
        var index = parseInt(m.substr(1));
        var value = values[index + 1];
        if(ss.isNullOrUndefined(value)) {
            return '';
        }
        if(value.format) {
            var formatSpec = null;
            var formatIndex = m.indexOf(':');
            if(formatIndex > 0) {
                formatSpec = m.substring(formatIndex + 1, m.length - 1);
            }
            return useLocale ? value.localeFormat(formatSpec) : value.format(formatSpec);
        } else {
            return useLocale ? value.toLocaleString() : value.toString();
        }
    });
}

String.format = function String$format(format) {
    return String._format(format, arguments, /* useLocale */false);
}

String.fromChar = function String$fromChar(ch, count) {
    var s = ch;
    for(var i = 1; i < count; i++) {
        s += ch;
    }
    return s;
}

String.prototype.htmlDecode = function String$htmlDecode() {
    if(!String._htmlDecRE) {
        String._htmlDecMap = { '&amp;' : '&', '&lt;' : '<', '&gt;' : '>', '&quot;' : '"' };
        String._htmlDecRE = /(&amp;|&lt;|&gt;|&quot;)/gi;
    }

    var s = this;
    s = s.replace(String._htmlDecRE, function String$htmlDecode$replace(str, m) {
        return String._htmlDecMap[m];
    });
    return s;
}

String.prototype.htmlEncode = function String$htmlEncode() {
    if(!String._htmlEncRE) {
        String._htmlEncMap = { '&' : '&amp;', '<' : '&lt;', '>' : '&gt;', '"' : '&quot;' };
        String._htmlEncRE = /([&<>"])/g;
    }

    var s = this;
    if(String._htmlEncRE.test(s)) {
        s = s.replace(String._htmlEncRE, function String$htmlEncode$replace(str, m) {
            return String._htmlEncMap[m];
        });
    }
    return s;
}

String.prototype.indexOfAny = function String$indexOfAny(chars, startIndex, count) {
    var length = this.length;
    if(!length) {
        return -1;
    }

    startIndex = startIndex || 0;
    count = count || length;

    var endIndex = startIndex + count - 1;
    if(endIndex >= length) {
        endIndex = length - 1;
    }

    for(var i = startIndex; i <= endIndex; i++) {
        if(chars.indexOf(this.charAt(i)) >= 0) {
            return i;
        }
    }
    return -1;
}

String.prototype.insert = function String$insert(index, value) {
    if(!value) {
        return this;
    }
    if(!index) {
        return value + this;
    }
    var s1 = this.substr(0, index);
    var s2 = this.substr(index);
    return s1 + value + s2;
}

String.isNullOrEmpty = function String$isNullOrEmpty(s) {
    return !s || !s.length;
}

String.prototype.lastIndexOfAny = function String$lastIndexOfAny(chars, startIndex, count) {
    var length = this.length;
    if(!length) {
        return -1;
    }

    startIndex = startIndex || length - 1;
    count = count || length;

    var endIndex = startIndex - count + 1;
    if(endIndex < 0) {
        endIndex = 0;
    }

    for(var i = startIndex; i >= endIndex; i--) {
        if(chars.indexOf(this.charAt(i)) >= 0) {
            return i;
        }
    }
    return -1;
}

String.localeFormat = function String$localeFormat(format) {
    return String._format(format, arguments, /* useLocale */true);
}

String.prototype.padLeft = function String$padLeft(totalWidth, ch) {
    if(this.length < totalWidth) {
        ch = ch || ' ';
        return String.fromChar(ch, totalWidth - this.length) + this;
    }
    return this;
}

String.prototype.padRight = function String$padRight(totalWidth, ch) {
    if(this.length < totalWidth) {
        ch = ch || ' ';
        return this + String.fromChar(ch, totalWidth - this.length);
    }
    return this;
}

String.prototype.quote = function String$quote() {
    if(!String._quoteMap) {
        String._quoteMap = { '\\' : '\\\\',
            '\'' : '\\\'', '"' : '\\"',
            '\r' : '\\r', '\n' : '\\n', '\t' : '\\t', '\f' : '\\f',
            '\b' : '\\b'
        };
    }
    if(!String._quoteRE) {
        String._quoteRE = new RegExp("([\'\"\\\\\x00-\x1F\x7F-\uFFFF])", "g");
    } else {
        String._quoteRE.lastIndex = 0;
    }

    var s = this;
    if(String._quoteRE.test(s)) {
        s = this.replace(String._quoteRE, function String$quote$replace(str, m) {
            var c = String._quoteMap[m];
            if(c) {
                return c;
            }
            c = m.charCodeAt(0);
            return '\\u' + c.toString(16).toUpperCase().padLeft(4, '0');
        });
    }
    return '"' + s + '"';
}

String.prototype.remove = function String$remove(index, count) {
    if(!count || ((index + count) > this.length)) {
        return this.substr(0, index);
    }
    return this.substr(0, index) + this.substr(index + count);
}

String.prototype.replaceAll = function String$replaceAll(oldValue, newValue) {
    newValue = newValue || '';
    return this.split(oldValue).join(newValue);
}
String.prototype['replaceAll'] = String.prototype.replaceAll;

String.prototype.startsWith = function String$startsWith(prefix) {
    if(!prefix.length) {
        return true;
    }
    if(prefix.length > this.length) {
        return false;
    }
    return (this.substr(0, prefix.length) == prefix);
}

if(!String.prototype.trim) {
    String.prototype.trim = function String$trim() {
        return this.trimEnd().trimStart();
    }

    String.prototype.trimEnd = function String$trimEnd() {
        return this.replace(/\s*$/, '');
    }

    String.prototype.trimStart = function String$trimStart() {
        return this.replace(/^\s*/, '');
    }
}

String.prototype.unquote = function String$unquote() {
    return eval('(' + this + ')');
}

///////////////////////////////////////////////////////////////////////////////
// Array Extensions

Array.__typeName = 'Array';
Array.__interfaces = [ss.IEnumerable];

Array.Create = function Array$Create(theSize, theDefault) {
    var aNewArray = new Array(theSize);
    for(var i = 2; i < arguments.length; i++) {
        aNewArray[i - 2] = arguments[i];
    }
    var anIdx = arguments.length - 2;
    while(anIdx < theSize) {
        aNewArray[anIdx++] = theDefault;
    }
    return aNewArray;
}

Array.Create2D = function Array$Create2D(theSize0, theSize1, theDefault) {
    var aNewArray = new Array(theSize0 * theSize1);
    aNewArray.mLengths = [theSize0, theSize1];
    aNewArray.mIdxMult0 = theSize1;
    //aNewArray.GetLength = function(theDimension) { return Array_GetLength(anArray, theDimension); }
    for(var i = 3; i < arguments.length; i++) {
        aNewArray[i - 3] = arguments[i];
    }
    var anIdx = arguments.length - 3;
    while(anIdx < theSize0 * theSize1) {
        aNewArray[anIdx++] = theDefault;
    }
    return aNewArray;
}

Array.Create3D = function Array$Create3D(theSize0, theSize1, theSize2, theDefault) {
    var aNewArray = new Array(theSize0 * theSize1);
    aNewArray.mLengths = [theSize0, theSize1, theSize2];
    aNewArray.mIdxMult0 = theSize1 * theSize2;
    aNewArray.mIdxMult1 = theSize2;
    //aNewArray.GetLength = function(theDimension) { return Array_GetLength(anArray, theDimension); }
    for(var i = 4; i < arguments.length; i++) {
        aNewArray[i - 4] = arguments[i];
    }
    var anIdx = arguments.length - 4;
    while(anIdx < theSize0 * theSize1) {
        aNewArray[anIdx++] = theDefault;
    }
    return aNewArray;
}

Array.prototype.add = function Array$add(item) {
    this[this.length] = item;
}

Array.prototype.addRange = function Array$addRange(items) {
    this.push.apply(this, items);
}

Array.prototype.aggregate = function Array$aggregate(seed, callback, instance) {
    var length = this.length;
    for(var i = 0; i < length; i++) {
        if(i in this) {
            seed = callback.call(instance, seed, this[i], i, this);
        }
    }
    return seed;
}

Array.prototype.clear = function Array$clear() {
    this.length = 0;
}

Array.prototype.clone = function Array$clone() {
    if(this.length === 1) {
        return [this[0]];
    } else {
        return Array.apply(null, this);
    }
}

Array.prototype.contains = function Array$contains(item) {
    var index = this.indexOf(item);
    return (index >= 0);
}

Array.prototype.dequeue = function Array$dequeue() {
    return this.shift();
}

Array.prototype.enqueue = function Array$enqueue(item) {
    // We record that this array instance is a queue, so we
    // can implement the right behavior in the peek method.
    this._queue = true;
    this.push(item);
}

Array.prototype.peek = function Array$peek() {
    if(this.length) {
        var index = this._queue ? 0 : this.length - 1;
        return this[index];
    }
    return null;
}

if(!Array.prototype.every) {
    Array.prototype.every = function Array$every(callback, instance) {
        var length = this.length;
        for(var i = 0; i < length; i++) {
            if(i in this && !callback.call(instance, this[i], i, this)) {
                return false;
            }
        }
        return true;
    }
}

Array.prototype.extract = function Array$extract(index, count) {
    if(!count) {
        return this.slice(index);
    }
    return this.slice(index, index + count);
}

if(!Array.prototype.filter) {
    Array.prototype.filter = function Array$filter(callback, instance) {
        var length = this.length;
        var filtered = [];
        for(var i = 0; i < length; i++) {
            if(i in this) {
                var val = this[i];
                if(callback.call(instance, val, i, this)) {
                    filtered.push(val);
                }
            }
        }
        return filtered;
    }
}

if(!Array.prototype.forEach) {
    Array.prototype.forEach = function Array$forEach(callback, instance) {
        var length = this.length;
        for(var i = 0; i < length; i++) {
            if(i in this) {
                callback.call(instance, this[i], i, this);
            }
        }
    }
}

Array.prototype.getEnumerator = function Array$getEnumerator() {
    return new ss.ArrayEnumerator(this);
}

Array.prototype.groupBy = function Array$groupBy(callback, instance) {
    var length = this.length;
    var groups = [];
    var keys = {};
    for(var i = 0; i < length; i++) {
        if(i in this) {
            var key = callback.call(instance, this[i], i);
            if(String.isNullOrEmpty(key)) {
                continue;
            }
            var items = keys[key];
            if(!items) {
                items = [];
                items.key = key;

                keys[key] = items;
                groups.add(items);
            }
            items.add(this[i]);
        }
    }
    return groups;
}

Array.prototype.index = function Array$index(callback, instance) {
    var length = this.length;
    var items = {};
    for(var i = 0; i < length; i++) {
        if(i in this) {
            var key = callback.call(instance, this[i], i);
            if(String.isNullOrEmpty(key)) {
                continue;
            }
            items[key] = this[i];
        }
    }
    return items;
}

if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function Array$indexOf(item, startIndex) {
        startIndex = startIndex || 0;
        var length = this.length;
        if(length) {
            for(var index = startIndex; index < length; index++) {
                if(this[index] === item) {
                    return index;
                }
            }
        }
        return -1;
    }
}

Array.prototype.insert = function Array$insert(index, item) {
    this.splice(index, 0, item);
}

Array.prototype.insertRange = function Array$insertRange(index, items) {
    if(index === 0) {
        this.unshift.apply(this, items);
    } else {
        for(var i = 0; i < items.length; i++) {
            this.splice(index + i, 0, items[i]);
        }
    }
}

if(!Array.prototype.map) {
    Array.prototype.map = function Array$map(callback, instance) {
        var length = this.length;
        var mapped = new Array(length);
        for(var i = 0; i < length; i++) {
            if(i in this) {
                mapped[i] = callback.call(instance, this[i], i, this);
            }
        }
        return mapped;
    }
}

Array.parse = function Array$parse(s) {
    return eval('(' + s + ')');
}

Array.prototype.remove = function Array$remove(item) {
    var index = this.indexOf(item);
    if(index >= 0) {
        this.splice(index, 1);
        return true;
    }
    return false;
}

Array.prototype.removeAt = function Array$removeAt(index) {
    this.splice(index, 1);
}

Array.prototype.removeRange = function Array$removeRange(index, count) {
    return this.splice(index, count);
}

if(!Array.prototype.some) {
    Array.prototype.some = function Array$some(callback, instance) {
        var length = this.length;
        for(var i = 0; i < length; i++) {
            if(i in this && callback.call(instance, this[i], i, this)) {
                return true;
            }
        }
        return false;
    }
}

Array.toArray = function Array$toArray(obj) {
    return Array.prototype.slice.call(obj);
}

///////////////////////////////////////////////////////////////////////////////
// RegExp Extensions

RegExp.__typeName = 'RegExp';

RegExp.parse = function RegExp$parse(s) {
    if(s.startsWith('/')) {
        var endSlashIndex = s.lastIndexOf('/');
        if(endSlashIndex > 1) {
            var expression = s.substring(1, endSlashIndex);
            var flags = s.substr(endSlashIndex + 1);
            return new RegExp(expression, flags);
        }
    }

    return null;
}

///////////////////////////////////////////////////////////////////////////////
// Date Extensions

Date.__typeName = 'Date';

Date.empty = null;

Date.get_now = function Date$get_now() {
    return new Date();
}

Date.get_today = function Date$get_today() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

Date.isEmpty = function Date$isEmpty(d) {
    return (d === null) || (d.valueOf() === 0);
}

Date.prototype.format = function Date$format(format) {
    if(ss.isNullOrUndefined(format) || (format.length == 0) || (format == 'i')) {
        return this.toString();
    }
    if(format == 'id') {
        return this.toDateString();
    }
    if(format == 'it') {
        return this.toTimeString();
    }

    return this._netFormat(format, false);
}

Date.prototype.localFormat = function Date$localeFormat(format) {
    if(ss.isNullOrUndefined(format) || (format.length == 0) || (format == 'i')) {
        return this.toLocaleString();
    }
    if(format == 'id') {
        return this.toLocaleDateString();
    }
    if(format == 'it') {
        return this.toLocaleTimeString();
    }

    return this._netFormat(format, true);
}

Date.prototype._netFormat = function Date$_netFormat(format, useLocale) {
    var dtf = useLocale ? ss.CultureInfo.CurrentCulture.dateFormat : ss.CultureInfo.InvariantCulture.dateFormat;
    var useUTC = false;

    if(format.length == 1) {
        switch(format) {
            case 'f':
                format = dtf.longDatePattern + ' ' + dtf.shortTimePattern;
            case 'F':
                format = dtf.dateTimePattern;
                break;

            case 'd':
                format = dtf.shortDatePattern;
                break;
            case 'D':
                format = dtf.longDatePattern;
                break;

            case 't':
                format = dtf.shortTimePattern;
                break;
            case 'T':
                format = dtf.longTimePattern;
                break;

            case 'g':
                format = dtf.shortDatePattern + ' ' + dtf.shortTimePattern;
                break;
            case 'G':
                format = dtf.shortDatePattern + ' ' + dtf.longTimePattern;
                break;

            case 'R':
            case 'r':
                format = dtf.gmtDateTimePattern;
                useUTC = true;
                break;
            case 'u':
                format = dtf.universalDateTimePattern;
                useUTC = true;
                break;
            case 'U':
                format = dtf.dateTimePattern;
                useUTC = true;
                break;

            case 's':
                format = dtf.sortableDateTimePattern;
                break;
        }
    }

    if(format.charAt(0) == '%') {
        format = format.substr(1);
    }

    if(!Date._formatRE) {
        Date._formatRE = /dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z/g;
    }

    var re = Date._formatRE;
    var sb = new ss.StringBuilder();
    var dt = this;
    if(useUTC) {
        dt = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds(), dt.getUTCMilliseconds()));
    }

    re.lastIndex = 0;
    while(true) {
        var index = re.lastIndex;
        var match = re.exec(format);

        sb.append(format.slice(index, match ? match.index : format.length));
        if(!match) {
            break;
        }

        var fs = match[0];
        var part = fs;
        switch(fs) {
            case 'dddd':
                part = dtf.dayNames[dt.getDay()];
                break;
            case 'ddd':
                part = dtf.shortDayNames[dt.getDay()];
                break;
            case 'dd':
                part = dt.getDate().toString().padLeft(2, '0');
                break;
            case 'd':
                part = dt.getDate();
                break;
            case 'MMMM':
                part = dtf.monthNames[dt.getMonth()];
                break;
            case 'MMM':
                part = dtf.shortMonthNames[dt.getMonth()];
                break;
            case 'MM':
                part = (dt.getMonth() + 1).toString().padLeft(2, '0');
                break;
            case 'M':
                part = (dt.getMonth() + 1);
                break;
            case 'yyyy':
                part = dt.getFullYear();
                break;
            case 'yy':
                part = (dt.getFullYear() % 100).toString().padLeft(2, '0');
                break;
            case 'y':
                part = (dt.getFullYear() % 100);
                break;
            case 'h':
            case 'hh':
                part = dt.getHours() % 12;
                if(!part) {
                    part = '12';
                } else if(fs == 'hh') {
                    part = part.toString().padLeft(2, '0');
                }
                break;
            case 'HH':
                part = dt.getHours().toString().padLeft(2, '0');
                break;
            case 'H':
                part = dt.getHours();
                break;
            case 'mm':
                part = dt.getMinutes().toString().padLeft(2, '0');
                break;
            case 'm':
                part = dt.getMinutes();
                break;
            case 'ss':
                part = dt.getSeconds().toString().padLeft(2, '0');
                break;
            case 's':
                part = dt.getSeconds();
                break;
            case 't':
            case 'tt':
                part = (dt.getHours() < 12) ? dtf.amDesignator : dtf.pmDesignator;
                if(fs == 't') {
                    part = part.charAt(0);
                }
                break;
            case 'fff':
                part = dt.getMilliseconds().toString().padLeft(3, '0');
                break;
            case 'ff':
                part = dt.getMilliseconds().toString().padLeft(3).substr(0, 2);
                break;
            case 'f':
                part = dt.getMilliseconds().toString().padLeft(3).charAt(0);
                break;
            case 'z':
                part = dt.getTimezoneOffset() / 60;
                part = ((part >= 0) ? '-' : '+') + Math.floor(Math.abs(part));
                break;
            case 'zz':
            case 'zzz':
                part = dt.getTimezoneOffset() / 60;
                part = ((part >= 0) ? '-' : '+') + Math.floor(Math.abs(part)).toString().padLeft(2, '0');
                if(fs == 'zzz') {
                    part += dtf.timeSeparator + Math.abs(dt.getTimezoneOffset() % 60).toString().padLeft(2, '0');
                }
                break;
        }
        sb.append(part);
    }

    return sb.toString();
}

Date.parseDate = function Date$parse(s) {
    // Date.parse returns the number of milliseconds
    // so we use that to create an actual Date instance
    return new Date(Date.parse(s));
}

///////////////////////////////////////////////////////////////////////////////
// Error Extensions

Error.__typeName = 'Error';

Error.prototype.popStackFrame = function Error$popStackFrame() {
    if(ss.isNullOrUndefined(this.stack) || ss.isNullOrUndefined(this.fileName) || ss.isNullOfUndefined(this.lineNumber)) {
        return;
    }

    var stackFrames = this.stack.split('\n');
    var currentFrame = stackFrames[0];
    var pattern = this.fileName + ':' + this.lineNumber;
    while(!ss.isNullOrUndefined(currentFrame) && currentFrame.indexOf(pattern) === -1) {
        stackFrames.shift();
        currentFrame = stackFrames[0];
    }

    var nextFrame = stackFrames[1];
    if(isNullOrUndefined(nextFrame)) {
        return;
    }

    var nextFrameParts = nextFrame.match(/@(.*):(\d+)$/);
    if(ss.isNullOrUndefined(nextFrameParts)) {
        return;
    }

    stackFrames.shift();
    this.stack = stackFrames.join("\n");
    this.fileName = nextFrameParts[1];
    this.lineNumber = parseInt(nextFrameParts[2]);
}

Error.createError = function Error$createError(message, errorInfo, innerException) {
    var e = new Error(message);
    if(errorInfo) {
        for(var v in errorInfo) {
            e[v] = errorInfo[v];
        }
    }
    if(innerException) {
        e.innerException = innerException;
    }

    e.popStackFrame();
    return e;
}

///////////////////////////////////////////////////////////////////////////////
// Debug Extensions

ss.Debug = window.Debug ? window.Debug : function() {
};
ss.Debug.__typeName = 'Debug';

if(!ss.Debug.writeln) {
    ss.Debug.writeln = function Debug$writeln(text) {
        if(window.console) {
            if(window.console.debug) {
                window.console.debug(text);
                return;
            } else if(window.console.log) {
                window.console.log(text);
                return;
            }
        } else if(window.opera && window.opera.postError) {
            window.opera.postError(text);
            return;
        }
    }
}

ss.Debug._fail = function Debug$_fail(message) {
    ss.Debug.writeln(message);
    eval('debugger;');
}

ss.Debug.assert = function Debug$assert(condition, message) {
    if(!condition) {
        message = 'Assert failed: ' + message;
        if(confirm(message + '\r\n\r\nBreak into debugger?')) {
            ss.Debug._fail(message);
        }
    }
}

ss.Debug.fail = function Debug$fail(message) {
    ss.Debug._fail(message);
}

ss.Debug._traceDump = function Debug$_traceDump(sb, object, name, indentation, dumpedObjects) {
    if(object === null) {
        sb.appendLine(indentation + name + ': null');
        return;
    }
    switch(typeof (object)) {
        case 'undefined':
            sb.appendLine(indentation + name + ': undefined');
            break;
        case 'number':
        case 'string':
        case 'boolean':
            sb.appendLine(indentation + name + ': ' + object);
            break;
        default:
            if(Date.isInstanceOfType(object) || RegExp.isInstanceOfType(object)) {
                sb.appendLine(indentation + name + ': ' + object);
                break;
            }

            if(dumpedObjects.contains(object)) {
                sb.appendLine(indentation + name + ': ...');
                break;
            }
            dumpedObjects.add(object);

            var type = Type.getInstanceType(object);
            var typeName = type.get_fullName();
            var recursiveIndentation = indentation + '  ';

            if(Array.isInstanceOfType(object)) {
                sb.appendLine(indentation + name + ': {' + typeName + '}');
                var length = object.length;
                for(var i = 0; i < length; i++) {
                    ss.Debug._traceDump(sb, object[i], '[' + i + ']', recursiveIndentation, dumpedObjects);
                }
            } else {
                if(object.tagName) {
                    sb.appendLine(indentation + name + ': <' + object.tagName + '>');
                    var attributes = object.attributes;
                    for(var i = 0; i < attributes.length; i++) {
                        var attrValue = attributes[i].nodeValue;
                        if(attrValue) {
                            ss.Debug._traceDump(sb, attrValue, attributes[i].nodeName, recursiveIndentation, dumpedObjects);
                        }
                    }
                } else {
                    sb.appendLine(indentation + name + ': {' + typeName + '}');
                    for(var field in object) {
                        var v = object[field];
                        if(!Function.isInstanceOfType(v)) {
                            ss.Debug._traceDump(sb, v, field, recursiveIndentation, dumpedObjects);
                        }
                    }
                }
            }

            dumpedObjects.remove(object);
            break;
    }
}

ss.Debug.traceDump = function Debug$traceDump(object, name) {
    if((!name || !name.length) && (object !== null)) {
        name = Type.getInstanceType(object).get_fullName();
    }

    var sb = new ss.StringBuilder();
    ss.Debug._traceDump(sb, object, name, '', []);
    ss.Debug.writeLine(sb.toString());
}

ss.Debug.writeLine = function Debug$writeLine(message) {
    if(window.debugService) {
        window.debugService.trace(message);
        return;
    }
    ss.Debug.writeln(message);

    var traceTextBox = document.getElementById('_traceTextBox');
    if(traceTextBox) {
        traceTextBox.value = traceTextBox.value + '\r\n' + message;
    }
}

///////////////////////////////////////////////////////////////////////////////
// Type System Implementation

window['Type'] = Function;
Type.__typeName = 'Type';

/**
 * @constructor
 */
__Namespace = function(name) {
    this.__typeName = name;
}
__Namespace.prototype = {
    __namespace : true,
    getName : function() {
        return this.__typeName;
    }
}

Type.registerNamespace = function Type$registerNamespace(name) {
    if(!window.__namespaces) {
        window.__namespaces = {};
    }
    if(!window.__rootNamespaces) {
        window.__rootNamespaces = [];
    }

    if(window.__namespaces[name]) {
        return window.__namespaces[name];
    }

    var ns = window;
    var nameParts = name.split('.');

    for(var i = 0; i < nameParts.length; i++) {
        var part = nameParts[i];
        var nso = ns[part];
        if(!nso) {
            ns[part] = nso = new __Namespace(nameParts.slice(0, i + 1).join('.'));
            if(i == 0) {
                window.__rootNamespaces.add(nso);
            }
        }
        ns = nso;
    }

    window.__namespaces[name] = ns;
    return window.__namespaces[name];
}

Type.prototype.registerClass = function Type$registerClass(name, baseType, interfaceType) {
    this.prototype.constructor = this;
    this.__typeName = name;
    this.__class = true;
    this.__baseType = baseType || Object;
    if(baseType) {
        this.__basePrototypePending = true;
    }

    if(interfaceType) {
        this.__interfaces = [];
        for(var i = 2; i < arguments.length; i++) {
            interfaceType = arguments[i];
            this.__interfaces.add(interfaceType);
        }
    }
}

Type.prototype.registerInterface = function Type$createInterface(name) {
    this.__typeName = name;
    this.__interface = true;
}

Type.prototype.registerEnum = function Type$createEnum(name, flags) {
    for(var field in this.prototype) {
        this[field] = this.prototype[field];
    }

    this.__typeName = name;
    this.__enum = true;
    if(flags) {
        this.__flags = true;
    }

    this.toString = ss.Enum._enumToString;
}

Type.prototype.setupBase = function Type$setupBase() {
    if(this.__basePrototypePending) {
        var baseType = this.__baseType;
        if(baseType.__basePrototypePending) {
            baseType.setupBase();
        }

        for(var memberName in baseType.prototype) {
            var memberValue = baseType.prototype[memberName];
            if(!this.prototype[memberName]) {
                this.prototype[memberName] = memberValue;
            }
        }

        delete this.__basePrototypePending;
    }
}

if(!Type.prototype.resolveInheritance) {
    // This function is not used by Script#; Visual Studio relies on it
    // for JavaScript IntelliSense support of derived types.
    Type.prototype.resolveInheritance = Type.prototype.setupBase;
}

Type.prototype.initializeBase = function Type$initializeBase(instance, args) {
    if(this.__basePrototypePending) {
        this.setupBase();
    }

    if(!args) {
        this.__baseType.apply(instance);
    } else {
        this.__baseType.apply(instance, args);
    }
}

Type.prototype.callBaseMethod = function Type$callBaseMethod(instance, name, args) {
    var baseMethod = this.__baseType.prototype[name];
    if(!args) {
        return baseMethod.apply(instance);
    } else {
        return baseMethod.apply(instance, args);
    }
}

Type.prototype.get_baseType = function Type$get_baseType() {
    return this.__baseType || null;
}

Type.prototype.get_fullName = function Type$get_fullName() {
    return this.__typeName;
}

Type.prototype.get_name = function Type$get_name() {
    var fullName = this.__typeName;
    var nsIndex = fullName.lastIndexOf('.');
    if(nsIndex > 0) {
        return fullName.substr(nsIndex + 1);
    }
    return fullName;
}

Type.prototype.getInterfaces = function Type$getInterfaces() {
    return this.__interfaces;
}

Type.prototype.isInstanceOfType = function Type$isInstanceOfType(instance) {
    if(ss.isNullOrUndefined(instance)) {
        return false;
    }
    if((this == Object) || (instance instanceof this)) {
        return true;
    }

    var type = Type.getInstanceType(instance);
    return this.isAssignableFrom(type);
}

Type.prototype.isAssignableFrom = function Type$isAssignableFrom(type) {
    if((this == Object) || (this == type)) {
        return true;
    }
    if(this.__class) {
        var baseType = type.__baseType;
        while(baseType) {
            if(this == baseType) {
                return true;
            }
            baseType = baseType.__baseType;
        }
    } else if(this.__interface) {
        var interfaces = type.__interfaces;
        if(interfaces && interfaces.contains(this)) {
            return true;
        }

        var baseType = type.__baseType;
        while(baseType) {
            interfaces = baseType.__interfaces;
            if(interfaces && interfaces.contains(this)) {
                return true;
            }
            baseType = baseType.__baseType;
        }
    }
    return false;
}

Type.isClass = function Type$isClass(type) {
    return (type.__class == true);
}

Type.isEnum = function Type$isEnum(type) {
    return (type.__enum == true);
}

Type.isFlags = function Type$isFlags(type) {
    return ((type.__enum == true) && (type.__flags == true));
}

Type.isInterface = function Type$isInterface(type) {
    return (type.__interface == true);
}

Type.isNamespace = function Type$isNamespace(object) {
    return (object.__namespace == true);
}

Type.canCast = function Type$canCast(instance, type) {
    return type.isInstanceOfType(instance);
}

Type.safeCast = function Type$safeCast(instance, type) {
    if(type.isInstanceOfType(instance)) {
        return instance;
    }
    return null;
}

Type.tryCast = function Type$tryCast(instance, type) {
    return (type.isInstanceOfType(instance));
}

Type.getInstanceType = function Type$getInstanceType(instance) {
    var ctor = null;

    // NOTE: We have to catch exceptions because the constructor
    //       cannot be looked up on native COM objects
    try {
        ctor = instance.constructor;
    } catch(ex) {
    }
    if(!ctor || !ctor.__typeName) {
        ctor = Object;
    }
    return ctor;
}

Type.getType = function Type$getType(typeName) {
    if(!typeName) {
        return null;
    }

    if(!Type.__typeCache) {
        Type.__typeCache = {};
    }

    var type = Type.__typeCache[typeName];
    if(!type) {
        type = eval(typeName);
        Type.__typeCache[typeName] = type;
    }
    return type;
}

Type.parse = function Type$parse(typeName) {
    return Type.getType(typeName);
}

///////////////////////////////////////////////////////////////////////////////
// Enum

ss.Enum = function Enum$() {
}
ss.Enum.registerClass('Enum');

ss.Enum.parse = function Enum$parse(enumType, s) {
    var values = enumType.prototype;
    if(!enumType.__flags) {
        for(var f in values) {
            if(f === s) {
                return values[f];
            }
        }
    } else {
        var parts = s.split('|');
        var value = 0;
        var parsed = true;

        for(var i = parts.length - 1; i >= 0; i--) {
            var part = parts[i].trim();
            var found = false;

            for(var f in values) {
                if(f === part) {
                    value |= values[f];
                    found = true;
                    break;
                }
            }
            if(!found) {
                parsed = false;
                break;
            }
        }

        if(parsed) {
            return value;
        }
    }
    throw 'Invalid Enumeration Value';
}

/**
 * @constructor
 */
ss.Enum._enumToString = function Enum$toString(value) {
    var values = this.prototype;
    if(!this.__flags || (value === 0)) {
        for(var i in values) {
            if(values[i] === value) {
                return i;
            }
        }
        throw 'Invalid Enumeration Value';
    } else {
        var parts = [];
        for(var i in values) {
            if(values[i] & value) {
                if(parts.length) {
                    parts.add(' | ');
                }
                parts.add(i);
            }
        }
        if(!parts.length) {
            throw 'Invalid Enumeration Value';
        }
        return parts.join('');
    }
}

///////////////////////////////////////////////////////////////////////////////
// Delegate

ss.Delegate = function Delegate$() {
}
ss.Delegate.registerClass('Delegate');

ss.Delegate.Null = function() {
}

ss.Delegate._contains = function Delegate$_contains(targets, object, method) {
    for(var i = 0; i < targets.length; i += 2) {
        if(targets[i] === object && targets[i + 1] === method) {
            return true;
        }
    }
    return false;
}

ss.Delegate._create = function Delegate$_create(targets) {
    var delegate = function() {
        if(targets.length == 2) {
            return targets[1].apply(targets[0], arguments);
        } else {
            var clone = targets.clone();
            for(var i = 0; i < clone.length; i += 2) {
                if(ss.Delegate._contains(targets, clone[i], clone[i + 1])) {
                    clone[i + 1].apply(clone[i], arguments);
                }
            }
            return null;
        }
    };
    delegate.invoke = delegate;
    delegate._targets = targets;

    return delegate;
}

ss.Delegate.create = function Delegate$create(object, method) {
    if(!object) {
        method.invoke = method;
        return method;
    }
    return ss.Delegate._create([object, method]);
}

ss.Delegate.combine = function Delegate$combine(delegate1, delegate2) {
    if(!delegate1) {
        if(!delegate2._targets) {
            return ss.Delegate.create(null, delegate2);
        }
        return delegate2;
    }
    if(!delegate2) {
        if(!delegate1._targets) {
            return ss.Delegate.create(null, delegate1);
        }
        return delegate1;
    }

    var targets1 = delegate1._targets ? delegate1._targets : [null, delegate1];
    var targets2 = delegate2._targets ? delegate2._targets : [null, delegate2];

    return ss.Delegate._create(targets1.concat(targets2));
}

ss.Delegate.remove = function Delegate$remove(delegate1, delegate2) {
    if(!delegate1 || (delegate1 === delegate2)) {
        return null;
    }
    if(!delegate2) {
        return delegate1;
    }

    var targets = delegate1._targets;
    var object = null;
    var method;
    if(delegate2._targets) {
        object = delegate2._targets[0];
        method = delegate2._targets[1];
    } else {
        method = delegate2;
    }

    for(var i = 0; i < targets.length; i += 2) {
        if((targets[i] === object) && (targets[i + 1] === method)) {
            if(targets.length == 2) {
                return null;
            }
            targets.splice(i, 2);
            return ss.Delegate._create(targets);
        }
    }

    return delegate1;
}

ss.Delegate.createExport = function Delegate$createExport(delegate, multiUse) {
    var name = '__' + (new Date()).valueOf();
    ss.Delegate[name] = function() {
        if(!multiUse) {
            ss.Delegate.deleteExport(name);
        }
        delegate.apply(null, arguments);
    };

    return name;
}

ss.Delegate.deleteExport = function Delegate$deleteExport(name) {
    if(ss.Delegate[name]) {
        delete ss.Delegate[name];
    }
}

ss.Delegate.clearExport = function Delegate$clearExport(name) {
    if(ss.Delegate[name]) {
        ss.Delegate[name] = Delegate.Null;
    }
}

///////////////////////////////////////////////////////////////////////////////
// CultureInfo

/**
 * @constructor
 */
ss.CultureInfo = function CultureInfo$(name, numberFormat, dateFormat) {
    this.name = name;
    this.numberFormat = numberFormat;
    this.dateFormat = dateFormat;
}
ss.CultureInfo.registerClass('CultureInfo');

ss.CultureInfo.InvariantCulture = new ss.CultureInfo('en-US', {
    naNSymbol : 'NaN',
    negativeSign : '-',
    positiveSign : '+',
    negativeInfinityText : '-Infinity',
    positiveInfinityText : 'Infinity',

    percentSymbol : '%',
    percentGroupSizes : [3],
    percentDecimalDigits : 2,
    percentDecimalSeparator : '.',
    percentGroupSeparator : ',',
    percentPositivePattern : '{0} %',
    percentNegativePattern : '-{0} %',

    currencySymbol : '$',
    currencyGroupSizes : [3],
    currencyDecimalDigits : 2,
    currencyDecimalSeparator : '.',
    currencyGroupSeparator : ',',
    currencyNegativePattern : '(${0})',
    currencyPositivePattern : '${0}',

    numberGroupSizes : [3],
    numberDecimalDigits : 2,
    numberDecimalSeparator : '.',
    numberGroupSeparator : ','
}, {
    amDesignator : 'AM',
    pmDesignator : 'PM',

    dateSeparator : '/',
    timeSeparator : ':',

    gmtDateTimePattern : 'ddd, dd MMM yyyy HH:mm:ss \'GMT\'',
    universalDateTimePattern : 'yyyy-MM-dd HH:mm:ssZ',
    sortableDateTimePattern : 'yyyy-MM-ddTHH:mm:ss',
    dateTimePattern : 'dddd, MMMM dd, yyyy h:mm:ss tt',

    longDatePattern : 'dddd, MMMM dd, yyyy',
    shortDatePattern : 'M/d/yyyy',

    longTimePattern : 'h:mm:ss tt',
    shortTimePattern : 'h:mm tt',

    firstDayOfWeek : 0,
    dayNames : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDayNames : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    minimizedDayNames : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

    monthNames : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''],
    shortMonthNames : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', '']
});
ss.CultureInfo.CurrentCulture = ss.CultureInfo.InvariantCulture;

///////////////////////////////////////////////////////////////////////////////
// IEnumerator

ss.IEnumerator = function IEnumerator$() {
};
ss.IEnumerator.prototype = {
    get_current : null,
    moveNext : null,
    reset : null
}

ss.IEnumerator.getEnumerator = function ss_IEnumerator$getEnumerator(enumerable) {
    if(enumerable) {
        return enumerable.getEnumerator ? enumerable.getEnumerator() : new ss.ArrayEnumerator(enumerable);
    }
    return null;
}

ss.IEnumerator.registerInterface('IEnumerator');

///////////////////////////////////////////////////////////////////////////////
// IEnumerable

ss.IEnumerable = function IEnumerable$() {
};
ss.IEnumerable.prototype = {
    getEnumerator : null
}
ss.IEnumerable.registerInterface('IEnumerable');

///////////////////////////////////////////////////////////////////////////////
// ArrayEnumerator

/**
 * @constructor
 */
ss.ArrayEnumerator = function ArrayEnumerator$(array) {
    this._array = array;
    this._index = -1;
}
ss.ArrayEnumerator.prototype = {
    get_current : function ArrayEnumerator$get_current() {
        return this._array[this._index];
    },
    moveNext : function ArrayEnumerator$moveNext() {
        this._index++;
        return (this._index < this._array.length);
    },
    reset : function ArrayEnumerator$reset() {
        this._index = -1;
    }
}

ss.ArrayEnumerator.registerClass('ArrayEnumerator', null, ss.IEnumerator);

///////////////////////////////////////////////////////////////////////////////
// IDisposable

/**
 * @constructor
 */
ss.IDisposable = function IDisposable$() {
};
ss.IDisposable.prototype = {
    dispose : null
}
ss.IDisposable.registerInterface('IDisposable');

///////////////////////////////////////////////////////////////////////////////
// StringBuilder

/**
 * @constructor
 */
ss.StringBuilder = function StringBuilder$(s) {
    this._parts = ss.isNullOrUndefined(s) ? [] : [s];
}
ss.StringBuilder.prototype = {
    get_isEmpty : function StringBuilder$get_isEmpty() {
        return (this._parts.length == 0);
    },

    append : function StringBuilder$append(s) {
        if(!ss.isNullOrUndefined(s)) {
            this._parts.add(s);
        }
        return this;
    },

    appendLine : function StringBuilder$appendLine(s) {
        this.append(s);
        this.append('\r\n');
        return this;
    },

    clear : function StringBuilder$clear() {
        this._parts.clear();
    },

    toString : function StringBuilder$toString(s) {
        return this._parts.join(s || '');
    }
};

ss.StringBuilder.registerClass('StringBuilder');

///////////////////////////////////////////////////////////////////////////////
// EventArgs

ss.EventArgs = function EventArgs$() {
}
ss.EventArgs.registerClass('EventArgs');

ss.EventArgs.Empty = new ss.EventArgs();

///////////////////////////////////////////////////////////////////////////////
// XMLHttpRequest

if(!window.XMLHttpRequest) {
    window.XMLHttpRequest = function() {
        var progIDs = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];

        for(var i = 0; i < progIDs.length; i++) {
            try {
                var xmlHttp = new ActiveXObject(progIDs[i]);
                return xmlHttp;
            } catch(ex) {
            }
        }

        return null;
    }
}

///////////////////////////////////////////////////////////////////////////////
// XmlDocumentParser

ss.XmlDocumentParser = function XmlDocumentParser$() {
}
ss.XmlDocumentParser.registerClass('XmlDocumentParser');

ss.XmlDocumentParser.parse = function XmlDocumentParser$parse(markup) {
    if(!window['DOMParser']) {
        var progIDs = ['Msxml2.DOMDocument.3.0', 'Msxml2.DOMDocument'];

        for(var i = 0; i < progIDs.length; i++) {
            try {
                var xmlDOM = new ActiveXObject(progIDs[i]);
                xmlDOM.async = false;
                xmlDOM.loadXML(markup);
                xmlDOM.setProperty('SelectionLanguage', 'XPath');

                return xmlDOM;
            } catch(ex) {
            }
        }
    } else {
        try {
            var domParser = new window['DOMParser']();
            return domParser['parseFromString'](markup, 'text/xml');
        } catch(ex) {
        }
    }

    return null;
}

///////////////////////////////////////////////////////////////////////////////
// CancelEventArgs

ss.CancelEventArgs = function CancelEventArgs$() {
    ss.CancelEventArgs.initializeBase(this);
    this._cancel = false;
}
ss.CancelEventArgs.prototype = {
    get_cancel : function ss$CancelEventArgs$get_cancel() {
        return this._cancel;
    },
    set_cancel : function ss$CancelEventArgs$set_cancel(value) {
        this._cancel = value;
    }
}
ss.CancelEventArgs.registerClass('CancelEventArgs', ss.EventArgs);

///////////////////////////////////////////////////////////////////////////////
// INotifyPropertyChanged

ss.INotifyPropertyChanged = function INotifyPropertyChanged$() {
};
ss.INotifyPropertyChanged.prototype = {
    add_propertyChanged : null,
    remove_propertyChanged : null
}
ss.INotifyPropertyChanged.registerInterface('INotifyPropertyChanged');

///////////////////////////////////////////////////////////////////////////////
// PropertyChangedEventArgs

ss.PropertyChangedEventArgs = function PropertyChangedEventArgs$(propertyName) {
    ss.PropertyChangedEventArgs.initializeBase(this);
    this._propName = propertyName;
}
ss.PropertyChangedEventArgs.prototype = {
    get_propertyName : function() {
        return this._propName;
    }
}
ss.PropertyChangedEventArgs.registerClass('PropertyChangedEventArgs', ss.EventArgs);

///////////////////////////////////////////////////////////////////////////////
// INotifyCollectionChanged

ss.INotifyCollectionChanged = function INotifyCollectionChanged$() {
};
ss.INotifyCollectionChanged.prototype = {
    add_collectionChanged : null,
    remove_collectionChanged : null
}
ss.INotifyCollectionChanged.registerInterface('INotifyCollectionChanged');

///////////////////////////////////////////////////////////////////////////////
// NotifyCollectionChangedAction

ss.CollectionChangedAction = function CollectionChangedAction$() {
};
ss.CollectionChangedAction.prototype = {
    add : 0,
    remove : 1,
    reset : 2
}
ss.CollectionChangedAction.registerEnum('CollectionChangedAction', false);

///////////////////////////////////////////////////////////////////////////////
// NotifyCollectionChangedEventArgs

ss.CollectionChangedEventArgs = function CollectionChangedEventArgs$(action, item, index) {
    ss.CollectionChangedEventArgs.initializeBase(this);
    this._action = action;
    this._item = item || null;
    this._index = index || -1;
}
ss.CollectionChangedEventArgs.prototype = {
    get_action : function() {
        return this._action;
    },
    get_index : function() {
        return this._index;
    },
    get_item : function() {
        return this._item;
    }
}
ss.CollectionChangedEventArgs.registerClass('CollectionChangedEventArgs', ss.EventArgs);

///////////////////////

function JSFExt_CreateGLTexSize(theWidth, theHeight) {
    var texture = gGL.createTexture();
    gGL.bindTexture(gGL.TEXTURE_2D, texture);
    gGL.texImage2D(gGL.TEXTURE_2D, 0, gGL.RGBA, theWidth, theHeight, 0, gGL.RGBA, gGL.UNSIGNED_BYTE, null);
    gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MAG_FILTER, gGL.LINEAR);
    gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MIN_FILTER, gGL.LINEAR);
    gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_S, gGL.CLAMP_TO_EDGE);
    gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_T, gGL.CLAMP_TO_EDGE);
    gGL.bindTexture(gGL.TEXTURE_2D, null);
    return texture;
}

function JSFExt_CreateCompositeImageData(theWidth, theHeight) {
    var aScratchCTX = document.getElementById('ScratchCanvas').getContext('2d');
    return aScratchCTX.createImageData(theWidth, theHeight);
}

function JSFXExt_CopyToImageData(theDestImageData, theSrcX, theSrcY, theWidth, theHeight, theColorImage, theAlphaImage, theDestX, theDestY) {
    var aScratchCTX = document.getElementById('ScratchCanvas').getContext('2d');

    var aMaxHeight = 256;
    if((theColorImage) && (theAlphaImage)) {
        aMaxHeight = 128;
    }

    if(theHeight > aMaxHeight) {
        JSFXExt_CopyToImageData(theDestImageData, theSrcX, theSrcY, theWidth, aMaxHeight, theColorImage, theAlphaImage, theDestX, theDestY);
        JSFXExt_CopyToImageData(theDestImageData, theSrcX, theSrcY + aMaxHeight, theWidth, theHeight - aMaxHeight, theColorImage, theAlphaImage, theDestX, theDestY + aMaxHeight);
        return;
    }

    var aMaxWidth = 256;
    if(theWidth > aMaxWidth) {
        JSFXExt_CopyToImageData(theDestImageData, theSrcX, theSrcY, aMaxWidth, theHeight, theColorImage, theAlphaImage, theDestX, theDestY);
        JSFXExt_CopyToImageData(theDestImageData, theSrcX + aMaxWidth, theSrcY, theWidth - aMaxWidth, theHeight, theColorImage, theAlphaImage, theDestX + aMaxWidth, theDestY);
        return;
    }

    var aSize = theWidth * theHeight;

    var aColorImageData = null;
    var anAlphaImageData = null;

    var aCurY = 0;
    var aSrcIdx = 0;

    if(theAlphaImage) {
        aScratchCTX.drawImage(theAlphaImage, theSrcX, theSrcY, theWidth, theHeight, 0, 0, theWidth, theHeight);
        aCurY += theHeight;
    }

    if(theColorImage) {
        aScratchCTX.drawImage(theColorImage, theSrcX, theSrcY, theWidth, theHeight, 0, aCurY, theWidth, theHeight);
    }

    var anImageData = aScratchCTX.getImageData(0, 0, theWidth, aCurY + theHeight);

    var aSrcIdx = 0;
    if((theColorImage) && (theAlphaImage)) {
        aSrcIdx = (theHeight * theWidth) * 4;
        var aDestBits = theDestImageData.data;
        var aSrcBits = anImageData.data;
        var anAlphaOffset = -aSrcIdx - 3;
        for(var y = 0; y < theHeight; y++) {
            var destIdx = ((theDestY + y) * theDestImageData.width + theDestX) * 4;
            for(var x = 0; x < theWidth; x++) {
                aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
                aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
                aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
                aDestBits[destIdx++] = aSrcBits[anAlphaOffset + aSrcIdx++];

            }
        }
    } else if(theColorImage) {
        var aDestBits = theDestImageData.data;
        var aSrcBits = anImageData.data;
        for(var y = 0; y < theHeight; y++) {
            var destIdx = ((theDestY + y) * theDestImageData.width + theDestX) * 4;
            for(var x = 0; x < theWidth; x++) {
                aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
                aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
                aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
                aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
            }
        }
    } else if(theAlphaImage) {
        var aDestBits = theDestImageData.data;
        var aSrcBits = anImageData.data;
        for(var y = 0; y < theHeight; y++) {
            var destIdx = ((theDestY + y) * theDestImageData.width + theDestX) * 4;
            for(var x = 0; x < theWidth; x++) {
                aDestBits[destIdx++] = 255;
                aDestBits[destIdx++] = 255;
                aDestBits[destIdx++] = 255;
                aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
                aSrcIdx += 3;
            }
        }
    }
}

function JSFXExt_CopyTexBits(theGLTex, theSrcX, theSrcY, theWidth, theHeight, theColorImage, theAlphaImage, theDestX, theDestY) {
    var aScratchCTX = document.getElementById('ScratchCanvas').getContext('2d');

    var aSize = theWidth * theHeight;

    var aColorImageData = null;
    var anAlphaImageData = null;
    var aDestImageData = null;

    var anAlphaBits;

    if(theAlphaImage != null) {
        aScratchCTX.drawImage(theAlphaImage, theSrcX, theSrcY, theWidth, theHeight, 0, 0, theWidth, theHeight);
        anAlphaImageData = aScratchCTX.getImageData(0, 0, theWidth, theHeight);
    }

    if(theColorImage != null) {
        if(anAlphaImageData != null) {
            anAlphaBits = new Uint8Array(theWidth * theHeight);
            for(var i = 0; i < aSize; i++) {
                anAlphaBits[i] = anAlphaImageData.data[i * 4];
            }
        }
        aScratchCTX.drawImage(theColorImage, theSrcX, theSrcY, theWidth, theHeight, 0, 0, theWidth, theHeight);
        aColorImageData = aScratchCTX.getImageData(0, 0, theWidth, theHeight);
    }

    if((aColorImageData != null) && (anAlphaImageData != null)) {
        aDestImageData = aColorImageData;
        for(var i = 0; i < aSize; i++) {
            aDestImageData.data[i * 4 + 3] = anAlphaBits[i];
        }
    } else if(anAlphaImageData != null) {
        aDestImageData = anAlphaImageData;
        for(var i = 0; i < aSize; i++) {
            aDestImageData.data[i * 4 + 3] = anAlphaImageData[i * 4];
            aDestImageData.data[i * 4] = 255;
            aDestImageData.data[i * 4 + 1] = 255;
            aDestImageData.data[i * 4 + 2] = 255;
        }
    } else {
        aDestImageData = aColorImageData;
    }

    gGL.bindTexture(gGL.TEXTURE_2D, theGLTex);
    gGL.texSubImage2D(gGL.TEXTURE_2D, 0, theDestX, theDestY, gGL.RGBA, gGL.UNSIGNED_BYTE, aDestImageData);
    gGL.bindTexture(gGL.TEXTURE_2D, null);
}

function JSFExt_CreateGLTexComb(theColorImage, theAlphaImage) {
    var aCompositeImageData = JSFExt_CreateCompositeImageData(theColorImage.width, theColorImage.height);
    JSFXExt_CopyToImageData(aCompositeImageData, 0, 0, theColorImage.width, theColorImage.height, theColorImage, theAlphaImage, 0, 0);
    return CreateGLTex(aCompositeImageData);
}

function JSFExt_LoadImage(theStreamer, thePath1, thePath2) {
    if(thePath2) {
        var anImage = new Image();
        anImage.onload = function() {
            theStreamer.mColorImage = anImage;
            if(theStreamer.mAlphaImage != null) {
                theStreamer.mGLTex = JSFExt_CreateGLTexComb(theStreamer.mColorImage, theStreamer.mAlphaImage);
                gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
            }
        }
        anImage.onerror = function() {
            theStreamer.mFailed = true;
        }
        anImage.src = thePath1;

        var anImage2 = new Image();
        anImage2.onload = function() {
            theStreamer.mAlphaImage = anImage2;
            if(theStreamer.mColorImage != null) {
                theStreamer.mGLTex = JSFExt_CreateGLTexComb(theStreamer.mColorImage, theStreamer.mAlphaImage);
                gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
            }
        }
        anImage2.onerror = function() {
            theStreamer.mFailed = true;
        }
        anImage2.src = thePath2;
    } else {
        var anImage = new Image();
        //anImage.onload = function () { theStreamer.mGLTex = CreateGLTex(anImage); gApp.ResourceStreamerCompletedCallback(anImage, theStreamer); }
        anImage.onload = function() {
            theStreamer.mDeferredFunc = function() {
                theStreamer.mGLTex = CreateGLTex(anImage);
                gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
            }
        }
        anImage.onerror = function() {
            theStreamer.mFailed = true;
        }
        anImage.src = thePath1;
    }
    return anImage;
}

function JSFExt_LoadImageSub(theStreamer, thePath1, thePath2) {
    if(thePath2) {
        var anImage = new Image();
        anImage.onload = function() {
            theStreamer.mColorImage = anImage;
            if(theStreamer.mAlphaImage != null) {
                gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
            }
        }
        anImage.onerror = function() {
            theStreamer.mFailed = true;
        }
        anImage.src = thePath1;

        var anImage2 = new Image();
        anImage2.onload = function() {
            theStreamer.mAlphaImage = anImage2;
            if(theStreamer.mColorImage != null) {
                gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
            }
        }
        anImage2.onerror = function() {
            theStreamer.mFailed = true;
        }
        anImage2.src = thePath2;
    } else if(thePath1.indexOf('_.') == -1) {
        var anImage = new Image();
        anImage.onload = function() {
            theStreamer.mColorImage = anImage;
            gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
        }
        anImage.onerror = function() {
            theStreamer.mFailed = true;
        }
        anImage.src = thePath1;
    } else {
        var anImage = new Image();
        anImage.onload = function() {
            theStreamer.mAlphaImage = anImage;
            gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
        }
        anImage.onerror = function() {
            theStreamer.mFailed = true;
        }
        anImage.src = thePath1;
    }
    return anImage;
}

var gWhiteDotTex;
var gWebKitAnimationCall;

if(typeof webkitRequestAnimationFrame == 'function') {
    gWebKitAnimationCall = webkitRequestAnimationFrame;
} else if(typeof window.mozRequestAnimationFrame == 'function') {
    gWebKitAnimationCall = window.mozRequestAnimationFrame;
}

//gUseWebKitAnimation = false;

if(gWebKitAnimationCall) {
    gWebKitAnimationCall(JSFExt_Timer);
} else {
    setInterval("JSFExt_Timer()", 16);
}
var gApp;
var gGL = null;
var gGLSpriteContext = null;
var gCTX = null;

function CreateGLTex(theImage) {
    if(gGL != null) {
        var texture = gGL.createTexture();
        //gGL.pixelStorei(gGL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gGL.bindTexture(gGL.TEXTURE_2D, texture);
        gGL.texImage2D(gGL.TEXTURE_2D, 0, gGL.RGBA, gGL.RGBA, gGL.UNSIGNED_BYTE, theImage);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MAG_FILTER, gGL.LINEAR);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MIN_FILTER, gGL.LINEAR);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_S, gGL.CLAMP_TO_EDGE);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_T, gGL.CLAMP_TO_EDGE);
        gGL.bindTexture(gGL.TEXTURE_2D, null);
        return texture;
    }
}

function JFSExt_CreateEmptyGLTex(theGLTex, theImage) {
    if(gGL != null) {
        var texture = gGL.createTexture();
        return texture;
    }
}

function JFSExt_SetGLTexImage(theGLTex, theImage) {
    if(gGL != null) {
        //gGL.pixelStorei(gGL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gGL.bindTexture(gGL.TEXTURE_2D, theGLTex);
        gGL.texImage2D(gGL.TEXTURE_2D, 0, gGL.RGBA, gGL.RGBA, gGL.UNSIGNED_BYTE, theImage);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MAG_FILTER, gGL.LINEAR);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MIN_FILTER, gGL.LINEAR);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_S, gGL.CLAMP_TO_EDGE);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_T, gGL.CLAMP_TO_EDGE);
        gGL.bindTexture(gGL.TEXTURE_2D, null);
    }
}

function CreateGLTexPixels(theWidth, theHeight, thePixels) {
    if(gGL != null) {
        var texture = gGL.createTexture();
        //gGL.pixelStorei(gGL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gGL.bindTexture(gGL.TEXTURE_2D, texture);
        //gGL.texImage2D(gGL.TEXTURE_2D, 0, gGL.RGBA, gGL.RGBA, gGL.UNSIGNED_BYTE, theImage);
        gGL.texImage2D(gGL.TEXTURE_2D, 0, gGL.RGBA, theWidth, theHeight, 0, gGL.RGBA, gGL.UNSIGNED_BYTE, thePixels);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MAG_FILTER, gGL.LINEAR);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MIN_FILTER, gGL.LINEAR);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_S, gGL.CLAMP_TO_EDGE);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_T, gGL.CLAMP_TO_EDGE);
        gGL.bindTexture(gGL.TEXTURE_2D, null);
        return texture;
    }
}

function DecodeBase64(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while(i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if(enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if(enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    return output;
}

var gRequiresBinaryFileHack = false;
function JFSExt_SetRequiresBinaryHack(required) {
    gRequiresBinaryFileHack = required;
}
window['JFSExt_SetRequiresBinaryHack'] = JFSExt_SetRequiresBinaryHack;

function JFSExt_IsGetBinarySupported() {
    var aXMLHttpRequest = new XMLHttpRequest();
    if(aXMLHttpRequest.overrideMimeType) {
        return true;
    }
    return false;
}

function JFSExt_GetBinary(theStreamer, theURL) {
    var aXMLHttpRequest = new XMLHttpRequest();
    if((aXMLHttpRequest.overrideMimeType) || (!gRequiresBinaryFileHack)) {
        aXMLHttpRequest.open("GET", theURL, true);
    } else {
        aXMLHttpRequest.open("GET", "file_getter.php?path=" + theURL, true);
    }
    aXMLHttpRequest.onreadystatechange = function() {
        if(aXMLHttpRequest.readyState == 4) {
            if(aXMLHttpRequest.status != 200) {
                theStreamer.mFailed = true;
            } else {
                gApp.ResourceStreamerCompletedCallback(aXMLHttpRequest.responseText, theStreamer);
            }
        }
    }
    if(aXMLHttpRequest.overrideMimeType) {
        aXMLHttpRequest.overrideMimeType('text/plain;charset=x-user-defined');
    }

    aXMLHttpRequest.send();
    return aXMLHttpRequest;
}

function JFSExt_GetBinaryGroupData(theStreamer, theGroupName, theURL) {
    var isUTF8 = theURL.indexOf('.utf8') != -1;

    var aXMLHttpRequest = new XMLHttpRequest();
    if((aXMLHttpRequest.overrideMimeType) || (!gRequiresBinaryFileHack) || (isUTF8)) {
        aXMLHttpRequest.open("GET", theURL, true);
    } else {
        aXMLHttpRequest.open("GET", "file_getter.php?path=" + theURL, true);
    }
    aXMLHttpRequest.onreadystatechange = function() {
        if(aXMLHttpRequest.readyState == 4) {
            if(aXMLHttpRequest.status != 200 && !LOCAL_DEBUG) {
                theStreamer.mFailed = true;
            } else {
                gApp.BinaryGroupDataLoaded(theGroupName, aXMLHttpRequest.responseText);
            }
        }
    }
    if((aXMLHttpRequest.overrideMimeType) && (!isUTF8)) {
        aXMLHttpRequest.overrideMimeType('text/plain;charset=x-user-defined');
    }

    aXMLHttpRequest.send();
    return aXMLHttpRequest;
}

var gBlindGetObjects = [];

function JSFExt_BlindGet(theURL) {
    //var 
}

$['ajaxTransport'](function(options, originalOptions, jqXHR) {
    var xdr;

    return {
        send : function(_, completeCallback) {
            xdr = new XDomainRequest();
            xdr.onload = function() {
                if(xdr.contentType.match(/\/json/)) {
                    options.dataTypes.push("json");
                }

                completeCallback(200, 'success', { text : xdr.responseText });
            };
            xdr.onerror = xdr.ontimeout = function() {
                completeCallback(400, 'failed', { text : xdr.responseText });
            }

            xdr.open(options.type, options.url);
            xdr.send(options.data);
        },
        abort : function() {
            if(xdr) {
                xdr.abort();
            }
        }
    };
});

/////////////

// From http://baagoe.com/en/RandomMusings/javascript/
function Mash() {
    var n = 0xefc8249d;

    var mash = function(data) {
        data = data.toString();
        for(var i = 0; i < data.length; i++) {
            n += data.charCodeAt(i);
            var h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000; // 2^32
        }
        return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = 'Mash 0.9';
    return mash;
}

function Kybos() {
    return (function(args) {
        // Johannes Baagøe <baagoe@baagoe.com>, 2010
        var s0 = 0;
        var s1 = 0;
        var s2 = 0;
        var c = 1;
        var s = [];
        var k = 0;

        var mash = Mash();
        var s0 = mash(' ');
        var s1 = mash(' ');
        var s2 = mash(' ');
        for(var j = 0; j < 8; j++) {
            s[j] = mash(' ');
        }

        if(args.length == 0) {
            args = [+new Date];
        }
        for(var i = 0; i < args.length; i++) {
            s0 -= mash(args[i]);
            if(s0 < 0) {
                s0 += 1;
            }
            s1 -= mash(args[i]);
            if(s1 < 0) {
                s1 += 1;
            }
            s2 -= mash(args[i]);
            if(s2 < 0) {
                s2 += 1;
            }
            for(var j = 0; j < 8; j++) {
                s[j] -= mash(args[i]);
                if(s[j] < 0) {
                    s[j] += 1;
                }
            }
        }

        var random = function() {
            var a = 2091639;
            k = s[k] * 8 | 0;
            var r = s[k];
            var t = a * s0 + c * 2.3283064365386963e-10; // 2^-32
            s0 = s1;
            s1 = s2;
            s2 = t - (c = t | 0);
            s[k] -= s2;
            if(s[k] < 0) {
                s[k] += 1;
            }
            return r;
        };
        random.uint32 = function() {
            return random() * 0x100000000; // 2^32
        };
        random.fract53 = function() {
            return random() + (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
        };
        random.addNoise = function() {
            for(var i = arguments.length - 1; i >= 0; i--) {
                for(j = 0; j < 8; j++) {
                    s[j] -= mash(arguments[i]);
                    if(s[j] < 0) {
                        s[j] += 1;
                    }
                }
            }
        };
        random.version = 'Kybos 0.9';
        random.args = args;
        return random;

    }(Array.prototype.slice.call(arguments)));
};

var gBaseRNG = new Kybos();
gBaseRNG.addNoise(Math.random(), document.documentElement.clientWidth, document.documentElement.clientHeight, window.screenX ? window.screenX : 0, window.screenY ? window.screenY : 0);

function JSFExt_AddRNGNoise(theNoise) {
    for(var i = arguments.length - 1; i >= 0; i--) {
        gBaseRNG.addNoise(arguments[i]);
    }
}

/////////////

var positionBuffer;
var positionArray;
var vertexIndex = 0;

var colorBuffer;
var colorArray;
var colorIndex = 0;

var normalBuffer;
var texCoords0Buffer;
var texCoords1Buffer;
var indexBuffer;

var gLastTime = new Date().getTime();
var gTimeAcc = 0;
var gColorAcc = 0.2;
var gTimeScale = 1.0;
var gCatchExceptions = true;

var gDeferredNewWidth;
var gDeferredNewHeight;

function JSFExt_Timer() {
    var aCurTime = new Date().getTime();
    gTimeAcc += (aCurTime - gLastTime) * gTimeScale;
    gLastTime = aCurTime;
    if(gTimeAcc >= 500) {
        gTimeAcc = 500;
    }
    if((gApp != null) && (!gApp.mExecutionStopped)) {
        var anItr = 0;
        var didUpdate = false;
        while(gTimeAcc >= gApp.mFrameTime) {
            if(gCatchExceptions) {
                try {
                    gApp.Update();
                } catch(e) {
                    gApp.HandleException(e);
                }
            } else {
                gApp.Update();
            }
            gTimeAcc -= gApp.mFrameTime;
            if(++anItr >= 50) {
                break;
            }
            didUpdate = true;
        }
        if((didUpdate) && (gDidJSFExtInit)) {
            if(gGL) {
                if(gDeferredNewWidth) {
                    gGL.viewport(0, 0, gDeferredNewWidth, gDeferredNewHeight);
                    gDeferredNewWidth = 0;
                    gDeferredNewHeight = 0;
                }

                if(gColorAcc > 0.5) {
                    gColorAcc = 0;
                }
                gGL.clearColor(0.0, 0.0, 0.1, 1.0);

                gGL.colorMask(1, 1, 1, 1); // Note the last '0' disables writing to dest-alpha
                gGL.clear(gGL.COLOR_BUFFER_BIT);
                gGL.colorMask(1, 1, 1, 0); // Note the last '0' disables writing to dest-alpha
                gLastTex = null;
            }
            gCTX = document.getElementById('GameCanvas').getContext('2d');
            if(gCatchExceptions) {
                try {
                    gApp.Draw();
                } catch(e) {
                    gApp.HandleException(e);
                }
            } else {
                gApp.Draw();
            }
            JSFExt_Flush();
            if(gGL) {
                gGL.colorMask(1, 1, 1, 1); // Note the last '0' disables writing to dest-alpha
                gGL.flush();
            }
        }
    }
    if(gWebKitAnimationCall) {
        gWebKitAnimationCall(JSFExt_Timer);
    }
}
window['JSFExt_Timer'] = JSFExt_Timer;

function JSFExt_OnKeyPress(e) {
    if(e.which) {
        gApp.mState.KeyChar(e.which);
    } else {
        gApp.mState.KeyChar(e.keyCode);
    }
}

function JSFExt_OnKeyDown(e) {
    gApp.mState.KeyDown(e.which);
    e = e || window.event;
    if(e.keyCode == 8) {
        return false;
    }
}

function JSFExt_OnKeyUp(e) {
    gApp.mState.KeyUp(e.which);
}

function JSFExt_FixCoords(e) {
    if(e.offsetX || e.offsetX == 0) {
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

var gCanvasHasTrans = false;
var gCanvasAdditive = false;
var gCanvasAlpha = 1.0;
var gCanvasAllowAdditive = true;

function JSFExt_CanvasDraw(img, alpha, additive, a, b, c, d, tx, ty, srcx, srcy, srcw, srch) {
    if(alpha == 0) {
        return;
    }

    var hasTrans = (b != 0) || (c != 0);
    if(gCanvasHasTrans != hasTrans) {
        if(!hasTrans) {
            gCTX.setTransform(1, 0, 0, 1, 0, 0);
            gCanvasHasTrans = false;
        }
    }
    if((gCanvasAdditive != additive) && (gCanvasAllowAdditive || !additive)) {
        gCTX.globalCompositeOperation = additive ? 'lighter' : 'source-over';
        gCanvasAdditive = additive;
    }
    if(alpha != gCanvasAlpha) {
        gCTX.globalAlpha = alpha;
        gCanvasAlpha = alpha;
    }
    if(hasTrans) {
        gCTX.setTransform(a, b, c, d, tx, ty);
        gCTX.drawImage(img, srcx, srcy, srcw, srch, 0, 0, srcw, srch);
        gCanvasHasTrans = true;
    } else {
        gCTX.drawImage(img, srcx, srcy, srcw, srch, tx, ty, srcw * a, srch * d);
    }
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if(!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while(k) {
        if(k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if(shaderScript.type == "x-shader/x-fragment") {
        shader = gGL.createShader(gGL.FRAGMENT_SHADER);
    } else if(shaderScript.type == "x-shader/x-vertex") {
        shader = gGL.createShader(gGL.VERTEX_SHADER);
    } else {
        return null;
    }

    gGL.shaderSource(shader, str);
    gGL.compileShader(shader);

    if(!gGL.getShaderParameter(shader, gGL.COMPILE_STATUS)) {
        throw new Error("Shader compilation error: " + gGL.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

var gDefault2DShaderProgram;
var gGlobalVertexShader;
var gWriteDepth = 1.0;
var shaderProgram;
var gWantShaderProgram;

function initShaders() {
    var fragmentShader = getShader(gGL, "shader-fs");
    var vertexShader = getShader(gGL, "shader-vs");
    gGlobalVertexShader = vertexShader;

    shaderProgram = gGL.createProgram();
    gGL.attachShader(shaderProgram, vertexShader);
    gGL.attachShader(shaderProgram, fragmentShader);
    gGL.linkProgram(shaderProgram);

    if(!gGL.getProgramParameter(shaderProgram, gGL.LINK_STATUS)) {
        throw new Error("Could not initialise shaders");
    }

    gGL.useProgram(shaderProgram);

    shaderProgram.positionAttribute = gGL.getAttribLocation(shaderProgram, "aPosition");
    gGL.enableVertexAttribArray(shaderProgram.positionAttribute);

    shaderProgram.colorAttribute = gGL.getAttribLocation(shaderProgram, "aVertexColor");
    gGL.enableVertexAttribArray(shaderProgram.colorAttribute);

    shaderProgram.samplerUniform = gGL.getUniformLocation(shaderProgram, "sTexture");

    shaderProgram.writeDepth = gGL.getUniformLocation(shaderProgram, "writeDepth");

    gDefault2DShaderProgram = shaderProgram;
    gWantShaderProgram = gDefault2DShaderProgram;
}

function JSFExt_CreateShaderProgram(theVertexShaderData, thePixelShaderData) {
    if(gGL == null) {
        return null;
    }

    var vertexShader;

    if(theVertexShaderData != null) {
        var vertexShader = gGL.createShader(gGL.VERTEX_SHADER);
        gGL.shaderSource(vertexShader, theVertexShaderData);
        gGL.compileShader(vertexShader);
        if(!gGL.getShaderParameter(vertexShader, gGL.COMPILE_STATUS)) {
            throw new Error("Vertex shader compilation error: " + gGL.getShaderInfoLog(vertexShader));
            return null;
        }
    } else {
        vertexShader = gGlobalVertexShader;
    }

    var pixelShader = gGL.createShader(gGL.FRAGMENT_SHADER);
    gGL.shaderSource(pixelShader, thePixelShaderData);
    gGL.compileShader(pixelShader);
    if(!gGL.getShaderParameter(pixelShader, gGL.COMPILE_STATUS)) {
        throw new Error("Pixel shader compilation error: " + gGL.getShaderInfoLog(pixelShader));
        return null;
    }

    var aShaderProgram = gGL.createProgram();
    gGL.attachShader(aShaderProgram, vertexShader);
    gGL.attachShader(aShaderProgram, pixelShader);
    gGL.linkProgram(aShaderProgram);

    if(!gGL.getProgramParameter(aShaderProgram, gGL.LINK_STATUS)) {
        throw new Error("Shader getProgramParameter error: " + gGL.getShaderInfoLog(aShaderProgram));
    }

    aShaderProgram.positionAttribute = gGL.getAttribLocation(aShaderProgram, "position");
    aShaderProgram.colorAttribute = gGL.getAttribLocation(aShaderProgram, "color");
    aShaderProgram.normalAttribute = gGL.getAttribLocation(aShaderProgram, "normal");
    aShaderProgram.texcoord0Attribute = gGL.getAttribLocation(aShaderProgram, "texcoord0");
    aShaderProgram.texcoord1Attribute = gGL.getAttribLocation(aShaderProgram, "texcoord1");
    aShaderProgram.worldAttribute = gGL.getUniformLocation(aShaderProgram, "world");
    aShaderProgram.viewAttribute = gGL.getUniformLocation(aShaderProgram, "view");
    aShaderProgram.projectionAttribute = gGL.getUniformLocation(aShaderProgram, "projection");
    aShaderProgram.worldViewProjAttribute = gGL.getUniformLocation(aShaderProgram, "worldViewProj");
    aShaderProgram.Tex0Attribute = gGL.getUniformLocation(aShaderProgram, "Tex0");
    aShaderProgram.Tex1Attribute = gGL.getUniformLocation(aShaderProgram, "Tex1");

    return aShaderProgram;
}

function GetGLBlendType(theBlend, theDefault) {
    if(theBlend == GameFramework.gfx.Graphics3D.EBlend.Default) {
        return theDefault;
    }

    if(theBlend == GameFramework.gfx.Graphics3D.EBlend.Zero) {
        return gGL.ZERO;
    }
    if(theBlend == GameFramework.gfx.Graphics3D.EBlend.One) {
        return gGL.ONE;
    }
    if(theBlend == GameFramework.gfx.Graphics3D.EBlend.SrcColor) {
        return gGL.SRC_COLOR;
    }
    if(theBlend == GameFramework.gfx.Graphics3D.EBlend.InvSrcColor) {
        return gGL.ONE_MINUS_SRC_COLOR;
    }
    if(theBlend == GameFramework.gfx.Graphics3D.EBlend.SrcAlpha) {
        return gGL.SRC_ALPHA;
    }
    if(theBlend == GameFramework.gfx.Graphics3D.EBlend.InvSrcAlpha) {
        return gGL.ONE_MINUS_SRC_ALPHA;
    }
    if(theBlend == GameFramework.gfx.Graphics3D.EBlend.DestAlpha) {
        return gGL.DST_ALPHA;
    }
    if(theBlend == GameFramework.gfx.Graphics3D.EBlend.InvDestAlpha) {
        return gGL.ONE_MINUS_DST_ALPHA;
    }
    if(theBlend == GameFramework.gfx.Graphics3D.EBlend.DestColor) {
        return gGL.DST_COLOR;
    }
    if(theBlend == GameFramework.gfx.Graphics3D.EBlend.InvDestColor) {
        return gGL.ONE_MINUS_DST_COLOR;
    }
    if(theBlend == GameFramework.gfx.Graphics3D.EBlend.SrcAlphaSat) {
        return gGL.SRC_ALPHA_SATURATE;
    }
}

function JSFXExt_Setup2DDrawing(theDrawDepth) {
    gWriteDepth = theDrawDepth;
    gWantShaderProgram = gDefault2DShaderProgram;
    gLastTex = false; // Force change
}

function JSFXExt_End2DDrawing() {
    JSFExt_Flush();
}

function JSFExt_SetBlend(theSrcBlend, theDestBlend) {
    theSrcBlend = GetGLBlendType(theSrcBlend, gGL.SRC_ALPHA);
    theDestBlend = GetGLBlendType(theDestBlend, gGL.ONE_MINUS_SRC_ALPHA);
    if((theSrcBlend == gGL.SRC_ALPHA) && (theDestBlend == gGL.ONE_MINUS_SRC_ALPHA)) {
        gAdditive = false;
    } else if((theSrcBlend == gGL.SRC_ALPHA) && (theDestBlend == gGL.ONE)) {
        gAdditive = true;
    } else {
        gAdditive = undefined;
    }
    gGL.blendFunc(theSrcBlend, theDestBlend);
}

function JSFExt_SetGLProgram(theProgram) {
    gWantShaderProgram = theProgram;
}

function JSFExt_Begin3DScene(theProgram) {
    JSFExt_Flush();
}

function JSFExt_End3DScene(theProgram) {
    gGL.activeTexture(gGL.TEXTURE0);
    gGL.blendFunc(gGL.SRC_ALPHA, gGL.ONE_MINUS_SRC_ALPHA);
    gGL.disable(gGL.CULL_FACE);
    gGL.disable(gGL.DEPTH_TEST);
    gAdditive = false;
    gLastTex = false; // Force change
    gWriteDepth = 1.0;
    gGL.disableVertexAttribArray(2);
    gGL.disableVertexAttribArray(3);
    gGL.disableVertexAttribArray(4);
}

function JSFExt_SetupMesh(theMesh) {
    if(gGL == null) {
        return;
    }

    for(var aPieceIdx = 0; aPieceIdx < theMesh.mPieces.length; aPieceIdx++) {
        var aMeshPiece = theMesh.mPieces[aPieceIdx];

        if((aMeshPiece.mSexyVF & 0x002 /*SexyVF_XYZ*/) != 0) {
            aMeshPiece.mXYZArray = new Float32Array(aMeshPiece.mVertexBufferCount * 3);
        }
        if((aMeshPiece.mSexyVF & 0x010 /*SexyVF_Normal*/) != 0) {
            aMeshPiece.mNormalArray = new Float32Array(aMeshPiece.mVertexBufferCount * 3);
        }
        if((aMeshPiece.mSexyVF & 0x040 /*SexyVF_Diffuse*/) != 0) {
            aMeshPiece.mColorArray = new Float32Array(aMeshPiece.mVertexBufferCount * 4);
        }
        if((aMeshPiece.mSexyVF & 0x200 /*SexyVF_Tex2*/) != 0) {
            aMeshPiece.mTexCoords0Array = new Float32Array(aMeshPiece.mVertexBufferCount * 2);
            aMeshPiece.mTexCoords1Array = new Float32Array(aMeshPiece.mVertexBufferCount * 2);
        } else if((aMeshPiece.mSexyVF & 0x100 /*SexyVF_Tex1*/) != 0) {
            aMeshPiece.mTexCoords0Array = new Float32Array(aMeshPiece.mVertexBufferCount * 2);
        }
        //;

        for(var anIdx = 0; anIdx < aMeshPiece.mVertexBufferCount; anIdx++) {
            if(aMeshPiece.mXYZArray != null) {
                aMeshPiece.mXYZArray[anIdx * 3 + 0] = aMeshPiece.mVertexData.ReadFloat();
                aMeshPiece.mXYZArray[anIdx * 3 + 1] = aMeshPiece.mVertexData.ReadFloat();
                aMeshPiece.mXYZArray[anIdx * 3 + 2] = aMeshPiece.mVertexData.ReadFloat();
            }

            if(aMeshPiece.mNormalArray != null) {
                aMeshPiece.mNormalArray[anIdx * 3 + 0] = aMeshPiece.mVertexData.ReadFloat();
                aMeshPiece.mNormalArray[anIdx * 3 + 1] = aMeshPiece.mVertexData.ReadFloat();
                aMeshPiece.mNormalArray[anIdx * 3 + 2] = aMeshPiece.mVertexData.ReadFloat();
            }

            if(aMeshPiece.mColorArray != null) {
                aMeshPiece.mColorArray[anIdx * 4 + 0] = aMeshPiece.mVertexData.ReadByte() / 255.0;
                aMeshPiece.mColorArray[anIdx * 4 + 1] = aMeshPiece.mVertexData.ReadByte() / 255.0;
                aMeshPiece.mColorArray[anIdx * 4 + 2] = aMeshPiece.mVertexData.ReadByte() / 255.0;
                aMeshPiece.mColorArray[anIdx * 4 + 3] = aMeshPiece.mVertexData.ReadByte() / 255.0;
            }

            if(aMeshPiece.mTexCoords0Array != null) {
                aMeshPiece.mTexCoords0Array[anIdx * 2 + 0] = aMeshPiece.mVertexData.ReadFloat();
                aMeshPiece.mTexCoords0Array[anIdx * 2 + 1] = aMeshPiece.mVertexData.ReadFloat();
            }

            if(aMeshPiece.mTexCoords1Array != null) {
                aMeshPiece.mTexCoords1Array[anIdx * 2 + 0] = aMeshPiece.mVertexData.ReadFloat();
                aMeshPiece.mTexCoords1Array[anIdx * 2 + 1] = aMeshPiece.mVertexData.ReadFloat();
            }
        }

        if(aMeshPiece.mXYZArray != null) {
            aMeshPiece.mXYZAttribArray = gGL.createBuffer();
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mXYZAttribArray);
            gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mXYZArray, gGL.STATIC_DRAW);
        }

        if(aMeshPiece.mColorArray != null) {
            aMeshPiece.mColorAttribArray = gGL.createBuffer();
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mColorAttribArray);
            gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mColorArray, gGL.STATIC_DRAW);
        }

        if(aMeshPiece.mNormalArray != null) {
            aMeshPiece.mNormalAttribArray = gGL.createBuffer();
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mNormalAttribArray);
            gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mNormalArray, gGL.STATIC_DRAW);
        }

        if(aMeshPiece.mTexCoords0Array != null) {
            aMeshPiece.mTexCoords0AttribArray = gGL.createBuffer();
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords0AttribArray);
            gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords0Array, gGL.STATIC_DRAW);
        }

        if(aMeshPiece.mTexCoords1Array != null) {
            aMeshPiece.mTexCoords1AttribArray = gGL.createBuffer();
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords1AttribArray);
            gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords1Array, gGL.STATIC_DRAW);
        }

        aMeshPiece.mIndexBuffer = new Uint16Array(aMeshPiece.mIndexBufferCount);
        for(var anIdx = 0; anIdx < aMeshPiece.mIndexBufferCount; anIdx++) {
            aMeshPiece.mIndexBuffer[anIdx] = aMeshPiece.mIndexData.ReadShort();
        }

        aMeshPiece.mIndexAttribArray = gGL.createBuffer();
        gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, aMeshPiece.mIndexAttribArray);
        gGL.bufferData(gGL.ELEMENT_ARRAY_BUFFER, aMeshPiece.mIndexBuffer, gGL.STATIC_DRAW);
    }
}

// activate current shader program and enable all default attributes
function JSFExt_ActivateShader() {
    if(gWantShaderProgram != shaderProgram) {
        shaderProgram = gWantShaderProgram;
        gGL.useProgram(shaderProgram);

        if(shaderProgram.positionAttribute != -1) {
            gGL.enableVertexAttribArray(shaderProgram.positionAttribute);
        }
        if(shaderProgram.colorAttribute != -1) {
            gGL.enableVertexAttribArray(shaderProgram.colorAttribute);
        }
        if(shaderProgram.normalAttribute != -1) {
            gGL.enableVertexAttribArray(shaderProgram.normalAttribute);
        }
        if(shaderProgram.texcoord0Attribute != -1) {
            gGL.enableVertexAttribArray(shaderProgram.texcoord0Attribute);
        }
        if(shaderProgram.texcoord1Attribute != -1) {
            gGL.enableVertexAttribArray(shaderProgram.texcoord1Attribute);
        }
    }
}

function JSFExt_GetUniformLocation(theName) {
    JSFExt_ActivateShader();
    if(shaderProgram[theName] !== undefined) {
        return shaderProgram[theName];
    }
    shaderProgram[theName] = gGL.getUniformLocation(shaderProgram, theName);
}

function JSFExt_SetShaderUniform1f(theName, val1) {
    var aUniform = JSFExt_GetUniformLocation(theName);
    if(aUniform != null) {
        gGL.uniform4f(aUniform, val1, 0, 0, 0);
    }
}

function JSFExt_SetShaderUniform3f(theName, val1, val2, val3) {
    var aUniform = JSFExt_GetUniformLocation(theName);
    if(aUniform != null) {
        gGL.uniform4f(aUniform, val1, val2, val3, 1);
    }
}

function JSFExt_SetShaderUniform4f(theName, val1, val2, val3, val4) {
    var aUniform = JSFExt_GetUniformLocation(theName);
    if(aUniform != null) {
        gGL.uniform4f(aUniform, val1, val2, val3, val4);
    }
}

function JSFExt_SetShaderUniform4fv(theName, val) {
    var aUniform = JSFExt_GetUniformLocation(theName);
    if(aUniform != null) {
        gGL.uniform4fv(aUniform, false, new Float32Array(val));
    }
}

// render a 3d mesh with current shader program
function JSFXExt_RenderMesh(theGraphics3D, theMesh, theWorldMatrix, theViewMatrix, theProjMatrix) {
    // enable shader
    JSFExt_ActivateShader();

    // matrix
    if(shaderProgram.worldAttribute != null) {
        gGL.uniformMatrix4fv(shaderProgram.worldAttribute, false, theWorldMatrix.m);
    }
    if(shaderProgram.viewAttribute != null) {
        gGL.uniformMatrix4fv(shaderProgram.viewAttribute, false, theViewMatrix.m);
    }
    if(shaderProgram.viewAttribute != null) {
        gGL.uniformMatrix4fv(shaderProgram.projectionAttribute, false, theProjMatrix.m);
    }
    if(shaderProgram.worldViewProjAttribute != null) {
        var aWorldViewProjMatrix = new GameFramework.geom.Matrix3D();
        aWorldViewProjMatrix.CopyFrom(theProjMatrix);
        aWorldViewProjMatrix.Append(theViewMatrix);
        aWorldViewProjMatrix.Append(theWorldMatrix);
        gGL.uniformMatrix4fv(shaderProgram.worldViewProjAttribute, false, aWorldViewProjMatrix.m);
    }

    // tex
    if(shaderProgram.Tex0Attribute != null) {
        gGL.uniform1i(shaderProgram.Tex0Attribute, 0);
    }
    if(shaderProgram.Tex1Attribute != null) {
        gGL.uniform1i(shaderProgram.Tex1Attribute, 1);
    }

    // render every piece
    for(var aPieceIdx = 0; aPieceIdx < theMesh.mPieces.length; aPieceIdx++) {
        var aMeshPiece = theMesh.mPieces[aPieceIdx];

        theGraphics3D.SetTexture(0, aMeshPiece.mImage);

        var anEvent = new GameFramework.resources.popanim.PopAnimEvent(GameFramework.resources.MeshEvent.PREDRAW_SET);
        theMesh.DispatchEvent(anEvent);

        if(aMeshPiece.mXYZArray != null) {
            //gGL.enableVertexAttribArray(shaderProgram.positionAttribute);

            //gGL.bindBuffer(gGL.ARRAY_BUFFER, positionBuffer);
            //gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mXYZArray, gGL.STATIC_DRAW);
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mXYZAttribArray);
            gGL.vertexAttribPointer(shaderProgram.positionAttribute, 3, gGL.FLOAT, false, 0, 0);
        }

        if(aMeshPiece.mColorArray != null) {
            //gGL.enableVertexAttribArray(shaderProgram.colorAttribute);

            //gGL.bindBuffer(gGL.ARRAY_BUFFER, colorBuffer);
            //gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mColorArray, gGL.STATIC_DRAW);
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mColorAttribArray);
            gGL.vertexAttribPointer(shaderProgram.colorAttribute, 4, gGL.FLOAT, false, 0, 0);
        }

        if(aMeshPiece.mNormalArray != null) {
            //gGL.enableVertexAttribArray(shaderProgram.normalAttribute);
            //gGL.bindBuffer(gGL.ARRAY_BUFFER, normalBuffer);
            //gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mNormalArray, gGL.STATIC_DRAW);
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mNormalAttribArray);
            gGL.vertexAttribPointer(shaderProgram.normalAttribute, 3, gGL.FLOAT, false, 0, 0);
        }

        if(aMeshPiece.mTexCoords0Array != null) {
            //gGL.enableVertexAttribArray(shaderProgram.texcoord0Attribute);
            //gGL.bindBuffer(gGL.ARRAY_BUFFER, texCoords0Buffer);
            //gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords0Array, gGL.STATIC_DRAW);
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords0AttribArray);
            gGL.vertexAttribPointer(shaderProgram.texcoord0Attribute, 2, gGL.FLOAT, false, 0, 0);
        }

        if(aMeshPiece.mTexCoords1Array != null) {
            //gGL.enableVertexAttribArray(shaderProgram.texcoord1Attribute);
            //gGL.bindBuffer(gGL.ARRAY_BUFFER, texCoords1Buffer);
            //gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords1Array, gGL.STATIC_DRAW);
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords1AttribArray);
            gGL.vertexAttribPointer(shaderProgram.texcoord1Attribute, 2, gGL.FLOAT, false, 0, 0);
        }

        gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, aMeshPiece.mIndexAttribArray);
        //gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, indexBuffer);
        //gGL.bufferData(gGL.ELEMENT_ARRAY_BUFFER, aMeshPiece.mIndexBuffer, gGL.STATIC_DRAW);
        gGL.drawElements(gGL.TRIANGLES, aMeshPiece.mIndexBufferCount, gGL.UNSIGNED_SHORT, 0);

        // trigger a post draw event
        anEvent = new GameFramework.resources.popanim.PopAnimEvent(GameFramework.resources.MeshEvent.POSTDRAW_SET);
        theMesh.DispatchEvent(anEvent);
    }
}

// populate a quad vertex and color
// the tex coordinates are saved in zw components of vertex buffer
function drawQuadAt(x, y, a, b, c, d, src_x, src_y, src_w, src_h, stripW, stripH, color) {
    var tex_x = src_x / stripW;
    var tex_y = src_y / stripH;
    var tex_w = src_w / stripW;
    var tex_h = src_h / stripH;

    //1
    positionArray[vertexIndex++] = (x + c * (src_h)) / gApp.mPhysWidth; //x / gApp.mWidth;
    positionArray[vertexIndex++] = (y + d * (src_h)) / gApp.mPhysHeight; // (y + src_h) / gApp.mHeight;
    positionArray[vertexIndex++] = tex_x;
    positionArray[vertexIndex++] = tex_y + tex_h;

    //2
    positionArray[vertexIndex++] = (x) / gApp.mPhysWidth;
    positionArray[vertexIndex++] = (y) / gApp.mPhysHeight;
    positionArray[vertexIndex++] = tex_x;
    positionArray[vertexIndex++] = tex_y;

    //3
    positionArray[vertexIndex++] = (x + a * (src_w) + c * (src_h)) / gApp.mPhysWidth//(x + src_w) / gApp.mWidth;
    positionArray[vertexIndex++] = (y + b * (src_w) + d * (src_h)) / gApp.mPhysHeight; //(y + src_h) / gApp.mHeight;
    positionArray[vertexIndex++] = (tex_x + tex_w);
    positionArray[vertexIndex++] = tex_y + tex_h;

    //2
    positionArray[vertexIndex++] = (x) / gApp.mPhysWidth;
    positionArray[vertexIndex++] = (y) / gApp.mPhysHeight;
    positionArray[vertexIndex++] = tex_x;
    positionArray[vertexIndex++] = tex_y;

    //3
    positionArray[vertexIndex++] = (x + a * (src_w) + c * (src_h)) / gApp.mPhysWidth//(x + src_w) / gApp.mWidth;
    positionArray[vertexIndex++] = (y + b * (src_w) + d * (src_h)) / gApp.mPhysHeight; //(y + src_h) / gApp.mHeight;
    positionArray[vertexIndex++] = (tex_x + tex_w);
    positionArray[vertexIndex++] = tex_y + tex_h;

    //4
    positionArray[vertexIndex++] = (x + a * (src_w)) / gApp.mPhysWidth; //(x + src_w) / gApp.mWidth;
    positionArray[vertexIndex++] = (y + b * (src_w)) / gApp.mPhysHeight; //y / gApp.mHeight;
    positionArray[vertexIndex++] = (tex_x + tex_w);
    positionArray[vertexIndex++] = tex_y;

    for(i = 0; i < 6; i++) {
        colorArray[colorIndex++] = color[0];
        colorArray[colorIndex++] = color[1];
        colorArray[colorIndex++] = color[2];
        colorArray[colorIndex++] = color[3];
    }
}

// last tex and last depth used
var gLastTex;
var gLastWriteDepth;

// it flush current buffer to screen
function JSFExt_Flush() {
    if((vertexIndex > 0) && (positionBuffer != undefined)) {
        // ensure shader is used
        if(gWantShaderProgram != shaderProgram) {
            shaderProgram = gWantShaderProgram;
            gGL.useProgram(shaderProgram);
        }

        // bind vertex buffer
        gGL.bindBuffer(gGL.ARRAY_BUFFER, positionBuffer);
        gGL.bufferData(gGL.ARRAY_BUFFER, positionArray, gGL.STREAM_DRAW);
        positionBuffer.itemSize = 4;
        positionBuffer.numItems = vertexIndex / 4;
        gGL.vertexAttribPointer(shaderProgram.positionAttribute, positionBuffer.itemSize, gGL.FLOAT, false, 0, 0);

        // bind color buffer
        gGL.bindBuffer(gGL.ARRAY_BUFFER, colorBuffer);
        gGL.bufferData(gGL.ARRAY_BUFFER, colorArray, gGL.STREAM_DRAW);
        colorBuffer.itemSize = 4;
        colorBuffer.numItems = colorIndex / 4;
        gGL.vertexAttribPointer(shaderProgram.colorAttribute, colorBuffer.itemSize, gGL.FLOAT, false, 0, 0);

        // ensure write depth is correct
        if(gWriteDepth != gLastWriteDepth) {
            gGL.uniform1f(shaderProgram.writeDepth, gWriteDepth);
            gLastWriteDepth = gWriteDepth;
        }

        // draw and clear counter
        gGL.drawArrays(gGL.TRIANGLES, 0, positionBuffer.numItems);
        vertexIndex = 0;
        colorIndex = 0;
    }
}

// current additive mode
var gAdditive;

// fill buffer for one texture, if buffer has many data, the buffer may be flushed
// if texture to be drawn is different with current texture, buffer will be flushed
// theX, theY, a, b, c, d are matrix values
function JSFExt_GLDraw(theTex, theX, theY, a, b, c, d, theSrcX, theSrcY, theSrcW, theSrcH, theImgW, theImgH, isAdditive, color) {
    // if buffer is large, flush
    if(vertexIndex > 1000) {
        JSFExt_Flush();
    }

    // if tex or additive is different with current, flush and set
    if((gLastTex != theTex) || (gAdditive != isAdditive)) {
        JSFExt_Flush();
        gGL.bindTexture(gGL.TEXTURE_2D, theTex);
        gLastTex = theTex;
    }

    // ensure additive is correct
    if(gAdditive != isAdditive) {
        gGL.blendFunc(gGL.SRC_ALPHA, isAdditive ? gGL.ONE : gGL.ONE_MINUS_SRC_ALPHA);
        gAdditive = isAdditive;
    }

    // fill quad
    drawQuadAt(theX, theY, a, b, c, d, theSrcX, theSrcY, theSrcW, theSrcH, theImgW, theImgH,
        [((color >> 16) & 0xFF) / 255.0, ((color >> 8) & 0xFF) / 255.0, ((color) & 0xFF) / 255.0, ((color >> 24) & 0xFF) / 255.0]);
}

// draw a triangle shape
function JSFExt_GLDrawTri(theTex, theX1, theY1, theX2, theY2, theX3, theY3, isAdditive, color) {
    // if buffer is large, flush
    if(vertexIndex > 1000) {
        JSFExt_Flush();
    }

    // if tex or additive is different with current, flush and set
    if((gLastTex != theTex) || (gAdditive != isAdditive)) {
        JSFExt_Flush();
        gGL.bindTexture(gGL.TEXTURE_2D, theTex);
        gLastTex = theTex;
    }

    // ensure additive is correct
    if(gAdditive != isAdditive) {
        gGL.blendFunc(gGL.SRC_ALPHA, isAdditive ? gGL.ONE : gGL.ONE_MINUS_SRC_ALPHA);
        gAdditive = isAdditive;
    }

    // color in array format
    var aColor = [((color >> 16) & 0xFF) / 255.0, ((color >> 8) & 0xFF) / 255.0, ((color) & 0xFF) / 255.0, ((color >> 24) & 0xFF) / 255.0];

    // 1
    positionArray[vertexIndex++] = theX1 / gApp.mPhysWidth;
    positionArray[vertexIndex++] = theY1 / gApp.mPhysHeight;
    positionArray[vertexIndex++] = 0;
    positionArray[vertexIndex++] = 0;

    // 2
    positionArray[vertexIndex++] = theX2 / gApp.mPhysWidth;
    positionArray[vertexIndex++] = theY2 / gApp.mPhysHeight;
    positionArray[vertexIndex++] = 0;
    positionArray[vertexIndex++] = 0;

    // 3
    positionArray[vertexIndex++] = theX3 / gApp.mPhysWidth;
    positionArray[vertexIndex++] = theY3 / gApp.mPhysHeight;
    positionArray[vertexIndex++] = 0;
    positionArray[vertexIndex++] = 0;

    // color
    for(i = 0; i < 3; i++) {
        colorArray[colorIndex++] = aColor[0];
        colorArray[colorIndex++] = aColor[1];
        colorArray[colorIndex++] = aColor[2];
        colorArray[colorIndex++] = aColor[3];
    }
}

// draw a triangle but with texture
function JSFExt_GLDrawTriTex(theTex, theX1, theY1, theU1, theV1, theColor1, theX2, theY2, theU2, theV2, theColor2, theX3, theY3, theU3, theV3, theColor3, isAdditive) {
    // if buffer is large, flush
    if(vertexIndex > 1000) {
        JSFExt_Flush();
    }

    // if tex or additive is different with current, flush and set
    if((gLastTex != theTex) || (gAdditive != isAdditive)) {
        JSFExt_Flush();
        gGL.bindTexture(gGL.TEXTURE_2D, theTex);
        gLastTex = theTex;
    }

    // ensure additive is correct
    if(gAdditive != isAdditive) {
        gGL.blendFunc(gGL.SRC_ALPHA, isAdditive ? gGL.ONE : gGL.ONE_MINUS_SRC_ALPHA);
        gAdditive = isAdditive;
    }

    // color in array format
    var aColor1 = [((theColor1 >> 16) & 0xFF) / 255.0, ((theColor1 >> 8) & 0xFF) / 255.0, ((theColor1) & 0xFF) / 255.0, ((theColor1 >> 24) & 0xFF) / 255.0];
    var aColor2 = (theColor2 == theColor1) ? aColor1 : [((theColor2 >> 16) & 0xFF) / 255.0, ((theColor2 >> 8) & 0xFF) / 255.0, ((theColor2) & 0xFF) / 255.0, ((theColor2 >> 24) & 0xFF) / 255.0];
    var aColor3 = (theColor3 == theColor1) ? aColor1 : [((theColor3 >> 16) & 0xFF) / 255.0, ((theColor3 >> 8) & 0xFF) / 255.0, ((theColor3) & 0xFF) / 255.0, ((theColor3 >> 24) & 0xFF) / 255.0];

    // 1
    positionArray[vertexIndex++] = theX1 / gApp.mPhysWidth;
    positionArray[vertexIndex++] = theY1 / gApp.mPhysHeight;
    positionArray[vertexIndex++] = theU1;
    positionArray[vertexIndex++] = theV1;

    // 2
    positionArray[vertexIndex++] = theX2 / gApp.mPhysWidth;
    positionArray[vertexIndex++] = theY2 / gApp.mPhysHeight;
    positionArray[vertexIndex++] = theU2;
    positionArray[vertexIndex++] = theV2;

    // 3
    positionArray[vertexIndex++] = theX3 / gApp.mPhysWidth;
    positionArray[vertexIndex++] = theY3 / gApp.mPhysHeight;
    positionArray[vertexIndex++] = theU3;
    positionArray[vertexIndex++] = theV3;

    // color 1
    colorArray[colorIndex++] = aColor1[0];
    colorArray[colorIndex++] = aColor1[1];
    colorArray[colorIndex++] = aColor1[2];
    colorArray[colorIndex++] = aColor1[3];

    // color 2
    colorArray[colorIndex++] = aColor2[0];
    colorArray[colorIndex++] = aColor2[1];
    colorArray[colorIndex++] = aColor2[2];
    colorArray[colorIndex++] = aColor2[3];

    // color 3
    colorArray[colorIndex++] = aColor3[0];
    colorArray[colorIndex++] = aColor3[1];
    colorArray[colorIndex++] = aColor3[2];
    colorArray[colorIndex++] = aColor3[3];
}

// global canvas reference
var gCanvas = null;

// reload page
function JSFExt_Reload() {
    window.location.reload();
}

// reload page
function JSFExt_Reinit() {
    window.location.href = window.location.href;
}

// pause game when page is not visible
function JSFExt_OnVisibilityChange() {
    if(document['webkitHidden']) {
        gApp.SetBackgrounded(true);
    } else {
        gApp.SetBackgrounded(false);
    }
}

// the flag indicating JSFExt_Init is called
var gDidJSFExtInit = false;

// global init for html5 environment
function JSFExt_Init(theApp, theCanvas) {
    // global reference of app and canvas
    gApp = theApp;
    gCanvas = theCanvas;

    // get webgl context if using webgl
    if(theApp.mUseGL) {
        var gl_attribs = {
            alpha : true,
            depth : true,
            stencil : false,
            antialias : false,
            premultipliedAlpha : false
        };

        try {
            gGL = theCanvas.getContext("experimental-webgl", gl_attribs);
            theCanvas.addEventListener("webglcontextlost", function(event) {
                JSFExt_Reinit();
            }, false);
            theCanvas.addEventListener("webglcontextrestored", JSFExt_Reinit, false);
        } catch(e) {
        }
        if(gGL == null) {
            theApp.mUseGL = false;
        }
    }

    // init gl state if using webgl
    if(theApp.mUseGL) {
        gGL.viewportWidth = theCanvas.width;
        gGL.viewportHeight = theCanvas.height;

        gGL.clearColor(0.0, 0.5, 0.0, 1.0);
        gGL.enable(gGL.BLEND);

        gGL.activeTexture(gGL.TEXTURE0);

        positionBuffer = gGL.createBuffer();
        positionArray = new Float32Array(1024 * 4);

        colorBuffer = gGL.createBuffer();
        colorArray = new Float32Array(1024 * 4);

        normalBuffer = gGL.createBuffer();
        texCoords0Buffer = gGL.createBuffer();
        texCoords1Buffer = gGL.createBuffer();
        indexBuffer = gGL.createBuffer();

        initShaders();
        gGL.uniform1i(shaderProgram.samplerUniform, 0);
        gGL.blendFunc(gGL.SRC_ALPHA, gGL.ONE_MINUS_SRC_ALPHA);

        var aWhitePixels = new Uint8Array([255, 255, 255, 255]);
        gWhiteDotTex = CreateGLTexPixels(1, 1, aWhitePixels);
    }

    // install event handlers
    document.onkeypress = JSFExt_OnKeyPress;
    document.onkeydown = JSFExt_OnKeyDown;
    document.onkeyup = JSFExt_OnKeyUp;
    theCanvas.addEventListener('mousedown', JSFExt_OnMouseDown, false);
    theCanvas.addEventListener('mouseup', JSFExt_OnMouseUp, false);
    theCanvas.addEventListener('mousemove', JSFExt_OnMouseMove, false);
    document.addEventListener("webkitvisibilitychange", JSFExt_OnVisibilityChange, false);
    window.addEventListener('touchmove', function(event) {
        event.preventDefault();
        JSFExt_OnMouseMove(event);
    }, false);
    window.addEventListener('touchstart', function(event) {
        event.preventDefault();
        JSFExt_OnMouseDown(event);
    }, false);
    window.addEventListener('touchend', function(event) {
        event.preventDefault();
        JSFExt_OnMouseUp(event);
    }, false);

    // set flag
    gDidJSFExtInit = true;
}
window['JSFExt_Init'] = JSFExt_Init;

var gSoundManagerReady = false;

function JSFExt_AudioSetVolume(theSound, theVolume) {
    theSound.setVolume(theVolume * 100);
}

function JSFExt_SoundManagerReady() {
    gSoundManagerReady = true;
}
window['JSFExt_SoundManagerReady'] = JSFExt_SoundManagerReady;

function JSFExt_SoundLoaded(theId, theStreamer) {
    gApp.ResourceStreamerCompletedCallback(theId, theStreamer);
}

function JSFExt_SoundError() {
    gApp.HandleException(new Error("SoundManager2 error"));
}
window['JSFExt_SoundError'] = JSFExt_SoundError;

function JSFExt_LoadAudio(theStreamer, thePath) {
    //if (aSoundCount > 2)
    //  return;

    if(!soundManager.ok()) {
        // Fake success
        gApp.ResourceStreamerCompletedCallback(anId, theStreamer);
        return;
    }

    var anId = theStreamer.mId;

    if(!soundManager.preferFlash) {
        var aSound = soundManager.createSound({ id : anId, url : thePath, autoLoad : true, multiShot : true });
        JSFExt_SoundLoaded(anId, theStreamer);
    } else {
        var aSound = soundManager.createSound({ id : anId, url : thePath, autoLoad : true, multiShot : true, onload : function() {
            JSFExt_SoundLoaded(anId, theStreamer)
        }
        });
    }
    return aSound;
}

function JSFExt_LoadAudio2(theStreamer, thePath) {
    var anAudio = new Audio(thePath);
    //anAudio.onload = function () { alert("Loaded: " + thePath);  gApp.ResourceStreamerCompletedCallback(anAudio, theStreamer); }
    anAudio.load();
    //anAudio.play();
    gApp.ResourceStreamerCompletedCallback(anAudio, theStreamer);
    return anAudio;
}

var gGlobalVolume = 1.0;

function JSFExt_PlayAudio(s, vol, pan, looping, numSamples) {
    if(s == null) {
        return;
    }
    var aSound = soundManager.getSoundById(s);
    //if (!aSound)
    //  return null;
    if(!aSound) {
        aSound = s;
    }
    var aSettings = { volume : (gGlobalVolume * vol * 100), pan : pan * 100, numSamples : numSamples };
    if(looping) {
        aSettings['loops'] = 3;
    }
    aSound.play(aSettings);
    return aSound;
}

function JSFExt_StopAudio(sound) {
    if(sound) {
        sound.stop();
    }
}

function JSFExt_PlayAudio2(s) {
    if(s == null) {
        return;
    }

    for(a = 0; a < audiochannels.length; a++) {
        thistime = new Date();
        if(audiochannels[a]['finished'] < thistime.getTime()) {			// is this channel finished?
            audiochannels[a]['finished'] = thistime.getTime() + s.duration * 1000;
            //audiochannels[a]['channel'] = s.cloneNode(true);
            audiochannels[a]['channel'].src = s.src;
            audiochannels[a]['channel'].load();

            audiochannels[a]['channel'].play();
            break;
        }
    }
}

function JS_AssertException(message) {
    this.message = message;
}
JS_AssertException.prototype.toString = function() {
    return 'AssertException: ' + this.message;
}

function JS_Assert(exp, message) {
    if(!exp) {
        if(message == null) {
            message = "Assertion failed";
        }
        var anException = new JS_AssertException(message);
        anException.stackStr = arguments.callee.caller.name;
        throw anException;
    }
}

var gInitFunc = [];
var gStaticInitFunc = [];

function JS_AddInitFunc(theFunc) {
    gInitFunc[gInitFunc.length] = theFunc;
}

function JS_AddStaticInitFunc(theFunc) {
    gStaticInitFunc[gStaticInitFunc.length] = theFunc;
}

function JS_Init() {
    for(var i = 0; i < gInitFunc.length; i++) {
        gInitFunc[i]();
    }
    for(var i = 0; i < gStaticInitFunc.length; i++) {
        gStaticInitFunc[i]();
    }
}
window['JS_Init'] = JS_Init;

function JS_SpliceArray(anArray, startIndex, deleteCount) {
    anArray.removeRange(startIndex, deleteCount);
    for(var i = 3; i < arguments.length; i++) {
        anArray.insert(startIndex + i - 3, arguments[i]);
    }
}

//////////////////////////////////////////////////////

Type.registerNamespace('System');
System.IDisposable = function System_IDisposable() {
}