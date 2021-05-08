import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve';

export default ({
  input: 'index.ts',
  output: {
    file: 'build/index.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    commonjs(),
    resolve({browser: true, exportConditions: ['browser']})
  ]
})