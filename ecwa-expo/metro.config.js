const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Tell Metro the correct absolute path to src/
config.watchFolders = [path.resolve(__dirname, "src")];

// Allow importing from src/ folder
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
];

module.exports = config;
