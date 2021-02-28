import resolve from 'rollup-plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import serve from 'rollup-plugin-serve';
import babel from "@rollup/plugin-babel";


export default {
  input: 'src/index.js',
  output: {
    name: 'EditmodeStandAlone',
    file: 'dist/standalone.js',
    format: 'umd',
  },
  plugins: [
    resolve(),
    filesize(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: "bundled"
    }),
    serve('dist')
  ]
};
