(function(exports){

    exports.test = function(){
        return 'This is a function from shared module';
    };

    exports.NAME = "Felix";
  
}(typeof exports === 'undefined' ? this.share = {} : exports));