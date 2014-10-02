'use strict';

var InfiniteBuffer = (function(){

  /**
  * @constructor
  * @param max_global_size {Number} total size of the target buffer
  * @param max_page_size {Number} max size for pagination calls
  * @param local_buffer_size {Number} size of the local buffer, as factor of max_page_size (eg: 3 means 3*max_page_size slots)
   @param provider {function }  is a callback function that is used as source for a remote large buffer.
      * @param skip {Number} current global position of the iterator
      * @param max_mage_size {Number} max page size requested. may return less.
      * @param cb {Function} callback that is invoked when new data is ready. it pass and array of records. empty if no more.
  */
 var InfiniteBuffer = function(global_size, max_page_size, local_buffer_size, provider){
   this.global_size = global_size;
   this.max_page_size = max_page_size;
   this.slots = new Array(local_buffer_size*max_page_size);
   this.provider = provider;
   this.index = 0;
   this.head = 0;
   this.tail = 0;
 };

 return InfiniteBuffer;


})();
