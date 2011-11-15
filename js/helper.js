$( function() {
  (function(){
    //  Create global helper object
    window.edstHelper = function() {

      var cart = {};
      //  Return an object, all declared variables will persist in this closure
      return {

        // add item to the shopping cart
        addItem: function( id ) {

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
