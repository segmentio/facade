"use strict";

import get from "dlv";

function trait(a: string, b?: string) {
  return function () {
    // @ts-ignore
    const traits = this.traits();
    // @ts-ignore
    const props = this.properties ? this.properties() : {};

    return (
      get(traits, "address." + a) ||
      get(traits, a) ||
      (b ? get(traits, "address." + b) : null) ||
      (b ? get(traits, b) : null) ||
      get(props, "address." + a) ||
      get(props, a) ||
      (b ? get(props, "address." + b) : null) ||
      (b ? get(props, b) : null)
    );
  };
}

/**
 * Add address getters to `proto`.
 *
 * @ignore
 * @param {Function} proto
 */
export default function (proto: any) {
  proto.zip = trait("postalCode", "zip");
  proto.country = trait("country");
  proto.street = trait("street");
  proto.state = trait("state");
  proto.city = trait("city");
  proto.region = trait("region");
}
