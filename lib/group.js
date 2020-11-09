"use strict";

import inherit from "inherits";
import isEmail from "./is-email";
import newDate from "new-date";
import { Facade } from "./facade";

/**
 * Initialize a new `Group` facade with a `dictionary` of arguments.
 *
 * @param {Object} dictionary - The object to wrap.
 * @param {string} [dictionary.userId] - The user to add to the group.
 * @param {string} [dictionary.groupId] - The ID of the group.
 * @param {Object} [dictionary.traits] - The traits of the group.
 * @param {Object} opts - Options about what kind of Facade to create.
 *
 * @augments Facade
 */
export function Group(dictionary, opts) {
  Facade.call(this, dictionary, opts);
}

inherit(Group, Facade);

const g = Group.prototype;

/**
 * Return the type of facade this is. This will always return `"group"`.
 *
 * @return {string}
 */
g.action = function () {
  return "group";
};

/**
 * An alias for {@link Group#action}.
 *
 * @function
 * @return {string}
 */
g.type = g.action;

/**
 * Get the group ID from `groupId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
g.groupId = Facade.field("groupId");

/**
 * Get the time of creation of the group from `traits.createdAt`,
 * `traits.created`, `properties.createdAt`, or `properties.created`.
 *
 * @return {Date}
 */
g.created = function () {
  var created =
    this.proxy("traits.createdAt") ||
    this.proxy("traits.created") ||
    this.proxy("properties.createdAt") ||
    this.proxy("properties.created");

  if (created) return newDate(created);
};

/**
 * Get the group's email from `traits.email`, falling back to `groupId` only if
 * it looks like a valid email.
 *
 * @return {string}
 */
g.email = function () {
  var email = this.proxy("traits.email");
  if (email) return email;
  var groupId = this.groupId();
  if (isEmail(groupId)) return groupId;
};

/**
 * Get the group's traits. This is identical to how {@link Facade#traits}
 * works, except it looks at `traits.*` instead of `options.traits.*`.
 *
 * Traits are gotten from `traits`, augmented with a property `id` with
 * the event's `groupId`.
 *
 * The parameter `aliases` is meant to transform keys in `traits` into new
 * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
 * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
 * be called as a function instead of treated as a key into the traits.
 *
 * @example
 * var obj = { traits: { foo: "bar" }, anonymousId: "xxx" }
 * var group = new Group(obj)
 *
 * group.traits() // { "foo": "bar" }
 * group.traits({ "foo": "asdf" }) // { "asdf": "bar" }
 * group.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
 *
 * @param {Object} aliases - A mapping from keys to the new keys they should be
 * transformed to.
 * @return {Object}
 */
g.traits = function (aliases) {
  var ret = this.properties();
  var id = this.groupId();
  aliases = aliases || {};

  if (id) ret.id = id;

  for (var alias in aliases) {
    var value =
      this[alias] == null ? this.proxy("traits." + alias) : this[alias]();
    if (value == null) continue;
    ret[aliases[alias]] = value;
    delete ret[alias];
  }

  return ret;
};

/**
 * Get the group's name from `traits.name`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
g.name = Facade.proxy("traits.name");

/**
 * Get the group's industry from `traits.industry`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
g.industry = Facade.proxy("traits.industry");

/**
 * Get the group's employee count from `traits.employees`.
 *
 * This *should* be a number, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {number}
 */
g.employees = Facade.proxy("traits.employees");

/**
 * Get the group's properties from `traits` or `properties`, falling back to
 * simply an empty object.
 *
 * @return {Object}
 */
g.properties = function () {
  // TODO remove this function
  return this.field("traits") || this.field("properties") || {};
};
