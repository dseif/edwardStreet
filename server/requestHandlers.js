//  requestHandlers.js
//  Used to do all of the heavy lifting on our server
//  each function returns content for a different page

var mysql = require( "db-mysql" );

//  Helper object to store utility functions
var helper = {

  //  Helper function to return the proper date string to be inserted into the database
  date: function() {

    var cur = new Date();
    return cur.getFullYear() + "-" + cur.getMonth() + "-" + cur.getDate() + " " +
           cur.getHours() + ":" + cur.getMinutes() + ":00";
  },
  //  function to make database calls for us
  query: function( queryString, callback ) {
    
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

      this.query( queryString ).
      execute( function( error, rows, cols ) { callback( error, rows, cols ) });
    });
  }
}

function index( response, cb ) {

  console.log( "INDINEDED" );
  var vals = response.values;
  console.log( vals.user );

  helper.query( "SELECT * FROM USER WHERE USER_ID = '" + vals.user + "' AND PASSWORD = '" + vals.pass + "'", function( error, rows, cols ) {

    if ( error ) {
      console.log( "Error on select: " + error );
      return;
    }

    vals.id = rows[ 0 ] && rows[ 0 ].EMPLOYEE_ID;
    vals.userName = rows[ 0 ] && rows[ 0 ].USER_ID;
    vals.role = rows[ 0 ] && rows[ 0 ].ROLE;

    console.log( !!rows.length );
    cb && cb( !!rows.length );
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

  var that = this;
  helper.query( "UPDATE USER SET PASSWORD = '" + vals.pass + "' WHERE EMPLOYEE_ID = '" + vals.userID + "'", function( error, rows, cols ) {

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

    helper.query( "INSERT INTO USER_HISTORY( USER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) VALUES( '" +
                  vals.userName + "', 'Change', 'Changed Password', '" + vals.userName + "', '" + helper.date() + "')",
                  function( error, rows, cols ) {

      if ( error ) {
        console.log( "Error in inserting into history: " + error );
        return;
      }
    });
  });
}

function createUser( response ) {

  var vals = response.values;

  helper.query( "INSERT INTO USER( USER_ID, PASSWORD, EMAIL, EMPLOYEE_ID, ROLE ) VALUES('" + vals.user + "', '" + vals.pass +
                 "', '" + vals.email + "', '" + " " + "', '" + vals.role + "')", function( error, rows, cols ) {

    if ( error ) {
      console.log( "Error on select: " + error );
      return;
    }

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    response.write( "User successfully added" );
    response.end();
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

function viewPurchaseOrder( response) {

  helper.query( "SELECT * FROM PURCHASE_ORDER", function( error, rows, cols ) {
       
    if ( error ) {
      console.log( "Error in select statement: " + error );
      return;
    }

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    response.write( JSON.stringify( rows ) );
    response.end();
  });
}

function viewActivePurchaseOrders( response ) {

  helper.query( "SELECT * FROM PURCHASE_ORDER WHERE STATUS = 'open'", function( error, rows, cols ) {
     
    if ( error ) {
      console.log( "error: " + error );
      return;
    }

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    response.write( JSON.stringify( rows ) );
    response.end();
  });
}

function createItem() {
  return "Create Item";
}

function maintainItem() {
  return "Maintain Item";
}

function createSupplierProfile( response ) {

  /*var vals = response.values;

  helper.query( "INSERT INTO SUPPLIER( name, legal_name, lead_time, supplier_comment, special_comment ) VALUES( '" +
                vals.name + "', '" + vals.legal_name + "', '" + vals.lead_time + "', '" + vals.supplier_comment "', '" +
                vals.special_comment + "'", function( error, rows, cols ) {

                  if ( error ) {
                    console.log( error );
                  }

  });*/ 
}

function viewItems( response ) {
  
  helper.query( "SELECT * FROM ITEM", function( error, rows, cols ) {

    if ( error ) {
      console.log( error );
    }

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });

    response.write( JSON.stringify( rows ) );
    response.end();
  });
}

function maintainSupplierProfile() {
  return "Maintain Supplier Profile";
}

function deleteSupplier( response ) {

  var vals = response.values;

  helper.query( "DELETE FROM supplier WHERE supplier_id = '" + vals.supplierID + "'", function( error, rows, cols ) {

    if ( error ) {
      console.log( error );
    }

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    response.write( true ); 
    response.end();
  });
}

function viewSupplier( response ) {
  
  helper.query( "SELECT * FROM SUPPLIER", function( error, rows, cols ) {

    if ( error ) {
      console.log( error );
    }

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    response.write( JSON.stringify( rows ) );
    response.end();
  });
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
exports.viewSupplier = viewSupplier;
exports.deleteSupplier = deleteSupplier;
exports.createItem = createItem;
exports.maintainItem = maintainItem;
exports.viewItems = viewItems;
exports.createSupplierProfile = createSupplierProfile;
exports.maintainSupplierProfile = maintainSupplierProfile;
exports.changePassword = changePassword;
