/*
*	validation.js
*	PRJ666 Edward Street
*
*	This validates forms
*	Date: 11/9/2011 11:13:04 PM
*
*/

(function () {

    // Validates an array of fields that are required, as long as they have
    // been filled, it returns true, otherwise, it returns false
    window.edwardValidationRequired = {

        validateGeneral: function (whatIsValidated) {

            // Array to hold input fields that are blank
            var badArray = [];
            for (var i = 0, len = whatIsValidated.length; i < len; i++) {
                if (!document.getElementById(whatIsValidated[i]).value) {
                    badArray.push(whatIsValidated[i]);
                }
            }

            // If the array is empty, return true, otherwise, false
            if (badArray.length === 0) {
                return true;
            }
            else {
                return false;
            }
        }
    };

    // Validates an email address using a regular expression testing method
    window.edwardValidationEmail = {
        validateEmail: function (emailAddress) {
            if (testPattern(emailAddress, "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])")) {
                return true;
            } else {
                return false;
            }
        }
    };
    
    // Validates a number with decimals and a $ sign using a regular expression 
    // testing method
    window.edwardValidationNumber = {
        validateNumber: function (numberCheck) {
            if (testPattern(numberCheck, "^\\$[0-9,-\.]+$")) {
                return true;
            } else {
                return false;
            }
        }
    };
    
    // Validates a user id using a regular expression testing method
    window.edwardValidationUser = {
        validateUserName: function (userName) {
            if (testPattern(userName, "^[a-zA-Z0-9_@]*$") && userName != "") {
                return true;
            } else {
                return false;
            }
        }
    };

    // Validates two password fields using a regular expression testing method
    window.edwardValidationPass = {
        validatePass: function (passWord, passWord2) {
        if (passWord.length <= 20 && passWord.length >= 6 && passWord2.length <= 20 && passWord2.length >= 6) {
            if (passWord == passWord2 && passWord != "" && passWord2 != "") {
                return true;
            }
            else {
                return false;
            }
          }
        }
    };
    
    // Validates one password using a regular expression testing method    
    window.edwardValidationPassOne = {
        validatePassOne: function (passWord) {
            if (passWord.length <= 20 && passWord.length >= 6) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    
    // Validates a phone number using a regular expression testing method
    window.edwardValidationPhoneNum = {
        validatePhoneNum: function (phone) {
            if (testPattern(phone, "^[0-9]{3}-[0-9]{3}-[0-9]{4}$")){
                return true;
            }
            else {
                return false;
            }
        }
    };
    
    // Validates date using (DD/MM/YYYY style) regular expression testing method
    window.edwardValidationDate = {
        validateDate: function (dateDMY) {
            if (testPattern(dateDMY, "^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}$")){
                return true;
            }
            else {
                return false;
            }
        }
    };

    // A regular expression testing method, two values are passed, one is a
    // variable to be checked, and the other is a regular expression
    // pattern, and it returns true/false depending on the match
    var testPattern = function (value, pattern) {

        var regExp = new RegExp(pattern, "");
        return regExp.test(value);
    }

})();
