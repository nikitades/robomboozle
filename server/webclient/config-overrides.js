const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const path = require("path");

module.exports = function override(config) {
    config.resolve.plugins.forEach(plugin => {
        if (plugin instanceof ModuleScopePlugin) {
            plugin.allowedFiles.add(path.resolve("../../common/commands"));
            plugin.allowedFiles.add(path.resolve("../../common/params"));
        }
    });

    return config;
};