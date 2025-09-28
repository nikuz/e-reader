import { defineConfig, RsbuildConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginSolid } from '@rsbuild/plugin-solid';

const config: RsbuildConfig = {
    plugins: [
        pluginBabel({
            include: /\.(?:jsx|tsx)$/,
        }),
        pluginSolid(),
    ],
    html: {
        template: 'public/index.html',
    },
};

// if (process.env.NODE_ENV === 'production') {
//     config.server = {
//         publicDir: {
//             copyOnBuild: false,
//         }
//     };
// }

export default defineConfig(config);
