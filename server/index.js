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
handle[ "/logout" ] = requestHandlers.logout;

//  Admin pages
handle[ "/createuser" ] = requestHandlers.createUser;
handle[ "/edituser" ] = requestHandlers.editUser;
handle[ "/deleteuser" ] = requestHandlers.deleteUser;
handle[ "/viewusers" ] = requestHandlers.viewUsers;
handle[ "/admin/logs" ] = requestHandlers.logs;

//  All logged in user pages
handle[ "/profile" ] = requestHandlers.profile;
handle[ "/changePassword" ] = requestHandlers.changePassword;

//  Purchase Order pages
handle[ "/purchaseorder/returnorderline" ] = requestHandlers.returnOrderLine;
handle[ "/purchaseorder/maintainpurchaseorder" ] = requestHandlers.maintainPurchaseOrder;
handle[ "/createpurchaseorder" ] = requestHandlers.createPurchaseOrder;
handle[ "/purchaseorder/receivepurchaseorder" ] = requestHandlers.receivePurchaseOrder;
handle[ "/purchaseorder/receivepurchaseorderpage" ] = requestHandlers.receivePurchaseOrderPage;
handle[ "/viewpurchaseorder" ] = requestHandlers.viewPurchaseOrder;
handle[ "/viewpurchaseorderpage" ] = requestHandlers.viewPurchaseOrderPage;
handle[ "/viewactivepurchaseorders" ] = requestHandlers.viewActivePurchaseOrders;

//  Item pages
handle[ "/items/createitem" ] = requestHandlers.createItem;
handle[ "/items/maintainitem" ] = requestHandlers.maintainItem;
handle[ "/viewitems" ] = requestHandlers.viewItems;
handle[ "/viewitemspage" ] = requestHandlers.viewItemsPage;


//  Supplier Pages
handle[ "/supplier/createsupplierprofile" ] = requestHandlers.createSupplierProfile;
handle[ "/supplier/maintainsupplierprofile" ] = requestHandlers.maintainSupplierProfile;
handle[ "/viewsupplier" ] = requestHandlers.viewSupplier;
handle[ "/viewsupplierpage" ] = requestHandlers.viewSupplierpage;
handle[ "/deletesupplier" ] = requestHandlers.deleteSupplier;

server.start( router.route, handle );
