describe("infinitebuffer", function(){

var i, sum, count, ctrl, numints;

//this is the size of our large buffer
var MAX_GLOBAL_SIZE = 1010; //we add 10 items to test a last page without full records
var MAX_PAGE_SIZE = 100;


  /**
  * simple provider that will return data[i] = skip + i up to MAX_GLOBAL_SIZE
  */
var provider = function(skip, max_page_size, cb){
  var max = Math.min(MAX_GLOBAL_SIZE, skip+max_page_size);
  data = [];
  for(i=skip; i<max; ++i){
    data.push(i);
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
      expect(ibuffer.slots_length).toBe(0);
    });

  });

  describe("should iterate over all the data", function(){

    beforeEach(function(){
      ibuffer = new InfiniteBuffer(MAX_GLOBAL_SIZE, MAX_PAGE_SIZE, provider);
    });

    it("should support forward iteration", function(){
      sum = 0;
      count = 0;
      ctrl = 0;
      while(ibuffer.hasGlobalNext()){
        ctrl++;
        //important! the number of calls to "next" are more than MAX_GLOBAL_SIZE,
        //because for each page, we invoke next twice.
        if(ctrl > 2*MAX_GLOBAL_SIZE){
          throw "something went wrong with this test: infinite loop?";
        }
        if(ibuffer.next()){
          count++;
          sum += ibuffer.val();
        }else{
          //waiting for remote data!
        }
      }

      numints = MAX_GLOBAL_SIZE -1;
      expect(sum).toBe((numints*(numints+1))/2);
      expect(count).toBe(MAX_GLOBAL_SIZE);
    });


    it("should support backward iteration", function(){
      sum = 0;
      count = 0;
      ctrl = 0;
      ibuffer.moveToEnd();
      while(ibuffer.hasGlobalPrev()){
        ctrl++;
        if(ctrl > 2*MAX_GLOBAL_SIZE){
          throw "something went wrong with this test: infinite loop?";
        }
        if(ibuffer.prev()){
          count++;
          sum += ibuffer.val();
        }else{
          //waiting for remote data!
        }
      }

      numints = MAX_GLOBAL_SIZE -1;
      expect(sum).toBe((numints*(numints+1))/2);
      expect(count).toBe(MAX_GLOBAL_SIZE);

    });

  });


});
