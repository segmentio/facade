import { Company } from './'
import Spec from '@segment/spec/types/common'
import assert from 'assert'

describe('Types/Common', () => {
  describe('#Company', () => {
    it('should return all the right properties', () => {
      const properties: Spec.Company = {
        employees: 10,
        industry: 'healthcare',
        name: 'Athena',
        plan: 'PPO',
        totalBilled: 500
      }

      const facade = new Company(properties)
      assert.strictEqual(facade.employees, properties.employees)
      assert.strictEqual(facade.industry, properties.industry)
      assert.strictEqual(facade.name, properties.name)
      assert.strictEqual(facade.plan, properties.plan)
      assert.strictEqual(facade.totalBilled, properties.totalBilled)
    })

    it('should handle totalBilled with different casing', () => {
      const keys = ['totalBilled', 'total_billed', 'total billed'].forEach(key => {
        const facade = new Company({ [`${key}`]: 100 })
        assert.strictEqual(facade.totalBilled, 100)
      })
    })
  })
})
