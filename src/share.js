
// I use this method to create JavaScript modules that can be used 
// with node js and in the browser as well
(function(exports){
    exports.test = function(){
        return 'This is a function from shared module';
    };
    exports.NAME = "Foo";
}(typeof exports === 'undefined' ? this.share = {} : exports));