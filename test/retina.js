var retina = require('..'),
    fs = require('fs'),
    Canvas = require('canvas');

var fixturePath = 'test/fixtures/';
var targetPath = 'images/generated/scaled';

function fixture(name) {
    return fs.readFileSync(fixturePath + name + '.css', 'utf8');
}

describe('retina', function() {
    it('should add retina declarations', function() {
        retina(fixture('simple'), fixturePath, targetPath).should.equal(fixture('simple.out'));
    });

    it('should not add duplicate retina declarations', function() {
        retina(fixture('duplicate'), fixturePath, targetPath).should.equal(fixture('duplicate.out'));
    });

    it('should use existing media queries', function() {
        retina(fixture('media-query'), fixturePath, targetPath).should.equal(fixture('media-query.out'));
    });

    it('should generate scaled images', function() {
        retina(fixture('scale'), fixturePath, targetPath).should.equal(fixture('scale.out'));

        var original = new Canvas.Image();
        original.src = 'test/fixtures/images/light-blue-circle@2x.png';

        var scaled = new Canvas.Image();
        scaled.src = 'test/fixtures/images/generated/scaled/light-blue-circle.png';
        scaled.width.should.equal(original.width / 2);
    });

    it('should use existing path suffix', function() {
        retina(fixture('path-suffix'), fixturePath, targetPath).should.equal(fixture('path-suffix.out'));
    });
});
