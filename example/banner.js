/**
 * Created by WQ on 2015/6/25.
 */
main( function () {
    var system = imports( "../lib/util/build.js" );
    var util = imports( "../lib/util/basic.js" );
    var plugin = imports( "../lib/util/plugin.js" );
    system.run();
    var handler = plugin.makeBanner( system.pages[0].querySelector( ".banner" ), [
        "img/1.jpg",
        "img/2.jpg",
        "img/3.jpg",
        "img/4.jpg",
        "img/5.jpg"
    ] );
    handler.onCut = function ( index ) {
        console.log( index )
    }
} );