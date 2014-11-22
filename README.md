Before you decide to use this library, be aware that [OpenType.js](https://nodebox.github.io/opentype.js)
has become better at doing what you were probably thinking
of using Font.js for - I still think JavaScript needs
a Font object, but at this point rewriting it from
scratch so that it's backed by OpenType.js is far more
sensible than using Font.js in its current form. So:
head on over there and discover an amazing library.

With that said....


Font.js
=======

Font.js adds new Font() functionality to the JavaScript
toolbox, akin to how you use new Image() for images. It
adds an onload event hook so that you don't deploy a
font resource on your webpage before it's actually ready
for use, as browsers can tell you when a font has
downloaded, but not when it has been parsed and made
ready for on-page rendering. This object can. It can
also do this for system fonts, so you can also use
Font.js to detect whether a specific system font is
installed at the client, for fallbacks and failsafes.

The API is pretty straight forward:

  * constructor
    
      var font = new Font();

  * load event handler

    font.onload = function() {
      /* your code here */
    };

  * error event handler

    font.onerror = function(error_message) {
      /* your code here */
    };

  * name assignment

    font.fontFamily = "name goes here";

  * font loading

    - remote fonts:

      font.src = "http://your.font.location/here.ttf";

    (!) This line will kick off font loading and
    will make the font available on-page (if a
    remote font was requested).


    - system fonts / already @font-face loaded fonts:

      font.src = font.fontFamily;

    (!) Note that this also works for google webfont and
    typekit fonts that have been loaded through an HTML
    stylesheet. Any font that is available by name, rather
    than by font file, can be loaded using the above
    "src=fontFamily" solution.


  * DOM removal

    document.head.removeChild(font.toStyleNode());
    
    (!) this only applies to fonts loaded from a
    remote resource. System fonts do not have an
    associated style node.

  * DOM (re)insertion

    document.head.appendChild(font.toStyleNode());

    (!) This is only required if you removed the
    font from the page, as the font is added to the
    DOM for use on-page during font loading already.

    (!) this only applies to fonts loaded from a
    remote resource. System fonts do not have an
    associated style node.

Font Metrics API
----------------

  * font.metrics.quadsize

    The font-indicated number of units per em
    
  * font.metrics.leading

    The font-indicated line height, in font units
    (this vaue is, often, useless)

  * font.metrics.ascent

    The maximum ascent for this font, as a ratio
    of the fontsize

  * font.metrics.decent

    The maximum descent for this font, as a ratio
    of the fontsize

  * font.metrics.weightclass

    The font-indicated weight class
      
  (!) As system font files cannot be inspected, they
  do not have an associated font.metrics object.
  Instead, font.metrics is simply "false".


Text Metrics API
----------------

  * font.measureText(string, size)

    Compute the metrics for a particular string, with
    this font applied at the specific font size in pixels

  * font.measureText(...).width

    the width of the string in pixels, using this font
    at the specified font size

  * font.measureText(...).fontsize

    the specified font size

  * font.measureText(...).height

    the height of the string. This may differ from the
    font size

  * font.measureText(...).leading

    the actual line spacing for this font based on ten
    lines.

  * font.measureText(...).ascent

    the ascent above the baseline for this string

  * font.measureText(...).descent

    the descent below the baseline for this string

  * font.measureText(...).bounds

    An object {xmin:<num>, ymin:<num>, xmax:<num>,
    ymax:<num>} indicating the string's bounding box.

When font.src is set, the whole shebang kicks in, just
like for new Image(), so make sure to define your onload()
handler BEFORE setting the "src" property, or your handler
may not get called.

Demonstrator
------------

A demonstrator of this object can be found at:

  * http://pomax.nihongoresources.com/pages/Font.js

Font.js is compatible with all browsers that support
canvas and Object.defineProperty --  This includes all
versions of Firefox, Chrome, Opera, IE and Safari that
were 'current' (Firefox 9, Chrome 16, Opera 11.6, IE9,
Safari 5.1) at the time Font.js was released.

Note: Font.js will not work on IE8 or below due to the lack of
Object.defineProperty

This code is (c) Mike "Pomax" Kamermans, 2012, but
licensed under the MIT ("expat" flavour) license.
