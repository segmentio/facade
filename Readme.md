# facade

Providing common fields for analytics integrations. Wraps the Segment.io api for use on the server or client.

## Build Status

1.x                                          | 2.x (Modern)
---                                          | ---
[![2.x Build Status][ci-2.x-badge]][ci-link] | [![1.x Build Status][ci-1.x-badge]][ci-link]

## Facade

### .proxy(field)

Proxies a field which is stored in the object.

```javascript
track.proxy('traits') // { email : 'calvin@segment.io }
track.proxy('traits.email') // 'calvin@segment.io'
```

As an added bonus, it will even pull out top level proxies that are attached to the facade

```javascript
var track = new Track({ context : { setting : 'x' }});
track.proxy('options.setting'); // 'x'

var identify = new Identify({ traits : { address : { state : 'CA' }}});
// using the top level proxy
track.proxy('address.state'); // 'CA';
// through the traits
track.proxy('traits.address.state');
```

Since developers might be working in many languages, with different conventions for things like snake_case vs camelCase, .proxy will take care of that for you!

```javascript
facade = new Facade({ SOME : { reallyGreat : { other_field : 'x' }}});
facade.proxy('some.reallyGreat.otherField'); // 'x'
```

### .field(field)

Returns just the top level field of an object. You should generally be able to use .proxy() instead.

```javascript
track.field('event')  // 'Loaded a page'
track.field('userId') // 'calvin@segment.io'
```

### .json()

Returns the full json of whatever was passed into the facade

```javascript
(new Facade({ x : 'y'; })).json() // { x : 'y' }
```

### .options([integration])

Returns the options passed in to the facade. If you pass in an integration name, it will return the options only for that integration. If the integration isn't enabled, you won't get anything back for it

```javascript
facade = new Facade({ options : { 'Segment.io' : { good : true }}});
facade.options(); // { 'Segment.io' : { good : true }}
facade.options('Segment.io') // { good : true }
facade.options('Customer.io') // {}

// Salesforce is disabled by default
facade.options('Salesforce') // undefined;
```

### .enabled(integration)

Returns whether the integration name is enabled:

```javascript
facade = new Facade();
facade.enabled('Salesforce'); // false (off by default)
facade.enabled('Customer.io'); // true
```

### .channel()

Returns the channel for where the call came from, `client` or `server`

If your integration uses browser javascript, you'll want to check all incoming facade messages to see whether to use them.

```javascript
facade.channel(); // 'server'
```

### .timestamp()

Returns the timestamp when the call was made

```javascript
facade.timestamp(); // Thu Aug 29 2013 17:53:03 GMT-0700 (PDT)
```

### .userAgent()

Returns the user agent for the call if passed into the `options.userAgent` field.

The user agent will be parsed by [component/user-agent-parser](https://github.com/component/user-agent-parser) and will store the full user agent under `facade.userAgent().full`;

```javascript
facade.userAgent();
/*
{
browser : 'chrome',
os : 'Mac OS X',
full: 'Mozilla/5.0 (Macintosh; Intel Mac O...
}
*/
```

### .active()

Decides whether a call should be used to update the user who the call is for. Defaults to `true`, taken from `options.active`.

Any active call will update the user's last seen fields.

### .groupId()

Proxies the group id via `context.groupId`.

## Track

### .event()

return the tracked event

### .userId()

return the user's id for the track call

### .sessionId()

return the session id for the track call

### .properties()

return the event properties

### .referrer()

return the referrer as taken from the properties

### .username()

return the username from traits or the userid

### .email()

return the email from the traits

### .identify()

convert the track call into an identify call to feed its traits into services which use super properties

```javascript
var identify = track.identify();
identify.firstName(); // 'Bill',  pulled from options.traits
```

## Identify

### .userId()

return the user's id

### .sessionId()

return the session id

### .traits()

return the passed in traits

### .email()

return the email from traits and user id

### .username()

return the username from the traits and user id

## Alias

#### .previousId()

returns the previous user id to alias from

#### .userId()

returns the current user id to alias to

## License

(The MIT License)

Copyright (c) 2013 Segment.io &lt;friends@segment.io&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[ci-link]: https://travis-ci.org/segmentio/facade
[ci-1.x-badge]: https://travis-ci.org/segmentio/facade.png?branch=1.x
[ci-2.x-badge]: https://travis-ci.org/segmentio/facade.png?branch=master
