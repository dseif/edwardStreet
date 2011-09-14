//  requestHandlers.js
//  Used to do all of the heavy lifting on our server
//  each function returns content for a different page

function index() {
  return "Index";
}

function login() {
  return "Login";
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
