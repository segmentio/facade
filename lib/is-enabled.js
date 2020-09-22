"use strict";

// A few integrations are disabled by default. They must be explicitly enabled
// by setting options[Provider] = true.
const disabled = {
  Salesforce: true,
};

/**
 * Check whether an integration should be enabled by default.
 *
 * @ignore
 * @param {string} integration
 * @return {boolean}
 */
export default function (integration) {
  return !disabled[integration];
}
