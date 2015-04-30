/**
 * Created by WQ on 2015/4/27.
 */
(function () {

    var pages = document.querySelectorAll( ".page" );
    var container = document.querySelector( ".container" );

    function removeElement( el ) {
        el.parentNode && el.parentNode.removeChild( el );
    }

    function getPage( index ) {
        return pages[(index + pages.length) % pages.length];
    }

    w.loopArray( pages, function ( page, i ) {
        i != 0 && removeElement( page );
    } );

    function translate( el, arg ) {
        el.style.setProperty( "-webkit-transform", "translate3d(" + arg.x + "px, " + arg.y + "px, " + arg.z + "px)" + (arg.scale ? "scale(" + arg.scale + ")" : ""), null );
        el.sx = arg.x;
        el.sy = arg.y;
        el.sz = arg.z;
        arg.scale && (el.sscale = arg.scale);
        return el;
    }

    var height = container.offsetHeight;

    function build() {
        var curIndex = 0;
        var curPage = pages[0], prePage, nextPage;
        curPage.sy = 0;
        var prey = -container.offsetHeight;
        var cury = 0;
        var nexty = container.offsetHeight;
        w.dragListener( container, {
            start : function () {
                prePage = getPage( curIndex - 1 );
                nextPage = getPage( curIndex + 1 );
                container.appendChild( translate( prePage, {x : 0, y : -container.offsetHeight, z : 0} ) );
                container.appendChild( translate( nextPage, {x : 0, y : container.offsetHeight, z : 0} ) );
                prey = prePage.sy;
                cury = curPage.sy;
                nexty = nextPage.sy;
            },
            move : function ( e ) {
                var scale = 1 - Math.abs( curPage.sy + e.dy ) / height / 2;
                translate( curPage, {x : 0, y : (cury + e.dy) / 2, z : 0, scale : scale} );
                translate( prePage, {x : 0, y : prey + e.dy, z : 0} );
                translate( nextPage, {x : 0, y : nexty + e.dy, z : 0} );
            },
            end : function ( e ) {
                if ( e.dy > 0 ) {
                    curIndex--;
                    prePage.transition( {
                        "-webkit-transform" : "translate3d(0,0,0)"
                    }, 0.2, "linear", 0, function () {
                        w.removeFromDom( curPage );
                        w.removeFromDom( nextPage );
                        curPage = prePage;
                        curPage.sy = 0;
                        console.log( "end" );
                    } );
                    curPage.transition( {
                        "-webkit-transform" : "translate3d(0," + height / 2 + "px,0) scale(0.5)"
                    }, 0.2, "linear", 0 );
                }
                else {
                    curIndex++;
                }
            }
        } );
    }

    build();
})();