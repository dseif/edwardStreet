//  requestHandlers.js
//  Used to do all of the heavy lifting on our server
//  each function returns content for a different page

//  Helper function to store utility functions
var helper = {

  //  Helper function to return the proper date string to be inserted into the database
  date: function() {

    var cur = new Date();
    return cur.getFullYear() + "-" + cur.getMonth() + "-" + cur.getDate() + " " +
           cur.getHours() + ":" + cur.getMinutes() + ":00";
  }
}

var mysql = require( "db-mysql" );

function index( response, cb ) {

  var vals = response.values;

  new mysql.Database({
    hostname: "localhost",
    user: "dave",
    password: "asdfa",
    database: "edwardst_inv"
  }).on( "error", function( error ) {
    console.log( "ERROR: " + error );
  }).on( "ready", function( server ) {
   console.log( "Connected to " + server.hostname + " (" + server.version + ")" );
  }).connect( function( error ) {

   if ( error ) {
     console.log( "Error on connect: " + error );
   }

   this.query( "SELECT * FROM USER WHERE USER_ID = '" + vals.user + "' AND PASSWORD = '" + vals.pass + "'"  ).
   execute( function( error, rows, cols ) {

     if ( error ) {
       console.log( "Error on select: " + error );
       return;
     }

     vals.id = rows[ 0 ] && rows[ 0 ].EMPLOYEE_ID;
     vals.userName = rows[ 0 ] && rows[ 0 ].USER_ID;
     vals.role = rows[ 0 ] && rows[ 0 ].ROLE;

     cb && cb( !!rows.length );
   });
  });
}

function login( response ) {
     response.writeHead(200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
     });
     response.write( response.values.hash );
     response.end();
}

function logout( response ) {
     response.writeHead(200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
     });
     response.write( "Logged Out" );
     response.end();
}

function changePassword( response ) {

  var vals = response.values;

  new mysql.Database({
    hostname: "localhost",
    user: "dave",
    password: "asdfa",
    database: "edwardst_inv"
  }).on( "error", function( error ) {
    console.log( "ERROR: " + error );
  }).on( "ready", function( server ) {
   console.log( "Connected to " + server.hostname + " (" + server.version + ")" );
  }).connect( function( error ) {

     if ( error ) {
       console.log( "Error on connect: " + error );
     }

     var that = this;
     this.query( "UPDATE USER SET PASSWORD = '" + vals.pass + "' WHERE EMPLOYEE_ID = '" + vals.userID + "'" ).
     execute( function( error, rows, cols ) {

      if ( error ) {
        console.log( "Error on select: " + error );
        return;
      }

      response.writeHead( 200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      });
      response.write( "Password Successfully Changed" );
      response.end();

      that.query( "INSERT INTO USER_HISTORY( USER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) VALUES( '" +
                  vals.userName + "', 'Change', 'Changed Password', '" + vals.userName + "', '" + helper.date() + "')" ).
      execute( function( error, rows, cols ) {

        if ( error ) {
          console.log( "Error in inserting into history: " + error );
          return;
        }
      });
    });
  });
}

function createUser( response ) {

  var vals = response.values;

  new mysql.Database({
    hostname: "localhost",
    user: "dave",
    password: "asdfa",
    database: "edwardst_inv"
  }).on( "error", function( error ) {
    console.log( "ERROR: " + error );
  }).on( "ready", function( server ) {
   console.log( "Connected to " + server.hostname + " (" + server.version + ")" );
  }).connect( function( error ) {

     if ( error ) {
       console.log( "Error on connect: " + error );
     }
console.log( vals );
     this.query( "INSERT INTO USER( USER_ID, PASSWORD, EMAIL, EMPLOYEE_ID, ROLE ) VALUES('" + vals.user + "', '" + vals.pass +
                 "', '" + vals.email + "', '" + " " + "', '" + vals.role + "')" ).
     execute( function( error, rows, cols ) {

      if ( error ) {
        console.log( "Error on select: " + error );
        return;
      }

      response.writeHead(200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
      });
      response.write( "User successfully added" );
      response.end();
    });
  });
}

function logs() {
  return "Logs";
}

function profile() {
  return "Profile";
}

function returnOrderLine() {
  return "Return Order Line";
}

function maintainPurchaseOrder() {
  return "Maintain Purchase Order";
}

function createPurchaseOrder() {
  return "Create Purchase Order";
}

function receivePurchaseOrder() {
  return "Receive Purchase Order";
}

function viewPurchaseOrder() {
  return "View Purchase Order";
}

function viewActivePurchaseOrders() {
  return "View Active Purchase Orders";
}

function createItem() {
  return "Create Item";
}

function maintainItem() {
  return "Maintain Item";
}

function createSupplierProfile() {
  return "Create Supplier Profile";
}

function maintainSupplierProfile() {
  return "Maintain Supplier Profile";
}

exports.index = index;
exports.login = login;
exports.logout = logout;
exports.profile = profile;
exports.logs = logs;
exports.createUser = createUser;
exports.returnOrderLine = returnOrderLine;
exports.maintainPurchaseOrder = maintainPurchaseOrder;
exports.createPurchaseOrder = createPurchaseOrder;
exports.receivePurchaseOrder = receivePurchaseOrder;
exports.viewPurchaseOrder = viewPurchaseOrder;
exports.viewActivePurchaseOrders = viewActivePurchaseOrders;
exports.createItem = createItem;
exports.maintainItem = maintainItem;
exports.createSupplierProfile = createSupplierProfile;
exports.maintainSupplierProfile = maintainSupplierProfile;
exports.changePassword = changePassword;
