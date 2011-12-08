//  requestHandlers.js
//  Used to do all of the heavy lifting on our server
//  each function returns content for a different page
var mysql = require( "db-mysql" );

//  Helper object to store utility functions
var helper = {

  //  Helper function to return the proper date string to be inserted into the database
  date: function() {

    var cur = new Date();
    return cur.getFullYear() + "-" + (cur.getMonth()+1) + "-" + cur.getDate() + " " +
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

// create an entry in respective history log tables
var historyLog = {
  user: function ( vals, category, comment ) {
  
    helper.query( "INSERT INTO USER_HISTORY( USER_ID, CATEGORY, COMMENT, AUTHOR ) " +
                  "VALUES( '" + vals.user_id + "', '" + category + "', '" + comment + 
                  "', '" + vals.userName + "' )",
                  function( error, rows, cols ) {
                  
      console.log( "debug:: historyLog - INSERT INTO USER_HISTORY " + rows );

      if ( error ) {
        console.log( "Error on INSERT into USER_HISTORY: " + error );
      }
        
    });
  },
  
  supplier: function ( vals, category, comment ) {
  
    helper.query( "INSERT INTO SUPPLIER_HISTORY( SUPPLIER_ID, CATEGORY, COMMENT, AUTHOR ) " +
                  "VALUES( '" + vals.supplier_id + "', '" + category + "', '" + comment +
                  "', '" + vals.userName + "' )",
                  function( error, rows, cols ) {

      console.log( "debug:: historyLog - INSERT INTO SUPPLIER_HISTORY " + rows );
                  
      if ( error ) {
        console.log( "Error on INSERT into SUPPLIER_HISTORY: " + error );
      }

    });
  },
  
  item: function ( vals, category, comment ) {
  
    helper.query( "INSERT INTO ITEM_HISTORY( ITEM_ID, CATEGORY, COMMENT, AUTHOR ) " +
                  "VALUES( '" + vals.item_id + "', '" + category + "', '" + comment + 
                  "', '" + vals.userName + "' )",
                  function( error, rows, cols ) {

      console.log( "debug:: historyLog - INSERT INTO ITEM_HISTORY " + rows );
                  
      if ( error ) {
        console.log( "Error on INSERT into ITEM_HISTORY: " + error );
      }

    });
  },
  
  po: function ( vals, category, comment ) {
  
    helper.query( "INSERT INTO PO_HISTORY( PO_ID, CATEGORY, COMMENT, AUTHOR ) " +
                  "VALUES( '" + vals.po_id + "', '" + category + "', '" + comment + 
                  "', '" + vals.userName + "' )",
                  function( error, rows, cols ) {

      console.log( "debug:: historyLog - INSERT INTO PO_HISTORY " + rows );
                  
      if ( error ) {
        console.log( "Error on INSERT into PO_HISTORY: " + error );
      }

    });
  }  
}

function index( response, cb ) {

  var vals = response.values;

  helper.query( "SELECT * FROM USER " +
				"WHERE USER_ID = '" + vals.user + "' AND PASSWORD = '" + vals.pass + "'",
				function( error, rows, cols ) {

    console.log( "debug:: index - SELECT FROM USER " + rows );
        
    if ( error ) {
      console.log( "Error on SELECT FROM USER: " + error );
      return;
    }

    vals.userID = rows[ 0 ] && rows[ 0 ].EMPLOYEE_ID;
    vals.userName = rows[ 0 ] && rows[ 0 ].USER_ID;
    vals.curRole = rows[ 0 ] && rows[ 0 ].ROLE;

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

// View User History - Step 1: Returns number of entries in USER_HISTORY table for page calculation.
function viewUserHistory( response ) {
  
  var vals = response.values;
  
  helper.query( "SELECT COUNT(*) FROM USER_HISTORY",
                function( error, rows, cols ) {

    console.log( "debug:: viewUserHistory - SELECT FROM USER_HISTORY " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");  
      console.log( "Error on SELECT from USER_HISTORY: " + error );
      response.write( "Error occured while trying to load the page." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }
    
    response.end();   
  });
}

// View User History Step 2: Returns a list of entries for current page, starting with latest action.
function viewUserHistoryPage( response ) {

  var vals = response.values;
  
  helper.query( "SELECT USER_ID 'User Account', CATEGORY 'Action Type', COMMENT 'Comment', " +
                "AUTHOR 'Action By', LOG_DATE 'Date' FROM USER_HISTORY" +
                "ORDER BY LOG_DATE DESC LIMIT " + (vals.pagenum-1)*20 + ", 20",
                function( error, rows, cols ) {
  
    console.log( "debug:: viewUserHistoryPage - SELECT FROM USER_HISTORY " + rows );
  
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from USER_HISTORY: " + error );
      response.write( "Error occured while trying to load the page." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }
  
    response.end();
  });
}

// View Item History - Step 1: Returns number of entries in ITEM_HISTORY table for page calculation.
function viewItemHistory( response ) {
  
  var vals = response.values;
  
  helper.query( "SELECT COUNT(*) FROM ITEM_HISTORY",
                function( error, rows, cols ) {

    console.log( "debug:: viewItemHistory - SELECT FROM ITEM_HISTORY " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");  
      console.log( "Error on SELECT from ITEM_HISTORY: " + error );
      response.write( "Error occured while trying to load the page." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }
    
    response.end();   
  });
}

// View Item History Step 2: Returns a list of entries for current page, starting with latest action.
function viewItemHistoryPage( response ) {

  var vals = response.values;
  
  helper.query( "SELECT h.ITEM_ID 'Item ID', i.ITEM_NAME 'Item Name', h.CATEGORY 'Action Type', h.COMMENT 'Comment', " +
                "AUTHOR 'Action By', LOG_DATE 'Date' FROM ITEM_HISTORY h" +
                "LEFT OUTER JOIN ITEM i ON h.ITEM_ID = i.ITEM_ID " +
                "ORDER BY LOG_DATE DESC LIMIT " + (vals.pagenum-1)*20 + ", 20",
                function( error, rows, cols ) {
  
    console.log( "debug:: viewItemHistoryPage - SELECT FROM ITEM_HISTORY " + rows );
  
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from USER_HISTORY: " + error );
      response.write( "Error occured while trying to load the page." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }
  
    response.end();
  });
}

// View Supplier History - Step 1: Returns number of entries in SUPPLIER_HISTORY table for page calculation.
function viewSupplierHistory( response ) {
  
  var vals = response.values;
  
  helper.query( "SELECT COUNT(*) FROM SUPPLIER_HISTORY",
                function( error, rows, cols ) {

    console.log( "debug:: viewSupplierHistory - SELECT FROM SUPPLIEr_HISTORY " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");  
      console.log( "Error on SELECT from SUPPLIER_HISTORY: " + error );
      response.write( "Error occured while trying to load the page." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }
    
    response.end();   
  });
}

// View Supplier History Step 2: Returns a list of entries for current page, starting with latest action.
function viewSupplierHistoryPage( response ) {

  var vals = response.values;
  
  helper.query( "SELECT h.SUPPLIER_ID 'Supplier ID', s.NAME 'Supplier Name', h.CATEGORY 'Action Type', h.COMMENT 'Comment', " +
                "h.AUTHOR 'Action By', h.LOG_DATE 'Date' FROM SUPPLIER_HISTORY h " +
                "LEFT OUTER JOIN SUPPLIER s ON h.SUPPLIER_ID = s.SUPPLIER_ID " +
                "ORDER BY LOG_DATE DESC LIMIT " + (vals.pagenum-1)*20 + ", 20",
                function( error, rows, cols ) {

    console.log( "debug:: viewSupplierHistoryPage - SELECT FROM SUPPLIER_HISTORY " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from SUPPLIER_HISTORY: " + error );
      response.write( "Error occured while trying to load the page." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }
  
    response.end();
  });
}

// View PO History - Step 1: Returns number of entries in PO_HISTORY table for page calculation.
function viewPOHistory( response ) {
  
  var vals = response.values;
  
  helper.query( "SELECT COUNT(*) FROM PO_HISTORY",
                function( error, rows, cols ) {

    console.log( "debug:: viewPOHistory - SELECT FROM PO_HISTORY " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");  
      console.log( "Error on SELECT from PO_HISTORY: " + error );
      response.write( "Error occured while trying to load the page." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }
    
    response.end();   
  });
}

// View Supplier History Step 2: Returns a list of entries for current page, starting with latest action.
function viewPOHistoryPage( response ) {

  var vals = response.values;
  
  helper.query( "SELECT PO_ID 'PO ID', CATEGORY 'Action Type', COMMENT 'comment', " +
                "AUTHOR 'Action By', LOG_DATE 'Date' FROM PO_HISTORY " +
                "ORDER BY LOG_DATE DESC LIMIT " + (vals.pagenum-1)*20 + ", 20",
                function( error, rows, cols ) {
  
    console.log( "debug:: viewPOHistoryPage - SELECT FROM PO_HISTORY " + rows );
  
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT FROM PO_HISTORY: " + error );
      response.write( "Error occured while trying to load the page." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }
  
    response.end();
  });
}

// Edit Account - allow current user to change his password/email.
function editAccount( response ) {

  var vals = response.values;
  
  helper.query( "UPDATE USER SET PASSWORD = '" + vals.password + "', EMAIL = '" + vals.email + "' " +
                "WHERE USER_ID = '" + vals.userName + "'", 
                function( error, rows, cols ) {

    console.log( "debug:: editAccount - UPDATE USER " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });

    if ( error ) {
      console.log( "Error on UPDATE USER: " + error );
      response.write( "Error occured while trying to change password/email." );
    } else {
      console.log( "Changed password/email." );
      response.write( "Password/email Successfully Changed" );
    }

    response.end();
  });
}

// Create User - Step 1: Checks if current user_id already exists. Returns COUNT of 1 if it exists, Count of 0 if not.
function createUserCheckDupe( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM USER WHERE USER_ID = '" + vals.user_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: createUserCheckDupe - SELECT FROM USER " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
        
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT FROM USER: " + error );
      response.write( "Error occured while trying to create user." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }
    
    response.end();
  });
}

// Create User - Step 2: Insert new user into USER table. Inserts log into USER_HISTORY table.
function createUser( response ) {

  var vals = response.values;

  helper.query( "INSERT INTO USER( USER_ID, PASSWORD, EMAIL, EMPLOYEE_ID, ROLE, SUPPLIER_ID ) " +
                "VALUES('" + vals.user_id + "', '" + vals.password + "', '" + vals.email +
                "', '" + vals.employee_id + "', '" + vals.role + "', '" + vals.supplier_id + "' )",
                function( error, rows, cols ) {

    console.log( "debug:: createUser - INSERT INTO USER " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( "Error on INSERT into USER: " + error );
      response.write( "Error occured while trying to create user." );
    } else {
      console.log( "Created new user: " + vals.user_id );
      response.write( JSON.stringify( rows ) );
      response.write( "New user successfully created." );
    }
    
    response.end();
  });  
}

// View User - Step 1: Returns number of users in USER table for page calculation.
function viewUsers( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM USER",
                function( error, rows, cols ) {

    console.log( "debug:: viewUsers - SELECT FROM USER " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");  
      console.log( "Error on SELECT from USER: " + error );
      response.write( "Error occured while trying to load the page." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }
    
    response.end();    
  });
}

// View User - Step 2: Returns a list of users for current page, ordered by USER_ID.
function viewUsersPage( response ) {

  var vals = response.values;

  helper.query( "SELECT u.USER_ID 'User Login', u.EMAIL 'Email Address', u.EMPLOYEE_ID 'Employee ID', u.ROLE 'Role', s.NAME 'Associated Supplier'" + 
                "FROM USER u LEFT JOIN SUPPLIER s ON u.SUPPLIER_ID = s.SUPPLIER_ID " + 
                "ORDER BY USER_ID " +
                "LIMIT " + (vals.pagenum-1)*20 + ", 20",
                function( error, rows, cols ) {

    console.log( "debug:: viewUsersPage - SELECT FROM USER " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from USER, SUPPLIER: " + error );
      response.write( "Error occured while trying to load the page." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }  

    response.end();
  });
}

// Edit User - Update USER table with new user information for row USER_ID.
// Question: console.log may print password?
function editUser( response ) {

  var vals = response.values;

  helper.query( "UPDATE USER SET USER_ID = '" + vals.user_id + "', EMAIL = '" + vals.email +
                "', EMPLOYEE_ID = '" + vals.employee_id + "', ROLE = '" + vals.role + "' " +
                "WHERE USER_ID = '" + vals.old_user_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: editUser - UPDATE USER " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
    
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( "Error on UPDATE USER: " + error );
      response.write( "Error occured while trying to change user information." );
    } else {
      console.log( "Changed user information: ", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "User information succussfully changed." );
      //historyLog.user( vals, "Change", "Changed user information." );      
    }
    
    response.end();
  });
}

// Delete User - Delete selected user from USER table.
function deleteUser( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM USER WHERE USER_ID = '" + vals.user_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: deleteUser - DELETE FROM USER " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
    
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( "Error on DELETE from USER: " + error );
      response.write( "Error occured while trying to delete user." );
    } else {
      console.log( "Deleted user: ", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "User successfully deleted." ); 
      //historyLog.user( vals, "Delete", "Deleted user." );
    }

    response.end();
  });
}

// Create Item - Step 1: Checks if current itemname+supplier already exists. Returns COUNT of 1 if it exists, Count of 0 if not.
function createItemCheckDupe( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM ITEM " +
                "WHERE LOWER(ITEM_NAME) = LOWER('" + vals.item_name + "') AND SUPPLIER_ID = '" + vals.supplier_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: createItemCheckDupe - SELECT FROM ITEM " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT ITEM: " + error );
      response.write( "Error occured while trying to create item." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }

    response.end();
  });
}

// Create Item - Step 2: Insert new item into ITEM table. Inserts log into ITEM_HISTORY table.
function createItem( response ) {

  var vals = response.values;

  helper.query( "INSERT INTO ITEM( DIST_CODE, ITEM_NAME, RECEIPT_NAME, CATEGORY, UNIT, ITEM_TYPE, COMMENT, SUPPLIER_ID ) " +
                "VALUES('" + vals.dist_code + "', '" + vals.item_name + "', '" + vals.receipt_name +
                "', '" + vals.category + "', '" + vals.unit + "', '" + vals.item_type + "', '" + vals.comment +
                "', '" + vals.supplier_id + "' )",
                function( error, rows, cols ) {

    console.log( "debug:: createItem - INSERT INTO ITEM " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });

    if ( error ) {
      console.log( "Error on INSERT into ITEM: " + error );
      response.write( "Error occured while trying to create item." );
    } else {
      console.log("Created new item: " + vals.item_name );
      response.write( JSON.stringify( rows ) );
    }
    
    response.end();
  });  
}

// View Items - Step 1: Returns number of items in ITEM table for page calculation.
function viewItems( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM ITEM",
                function ( error, rows, cols ) {

    console.log( "debug:: viewItems - SELECT FROM ITEM " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });

    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from ITEM: " + error );
      response.write( "Error occured while trying to load page." );
    } else {
      response.write( JSON.stringify( rows ) );
    }
    
    response.end();
  });
}

// View Items - Step 2: Returns a list of users for current page, ordered by Item_Name.
function viewItemsPage( response) {

  var vals = response.values;

  helper.query( "SELECT i.ITEM_ID 'Item ID', i.DIST_CODE 'Distribution Code', " +
                "i.ITEM_NAME 'Item Name', i.RECEIPT_NAME 'Receipt Name', " +
                "i.CATEGORY 'Item Category', i.UNIT 'Sales Unit', i.ITEM_TYPE 'Department', " +
                "i.COMMENT 'Comments', p.PRICE 'Latest Price', s.NAME 'Supplier' " +
                "FROM ITEM i LEFT OUTER JOIN SUPPLIER s ON i.SUPPLIER_ID = s.SUPPLIER_ID " +
                "LEFT OUTER JOIN PRICE_HISTORY p ON i.LATEST_PRICE = PRICE_ID " +
                "ORDER BY i.ITEM_NAME LIMIT " + (vals.pagenum-1)*20 + ", 20",
                function( error, rows, cols ) {

    console.log( "debug:: viewItemsPage - SELECT FROM ITEM " + rows );
                    
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });

    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from ITEM, SUPPLIER, PRICE_HISTORY: " + error );
      response.write( "Error occured while trying to load page." );
    } else {
      response.write( JSON.stringify( rows ) );
    }

    response.end();
  });
}

// Edit Item - Update ITEM table with new item information for row ITEM_ID.
function editItem( response ) {

  var vals = response.values;

  helper.query( "UPDATE ITEM SET DIST_CODE = '" + vals.dist_code + "', ITEM_NAME = '" + vals.item_name +
                "', RECEIPT_NAME = '" + vals.receipt_name + "', CATEGORY = '" + vals.category +"', UNIT = '" + vals.unit +
                "', ITEM_TYPE = '" + vals.item_type + "', COMMENT = '" + vals.comment + "', SUPPLIER_ID = '" + vals.supplier_id +
                "' WHERE ITEM_ID = '" + vals.item_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: editItem - UPDATE ITEM " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");  

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });    

    if ( error ) {
      console.log( "Error on UPDATE ITEM: " + error );
      response.write( "Error occured while trying to change item information." );
    } else {
      console.log( "Changed item information: ", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Item information succussfully changed." );
      //historyLog.item( vals, "Change", "Changed item information.");
    }

    response.end();
  });
}

// Delete Item - Delete selected item from ITEM table.
function deleteItem( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM ITEM WHERE ITEM_ID = '" + vals.item_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: deleteItem - DELETE FROM ITEM " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
    
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( "Error on DELETE from ITEM: " + error );
      response.write( "Error occured while trying to delete item." );
    } else {
      console.log( "Deleted item: ", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Item successfully deleted." ); 
      //historyLog.item( vals, "Delete", "Deleted item." );
    }

    response.end();
  });
}
  
// Create Price - creates a new entry in price_history and update the item with the new price_id.
function createPrice ( response ) {

  var vals = response.values;
  
  // create a new price entry
  helper.query( "INSERT INTO PRICE_HISTORY( ITEM_ID, PRICE, AUTHOR) " +
                "VALUES ( '" + vals.item_id + "', " + vals.price + ", '" + vals.userName + "' )", 
                function( error, rows, cols ) {

    console.log( "debug:: createPrice - INSERT INTO PRICE_HISTORY " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
  
    if ( error ) {
      console.log( "Error on INSERT into PRICE_HISTORY: " + error );
      response.write( "Error occured while trying to change price." );
    } else {
    console.log( "Created new price." );
    // get price_id of the price just created.
      
    vals.price_id = rows["id"];
          
    // update item with new price_id
      helper.query( "UPDATE ITEM SET LATEST_PRICE = '" + vals.price_id + "' WHERE ITEM_ID = '" + vals.item_id + "'",
        function( error, rows, cols ) {
                        
        console.log( "debug:: createPrice - UPDATE ITEM " + rows );
            
        if ( error ) {
          console.log( "Error on UPDATE ITEM with new price: " + error );
        } else {
          console.log( "Price changed on item: " + vals.item_id );
          //historyLog( vals, "Change", "Changed price." );
        }
      });
    }

    response.end();
  });
}

// View Price - Display list of 20 latest prices for the current item_id
function viewPrice ( response ) {

  var vals = response.values;
  
  helper.query( "SELECT PRICE, LOG_DATE FROM PRICE_HISTORY WHERE ITEM_ID = '" + vals.item_id + "' " +
                "ORDERED BY LOG_DATE DESC LIMIT 20",
                function( error, rows, cols ) {

    console.log( "debug:: viewPrice - SELECT FROM PRICE_HISTORY() " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });

    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from PRICE_HISTORY: " + error );
      response.write( "Error occured while trying to load page." );
    } else {
      response.write( JSON.stringify( rows ) );
    }

    response.end();
  });
}

// Create Supplier - Step 1: Checks if current supplier_name already exists. Returns COUNT of 1 if it exists, Count of 0 if not.
function createSupplierCheckDupe( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM SUPPLIER WHERE LOWER(NAME) = LOWER('" + vals["name"] + "')",
                function( error, rows, cols ) {

    console.log( "debug:: createSupplierCheckDupe - SELECT FROM SUPPLIER " + rows );
    
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
        
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on select from SUPPLIER: " + error );
      response.write( "Error occured while trying to create supplier." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }

    response.end();
  });
}

// Create Supplier - Step 2: Insert new supplier into SUPPLIER table. Inserts log into SUPPLIER_HISTORY table.
function createSupplier( response ) {

  var vals = response.values;

  helper.query( "INSERT INTO SUPPLIER( NAME, LEGAL_NAME, LEAD_TIME, SUPPLIER_COMMENT, SPECIAL_COMMENT ) " +
                "VALUES('" + vals["name"] + "', '" + vals.legal_name + "', '" + vals.lead_time +
                "', '" + vals.supplier_comment + "', '" + vals.special_comment + "')",
                function( error, rows, cols ) {

    console.log( "debug:: createSupplier - SELECT FROM SUPPLIER " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")" );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( "Error on INSERT into SUPPLIER: " + error );
      response.write( "Error occured while trying to create supplier." );
    } else {
      console.log( "Created new supplier: " + vals.user_id );
      response.write( JSON.stringify( rows ) );
      response.write( "New supplier successfully created." );
    }

    response.end();
  });
}

// View Supplier - Step 1: Return number of suppliers in SUPPLIER table for page calculation.
function viewSuppliers( response ) {
  
  helper.query( "SELECT COUNT(*) FROM SUPPLIER",
                function( error, rows, cols ) {

    console.log( "debug:: viewSuppliers - SELECT FROM SUPPLIER " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from SUPPLIER: " + error );
      response.write( "Error occured while trying to load page." );
    } else {
      response.write( JSON.stringify( rows ) );
    }

    response.end();
  });
}

// View Supplier - Step 2: Returns a list of suppliers for current page, ordered by name
function viewSuppliersPage( response ) {
  
  var vals = response.values;
  helper.query( "SELECT SUPPLIER_ID, NAME 'Supplier Name', LEGAL_NAME 'Legal Name', " + 
                "LEAD_TIME 'Lead Time', SUPPLIER_COMMENT 'Supplier Comments', " +
                "SPECIAL_COMMENT 'Special Comments' " + 
                "FROM SUPPLIER ORDER BY NAME LIMIT " + (vals.pagenum-1)*20 + ", 20", 
                function( error, rows, cols ) {

    console.log( "debug:: viewSuppliersPage - SELECT FROM SUPPLIER " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from SUPPLIER: " + error );
      response.write( "Error occured while trying to load page." );
    } else {
      response.write( JSON.stringify( rows ) );
    }

    response.end();
  });
}

// Edit Supplier - Update SUPPLIER table with new item information for row SUPPLIER_ID.
function editSupplier( response ) {

  var vals = response.values;

  helper.query( "UPDATE SUPPLIER SET NAME = '" + vals.name + "', LEGAL_NAME = '" + vals.legal_name +
                "', LEAD_TIME = '" + vals.lead_time + "', SUPPLIER_COMMENT = '" + vals.supplier_comment +
                "', SPECIAL_COMMENT = '" + vals.special_comment + "'" +
                "WHERE SUPPLIER_ID = '" + vals.supplier_id + "'",
                function( error, rows, cols ) {
  
    console.log( "debug:: editSupplier - UPDATE SUPPLIER " + rows );
  
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");  

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });    

    if ( error ) {
      console.log( "Error on UPDATE SUPPLIER: " + error );
      response.write( "Error occured while trying to change supplier information." );
    } else {
      console.log( "Changed supplier information: ", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Supplier information succussfully changed." );
      //historyLog.supplier( vals, "Change", "Changed supplier information." );
    }

    response.end();
  });
}

// Delete Supplier - Delete selected supplier from SUPPLIER Table.
function deleteSupplier( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM SUPPLIER WHERE SUPPLIER_ID = '" + vals.supplier_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: deleteSupplier - DELETE FROM SUPPLIER " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
    
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( "Error on DELETE from SUPPLIER: " + error );
      response.write( "Error occured while trying to delete supplier." );
    } else {
      console.log( "Deleted supplier: ", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Supplier successfully deleted." ); 
      //historyLog.supplier( vals, "Delete", "Deleted supplier." );
    }

    response.end();
  });
}

// Create Contact Person - create a new contact person
function createContactPerson ( response ) {

  var vals = response.values;

  helper.query( "INSERT INTO CONTACT_PERSON ( SUPPLIER_ID, LAST_NAME, FIRST_NAME, PHONE_NUMBER, EMAIL ) " +
                "VALUES( '" + vals.supplier_id + "', '" + vals.last_name + "', '" + vals.first_name +
                "', '" + vals.phone_number + "', '" + vals.email + "' )",
                function( error, rows, cols ) {

    console.log( "debug:: createContactPerson - INSERT INTO CONTACT_PERSON " + rows );
    
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });

    if ( error ) {
      console.log( "Error on INSERT into CONTACT_PERSON: " + error );
      response.write( "Error occured while trying to create contact person." );
    } else {
      console.log("Created new contact person: " + rows );
      response.write( JSON.stringify( rows ) );
      response.write( "New contact person successfully created." );
      //historyLog.supplier( vals, "Change", "Created new contact person." );
    }
    
    response.end();
  });  
}

// View Contact Person - return info of contact person(s) for supplier_id
function viewContactPerson ( response ) {

  var vals = response.values;

  helper.query( "SELECT CONTACT_PERSON_ID, LAST_NAME 'Last Name', FIRST_NAME 'First Name', " +
                "PHONE_NUMBER 'Phone Number', EMAIL 'Email Address' FROM CONTACT_PERSON " +
                "WHERE SUPPLIER_ID = '" + vals.supplier_id + "' ORDER BY LAST_NAME",
                function( error, rows, cols ) {

    console.log( "debug:: viewContactPerson- SELECT FROM CONTACT_PERSON " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from CONTACT_PERSON: " + error );
      response.write( "Error occured while trying to load contact person(s)." );
    } else {
      response.write( JSON.stringify( rows ) );
    }

    response.end();
  });
}

// Edit Contact Person - change a contact person's information.
function editContactPerson ( response ) {

  var vals = response.values;

  helper.query( "UPDATE CONTACT_PERSON SET LAST_NAME = '" + vals.last_name + "', FIRST_NAME ='" + vals.first_name +
                "', PHONE_NUMBER = '" + vals.phone_number + "', EMAIL = '" + vals.email + "' " +
                "WHERE CONTACT_PERSON_ID = '" + vals.contact_person_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: editContactPerson - UPDATE CONTACT_PERSON " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");  

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });    

    if ( error ) {
      console.log( "Error on UPDATE CONTACT_PERSON: " + error );
      response.write( "Error occured while trying to change contact person information." );
    } else {
      console.log( "Changed contact person information: ", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Contact person information succussfully changed." );
      //historyLog.supplier( vals, "Change", "Changed contact person information.");
    }

    response.end();
  });
}

// Delete Contact Person - delete a person from contact_person
function deleteContactPerson ( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM CONTACT_PERSON WHERE CONTACT_PERSON_ID = '" + vals.contact_person_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: deleteContactPerson - DELETE FROM CONTACT_PERSON " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
    
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });                

    if ( error ) {
      console.log( "Error on DELETE from CONTACT_PERSON: " + error );
      response.write( "Error occured while trying to delete contact person." );
    } else {
      console.log( "Deleted contact person: ", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Contact person successfully deleted." ); 
      //historyLog.supplier( vals, "Change", "Deleted contact person." );
    }

    response.end();
  });
}

// Create Supplier Address - Create a new supplier address in SUPPLIER_ADDRESS table.
function createSupplierAddress ( response ) {
  var vals = response.values;

  helper.query( "INSERT INTO SUPPLIER_ADDRESS ( SUPPLIER_ID, ADDRESS_LINE_1, ADDRESS_LINE_2, CITY, PROV_STATE, COUNTRY, POSTAL_ZIP, PHONE_NUMBER ) " +
                "VALUES( '" + vals.supplier_id + "', '" + vals.address_line_1 + "', '" + vals.address_line_2 +
                "', '" + vals.city + "', '" + vals.prov_state + "', '" + vals.country + "', '" + vals.postal_zip +
                "', '" + vals.phone_number + "' )",
                function( error, rows, cols ) {

    console.log( "debug:: createSupplierAddress - INSERT INTO SUPPLIER_ADDRESS " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });

    if ( error ) {
      console.log( "Error on INSERT into SUPPLIER_ADDRESS: " + error );
      response.write( "Error occured while trying to create supplier address." );
    } else {
      console.log("Created new supplier address: " + rows );
      response.write( JSON.stringify( rows ) );
      response.write( "New supplier address successfully created." );
      //historyLog.supplier( vals, "Change", "Created new supplier address." );
    }
    
    response.end();
  });  
}

// View Supplier Address - return a list of supplier addresses.
function viewSupplierAddress ( response ) {

  var vals = response.values;

  helper.query( "SELECT ADDRESS_ID, ADDRESS_LINE_1 'Address Line 1', ADDRESS_LINE_2 'Address Line 2', " +
                "CITY 'City', PROV_STATE 'Province/State', COUNTRY 'Country', " +
                "POSTAL_ZIP 'Postal/Zip Code', PHONE_NUMBER 'Phone Number' " +
                "FROM SUPPLIER_ADDRESS WHERE SUPPLIER_ID = '" + vals.supplier_id + "' ORDER BY ADDRESS_ID",
                function( error, rows, cols ) {

    console.log( "debug:: viewSupplierAddress - SELECT FROM SUPPLIER_ADDRESS " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from SUPPLIER_ADDRESS: " + error );
      response.write( "Error occured while trying to load supplier address(es)." );
    } else {
      response.write( JSON.stringify( rows ) );
    }

    response.end();
  });
}

// Edit Supplier Address - Change a supplier address' information.
function editSupplierAddress ( response ) {

  var vals = response.values;

  helper.query( "UPDATE SUPPLIER_ADDRESS SET ADDRESS_LINE_1 = '" + vals.address_line_1 + "', ADDRESS_LINE_2 ='" + vals.address_line_2 +
                "', CITY = '" + vals.city + "', PROV_STATE = '" + vals.prov_state + "', COUNTRY = '" + vals.country +
                "', POSTAL_ZIP = '" + vals.postal_zip + "', PHONE_NUMBER = '" + vals.phone_number + "' " + 
                "WHERE ADDRESS_ID = '" + vals.address_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: editSupplierAddress - UPDATE SUPPLIER_ADDRESS " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");  

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });    

    if ( error ) {
      console.log( "Error on UPDATE SUPPLIER_ADDRESS: " + error );
      response.write( "Error occured while trying to change supplier address information." );
    } else {
      console.log( "Changed supplier address information: ", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Supplier address information succussfully changed." );
      //historyLog.supplier( vals, "Change", "Changed supplier address information.");
    }

    response.end();
  });
}

// Delete Supplier Address - Delete a supplier address entry in the SUPPLIER_ADDRESS table.
function deleteSupplierAddress ( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM SUPPLIER_ADDRESS WHERE ADDRESS_ID = '" + vals.address_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: deleteSupplierAddress - DELETE FROM SUPPLIER_ADDRESS " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
    
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });                

    if ( error ) {
      console.log( "Error on DELETE from SUPPLIER_ADDRESS: " + error );
      response.write( "Error occured while trying to delete supplier address." );
    } else {
      console.log( "Deleted supplier address: ", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Supplier address successfully deleted." ); 
      //historyLog.supplier( vals, "Change", "Deleted supplier address." );
    }

    response.end();
  });
}

// Create PO - Creates a new purchase order in queue status in PURCHASE_ORDER table.
function createPurchaseOrder( response ) {

  var vals = response.values;
  
  helper.query( "INSERT INTO PURCHASE_ORDER( STATUS, DELIVERY_DATE, DELIVER_TIME, REF_NUMBER, COMMENT, SUPPLIER_ID )" +
                "VALUES( 'Queued', '" + vals.delivery_date + "', '" + vals.delivery_time +
                "', '" + vals.ref_number + "', '" + vals.comment + "', '" + vals.supplier_id + "' )",
                function( error, rows, cols ) {

    console.log( "debug:: createPurchaseOrer - INSERT INTO PURCHASE_ORDER " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( "Error on INSERT into PURCHASE_ORDER: " + error );
      response.write( "Error occured while trying to create purchase order." );
    } else {
      console.log("Created new purchase order: " + rows );
      response.write( JSON.stringify( rows ) );
      //historyLog.po( vals, "Create", "Created new purchase order." );
    }
    
    response.end();
  });
}

// View PO - Step 1: Returns number of POs in Purchase_order table for page calculation.
function viewPurchaseOrders( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM PURCHASE_ORDER WHERE STATUS LIKE '" + vals.status + "'",
                function( error, rows, cols ) {

    console.log( "debug:: viewPurchaseOrders - SELECT FROM PURCHASE_ORDER " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });  
                
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");  
      console.log( "Error on SELECT from PURCHASE_ORDER: " + error );
      response.write( "Error occured while trying to load the page." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }

    response.end();
  });
}

// View PO - Step 2: Returns a list of POs for current page, ordered by PO_ID.
function viewPurchaseOrdersPage ( response ) {

  var vals = response.values;

  helper.query( "SELECT po.PO_ID 'PO Number', po.STATUS 'Current Status', po.CREATE_DATE 'Date Created', " +
                "po.SUBMIT_DATE 'Date Submitted', po.DELIVERY_DATE 'Delivery Date', " +
                "po.DELIVERY_TIME 'Delivery Time', po.RECEIVE_DATE 'Date Received', " +
                "po.REF_NUMBER 'Reference Number', po.COMMENT 'Comments', s.NAME 'Supplier' " +
                "FROM PURCHASE_ORDER po LEFT OUTER JOIN SUPPLIER s ON po.SUPPLIER_ID = s.SUPPLIER_ID " +
                "WHERE po.STATUS LIKE '" + vals.status + "' " +
                "ORDER BY po.PO_ID DESC LIMIT " + (response.values.pagenum-1)*20 + ", 20",
                function( error, rows, cols ) {

    console.log( "debug:: viewPurchaseOrdersPage - SELECT FROM PURCHASE_ORDER " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from PURCHASE_ORDER, SUPPLIER: " + error );
      response.write( "Error occured while trying to load the page." );
    } else {
      response.write( JSON.stringify( rows ) ); 
    }  

    response.end();
  });
}

// Edit PO - Change information in purchase order.
function editPurchaseOrder( response ) {

  var vals = response.values;

  helper.query( "UPDATE PURCHASE_ORDER SET DELIVERY_DATE = '" + vals.delivery_date + "', DELIVERY_TIME = '" + vals.delivery_time +
                "', REF_NUMBER = '" + vals.ref_number + "', COMMENT = '" + vals.comment + "', SUPPLIER_ID = '" + vals.supplier_id + "' " +
                "WHERE PO_ID = '" + vals.po_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: editPurchaseOrder - UPDATE PURCHASE_ORDER " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( "Error on UPDATE PURCHASE_ORDER: " + error );
      response.write( "Error occured while trying to change purchase order information." );
    } else {
      console.log( "changed purchase order information.", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Changed purchase order." );
      //historyLog.po( vals, "Change", "Changed purchase order information.");
    }

    response.end();
  });
}

// Submit PO - submit a purchase order.
function submitPurchaseOrder( response ) {

  var vals = response.values;

  helper.query( "UPDATE PURCHASE_ORDER SET STATUS = 'Submitted', SUBMIT_DATE = CURRENT_TIMESTAMP " +
                "WHERE PO_ID = '" + vals.po_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: submitPurchaseOrder - UPDATE PURCHASE_ORDER " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( "Error on UPDATE PURCHASE_ORDER: " + error );
      response.write( "Error occured while trying to submit purchase order." );
    } else {
      console.log( "Submitted purchase order.", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Submitted purchase order." );
      //historyLog.po( vals, "Submit", "Submitted purchase order.");
    }

    response.end();
  });
}

// Cancel PO - cancel a purchase order.
function cancelPurchaseOrder( response ) {

  var vals = response.values;

  helper.query( "UPDATE PURCHASE_ORDER SET STATUS = 'Cancelled' WHERE PO_ID = '" + vals.po_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: cancelPurchaseOrder - UPDATE PURCHASE_ORDER " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( "Error on UPDATE PURCHASE_ORDER: " + error );
      response.write( "Error occured while trying to cancel purchase order." );
    } else {
      console.log( "Cancelled purchase order.", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Cancelled purchase order." );
      //historyLog.po( vals, "Cancel", "Cancelled purchase order.");
    }

    response.end();
  });
}

// Return PO - return a purchase order.
function returnPurchaseOrder( response ) {

  var vals = response.values;

  helper.query( "UPDATE PURCHASE_ORDER SET STATUS = 'Returned' " +
                "WHERE PO_ID = '" + vals.po_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: returnPurchaseOrder - UPDATE PURCHASE_ORDER " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( "Error on UPDATE PURCHASE_ORDER: " + error );
      response.write( "Error occured while trying to return purchase order." );
    } else {
      console.log( "Returned purchase order.", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Returned purchase order." );
      //historyLog.po( vals, "Return", "Returned purchase order.");
    }

    response.end();
  });
}

// Receive PO - receive a purchase order.
function receivePurchaseOrder( response ) {

  var vals = response.values;

  helper.query( "UPDATE PURCHASE_ORDER SET STATUS = 'Received', RECEIVE_DATE = CURRENT_TIMESTAMP " +
                "WHERE PO_ID = '" + vals.po_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: receivePurchaseOrder - UPDATE PURCHASE_ORDER " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( "Error on UPDATE PURCHASE_ORDER: " + error );
      response.write( "Error occured while trying to receive purchase order." );
    } else {
      console.log( "Received purchase order.", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "Received purchase order." );
      //historyLog.po( vals, "Receive", "Received purchase order.");
    }

    response.end();
  });
}

// Create PO Line - Create a new pO line.
function createOrderLine( response ) {

  var vals = response.values;
  
  helper.query( "INSERT INTO PO_LINE( PO_ID, PO_LINE_ID, ITEM_ID, QTY_ORDERED, COMMENT, AUTHOR, PRICE_ID) " +
                "VALUES( '" + vals.po_id + "', " + vals.po_line + "', '" + vals.item_id + "', '" + vals.qty_ordered +
                "', '" + vals.comment + "', '" + vals.userName + "', '" + vals.price_id + "' ) " +
                function( error, rows, cols ) {

    console.log( "debug:: createOrderLine - INSERT INTO PO_LINE " + rows );
    
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });

    if ( error ) {
      console.log( "Error on INSERT into PO_LINE: " + error );
      response.write( "Error occured while trying to create PO line." );
    } else {
      console.log("Created new PO line: " + rows );
      response.write( JSON.stringify( rows ) );
      response.write( "New PO line successfully created." );
      //historyLog.po( vals, "Change", "Created new PO line." );
    }
    
    response.end();
  });
}

// View PO Line - view all PO Lines of a particular PO.
function viewOrderLines( response ) {

  var vals = response.values;

  helper.query( "SELECT p.PO_LINE_ID 'Line', i.ITEM_NAME 'Item Name', p.QTY_ORDERED 'Qty Ordered', " +
                "p.QTY_RECEIVED 'Qty Received', p.COMMENT 'Comments', p.AUTHOR 'Created By', ph.PRICE 'Latest Price' " +
                "FROM PO_LINE p LEFT OUTER JOIN ITEM i ON p.ITEM_ID = i.ITEM_ID " +
                "LEFT OUTER JOIN PRICE_HISTORY ph ON p.PRICE_ID = ph.PRICE_ID WHERE PO_ID = '" + vals.po_id + "' " + 
                "ORDER BY PO_LINE_ID",
                function( error, rows, cols ) {

    console.log( "debug:: viewOrderLines - SELECT FROM PO_LINE " + rows );
                
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
      console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
      console.log( "Error on SELECT from PO_LINE: " + error );
      response.write( "Error occured while trying to load PO lines." );
    } else {
      response.write( JSON.stringify( rows ) );
    }

    response.end();
  });
}

// Edit PO Line - change PO line information.
function editOrderLine( response ) {
  var vals = response.values;

  helper.query( "UPDATE PO_LINE SET ITEM_ID = '" + vals.item_id + "', QTY_ORDERED ='" + vals.qty_ordered +
                "', QTY_RECEIVED = '" + vals.qty_received + "', COMMENT = '" + vals.comment + "', AUTHOR = '" + vals.userName +
                "', PRICE_ID = '" + vals.price_id + "' " + 
                "WHERE PO_ID = '" + vals.po_id + "' AND PO_LINE_ID = '" + vals.po_line_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: editOrderLines - UPDATE PO_LINE " + rows );

    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");  

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });    

    if ( error ) {
      console.log( "Error on UPDATE PO_LINE: " + error );
      response.write( "Error occured while trying to change PO line information." );
    } else {
      console.log( "Changed PO line information: ", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "PO line information succussfully changed." );
      //historyLog.supplier( vals, "Change", "Changed PO line information.");
    }

    response.end();
  });
}

// Delete PO Line - Delete a PO Line entry in the PO_LINE table.
function deleteOrderLine ( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM PO_LINE WHERE PO_ID = '" + vals.po_id + "' AND PO_LINE_ID = '" + vals.po_line_id + "'",
                function( error, rows, cols ) {

    console.log( "debug:: deleteOrderLines - DELETE FROM PO_LINE " + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");
    
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });                

    if ( error ) {
      console.log( "Error on DELETE from PO_LINE: " + error );
      response.write( "Error occured while trying to delete PO line." );
    } else {
      console.log( "Deleted PO Line: ", rows );
      response.write( JSON.stringify( rows ) );
      response.write( "PO Line successfully deleted." ); 
      //historyLog.supplier( vals, "Change", "Deleted PO Line." );
    }

    response.end();
  });
}

// Create Return line - create a new return line.
function createReturnLine( response ) {

  var vals = response.values;
  
  helper.query( "INSERT INTO RETURN_LINE( PO_ID, RETURN_LINE_ID, PO_LINE_ID, RETURN_DATE, QTY_RETURNED, CREDIT_MEMO_NUM, COMMENT, AUTHOR) " +
                "VALUES( '" + vals.po_id + "', '" + vals.return_line_id + "', '" + vals.po_line_id + "', '" + vals.return_date +
                "', '" + vals.qty_returned + "', '" + vals.credit_memo_num + "', '" + vals.comment + "', '" + vals.userName + "' ) " +
                function( error, rows, cols ) {

    console.log( "debug:: createReturnLine - INSERT INTO RETURN_LINE" + rows );
                
    console.log( helper.date() + " - " + vals.userName + " (" + vals.curRole + ")");

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });

    if ( error ) {
      console.log( "Error on INSERT into RETURN_LINE: " + error );
      response.write( "Error occured while trying to create return line." );
    } else {
      console.log("Created new return line: " + rows );
      response.write( JSON.stringify( rows ) );
      response.write( "New return line successfully created." );
      //historyLog.po( vals, "Change", "Created new return line." );
    }
    
    response.end();
  });
}

// Get Supplier List - get full list of supplier with names and ID.
function getSupplierList( response ) {

  var vals = response.values;
  
  helper.query( "SELECT NAME, SUPPLIER_ID FROM SUPPLIER",
                function( error, rows, cols ) {
    
    if ( error ) {
      console.log( "Error on SELECT from SUPPLIER: " + error );
    } else {
      response.writeHead( 200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      });
      
      response.write( JSON.stringify( rows ) );
      response.end();
    }
  });
}

// Get Category List - get full list of category with names.
function getCategoryList( response ) {

  var vals = response.values;
  
  helper.query( "SELECT CAT_NAME FROM ITEM_CATEGORY",
                function( error, rows, cols ) {
    
    if ( error ) {
      console.log( "Error on SELECT from ITEM_CATEGORY: " + error );
    } else {
      response.writeHead( 200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      });
    
      response.write( JSON.stringify( rows ) );
      response.end();
    }
  });
}

// Get Item List - get a list of item for a specific supplier.
function getItemList( response ) {

  var vals = response.values;
  
  helper.query( "SELECT ITEM_ID, ITEM_NAME FROM ITEM WHERE SUPPLIER_ID = '" + vals.supplier_id + "'",
                function( error, rows, cols ) {
    
    if ( error ) {
      console.log( "Error on SELECT from ITEM: " + error );
    } else {
      response.writeHead( 200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      });
    
      response.write( JSON.stringify( rows ) );
      response.end();
    }
  });
}

// Get User - Get a user's information from the USER table.
function getUser( response ) {

  var vals = response.values;
  
  helper.query( "SELECT * FROM USER WHERE USER_ID = '" + vals.userName + "'",
                function( error, rows, cols ) {
    
    if ( error ) {
      console.log( "Error on SELECT from USER: " + error );
    } else {
      response.writeHead( 200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      });
    
      response.write( JSON.stringify( rows ) );
      response.end();
    }
  });
}

// Get Item - Get an item's information from the ITEM table.
function getItem( response ) {

  var vals = response.values;
  
  helper.query( "SELECT * FROM ITEM WHERE ITEM_ID = '" + vals.item_id + "'",
                function( error, rows, cols ) {
    
    if ( error ) {
      console.log( "Error on SELECT from ITEM: " + error );
    } else {
      response.writeHead( 200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      });
    
      response.write( JSON.stringify( rows ) );
      response.end();
    }
  });
}

// Get Item - Get an item's information from the ITEM table.
function getPurchaseOrder( response ) {

  var vals = response.values;
  
  helper.query( "SELECT * FROM PURCHASE_ORDER WHERE PO_ID = '" + vals.po_id + "'",
                function( error, rows, cols ) {
    
    if ( error ) {
      console.log( "Error on SELECT from ITEM: " + error );
    } else {
      response.writeHead( 200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      });
    
      response.write( JSON.stringify( rows ) );
      response.end();
    }
  });
}

exports.index = index;
exports.login = login;
exports.logout = logout;
exports.viewUserHistory = viewUserHistory;
exports.viewUserHistoryPage = viewUserHistoryPage;
exports.viewItemHistory = viewItemHistory;
exports.viewItemHistoryPage = viewItemHistoryPage;
exports.viewSupplierHistory = viewSupplierHistory;
exports.viewSupplierHistoryPage = viewSupplierHistoryPage;
exports.viewPOHistory = viewPOHistory;
exports.viewPOHistoryPage = viewPOHistoryPage;

exports.editAccount = editAccount;

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
exports.editItem = editItem;
exports.deleteItem = deleteItem;

exports.createPrice = createPrice;
exports.viewPrice = viewPrice;

exports.createSupplierCheckDupe = createSupplierCheckDupe;
exports.createSupplier = createSupplier;
exports.viewSuppliers = viewSuppliers;
exports.viewSuppliersPage = viewSuppliersPage;
exports.editSupplier = editSupplier;
exports.deleteSupplier = deleteSupplier;

exports.createContactPerson = createContactPerson;
exports.viewContactPerson = viewContactPerson;
exports.editContactPerson = editContactPerson;
exports.deleteContactPerson = deleteContactPerson;

exports.createSupplierAddress = createSupplierAddress;
exports.viewSupplierAddress = viewSupplierAddress;
exports.editSupplierAddress = editSupplierAddress;
exports.deleteSupplierAddress = deleteSupplierAddress;

exports.createPurchaseOrder = createPurchaseOrder;
exports.viewPurchaseOrders = viewPurchaseOrders;
exports.viewPurchaseOrdersPage = viewPurchaseOrdersPage;
exports.editPurchaseOrder = editPurchaseOrder;
exports.submitPurchaseOrder = submitPurchaseOrder;
exports.cancelPurchaseOrder = cancelPurchaseOrder;
exports.returnPurchaseOrder = returnPurchaseOrder;
exports.receivePurchaseOrder = receivePurchaseOrder;

exports.createOrderLine = createOrderLine;
exports.viewOrderLines = viewOrderLines;
exports.editOrderLine = editOrderLine;
exports.deleteOrderLine = deleteOrderLine;

exports.createReturnLine = createReturnLine;

exports.getSupplierList = getSupplierList;
exports.getCategoryList = getCategoryList;
exports.getItemList = getItemList;
exports.getUser = getUser;
exports.getPurchaseOrder = getPurchaseOrder;
