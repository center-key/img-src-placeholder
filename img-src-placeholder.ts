// img-src-placeholder ~~ MIT License

import { replacer, Results } from 'replacer-util';

export type Settings = {
   cd:         string | null,  //change working directory before starting search
   extensions: string[],       //filter files by file extensions, example: ['.html']
   filename:   string | null,  //single file in the source folder to be processed
   };
export type Options = Partial<Settings>;

const imgSrcPlaceholder = {

   htmlExts: ['.html', '.htm', '.php', '.aspx', '.asp', '.jsp'],

   transform(sourceFolder: string, targetFolder: string, options?: Options): Results {
      const defaults = {
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

   };

export { imgSrcPlaceholder };
