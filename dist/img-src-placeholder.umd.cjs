//! img-src-placeholder v0.1.0 ~~ https://github.com/center-key/img-src-placeholder ~~ MIT License

(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "replacer-util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.imgSrcPlaceholder = void 0;
    const replacer_util_1 = require("replacer-util");
    const imgSrcPlaceholder = {
        htmlExts: ['.html', '.htm', '.php', '.aspx', '.asp', '.jsp'],
        transform(sourceFolder, targetFolder, options) {
            const defaults = {
                cd: null,
                extensions: [],
                filename: null,
            };
            const settings = { ...defaults, ...options };
            const onePixelSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>';
            const dataImage = 'data:image/svg+xml;base64,' + Buffer.from(onePixelSvg).toString('base64');
            const replacerSettings = {
                cd: settings.cd,
                extensions: settings.extensions.length ? settings.extensions : imgSrcPlaceholder.htmlExts,
                regex: /src=["']?#["']?/gm,
                replacement: `src="${dataImage}"`,
            };
            return replacer_util_1.replacer.transform(sourceFolder, targetFolder, replacerSettings);
        },
    };
    exports.imgSrcPlaceholder = imgSrcPlaceholder;
});
