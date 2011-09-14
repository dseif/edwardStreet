//  Index.js
//  Used to include files that we will need throughout our server
//  Stored in variables that get sent to our start function
var server = require( "./server" );
var router = require( "./router" );
var requestHandlers = require( "./requestHandlers" );

//  Create an object to store key/values pairs for navigation
var handle = {};

//  Default navigation pages
handle[ "/" ] = requestHandlers.index;
handle[ "/login" ] = requestHandlers.login;

//  Admin pages
handle[ "/admin/createuser" ] = requestHandlers.createUser;
handle[ "/admin/logs" ] = requestHandlers.logs;

//  All logged in user pages
handle[ "/profile" ] = requestHandlers.profile;

//  Purchase Order pages
handle[ "/purchaseorder/returnorderline" ] = requestHandlers.returnOrderLine;
handle[ "/purchaseorder/maintainpurchaseorder" ] = requestHandlers.maintainPurchaseOrder;
handle[ "/purchaseorder/createpurchaseorder" ] = requestHandlers.createPurchaseOrder;
handle[ "/purchaseorder/receivepurchaseorder" ] = requestHandlers.receivePurchaseOrder;
handle[ "/purchaseorder/viewpurchaseorder" ] = requestHandlers.viewPurchaseOrder;
handle[ "/purchaseorder/viewactivepurchaseorders" ] = requestHandlers.viewActivePurchaseOrders;

//  Item pages
handle[ "/items/createitem" ] = requestHandlers.createItem;
handle[ "/items/maintainitem" ] = requestHandlers.maintainItem;

//  Supplier Pages
handle[ "/supplier/createsupplierprofile" ] = requestHandlers.createSupplierProfile;
handle[ "/supplier/maintainsupplierprofile" ] = requestHandlers.maintainSupplierProfile;

server.start(router.route, handle);
