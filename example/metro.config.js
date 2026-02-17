const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const projectRoot = __dirname;
const libraryRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Force Metro to look into the library's node_modules and the example's node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(libraryRoot, 'node_modules'),
];

// Watch the library source code
config.watchFolders = [libraryRoot];

module.exports = withMetroConfig(config, {
  root: libraryRoot,
  dirname: projectRoot,
});
