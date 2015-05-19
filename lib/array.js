/**
 * Created by 白 on 2015/5/4.
 */

library( function () {
	function foreach( array, func ) {
		for ( var i = 0, len = array.length; i < len; ++i ) {
			var retVal;
			if ( ( retVal = func( array[i], i ) ) !== undefined ) {
				return retVal;
			}
		}
	}

	function findFirst( array, predicate ) {
		return foreach( array, function ( value, index ) {
			if ( predicate( value, index ) ) {
				return value;
			}
		} );
	}

	function collect( iterate ) {
		var result = [];
		iterate( function ( object ) {
			result.push( object );
		} );
		return result;
	}

	function map( array, mapper ) {
		var result = [];
		foreach( array, function ( item, i ) {
			result.push( mapper( item, i ) );
		} );
		return result;
	}

	exports.foreach = foreach;
	exports.findFirst = findFirst;
	exports.collect = collect;
	exports.map = map;
} );