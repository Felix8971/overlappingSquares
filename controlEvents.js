(function(exports) {
  const _controlEvents = {
    translationStep: 5,
    rotationStep: 5,
    resizeStep: 5,
    selectedSquareIndex: 0,
    zoomValue: 0,
    currentArr: 0,
    playPauseBtnState: null,
    playLoopId: null,
    transitionDelay: 1000,
    arrangmentLocked: false,
    dragView: false,
    nbArr:null,
    nbSquares: 2,
    currentContent: "squares", //others possible values: about, contact, ...
    epsilon: 0.013168595184845,

    addEvent: (elementName, eventName, callback) => {
      try {
        return document.getElementById(elementName).addEventListener(eventName, callback);
      } catch {
        console.log("Error on addEvent on element: "+elementName);
      }
    },

    arrangmentLockedEvents: function() {
      let self = this;
      self.addEvent("switch-on-off", "click", function(event) {
        self.arrangmentLocked = !self.arrangmentLocked;
        if (self.arrangmentLocked) {
          document.getElementById("switch-on-btn").style.display = "none";
          document.getElementById("switch-off-btn").style.display = "block";
        } else {
          document.getElementById("switch-on-btn").style.display = "block";
          document.getElementById("switch-off-btn").style.display = "none";
        }
      });
      return self;
    },

    readMoreLessEvents: function() {
      let self = this;
     
      let moreText = document.getElementById("more");
      let readMoreLessBtn = document.getElementById("readMoreLessBtn");
      self.addEvent("readMoreLessBtn", "click", function(event) {
        if (moreText.style.display === "block") {
          readMoreLessBtn.innerHTML = "Read more...";
          moreText.style.display = "none";
        } else {
          readMoreLessBtn.innerHTML = "Read less...";
          moreText.style.display = "block";
        }
      });
      return this;
    },

    navEvents: function() {
      let self = this;
      self.addEvent("open-nav-btn", "click", function(event) {
        document.getElementById("container-nav").style.width = "100%";
      });
      self.addEvent("close-nav-btn", "click", function(event) {
        document.getElementById("container-nav").style.width = "0%";
      });
      self.addEvent("header-title", "click", function(event) {
        document.getElementById("container-nav").style.width = "0%";
        self.setCurrentContent("about");
      });
      self.addEvent("about", "click", function(event) {   
        document.getElementById("container-nav").style.width = "0%";
        self.setCurrentContent("about");
      });
      self.addEvent("more-info", "click", function(event) {   
        document.getElementById("container-nav").style.width = "0%";
        self.setCurrentContent("about");
        var readMoreLessBtn = document.getElementById("readMoreLessBtn");
        var moreText = document.getElementById("more");
        readMoreLessBtn.innerHTML = "Read more";
        moreText.style.display = "none";
      });
      self.addEvent("contact", "click", function(event) {      
        document.getElementById("container-nav").style.width = "0%";
        self.setCurrentContent("contact");
      });
     
      return self;
    },

    translationStepEvents: function() {
      let self = this;
      self.addEvent("translation-step", "change", function(event) {   
        self.translationStep = parseInt(event.target.value);
      });
      self.addEvent("increase-translation-step", "click", function(event) {  
        let elem = document.getElementById("translation-step");
        elem.value = parseInt(elem.value) + 1;
        self.translationStep = parseInt(elem.value);
      });
      self.addEvent("decrease-translation-step", "click", function(event) {  
        let elem = document.getElementById("translation-step");
        elem.value = parseInt(elem.value) - 1;
        if (elem.value < 0) {
          elem.value = 0;
        }
        self.translationStep = parseInt(elem.value);
      });
      return self;
    },

    rotationStepEvents: function() {
      let self = this;
      self.addEvent("rotation-step","change", function(event) {
        self.rotationStep = parseInt(event.target.value);
      });
      self.addEvent("increase-rotation-step","click", function(event) {
        let elem = document.getElementById("rotation-step");
        elem.value = parseInt(elem.value) + 1;
        self.rotationStep = parseInt(elem.value);
      });
      self.addEvent("decrease-rotation-step","click", function(event) {    
          let elem = document.getElementById("rotation-step");
          elem.value = parseInt(elem.value) - 1;
          if (elem.value < 0) {
            elem.value = 0;
          }
          self.rotationStep = parseInt(elem.value);
        });
      return self;
    },

    resizeStepEvents: function() {
      let self = this;
      self.addEvent("resize-step","click", function(event) {
        self.resizeStep = parseInt(event.target.value);
      });
      self.addEvent("increase-resize-step","click", function(event) {    
        let elem = document.getElementById("resize-step");
        elem.value = parseInt(elem.value) + 1;
        self.resizeStep = parseInt(elem.value);
      });
      self.addEvent("decrease-resize-step","click", function(event) {        
        let elem = document.getElementById("resize-step");
        elem.value = parseInt(elem.value) - 1;
        if (elem.value < 0) {
          elem.value = 0;
        }
        self.resizeStep = parseInt(elem.value);
      });
      return this;
    },

    translationEvents: function(squares, validMove, fadeOut) {
      let self = this; 
      function applyAction(vector){
        let sq = squares[self.selectedSquareIndex];
        sq.translate({ 
          x: vector.x*self.translationStep + self.epsilon, 
          y: vector.y*self.translationStep + self.epsilon 
        }, true);
        //if the move is not allowed we cancel it 
        validMove(sq, elem => {
          elem.translate({ 
            x: -vector.x*self.translationStep - self.epsilon, 
            y: -vector.y*self.translationStep - self.epsilon
          }, true);
          fadeOut(document.getElementById("msg"), null);
          touchend();
        });
      }

      //long touch 
      let timer;
      let actionId; 
      let touchDuration = 500; //length of time we want the user to touch before we do somethin

      let touchstart = (vector) => (event) => {
        event && event.preventDefault();
        applyAction(vector);
        timer = setTimeout(onlongtouch(vector), touchDuration); 
      }    
      
      function touchend(event){
        event && event.preventDefault();
        //stops short touches from firing the event
        timer && clearTimeout(timer); // clearTimeout, not cleartimeout..
        actionId && clearInterval(actionId);
      }

      let onlongtouch = (vector) => (event) => {      
        actionId = setInterval(()=>{
          applyAction(vector);
        }, 100);
      };
      
      self.addEvent('go-up','touchstart',touchstart({ x: 0, y: -1}));
      self.addEvent('go-down','touchstart', touchstart({ x: 0, y: 1}));
      self.addEvent('go-left','touchstart', touchstart({ x: -1, y: 0}));
      self.addEvent('go-right','touchstart', touchstart({ x: 1, y: 0}));

      self.addEvent('go-up','touchend', touchend);
      self.addEvent('go-down','touchend', touchend);
      self.addEvent('go-left','touchend', touchend);
      self.addEvent('go-right','touchend', touchend);

      self.addEvent('go-up','mousedown',touchstart({ x: 0, y: -1}));
      self.addEvent('go-down','mousedown', touchstart({ x: 0, y: 1}));
      self.addEvent('go-left','mousedown', touchstart({ x: -1, y: 0}));
      self.addEvent('go-right','mousedown', touchstart({ x: 1, y: 0}));

      self.addEvent('go-up','mouseup', touchend);
      self.addEvent('go-down','mouseup', touchend);
      self.addEvent('go-left','mouseup', touchend);
      self.addEvent('go-right','mouseup', touchend);
      return self;
    },

    rotationEvents: function(squares, validMove, fadeOut) {
      let self = this;
      function applyAction(sign){
        let sq = squares[self.selectedSquareIndex];
        let angle0 = sq.angle;
        sq.angle = sq.angle + sign*parseInt(self.rotationStep);
        sq.changeState({ x: sq.center.x, y: sq.center.y }, sq.a, sq.angle);
        validMove(sq, elem => {
          sq.angle = angle0;
          sq.rotate(sq.angle, true);
          fadeOut(document.getElementById("msg"), null);
        });
      }

      //long touch 
      let timer;
      let actionId; 
      const touchDuration = 500; //length of time we want the user to touch before we do somethin

      let touchstart = (sign) => (event) => {
        event && event.preventDefault();
        applyAction(sign);
        timer = setTimeout(onlongtouch(sign), touchDuration); 
      }    
      
      function touchend(event){
        event && event.preventDefault();
        //stops short touches from firing the event
        timer && clearTimeout(timer); // clearTimeout, not cleartimeout..
        actionId && clearInterval(actionId);
      }

      let onlongtouch = (sign) => (event) => {
        actionId = setInterval(()=>{
          applyAction(sign);
        }, 100);
      };
      
      self.addEvent('rotate-plus','touchstart',touchstart(+1));
      self.addEvent('rotate-moins','touchstart', touchstart(-1));
      self.addEvent('rotate-plus','mousedown',touchstart(+1));
      self.addEvent('rotate-moins','mousedown', touchstart(-1));

      self.addEvent('rotate-plus','touchend', touchend);
      self.addEvent('rotate-moins','touchend', touchend);
      self.addEvent('rotate-plus','mouseup', touchend);
      self.addEvent('rotate-moins','mouseup', touchend);  
      return self;
    },

    resizeEvents: function(squares, validMove, fadeOut) {
      let self = this;
      function applyAction(sign){
        let sq = squares[self.selectedSquareIndex];
        let a0 = sq.a;
        let a = sq.a + sign*parseInt(self.resizeStep) + self.epsilon;
        sq.changeSize(a, true);
        validMove(sq, elem => {
          sq.changeSize(a0, true);
          fadeOut(document.getElementById("msg"), null);
        });
      }

      //long touch 
      let timer;
      let actionId; 
      const touchDuration = 500; //length of time we want the user to touch before we do somethin

      let touchstart = (sign) => (event) => {
        event && event.preventDefault();
        applyAction(sign);
        timer = setTimeout(onlongtouch(sign), touchDuration); 
      }    
      
      function touchend(event){
        event && event.preventDefault();
        //stops short touches from firing the event
        timer && clearTimeout(timer); // clearTimeout, not cleartimeout..
        actionId && clearInterval(actionId);
      }

      let onlongtouch = (sign) => (event) => {
        actionId = setInterval(()=>{
          applyAction(sign);
        }, 100);
      };
      
      self.addEvent('resize-plus','touchstart',touchstart(+1));
      self.addEvent('resize-moins','touchstart', touchstart(-1));
      self.addEvent('resize-plus','mousedown',touchstart(+1));
      self.addEvent('resize-moins','mousedown', touchstart(-1));

      self.addEvent('resize-plus','touchend', touchend);
      self.addEvent('resize-moins','touchend', touchend);
      self.addEvent('resize-plus','mouseup', touchend);
      self.addEvent('resize-moins','mouseup', touchend);
      return self;
    },


    selectSquareEvents: function(squares) {
      let self = this;
      //Define event when click a radio button
      let line = document.getElementsByClassName("legend-line");

      for (var i = 0; i < line.length; i++) {
        (k => {
          line[k].addEventListener("click", function(event) {
            self.setSelectedSquareIndex(k);
            for (let j = 0; j < 3; j++) {
              squares[j].svg.attr({
                "fill-opacity": 0
              });
            }
            squares[self.selectedSquareIndex].svg.attr({
              "fill-opacity": 0.2
            });
          });
        })(i);
      }
      return this;
    },

    arrangmentsNavigationEvents: function(applyZoom, loadArr) {
      let self = this;
      self.addEvent("zoom-in-btn", "click", function(event) {
        self.zoomValue = self.zoomValue < 7 ? self.zoomValue + 1 : 7;
        applyZoom(self.zoomValue);
      });
      self.addEvent("zoom-out-btn", "click", function(event) {    
        self.zoomValue = self.zoomValue > 0 ? self.zoomValue - 1 : 0;
        applyZoom(self.zoomValue);
      });
      self.addEvent("next-btn", "click", function(event) {    
        if (self.currentArr < self.nbArr - 1) {
          self.currentArr++;
          loadArr(self.currentArr);
        }
      });
      self.addEvent("previous-btn", "click", function(event) {  
        if (self.currentArr > 0) {
          self.currentArr--;
          loadArr(self.currentArr);
        }
      });
      self.addEvent("current-arr", "change", function(event) {      
        let value = parseInt(event.target.value);
        if (value >= 1 && value <= self.nbArr) {
          self.currentArr = value - 1;
          loadArr(self.currentArr);
        }
      });
      self.addEvent("play-pause-btn", "click", function(event) {      
        if (
          self.playPauseBtnState == null ||
          self.playPauseBtnState == "pause"
        ) {
          self.playPauseBtnState = "play";
          document.getElementById("play-btn").style.display = "none";
          document.getElementById("pause-btn").style.display = "block";        
          self.playLoopId = setInterval(() => {
            if (self.currentArr < self.nbArr - 1) {
              self.currentArr++;
              loadArr(self.currentArr);
            } else {
              clearInterval(self.playLoopId);
              self.playPauseBtnState == null;
              document.getElementById("play-btn").style.display = "block";
              document.getElementById("pause-btn").style.display = "none";
            }
          }, self.transitionDelay);
        } else {
          self.playPauseBtnState = "pause";
          document.getElementById("play-btn").style.display = "block";
          document.getElementById("pause-btn").style.display = "none";
          clearInterval(self.playLoopId);
        }
      });

      self.addEvent("stop-btn", "click", function(event) {      
        clearInterval(self.playLoopId);
        document.getElementById("play-btn").style.display = "block";
        document.getElementById("pause-btn").style.display = "none";
        self.playPauseBtnState = null;
        self.currentArr = 0;
        loadArr(self.currentArr);
      });
      return self;
    },

    dragViewEvents: function(handleTouchStart, handleTouchEnd) {
      let self = this;
      const resultZone = document.getElementById("result-zone");
      self.addEvent("drag-btn", "click", function(event) {      
        self.dragView = !self.dragView;
        if (self.dragView) {
          document.documentElement.style.overflow = "hidden";
          resultZone.addEventListener("touchstart", handleTouchStart, false);
          //resultZone.addEventListener('touchmove', handleTouchMove, false);
          resultZone.addEventListener("touchend", handleTouchEnd, false);
          document.getElementById("drag-btn").style.backgroundColor =
            "#21b721";
          //hitZhitZone.attr({"cursor": "drag"});
        } else {
          document.documentElement.style.overflow = "";
          resultZone.removeEventListener(
            "touchstart",
            handleTouchStart,
            false
          );
          resultZone.removeEventListener("touchend", handleTouchEnd, false);
          document.getElementById("drag-btn").style.backgroundColor = "";
          //hitZone.attr({"cursor": "pointer"});
        }
      });
      return self;
    },

    getTranslationStep: function() {
      return this.translationStep;
    },

    getSelectedSquareIndex: function() {
      return this.selectedSquareIndex;
    },
    setSelectedSquareIndex: function(value) {
      this.selectedSquareIndex = value;
    },

    getZoomValue: function() {
      return this.zoomValue;
    },
    setZoomValue: function(value) {
      this.zoomValue = value;
    },

    getCurrentArr: function() {
      return this.currentArr;
    },
    setCurrentArr: function(value) {
      this.currentArr = value;
    },

    getArrLocked: function() {
      return this.arrangmentLocked;
    },

    getNbSquares: function() {
      return this.nbSquares;
    },
    setNbSquares: function(value) {
      this.nbSquares = value;
    },

    getNbArr: function() {
        return this.nbArr;
    },
    setNbArr: function(value) {
        this.nbArr = value;
    },

    getCurrentContent: function() {
      return this.currentContent;
    },
    setCurrentContent: function(value) {
      this.currentContent = value;
      document.getElementById("container-about").style.display = "none";
      document.getElementById("container-contact").style.display = "none";
      document.getElementById("container-squares").style.display = "none";
      document.getElementById("container-" + value).style.display = "block";
    }
  };

  exports._controlEvents = _controlEvents;
})(typeof exports === "undefined" ? (this.controlEvents = {}) : exports);
