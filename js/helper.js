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
        // add item to the shopping cart
        addItem: function( obj ) {

          var id = obj[ "ITEM_ID" ];

          if ( cart[ id ] ) {
            cart[ id ].qty = +cart[ id ].qty + +obj.qty;
          } else {
            cart[ id ] = obj;
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
