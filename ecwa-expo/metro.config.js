// Explicitly disable the React Compiler so Metro does not inject
// react/compiler-runtime (which was missing and caused runtime crashes
// like "Cannot read property 'log' of undefined" before the JS runtime
// fully initialized).
process.env.EXPO_USE_REACT_COMPILER = "0";

const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Tell Metro the correct absolute path to src/
config.watchFolders = [path.resolve(__dirname, "src")];

// Allow importing from src/ folder
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
];

// Add source extensions for ramda
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'js', 'ts', 'tsx'];

module.exports = config;
