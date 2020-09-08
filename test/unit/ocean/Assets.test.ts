import { assert, spy, use } from 'chai'
import spies from 'chai-spies'

import { SearchQuery, MetadataStore } from '../../../src/metadatastore/MetadataStore'
import { Ocean } from '../../../src/ocean/Ocean'
import config from '../config'
import { DDO } from '../../../src/lib'
import { responsify, getSearchResults } from '../helpers'

use(spies)

describe('Assets', () => {
  let ocean: Ocean
  let metadataStore: MetadataStore

  beforeEach(async () => {
    ocean = await Ocean.getInstance(config)
    metadataStore = ocean.metadatastore // eslint-disable-line prefer-destructuring
  })

  afterEach(() => {
    spy.restore()
  })

  describe('#query()', () => {
    it('should search for assets', async () => {
      const query: SearchQuery = {
        offset: 100,
        page: 1,
        query: {
          text: 'Office'
        },
        sort: {
          created: -1
        }
      } as SearchQuery

      spy.on(metadataStore.fetch, 'post', () => responsify(getSearchResults([new DDO()])))
      const assets = await ocean.assets.query(query)

      assert.typeOf(assets.results, 'array')
      assert.lengthOf(assets.results, 1)
      assert.isDefined(assets.results[0].findServiceById)
    })
  })

  describe('#search()', () => {
    it('should search for assets', async () => {
      const text = 'office'
      spy.on(metadataStore.fetch, 'post', () => responsify(getSearchResults([new DDO()])))
      const assets = await ocean.assets.search(text)

      assert.typeOf(assets.results, 'array')
      assert.lengthOf(assets.results, 1)
      assert.isDefined(assets.results[0].findServiceById)
    })
  })
})