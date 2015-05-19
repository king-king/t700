/**
 * Created by 白 on 2015/5/4.
 */

library( function () {
	var object = imports( "object" ),
		array = imports( "array" ),
		func = imports( "function" ),
		testEl = document.createElement( "div" ),
		browserPrefix = "";

	// 测试是否支持一个样式
	function test( styleName, styleValue ) {
		if ( false && CSS && CSS.supports ) {
			return CSS.supports( styleName, styleValue );
		}
		else {
			testEl.removeAttribute( "style" );
			testEl.style.setProperty( styleName, styleValue, null );
			return testEl.hasAttribute( "style" );
		}
	}

	// 测试一个样式的前缀
	function testPrefix( styleName, styleValue ) {
		return array.findFirst( ["", "-webkit-", "-ms-", "-moz-", "-o-"], function ( targetPrefix ) {
				return test( targetPrefix + styleName, styleValue );
			} ) || "";
	}

	// 设置一个元素的样式
	function css( el, arg1, arg2 ) {
		func.callWith( function ( set ) {
			arg2 === undefined ? object.foreach( arg1, set ) : set( arg1, arg2 );
		}, function ( styleName, styleValue ) {
			el.style.setProperty( ( browserPrefix ?
					test( browserPrefix + styleName, styleValue ) ? browserPrefix : "" :
					( browserPrefix = testPrefix( styleName, styleValue ) ) ) + styleName, styleValue, null );
		} );

		return {
			remove : function () {
				remove( el, object.is.String( arg1 ) ? arg1 : array.collect( function ( push ) {
					object.foreach( arg1, function ( key ) {
						push( key );
					} );
				} ) );
			}
		};
	}

	// 移除一个元素
	function remove( el, arg ) {
		func.callWith( function ( remove ) {
			object.is.String( arg ) ? remove( arg ) : array.foreach( arg, remove );
		}, function ( styleName ) {
			array.foreach( ["", "-webkit-", "-ms-", "-moz-", "-o-"], function ( prefix ) {
				el.style.removeProperty( prefix + styleName );
			} );
		} );
	}

	function n( value ) {
		return ( value * 100000 << 0 ) / 100000;
	}

	function px( value ) {
		return value === 0 ? 0 : n( value ) + "px";
	}

	module.exports = css;
	css.remove = remove;
	css.test = test;
	css.px = px;
} );