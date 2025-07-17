import stylistic from '@stylistic/eslint-plugin'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintPluginVue from 'eslint-plugin-vue'

export default tseslint.config(
  {
    ignores: ['public', 'dist', 'node_modules', 'package.json', 'README.md', 'src/assets']
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended, // 添加ts配置
  ...eslintPluginVue.configs['flat/recommended'],

  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: true,
    braceStyle: '1tbs',
    arrowParens: 'always'
  }),
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
        ...globals.browser
      }
    }
  },

  /**
   * vue 规则
   */
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        /** typescript项目需要用到这个 */
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        /** 允许在.vue 文件中使用 JSX */
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      // 在这里追加 vue 规则
      'vue/no-mutating-props': [
        'error',
        {
          shallowOnly: true
        }
      ]
    }
  },
  eslintPluginPrettierRecommended
)
