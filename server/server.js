//  Server.js
//  Used to handle all requests made to the server

//  Include the modules we need, store in variables for use
var connect= require( "connect" );
var url = require( "url" );
var userHashs = {};

//  Start wrapper function used to allow route and handle to pass through
function start( route, handle ) {

  //  Helper function for generating a nice guid ( not true guid but good enough )
  function guidGenerator() {
    var S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  function validate( request, response, next ) {
    var pathname = url.parse( request.url ).pathname;
    var values = request.query;

    if ( pathname !== "/favicon.ico" ) {

      if ( pathname === "/logout" || ( userHashs[ values.hash ] && userHashs[ values.hash ].time < new Date( Date.now() ) ) ) {
        console.log( "LOGGING OUT" );
        userHashs[ values.hash ] = null;
        route( handle, "/logout", response );
        return;
      }

      //  If user is already validated
      if ( userHashs[ values.hash ] ) {

        console.log( "User already validated" );

        //  Update our time as we are still doing stuff
        userHashs[ values.hash ].time = new Date( Date.now() + 1800000 );
        values.userID = userHashs[ values.hash ].id;
        values.userName = userHashs[ values.hash ].userName;
        response.values = values;
        
        next();
        return;
      }

      //  User is not validated yet
      if ( !values.hash || !userHashs[ values.hash ] ) {

        //  Attach values object onto response object for validation later
        response.values = values;
        route( handle, "/", response, function( ok ) {

          if ( ok ) {

            var tempGuid = guidGenerator();

            //  Make sure we get no duplicates, it has to be unique after all
            while ( userHashs[ tempGuid ] ) {
              tempGuid = guidGenerator();
            }

            tempGuid = response.values.curRole.substring( 0, 2 ) + tempGuid;
            values.hash = response.guid = tempGuid;
            
            //  Set our time to 30mins from now, auto log out if not renewed by then
            userHashs[ values.hash ] = {};
            userHashs[ values.hash ].time = new Date( Date.now() + 1800000 );
            userHashs[ values.hash ].id = response.values.id;
            userHashs[ values.hash ].userName = response.values.userName;

            response.writeHead( 200, {
              "Content-Type": "text/plain",
              "Access-Control-Allow-Origin": "*"
            });
            response.write( values.hash );
            response.end();
            return;
          } else {

            response.writeHead( 200, {
              "Content-Type": "text/plain",
              "Access-Control-Allow-Origin": "*"
            });
            response.write( "Invalid user/pass" );
            response.end();
            return;
          }
        } );
      }
    }
  }

  //  onRequest function called for each request to the server
  function onRequest( request, response, next ) {

    //  Parse pathname out of url
    var pathname = url.parse( request.url ).pathname;

    //  Get our content from the router
    route( handle, pathname, response );
  }

  //  Actually start the server
  var server = connect.createServer(
    connect.query(),
    validate,
    onRequest
  );

  server.listen( 8080 );
}

//  export our module we just created
exports.start = start;
