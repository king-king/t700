/**
 * Created by WQ on 2015/5/19.
 */
main( function () {

    var point = imports( "pointer" );

    var container = document.querySelector( ".container" );

    function loopObj( obj, func ) {
        for ( var key in obj ) {
            func( key, obj[key] );
        }
    }

    function css( el, style ) {
        loopObj( style, function ( key, value ) {
            el.style.setProperty( key, value, null );
        } );
    }

    function onMoveUp( arg ) {
        var moveHandle = point.onPointerMove( document, function ( event ) {
            arg.onMove && arg.onMove( event );
        } );

        var upHandle = point.onPointerUp( document, function ( event ) {
            moveHandle.remove();
            upHandle.remove();
            arg.onUp && arg.onUp( event );
        } );

        return {
            remove : function () {
                moveHandle.remove();
                upHandle.remove();
            }
        };
    }

    var page = document.querySelector( ".page" );
    page.y = 0;
    point.bind( container, "touchstart", function () {
        onMoveUp( {
            onMove : function ( e ) {
                css( page, {
                    transform : "translate3d(0," + (page.y += e.dY) + "px,0)"
                } )
            }
        } );

    } )


} );