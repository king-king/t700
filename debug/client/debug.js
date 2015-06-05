/**
 * Created by WQ on 2015/6/5.
 */
(function () {

    window.remote = {
        log : function ( message ) {
            var xhr = new XMLHttpRequest();
            xhr.open( "post", "http://localhost:8383/log", true );
            xhr.send( JSON.stringify( {
                message : message
            } ) );
        }
    }

})();