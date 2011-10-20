/*
*	validation.js
*	PRJ666 Edward Street
*
*	This validates forms
*	Date:? 13-?Oct-2011
*
*/

(function() {

  window.edwardValidation = {

    validateEmail: function( emailAddress ) {
      if ( emailAddress !== "SASHA" ) {
        return false;
      } else {
        return true;
      }
    }
  };
})();
