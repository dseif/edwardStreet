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

function index( response, cb ) {

  var vals = response.values;

  helper.query( "SELECT * FROM USER " +
				"WHERE USER_ID = '" + vals.user + "' AND PASSWORD = '" + vals.pass + "'",
				function( error, rows, cols ) {

    console.log( "function: index - SELECT FROM USER " + rows );
        
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

// editAccount
// Function: Update USER table with new password and email for the current user.
// Required values: password(New password), email (New email), userName (current logged in user's ID).
// Output: Nothing
function editAccount( response ) {

  var vals = response.values;
  
  helper.query( "UPDATE USER SET PASSWORD = '" + vals.password + "', EMAIL = '" + vals.email + "' " +
                "WHERE USER_ID = '" + vals.userName + "'", 
                function( error, rows, cols ) {

    console.log( "function: editAccount - UPDATE USER " + rows );
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

// createUserCheckDupe
// function: Select count(*) from USER table to check if a user ID already exists.
// Required values: user_id(The new user ID)
// Output: COUNT(*) returns as 0 if current user_id does not exist, > 0 if it does.
function createUserCheckDupe( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM USER WHERE USER_ID = '" + vals.user_id + "'",
                function( error, rows, cols ) {

    console.log( "function: createUserCheckDupe - SELECT FROM USER " + rows );
                
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

// createUser 
// function: Insert a new user into USER table.
// Required values: user_id(new user ID), password(user's password), email(user's email address), employee_id(user's employee ID, if he has one), role(user's role), supplier_id(user's associated supplier ID, if he has one)
// Output: None.
function createUser( response ) {

  var vals = response.values;

  helper.query( "INSERT INTO USER( USER_ID, PASSWORD, EMAIL, EMPLOYEE_ID, ROLE, SUPPLIER_ID ) " +
                "VALUES('" + vals.user_id + "', '" + vals.password + "', '" + vals.email +
                "', '" + vals.employee_id + "', '" + vals.role + "', '" + vals.supplier_id + "' )",
                function( error, rows, cols ) {

    console.log( "function: createUser - INSERT INTO USER " + rows );
                
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
    }
    
    response.end();
  });  
}

// viewUsers
// function: select count(*) from USER table for calculating number of page tabs required.
// Required values: none.
// Output: COUNT(*)
function viewUsers( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM USER",
                function( error, rows, cols ) {

    console.log( "function: viewUsers - SELECT FROM USER " + rows );
                
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

// viewUsersPage
// Function: Select from USER table a list of users for the current page tab.
// Required values: pagenum(page tab number)
// Output: User Login(USER_ID), Email Address(EMAIL), Employee ID(EMPLOYEE_ID), Role(ROLE), Associated Supplier(NAME)
function viewUsersPage( response ) {

  var vals = response.values;

  helper.query( "SELECT u.USER_ID 'User Login', u.EMAIL 'Email Address', u.EMPLOYEE_ID 'Employee ID', u.ROLE 'Role', s.NAME 'Associated Supplier'" + 
                "FROM USER u LEFT JOIN SUPPLIER s ON u.SUPPLIER_ID = s.SUPPLIER_ID " + 
                "ORDER BY USER_ID " +
                "LIMIT " + (vals.pagenum-1)*20 + ", 20",
                function( error, rows, cols ) {

    console.log( "function: viewUsersPage - SELECT FROM USER " + rows );
                
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

// editUser
// function: Update USER table with new user information for row USER_ID.
// required values: user_id, email, employee_id, role, old_user_id (original user ID)
// Output: None.
function editUser( response ) {

  var vals = response.values;

  helper.query( "UPDATE USER SET USER_ID = '" + vals.user_id + "', EMAIL = '" + vals.email +
                "', EMPLOYEE_ID = '" + vals.employee_id + "', ROLE = '" + vals.role + "' " +
                "WHERE USER_ID = '" + vals.old_user_id + "'",
                function( error, rows, cols ) {

    console.log( "function: editUser - UPDATE USER " + rows );
                
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
    }
    
    response.end();
  });
}

// deleteUser
// Function: Delete from USER table the selected user.
// Required values: user_id
// Output: None.
function deleteUser( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM USER WHERE USER_ID = '" + vals.user_id + "'",
                function( error, rows, cols ) {

    console.log( "function: deleteUser - DELETE FROM USER " + rows );
                
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
    }

    response.end();
  });
}

// createItem
// function: Insert a new item into ITEM table.
// Required values: item_name, receipt_name, category, unit, item_type, comment, supplier_id
// Output: None.
function createItem( response ) {

  var vals = response.values;

  helper.query( "INSERT INTO ITEM( DIST_CODE, ITEM_NAME, RECEIPT_NAME, CATEGORY, UNIT, ITEM_TYPE, COMMENT, SUPPLIER_ID ) " +
                "VALUES('" + vals.dist_code + "', '" + vals.item_name + "', '" + vals.receipt_name +
                "', '" + vals.category + "', '" + vals.unit + "', '" + vals.item_type + "', '" + vals.comment +
                "', '" + vals.supplier_id + "' )",
                function( error, rows, cols ) {

    console.log( "function: createItem - INSERT INTO ITEM " + rows );
                
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

// viewItems
// function: select count(*) from ITEM table for calculating number of page tabs required.
// Required values: none.
// Output: COUNT(*)
function viewItems( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM ITEM",
                function ( error, rows, cols ) {

    console.log( "function: viewItems - SELECT FROM ITEM " + rows );
                
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

// viewItemsPage
// Function: Select from ITEM table a list of items for the current page tab.
// Required values: pagenum(page tab number)
// Output: Item ID(ITEM_ID), Distribution Code(DIST_CODE), Item Name(ITEM_NAME), Receipt Name(RECEIPT_NAME), Item Category(CATEGORY), Sales Unit(UNIT), Department(ITEM_TYPE), Comments(COMMENT), Latest Price(PRICE), Supplier(NAME)
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

    console.log( "function: viewItemsPage - SELECT FROM ITEM " + rows );
                    
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

// editItem
// function: Update ITEM table with new item information for row ITEM_ID.
// required values: dist_code, item_name, receipt_name, category, unit, item_type, comment, supplier_id, item_id
// Output: None.
function editItem( response ) {

  var vals = response.values;

  helper.query( "UPDATE ITEM SET DIST_CODE = '" + vals.dist_code + "', ITEM_NAME = '" + vals.item_name +
                "', RECEIPT_NAME = '" + vals.receipt_name + "', CATEGORY = '" + vals.category +"', UNIT = '" + vals.unit +
                "', ITEM_TYPE = '" + vals.item_type + "', COMMENT = '" + vals.comment + "', SUPPLIER_ID = '" + vals.supplier_id +
                "' WHERE ITEM_ID = '" + vals.item_id + "'",
                function( error, rows, cols ) {

    console.log( "function: editItem - UPDATE ITEM " + rows );
                
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
    }

    response.end();
  });
}

// deleteItem
// Function: Delete from ITEM table the selected item.
// Required values: item_id
// Output: None.
function deleteItem( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM ITEM WHERE ITEM_ID = '" + vals.item_id + "'",
                function( error, rows, cols ) {

    console.log( "function: deleteItem - DELETE FROM ITEM " + rows );
                
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
    }

    response.end();
  });
}
  
// createPrice
// function: Insert a new price into priceHistory table, and then update the associated item in ITEM table with new price ID.
// Required values: item_id, price(new price), userName(current logged in user ID)
// Output: None.
function createPrice ( response ) {

  var vals = response.values;
  
  // create a new price entry
  helper.query( "INSERT INTO PRICE_HISTORY( ITEM_ID, PRICE, AUTHOR) " +
                "VALUES ( '" + vals.item_id + "', " + vals.price + ", '" + vals.userName + "' )", 
                function( error, rows, cols ) {

    console.log( "function: createPrice - INSERT INTO PRICE_HISTORY " + rows );
                
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
                        
        console.log( "function: createPrice - UPDATE ITEM " + rows );
            
        if ( error ) {
          console.log( "Error on UPDATE ITEM with new price: " + error );
        } else {
          console.log( "Price changed on item: " + vals.item_id );
          response.write( JSON.stringify( rows ));
        }
      });
    }

    response.end();
  });
}

// viewPrice
// Function: Select from PRICE_HISTORY table the latest 20 price entries for current item.
// Required values: item_id
// Output: PRICE, LOG_DATE
function viewPrice ( response ) {

  var vals = response.values;
  
  helper.query( "SELECT PRICE, LOG_DATE FROM PRICE_HISTORY WHERE ITEM_ID = '" + vals.item_id + "' " +
                "ORDERED BY LOG_DATE DESC LIMIT 20",
                function( error, rows, cols ) {

    console.log( "function: viewPrice - SELECT FROM PRICE_HISTORY() " + rows );
                
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

// createSupplierCheckDupe
// function: Select count(*) from SUPPLIER table by name to check if supplier already exists.
// Required values: name(new supplier's name)
// Output: COUNT(*) returns as 0 if current user_id does not exist, > 0 if it does.
function createSupplierCheckDupe( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM SUPPLIER WHERE LOWER(NAME) = LOWER('" + vals["name"] + "')",
                function( error, rows, cols ) {

    console.log( "function: createSupplierCheckDupe - SELECT FROM SUPPLIER " + rows );
    
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

// createSupplier
// function: Insert a new supplier into SUPPLIER table.
// Required values: name(new supplier's name), legal_name, lead_time, supplier_comment, special_comment
// Output: None.
function createSupplier( response ) {

  var vals = response.values;

  helper.query( "INSERT INTO SUPPLIER( NAME, LEGAL_NAME, LEAD_TIME, SUPPLIER_COMMENT, SPECIAL_COMMENT ) " +
                "VALUES('" + vals["name"] + "', '" + vals.legal_name + "', '" + vals.lead_time +
                "', '" + vals.supplier_comment + "', '" + vals.special_comment + "')",
                function( error, rows, cols ) {

    console.log( "function: createSupplier - SELECT FROM SUPPLIER " + rows );
                
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
      
    }

    response.end();
  });
}

// viewSuppliers
// function: select count(*) from SUPPLIER table for calculating number of page tabs required.
// Required values: none.
// Output: COUNT(*)
function viewSuppliers( response ) {
  
  helper.query( "SELECT COUNT(*) FROM SUPPLIER",
                function( error, rows, cols ) {

    console.log( "function: viewSuppliers - SELECT FROM SUPPLIER " + rows );
                
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

// viewSuppliersPage
// Function: Select from SUPPLIER table a list of suppliers for the current page tab.
// Required values: pagenum(page tab number)
// Output: Supplier Name(NAME), Legal Name(LEGAL_NAME), Lead Time(LEAD_TIME), Supplier Comments(SUPPLIER_COMMENT), Special Comments(SPECIAL_COMMENT)
function viewSuppliersPage( response ) {
  
  var vals = response.values;
  helper.query( "SELECT SUPPLIER_ID, NAME 'Supplier Name', LEGAL_NAME 'Legal Name', " + 
                "LEAD_TIME 'Lead Time', SUPPLIER_COMMENT 'Supplier Comments', " +
                "SPECIAL_COMMENT 'Special Comments' " + 
                "FROM SUPPLIER ORDER BY NAME LIMIT " + (vals.pagenum-1)*20 + ", 20", 
                function( error, rows, cols ) {

    console.log( "function: viewSuppliersPage - SELECT FROM SUPPLIER " + rows );
                
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

// editSupplier
// function: Update SUPPLIER table with new supplier information for row SUPPLIER_ID.
// required values: name(supplier's name), legal_name, lead_time, supplier_comment, special_comment, supplier_id
// Output: None.
function editSupplier( response ) {

  var vals = response.values;

  helper.query( "UPDATE SUPPLIER SET NAME = '" + vals.name + "', LEGAL_NAME = '" + vals.legal_name +
                "', LEAD_TIME = '" + vals.lead_time + "', SUPPLIER_COMMENT = '" + vals.supplier_comment +
                "', SPECIAL_COMMENT = '" + vals.special_comment + "'" +
                "WHERE SUPPLIER_ID = '" + vals.supplier_id + "'",
                function( error, rows, cols ) {
  
    console.log( "function: editSupplier - UPDATE SUPPLIER " + rows );
  
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
    }

    response.end();
  });
}

// deleteSupplier
// Function: Delete from SUPPLIER table the selected supplier.
// Required values: supplier_id
// Output: None.
function deleteSupplier( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM SUPPLIER WHERE SUPPLIER_ID = '" + vals.supplier_id + "'",
                function( error, rows, cols ) {

    console.log( "function: deleteSupplier - DELETE FROM SUPPLIER " + rows );
                
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
    }

    response.end();
  });
}

// createContactPerson
// function: Insert a new contact person into CONTACT_PERSON table.
// Required values: supplier_id, last_name, first_name, phone_number, email
// Output: None.
function createContactPerson ( response ) {

  var vals = response.values;

  helper.query( "INSERT INTO CONTACT_PERSON ( SUPPLIER_ID, LAST_NAME, FIRST_NAME, PHONE_NUMBER, EMAIL ) " +
                "VALUES( '" + vals.supplier_id + "', '" + vals.last_name + "', '" + vals.first_name +
                "', '" + vals.phone_number + "', '" + vals.email + "' )",
                function( error, rows, cols ) {

    console.log( "function: createContactPerson - INSERT INTO CONTACT_PERSON " + rows );
    
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
    }
    
    response.end();
  });  
}

// viewContactPerson
// Function: Select from CONTACT_PERSON table a list of contact persons for the current supplier.
// Required values: supplier_id
// Output: Last Name(LAST_NAME), First Name(FIRST_NAME), Phone Number(PHONE_NUMBER), Email Address(EMAIL)
function viewContactPerson ( response ) {

  var vals = response.values;

  helper.query( "SELECT CONTACT_PERSON_ID, LAST_NAME 'Last Name', FIRST_NAME 'First Name', " +
                "PHONE_NUMBER 'Phone Number', EMAIL 'Email Address' FROM CONTACT_PERSON " +
                "WHERE SUPPLIER_ID = '" + vals.supplier_id + "' ORDER BY LAST_NAME",
                function( error, rows, cols ) {

    console.log( "function: viewContactPerson- SELECT FROM CONTACT_PERSON " + rows );
                
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

// editContactPerson
// function: Update CONTACT_PERSON table with new contact person information for row CONTACT_PERSON_ID.
// required values: last_name, first_name, phone_number, email, contact_person_id
// Output: None.
function editContactPerson ( response ) {

  var vals = response.values;

  helper.query( "UPDATE CONTACT_PERSON SET LAST_NAME = '" + vals.last_name + "', FIRST_NAME ='" + vals.first_name +
                "', PHONE_NUMBER = '" + vals.phone_number + "', EMAIL = '" + vals.email + "' " +
                "WHERE CONTACT_PERSON_ID = '" + vals.contact_person_id + "'",
                function( error, rows, cols ) {

    console.log( "function: editContactPerson - UPDATE CONTACT_PERSON " + rows );
                
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
    }

    response.end();
  });
}

// deleteContactPerson
// Function: Delete from CONTACT_PERSON table the selected contact person.
// Required values: contact_person_id
// Output: None.
function deleteContactPerson ( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM CONTACT_PERSON WHERE CONTACT_PERSON_ID = '" + vals.contact_person_id + "'",
                function( error, rows, cols ) {

    console.log( "function: deleteContactPerson - DELETE FROM CONTACT_PERSON " + rows );
                
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
    }

    response.end();
  });
}

// createSupplierAddress
// function: Insert a new supplier address into SUPPLIER_ADDRESS table.
// Required values: supplier_id, address_line_1, address_line_2, city, prov_state, country, postal_zip, phone_number
// Output: None.
function createSupplierAddress ( response ) {
  var vals = response.values;

  helper.query( "INSERT INTO SUPPLIER_ADDRESS ( SUPPLIER_ID, ADDRESS_LINE_1, ADDRESS_LINE_2, CITY, PROV_STATE, COUNTRY, POSTAL_ZIP, PHONE_NUMBER ) " +
                "VALUES( '" + vals.supplier_id + "', '" + vals.address_line_1 + "', '" + vals.address_line_2 +
                "', '" + vals.city + "', '" + vals.prov_state + "', '" + vals.country + "', '" + vals.postal_zip +
                "', '" + vals.phone_number + "' )",
                function( error, rows, cols ) {

    console.log( "function: createSupplierAddress - INSERT INTO SUPPLIER_ADDRESS " + rows );
                
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
    }
    
    response.end();
  });  
}

// viewSupplierAddress
// Function: Select from SUPPLIER_ADDRESS table a list of addresses for the current supplier.
// Required values: supplier_id
// Output: ADDRESS_ID, Address Line 1(ADDRESS_LINE_1), Address_Line_2(ADDRESS_LINE_2), City(CITY), Province/State(PROV_STATE), Country(COUNTRY), Postal/Zip Code(POSTAL_ZIP), Phone Number(PHONE_NUMBER)
function viewSupplierAddress ( response ) {

  var vals = response.values;

  helper.query( "SELECT ADDRESS_ID, ADDRESS_LINE_1 'Address Line 1', ADDRESS_LINE_2 'Address Line 2', " +
                "CITY 'City', PROV_STATE 'Province/State', COUNTRY 'Country', " +
                "POSTAL_ZIP 'Postal/Zip Code', PHONE_NUMBER 'Phone Number' " +
                "FROM SUPPLIER_ADDRESS WHERE SUPPLIER_ID = '" + vals.supplier_id + "' ORDER BY ADDRESS_ID",
                function( error, rows, cols ) {

    console.log( "function: viewSupplierAddress - SELECT FROM SUPPLIER_ADDRESS " + rows );
                
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

// editSupplierAddress
// function: Update SUPPLIER_ADDRESS table with new address information for row ADDRESS_ID.
// required values: address_line_1, address_line_2, city, prov_state, country, postal_zip, phone_number, address_id
// Output: None.
function editSupplierAddress ( response ) {

  var vals = response.values;

  helper.query( "UPDATE SUPPLIER_ADDRESS SET ADDRESS_LINE_1 = '" + vals.address_line_1 + "', ADDRESS_LINE_2 ='" + vals.address_line_2 +
                "', CITY = '" + vals.city + "', PROV_STATE = '" + vals.prov_state + "', COUNTRY = '" + vals.country +
                "', POSTAL_ZIP = '" + vals.postal_zip + "', PHONE_NUMBER = '" + vals.phone_number + "' " + 
                "WHERE ADDRESS_ID = '" + vals.address_id + "'",
                function( error, rows, cols ) {

    console.log( "function: editSupplierAddress - UPDATE SUPPLIER_ADDRESS " + rows );
                
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
    }

    response.end();
  });
}

// deleteSupplierAddress
// Function: Delete from SUPPLIER_ADDRESS table the selected supplier.
// Required values: address_id
// Output: None.
function deleteSupplierAddress ( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM SUPPLIER_ADDRESS WHERE ADDRESS_ID = '" + vals.address_id + "'",
                function( error, rows, cols ) {

    console.log( "function: deleteSupplierAddress - DELETE FROM SUPPLIER_ADDRESS " + rows );
                
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
    }

    response.end();
  });
}

// createPurchaseOrder
// function: Insert a new purchase order into PURCHASE_ORDER table with 'Queued' status.
// Required values: delivery_date, deliver_time, ref_number, comment
// Output: None.
function createPurchaseOrder( response ) {

  var vals = response.values;
  
  helper.query( "INSERT INTO PURCHASE_ORDER( STATUS, DELIVERY_DATE, DELIVER_TIME, REF_NUMBER, COMMENT, SUPPLIER_ID )" +
                "VALUES( 'Queued', '" + vals.delivery_date + "', '" + vals.delivery_time +
                "', '" + vals.ref_number + "', '" + vals.comment + "', '" + vals.supplier_id + "' )",
                function( error, rows, cols ) {

    console.log( "function: createPurchaseOrer - INSERT INTO PURCHASE_ORDER " + rows );
                
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
    }
    
    response.end();
  });
}

// viewPurchaseOrders
// function: select count(*) from PURCHASE_ORDER table for calculating number of page tabs required.
// Required values: none.
// Output: COUNT(*)
function viewPurchaseOrders( response ) {

  var vals = response.values;

  helper.query( "SELECT COUNT(*) FROM PURCHASE_ORDER WHERE STATUS LIKE '" + vals.status + "'",
                function( error, rows, cols ) {

    console.log( "function: viewPurchaseOrders - SELECT FROM PURCHASE_ORDER " + rows );
                
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

// viewPurchaseOrdersPage
// Function: Select from PURCHASE_ORDER table a list of purchase orders for the current page tab of a specific status.
// Required values: status, pagenum(current page tab number)
// Output: PO Number(PO_ID), Current Status(STATUS), Date Created(CREATE_DATE), Date Submitted(SUBMIT_DATE), Delivery Date(DELIVERY_DATE), Delivery Time(DELIVER_TIME), Date Received(RECEIVE_DATE), Reference Number(REF_NUMBER), Comments(COMMENT), Supplier(NAME)
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

    console.log( "function: viewPurchaseOrdersPage - SELECT FROM PURCHASE_ORDER " + rows );
                
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

// editPurchaseOrder
// function: Update PURCHASE_ORDER table with new purchase order information for row PO_ID (Leaving status as is).
// required values: delivery_date, delivery_time, ref_number, comment, supplier_id, po_id
// Output: None.
function editPurchaseOrder( response ) {

  var vals = response.values;

  helper.query( "UPDATE PURCHASE_ORDER SET DELIVERY_DATE = '" + vals.delivery_date + "', DELIVERY_TIME = '" + vals.delivery_time +
                "', REF_NUMBER = '" + vals.ref_number + "', COMMENT = '" + vals.comment + "', SUPPLIER_ID = '" + vals.supplier_id + "' " +
                "WHERE PO_ID = '" + vals.po_id + "'",
                function( error, rows, cols ) {

    console.log( "function: editPurchaseOrder - UPDATE PURCHASE_ORDER " + rows );
                
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
    }

    response.end();
  });
}

// submitPurchaseOrder
// function: Update PURCHASE_ORDER table with 'Submitted' status for selected PO ID.
// required values: po_id
// Output: None.
function submitPurchaseOrder( response ) {

  var vals = response.values;

  helper.query( "UPDATE PURCHASE_ORDER SET STATUS = 'Submitted', SUBMIT_DATE = CURRENT_TIMESTAMP " +
                "WHERE PO_ID = '" + vals.po_id + "'",
                function( error, rows, cols ) {

    console.log( "function: submitPurchaseOrder - UPDATE PURCHASE_ORDER " + rows );
                
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
    }

    response.end();
  });
}

// cancelPurchaseOrder
// function: Update PURCHASE_ORDER table with 'Cancelled' status for selected PO ID.
// required values: po_id
// Output: None.
function cancelPurchaseOrder( response ) {

  var vals = response.values;

  helper.query( "UPDATE PURCHASE_ORDER SET STATUS = 'Cancelled' WHERE PO_ID = '" + vals.po_id + "'",
                function( error, rows, cols ) {

    console.log( "function: cancelPurchaseOrder - UPDATE PURCHASE_ORDER " + rows );
                
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
    }

    response.end();
  });
}

// returnPurchaseOrder
// function: Update PURCHASE_ORDER table with 'Returned' status for selected PO ID.
// required values: po_id
// Output: None.
function returnPurchaseOrder( response ) {

  var vals = response.values;

  helper.query( "UPDATE PURCHASE_ORDER SET STATUS = 'Returned' " +
                "WHERE PO_ID = '" + vals.po_id + "'",
                function( error, rows, cols ) {

    console.log( "function: returnPurchaseOrder - UPDATE PURCHASE_ORDER " + rows );
                
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
    }

    response.end();
  });
}

// receivePurchaseOrder
// function: Update PURCHASE_ORDER table with 'Received' status for selected PO ID.
// required values: po_id
// Output: None.
function receivePurchaseOrder( response ) {

  var vals = response.values;

  helper.query( "UPDATE PURCHASE_ORDER SET STATUS = 'Received', RECEIVE_DATE = CURRENT_TIMESTAMP " +
                "WHERE PO_ID = '" + vals.po_id + "'",
                function( error, rows, cols ) {

    console.log( "function: receivePurchaseOrder - UPDATE PURCHASE_ORDER " + rows );
                
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
    }

    response.end();
  });
}

// createOrderLine
// function: Insert a new order line into PO_LINE table.
// Required values: po_id, po_line_id, item_id, qty_ordered, comment, userName(current logged in user ID), price_id
// Output: None.
function createOrderLine( response ) {

  var vals = response.values;
  
  helper.query( "INSERT INTO PO_LINE( PO_ID, PO_LINE_ID, ITEM_ID, QTY_ORDERED, COMMENT, AUTHOR, PRICE_ID) " +
                "VALUES( '" + vals.po_id + "', " + vals.po_line_id + "', '" + vals.item_id + "', '" + vals.qty_ordered +
                "', '" + vals.comment + "', '" + vals.userName + "', '" + vals.price_id + "' ) " +
                function( error, rows, cols ) {

    console.log( "function: createOrderLine - INSERT INTO PO_LINE " + rows );
    
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
    }
    
    response.end();
  });
}

// viewOrderLines
// Function: Select from ORDER_LINE table a list of order lines for the current po.
// Required values: po_id
// Output: Line(PO_LINE_ID), Item Name(ITEM_NAME), Qty Ordered(QTY_ORDERED), qty Received(QTY_RECEIVED), Comments(COMMENT), Created By(AUTHOR), Latest Price(PRICE)
function viewOrderLines( response ) {

  var vals = response.values;

  helper.query( "SELECT p.PO_LINE_ID 'Line', i.ITEM_NAME 'Item Name', p.QTY_ORDERED 'Qty Ordered', " +
                "p.QTY_RECEIVED 'Qty Received', p.COMMENT 'Comments', p.AUTHOR 'Created By', ph.PRICE 'Latest Price' " +
                "FROM PO_LINE p LEFT OUTER JOIN ITEM i ON p.ITEM_ID = i.ITEM_ID " +
                "LEFT OUTER JOIN PRICE_HISTORY ph ON p.PRICE_ID = ph.PRICE_ID WHERE PO_ID = '" + vals.po_id + "' " + 
                "ORDER BY PO_LINE_ID",
                function( error, rows, cols ) {

    console.log( "function: viewOrderLines - SELECT FROM PO_LINE " + rows );
                
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

// editOrderLine
// function: Update PO_LINE table with new Order line information for row PO_LINE_ID.
// required values: item_id, qty_ordered, qty_received, comment, userName (current logged in user ID), price_id, po_id, po_line_id
// Output: None.
function editOrderLine( response ) {
  var vals = response.values;

  helper.query( "UPDATE PO_LINE SET ITEM_ID = '" + vals.item_id + "', QTY_ORDERED ='" + vals.qty_ordered +
                "', QTY_RECEIVED = '" + vals.qty_received + "', COMMENT = '" + vals.comment + "', AUTHOR = '" + vals.userName +
                "', PRICE_ID = '" + vals.price_id + "' " + 
                "WHERE PO_ID = '" + vals.po_id + "' AND PO_LINE_ID = '" + vals.po_line_id + "'",
                function( error, rows, cols ) {

    console.log( "function: editOrderLines - UPDATE PO_LINE " + rows );

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
    }

    response.end();
  });
}

// deleteOrderLine
// Function: Delete from PO_LINE table the selected order line.
// Required values: po_id, po_line_id
// Output: None.
function deleteOrderLine ( response ) {

  var vals = response.values;
  
  helper.query( "DELETE FROM PO_LINE WHERE PO_ID = '" + vals.po_id + "' AND PO_LINE_ID = '" + vals.po_line_id + "'",
                function( error, rows, cols ) {

    console.log( "function: deleteOrderLines - DELETE FROM PO_LINE " + rows );
                
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
    }

    response.end();
  });
}

// createReturnLine
// function: Insert a new return line into RETURN_LINE table.
// Required values: po_id, return_line_id, po_line_id, return_date, qty_returned, credit_memo_num, comment, userName(current logged in user ID)
// Output: None.
function createReturnLine( response ) {

  var vals = response.values;
  
  helper.query( "INSERT INTO RETURN_LINE( PO_ID, RETURN_LINE_ID, PO_LINE_ID, RETURN_DATE, QTY_RETURNED, CREDIT_MEMO_NUM, COMMENT, AUTHOR) " +
                "VALUES( '" + vals.po_id + "', '" + vals.return_line_id + "', '" + vals.po_line_id + "', '" + vals.return_date +
                "', '" + vals.qty_returned + "', '" + vals.credit_memo_num + "', '" + vals.comment + "', '" + vals.userName + "' ) " +
                function( error, rows, cols ) {

    console.log( "function: createReturnLine - INSERT INTO RETURN_LINE" + rows );
                
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
    }
    
    response.end();
  });
}

// getSupplierList
// Function: select from SUPPLIER table supplier's name and supplier ID.
// Required values: None.
// Output: SUPPLIER_ID, NAME
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

// getCategoryList
// Function: select from CATEGORY table all the categories.
// Required values: None.
// Output: CAT_NAME
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

// getItemList
// Function: select from ITEM table item name and item ID for a specific supplier.
// Required values: None.
// Output: ITEM_NAME, ITEM_ID
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

// getUser
// Function: select from USER table all information of a single user.
// Required values: userName(current logged in user ID).
// Output: USER_ID, PASSWORD, EMAIL, EMPLOYEE_ID, ROLE
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

// getItem
// Function: select from ITEM table all information of a single item.
// Required values: item_id
// Output: ITEM_ID, DIST_CODE, ITEM_NAME, RECEIPT_NAME, CATEGORY, UNIT, ITEM_TYPE, COMMENT, LATEST_PRICE, SUPPLIER_ID, U_ACTIVE_INA, U_BIZERBA, U_BRAND, U_CASE_SIZE, U_MINOR_REPO, U_COOKING_IN, U_COUNTRY, U_DATE_CREAT, U_DATE_MOTIF, U_DESCRIPTO, U_EXPIRY_DAT, U_INGREDIENT, U_KEYWORDS, U_NOTES, U_ORDER, U_PLU, U_PRICE, U_SILVERWARE, U_SKU, U_STORAGE, U_STORAGE_TY, U_TYPE, U_UPC_CODE, U_USERNAME_C, U_USERNAME_M, U_PRICE_PER, U_TAX, U_SCALE
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

// getPurchaseOrder
// Function: select from PURCHASE_ORDER table all information of a single purchase order.
// Required values: po_id
// Output: PO_ID, STATUS, CREATE_DATE, SUBMIT_DATE, DELIVERY_DATE, DELIVERY_TIME, RECEIVE_DATE, REF_NUMBER, COMMENT, SUPPLIER_ID
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
exports.editAccount = editAccount;

exports.createUserCheckDupe = createUserCheckDupe;
exports.createUser = createUser;
exports.viewUsers = viewUsers;
exports.viewUsersPage = viewUsersPage;
exports.editUser = editUser;
exports.deleteUser = deleteUser;

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
