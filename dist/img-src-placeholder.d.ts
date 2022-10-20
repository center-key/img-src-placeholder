//! img-src-placeholder v0.0.1 ~~ https://github.com/center-key/img-src-placeholder ~~ MIT License

import { Results } from 'replacer-util';
export declare type Settings = {
    cd: string | null;
    extensions: string[];
    filename: string | null;
};
export declare type Options = Partial<Settings>;
declare const imgSrcPlaceholder: {
    htmlExts: string[];
    transform(sourceFolder: string, targetFolder: string, options?: Options): Results;
};
export { imgSrcPlaceholder };
