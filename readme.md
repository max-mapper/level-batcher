# level-batcher

through/pull stream that you write objects to, and it emits batches of objects that are under a byte size limit

[![NPM](https://nodei.co/npm/level-batcher.png)](https://nodei.co/npm/level-batcher/)

## usage

```
var batcher = require('level-batcher')
```

returns a stream. for usage see test.js

#### batcher.next()

call this to get the next batch. this is due to the semantics of inserting data into leveldb so that backpressure is respected. TODO use pause/resume for this

### license

BSD
