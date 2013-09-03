var through = require('through')

module.exports = function(limit) {
  limit = limit || 1024 * 1024 * 1 // 1mb, levelup default writeBufferSize
  
  var currentBatch
  var batchPending = false
  var size = 0
  var margaretBatcher = through(batch, finish)
  return margaretBatcher
  
  function batch(obj) {
    console.log('OBJ', obj)
    // if 'true' it means consumer is asking 'give me more data'
    if (obj && typeof obj === 'boolean') {
      currentBatch = []
      batchPending = false
      size = 0
      margaretBatcher.resume()
      return
    }
    
    var len = getByteLength(obj)
    if (!currentBatch) currentBatch = []

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
    var self = this
    if (currentBatch) write()
    self.queue(null)
  }
  
  function write(cb) {
    margaretBatcher.queue(currentBatch)
    margaretBatcher.pause()
  }
  
  function getByteLength(obj) {
    var len = obj.length
    if (!len) len = JSON.stringify(obj) // simplest way to get object size?
    return len
  }
}
