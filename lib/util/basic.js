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
		el.bindEvent( "touchstart", function ( start ) {
			start.preventDefault();
			var spx = start.touches[0].pageX, spy = start.touches[0].pageY;
			var lastx = spx, lasty = spy;
			var moveHandler = document.bindEvent( "touchmove", function ( move ) {
				if ( Math.pow( move.touches[0].pageX - spx, 2 ) + Math.pow( move.touches[0].pageY - spy, 2 ) > 9 ) {
					arg.onMove && arg.onMove( {
						dx : move.touches[0].pageX - lastx,
						dy : move.touches[0].pageY - lasty
					} );
					lastx = move.touches[0].pageX;
					lasty = move.touches[0].pageY;
				}
			} );
			var endHandler = el.bindEvent( "touchend", function () {
				moveHandler.remove();
				endHandler.remove();
				arg.onEnd && arg.onEnd( {
					dx : lastx - spx,
					dy : lasty - spy
				} );
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

	window.util = {
		loopArray : loopArray,
		doAnimate : doAnimate,
		transition : transition
	}

})();