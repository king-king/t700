/**
 * Created by killian on 2015/6/3.
 */
main( function () {
    var system = imports( "../../../lib/util/build.js" );
    var Pages = system.pages;
    setTimeout( function () {
        system.run();
    }, 3000 );
    musicFun();
    function musicFun() {
        var playBtn = document.querySelector( '.music-icon' );
        var musicObj = document.getElementById( 'bg_audio' );
        playBtn.onclick = function () {
            if ( musicObj.paused ) {
                playBtn.classList.add( 'play' );
                musicObj.play();
            }
            else {
                playBtn.classList.remove( 'play' );
                musicObj.pause();
            }

        };

        document.addEventListener( 'WeixinJSBridgeReady', function () {
            musicObj.play();
        }, false );
    }

    var width = document.body.clientHeight * 0.635, btns = Pages[4].querySelector( ".btns" );
    btns.style.width = width + 'px';
    var arrBtn = Pages[4].querySelectorAll( '.btns div' );

    for ( var i = 0; i < arrBtn.length; i++ ) {
        arrBtn[i].style.width = width / 3 + 'px';
    }

    var leftBtn = Pages[4].querySelector( '.leftBtn' ), middleBtn = Pages[4].querySelector( '.middleBtn' ), rightBtn = Pages[4].querySelector( '.rightBtn' );
    var leftContent = Pages[4].querySelector( '.left-content' ), middleContent = Pages[4].querySelector( '.middle-content' ), rightContent = Pages[4].querySelector( '.right-content' );
    leftBtn.onclick = function () {
        leftContent.style.display = 'block';
        middleContent.style.display = 'none';
        rightContent.style.display = 'none';
    };
    middleBtn.onclick = function () {
        leftContent.style.display = 'none';
        middleContent.style.display = 'block';
        rightContent.style.display = 'none';
    };
    rightBtn.onclick = function () {
        leftContent.style.display = 'none';
        middleContent.style.display = 'none';
        rightContent.style.display = 'block';
    }
} );
