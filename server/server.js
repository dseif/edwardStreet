//  Server.js
//  Used to handle all requests made to the server

//  Include the modules we need, store in variables for use
var http = require( "http" );
var url = require( "url" );

//  Start wrapper function used to allow route and handle to pass through
function start( route, handle ) {

  //  onRequest function called for each request to the server
  function onRequest( request, response ) {

    //  Parse pathname out of url
    var pathname = url.parse( request.url ).pathname,
        content;

    response.writeHead( 200, {
      "Content-Type": "text/plain"
    });

    //  Get our content from the router
    content = route( handle, pathname );

    //  Write this content
    response.write( content );
    response.end();
  }

  //  Actually start the server
  http.createServer( onRequest ).listen( 8888 );
}

//  export our module we just created
exports.start = start;
