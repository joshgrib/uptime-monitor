# perf-mon

A simple server for performance monitoring

* Enter URLs to collect PING data from
* Configure monitoring
  * Ping frequency
  * Save response data
* See a cool dashboard

## TODO

* [x] Ping repeatedly and collect response times
* [x] Be able to add/remove routes from the pinger list
* [x] Reset ping interval when refresh rate is changed
* [x] Move history into a DB for persistence
  * [_] Use a real DB instead of a JSON file?
* [x] Break out into a new repo
* [_] Maybe use websocket to send updated history
