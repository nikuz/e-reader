import { defineConfig, RsbuildConfig } from '@rsbuild/core';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginReact } from '@rsbuild/plugin-react';

const config: RsbuildConfig = {
    plugins: [
        pluginNodePolyfill(),
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
