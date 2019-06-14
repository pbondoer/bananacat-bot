module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: "eslint:recommended",
  rules: {
    "no-console": "off"
  }
};
