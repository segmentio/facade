import { Facade } from '.';
import assert from 'assert'

describe('#Facade', () => {
  describe('.toJSON', () => {
    it('should return the object passed in via the constructor with all properties set to readonly', () => {
      const input = { foo: 'bar' }
      const facade = new Facade(input)
      assert.strictEqual(input, facade.toJSON())
      assert.strictEqual(Object.isFrozen(facade.toJSON()), true)
    })

    it('should return an empty object if the input value was not an object', () => {
      [undefined, 'string', 9, ['foobar'], true].forEach(input => {
        // @ts-ignore
        const facade = new Facade(input)
        assert.deepStrictEqual({}, facade.toJSON())
      })
    })
  })
})
