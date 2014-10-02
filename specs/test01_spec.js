describe("instantiation", function(){

//this is the size of our large buffer
var MAX_GLOBAL_SIZE = 1000;
var MAX_PAGE_SIZE = 100;
var LOCAL_BUFFER_SIZE = 3; //num of pages


var provider = function(skip, max_page_size, cb){
};

/**
* here we are creating a infinitebuffer that will handle MAX_GLOBAL_SIZE records in pages of MAX_PAGE_SIZE,
* with an internal buffer of 3 pages
*/
var ibuffer = new InfiniteBuffer(MAX_GLOBAL_SIZE, MAX_PAGE_SIZE, LOCAL_BUFFER_SIZE, provider);


it("should know global size", function(){
  expect(ibuffer.global_size).toBe(MAX_GLOBAL_SIZE);
});


it("should reserve local slots", function(){
  expect(ibuffer.slots.length).toBe(LOCAL_BUFFER_SIZE*MAX_PAGE_SIZE);
});

it("should start at index 0", function(){
  expect(ibuffer.index).toBe(0);
  expect(ibuffer.head).toBe(0);
  expect(ibuffer.tail).toBe(0);
});

});
