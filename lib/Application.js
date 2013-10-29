var EventEmitter = require('events').EventEmitter;
var util = require('util');
var nop = require('nop');

function Application() {
  EventEmitter.call(this);
  this.jobs = {};
}

util.inherits(Job, EventEmitter);

Application.prototype.use = function(job){
  cb = cb || nop;
  var inst = new job();
  this.jobs[inst.name || job.name] = inst;
  return this;
};

Application.prototype.start = function(jobName, cb){
  cb = cb || nop;
  var inst = this.jobs[jobName];
  if (!inst) {
    throw new Error("Job '"+jobName+"' does not exist");
  }
  inst.start(this, cb);
  return this;
};

module.exports = Application;