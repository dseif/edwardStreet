function getCookie( c_name ) {

  var i,
      x,
      y,
      ARRcookies = document.cookie.split( ";" );

  for ( i = 0; i < ARRcookies.length; i++ ) {

    x = ARRcookies[ i ].substr( 0,ARRcookies[ i ].indexOf( "=" ) );
    y = ARRcookies[ i ].substr( ARRcookies[ i ].indexOf( "=" ) + 1 );
    x = x.replace( /^\s+|\s+$/g, "" );

    if ( x == c_name ) {
      return unescape( y );
    }
  }
}

function setCookie( c_name, value, exdays ) {

  var exdate = new Date();
  exdate.setDate( exdate.getDate() + exdays );
  var c_value = escape( value ) + ( ( exdays == null ) ? "" : "; expires=" + exdate.toUTCString() );
  document.cookie = c_name + "=" + c_value;
}

document.addEventListener( "DOMContentLoaded", function( event ) {

  var cookie = !getCookie( "EDST_H" ); 

  if ( !cookie ) {
    window.location = "http://localhost/~dseif/edwardStreet/site/login.html";
  } else {

    ookie = cookie.substring( 0, 2 );
    
    if ( cookie === "Ad" ) {
      //  Early return so we dont check other ifs
      return;
    }

    if ( cookie === "Bu" ) {
      //  Hide stuff buyers cant access
    }
    
    if ( cookie === "Su" ) {
      //  Hide stuff suppliers cant access
    }

    if ( cookie === "Re" ) {
      //  Hide stuff receivers cant access
    } 
  }
}, false );
