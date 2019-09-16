module.exports = {
  root: true,
  "extends": 'airbnb',
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "rules":{
    "react/jsx-filename-extension":0,
    "no-use-before-define":0,
  },
  "eslint.validate": [ "javascript", "javascriptreact", "html", "typescriptreact" ],
};
