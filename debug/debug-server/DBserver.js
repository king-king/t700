/**
 * Created by WQ on 2015/5/27.
 */
var http = require( 'http' );
var wss;


var httpServer = http.createServer( function ( req, res ) {
	switch ( req.url ) {
		case "/log":
			var data = "";
			req.on( "data", function ( str ) {
				data += str;
			} );
			req.on( "end", function () {
				wss && wss.clients.forEach( function each( client ) {
					client.send( JSON.stringify( JSON.parse( data ).message ) );
				} );
				res.writeHead( 200, {
					'Content-Type' : 'text/plain',
					"Access-Control-Allow-Origin" : "*"
				} );
				res.end();
			} );
			break;
		default :
			res.writeHead( 400, {
				'Content-Type' : 'text/plain',
				"Access-Control-Allow-Origin" : "*"
			} );
			res.end();
	}
} );
httpServer.listen( 8383 );

var WebSocketServer = require( 'ws' ).Server;
wss = new WebSocketServer( {
	server : httpServer
} );

wss.on( 'connection', function connection( ws ) {
	ws.on( 'message', function incoming( message ) {
		console.log( 'received: %s', message );
	} );

	ws.send( '终端已经链接' );
} );