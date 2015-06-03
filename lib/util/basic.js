/**
 * Created by WQ on 2015/5/29.
 *
 * 提供基础的工具
 *
 */


(function () {

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

    Node.prototype.css = function ( style ) {
        for ( var key in style ) {
            this.style.setProperty( key, style[key], null );
        }
    };

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
        insertCSSRules : insertCSSRules
    }

})();