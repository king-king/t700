var http = require( 'http' );
var os = require( "os" );


http.createServer( function ( req, res ) {
    res.writeHead( 200, {'Content-Type' : 'text/html', "Access-Control-Allow-Origin" : "*"} );
    var ip = os.networkInterfaces().WLAN[1].address;
    res.end( "<html>" +
        "<head><meta charset='utf-8'><title>本地网站</title>" +
        "<style>a{font-size:20px}</style>" +
        "</head>" +
        "<body><a href=http://" + ip + ":55555>firstpage3</a><br>" +
        "<a href=http://" + ip + ":60000>t700</a><br>" +
        "<a href=http://" + ip + ":55556>t800</a><br>" +
        "<a href=http://" + ip + ":55554>temp</a><br>" +
        "</body>" +
        "</html>" );
} ).listen( 1338, '127.0.0.1' );

