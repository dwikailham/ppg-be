module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed commit types
    'type-enum': [
      2,
      'always',
      [
        'feat', // ✨ New feature
        'fix', // 🐛 Bug fix
        'docs', // 📚 Documentation only changes
        'style', // 💄 Changes that do not affect meaning of code
        'refactor', // ♻️ Code change that neither fixes a bug nor adds a feature
        'perf', // ⚡ Performance improvement
        'test', // ✅ Adding missing tests
        'chore', // 🔧 Maintenance
      ],
    ],
    // Scope cannot be empty
    'scope-empty': [2, 'never'],
    // Max length for subject line
    'subject-max-length': [2, 'always', 72],
    // No empty subject
    'subject-empty': [2, 'never'],
    // Lowercase subject
    'subject-case': [2, 'always', ['lower-case', 'sentence-case']],
  },
};
