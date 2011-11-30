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

  var vals = response.values;

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

// Question: What is this?
function logs() {
  return "Logs";
}

// Question: What is this?
function profile() {
  return "Profile";
}

// Question: vals all correct? consistent? CHange into change password/email?
function changePassword( response ) {

  var vals = response.values;

  var that = this;
  helper.query( "UPDATE USER SET PASSWORD = '" + vals.pass + "' " +
                "WHERE EMPLOYEE_ID = '" + vals.userID + "'", 
				function( error, rows, cols ) {

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

    helper.query( "INSERT INTO USER_HISTORY( USER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
	              "VALUES( '" + vals.userName + "', 'Change', 'Changed Password', '" + vals.userName + "', '" + helper.date() + "')",
                  function( error, rows, cols ) {

      if ( error ) {
        console.log( "Error in inserting into history: " + error );
        return;
      }
    });
  });
}

// Create User - Step 1: Checks if current user_id already exists. Returns COUNT of 1 if it exists, Count of 0 if not.
// Question: vals.user correct? different vals? vals correct? May require standardization of vals across pages
function createUserCheckDupe( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(USER_ID) " +
                "FROM USER WHERE USER_ID = '" + vals.user + "'",
				function( error, rows, cols ) {
  
    if ( error ) {
      console.log( "Error on select: " + error );
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

// Create User - Step 2: Insert new user into USER table. Inserts log into USER_HISTORY table.
// Question: vals correct? May require standardization of vals across pages
function createUser( response ) {

  var vals = response.values;

  helper.query( "INSERT INTO USER( USER_ID, PASSWORD, EMAIL, EMPLOYEE_ID, ROLE ) " +
                "VALUES('" + vals.user + "', '" + vals.pass + "', '" + vals.email + "', '" + " " + "', '" + vals.role + "')",
				function( error, rows, cols ) {

    if ( error ) {
      console.log( "Error on select: " + error );
      return;
    }

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    response.write( "User " + vals.user + " successfully added." );
    response.end();
	
	helper.query( "INSERT INTO USER_HISTORY( USER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
	              "VALUES( '" + vals.userName + "', 'Create', 'New user created.', '" + vals.userName + "', '" + helper.date() + "')",
                  function( error, rows, cols ) {

      if ( error ) {
        console.log( "Error in inserting into history: " + error );
        return;
      }
    });
  });  
}

// View User  - Step 1: Returns number of users in USER table for page calculation.
function viewUsers( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM USER", function( error, rows, cols ) {

    if ( error ) {
      console.log( "Error on select: " + error );
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

// View User - Step 2: Returns a list of users for current page, ordered by USER_ID.
function viewUsersPage( response ) {

  var vals = response.values;

  helper.query( "SELECT u.USER_ID, u.EMAIL, u.EMPLOYEE_ID, u.ROLE, s.NAME " + 
                "FROM USER u LEFT JOIN SUPPLIER s ON u.SUPPLIER_ID = s.SUPPLIER_ID " + 
				"ORDER BY USER_ID " +
				"LIMIT " + (response.values.pagenum-1)*20 + ", 20",
				function( error, rows, cols ) {

    if ( error ) {
      console.log( "Error on select: " + error );
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

// Edit User - Update USER table with new user information for row USER_ID.
function editUser( response ) {

  var vals = response.values;
  console.log( vals.role, vals.username, vals.email, vals.userID );

  helper.query( "UPDATE USER SET USER_ID = '" + vals.username + "', EMAIL = '" + vals.email +
                "', ROLE = '" + vals.role + "' WHERE EMPLOYEE_ID = '" + vals.userID + "'",
				function( error, rows, cols ) {

    if ( error ) {
      console.log( "Error on select: " + error );
      return;
    }

    console.log( "User information successfully changed.", rows );
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    response.write( JSON.stringify( rows ) ); 
    response.end();
	
	helper.query( "INSERT INTO USER_HISTORY( USER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
	              "VALUES( '" + vals.userName + "', 'Change', 'Changed user information.', '" + vals.username + "', '" + helper.date() + "')",
                  function( error, rows, cols ) {

      if ( error ) {
        console.log( "Error in inserting into history: " + error );
        return;
      }
    });
  });
}

// Delete User - Delete selected user from USER table.
function deleteUser( response ) {

  var vals = response.values;
  console.log( vals.role, vals.username, vals.email, vals.userID );

  helper.query( "DELETE FROM USER TABLE "+
                "WHERE USER_ID = '" + vals.username + "'",
				function( error, rows, cols ) {

    if ( error ) {
      console.log( "Error on select: " + error );
      return;
    }

    console.log( "User deleted.", rows );
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    response.write( "User " + vals.userID + " successfully deleted." ); 
    response.end();
	
	helper.query( "INSERT INTO USER_HISTORY( USER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
                  "VALUES( '" + vals.username + "', 'Delete', 'Deleted " + vals.userID + ".', '" + vals.username + "', '" + helper.date() + "')",
                  function( error, rows, cols ) {

      if ( error ) {
        console.log( "Error in inserting into history: " + error );
        return;
      }
    });
  });
}

// Create Item - Step 1: Checks if current itemname+supplier already exists. Returns COUNT of 1 if it exists, Count of 0 if not.
// Question: vals.supplier_id? check on that
function createItemCheckDupe( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(ITEM_NAME) " +
                "FROM ITEM WHERE LOWER(ITEM_NAME) = LOWER('" + vals.item_name + "') AND SUPPLIER_ID = " + vals.supplier_id,
				function( error, rows, cols ) {
  
    if ( error ) {
      console.log( "Error on select: " + error );
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

// Create Item - Step 2: Insert new item into ITEM table. Inserts log into ITEM_HISTORY table.
// Question: vals correct? May require standardization of vals across pages
function createItem( response ) {

  var vals = response.values;

  helper.query( "INSERT INTO ITEM( DIST_CODE, ITEM_NAME, RECEIPT_NAME, CATEGORY, UNIT, ITEM_TYPE, COMMENT, SUPPLIER_ID, " +
                "U_MINOR_REPO, U_ACTIVE_INA, U_BIZERBA, U_BRAND, U_CASE_SIZE, U_COOKING_IN, U_COUNTRY, U_DESCRIPTO, U_EXPIRY_DAT, U_INGREDIENT, U_KEYWORDS, U_NOTES, U_ORDER, U_PLU, U_PRICE, U_SILVERWARE, U_SKU, U_STORAGE, U_STORAGE_TY, U_TYPE, U_UPC_CODE, U_PRICE_PER, U_TAX, U_SCALE) " +
                "VALUES('" + vals.dist_code + "', '" + vals.item_name + "', '" + vals.receipt_name + "', '" + vals.category + "', '" + vals.unit + "', '" + vals.item_type + "', '" + vals.comment + "', '" + vals.supplier_id +
				"', '" + vals.u_minor_repo + "', '" + vals.u_active_ina + "', '" + vals.u_bizerba + "', '" + vals.u_brand + "', '" + vals.u_case_size + "', '" + vals.u_cooking_in + "', '" + vals.u_country + "', '" + vals.u_descripto + "', '" + vals.u_expiry_dat + "', '" + vals.u_ingredient + "', '" + vals.u_keywords + "', '" + vals.u_notes + "', '" + vals.u_order + "', '" + vals.u_plu + "', '" + vals.u_price + "', '" + vals.u_silverware + "', '" + vals.u_sku + "', '" + vals.u_storage + "', '" + vals.u_storage_ty + "', '" + vals.u_type + "', '" + vals.u_upc_code + "', '" + vals.u_price_per + "', '" + vals.u_tax + "', '" + vals.u_scale + "')",
				function( error, rows, cols ) {

    if ( error ) {
      console.log( "Error on insert: " + error );
      return;
    }

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    response.write( "Item " + vals.item_name + " successfully added." );
    response.end();
	
	// get new item ID somehow
	var item_id;
	
	helper.query( "INSERT INTO ITEM_HISTORY( ITEM_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
	              "VALUES( '" + vals.item_id + "', 'Create', 'New item created.', '" + vals.userName + "', '" + helper.date() + "')",
                  function( error, rows, cols ) {

      if ( error ) {
        console.log( "Error in inserting into history: " + error );
        return;
      }
    });
  });  
}

function viewItems( response ) {

  helper.query( "SELECT COUNT(*) FROM ITEM", function (error, rows, cols) {

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

function viewItemsPage( response) {
  helper.query( "SELECT i.ITEM_ID, i.DIST_CODE, i.ITEM_NAME, i.RECEIPT_NAME, i.CATEGORY, i.UNIT, i.ITEM_TYPE, i.COMMENT, p.PRICE, s.NAME FROM ITEM i, SUPPLIER s, PRICE_HISTORY p WHERE i.SUPPLIER_ID = s.SUPPLIER_ID AND i.LATEST_PRICE = PRICE_ID ORDER BY i.ITEM_ID LIMIT " + (response.values.pagenum-1)*20 + ", 20", function( error, rows, cols ) {

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

function viewSupplierPage( response ) {
  
  helper.query( "SELECT * FROM SUPPLIER ORDER BY NAME LIMIT " + (response.pagenum-1)*20 + ", 20", function( error, rows, cols ) {

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

function createPurchaseOrder( response ) {
  var vals = response.values;

  helper.query( "INSERT INTO PURCHASE_ORDER( USER_ID, PASSWORD, EMAIL, EMPLOYEE_ID, ROLE ) VALUES('" + vals.user + "', '" + vals.pass +
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

function viewPurchaseOrders( response ) {

  helper.query( "SELECT COUNT(*) FROM PURCHASE_ORDER", function( error, rows, cols ) {
       
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

function viewPurchaseOrdersPage ( response ) {
  helper.query( "SELECT po.PO_ID, po.STATUS, po.CREATE_DATE, po.SUBMIT_DATE, po.DELIVERY_DATE, po.DELIVERY_TIME, po.RECEIVE_DATE, po.REF_NUMBER, po.COMMENT, s.NAME FROM PURCHASE_ORDER po, SUPPLIER s WHERE po.SUPPLIER_ID = s.SUPPLIER_ID ORDER BY po.PO_ID LIMIT " + (response.values.pagenum-1)*20 + ", 20", function( error, rows, cols ) {
       
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

function returnOrderLine() {
  return "Return Order Line";
}

function maintainPurchaseOrder() {
  return "Maintain Purchase Order";
}

function receivePurchaseOrder( response ) {
  helper.query( "SELECT COUNT(*) FROM PURCHASE_ORDER WHERE STATUS = 'Received'", function( error, rows, cols ) {
       
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

function receivePurchaseOrderPage( response ) {
  helper.query( "SELECT po.PO_ID, po.STATUS, po.CREATE_DATE, po.SUBMIT_DATE, po.DELIVERY_DATE, po.DELIVERY_TIME, po.RECEIVE_DATE, po.REF_NUMBER, po.COMMENT, s.SUPPLIER_NAME FROM PURCHASE_ORDER po, SUPPLIER s WHERE po.SUPPLIER_ID = s.SUPPLIER_ID AND po.STATUS = 'Submitted' ORDER BY po.PO_ID LIMIT " + (response.pagenum-1)*20 + ", 20", function( error, rows, cols ) {
       
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

exports.index = index;
exports.login = login;
exports.logout = logout;
exports.profile = profile;
exports.logs = logs;
exports.changePassword = changePassword;

exports.createUserCheckDupe = createUserCheckDupe;
exports.createUser = createUser;
exports.viewUsers = viewUsers;
exports.viewUsersPage = viewUsersPage;
exports.editUser = editUser;
exports.deleteUser = deleteUser;

exports.createItemCheckDupe = createItemCheckDupe;
exports.createItem = createItem;
exports.viewItems = viewItems;
exports.viewItemsPage = viewItemsPage;
//exports.editItem = editItem;
//exports.deleteItem = deleteItem;

//exports.createSupplierCheckDupe = createSupplierCheckDupe;
//exports.createSupplier = createSupplier;
exports.viewSuppliers = viewSupplier;
exports.viewSuppliersPage = viewSupplierPage;
//exports.editSupplier = editSupplier;
exports.deleteSupplier = deleteSupplier;

exports.createPurchaseOrder = createPurchaseOrder;
exports.viewPurchaseOrders = viewPurchaseOrder;
exports.viewPurchaseOrdersPage = viewPurchaseOrderPage;
//exports.editPurchaseOrder = editPurchaseOrder;

exports.returnOrderLine = returnOrderLine;

exports.receivePurchaseOrder = receivePurchaseOrder;
exports.receivePurchaseOrderPage = receivePurchaseOrderPage;


