/**
 * Created by killian on 2015/6/3.
 */
(function () {
	var load = document.querySelector( '.loading-page' );
	musicFun();
	function musicFun() {
		var playBtn = document.querySelector( '.music-icon' );
		var musicobj = document.getElementById( 'bg_audio' );
		playBtn.onclick = function () {
			if ( musicobj.paused ) {
				playBtn.classList.add( 'play' );
				musicobj.play();
				//musicobj.pause();
			}
			else {
				playBtn.classList.remove( 'play' );
				//musicobj.play();
				musicobj.pause();
			}

		}

		document.addEventListener( 'WeixinJSBridgeReady', function () {
			musicobj.play();
		}, false );
	}
	var width = document.body.clientHeight * 0.635, btns = Pages[4].querySelector(".btns");
	btns.style.width = width + 'px';
	var arrBtn = Pages[4].querySelectorAll( '.btns div' );

	for ( var i = 0; i < arrBtn.length; i++ ) {
		arrBtn[i].style.width = width / 3 + 'px';
	}

	var leftBtn = Pages[4].querySelector( '.leftBtn' ), middleBtn = Pages[4].querySelector( '.middleBtn' ), rightBtn = Pages[4].querySelector( '.rightBtn' );
	var leftCentent = Pages[4].querySelector( '.left-content' ), middleContent = Pages[4].querySelector( '.middle-content' ), rightContent = Pages[4].querySelector( '.right-content' );
	leftBtn.onclick = function () {
		leftCentent.style.display = 'block';
		middleContent.style.display = 'none';
		rightContent.style.display = 'none';
	}
	middleBtn.onclick = function () {
		leftCentent.style.display = 'none';
		middleContent.style.display = 'block';
		rightContent.style.display = 'none';
	}
	rightBtn.onclick = function () {
		leftCentent.style.display = 'none';
		middleContent.style.display = 'none';
		rightContent.style.display = 'block';
	}
}())
