import { defineConfig, loadEnv } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { createHtmlPlugin } from 'vite-plugin-html';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import autoprefixer from 'autoprefixer';
import * as fs from 'fs';
import * as path from 'path';
import { fcmSwEnvPlugin } from './config/vitePlugins';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relative => path.resolve(appDirectory, relative);
const root = path.resolve(__dirname, resolveApp('src'));

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isBuild = command === 'build';

  return {
    base: '/',
    publicDir: 'static',
    ...(env.VITE_PORT
      ? {
          server: {
            port: Number(env.VITE_PORT),
          },
        }
      : {}),
    ...(isBuild
      ? {
          plugins: [
            handlebars({
              partialDirectory: path.resolve(__dirname, 'src/partials'),
            }),
            createHtmlPlugin({
              minify: true,
              entry: '/src/main.js',
              template: '/index.html',
            }),
            createSvgIconsPlugin({
              iconDirs: [path.resolve(__dirname, 'src/icons')],
              symbolId: '[name]',
            }),
          ],
        }
      : {
          plugins: [
            handlebars({
              partialDirectory: path.resolve(__dirname, 'src/partials'),
            }),
            createHtmlPlugin({
              minify: true,
              entry: '/src/main.js',
              template: '/index.html',
            }),
            createSvgIconsPlugin({
              iconDirs: [path.resolve(__dirname, 'src/icons')],
              symbolId: '[name]',
            }),
            fcmSwEnvPlugin(),
          ],
        }),
    ...(isBuild && {
      build: {
        target: 'esnext',
        rollupOptions: {
          input: {
            main: './index.html',
            'firebase-messaging-sw': './src/firebase-messaging-sw.js',
          },
          output: {
            entryFileNames: chunkInfo => {
              return chunkInfo.name === 'firebase-messaging-sw'
                ? '[name].js' // Output service worker in root
                : 'assets/[name]-[hash].js'; // Others in `assets/`
            },
          },
        },
      },
    }),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import "src/styles/base/_mixins.scss";
          @import "src/styles/base/_placeholders.scss";
          @import "src/styles/base/_functions.scss";
          @import "src/styles/base/_media.scss";
        `,
        },
      },
      devSourcemap: true,
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
    resolve: {
      alias: {
        '@': `${root}/`,
        '@static': `${root}/../static`,
      },
    },
  };
});
