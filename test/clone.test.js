"use strict";

import { clone } from "../lib/clone";
import { strictEqual, deepStrictEqual, notDeepStrictEqual } from "assert";

describe("clone", function () {
    it("should not change non-object types", function () {
      strictEqual(clone("hi"), "hi");
      strictEqual(clone(5), 5);
      strictEqual(clone(null), null);
      strictEqual(clone(undefined), undefined);
    });

    describe("using a plain object", function () {
      const input = { hello: 'world' }
      const expected = JSON.parse(JSON.stringify(input))
      const actual = clone(expected)

      it("should clone correctly", function () {
        deepStrictEqual(actual, expected);
        deepStrictEqual(actual, input);
      })
        
      it('should not mutate the cloned value', function () {
        input.added = true
        notDeepStrictEqual(actual, input)
        // reset it
        delete input.added
      });
      
      it('should not be vulnerable to prototype pollution', function () {
        Object.prototype.SECRET = 'ohno'
        deepStrictEqual(clone(input), expected)
        // reset it
        delete Object.prototype.SECRET
      });
    })
    
    describe("using an array of object types", function () {
      const input = [{ hello: 'world' }]
      const expected = JSON.parse(JSON.stringify(input))
      const actual = clone(expected)

      it("should clone correctly", function () {
        deepStrictEqual(actual, expected);
        deepStrictEqual(actual, input);
      })
        
      it('should not mutate the cloned value', function () {
        input[0].added = true
        notDeepStrictEqual(actual, input)
        // reset it
        delete input[0].added
      });
    })
    
    describe("using an array of non-object types", function () {
      const input = ["val", 12]
      const expected = JSON.parse(JSON.stringify(input))
      const actual = clone(expected)

      it("should clone correctly", function () {
        deepStrictEqual(actual, expected);
        deepStrictEqual(actual, input);
      })
        
      it('should not mutate the cloned value', function () {
        input.push('added')
        
        notDeepStrictEqual(actual, input)
        // clean up
        input.unshift() 
      });
    })
    
    describe("using an deeply nested objects", function () {
      const input = [
        { properties: { val: true, arr: [1,2,3] }, name: "example" },
        { properties: { val: false, arr: [4,5,6] }, name: "example2" }
      ]
      const expected = JSON.parse(JSON.stringify(input))
      const actual = clone(expected)

      it("should clone correctly", function () {
        deepStrictEqual(actual, expected);
        deepStrictEqual(actual, input);
      })
        
      it('should not mutate the cloned value', function () {
        input.push({ added: true })
        input[0].properties.arr.push(-10)
        input[0].properties.added = true
        
        notDeepStrictEqual(actual, input)
        // clean up
        input.unshift()
        input[0].properties.arr.unshift()
        delete input[0].properties.added
      });
    })
});
