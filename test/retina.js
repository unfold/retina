var retina = require('..'),
    fs = require('fs'),
    Canvas = require('canvas');

function fixture(name) {
    return fs.readFileSync('test/fixtures/' + name + '.css', 'utf8');
}

describe('retina', function() {
    var targetPath = 'images/generated/scaled';

    it('should add retina declarations', function() {
        retina('test/fixtures/simple.css', targetPath).should.equal(fixture('simple.out'));
    });

    it('should use existing media queries', function() {
        retina('test/fixtures/media-query.css', targetPath).should.equal(fixture('media-query.out'));
    });

    it('should generate scaled images', function() {
        retina('test/fixtures/scale.css', targetPath).should.equal(fixture('scale.out'));

        var original = new Canvas.Image();
        original.src = 'test/fixtures/images/light-blue-circle@2x.png';

        var scaled = new Canvas.Image();
        scaled.src = 'test/fixtures/images/generated/scaled/light-blue-circle.png';
        scaled.width.should.equal(original.width / 2);
    });
});
