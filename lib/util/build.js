/**
 * Created by WQ on 2015/5/29.
 *
 * 构建系统
 *
 */
(function () {
    var loopArray = util.loopArray,
        querySelector = document.querySelector.bind( document ),
        querySelectorAll = document.querySelectorAll.bind( document );

    var pages = [];
    loopArray( querySelectorAll( ".page" ), function ( page, i ) {
        pages.push( page );
        page.remove();
        page.classList.add( "page-" + i );
    } );

    var body = querySelector( ".body" ),
        loadingPage = querySelector( ".loading-page" );
    body.classList.add( "hide" );
    setTimeout( function () {
        body.classList.remove( "hide" );
        loadingPage.remove();
        body.appendChild()
    }, 3000 );



})();