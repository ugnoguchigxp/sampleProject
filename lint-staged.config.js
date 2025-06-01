module.exports = {
  "frontend/**/*.{ts,tsx,js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "backend/**/*.{ts,js}": [
    "eslint --fix",
    "prettier --write"
  ]
};