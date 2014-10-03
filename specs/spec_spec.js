describe("infinitebuffer", function(){

var i, sum, count;

//this is the size of our large buffer
var MAX_GLOBAL_SIZE = 1000;
var MAX_PAGE_SIZE = 100;


  /**
  * simple provider that will return data[i] = skip + i up to MAX_GLOBAL_SIZE
  */
var provider = function(skip, max_page_size, cb){
  var max = Math.min(MAX_GLOBAL_SIZE, skip+max_page_size);
  data = [];
  for(i=0; i<max; ++i){
    data.push(skip+i);
  }
  cb(data);
};

var ibuffer = null;


  describe("instantiation", function(){

    beforeEach(function(){
      ibuffer = new InfiniteBuffer(MAX_GLOBAL_SIZE, MAX_PAGE_SIZE, provider);
    });

    it("should know global size", function(){
      expect(ibuffer.global_size).toBe(MAX_GLOBAL_SIZE);
    });

    it("should reserve local slots", function(){
      expect(ibuffer.slots.length).toBe(MAX_PAGE_SIZE);
    });

    it("should start at indexes -1", function(){
      expect(ibuffer.local_index).toBe(-1);
      expect(ibuffer.page).toBe(-1);
      expect(ibuffer.slots_lenght).toBe(0);
    });

  });

  describe("should support forward iteration", function(){

    beforeEach(function(){
      ibuffer = new InfiniteBuffer(MAX_GLOBAL_SIZE, MAX_PAGE_SIZE, provider);
    });

    it("should iterate over all the data", function(){
      sum = 0;
      count = 0;
      while(ibuffer.hasGlobalNext()){
        count++;
        //important! the number of calls to "next" are more than MAX_GLOBAL_SIZE,
        //because for each page, we invoke next twice.
        if(count > MAX_GLOBAL_SIZE + (MAX_GLOBAL_SIZE/MAX_PAGE_SIZE)){
          throw "something went wrong with this test: infinite loop?";
        }
        if(ibuffer.next()){
          sum += ibuffer.val();
        }else{
          //waiting for remote data!
        }
      }

      var numints = MAX_GLOBAL_SIZE -1;
      expect(sum).toBe((numints*(numints+1))/2);
      //expect(sum).toBe(MAX_GLOBAL_SIZE);
    });



  });


});
