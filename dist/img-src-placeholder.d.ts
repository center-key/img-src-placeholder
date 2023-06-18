//! img-src-placeholder v1.0.2 ~~ https://github.com/center-key/img-src-placeholder ~~ MIT License

import { Results } from 'replacer-util';
export type Settings = {
    cd: string | null;
    extensions: string[];
    filename: string | null;
};
export type Options = Partial<Settings>;
declare const imgSrcPlaceholder: {
    htmlExts: string[];
    transform(sourceFolder: string, targetFolder: string, options?: Options): Results;
};
export { imgSrcPlaceholder };
