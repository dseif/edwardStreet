$( function() {
  (function(){
    //  Create global helper object
    window.edstHelper = function() {

      var cart = JSON.parse( localStorage.getItem( "shoppingCart" ) ) || {};
      //  Return an object, all declared variables will persist in this closure
      return {

        // update our localstorage
        updateStorage: function() {

          localStorage.setItem( "shoppingCart", JSON.stringify( cart ) );
        },
        // delete shopping cart
        deleteStorage: function() {

          localStorage.removeItem( "shoppingCart" );
          cart = {};
        },
        //update the cart on page change
        populateCart: function() {

          var cart = this.cart();

          $( "#scBox" ).html( " " );

          for ( var prop in cart ) {
            $( "#scBox" ).append( "<div id='innerScBox'></div>" );
            $( "#innerScBox" ).append( "<h3 edst-data='" + cart[ prop ][ "Item Name" ] +
              "' id='shoppingCart-" + cart[ prop ][ "Item ID" ] + "'>" +
              "<a href='#' style='display:inline-block'>" + cart[ prop ][ "Item Name" ] + "</a>" +
            "</h3><div id='scBoxQty-" + cart[ prop ][ "Item ID" ] + "'>Quantity: " + cart[ prop ].qty + "</br></div>" );
          }

          if( $( "#innerScBox" ).length ) {
            $( "#innerScBox" ).accordion( "destroy" );
            $( "#innerScBox" ).accordion({
              fillSpace: true,
              collapsible: true,
              active: false
            });
          }
        },
        // add item to the shopping cart
        addItem: function( obj ) {

          var id = obj[ "Item ID" ];

          console.log( id, cart[ id ] );
          if ( cart[ id ] ) {
            cart[ id ].qty = +cart[ id ].qty + +obj.qty;
          } else {
            cart[ id ] = obj;
          }

          $( "#scBoxQty-" + id ).html( "Quantity: " + obj.qty );
          this.populateCart();
        },
        // change quantity of the item in the shopping cart
        changeItemQty: function( obj ) {

          var id = obj[ "Item ID" ];

          if ( cart[ id ] ) {
            cart[ id ].qty = obj.qty;

            $( "#scBoxQty-" + id ).html( "Quantity: " + obj.qty );
          }
        },
        // return the users shopping cart object
        cart: function() {

          return cart;
        },
        // remove the selected item from the shopping cart
        removeItem: function( id ) {

          if ( cart[ id ] ) {
            delete cart[ id ];
          }
        },
        setupAccordion: function( element ) {
          $( element ).accordion({
            collapsible: true,
            fillSpace: true
          });
        },
        setupSortable: function() {
          $( "#scBox" ).sortable({
            revert: true
          });
        }
      };
    };
  })();
});
