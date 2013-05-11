[![build status](https://secure.travis-ci.org/unfold/retina.png)](http://travis-ci.org/unfold/retina)

### Retina

Retina analyzes your existing CSS files and generates missing non-retina resolution 
images by resizing their retina resolution counterpart. The result is an updated 
CSS stylesheet complete with media queries.

This means you'll be able to author your CSS files as if you were only working with
standard resolution images.

#### No strings attached

Instead of relying on a specific [framework](http://compass-style.org) or 
[build system](http://gruntjs.com) Retina will work with anything that outputs a CSS file.

## Installation

    $ npm install retina

### Usage

    $ retina [options] [file]

### Options

    -t, --target <path>   target path relative to input
    -s, --source <path>   source path relative to input (required when stdin is used)
    -h, --help            output usage information
    -V, --version         output the version number

### Examples

#### Generating downscaled images and updating rules of an existing CSS file:

    $ retina -t images/scaled main.css > main.scaled.css

#### Using Retina with [SASS](http://sass-lang.com):

    $ sass css/main.scss | retina --source css --target images/scaled > main.css

## License

(The MIT License)

Copyright (c) 2012 Simen Brekken &lt;simen@unfold.no&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
