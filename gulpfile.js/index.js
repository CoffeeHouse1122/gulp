const { src, dest, series, parallel } = require("gulp");
const uglify = require("gulp-uglify");
const obfuscate = require("gulp-obfuscate");
const rename = require("gulp-rename");
const minifyCss = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const webpack = require("webpack-stream");
const named = require("vinyl-named");

function javascript() {
  return (
    src("src/*.js")
      .pipe(named())
      .pipe(
        webpack({
          mode: "none",
          module: {
            rules: [
              {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: [
                      [
                        "@babel/preset-env",
                        {
                          useBuiltIns: "usage", // "entry" = @babel/polyfill
                          corejs: { version: 3, proposals: true },
                        },
                      ],
                    ],
                    plugins: ["@babel/plugin-transform-runtime"],
                  },
                },
              },
            ]
          }
        })
      )
      .pipe(uglify({ mangle: { toplevel: true } })) // 压缩并字母化变量
      // .pipe(obfuscate({ replaceMethod: obfuscate.LOOK_OF_DISAPPROVAL })) // 混淆代码 默认参数LOOK_OF_DISAPPROVAL - ಠ_ಠ777; ZALGO - H͇̬͔̳̖̅̒ͥͧẸ̖͇͈͍̱̭̌͂͆͊_C͈OM̱̈́͛̈ͩ͐͊ͦEͨ̓̐S̬̘͍͕͔͊̆̑̈́̅
      .pipe(
        rename({
          dirname: "js", // 文件路径
          // basename: "text", // 文件名
          prefix: "", // 文件名前缀
          suffix: ".min", // 文件名后缀
          extname: ".js", // 文件扩展名
        })
      )
      .pipe(dest("output/"))
  );
}

function css() {
  return src("src/*.css")
    .pipe(
      autoprefixer({
        overrideBrowserslist: [
          // css兼容前缀
          "last 2 versions",
          "iOS >= 7",
          "Android > 4.1",
          "Firefox > 20",
        ],
        cascade: false, // 美化代码格式
      })
    )
    .pipe(
      minifyCss({
        specialComments: "all", //保留所有特殊前缀
        format: "keep-breaks", // 增加可读性
      })
    )
    .pipe(
      rename({
        dirname: "css", // 文件路径
        // basename: "text", // 文件名
        prefix: "", // 文件名前缀
        suffix: ".min", // 文件名后缀
        extname: ".css", // 文件扩展名
      })
    )
    .pipe(dest("output/"));
}

const build = series(javascript, css);

exports.css = css;
exports.javascript = javascript;
exports.build = build;
exports.default = build;
