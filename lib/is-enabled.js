
/**
 * A few integrations are disabled by default. They must be explicitly
 * enabled by setting options[Provider] = true.
 */

var disabled = {
  'Salesforce' : true,
  'Marketo'    : true,

  // TODO: remove these guys
  'Webhooks'   : true,
  'Librato'    : true,
  'Outbound'   : true
};


/**
 * Return whether the integration is enabled by default
 */

module.exports = function (integration) {
  return !disabled[integration];
};
