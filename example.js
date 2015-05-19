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

    function requestAnimate( duration, arg ) {
        var s = (new Date()).getTime();

        function animate() {
            var curTime = (new Date()).getTime();
            if ( curTime - s < duration ) {
                arg.onAnimate( {
                    progress : (curTime - s) / duration
                } );
                setTimeout( function () {
                    animate();
                }, 1000 / 60 );
            }
            else {
                // ½áÊø
                arg.onEnd();
            }
        }

        animate();
    }

    var page = document.querySelector( ".page" );
    page.y = 0;

    var isTouching = false;

    point.bind( container, "touchstart", function ( e ) {
        e.preventDefault();
        if ( isTouching ) {
            return;
        }
        isTouching = true;
        onMoveUp( {
            onMove : function ( e ) {
                css( page, {
                    "-webkit-transform" : "translate3d(0," + (page.y += e.dY) + "px,0)"
                } )
            },
            onUp : function () {
                requestAnimate( 300, {
                    onAnimate : function ( arg ) {
                        css( page, {
                            "-webkit-transform" : "translate3d(0," + (page.y - page.y * arg.progress) + "px,0)"
                        } );
                    },
                    onEnd : function () {
                        css( page, {
                            "-webkit-transform" : "translate3d(0,0,0)"
                        } );
                        page.y = 0;
                        isTouching = false;
                    }
                } );
            }
        } );

    } )


} );