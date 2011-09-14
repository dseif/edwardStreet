//  router.js
//  used to route traffic to the appropriate requestHandler

//  route function to do our work
function route( handle, pathname ) {
console.log(typeof handle[ pathname ]);
  //  Call requestHandler function stored in our object if its there
  if ( typeof handle[ pathname ] === "function" ) {
    return handle[ pathname ]();

  //  else return not found
  } else {
    return "404 Not found";
  }
}

//  Export our module
exports.route = route;
