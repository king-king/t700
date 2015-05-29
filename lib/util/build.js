/**
 * Created by WQ on 2015/5/29.
 *
 * 构建系统
 *
 */
(function () {
    var loopArray = util.loopArray;

    var pages = [];
    loopArray( document.querySelectorAll( ".page" ), function ( page, i ) {
        pages.push( page );
        page.remove();
        page.classList.add( "page-" + i );
    } );



})();