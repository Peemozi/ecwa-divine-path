// Explicitly disable the React Compiler so Metro does not inject
// react/compiler-runtime (which was missing and caused runtime crashes
// like "Cannot read property 'log' of undefined" before the JS runtime
// fully initialized).
process.env.EXPO_USE_REACT_COMPILER = "0";

const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Tell Metro the correct absolute path to src/
config.watchFolders = [
  path.resolve(__dirname, "src"),
  path.resolve(__dirname, "assets"),
];

// Allow importing from src/ folder
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
];

// Ensure asset resolution works correctly
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'js', 'ts', 'tsx'];

// Add source extensions for ramda
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'js', 'ts', 'tsx'];

// Ensure asset extensions are properly configured
// Note: assetExts is already included in default Expo config, but we ensure it's set
if (!config.resolver.assetExts) {
  config.resolver.assetExts = [];
}

// Ensure common asset types are included
const assetExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf', 'otf', 'woff', 'woff2'];
assetExtensions.forEach(ext => {
  if (!config.resolver.assetExts.includes(ext)) {
    config.resolver.assetExts.push(ext);
  }
});

module.exports = config;
