/**
 * Created by WQ on 2015/5/29.
 *
 * ����ϵͳ
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
				var that = this;
				page.next = function () {
					return that.pages[(index + 1) % that.pages.length]
				}
			},
			fetch : function ( index ) {
				return this.pages[index]
			},
			end : function () {
				return this.pages[this.pages.length - 1]
			},
			first : function () {
				return this.pages[0]
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
		loopArray( [prePage, curPage, nextPage], function ( page ) {
			body.appendChild( page );
		} );

		var isCanDrag = true;
		body.onDrag( {
			onMove : function ( arg ) {
				isCanDrag && loopArray( [prePage, curPage, nextPage], function ( page ) {
					page.transform( 0, page.wy += arg.dy, 0 );
				} );
			},
			onEnd : function ( endArg ) {
				var count = 0;
				isCanDrag = false;
				if ( Math.abs( endArg.dy ) < clientHeight / 4 ) {
					loopArray( [prePage, curPage, nextPage], function ( page, i ) {
						transition( page, {
							"-webkit-transform" : "translate3d(0," + ((i - 1) * clientHeight) + "px,0)",
							"-webkit-transition" : "0.2s linear"
						}, function () {
							page.wy = (i - 1) * clientHeight;
							count += 1;
							if ( count == 2 ) {
								isCanDrag = true;
								console.log( "end" )
							}

						} );
					} );
				}
				else if ( endArg.dy > clientHeight / 4 ) {
					// ����,��Ҫ�ѵ�һ��ͼ��Ϊ

				}
				else {

				}

			}
		} )


	}, 3000 );


})();