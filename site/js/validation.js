/*
*	validation.js
*	PRJ666 Edward Street
*
*	This validates forms
*	Date:? 13-?Oct-2011
*
*/

(function($) {

var validation = function () {

	var rules = {
	
	email : {
		check: function(value) {
			if(value) {
				return testPattern(value,"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])");
			}
			return true;
		},
		msg : "Email address is not valid"
	},
	required: {
		check: function(value) {

			if(value) {
				return true;
			}
			else {
				return false;
			}
		},
		msg : "A required field"
	}
}
var testPattern = function(value, pattern) { //Private method

	var regExp = new RegExp(pattern,"");
	return regExp.test(value);
}
return {
	addRule : function(name, rule) {
	
		rules[name] = rule;
	},
	getRule : function(name) {

		return rules[name];
	}
	}
}

$.validation = new validation();
})(jQuery);

$.validation.addRule("test",{
    check: function(value) {
        if(value != "test") {
            return false;
        }
        return true;
    },
    msg : "Must equal to the word test."
});

$.validation.addRule("xhr-test", {
    check: function(value) {
        $.get("/url-to-username-check", { username: value }, function(data) {
            if(data.isValid) {
                return true;
            }
            return false;
        });
    },
    msg : "Username already exists."
});
