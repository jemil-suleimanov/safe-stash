import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { VitePlugin } from '@electron-forge/plugin-vite';
import type { ForgeConfig } from '@electron-forge/shared-types';

const config: ForgeConfig = {
    packagerConfig: {
        asar:   true,
        ignore: [
            /node_modules\/(?!(better-sqlite3|bindings|file-uri-to-path)\/)/,
        ],
        extraResource: ['src/electron/database/schema.sql'],
        icon:          './assets/icons/safe-stash-icon.png',
    },
    rebuildConfig: {},
    makers:        [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
    plugins:       [
        new AutoUnpackNativesPlugin({}),
        new VitePlugin({
            build: [
                {
                    entry:  'src/electron/core/main.ts',
                    config: 'vite.main.config.ts',
                    target: 'main',
                },
                {
                    entry:  'src/electron/preload/preload.ts',
                    config: 'vite.preload.config.ts',
                    target: 'preload',
                },
            ],
            renderer: [
                {
                    name:   'main_window',
                    config: 'vite.renderer.config.ts',
                },
            ],
        }),
        new FusesPlugin({
            version:                                               FuseVersion.V1,
            [FuseV1Options.RunAsNode]:                             false,
            [FuseV1Options.EnableCookieEncryption]:                true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]:  false,
            [FuseV1Options.EnableNodeCliInspectArguments]:         false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]:                   true,
        }),
    ],
};

export default config;
