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
        el.style.setProperty( "transform", "translate3d(" + arg.x + "px, " + arg.y + "px, " + arg.z + "px)", null );
        el.sx = arg.x;
        el.sy = arg.y;
        el.sz = arg.z;
        return el;
    }


    function build() {
        var curIndex = 0;
        var curPage = pages[0], prePage, nextPage;
        curPage.sy = 0;
        w.dragListener( container, {
            start : function () {
                prePage = getPage( curIndex - 1 );
                nextPage = getPage( curIndex + 1 );
                container.appendChild( translate( prePage, {x : 0, y : -container.offsetHeight, z : 0} ) );
                container.appendChild( translate( nextPage, {x : 0, y : container.offsetHeight, z : 0} ) );
            },
            move : function ( e ) {
                translate( curPage, {x : 0, y : curPage.sy + e.dy, z : 0} );
                //translate( prePage, {x : 0, y : prePage.sy + e.dy, z : 0} );
                //translate( nextPage, {x : 0, y : nextPage.sy + e.dy, z : 0} );
            }
        } );
    }

    build();
})();