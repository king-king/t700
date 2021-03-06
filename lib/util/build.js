/**
 * Created by WQ on 2015/5/29.
 *
 * 构建系统
 *
 */
Package( function ( exports ) {
    var util = imports( "basic.js" );
    /*api*/
    var loopArray = util.loopArray,
        querySelector = document.querySelector.bind( document ),
        querySelectorAll = document.querySelectorAll.bind( document );

    /*DOM*/
    var body = querySelector( ".body" ),
        loadingPage = querySelector( ".loading-page" );

    /*variable*/
    var pages = {
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

    var prePage, curPage, nextPage;

    body.classList.add( "hide" );

    function run() {
        body.classList.remove( "hide" );
        loadingPage.remove();
        window.clientHeight = body.offsetHeight;
        window.clientWidth = body.offsetWidth;
        prePage = pages.end().transform( 0, -clientHeight, 0 );
        curPage = pages.fetch( 0 ).transform( 0, 0, 0 );
        nextPage = pages.fetch( 1 ).transform( 0, clientHeight, 0 );
        curPage.classList.add( "animate" );
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
                var tempPages = [prePage, curPage, nextPage];
                curPage.classList.remove( "animate" );
                if ( endArg.dy > 0 ) {
                    util.concurrentTask( util.map( [
                        "translate3d(0,0,0)",
                        "translate3d(0," + clientHeight / 3 + "px,0) scale(" + (2 / 3) + ")",
                        "translate3d(0," + 2 * clientHeight + "px,0)"
                    ], function ( style, i ) {
                        return function ( done ) {
                            tempPages[i].wy = i * clientHeight;
                            tempPages[i].transition( {
                                "-webkit-transform" : style,
                                "-webkit-transition" : "0.2s linear"
                            }, done );
                        }
                    } ), function () {
                        body.isTouching = false;
                        curPage.onRemove && curPage.onRemove();
                        curPage.remove();
                        nextPage.remove();
                        curPage = prePage;
                        prePage = curPage.pre().transform( 0, -clientHeight, 0 );
                        nextPage = curPage.next().transform( 0, clientHeight, 0 );
                        body.appendChild( prePage );
                        body.appendChild( nextPage );
                        curPage.classList.add( "animate" );
                        curPage.onCut && curPage.onCut();
                        if ( !isVisitEnd ) {
                            isVisitEnd = curPage.index == pages.pages.length - 1;
                        }
                    } );
                }
                else if ( endArg.dy < 0 ) {
                    util.concurrentTask( util.map( [
                        "translate3d(0,-" + 2 * clientHeight + "px,0)",
                        "translate3d(0,-" + clientHeight / 3 + "px,0) scale(" + (2 / 3) + ")",
                        "translate3d(0,0,0)"
                    ], function ( style, i ) {
                        return function ( done ) {
                            tempPages[i].wy = (i - 2) * clientHeight;
                            tempPages[i].transition( {
                                "-webkit-transform" : style,
                                "-webkit-transition" : "0.2s linear"
                            }, done )
                        }
                    } ), function () {
                        body.isTouching = false;
                        curPage.onRemove && curPage.onRemove();
                        curPage.remove();
                        prePage.remove();
                        curPage = nextPage;
                        prePage = curPage.pre().transform( 0, -clientHeight, 0 );
                        nextPage = curPage.next().transform( 0, clientHeight, 0 );
                        body.appendChild( prePage );
                        body.appendChild( nextPage );
                        curPage.classList.add( "animate" );
                        curPage.onCut && curPage.onCut();
                        if ( !isVisitEnd ) {
                            isVisitEnd = curPage.index == pages.pages.length - 1;
                        }
                    } );
                }
                else if ( endArg.dy == 0 ) {
                    body.isTouching = false;
                }
            }
        } )
    }

    function jump( index ) {
        index = index % pages.pages.length;
        if ( !curPage ) {
            return null;
        }
        else {
            loopArray( [curPage, prePage, nextPage], function ( page ) {
                page.remove();
            } );
            curPage.classList.remove( "animate" );
            curPage = pages.fetch( index ).transform( 0, 0, 0 );
            prePage = curPage.pre().transform( 0, -clientHeight, 0 );
            nextPage = curPage.next().transform( 0, clientHeight, 0 );
            loopArray( [curPage, prePage, nextPage], function ( page ) {
                body.appendChild( page );
            } );
            curPage.classList.add( "animate" );
        }
    }


    exports.pages = pages.pages;
    exports.run = run;
    exports.jump = jump;

} );