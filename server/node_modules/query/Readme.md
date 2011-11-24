
# Query

 jQuery for the command-line. Written with [node](http://nodejs.org), jQuery of course, and jsdom, currently supporting a small subset of jquery functionality due to some jsdom/htmlparser issues, but still plenty useful and fun :).

## Installation

    $ npm install query

## Examples

  Twitter logo alt text:
  
    $ curl http://twitter.com | query 'a#logo img' attr alt
    Twitter

  Alternately, since the output is simply more html, we can achieve this same result via pipes:
  
    $ curl http://twitter.com | query 'a#logo' | query img attr alt
    Twitter

  Check if a class is present:
  
    $ curl http://twitter.com | query .article '#timeline' hasClass statuses
    true
    
    $ echo $?
    0

  Exit status for bools:
  
    $ echo '<div class="foo bar"></div>' | ./index.js div hasClass baz
    false
    
    $ echo $?
    1

  Grab width or height attributes:
  
    $ echo '<div class="user" width="300"></div>' | query div.user width
    300

  Output element text:
  
    $ echo '<p>very <em>slick</em></p>' | query p text
    very slick

  Values:
  
    $ echo '<input type="text" value="tj@vision-media.ca"/>' | query input val
    tj@vision-media.ca
  
  Get second li's text:
  
    $ echo $list | query ul li get 1 text
    two
  
  Get third li's text using `next`:
  
    $ echo $list | query ul li get 1 next text
    three

  Get length:
  
    $ echo '<ul><li></li><li></li></ul>' | query li length
    2

  `is()` support:
  
    $ curl http://twitter.com | query script is '[type=text/javascript]'
    true
