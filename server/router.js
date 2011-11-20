//  router.js
//  used to route traffic to the appropriate requestHandler

//  route function to do our work
function route( handle, pathname, response, cb ) {

  //  Call requestHandler function stored in our object if its there
  if ( typeof handle[ pathname ] === "function" ) {

    handle[ pathname ]( response, cb );

  //  else return not found
  } else {
    response.writeHead( 200, { "Content-Type": "text/plain" } );
    response.write( "404 Error" );
    response.end();
  }
}

//  Export our module
exports.route = route;
