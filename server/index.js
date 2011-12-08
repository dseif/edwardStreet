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
handle[ "/getuser" ] = requestHandlers.getUser;

//  User pages
handle[ "/createusercheckdupe" ] = requestHandlers.createUserCheckDupe;
handle[ "/createuser" ] = requestHandlers.createUser;
handle[ "/viewusers" ] = requestHandlers.viewUsers;
handle[ "/viewuserspage" ] = requestHandlers.viewUsersPage;
handle[ "/edituser" ] = requestHandlers.editUser;
handle[ "/deleteuser" ] = requestHandlers.deleteUser;

//  Item pages
handle[ "/createitem" ] = requestHandlers.createItem;
handle[ "/viewitems" ] = requestHandlers.viewItems;
handle[ "/viewitemspage" ] = requestHandlers.viewItemsPage;
handle[ "/getitem" ] = requestHandlers.getItem;
handle[ "/edititem" ] = requestHandlers.editItem;
handle[ "/deleteitem" ] = requestHandlers.deleteItem;
handle[ "/createprice" ] = requestHandlers.createPrice;
handle[ "/viewprice" ] = requestHandlers.viewPrice;
handle[ "/getsupplierlist" ] = requestHandlers.getSupplierList;
handle[ "/getcategorylist" ] = requestHandlers.getCategoryList;

//  Supplier Pages
handle[ "/createsuppliercheckdupe" ] = requestHandlers.createSupplierCheckDupe;
handle[ "/createsupplier" ] = requestHandlers.createSupplier;
handle[ "/viewsuppliers" ] = requestHandlers.viewSuppliers;
handle[ "/viewsupplierspage" ] = requestHandlers.viewSuppliersPage;
handle[ "/editsupplier" ] = requestHandlers.editSupplier;
handle[ "/deletesupplier" ] = requestHandlers.deleteSupplier;
handle[ "/createcontactperson" ] = requestHandlers.createContactPerson;
handle[ "/viewcontactperson" ] = requestHandlers.viewContactPerson;
handle[ "/editcontactperson" ] = requestHandlers.editContactPerson;
handle[ "/deletecontactperson" ] = requestHandlers.deleteContactPerson;
handle[ "/createsupplieraddress" ] = requestHandlers.createSupplierAddress;
handle[ "/viewsupplieraddress" ] = requestHandlers.viewSupplierAddress;
handle[ "/editsupplieraddress" ] = requestHandlers.editSupplierAddress;
handle[ "/deletesupplieraddress" ] = requestHandlers.deleteSupplierAddress;

//  Purchase Order pages
handle[ "/createpurchaseorder" ] = requestHandlers.createPurchaseOrder;
handle[ "/viewpurchaseorders" ] = requestHandlers.viewPurchaseOrders;
handle[ "/viewpurchaseorderspage" ] = requestHandlers.viewPurchaseOrdersPage;
handle[ "/editpurchaseorder" ] = requestHandlers.editPurchaseOrder;
handle[ "/submitpurchaseorder" ] = requestHandlers.submitPurchaseOrder;
handle[ "/cancelpurchaseorder" ] = requestHandlers.cancelPurchaseOrder;
handle[ "/receivepurchaseorder" ] = requestHandlers.receivePurchaseOrder;
handle[ "/returnpurchaseorder" ] = requestHandlers.returnPurchaseOrder;
handle[ "/createorderline" ] = requestHandlers.createOrderLine;
handle[ "/vieworderlines" ] = requestHandlers.viewOrderLines;
handle[ "/editorderline" ] = requestHandlers.editOrderLine;
handle[ "/deleteorderline" ] = requestHandlers.deleteOrderLine;
handle[ "/createreturnline" ] = requestHandlers.createReturnLine;
handle[ "/getitemlist" ] = requestHandlers.getItemList;
handle[ "/getpurchaseorder" ] = requestHandlers.getPurchaseOrder;

server.start( router.route, handle );
