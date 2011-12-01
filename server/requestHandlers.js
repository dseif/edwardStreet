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

  helper.query( "SELECT * FROM USER " +
				"WHERE USER_ID = '" + vals.user + "' AND PASSWORD = '" + vals.pass + "'",
				function( error, rows, cols ) {

    if ( error ) {
      console.log( "Error on select: " + error );
      return;
    }

    vals.curEmployeeID = rows[ 0 ] && rows[ 0 ].EMPLOYEE_ID;
    vals.curUserID = rows[ 0 ] && rows[ 0 ].USER_ID;
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

// Question: What is this?
function profile() {
  return "Profile";
}

// Question: What is this?
function logs() {
  return "Logs";
}

// Change Password - allow current user to change his password.
// Question: vals all correct? consistent? CHange into change password/email?
function editAccount( response ) {

  var vals = response.values;

  // Question: required?
  var that = this;
  
  helper.query( "UPDATE USER SET PASSWORD = '" + vals.password + "', EMAIL = '" + vals.email + "' " +
                "WHERE USER_ID = '" + vals.curUserID + "'", 
                function( error, rows, cols ) {

    console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");

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

      helper.query( "INSERT INTO USER_HISTORY( USER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
                    "VALUES( '" + vals.curUserID + "', 'Change', 'Changed password/email.', '" + vals.curUserID + "', '" + helper.date() + "')",
                    function( error, rows, cols ) {

        if ( error ) {
          console.log( "Error on INSERT into USER_HISTORY: " + error );
        }
        
      });
    }
    
    response.end();
    
  });
}

// Create User - Step 1: Checks if current user_id already exists. Returns COUNT of 1 if it exists, Count of 0 if not.
// Question: vals.user correct? different vals? vals correct? May require standardization of vals across pages
function createUserCheckDupe( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(USER_ID) FROM USER WHERE USER_ID = '" + vals.user_id + "'",
                function( error, rows, cols ) {

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
        
    if ( error ) {

      console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
      console.log( "Error on select from USER: " + error );
      reponse.write( "Error occured while trying to create user." );

    } else {

      response.write( JSON.stringify( rows ) ); 

    }

    response.end();

  });
}

// Create User - Step 2: Insert new user into USER table. Inserts log into USER_HISTORY table.
// Question: vals correct? May require standardization of vals across pages
function createUser( response ) {

  var vals = response.values;

  helper.query( "INSERT INTO USER( USER_ID, PASSWORD, EMAIL, EMPLOYEE_ID, ROLE, SUPPLIER_ID ) " +
                "VALUES('" + vals.user_id + "', '" + vals.password + "', '" + vals.email +
                "', '" + vals.employee_id + "', '" + vals.role + "', '" + vals.supplier_id + "')",
                function( error, rows, cols ) {

    console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
                
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

      helper.query( "INSERT INTO USER_HISTORY( USER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
                    "VALUES( '" + vals.user_id + "', 'Create', 'Created new user.', '" + vals.curUserID + "', '" + helper.date() + "')",
                    function( error, rows, cols ) {

        if ( error ) {

        console.log( "Error on INSERT into USER_HISTORY: " + error );

        }
      });
    }
    
    response.end();
    
  });  
}

// View User - Step 1: Returns number of users in USER table for page calculation.
function viewUsers( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM USER",
                function( error, rows, cols ) {

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {

      console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
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

  helper.query( "SELECT u.USER_ID, u.EMAIL, u.EMPLOYEE_ID, u.ROLE, s.NAME " + 
                "FROM USER u LEFT JOIN SUPPLIER s ON u.SUPPLIER_ID = s.SUPPLIER_ID " + 
                "ORDER BY USER_ID " +
                "LIMIT " + (vals.pagenum-1)*20 + ", 20",
                function( error, rows, cols ) {

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {

      console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
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
                "WHERE USER_ID = '" + vals.user_id + "'",
                function( error, rows, cols ) {

    console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
    
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

      helper.query( "INSERT INTO USER_HISTORY( USER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
                    "VALUES( '" + vals.user_id + "', 'Change', 'Changed user information.', '" + vals.curUserID + "', '" + helper.date() + "')",
                    function( error, rows, cols ) {

        if ( error ) {
          console.log( "Error on INSERT into USER_HISTORY: " + error );
        }
      });
    }
    
    response.end();
    
  });
}

// Delete User - Delete selected user from USER table.
function deleteUser( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM USER WHERE USER_ID = '" + vals.user_id + "'",
                function( error, rows, cols ) {

    console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
    
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
    
      helper.query( "INSERT INTO USER_HISTORY( USER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
                    "VALUES( '" + vals.user_id + "', 'Delete', 'Deleted user.', '" + vals.curUserID + "', '" + helper.date() + "')",
                    function( error, rows, cols ) {

        if ( error ) {
          console.log( "Error on INSERT into USER_HISTORY: " + error );
        }
      });
    }
    response.end();
  });
}

// Create Item - Step 1: Checks if current itemname+supplier already exists. Returns COUNT of 1 if it exists, Count of 0 if not.
// Question: vals.supplier_id? check on that
function createItemCheckDupe( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM ITEM " +
                "WHERE LOWER(ITEM_NAME) = LOWER('" + vals.item_name + "') AND SUPPLIER_ID = " + vals.supplier_id,
                function( error, rows, cols ) {
  
    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
    
    if ( error ) {
    
      console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
      console.log( "Error on SELECT ITEM: " + error );
      response.write( "Error occured while trying to create item." );
      
    } else {
    
      response.write( JSON.stringify( rows ) ); 
    
    }

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

    console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
                
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
      response.write( "New item successfully created." );
    
	    // Question: get new item ID somehow
      helper.query( "SELECT LAST_INSERT_ID()", function( error, rows, cols ) {
      
        if ( error ) {
          console.log( "Error in SELECT LAST_INSERT_ID(): " + error );
        } else {
        
          var last_id = rows[ 0 ]["LAST_INSERT_ID()"];
        
          // insert price into price-history
          
          helper.query( "INSERT INTO PRICE_HISTORY(ITEM_ID, PRICE, AUTHOR, LOG_DATE) " +
                        "VALUES( '" + vals.last_id + "', " + vals.price + "', " + vals.curUserID + "', '" + helper.date() + "' )",
                        function( error, rows, cols ) {
                        
            if ( error ) {
              console.log( "Error on INSERT into PRICE_HISTORY: " + error );
            }
            
            item_id = last_id;
            last_id = rows[ 0 ]["LAST_INSERT_ID()"];
            
            // update item with new price id
            helper.query( "UPDATE ITEM SET LATEST_PRICE = " + last_id +
                          "WHERE ITEM_ID = " + item_id, 
                          function( error, rows, cols ) {
            
              if ( error ) {
                console.log( "Error on INSERT into PRICE_HISTORY: " + error );
              }
            
              helper.query( "INSERT INTO ITEM_HISTORY( ITEM_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
                            "VALUES( '" + last_id + "', 'Create', 'New item created.', '" + vals.userName + "', '" + helper.date() + "')",
                            function( error, rows, cols ) {

                if ( error ) {
                  console.log( "Error in inserting into history: " + error );
                }
              });
            });
          });
        }
      });
    }
    response.end();
  });  
}

// View Items - Step 1: Returns number of items in ITEM table for page calculation.
function viewItems( response ) {

  helper.query( "SELECT COUNT(*) FROM ITEM",
                function ( error, rows, cols ) {

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });

    if ( error ) {
    
      console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
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
  helper.query( "SELECT i.ITEM_ID, i.DIST_CODE, i.ITEM_NAME, i.RECEIPT_NAME, i.CATEGORY, i.UNIT, i.ITEM_TYPE, i.COMMENT, p.PRICE, s.NAME " +
                "FROM ITEM i LEFT OUTER JOIN SUPPLIER s ON i.SUPPLIER_ID = s.SUPPLIER_ID " +
                "LEFT OUTER JOIN PRICE_HISTORY p ON i.LATEST_PRICE = PRICE_ID " +
                "ORDER BY i.ITEM_NAME LIMIT " + (response.values.pagenum-1)*20 + ", 20",
                function( error, rows, cols ) {

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });

    if ( error ) {
    
      console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
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

  // insert latest price first
  helper.query( "INSERT INTO PRICE_HISTORY(ITEM_ID, PRICE, AUTHOR, LOG_DATE) " +
                "VALUES( '" + vals.item_id + "', " + vals.price + "', " + vals.curUserID + "', '" + helper.date() + "' )",
                function( error, rows, cols ) {
                
    console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");  

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });    

    if ( error ) {

      console.log( "Error on INSERT INTO PRICE_HISTORY: " + error );
      response.write( "Error occured while trying to change item information." );
      
    } else {
    
      // get the new price_id
      helper.query( "SELECT LAST_INSERT_ID()", function( error, rows, cols ) {
      
        if ( error ) {

          console.log( "Error in SELECT LAST_INSERT_ID(): " + error );

        } else {
        
          var last_id = rows[ 0 ]["LAST_INSERT_ID()"];
          console.log( "Entered new price: " + vals.price + " (" + vals.last_id + ")" );
      
          // update item
          helper.query( "UPDATE ITEM SET DIST_CODE = '" + vals.dist_code + "', ITEM_NAME = '" + vals.item_name + "', RECEIPT_NAME = '" + vals.receipt_name +
                        "', CATEGORY = '" + vals.category + "', UNIT = '" + vals.unit + "', ITEM_TYPE = '" + vals.item_type +
                        "', COMMENT = '" + vals.comment + "', LATEST_PRICE = " + vals.last_id + ", SUPPLIER_ID = '" + vals.supplier_id + "', U_MINOR_REPO = '" + vals.u_minor_repo +
                        "', U_ACTIVE_INA = '" + vals.u_active_ina + "', U_BIZERBA = '" + vals.u_bizerba + "', U_BRAND = '" + vals.u_brand +
                        "', U_CASE_SIZE = '" + vals.u_case_size + "', U_COOKING_IN = '" + vals.u_cooking_in + "', U_COUNTRY = '" + vals.u_country +
                        "', U_DESCRIPTO = '" + vals.u_descripto + "', U_EXPIRY_DAT = '" + vals.u_expiry_dat + "', U_INGREDIENT = '" + vals.u_ingredient +
                        "', U_KEYWORDS = '" + vals.u_keywords + "', U_NOTES = '" + vals.u_notes + "', U_ORDER = '" + vals.u_order +
                        "', U_PLU = '" + vals.u_plu + "', U_PRICE = '" + vals.u_price + "', U_SILVERWARE = '" + vals.u_silverware +
                        "', U_SKU = '" + vals.u_sku + "', U_STORAGE = '" + vals.u_storage + "', U_STORAGE_TY = '" + vals.u_storage_ty +
                        "', U_TYPE = '" + vals.u_type + "', U_UPC_CODE = '" + vals.u_upc_code + "', U_PRICE_PER = '" + vals.u_price_per +
                        "', U_TAX = '" + vals.u_tax + "', U_SCALE = '" + vals.u_scale + "' " +
                        "WHERE ITEM_ID = " + vals.item_id,
                        function( error, rows, cols ) {

            if ( error ) {

              console.log( "Error on UPDATE ITEM: " + error );
              response.write( "Error occured while trying to change item information." );

            } else {
    
              console.log( "Changed item information: ", rows );
              response.write( JSON.stringify( rows ) );
              response.write( "Item information succussfully changed." );

              helper.query( "INSERT INTO ITEM_HISTORY( ITEM_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
                            "VALUES( '" + vals.item_id + "', 'Change', 'Changed item information.', '" + vals.curUserID + "', '" + helper.date() + "')",
                            function( error, rows, cols ) {

                if ( error ) {
                  console.log( "Error on INSERT into ITEM_HISTORY: " + error );
                }
              });
            }
          });
        }
      });
    }
    response.end();
  });
}

// Delete Item - Delete selected item from ITEM table.
function deleteItem( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM ITEM WHERE ITEM_ID = '" + vals.item_id + "'",
                function( error, rows, cols ) {

    console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
    
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
    
      helper.query( "INSERT INTO ITEM_HISTORY( ITEM_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
                    "VALUES( '" + vals.item_id + "', 'Delete', 'Deleted item.', '" + vals.curUserID + "', '" + helper.date() + "')",
                    function( error, rows, cols ) {

        if ( error ) {
          console.log( "Error on INSERT into ITEM_HISTORY: " + error );
        }
      });
    }
    response.end();
  });
}

// Create Supplier - Step 1: Checks if current supplier_name already exists. Returns COUNT of 1 if it exists, Count of 0 if not.
function createSupplierCheckDupe( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM USER WHERE LOWER(NAME) = LOWER('" + vals.user_id + "')",
                function( error, rows, cols ) {

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
        
    if ( error ) {

      console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
      console.log( "Error on select from SUPPLIER: " + error );
      reponse.write( "Error occured while trying to create supplier." );

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
                "VALUES('" + vals.name + "', '" + vals.legal_name + "', '" + vals.lead_time +
                "', '" + vals.supplier_comment + "', '" + vals.special_comment + "')",
                function( error, rows, cols ) {

    console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")" );
                
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

      helper.query( "SELECT LAST_INSERT_ID()", function( error, rows, cols ) {
      
        if ( error ) {
          console.log( "Error in SELECT LAST_INSERT_ID(): " + error );
        } else {
        
          var last_id = rows[ 0 ]["LAST_INSERT_ID()"];
      
          // Insert Dates_of_delivery loop
       
          helper.query( "INSERT INTO SUPPLIER_HISTORY( SUPPLIER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
                        "VALUES( '" + last_id + "', 'Create', 'Created new supplier.', '" + vals.curUserID + "', '" + helper.date() + "')",
                        function( error, rows, cols ) {

            if ( error ) {
              console.log( "Error on INSERT into SUPPLIER_HISTORY: " + error );
            }
          });
        }
      });
    }
    response.end();
  });
}

// View Supplier - Step 1: Return number of suppliers in SUPPLIER table for page calculation.
function viewSuppliers( response ) {
  
  helper.query( "SELECT COUNT(*) FROM SUPPLIER",
                function( error, rows, cols ) {

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {
    
      console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
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
  
  helper.query( "SELECT * FROM SUPPLIER ORDER BY NAME LIMIT " + (response.pagenum-1)*20 + ", 20", 
                function( error, rows, cols ) {

    response.writeHead( 200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    });
                
    if ( error ) {
    
      console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
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

  helper.query( "UPDATE SUPPLIER SET NAME = '" + vals.name + "', LEGAL_NAME = '" + vals.legal_name + "', LEAD_TIME = '" + vals.lead_time +
                "', SUPPLIER_COMMENT = '" + vals.supplier_comment + "', SPECIAL_COMMENT = '" + vals.special_comment + "'" +
                "WHERE SUPPLIER_ID = " + vals.supplier_id,
                function( error, rows, cols ) {
  
    console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");  

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

      helper.query( "INSERT INTO SUPPLIER_HISTORY( SUPPLIER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
                    "VALUES( '" + vals.supplier_id + "', 'Change', 'Changed supplier information.', '" + vals.curUserID + "', '" + helper.date() + "')",
                    function( error, rows, cols ) {

        if ( error ) {
          console.log( "Error on INSERT into SUPPLIER_HISTORY: " + error );
        }
      });
    }
    response.end();
  });
}

// Delete Supplier - Delete selected supplier from SUPPLIER Table.
function deleteSupplier( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM SUPPLIER WHERE SUPPLIER_ID = '" + vals.supplier_id + "'",
                function( error, rows, cols ) {

    console.log( helper.date() + " - " + vals.curUserID + " (" + vals.curRole + ")");
    
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
    
      helper.query( "INSERT INTO SUPPLIER_HISTORY( SUPPLIER_ID, CATEGORY, COMMENT, AUTHOR, LOG_DATE ) " +
                    "VALUES( '" + vals.supplier_id + "', 'Delete', 'Deleted item.', '" + vals.curUserID + "', '" + helper.date() + "')",
                    function( error, rows, cols ) {

        if ( error ) {
          console.log( "Error on INSERT into SUPPLIER_HISTORY: " + error );
        }
      });
    }
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

function editPurchaseOrder() {
  return "editPurchaseOrders";
}

function cancelPurchaseOrder() {
  return "CancelPurchaseOrder";
}

function returnPurchaseOrder() {
  return "returnPurchaseOrder";
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

exports.index = index;
exports.login = login;
exports.logout = logout;
exports.profile = profile;
exports.logs = logs;
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

exports.createSupplierCheckDupe = createSupplierCheckDupe;
exports.createSupplier = createSupplier;
exports.viewSuppliers = viewSuppliers;
exports.viewSuppliersPage = viewSuppliersPage;
exports.editSupplier = editSupplier;
exports.deleteSupplier = deleteSupplier;

// contact_person
// supplier_address

exports.createPurchaseOrder = createPurchaseOrder;
exports.viewPurchaseOrders = viewPurchaseOrders;
exports.viewPurchaseOrdersPage = viewPurchaseOrdersPage;
exports.editPurchaseOrder = editPurchaseOrder;
exports.cancelPurchaseOrder = cancelPurchaseOrder;
exports.returnPurchaseOrder = returnPurchaseOrder;
exports.receivePurchaseOrder = receivePurchaseOrder;
