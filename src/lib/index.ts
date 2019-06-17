import { isPlainObject } from 'lodash'

export class Facade<T extends object = {}> {
	private _properties: Readonly<T>

	constructor(properties: T) {
		// Since these objects are often passed in as unvalidated JSON we can't be sure that an object is always passed in.
		// Here we check if it is not an object and if not, just return an empty object.
		if (!isPlainObject(properties)) {
			this._properties = Object.freeze({} as T)
		} else {
			this._properties = Object.freeze(properties)
		}
	}

	public toJSON(): Readonly<T & { [key: string]: unknown }> {
		return this._properties as Readonly<T & { [key: string]: unknown }>
	}
}
