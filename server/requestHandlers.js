//  requestHandlers.js
//  Used to do all of the heavy lifting on our server
//  each function returns content for a different page

function index( response, cb ) {

  var mysql = require( "db-mysql" );
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

   this.query( "SELECT * FROM USER WHERE USER_ID = '" + response.values.user + "' AND PASSWORD = '" + response.values.pass + "'"  ).
   execute( function( error, rows, cols ) {

     if ( error ) {
       console.log( "Error on select: " + error );
       return;
     }

     cb && cb( !!rows.length );
   });
  });
}

function login( response ) {
     response.writeHead(200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
     });
     response.write( response.guid );
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

function createUser() {
  return "Create User";
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
