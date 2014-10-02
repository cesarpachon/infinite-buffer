infinite-buffer
===============

test of concept for a javascript async-paginated buffer implemented as a ring buffer with both forward and reverse iterator

requirements (we use this as source for writting the test)
____________


There is a large source array of fixed size (i.e, 10.000 records) that must be retrieved through some paginated service.

The page size has a max, (i.e. 200 records) but may return less events (if it is near to either the end or the start of the source array).

The local buffer is initialized with a fixed size, usually a factor of the max_page_size (i.e = 3*max_page_size = 600)

The local buffer may be iterated either in forward or backward mode

A threshold may be provided to trigger the pagination service once the iterator pass some point.

So, for the end user it must be completely opaque the retrieval of pages. it must be able to iterate the whole records in any direction.



