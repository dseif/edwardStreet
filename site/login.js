function getCookie( c_name ) {

  var i,
      x,
      y,
      ARRcookies = document.cookie.split( ";" );

  console.log( ARRcookies );
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
  exdate.setMinutes( exdate.getMinutes() + 30 );
  var c_value = escape( value ) + ( ( exdays == null ) ? "" : "; expires=" + exdate.toUTCString() );
  document.cookie = c_name + "=" + c_value;
}

document.addEventListener( "DOMContentLoaded", function( event ) {

  window.cookie = getCookie( "EDST_H" ); 
  if ( window.location.href !== "http://localhost/~dseif/edwardStreet/site/login.html" ) {
    if ( !cookie ) { 
      window.location = "http://localhost/~dseif/edwardStreet/site/login.html";
    } else {

      var tmpCookie = cookie.substring( 0, 2 ).toLowerCase();

      function alterUserMenu( items ) {

        for ( var i = items.length - 1; i >= 0; i-- ) {

          if ( items[ i ] && items[ i ].children[ 0 ].innerHTML !== "Change Password" ) {

            $( items[ i ] ).remove();
          }
        }
      };

      function removeLogMenu( item ) {

        item.remove();
      };

      if ( tmpCookie === "ad" ) {
        //  Early return so we dont check other ifs
        return;
      } else {

        alterUserMenu( $( "#userMenu" ).children()[ 1 ].children );
        removeLogMenu( $( "#viewLogMenu" ) );

        if ( tmpCookie === "bu" ) {

          return;
        }
    
        if ( tmpCookie === "su" ) {

          return;
        }

        if ( tmpCookie === "re" ) {

          return;
        }
      } 
    }
  }
}, false );
