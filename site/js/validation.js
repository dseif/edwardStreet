/*
*	validation.js
*	PRJ666 Edward Street
*
*	This validates forms
*	Date: 13-Oct-2011
*
*/

(function() {

  window.edwardValidation = {

    validateGeneral: function( whatIsValidated ) {

    }
  };
  
  	var testPattern = function(value, pattern) { //Private method

	var regExp = new RegExp(pattern,"");
	return regExp.test(value);
	}
	
    var validateEmail = function( emailAddress ) {
      if (testPattern(emailAddress,"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])")) {
        return true;
      } else {
        return false;
      }
    }
	
	var validateRequired = function( required ) {
      if (required == "") {
        return false;
      } else {
        return true;
      }
    }
})();
