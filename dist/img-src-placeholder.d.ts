//! img-src-placeholder v1.2.1 ~~ https://github.com/center-key/img-src-placeholder ~~ MIT License

import { Results } from 'replacer-util';
export type Settings = {
    cd: string | null;
    extensions: string[];
    filename: string | null;
};
export type ReporterSettings = {
    summaryOnly: boolean;
};
declare const imgSrcPlaceholder: {
    htmlExts: string[];
    assert(ok: unknown, message: string | null): void;
    cli(): void;
    transform(sourceFolder: string, targetFolder: string, options?: Partial<Settings>): Results;
    reporter(results: Results, options?: Partial<ReporterSettings>): Results;
};
export { imgSrcPlaceholder };
