# 代码规范3大利器 prettier eslint husky

- prettier: 用于代码保存时候，自动根据规则，格式化代码，主要依赖IDE工具如vscode。
- eslint : 代码检查，检查代码的格式，对js语法检测、限制和修复，并且给出建议，依赖于命令执行
- husky ： git提交前的钩子，用于拦截代码并针对不符合规范做提示，生成git提交备注的规范格式。

# 1.prettier
## 1. 创建vite项目
```sh
npm create vite@latest
```

## 2. 首先安装vscode的prettier 插件
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/63cdd09fee3f4ed28a189e783f1211c0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1752806890&x-orig-sign=myUvRpGCrtCQwoQjmB%2F6WqNevH8%3D)

## 3. 测试
```sh
npx prettier --write .
```

这时候会把整个项目都格式化一遍

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/9d3ac83b100b430d89b07c28f5ed0d97~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1752807975&x-orig-sign=8c2ml6C%2FY4Ah%2FX9auw55WXWL3TI%3D)

同时我们也把命令加入的package.json 执行命令里

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/4235755ad75449489156d016650ce0bf~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1752808055&x-orig-sign=LM8eUf7BkUgyDNif7JKjjTrH8qM%3D)

```json
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "format": "npx prettier --write ."
  },
```


## 4. 创建个性prettier.config.js配置
一般prettier 有默认的配置，当然我们可以自己定制一个，再根目录创建prettier.config.js
```js
// prettier.config.js
/**
 * @type {import('prettier').Config}
 * @see https://www.prettier.cn/docs/options.html
 */
export default {
  printWidth: 400, // 最大行长规则通常设置为 100 或 120。
  tabWidth: 2, // 指定每个标签缩进级别的空格数。
  useTabs: false, // 使用制表符而不是空格缩进行。
  semi: false, // true（默认）: 在每条语句的末尾添加一个分号。false：仅在可能导致 ASI 失败的行的开头添加分号。
  vueIndentScriptAndStyle: true, // Vue 文件脚本和样式标签缩进
  singleQuote: true, // 使用单引号而不是双引号
  quoteProps: "consistent", // 引用对象中的属性时，仅在需要时在对象属性周围添加引号。
  bracketSpacing: true, // 在对象文字中的括号之间打印空格。
  trailingComma: "none", // "none":没有尾随逗号。"es5": 在 ES5 中有效的尾随逗号（对象、数组等），TypeScript 中的类型参数中没有尾随逗号。"all"- 尽可能使用尾随逗号。
  bracketSameLine: false, // 将>多行 HTML（HTML、JSX、Vue、Angular）元素放在最后一行的末尾，而不是单独放在下一行（不适用于自闭合元素）。
  jsxSingleQuote: false, // 在 JSX 中使用单引号而不是双引号。
  arrowParens: "always", // 在唯一的箭头函数参数周围始终包含括号。
  insertPragma: false, // 插入编译指示
  requirePragma: false, // 需要编译指示
  proseWrap: "never", // 如果散文超过打印宽度，则换行
  htmlWhitespaceSensitivity: "strict", // 所有标签周围的空格（或缺少空格）被认为是重要的。
  endOfLine: "lf", // 确保在文本文件中仅使用 ( \n)换行，常见于 Linux 和 macOS 以及 git repos 内部。
  rangeStart: 0, // 格式化文件时，回到包含所选语句的第一行的开头。
};
```


## 5. 保存时候自动格式化

- 优化体验，配置保存时候自动格式化
- 先添加vscode 需要的配置 .vscode/settings.json

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/ec96d36bf66545af94a5e0827182e1ab~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1752807869&x-orig-sign=87axORzrh8tRHbG8p9SfvTjaqoE%3D)

然后 每次修改完代码就可以自动格式化

## 6.安装依赖
> 注意：这一步一般不需要安装，因为插件已经集成好了。
```sh
npm i prettier@3.5.3 --save-dev
```

> 注意 有时候配置完也不生效，就需要整个vscode退出再打开才生效


# 2.eslint
## 1.快速构建版
### npx eslint --init 创建所有配置
```sh
 npx eslint --init
```
依次输入下面选项
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/b285d84aab0b47408315e3f944aac0ca~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1752809038&x-orig-sign=X3kW02%2BoPtNFtaxYiQ1RKCQ%2BiR0%3D)

在根目录自动创建了eslint.config.js

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
]);

```

## 2.配置pakaage.json
同时我们也把命令加入的package.json 执行命令里

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/4235755ad75449489156d016650ce0bf~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1752808055&x-orig-sign=LM8eUf7BkUgyDNif7JKjjTrH8qM%3D)

```json
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "format": "npx prettier --write .",
    "lint": "eslint",
    "lint:fix": "eslint --fix ."
  },
```


## 3.测试
我们在main.ts里面加入 `let a = "xx";`
```js
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

let a = "xx";
console.log(a);
createApp(App).mount("#app");
```
运行检查
```sh
npm run lint
```

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/e4399ab66b8f4f78b3628172592366f1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1752809312&x-orig-sign=VvZsGer%2FWeWomF5N626WOdyR%2FNI%3D)


![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/e749555229a2450cb0795d6cc35775b1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1752809408&x-orig-sign=QLd0bNj1ntQTVOjEGi%2BXWl%2BPYeA%3D)


这时候就会提示,一些错误建议，
`'a' is never reassigned. Use 'const' instead`,
我们尝试用fix修复
运行下面命令
```sh
npm run lint:fix
```
执行后 let 编程了 const

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/396d7ac9370d4633acf1d285c5f074c8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1752809445&x-orig-sign=AcAtDctBENSDlzcbKMQtPelEiRA%3D)



### 安装eslint 插件 
搜索安装eslint 的vscode插件
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/dfeb830f2f994065942490ef659804d8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1752817810&x-orig-sign=Qv0RjxOiBxziJthv07xjSOfgHJQ%3D)


配置 .vscode/settings.json

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/799a1081cca941bd9936abec8e601208~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1752817976&x-orig-sign=dF%2BSuQIKSsZSQwLdO4JIpS6obZs%3D)

这样在编辑的时候就可以实时看到eslint对应的效果

## 按部就班版
### 1.安装eslint

```sh
npm i eslint@9.23.0 --save-dev
```


### 手工创建eslint.config.js
```js
eslint.config.js
```

### 安装依赖库
@eslint/js 官方提供的规则

```sh
npm i @eslint/js@9.23.0 --save-dev
```

eslint.config.js
```js
import eslint from '@eslint/js'

export default [
  {
    ignores: [
      'public',
      'dist',
      'node_modules',
      "package.json",
      "README.md",
      "src/assets",
    ],
  },
  eslint.configs.recommended,
]

```

### 添加js规则
加入自己定制逻辑rules
```js
import eslint from '@eslint/js'
export default [
  {
    ignores: [
      'public',
      'dist',
      'node_modules',
      "package.json",
      "README.md",
      "src/assets",
    ],
  },

  eslint.configs.recommended,
   {
    rules: {
      'no-console': 'off', // : 'warn', // 生产环境中警告 console 使用，开发环境中关闭规则
      'no-debugger': 'off', // import.meta.env.NODE_ENV === 'production' ? 'warn' : 'warn', // 生产环境中警告 debugger 使用，开发环境中关闭规则
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'off', // 关闭未使用变量警告
      '@typescript-eslint/no-unused-vars': 'off', // 关闭未使用变量警告
      'linebreak-style': ['warn', 'windows'], // 使用 Unix 风格的换行符
      'quotes': ['warn', 'single'], // 使用单引号
      'semi': ['warn', 'never'] // 语句末尾不加分号
    }
  }
]

 
```

### 添加全局设置
```sh
npm i globals@16.0.0 -D
```
使用浏览器的console 会提示错误
```js
import eslint from '@eslint/js'
export default [
  {
    ignores: [
      'public',
      'dist',
      'node_modules',
      "package.json",
      "README.md",
      "src/assets",
    ],
  },

  eslint.configs.recommended,
   {
    rules: {
      'no-console': 'off', // : 'warn', // 生产环境中警告 console 使用，开发环境中关闭规则
      'no-debugger': 'off', // import.meta.env.NODE_ENV === 'production' ? 'warn' : 'warn', // 生产环境中警告 debugger 使用，开发环境中关闭规则
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'off', // 关闭未使用变量警告
      '@typescript-eslint/no-unused-vars': 'off', // 关闭未使用变量警告
      'linebreak-style': ['warn', 'windows'], // 使用 Unix 风格的换行符
      'quotes': ['warn', 'single'], // 使用单引号
      'semi': ['warn', 'never'] // 语句末尾不加分号
    }
  },
    {
    languageOptions: {
      globals: {
        ...globals.browser, 
      },
    },
  }
]
 
```
### 添加 ts 与 vue支持


```sh
npm i eslint-plugin-vue@10.0.0 typescript-eslint@8.37.0 -D
``` 

```js
import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginVue from "eslint-plugin-vue";

export default [
  {
    ignores: [
      "public",
      "dist",
      "node_modules",
      "package.json",
      "README.md",
      "src/assets",
    ],
  },

  eslint.configs.recommended,
  ...eslintPluginVue.configs["flat/recommended"],
  {
    rules: {
      "no-console": "off", // : 'warn', // 生产环境中警告 console 使用，开发环境中关闭规则
      "no-debugger": "off", // import.meta.env.NODE_ENV === 'production' ? 'warn' : 'warn', // 生产环境中警告 debugger 使用，开发环境中关闭规则
      "@typescript-eslint/no-explicit-any": "off",
      "vue/multi-word-component-names": "off",
      "no-unused-vars": "off", // 关闭未使用变量警告
      "@typescript-eslint/no-unused-vars": "off", // 关闭未使用变量警告
      "linebreak-style": ["warn", "windows"], // 使用 Unix 风格的换行符
      quotes: ["warn", "single"], // 使用单引号
      semi: ["warn", "never"], // 语句末尾不加分号
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  /**
   * vue 规则
   */
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        /** typescript项目需要用到这个 */
        parser: tseslint.parser,
        ecmaVersion: "latest",
        /** 允许在.vue 文件中使用 JSX */
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // 在这里追加 vue 规则
      "vue/no-mutating-props": [
        "error",
        {
          shallowOnly: true,
        },
      ],
    },
  },
];

```

### 调整 ts 规则

加入 `tseslint.config（）` 和  `...tseslint.configs.recommended, ` 

```js

import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginVue from "eslint-plugin-vue";

export default tseslint.config (
  {
    ignores: [
      "public",
      "dist",
      "node_modules",
      "package.json",
      "README.md",
      "src/assets",
    ],
  },

  eslint.configs.recommended, 
  ...tseslint.configs.recommended, // 添加ts配置
  ...eslintPluginVue.configs["flat/recommended"],
  {
    rules: {
      "no-console": "off", // : 'warn', // 生产环境中警告 console 使用，开发环境中关闭规则
      "no-debugger": "off", // import.meta.env.NODE_ENV === 'production' ? 'warn' : 'warn', // 生产环境中警告 debugger 使用，开发环境中关闭规则
      "@typescript-eslint/no-explicit-any": "off",
      "vue/multi-word-component-names": "off",
      "no-unused-vars": "off", // 关闭未使用变量警告
      "@typescript-eslint/no-unused-vars": "off", // 关闭未使用变量警告
      "linebreak-style": ["warn", "windows"], // 使用 Unix 风格的换行符
      quotes: ["warn", "single"], // 使用单引号
      semi: ["warn", "never"], // 语句末尾不加分号
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  /**
   * vue 规则
   */
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        /** typescript项目需要用到这个 */
        parser: tseslint.parser,
        ecmaVersion: "latest",
        /** 允许在.vue 文件中使用 JSX */
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // 在这里追加 vue 规则
      "vue/no-mutating-props": [
        "error",
        {
          shallowOnly: true,
        },
      ],
    },
  },
)
```

### 加入样式处理 
```sh
npm i @stylistic/eslint-plugin@4.2.0 -D
``` 

```js

import stylistic from '@stylistic/eslint-plugin'  
import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginVue from "eslint-plugin-vue";

export default tseslint.config (
  {
    ignores: [
      "public",
      "dist",
      "node_modules",
      "package.json",
      "README.md",
      "src/assets",
    ],
  },

  eslint.configs.recommended, 
  ...tseslint.configs.recommended, // 添加ts配置
  ...eslintPluginVue.configs["flat/recommended"],

  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: true,
    braceStyle: '1tbs',
    arrowParens: 'always',
  }), 
  {
    rules: {
      "no-console": "off", // : 'warn', // 生产环境中警告 console 使用，开发环境中关闭规则
      "no-debugger": "off", // import.meta.env.NODE_ENV === 'production' ? 'warn' : 'warn', // 生产环境中警告 debugger 使用，开发环境中关闭规则
      "@typescript-eslint/no-explicit-any": "off",
      "vue/multi-word-component-names": "off",
      "no-unused-vars": "off", // 关闭未使用变量警告
      "@typescript-eslint/no-unused-vars": "off", // 关闭未使用变量警告
      "linebreak-style": ["warn", "windows"], // 使用 Unix 风格的换行符
      quotes: ["warn", "single"], // 使用单引号
      semi: ["warn", "never"], // 语句末尾不加分号
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  /**
   * vue 规则
   */
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        /** typescript项目需要用到这个 */
        parser: tseslint.parser,
        ecmaVersion: "latest",
        /** 允许在.vue 文件中使用 JSX */
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // 在这里追加 vue 规则
      "vue/no-mutating-props": [
        "error",
        {
          shallowOnly: true,
        },
      ],
    },
  },
)

```


### eslint 兼容 Prettier
由于存在eslint 和 Prettier 两个格式化规则，为了避免冲突 
在eslint.config.js 要配置上 prettier的格式化信息


```sh
npm i eslint-plugin-prettier@5.2.5 -D
```  
```js

...
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config (
  {
    ignores: [
      "public",
      "dist",
      "node_modules",
      "package.json",
      "README.md",
      "src/assets",
    ],
  },

  eslint.configs.recommended, 
  ...tseslint.configs.recommended, // 添加ts配置
  ...eslintPluginVue.configs["flat/recommended"],
 
 ...
  eslintPluginPrettierRecommended // 最后加上 prettier的规则
)
```


> 注意 有时候配置完也不生效，就需要整个vscode退出再打开才生效

# husky


# 参考代码 
