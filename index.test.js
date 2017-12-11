const subject = require('./index')

describe('CSS Modules rewire', () => {

    const mockDevelopmentConfig = {
        module: {
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    enforce: 'pre',
                    use: [
                        {options: {}, loader: '/path/to/eslint-loader/index.js'}
                    ],
                    include: '/path/to/src'
                },
                {
                    oneOf: [
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            loader: '/path/to/url-loader/index.js',
                            options: {},
                        },
                        {
                            test: /\.(js|jsx|mjs)$/,
                            include: '/path/to/src',
                            loader: '/path/to/babel-loader/lib/index.js',
                            options: {},
                        },
                        {
                            test: /\.css$/,
                            use: [
                                '/path/to/style-loader/index.js',
                                {
                                    loader: '/path/to/css-loader/index.js',
                                    options: {importLoaders: 1},
                                },
                                {
                                    loader: '/path/to/postcss-loader/lib/index.js',
                                    options: {},
                                },
                            ],
                        },
                        {
                            exclude: [/\.js$/, /\.html$/, /\.json$/],
                            loader: '/path/to/file-loader/dist/cjs.js',
                            options: {name: 'static/media/[name].[hash:8].[ext]'},
                        },
                    ]
                }]
        }
    }

    const mockProductionConfig = {
        module: {
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    enforce: 'pre',
                    use: [
                        {options: {}, loader: '/path/to/eslint-loader/index.js'}
                    ],
                    include: '/path/to/src'
                },
                {
                    oneOf: [
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            loader: '/path/to/url-loader/index.js',
                            options: {},
                        },
                        {
                            test: /\.(js|jsx|mjs)$/,
                            include: '/path/to/src',
                            loader: '/path/to/babel-loader/lib/index.js',
                            options: {},
                        },
                        {
                            test: /\.css$/,
                            loader: [
                                {
                                    loader: '/path/to/extract-text-webpack-plugin/dist/loader.js',
                                    options: {}
                                },
                                {
                                    loader: '/path/to/style-loader/index.js',
                                    options: {}
                                },
                                {
                                    loader: '/path/to/css-loader/index.js',
                                    options: {
                                        importLoaders: 1,
                                        minimize: true,
                                        sourceMap: true
                                    }
                                },
                                {
                                    loader: '/path/to/postcss-loader/lib/index.js',
                                    options: {}
                                }
                            ]
                        },
                        {
                            exclude: [/\.js$/, /\.html$/, /\.json$/],
                            loader: '/path/to/file-loader/dist/cjs.js',
                            options: {name: 'static/media/[name].[hash:8].[ext]'},
                        },
                    ]
                }]
        }
    }

    describe('CSS loaders', () => {
        describe('development', () => {

            const result = subject(mockDevelopmentConfig)
            const cssLoader = result.module.rules[1].oneOf[2]
            const cssModulesLoader = result.module.rules[1].oneOf[3]

            it('should exclude modules from the regular loader', () => {
                expect(cssLoader.exclude).toEqual(/\.module\.css$/)
            })

            it('should leave the regular loader configuration intact', () => {
                expect(cssLoader.use[1].options).toEqual({
                    importLoaders: 1
                })
            })

            it('should create a modules loader', () => {
                expect(cssModulesLoader.exclude).toBeUndefined()
                expect(cssModulesLoader.use[1].options).toEqual({
                    importLoaders: 1,
                    modules: true,
                    localIdentName: '[local]___[hash:base64:5]'
                })
            })
        })

        describe('production', () => {

            const result = subject(mockProductionConfig)
            const cssLoader = result.module.rules[1].oneOf[2]
            const cssModulesLoader = result.module.rules[1].oneOf[3]

            it('should exclude modules from the regular loader', () => {
                expect(cssLoader.exclude).toEqual(/\.module\.css$/)
            })

            it('should leave the regular loader configuration intact', () => {
                expect(cssLoader.loader[2].options).toEqual({
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true
                })
            })

            it('should create a modules loader', () => {
                expect(cssModulesLoader.exclude).toBeUndefined()
                expect(cssModulesLoader.loader[2].options).toEqual({
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true,
                    modules: true,
                    localIdentName: '[local]___[hash:base64:5]'
                })
            })
        })
    })
})
