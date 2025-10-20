import { defineConfig, RsbuildConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginReact } from '@rsbuild/plugin-react';

const config: RsbuildConfig = {
    plugins: [
        pluginReact(),
        pluginBabel({
            include: /\.(?:jsx|tsx)$/,
            babelLoaderOptions(opts) {
                opts.plugins?.unshift('babel-plugin-react-compiler');
            },
        }),
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
