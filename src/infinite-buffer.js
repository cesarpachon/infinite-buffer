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
 var InfiniteBuffer = function(global_size, max_page_size, provider){
   this.global_size = global_size;
   this.max_page_size = max_page_size;
   this.slots = new Array(this.max_page_size);
   //usually will be equals to slots.length (max_page_size) but sometimes it may be less (i.e, at the end of the global buffer)
   this.slots_length = 0;
   this.provider = provider;
   //position of the local buffer related to the global buffer
   this.page = -1;
   this.local_index = -1;
   this.waiting_for_data = false;
 };


  /**
  * return true if there is more data in the global (remote) buffer,
  * it does not matter if the data is out of range of the local array
  */
  InfiniteBuffer.prototype.hasGlobalNext = function(){
    return (this.local_index+1>=0) &&
      (this._localToGlobalIndex(this.local_index + 1) < this.global_size);
  };

  /**
  * return true if there is more data in the global (remote) buffer,
  * it does not matter if the data is out of range of the local array
  */
  InfiniteBuffer.prototype.hasGlobalPrev = function(){
    if(this.local_index == -1)
      return true;
    else
      return this._localToGlobalIndex(this.local_index - 1) >= 0;
  };

  /**
  * try to advance the local index.
  * return true if the data is available for retrieval with the val method.
  * return false means that it is waiting for retrieval of remote data from the provider.
  */
  InfiniteBuffer.prototype.next = function(){

    if(this.waiting_for_data) {
      return false;
    }

    if(this._globalIndexAvailable(this._localToGlobalIndex(this.local_index+1))){
      this.local_index++;
      return true;
    }
    else{
      this.page++;
      this._retrievePage(false);
      return false;
    }
  };


  /**
  * try to decrease the local index.
  * return true if the data is available for retrieval with the val method.
  * return false means that it is waiting for retrieval of remote data from the provider.
  */
  InfiniteBuffer.prototype.prev = function(){

    if(this.waiting_for_data) {
      return false;
    }

    if(this.local_index == -1 && this.page == -1){
      this.page = Math.floor(this.global_size / this.max_page_size);
      this._retrievePage(true);
      return false;
    }

    if(this._globalIndexAvailable(this._localToGlobalIndex(this.local_index-1))){
      if(this.local_index == 0){
        this.local_index = this.max_page_size;
        this.page--;
        this._retrievePage(true);
        return false;
      }else{
        this.local_index--;
      }
      return true;
    }
    else{
      this.page--;
      this._retrievePage(true);
      return false;
    }
  };




  /**
  * returns the value to which is pointing local_index
  */
  InfiniteBuffer.prototype.val = function(){
    return this.slots[this.local_index];
  };


  /**
  *
  */
  InfiniteBuffer.prototype.reset = function(){
    this.local_index = -1; //this.global_size % this.max_page_size;
    this.page = -1; //Math.floor(this.global_size / this.max_page_size);
  };


  /**
  * returns {Number} global index transformed into global index
  */
  InfiniteBuffer.prototype._localToGlobalIndex = function(li){
    return (this.page*this.max_page_size) + li;
  };


  /**
  * returns true if global index gi is loaded into local data
  */
  InfiniteBuffer.prototype._globalIndexAvailable = function(gi){
    if(gi < 0) return false;
    var offset = this.page*this.max_page_size;
    return gi >= offset && gi < Math.min(offset + this.max_page_size, this.global_size);
  };




  /**
  * if moveToEnd is true, local_index will be moved to the lenght of returned data.
  * else, it will be set to -1
  */
  InfiniteBuffer.prototype._retrievePage = function(moveToEnd){
    this.waiting_for_data = true;
    var offset = (this.page)*this.max_page_size;
    var self = this;
    this.provider(offset, this.max_page_size, function(data){
      self.slots_length = Math.min(data.length, self.max_page_size);
      for(var i=0; i<self.slots_length; ++i){
        self.slots[i] = data[i];
      }
      self.waiting_for_data = false;
      if(moveToEnd){
        self.local_index = data.length;
      }else{
        self.local_index = -1;
      }
    });
  };


 return InfiniteBuffer;


})();
