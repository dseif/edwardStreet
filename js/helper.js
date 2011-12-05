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

          for ( var prop in cart ) {
            $( "#scBox" ).append( "<div edst-data='" + cart[ prop ][ "Item Name" ] +
              "' id='shoppingCart-" + cart[ prop ][ "Item ID" ] + "'>" +
              "<div style='display:inline-block'>" + cart[ prop ][ "Item Name" ] + "</div>" +
              "<div style='display:inline-block'>Qty: " + cart[ prop ].qty +
            "</div></div>" );
          }
        },
        // add item to the shopping cart
        addItem: function( obj ) {

          var id = obj[ "Item ID" ];

          if ( cart[ id ] ) {
            cart[ id ].qty = +cart[ id ].qty + +obj.qty;
          } else {
            cart[ id ] = obj;
          }

          var children = $( "#scBox" ).children();

          console.log( "CHILDS PLAY", children );
          for ( var i = 0, l = children.length; i < l; i++ ) {
            console.log( $( children[ i ] ).attr( "edst-data" ) );
            if ( $( children[ i ] ).attr( "edst-data" ) === obj[ "Item Name" ] ) {
              children[ i ].children[ 1 ].innerHTML = "Qty: " + cart[ id ].qty;
            }
          }
        },
        // change quantity of the item in the shopping cart
        changeItemQty: function( obj ) {

          var id = obj[ "Item ID" ];

          if ( cart[ id ] ) {
            cart[ id ].qty = obj.qty;
          /*} else {
            cart[ id ] = obj;
          }*/

          var children = $( "#scBox" ).children();

          console.log( "CHILDS PLAY 2.0", children );
          for ( var i = 0, l = children.length; i < l; i++ ) {
            console.log( $( children[ i ] ).attr( "edst-data" ) );
            if ( $( children[ i ] ).attr( "edst-data" ) === obj[ "Item Name" ] ) {
              children[ i ].children[ 1 ].innerHTML = "Qty: " + cart[ id ].qty;
            }
          }
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
