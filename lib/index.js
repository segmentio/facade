"use strict";

import { Facade } from "./facade";
import { Alias } from "./alias";
import { Group } from "./group";
import { Identify } from "./identify";
import { Track } from "./track";
import { Page } from "./page";
import { Screen } from "./screen";
import { Delete } from "./delete";

export default {
  ...Facade,
  Alias,
  Group,
  Identify,
  Track,
  Page,
  Screen,
  Delete,
};

export { Facade, Alias, Group, Identify, Track, Page, Screen, Delete };
