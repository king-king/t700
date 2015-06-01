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
                return this.pages[index]
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

    body.classList.add( "hide" );
    setTimeout( function () {
        body.classList.remove( "hide" );
        loadingPage.remove();
        clientHeight = body.offsetHeight;
        clientWidth = body.offsetWidth;
        var prePage = pages.end().transform( 0, -clientHeight, 0 ),
            curPage = pages.fetch( 0 ).transform( 0, 0, 0 ),
            nextPage = pages.fetch( 1 ).transform( 0, clientHeight, 0 );
        loopArray( [curPage, prePage, nextPage], function ( page ) {
            body.appendChild( page );
        } );
        var isVisiteEnd = false;
        body.onDrag( {
            y : true,
            onMove : function ( arg ) {
                if ( !isVisiteEnd && curPage.index == 0 && curPage.wy + arg.dy > 0 ) {
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
                if ( !isVisiteEnd && curPage.index == 0 && endArg.dy > 0 ) {
                    endArg.dy = 0;
                }
                if ( curPage.index == pages.pages.length - 1 ) {
                    isVisiteEnd = true;
                }
                var count = 0;
                if ( endArg.dy > 0 ) {
                    var endStyles1 = [
                        "translate3d(0,0,0)",
                        "translate3d(0," + clientHeight / 3 + "px,0) scale(" + (2 / 3) + ")",
                        "translate3d(0," + 2 * clientHeight + "px,0)"
                    ];
                    // 返回,需要把第一张图变为当前页面
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
                            }
                        } );
                    } );
                }
                else if ( endArg.dy == 0 ) {
                    body.isTouching = false;
                }
            }
        } )


    }, 0 );


})();