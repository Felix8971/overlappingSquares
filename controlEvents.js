

(function(exports){

    const _controlEvents = {
        translationStep : 1,
        rotationStep : 1,
        resizeStep: 1,
        selectedSquareIndex: 0, 
        zoomValue : 0,
        currentArr : 0,
        playPauseBtnState : null,
        playLoopId : null,
        transitionDelay: 400,

        translationStepEvents: function(){
            let self = this;
            document.getElementById('translation-step').addEventListener('change', function(event) { 
                self.translationStep = parseInt(event.target.value);
            });
            document.getElementById('increase-translation-step').addEventListener('click', function(event) {
                let elem = document.getElementById('translation-step');
                elem.value = parseInt(elem.value) + 1;
                self.translationStep = parseInt(elem.value);
            });
            document.getElementById('decrease-translation-step').addEventListener('click', function(event) {
                let elem = document.getElementById('translation-step');
                elem.value = parseInt(elem.value) - 1;
                if ( elem.value < 0 ){ elem.value = 0; }
                self.translationStep = parseInt(elem.value);
            });
            return this;
        },

        rotationStepEvents: function(){
            let self = this;
            document.getElementById('rotation-step').addEventListener('change', function(event) { 
                self.rotationStep = parseInt(event.target.value);
            });
            document.getElementById('increase-rotation-step').addEventListener('click', function(event) {
                let elem = document.getElementById('rotation-step');
                elem.value = parseInt(elem.value) + 1;
                self.rotationStep = parseInt(elem.value);
            });
            document.getElementById('decrease-rotation-step').addEventListener('click', function(event) {
                let elem = document.getElementById('rotation-step');
                elem.value = parseInt(elem.value) - 1;
                if ( elem.value < 0 ){ elem.value = 0; }
                self.rotationStep = parseInt(elem.value);
            });
            return this;
        },

        resizeStepEvents: function(){
            let self = this;
            document.getElementById('resize-step').addEventListener('change', function(event) { 
                self.resizeStep = parseInt(event.target.value);
            });
            document.getElementById('increase-resize-step').addEventListener('click', function(event) {
                let elem = document.getElementById('resize-step');
                elem.value = parseInt(elem.value) + 1;
                self.resizeStep = parseInt(elem.value);
            });
            document.getElementById('decrease-resize-step').addEventListener('click', function(event) {
                let elem = document.getElementById('resize-step');
                elem.value = parseInt(elem.value) - 1;
                if ( elem.value < 0 ){ elem.value = 0; }
                self.resizeStep = parseInt(elem.value);
            });
            return this;
        },

        translationEvents: function(squares, validMove, fadeOut){
            let self = this;   
            document.getElementById('go-up').addEventListener('click', function(event) {
                let sq = squares[self.selectedSquareIndex];
                sq.translate({x:0, y: -parseInt(self.translationStep)}, true);
                validMove(sq, (elem)=>{
                    elem.translate({x:0, y: parseInt(self.translationStep)}, true);
                    fadeOut(document.getElementById('msg'), null);
                });                
            });
    
            document.getElementById('go-down').addEventListener('click', function(event) {
                let sq = squares[self.selectedSquareIndex];
                sq.translate({x:0, y: parseInt(self.translationStep)}, true);
                validMove(sq, (elem)=>{
                    elem.translate({x:0, y: -parseInt(self.translationStep)}, true);  
                    fadeOut(document.getElementById('msg'), null);
                });   
            });
    
            document.getElementById('go-left').addEventListener('click', function(event) {
                let sq = squares[self.selectedSquareIndex];
                sq.translate({x: -parseInt(self.translationStep), y: 0}, true);
                validMove(sq, (elem)=>{
                    sq.translate({x: parseInt(self.translationStep), y: 0}, true);
                    fadeOut(document.getElementById('msg'), null);
                }); 
            });
    
            document.getElementById('go-right').addEventListener('click', function(event) {
                let sq = squares[self.selectedSquareIndex];
                sq.translate({x: parseInt(self.translationStep), y: 0}, true);
                validMove(sq, (elem)=>{
                    sq.translate({x: -parseInt(self.translationStep), y: 0}, true);
                    fadeOut(document.getElementById('msg'), null);
                });   
            });
            return this;
        },

        rotationEvents: function(squares, validMove, fadeOut){
            let self = this;  
            document.getElementById('rotate-plus').addEventListener('click', function(event) {
                let sq = squares[self.selectedSquareIndex];
                sq.angle = sq.angle + parseInt(self.rotationStep);
                //sq.rotate(sq.angle, true);
                sq.changeState({x:sq.center.x,y:sq.center.y}, sq.a, sq.angle);
                validMove(sq, (elem)=>{
                    sq.angle = sq.angle - parseInt(self.rotationStep);
                    sq.rotate(sq.angle, true);
                    fadeOut(document.getElementById('msg'), null);
                }); 
            });
            document.getElementById('rotate-moins').addEventListener('click', function(event) {
                let sq = squares[self.selectedSquareIndex];
                sq.angle = sq.angle - parseInt(self.rotationStep);
                //sq.rotate(sq.angle, true);
                sq.changeState({x:sq.center.x,y:sq.center.y}, sq.a, sq.angle);
                validMove(sq, (elem)=>{
                    sq.angle = sq.angle + parseInt(self.rotationStep);
                    sq.rotate(sq.angle, true);
                    fadeOut(document.getElementById('msg'), null);
                }); 
            });
            return this;
        },


        resizeEvents: function(squares, validMove, fadeOut){
            let self = this;  
            document.getElementById('resize-plus').addEventListener('click', function(event) {
                let sq = squares[self.selectedSquareIndex];
                let a = sq.a + parseInt(self.resizeStep);
                sq.changeSize(a, true);
                validMove(sq, (elem)=>{
                    let a = sq.a - parseInt(self.resizeStep);
                    sq.changeSize(a, true);
                    fadeOut(document.getElementById('msg'), null);
                }); 
            });
            document.getElementById('resize-moins').addEventListener('click', function(event) {
                let sq = squares[self.selectedSquareIndex];
                let a = sq.a - parseInt(self.resizeStep);
                sq.changeSize(a, true);
                validMove(sq, (elem)=>{
                    let a = sq.a + parseInt(self.resizeStep);
                    sq.changeSize(a, true);
                    fadeOut(document.getElementById('msg'), null);
                }); 
            });
            return this;
        },

        radioBtnEvents: function(squares){
            let self = this;  
            //Define event when click a radio button
            var radio = document.getElementsByName('square-selected');
            for (var i = 0; i < radio.length; i++) {
                radio[i].addEventListener('change', function(event) { 
                    self.setSelectedSquareIndex(event.target.value);
                    for (let j=0;j<3;j++){
                        squares[j].svg.attr({                       
                            "fill-opacity": 0
                        });
                    }                  
                    squares[self.selectedSquareIndex].svg.attr({
                        "fill-opacity": 0.2
                    });              
                });
            }
            return this;
        },

        arrangmentNavigationEvents: function(applyZoom, loadArr, nbArr){
            let self = this;  
            document.getElementById('zoom-in-btn').addEventListener('click', function(event) {          
                self.zoomValue = self.zoomValue < 7 ? self.zoomValue + 1 : 7;
                applyZoom(self.zoomValue);
            });

            document.getElementById('zoom-out-btn').addEventListener('click', function(event) {          
                self.zoomValue = self.zoomValue > 0 ? self.zoomValue - 1 : 0;
                applyZoom(self.zoomValue);
            });

            document.getElementById('next-btn').addEventListener('click', function(event) {
                if (self.currentArr < nbArr - 1){
                    self.currentArr++;
                    loadArr(self.currentArr);
                }
            });
    
            document.getElementById('previous-btn').addEventListener('click', function(event) {
                if (self.currentArr > 0 ){
                    self.currentArr--;
                    loadArr(self.currentArr);
                }
            });
    
            document.getElementById('current-arr').addEventListener('change', function(event) { 
                let value = parseInt(event.target.value);
                if (value >= 1 && value <= nbArr ){
                    self.currentArr = value - 1;
                    loadArr(self.currentArr);
                }
            });
    
            document.getElementById('play-pause-btn').addEventListener('click', function(event) {
                if ( self.playPauseBtnState == null || self.playPauseBtnState == "pause" ){
                    self.playPauseBtnState = "play";
                    document.getElementById('play-btn').style.display = "none";
                    document.getElementById('pause-btn').style.display = "block";
                    self.playLoopId = setInterval(()=>{
                        if (self.currentArr < nbArr - 1){
                            self.currentArr++;
                            loadArr(self.currentArr);
                        } else {
                            clearInterval(self.playLoopId);
                            document.getElementById('play-btn').style.display = "block";
                            document.getElementById('pause-btn').style.display = "none";
                        }
                    }, self.transitionDelay);
                } else {
                    self.playPauseBtnState = "pause";
                    document.getElementById('play-btn').style.display = "block";
                    document.getElementById('pause-btn').style.display = "none";
                    clearInterval(self.playLoopId);
                }
            });
    
            document.getElementById('stop-btn').addEventListener('click', function(event) { 
                clearInterval(self.playLoopId);
                document.getElementById('play-btn').style.display = "block";
                document.getElementById('pause-btn').style.display = "none";
                self.playPauseBtnState = null;
                self.currentArr = 0;
                loadArr(self.currentArr);
            });
            return this;
        },

        getTranslationStep: function(){
            return this.translationStep;
        },

        getSelectedSquareIndex: function(){
            return this.selectedSquareIndex;
        },
        setSelectedSquareIndex: function(value){
            this.selectedSquareIndex = value;
        },
        getZoomValue: function(){
            return this.zoomValue;
        },
        setZoomValue: function(value){
            this.zoomValue = value;
        },
        getCurrentArr: function(){
            return this.currentArr;
        },
        setCurrentArr: function(value){
            this.currentArr = value;
        },
        
    }


    exports._controlEvents = _controlEvents;


}(typeof exports === 'undefined' ? this.controlEvents = {} : exports));