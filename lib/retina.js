var css = require('css'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp').sync,
    Canvas = require('canvas');

exports = module.exports = retina;

var urlPattern = /url\(['"]?((?:[^'"@)]+)(@[^\.]+)?[^'"]*)['"]?\)/;
var retinaQuery = '(-webkit-min-device-pixel-ratio: 1.5)';

var isRetinaRule = function(rule) {
    return rule.media && ~rule.media.indexOf(retinaQuery);
};

var combinePaths = function(a, b) {
    var segmentsA = a.split(path.sep);
    var segmentsB = b.split(path.sep);

    return segmentsA.concat(segmentsB.reduce(function(segments, segment, index) {
        if (segmentsA[index] !== segment) {
            segments.push(segment);
        }

        return segments;
    }, [])).join(path.sep);
};

var findBackgrounds = function(rules) {
    var visit = function(rules, backgrounds, media) {
        rules.forEach(function(rule) {
            if (rule.media) return visit(rule.rules, backgrounds, rule.media);

            rule.declarations && rule.declarations.forEach(function(declaration) {
                if ((declaration.property == 'background' || declaration.property == 'background-image')) {
                    var matches = urlPattern.exec(declaration.value);

                    if (matches) {
                        backgrounds.push({
                            rule: rule,
                            declaration: declaration,
                            media: media,
                            url: matches[1]
                        });
                    }
                }
            });
        });

        return backgrounds;
    };

    return visit(rules, []);
};

var findRetinaBackgrounds = function(backgrounds, sourcePath) {
    var visit = function(retinaBackgrounds, background) {
        if (!isRetinaRule(background)) {
            var retinaUrl = background.url.replace(/\.([a-z]+)$/, '@2x.$1');

            if (fs.existsSync(path.join(sourcePath, retinaUrl))) {
                retinaBackgrounds.push({
                    background: background,
                    url: retinaUrl
                });
           }
        }

        return retinaBackgrounds;
    };

    return backgrounds.reduce(visit, []);
};

var createMissingRetinaRules = function(backgrounds, retinaBackgrounds, sourcePath) {
    var retinaUrls = backgrounds.reduce(function(urls, background) {
        if (isRetinaRule(background)) {
            urls.push(background.url);
        }

        return urls;
    }, []);

    return retinaBackgrounds.filter(function(retinaBackground) {
        return !~retinaUrls.indexOf(retinaBackground.url);
    }).reduce(function(rules, retinaBackground) {
        var background = retinaBackground.background;

        var image = new Canvas.Image();
        image.src = path.join(sourcePath, background.url);

        var rule = {
            media: [background.media || 'all', retinaQuery].join(' and '),
            rules: [{
                selectors: background.rule.selectors,
                declarations: [
                    {property: 'background-image', value: 'url(' + retinaBackground.url + ')'},
                    {property: 'background-size', value: image.width + 'px auto'}
                ]
            }]
        };

        rules.push(rule);

        return rules;
    }, []);
};

var createResizedBackgrounds = function(retinaBackgrounds, sourcePath, targetPath) {
    return retinaBackgrounds.reduce(function(resizedBackgrounds, retinaBackground) {
        var background = retinaBackground.background;

        if (!fs.existsSync(path.join(sourcePath, background.url))) {
            var image = new Canvas.Image();
            image.src = path.join(sourcePath, retinaBackground.url);

            var width = Math.round(image.width / 2);
            var height = Math.round(image.height / 2);

            var canvas = new Canvas(width, height);
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, width, height);

            var combinedPath = combinePaths(targetPath, path.dirname(background.url));
            var generatedPath = path.join(sourcePath, combinedPath);
            var url = path.join(combinedPath, path.basename(background.url));

            if (!fs.existsSync(generatedPath)) {
                mkdirp(generatedPath);
            }

            fs.writeFileSync(path.join(sourcePath, url), canvas.toBuffer());

            background.url = url;
            resizedBackgrounds.push(background);
        }

        return resizedBackgrounds;
    }, []);
};

var updateResizedBackgroundRules = function(backgrounds) {
    backgrounds.forEach(function(background) {
        background.declaration.value = background.declaration.value.replace(urlPattern, 'url(' + background.url + ')');
    });
};

function retina(str, sourcePath, targetPath) {
    var ast = css.parse(str);
    var rules = ast.stylesheet.rules;

    var backgrounds = findBackgrounds(rules);
    var retinaBackgrounds = findRetinaBackgrounds(backgrounds, sourcePath);
    var resizedBackgrounds = createResizedBackgrounds(retinaBackgrounds, sourcePath, targetPath);
    updateResizedBackgroundRules(resizedBackgrounds);

    var missingRetinaRules = createMissingRetinaRules(backgrounds, retinaBackgrounds, sourcePath);
    rules.push.apply(rules, missingRetinaRules);

    return css.stringify(ast);
}
