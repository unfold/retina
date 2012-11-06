var css = require('css'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp').sync,
    Canvas = require('canvas');

exports = module.exports = scaler;

var urlPattern = /url\(['"]?((?:[^'"@)]+)(@\w+)?.*)['"]?\)/;

var findBackgrounds = function(rules) {
    var visit = function(rules, backgrounds, media) {
        rules.forEach(function(rule) {
            if (rule.media) return visit(rule.rules, backgrounds, rule.media);

            rule.declarations.forEach(function(declaration) {
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

var findRetinaBackgrounds = function(backgrounds, basePath) {
    var visit = function(retinaBackgrounds, background) {
        var url = background.url.replace(/\.(\w+)$/, '@2x.$1');

        if (fs.existsSync(path.join(basePath, url))) {
            retinaBackgrounds.push({
                background: background,
                url: url
            });
        }

        return retinaBackgrounds;
    };

    return backgrounds.reduce(visit, []);
};

var createRetinaRules = function(retinaBackgrounds, basePath) {
    return retinaBackgrounds.map(function(retinaBackground) {
        var background = retinaBackground.background;
        var image = new Canvas.Image();
        image.src = path.join(basePath, retinaBackground.url);

        return {
            media: [background.media || 'all', '(-webkit-min-device-pixel-ratio: 1.5)'].join(' and '),
            rules: [{
                selectors: background.rule.selectors,
                declarations: [
                    {property: 'background-image', value: 'url(' + retinaBackground.url + ')'},
                    {property: 'background-size', value: image.width + 'px auto'}
                ]
            }]
        };
    });
};

var createResizedBackgrounds = function(retinaBackgrounds, basePath, targetPath) {
    var generatedPath = path.join(basePath, targetPath);
    var generatedExists;

    return retinaBackgrounds.reduce(function(resizedBackgrounds, retinaBackground) {
        var background = retinaBackground.background;

        if (!fs.existsSync(path.join(basePath, background.url))) {
            var url = path.join(targetPath, path.basename(background.url));

            var image = new Canvas.Image();
            image.src = path.join(basePath, retinaBackground.url);

            var width = Math.round(image.width / 2);
            var height = Math.round(image.height / 2);

            var canvas = new Canvas(width, height);
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, width, height);

            if (!generatedExists) {
                generatedExists = !fs.existsSync(generatedPath) && mkdirp(generatedPath);
            }

            fs.writeFileSync(path.join(basePath, url), canvas.toBuffer());

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

function scaler(filename, targetPath) {
    var ast = css.parse(fs.readFileSync(filename, 'utf-8'));
    var rules = ast.stylesheet.rules;
    var basePath = path.dirname(filename);

    var backgrounds = findBackgrounds(rules);
    var retinaBackgrounds = findRetinaBackgrounds(backgrounds, basePath);
    var retinaRules = createRetinaRules(retinaBackgrounds, basePath);
    rules.push.apply(rules, retinaRules);

    var resizedBackgrounds = createResizedBackgrounds(retinaBackgrounds, basePath, targetPath);
    updateResizedBackgroundRules(resizedBackgrounds);

    return css.stringify(ast);
}