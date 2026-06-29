//! img-src-placeholder v1.2.5 ~~ https://github.com/center-key/img-src-placeholder ~~ MIT License

import { cliArgvUtil } from 'cli-argv-util';
import { replacer } from 'replacer-util';
import chalk from 'chalk';
import fs from 'node:fs';
import log from 'fancy-log';
import path from 'node:path';
const imgSrcPlaceholder = {
    version: '1.2.5',
    htmlExts: ['.html', '.htm', '.php', '.aspx', '.asp', '.jsp'],
    assertOk(ok, message) {
        if (!ok)
            throw new Error(`[img-src-placeholder] ${message}`);
    },
    cli() {
        const validFlags = ['cd', 'ext', 'note', 'quiet', 'summary'];
        const cli = cliArgvUtil.parse(validFlags);
        const source = cli.params[0];
        const target = cli.params[1];
        const error = cli.invalidFlag ? cli.invalidFlagMsg :
            !source ? 'Missing source folder.' :
                !target ? 'Missing target folder.' :
                    cli.paramCount > 2 ? 'Extraneous parameter: ' + cli.params[2] :
                        null;
        imgSrcPlaceholder.assertOk(!error, error);
        const sourceFile = path.join(cli.flagMap.cd ?? '', source);
        const isFile = fs.existsSync(sourceFile) && fs.statSync(sourceFile).isFile();
        const sourceFolder = isFile ? path.dirname(source) : source;
        const options = {
            cd: cli.flagMap.cd ?? null,
            extensions: cli.flagMap.ext?.split(',') ?? [],
            filename: isFile ? path.basename(source) : null,
        };
        const results = imgSrcPlaceholder.transform(sourceFolder, target, options);
        if (!cli.flagOn.quiet)
            imgSrcPlaceholder.reporter(results, { summaryOnly: cli.flagOn.summary });
    },
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
        const version = chalk.gray('v' + imgSrcPlaceholder.version);
        const infoColor = results.count ? chalk.white : chalk.red.bold;
        const info = infoColor(`(files: ${results.count}, ${results.duration}ms)`);
        log(name, version, results.source, info);
        const logFile = (file, index) => log(name, chalk.magenta(index + 1), cliArgvUtil.colorizePath(file.destPath));
        const logSingleFile = (file) => log(name, cliArgvUtil.colorizePath(file.destPath));
        if (!settings.summaryOnly)
            results.files.forEach(results.count > 1 ? logFile : logSingleFile);
        return results;
    },
};
export { imgSrcPlaceholder };
