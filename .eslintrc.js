module.exports = {
  //一旦配置了root，ESlint停止在父级目录中查找配置文件
  root: true,
  parser: "babel-eslint", // 配置babel-eslint，避免在使用es6类属性时，eslint报Parsing error: Unexpected token
  //想要支持的JS语言选项
  parserOptions: {
      //启用ES6语法支持(如果支持es6的全局变量{env: {es6: true}}，则默认启用ES6语法支持)
      //此处也可以使用年份命名的版本号：2015
      ecmaVersion: 6,
      //默认为script
      sourceType: "module",
      //支持其他的语言特性
      ecmaFeatures: {}
  },
  //代码运行的环境，每个环境都会有一套预定义的全局对象，不同环境可以组合使用
  env: {
      amd: true, // 否则会出现'require' is not defined 提示
      es6: true,
      browser: true,
      jquery: true
  },
  //访问当前源文件中未定义的变量时，no-undef会报警告。
  //如果这些全局变量是合规的，可以在globals中配置，避免这些全局变量发出警告
  globals: {
      //配置给全局变量的布尔值，是用来控制该全局变量是否允许被重写
      test_param: true,
      window: true,
      process: false,
  },

  //集成推荐的规则
  extends: ["eslint:recommended"],

  // 启用额外的规则或者覆盖默认的规则
  // 规则级别分别：为"off"(0)关闭、"warn"(1)警告、"error"(2)错误--error触发时，程序退出
  rules: {
      // 关闭“禁用console”规则
      "no-console": "off",
      // 函数定义时括号前面要不要有空格
      "space-before-function-paren": [0, "always"],
      // 定义字符串不规范错误，要求字符串使用双引号
      quotes: ["error", "single"]
  }
}