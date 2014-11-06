
2.0.5 / 2014-11-06
==================

  * options: support legacy options

2.0.4 / 2014-11-03
==================

  * add .region() to address lib

2.0.3 / 2014-10-27
==================

  * context.device,timezone: adding tests + implementation

2.0.2 / 2014-10-09
==================

 * fix page.track() and screen.track()

2.0.1 / 2014-09-26
==================

  * Pass options to each type of facade

2.0.0 / 2014-09-26
==================

 * Add clone option

1.4.7 / 2014-09-18
==================

 * travis: add token
 * make: catch test changes
 * add referrer

1.4.6 / 2014-09-04
==================

  * Merge pull request #63 from segmentio/add/discount
  * adding discount proxy and computation to subtotal

1.4.5 / 2014-09-02
==================

 * updating obj-case dep

1.4.4 / 2014-08-29
==================

 * track: dont override address()

1.4.3 / 2014-08-21
==================

 * address: move to facade base prototype

1.4.2 / 2014-08-19
==================

 * identify: add .avatarUrl fallback to .avatar()
 * page: add .title(), .path(), .url()
 * group: add .name()
 * group: add .email() that behaves like identify.email()
 * group: add .employees() and .industry()

1.4.1 / 2014-08-19
==================

 * address: add address traits to group and identify

1.4.0 / 2014-08-13
==================

 * screen: fix .context()
 * page: fix .context()
 * page: fix .timestamp()
 * screen: fix .timestamp()
 * add .phones()
 * .phone(): fallback to .phones[0]
 * add .websites()
 * add Facade.one()
 * add Facade.multi()
 * add .position()
 * add .avatar() fallback to .photoUrl
 * add .gender(), .birthday() and .age()
 * make: bench on make test
 * make: add bench target
 * make: test target should test all (travis gotchas etc..)
 * track#subtotal: fix lookup and add tests
 * deps: add type()
 * track#products: make sure it always returns an array
 * deps: upgrade duo

1.3.0 / 2014-08-07
==================

 * tests: add more alias tests
 * Marketo is no longer disabled by default

1.2.2 / 2014-07-23
==================

 * adding benchmarks, moving traverse
 * updating 1-1 mapping for aliased .traits()

1.2.1 / 2014-07-16
==================

 * .timestamp(): add .getTime() test
 * test-sauce: add tests name
 * test-sauce: test only on firefox
 * use new-date, to fix incorrect date in firefox
 * use duo-test

1.2.0 / 2014-06-23
==================

 * component bump
 * Merge pull request #44 from segmentio/move/global-traits
 * remvoing debugger hahah
 * mirroring  aliasing and id between track.traits and facade.traits
 * moving track.traits to be global
 * updating docs

1.1.0 / 2014-06-17
==================

 * component bump
 * Merge pull request #42 from segmentio/groupId
 * adding grouoId to context.groupId to support account level settings
 * Update Readme.md

1.0.1 / 2014-06-12
==================

 * updating obj-case dep

1.0.0 / 2014-06-12
==================

 * duo: adding duo

0.3.10 / 2014-05-16
==================

 * bump again

0.3.8 / 2014-05-16
==================

 * bump component.json version

0.3.7 / 2014-05-16
==================

 * add better revenue intuition for ecommerce

0.3.6 / 2014-05-16
==================

 * add fallback from revenue to total

0.3.5 / 2014-05-08
==================

 * adding enabled fix for new spec

0.3.4 / 2014-05-06
==================

 * add .context() for new spec
 * adding .library() method

0.3.3 / 2014-04-21
==================

 * adding .type()

0.3.2 / 2014-04-05
==================

 * fix: track.email()

0.3.1 / 2014-03-19
==================

 * adds date parsing to nested fields

0.3.0 / 2014-03-10
==================

 * add screen
 * support new spec

0.2.12 / 2014-03-07
==================

 * re-add useragent

0.2.11 / 2014-03-06
==================

 * support "id" as "orderId"

0.2.10 / 2014-03-06
==================

 * add .userId() and .sessionId() to all actions

0.2.9 / 2014-02-17
==================

* bumping version

0.2.8 / 2014-02-11
==================

 * updating obj-case

0.2.7 / 2014-02-07
==================

 * add country
 * add more ecommerce properties

0.2.6 / 2014-02-02
==================

 * add defaults to .currency() and .quantity()
 * add transactionId

0.2.5 / 2014-02-02
==================

 * add ecommerce

0.2.4 / 2014-01-30
==================

 * upgrade isodate to 0.3.0

0.2.3 / 2014-01-14
==================

 * use obj-case in options()
 * add fix for non-string name fields

0.2.2 / 2014-01-07
==================

 * update dependencies
 * add .travis.yml

0.2.0 / 2013-12-18
==================

  * fix obj-case dep


0.1.4 / 2013-12-14
==================

 * add identify#description

0.1.3 / 2013-12-02
==================

  * identify: adding fixes for `lastName` with multiple spaces
  * track: adding simple identify tests

0.1.2 / 2013-09-26
==================

  * adding casting for string timestamps

0.1.1 / 2013-09-06
==================

  * adding fix for `options.providers.all`

0.1.0 / 2013-08-29
==================

  * Initial release
