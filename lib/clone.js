export function clone(properties) {
    if (Object.prototype.toString.call(properties) === '[object Object]') {
      let temp = {};
      if (
        properties.constructor !== Object &&
        typeof properties.constructor === 'function'
      ) {
        temp = { ...properties };
      }
      for (const key in properties) {
        temp[key] = clone(properties[key]);
      }
      return temp;
    } else if (Array.isArray(properties)) {
      return properties.map(clone);
    } else {
      return properties;
    }
  }