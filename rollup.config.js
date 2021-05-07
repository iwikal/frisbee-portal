import typescript from '@rollup/plugin-typescript'

export default ({
  input: 'src/index.ts',
  output: {
    file: 'build/index.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    typescript()
  ]
})
