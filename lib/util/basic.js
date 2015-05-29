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

    window.util = {
        loopArray : loopArray
    }

})();