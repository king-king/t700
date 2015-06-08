/**
 * Created by WQ on 2015/5/29.
 *
 * 构建系统
 *
 */
(function () {
    /*function*/
    var loopArray = util.loopArray,
        transition = util.transition,
        querySelector = document.querySelector.bind( document ),
        querySelectorAll = document.querySelectorAll.bind( document );

    /*DOM*/
    var body = querySelector( ".body" ),
        loadingPage = querySelector( ".loading-page" );

    /*variable*/
    var clientHeight,
        clientWidth,
        pages = {
            pages : [],
            push : function ( page ) {
                this.pages.push( page );
                var index = this.pages.length - 1;
                page.index = index;
                var that = this;
                page.next = function () {
                    return that.pages[(index + 1) % that.pages.length];
                };
                page.pre = function () {
                    return that.pages[(index - 1 + that.pages.length) % that.pages.length];
                }
            },
            fetch : function ( index ) {
                return this.pages[(index + pages.pages.length) % pages.pages.length]
            },
            end : function () {
                return this.pages[this.pages.length - 1]
            }
        };

    loopArray( querySelectorAll( ".page" ), function ( page, i ) {
        pages.push( page );
        page.remove();
        page.classList.add( "page-" + i );
    } );

    window.Pages = pages.pages;

    var prePage, curPage, nextPage;

    body.classList.add( "hide" );
    setTimeout( function () {
        body.classList.remove( "hide" );
        loadingPage.remove();
        clientHeight = body.offsetHeight;
        clientWidth = body.offsetWidth;
        prePage = pages.end().transform( 0, -clientHeight, 0 );
        curPage = pages.fetch( 0 ).transform( 0, 0, 0 );
        nextPage = pages.fetch( 1 ).transform( 0, clientHeight, 0 );
        curPage.classList.add( "animate" );
        system.onopen && system.onopen();
        loopArray( [curPage, prePage, nextPage], function ( page ) {
            body.appendChild( page );
        } );
        var isVisitEnd = false;
        body.onDrag( {
            y : true,
            onMove : function ( arg ) {
                if ( !isVisitEnd && curPage.index == 0 && curPage.wy + arg.dy > 0 ) {
                    return;
                }
                var ratio = Math.abs( curPage.wy += arg.dy ) / clientHeight / 3;
                curPage.css( {
                    "-webkit-transform" : "translate3d(0," + (curPage.wy > 0 ? clientHeight : -clientHeight) * ratio + "px,0) scale(" + (1 - ratio) + ")"
                } );
                loopArray( [prePage, nextPage], function ( page ) {
                    page.transform( 0, page.wy += arg.dy, 0 );
                } );
            },
            onEnd : function ( endArg ) {
                if ( !isVisitEnd && curPage.index == 0 && endArg.dy > 0 ) {
                    endArg.dy = 0;
                }
                endArg.dy = !( !isVisitEnd && curPage.index == 0 && endArg.dy > 0 ) * endArg.dy;
                var count = 0;
                curPage.classList.remove( "animate" );
                if ( endArg.dy > 0 ) {
                    var endStyles1 = [
                        "translate3d(0,0,0)",
                        "translate3d(0," + clientHeight / 3 + "px,0) scale(" + (2 / 3) + ")",
                        "translate3d(0," + 2 * clientHeight + "px,0)"
                    ];
                    loopArray( [prePage, curPage, nextPage], function ( page, i ) {
                        transition( page, {
                            "-webkit-transform" : endStyles1[i],
                            "-webkit-transition" : "0.2s linear"
                        }, function () {
                            page.wy = i * clientHeight;
                            count += 1;
                            if ( count == 2 ) {
                                body.isTouching = false;
                                curPage.remove();
                                nextPage.remove();
                                curPage = prePage;
                                prePage = curPage.pre().transform( 0, -clientHeight, 0 );
                                nextPage = curPage.next().transform( 0, clientHeight, 0 );
                                body.appendChild( prePage );
                                body.appendChild( nextPage );
                                curPage.classList.add( "animate" );
                                if ( !isVisitEnd ) {
                                    isVisitEnd = curPage.index == pages.pages.length - 1;
                                }
                            }
                        } );
                    } );

                }
                else if ( endArg.dy < 0 ) {
                    var endStyles2 = [
                        "translate3d(0,-" + 2 * clientHeight + "px,0)",
                        "translate3d(0,-" + clientHeight / 3 + "px,0) scale(" + (2 / 3) + ")",
                        "translate3d(0,0,0)"
                    ];
                    loopArray( [prePage, curPage, nextPage], function ( page, i ) {
                        transition( page, {
                            "-webkit-transform" : endStyles2[i],
                            "-webkit-transition" : "0.2s linear"
                        }, function () {
                            page.wy = (i - 2) * clientHeight;
                            count += 1;
                            if ( count == 2 ) {
                                body.isTouching = false;
                                curPage.remove();
                                prePage.remove();
                                curPage = nextPage;
                                prePage = curPage.pre().transform( 0, -clientHeight, 0 );
                                nextPage = curPage.next().transform( 0, clientHeight, 0 );
                                body.appendChild( prePage );
                                body.appendChild( nextPage );
                                curPage.classList.add( "animate" );
                                if ( !isVisitEnd ) {
                                    isVisitEnd = curPage.index == pages.pages.length - 1;
                                }
                            }
                        } );
                    } );
                }
                else if ( endArg.dy == 0 ) {
                    body.isTouching = false;
                }
            }
        } )
    }, 3000 );

    window.system = {
        jump : function ( index ) {
            index = index % pages.pages.length;
            if ( !curPage ) {
                return null;
            }
            else {
                curPage.classList.remove( "animate" );
                curPage = pages.fetch( index ).transform( 0, 0, 0 );
                prePage = curPage.pre().transform( 0, -clientHeight, 0 );
                nextPage = curPage.next().transform( 0, clientHeight, 0 );
                curPage.classList.add( "animate" );
            }
        }
    }

})();