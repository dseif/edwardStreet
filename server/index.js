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
handle[ "/item/createprice" ] = requestHandlers.createPrice;
handle[ "/item/viewprice" ] = requestHandlers.viewPrice;

//  Supplier Pages
handle[ "/createsuppliercheckdupe" ] = requestHandlers.createSupplierCheckDupe;
handle[ "/createsupplier" ] = requestHandlers.createSupplier;
handle[ "/viewsuppliers" ] = requestHandlers.viewSuppliers;
handle[ "/viewsupplierspage" ] = requestHandlers.viewSuppliersPage;
handle[ "/editsupplier" ] = requestHandlers.editSupplier;
handle[ "/deletesupplier" ] = requestHandlers.deleteSupplier;
handle[ "/supplier/createcontactperson" ] = requestHandlers.createContactPerson;
handle[ "/supplier/viewcontactperson" ] = requestHandlers.viewContactPerson;
handle[ "/supplier/editcontactperson" ] = requestHandlers.editContactPerson;
handle[ "/supplier/deletecontactperson" ] = requestHandlers.deleteContactPerson;
handle[ "/supplier/createaddress" ] = requestHandlers.createAddress;
handle[ "/supplier/viewaddress" ] = requestHandlers.viewAddress;
handle[ "/supplier/editaddress" ] = requestHandlers.editAddress;
handle[ "/supplier/deleteaddress" ] = requestHandlers.deleteAddress;

//  Purchase Order pages
handle[ "/createpurchaseorder" ] = requestHandlers.createPurchaseOrder;
handle[ "/viewpurchaseorders" ] = requestHandlers.viewPurchaseOrders;
handle[ "/viewpurchaseorderspage" ] = requestHandlers.viewPurchaseOrdersPage;
handle[ "/editpurchaseorder" ] = requestHandlers.editPurchaseOrder;
handle[ "/cancelpurchaseorder" ] = requestHandlers.cancelPurchaseOrder;
handle[ "/receivepurchaseorder" ] = requestHandlers.receivePurchaseOrder;
handle[ "/returnpurchaseorder" ] = requestHandlers.returnPurchaseOrder;

server.start( router.route, handle );
