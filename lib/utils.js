
/**
 * TODO: use component symlink, everywhere ?
 */

try {
  exports.inherit = require('inherit');
  exports.clone = require('clone');
} catch (e) {
  exports.inherit = require('inherit-component');
  exports.clone = require('clone-component');
}
