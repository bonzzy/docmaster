module.exports = runner;

/**
 * Run through the sequence of functions
 *
 * @param  {Function} next
 * @public
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function isArray(arrayToCheck){
  return (!!arrayToCheck) && (arrayToCheck.constructor === Array);

}

function runner(fns, context, next){
  new runFns(fns, context, function(err){
    next(err);
  });
}

function runFns(fns, context, done){
  this.fns = fns;
  this.context = context;
  this.done = done;
  this.last = fns.length -1;
  this.err = false;
  this.pos = 0;
  var self = this;

  this._run = function(){
    if (this.err || this.pos > this.last) {
      return this.done(this.err);
    }

    if (isArray(this.fns[this.pos])){
      runner (fns[this.pos], context, function (err) {
        self.next(err);
      });

      return ;
    }

    this.call();
  };

  this.call = function(){

    if (!isFunction(self.fns[this.pos])){
      throw new Error('Method at this.position ' + this.pos + ' in runner is not a function');
    }

    fns[this.pos].call(self.context, function (err) {
      self.next(err);
    });

  };

  this.next = function(err) {
    this.err = err;
    this._run(++this.pos);
  };

  this._run();
}