"use strict";

import Facade, {
  Alias,
  Group,
  Identify,
  Track,
  Page,
  Screen,
  Delete,
} from "./facade";

Alias = require("./alias").default;
Group = require("./group").default;
Identify = require("./identify").default;
Track = require("./track").default;
Page = require("./page").default;
Screen = require("./screen").default;
Delete = require("./delete");

export default Facade;
