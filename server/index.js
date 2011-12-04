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
handle[ "/getuser" ] = requestHandlers.getUser;
handle[ "/edituser" ] = requestHandlers.editUser;
handle[ "/deleteuser" ] = requestHandlers.deleteUser;

//  Item pages
handle[ "/createitemcheckdupe" ] = requestHandlers.createItemCheckDupe;
handle[ "/createitem" ] = requestHandlers.createItem;
handle[ "/viewitems" ] = requestHandlers.viewItems;
handle[ "/viewitemspage" ] = requestHandlers.viewItemsPage;
handle[ "/getitem" ] = requestHandlers.getItem;
handle[ "/edititem" ] = requestHandlers.editItem;
handle[ "/deleteitem" ] = requestHandlers.deleteItem;
handle[ "/item/createprice" ] = requestHandlers.createPrice;
handle[ "/item/viewprice" ] = requestHandlers.viewPrice;
handle[ "/item/getsupplierlist" ] = requestHandlers.getSupplierList;
handle[ "/item/getcategorylist" ] = requestHandlers.getCategoryList;

//  Supplier Pages
handle[ "/createsuppliercheckdupe" ] = requestHandlers.createSupplierCheckDupe;
handle[ "/createsupplier" ] = requestHandlers.createSupplier;
handle[ "/viewsuppliers" ] = requestHandlers.viewSuppliers;
handle[ "/viewsupplierspage" ] = requestHandlers.viewSuppliersPage;
handle[ "/getsupplier" ] = requestHandlers.getSupplier;
handle[ "/editsupplier" ] = requestHandlers.editSupplier;
handle[ "/deletesupplier" ] = requestHandlers.deleteSupplier;
handle[ "/supplier/createcontactperson" ] = requestHandlers.createContactPerson;
handle[ "/supplier/viewcontactperson" ] = requestHandlers.viewContactPerson;
handle[ "/supplier/getcontactperson" ] = requestHandlers.getContactPerson;
handle[ "/supplier/editcontactperson" ] = requestHandlers.editContactPerson;
handle[ "/supplier/deletecontactperson" ] = requestHandlers.deleteContactPerson;
handle[ "/supplier/createsupplieraddress" ] = requestHandlers.createSupplierAddress;
handle[ "/supplier/viewsupplieraddress" ] = requestHandlers.viewSupplierAddress;
handle[ "/supplier/getsupplieraddress" ] = requestHandlers.getSupplierAddress;
handle[ "/supplier/editsupplieraddress" ] = requestHandlers.editSupplierAddress;
handle[ "/supplier/deletesupplieraddress" ] = requestHandlers.deleteSupplierAddress;

//  Purchase Order pages
handle[ "/createpurchaseorder" ] = requestHandlers.createPurchaseOrder;
handle[ "/viewpurchaseorders" ] = requestHandlers.viewPurchaseOrders;
handle[ "/viewpurchaseorderspage" ] = requestHandlers.viewPurchaseOrdersPage;
handle[ "/getpurchaseorder" ] = requestHandlers.getPurchaseOrder;
handle[ "/editpurchaseorder" ] = requestHandlers.editPurchaseOrder;
handle[ "/submitpurchaseorder" ] = requestHandlers.submitPurchaseOrder;
handle[ "/cancelpurchaseorder" ] = requestHandlers.cancelPurchaseOrder;
handle[ "/receivepurchaseorder" ] = requestHandlers.receivePurchaseOrder;
handle[ "/returnpurchaseorder" ] = requestHandlers.returnPurchaseOrder;
handle[ "/po/createorderline" ] = requestHandlers.createOrderLine;
handle[ "/po/vieworderline" ] = requestHandlers.viewOrderLine;
handle[ "/po/getorderline" ] = requestHandlers.getOrderLine;
handle[ "/po/editorderline" ] = requestHandlers.editOrderLine;
handle[ "/po/createreturnline" ] = requestHandlers.createReturnLine;

server.start( router.route, handle );
