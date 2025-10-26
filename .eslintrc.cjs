module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals', 'prettier'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'import/no-anonymous-default-export': 'off'
  }
};
