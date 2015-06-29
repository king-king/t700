/**
 * Created by WQ on 2015/6/29.
 */
Package( function ( exports ) {
    var basic = imports( "basic.js" );
    var createElement = basic.createElement,
        loopArray = basic.loopArray,
        doAnimate = basic.doAnimate;

    function makeBanner( banner, data ) {
        var content = createElement( "div", {classList : "content"}, banner );
        var curIndex = 0;
        var width = content.offsetWidth;
        var items = {
            all : [],
            length : 0,
            fetch : function ( index ) {
                index = (index + items.all.length) % items.all.length;
                return items.all[index];
            },
            push : function ( item ) {
                items.length++;
                items.all.push( item );
                var index = items.all.length - 1;
                item.next = function () {
                    return items.fetch( index + 1 );
                };
                item.pre = function () {
                    return items.fetch( index - 1 );
                }
            }
        };
        loopArray( data, function ( src ) {
            var item = createElement( "div", {
                classList : "item",
                css : {
                    background : "url(" + src + ")",
                    "background-size" : "cover"
                }
            } );
            items.push( item );
        } );
        function initPosition( item ) {
            item.pre().transform( -width, 0, 0 );
            item.transform( 0, 0, 0 );
            item.next().transform( width, 0, 0 );
            content.appendChild( item.pre() );
            content.appendChild( item );
            content.appendChild( item.next() );
        }

        initPosition( items.fetch( curIndex ) );

        function removeItems( item ) {
            item.remove();
            item.pre().remove();
            item.next().remove();
        }

        var handler = {};

        banner.onDrag( {
            x : true,
            onStart : function () {
                clearTimeout( timeID );
            },
            onMove : function ( arg ) {
                loopArray( [
                    items.fetch( curIndex ),
                    items.fetch( curIndex ).pre(),
                    items.fetch( curIndex ).next()
                ], function ( item ) {
                    item.transform( item.wx += arg.dx, 0, 0 );
                } );
            },
            onEnd : function ( arg ) {
                var count = 0;
                loopArray( [
                    items.fetch( curIndex ).pre(),
                    items.fetch( curIndex ),
                    items.fetch( curIndex ).next()
                ], function ( item, i ) {
                    item.transition( {
                        "-webkit-transform" : "translate3d(" + (arg.dx < 0 ? width * (i - 2) : width * i) + "px,0,0)",
                        "-webkit-transition" : "0.2s linear"
                    }, function () {
                        count += 1;
                        if ( count == 2 ) {
                            removeItems( items.fetch( curIndex ) );
                            curIndex = (curIndex + (arg.dx < 0 ? 1 : -1) + items.length) % items.length;
                            handler.onCut && handler.onCut( curIndex );
                            initPosition( items.fetch( curIndex ) );
                            banner.isTouching = false;
                            autoSlide();
                        }
                    } )
                } );
            }
        } );

        var timeID;

        function autoSlide() {
            function timer( func, delay ) {
                timeID = setTimeout( func, delay );
            }

            function cut() {
                clearTimeout( timeID );
                doAnimate( 300, function ( process ) {
                    loopArray( [
                        items.fetch( curIndex ).pre(),
                        items.fetch( curIndex ),
                        items.fetch( curIndex ).next()
                    ], function ( item, i ) {
                        item.transform( -width * easingEffects.easeOutQuart( process ) + width * (i - 1), 0, 0 );
                    } )
                }, function () {
                    removeItems( items.fetch( curIndex ) );
                    curIndex = (curIndex + 1 + items.length) % items.length;
                    handler.onCut && handler.onCut( curIndex );
                    initPosition( items.fetch( curIndex ) );
                    timer( cut, 3000 );
                } );
            }

            timer( cut, 3000 );
        }

        autoSlide();
        return handler;
    }

    exports.makeBanner = makeBanner;
} );