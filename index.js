var through = require('through')

module.exports = function(limit) {
  limit = limit || 1024 * 1024 * 1 // 1mb, levelup default writeBufferSize
  var currentBatch, batchPending, size
  
  function reset() {
    currentBatch = []
    batchPending = false
    size = 0
  }

  reset()
  
  var margaretBatcher = through(batch, finish)
  
  // call this from consumer stream to get next batch
  margaretBatcher.next = function() {
    process.nextTick(function() {
      margaretBatcher.resume()
    })
  }
  
  return margaretBatcher
  
  function batch(obj) {
    var len = getByteLength(obj)

    // keep batches under limit
    if ((size + len) >= limit) {
      // if single obj is bigger than limit
      if (size === 0) currentBatch.push(obj)
      write()
    } else {
      currentBatch.push(obj)
      size += len
    }
  }
  
  function finish() {
    if (currentBatch) write()
    margaretBatcher.queue(null)
  }
  
  function write(cb) {
    margaretBatcher.queue(currentBatch)
    margaretBatcher.pause()
    reset()
  }
  
  function getByteLength(obj) {
    var len = obj.length
    if (!len) len = JSON.stringify(obj) // simplest way to get object size?
    return len
  }
}
