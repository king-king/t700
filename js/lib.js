/**
 * Created by wq on 2015/4/25.
 */
(function () {

    function loop( n, func ) {
        for ( var i = 0; i < n; i++ ) {
            func( i );
        }
    }

    function loopArray( array, func ) {
        var len = array.length;
        for ( var i = 0; i < len; i++ ) {
            func( array[i], i );
        }
    }

    Node.prototype.descendant = function ( func ) {
        function iterate( el, f ) {
            if ( el ) {
                f( el );
                iterate( el.firstElementChild, f );
                iterate( el.nextElementSibling, f );
            }
        }

        if ( this.firstElementChild ) {
            iterate( this.firstElementChild, func );
        }
    };

    Node.prototype.css = function ( styles ) {
        for ( var name in styles ) {
            this.style.setProperty( name, styles[name], null );
        }
    };

    Node.prototype.on = function ( type, listener, useCapture ) {
        var capture = useCapture || false;
        var el = this;
        el.addEventListener( type, listener, capture );
        return {
            remove : function () {
                el.removeEventListener( type, listener, capture );
            }
        }
    };

    Node.prototype.transition = function ( styles, time, timingFunction, delay, callback ) {
        var el = this;
        el.css( styles );
        el.style.setProperty( "-webkit-transition", time + "s " + timingFunction + " " + delay + "s ", null );
        var endHandle = el.on( "webkitTransitionEnd", function () {
            el.style.setProperty( "-webkit-transition", null, null );
            callback && callback();
            endHandle.remove();
        } );
    };

    Object.defineProperty( Node.prototype, "x", {
        set : function ( x ) {
            var scale = this.wscale;
            var rotate = this.wrotate;
            var y = this.wy;
            this.wx = x;
            this.style.setProperty( "-webkit-transform", "translate3d(" + x + "px," + (y ? y : 0) + "px,0)" +
                "scale(" + (scale || 1) + ")" + "rotateZ(" + (rotate ? rotate : 0) + "deg)", null );
        },
        get : function () {
            return this.wx || 0;
        }
    } );

    Object.defineProperty( Node.prototype, "y", {
        set : function ( y ) {
            var scale = this.wscale;
            var rotate = this.wrotate;
            var x = this.wx;
            this.wy = y;
            this.style.setProperty( "-webkit-transform", "translate3d(" + (x ? x : 0) + "px," + y + "px,0)" +
                "scale(" + (scale || 1) + ")" + "rotateZ(" + (rotate ? rotate : 0) + "deg)", null );
        },
        get : function () {
            return this.wy || 0;
        }
    } );

    Object.defineProperty( Node.prototype, "scale", {
        set : function ( scale ) {
            var rotate = this.wrotate;
            var y = this.wy;
            var x = this.wx;
            this.wscale = scale;
            this.style.setProperty( "-webkit-transform", "translate3d(" + (x ? x : 0) + "px," + (y ? y : 0) + "px,0)" +
                "scale(" + scale + ")" + "rotateZ(" + (rotate ? rotate : 0) + "deg)", null );
        },
        get : function () {
            return this.wscale || 0;
        }
    } );

    function dragListener( el, callbacks, isAction ) {
        var sx;
        var sy;
        var endx, endy;
        el.on( "touchstart", function ( se ) {
            se.preventDefault();
            sx = el.x;
            sy = el.y;
            var sex = se.touches[0].pageX, sey = se.touches[0].pageY;
            callbacks && callbacks.start && callbacks.start( se );
            var move = document.on( "touchmove", function ( me ) {
                if ( Math.pow( me.touches[0].pageX - sex, 2 ) + Math.pow( me.touches[0].pageY - sey, 2 ) > 9 ) {
                    callbacks && callbacks.move && callbacks.move( {
                        dx : me.touches[0].pageX - sex,
                        dy : me.touches[0].pageY - sey,
                        moveHandle : move,
                        endHandle : end
                    } );
                    isAction && (el.x = me.touches[0].pageX - se.touches[0].pageX + sx);
                    isAction && (el.y = me.touches[0].pageY - se.touches[0].pageY + sy);
                }
                endx = me.touches[0].pageX;
                endy = me.touches[0].pageY;
            } );
            var end = document.on( "touchend", function ( ee ) {
                move.remove();
                end.remove();
                callbacks.end && callbacks.end( {
                    dx : endx - sex,
                    dy : endy - sey
                } );
            } );
        } );
    }

    function loadImage( page, callback ) {
        var images = page.querySelectorAll( "[data-src]" );
        var len = images.length;
        var readay = 0;
        if ( images.length == 0 ) {
            callback && callback();
            return;
        }
        for ( var i = 0; i < images.length; i++ ) {
            images[i].src = images[i].dataset.src;
            images[i].onload = function () {
                readay += 1;
                readay == len && callback && callback();
            }
        }
    }

    function removeFromDom( el ) {
        el.parentNode && el.parentNode.removeChild( el );
    }

    window.w = {
        loopArray : loopArray,
        loop : loop,

        removeFromDom : removeFromDom,

        dragListener : dragListener,

        loadImage : loadImage
    }

})();