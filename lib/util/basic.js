/**
 * Created by WQ on 2015/5/29.
 *
 * 提供基础的工具
 *
 */


(function () {

    // 如果引用debug.js的话会覆盖这个函数，上传的时候可以不必删掉代码中的remote.log
    window.remote = {
        log : function () {
        }
    };

    function loopArray( arr, func ) {
        for ( var i = 0; i < arr.length; i++ ) {
            func( arr[i], i );
        }
    }

    Node.prototype.remove = function () {
        var node = this;
        if ( node.parentNode ) {
            node.parentNode.removeChild( node );
        }
    };

    Node.prototype.bindEvent = function ( type, listener, useCapture ) {
        var el = this;
        el.addEventListener( type, listener, useCapture || false );
        return {
            remove : function () {
                el.removeEventListener( type, listener, useCapture || false );
            }
        }
    };

    Node.prototype.transform = function ( x, y, z, rotate, scale ) {
        var el = this;
        el.style.setProperty( "-webkit-transform", "translate3d(" + (x || 0) + "px," + (y || 0) + "px," + (z || 0) + "px) " +
            "scale(" + (scale || 1) + ") rotate(" + (rotate || 0) + "deg)", null );
        el.wx = x || 0;
        el.wy = y || 0;
        el.ez = z || 0;
        el.wrotate = rotate || 0;
        el.wscale = scale || 1;
        return el;
    };

    Node.prototype.onDrag = function ( arg ) {
        var el = this;
        el.isTouching = false;
        el.bindEvent( "touchstart", function ( start ) {
            if ( el.isTouching == true ) {
                return;
            }
            arg.onStart && arg.onStart();
            el.isTouching = true;
            start.preventDefault();
            var spx = start.touches[0].pageX, spy = start.touches[0].pageY,
                lastx = spx, lasty = spy,
                isMoving = false,
                isGet = false;
            var moveHandler = document.bindEvent( "touchmove", function ( move ) {
                var dds = Math.pow( move.touches[0].pageX - spx, 2 ) + Math.pow( move.touches[0].pageY - spy, 2 ),
                    xgty = Math.abs( move.touches[0].pageX - spx ) > Math.abs( move.touches[0].pageY - spy );
                if ( dds > 9 ) {
                    if ( !arg.y && !arg.x ) {
                        isMoving = true;
                    }
                    else if ( !isGet && !isMoving && dds > 50 ) {
                        arg.y && !xgty && (isMoving = true );
                        arg.x && xgty && (isMoving = true );
                        isGet = true;
                    }
                    if ( isMoving ) {
                        arg.onMove && arg.onMove( {
                            dx : move.touches[0].pageX - lastx,
                            dy : move.touches[0].pageY - lasty
                        } );
                        lastx = move.touches[0].pageX;
                        lasty = move.touches[0].pageY;
                    }
                }
            } );
            var endHandler = el.bindEvent( "touchend", function () {
                moveHandler.remove();
                endHandler.remove();
                if ( isMoving ) {
                    arg.onEnd && arg.onEnd( {
                        dx : lastx - spx,
                        dy : lasty - spy
                    } );
                }
                else {
                    el.isTouching = false;
                }
            } );
        } );
    };

    Node.prototype.onTap = function ( callback ) {
        var el = this;
        var istouching = false;
        el.bindEvent( "touchstart", function ( se ) {
            el.classList.add( "tap" );
            if ( !istouching ) {
                istouching = true;
                var isTap = true;
                var mh = el.bindEvent( "touchmove", function ( me ) {
                    if ( isTap && Math.pow( me.touches[0].pageX - se.touches[0].pageX, 2 ) + Math.pow( me.touches[0].pageY - se.touches[0].pageY, 2 ) > 9 ) {
                        isTap = false;
                    }
                }, false );
                var eh = el.bindEvent( "touchend", function () {
                    el.classList.remove( "tap" );
                    isTap && callback();
                    mh.remove();
                    eh.remove();
                }, false );
            }
        }, false );

    };

    Node.prototype.css = function ( style ) {
        for ( var key in style ) {
            this.style.setProperty( key, style[key], null );
        }
    };

    function doAnimate( duration, keyframe, callback ) {
        var st = (new Date()).getTime();//  ms
        function animate() {
            var ct = (new Date()).getTime();// ms
            if ( duration - ct + st > 10 && ct - st < duration ) {
                setTimeout( function () {
                    keyframe( (ct - st ) / duration );
                    animate();
                }, 1000 / 60 );
            }
            else {
                callback();
            }
        }

        animate();
    }

    function transition( el, style, callback ) {
        for ( var key in style ) {
            el.style.setProperty( key, style[key], null );
        }
        el.addEventListener( "webkitTransitionEnd", function () {
            el.style.removeProperty( "-webkit-transition" );
            callback();
        }, false );
    }

    function createElement( tagName, arg, parent ) {
        var el = document.createElement( tagName );
        for ( var key in arg ) {
            switch ( key ) {
                case "classList":
                    if ( Object.prototype.toString.call( arg[key] ) == "[object String]" ) {
                        el.classList.add( arg[key] );
                    }
                    else if ( Object.prototype.toString.call( arg[key] ) == "[object Array]" ) {
                        loopArray( arg[key], function ( klass ) {
                            el.classList.add( klass );
                        } );
                    }
                    break;
                case "css":
                    el.css( arg[key] );
                    break;
                default :
                    el[key] = arg[key];
            }
        }
        parent && parent.appendChild( el );
    }

    var insertCSSRules = function () {
        var style = document.createElement( "style" );
        document.querySelector( "head" ).appendChild( style );
        return function ( rules ) {
            for ( var selector in rules ) {
                style.sheet.insertRule( selector + "" + JSON.stringify( rules[selector] ).replace( /"/g, "" ), style.sheet.rules.length );
            }
        }
    }();

    window.util = {
        loopArray : loopArray,
        doAnimate : doAnimate,
        transition : transition,
        insertCSSRules : insertCSSRules,
        createElement : createElement
    }
})();