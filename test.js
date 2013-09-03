var through = require('through')
var crypto = require('crypto')

var batcher = require('./')()
var writer = through(onbatch)

// duplex pull stream
batcher.pipe(writer).pipe(batcher)

function onbatch(batch) {
  console.log('batch', batch.length)
  this.queue(true)
}

for (var i = 0; i < 3000; ++i) batcher.write(crypto.randomBytes(900))
batcher.end()