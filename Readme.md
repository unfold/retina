[![build status](https://secure.travis-ci.org/unfold/retina.png)](http://travis-ci.org/unfold/retina)

# retina

  CSS processor which adds retina declarations where retina version images are found,
  generates scaled down non-retina images and updates the existing stylesheet

## Installation

    $ npm install retina

## retina(1)

```

Usage: retina [options] [< in [> out]] [file]

Options:

  -t, --target <path>   target path relative to input
  -s, --source <path>   source path relative to input (required when stdin is used)
  -h, --help            output usage information
  -V, --version         output the version number

```

for example:

```
$ retina -t images/generated/scaled css/main.css > css/main.scaled.css
```

or via `stdin`

```
$ cat css/main.css | retina -s css -t images/generated/scaled > css/main.scaled.css
```

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
