//! img-src-placeholder v1.1.2 ~~ https://github.com/center-key/img-src-placeholder ~~ MIT License

import { replacer } from 'replacer-util';
import chalk from 'chalk';
import log from 'fancy-log';
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
    reporter(results, options) {
        const defaults = {
            summaryOnly: false,
        };
        const settings = { ...defaults, ...options };
        const name = chalk.gray('img-src-placeholder');
        const source = chalk.blue.bold(results.source);
        const target = chalk.magenta(results.target);
        const arrow = { big: chalk.gray.bold(' ⟹  '), little: chalk.gray.bold('→') };
        const infoColor = results.count ? chalk.white : chalk.red.bold;
        const info = infoColor(`(files: ${results.count}, ${results.duration}ms)`);
        log(name, source, arrow.big, target, info);
        const logFile = (file) => log(name, chalk.white(file.origin), arrow.little, chalk.green(file.dest));
        if (!settings.summaryOnly)
            results.files.forEach(logFile);
        return results;
    },
};
export { imgSrcPlaceholder };
