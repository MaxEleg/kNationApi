module.exports = {
  parserOptions: {
    ecmaVersion: 2017
  },
  extends: 'loopback',
  rules: {
    // Enforce consistent linebreak style
    'linebreak-style': 'off',
    // Limit Maximum Length of Line to 140 characters, including comments
    'max-len': [
      'error',
      140,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false
      }
    ],
    'no-underscore-dangle':'off', /* problem with mongo ids `_id` */
    'comma-dangle':'off' /*disallow trailing commas*/,
    'no-console': 'off' /* Allow Use of `console` */
  }
};
