import '@testing-library/jest-dom';
// JestでTextEncoder未定義対策
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

// ...既存のコード...
