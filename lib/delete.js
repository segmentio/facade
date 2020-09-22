"use strict";

import inherit from "inherits";
import { Facade } from "./facade";

/**
 * Initialize a new `Delete` facade with a `dictionary` of arguments.
 *
 * @param {Object} dictionary - The object to wrap.
 * @param {string} [dictionary.category] - The delete category.
 * @param {string} [dictionary.name] - The delete name.
 * @param {string} [dictionary.properties] - The delete properties.
 * @param {Object} opts - Options about what kind of Facade to create.
 *
 * @augments Facade
 */
export function Delete(dictionary, opts) {
  Facade.call(this, dictionary, opts);
}

inherit(Delete, Facade);

/**
 * Return the type of facade this is. This will always return `"delete"`.
 *
 * @return {string}
 */
Delete.prototype.type = function () {
  return "delete";
};
