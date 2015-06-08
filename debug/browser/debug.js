/**
 * Created by WQ on 2015/6/5.
 */
(function () {

	window.remote = {
		log : function ( message ) {
			var xhr = new XMLHttpRequest();
			try {
				var mess = JSON.parse( JSON.stringify( message ) );
			}
			catch ( e ) {
				mess = message.toString();
			}
			xhr.open( "POST", "http://192.168.0.128:8383/log", true );
			xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
			xhr.send( JSON.stringify( {
				message : mess
			} ) );
		}
	}

})();