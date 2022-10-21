//! img-src-placeholder v0.1.0 ~~ https://github.com/center-key/img-src-placeholder ~~ MIT License

import { replacer } from 'replacer-util';
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
        return replacer.transform(sourceFolder, targetFolder, replacerSettings);
    },
};
export { imgSrcPlaceholder };
