// img-src-placeholder ~~ MIT License

// Imports
import { replacer, Results } from 'replacer-util';
import chalk from 'chalk';
import log   from 'fancy-log';

// Types
export type Settings = {
   cd:         string | null,  //change working directory before starting search
   extensions: string[],       //filter files by file extensions, example: ['.html']
   filename:   string | null,  //single file in the source folder to be processed
   };
export type ReporterSettings = {
   summaryOnly: boolean,  //only print out the single line summary message
   };

const imgSrcPlaceholder = {

   htmlExts: ['.html', '.htm', '.php', '.aspx', '.asp', '.jsp'],

   assert(ok: unknown, message: string | null) {
      if (!ok)
         throw new Error(`[img-src-placeholder] ${message}`);
      },

   transform(sourceFolder: string, targetFolder: string, options?: Partial<Settings>): Results {
      const defaults: Settings = {
         cd:         null,
         extensions: [],
         filename:   null,
         };
      const settings = { ...defaults, ...options };
      const onePixelSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>';
      const dataImage =   'data:image/svg+xml;base64,' + Buffer.from(onePixelSvg).toString('base64');
      const replacerSettings = {
         cd:          settings.cd!,
         extensions:  settings.extensions.length ? settings.extensions : imgSrcPlaceholder.htmlExts,
         regex:       /src=["']?#["']?/gm,
         replacement: `src="${dataImage}"`,
         };
      return replacer.transform(sourceFolder, targetFolder, replacerSettings);
      },

   reporter(results: Results, options?: Partial<ReporterSettings>): Results {
      const defaults: ReporterSettings = {
         summaryOnly: false,
         };
      const settings = { ...defaults, ...options };
      const name =      chalk.gray('img-src-placeholder');
      const source =    chalk.blue.bold(results.source);
      const target =    chalk.magenta(results.target);
      const arrow =     { big: chalk.gray.bold(' ⟹  '), little: chalk.gray.bold('→') };
      const infoColor = results.count ? chalk.white : chalk.red.bold;
      const info =      infoColor(`(files: ${results.count}, ${results.duration}ms)`);
      log(name, source, arrow.big, target, info);
      const logFile = (file: Results['files'][0]) =>
         log(name, chalk.white(file.origin), arrow.little, chalk.green(file.dest));
      if (!settings.summaryOnly)
         results.files.forEach(logFile);
      return results;
      },

   };

export { imgSrcPlaceholder };
