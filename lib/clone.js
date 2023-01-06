export function clone(properties) {
  if (Object.prototype.toString.call(properties) === '[object Object]') {
    const temp = {};
    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        temp[key] = clone(properties[key]);
      }
    }
    return temp;
  } else if (Array.isArray(properties)) {
    return properties.map(clone);
  } else {
    // this is dangerous because it means this is not cloned
    return properties;
  }
}
