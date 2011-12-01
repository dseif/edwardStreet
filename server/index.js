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
handle[ "/editaccount" ] = requestHandlers.editAccount;
handle[ "/admin/logs" ] = requestHandlers.logs;

//  User pages
handle[ "/createusercheckdupe" ] = requestHandlers.createUserCheckDupe;
handle[ "/createuser" ] = requestHandlers.createUser;
handle[ "/viewusers" ] = requestHandlers.viewUsers;
handle[ "/viewuserspage" ] = requestHandlers.viewUsersPage;
handle[ "/edituser" ] = requestHandlers.editUser;
handle[ "/deleteuser" ] = requestHandlers.deleteUser;

//  Item pages
handle[ "/createitemcheckdupe" ] = requestHandlers.createItemCheckDupe;
handle[ "/createitem" ] = requestHandlers.createItem;
handle[ "/viewitems" ] = requestHandlers.viewItems;
handle[ "/viewitemspage" ] = requestHandlers.viewItemsPage;
handle[ "/edititem" ] = requestHandlers.editItem;
handle[ "/deleteitem" ] = requestHandlers.deleteItem;

//  Supplier Pages
handle[ "/createsuppliercheckdupe" ] = requestHandlers.createSupplierCheckDupe;
handle[ "/createsupplier" ] = requestHandlers.createSupplier;
handle[ "/viewsuppliers" ] = requestHandlers.viewSuppliers;
handle[ "/viewsupplierspage" ] = requestHandlers.viewSuppliersPage;
handle[ "/editsupplier" ] = requestHandlers.editSupplier;
handle[ "/deletesupplier" ] = requestHandlers.deleteSupplier;

//  Purchase Order pages
handle[ "/createpurchaseorder" ] = requestHandlers.createPurchaseOrder;
handle[ "/viewpurchaseorder" ] = requestHandlers.viewPurchaseOrder;
handle[ "/viewpurchaseorderpage" ] = requestHandlers.viewPurchaseOrderPage;
handle[ "/editpurchaseorder" ] = requestHandlers.editPurchaseOrder;
handle[ "/cancelpurchaseorder" ] = requestHandlers.cancelPurchaseOrder;
handle[ "/receivepurchaseorder" ] = requestHandlers.receivePurchaseOrder;
handle[ "/returnpurchaseorder" ] = requestHandlers.returnPurchaseOrder;

server.start( router.route, handle );