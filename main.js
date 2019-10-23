

 //idee optimisation: pre calculer tous les gabari de carres (avec scales et rotations) puis les translater
 import { fadeOut } from './draw.js';
 import { getViewportSize, setScaleTransform, shuffle } from './util.js';
 import arrangments from './src/result/arrangments-found-4288-0-0.js';
 const { W, H, NB_SQUARE, NB_VERTEX, } = constants;
 const { _controlEvents } = controlEvents;
 const are_VI_Equivalents = compareArrangments.are_VI_Equivalents;
 const arrangement_to_VI = calculVI.arrangement_to_VI;
 const getInitSquares = initSquares.getInitSquares;
 const zoomStep = W/20;

 //let arrangments = [];
 let nbArr = null;
 var ANIMATION_DURATION = 200;


 window.addEventListener('load', function() {
    
    document.getElementById("myButton")
     //Update the displayed matrices according to the value of the squares object
     var updateMatrices = function(arr){          
         let V = arr.V;
         let I = arr.I;
         if (arr.valid) {
             document.getElementById('v-illegal').style.display = "none";
             document.getElementById('f-illegal').style.display = "none";
             for(let i=0;i<3;i++){
                 for(let j=0;j<3;j++){
                     document.getElementById('v'+i+j).innerHTML = V[i][j];
                 }                 
             }
             for(let i=0;i<4;i++){
                 for(let j=0;j<3;j++){
                     document.getElementById('f'+i+j).innerHTML = I[i][j];
                 }                 
             }
         } else {
             document.getElementById('v-illegal').style.display = "block";
             document.getElementById('f-illegal').style.display = "block";
             for(let i=0;i<3;i++){
                 for(let j=0;j<3;j++){
                     document.getElementById('v'+i+j).innerHTML = '.';
                 }                 
             }
             for(let i=0;i<4;i++){
                 for(let j=0;j<3;j++){
                     document.getElementById('f'+i+j).innerHTML = '.';
                 }                 
             }
         }
         testCurrentArrangment(arr);
     }

    
     var testCurrentArrangment = (arr)=>{
         if ( arr.valid ){
             let found = false;
             let index = null;
             let n = arrangments.length;
             for (let i=0;i<n;i++){              
                 if (are_VI_Equivalents(arrangments[i], arr) ) {
                     found = true;
                     index = i + 1;
                     break;
                 }
             }
             if (!found && n > 0){
                 //alert('new arrangment !');
                 console.log('new !');
                 document.getElementById('new-arr').innerHTML = "new arrangment !";
                 document.getElementById('current-arr').value = null;
                 document.getElementById('new-arr').style.opacity = 1;

                 let newArr = {
                     V: arr.V,
                     I: arr.I,
                     squares: [
                         {
                             a: arr.squares[0].a,
                             center: arr.squares[0].center,
                             angle: arr.squares[0].angle,
                         },
                         {
                             a: arr.squares[1].a,
                             center: arr.squares[1].center,
                             angle: arr.squares[1].angle,
                         },
                         {
                             a: arr.squares[2].a,
                             center: arr.squares[2].center,
                             angle: arr.squares[2].angle,
                         },               
                     ],
                 };

                 arrangments.push(newArr);
                 
                 console.log(JSON.stringify(newArr));

             } else {
                 console.log('not new...');
                 document.getElementById('new-arr').innerHTML = "";
                 _controlEvents.setCurrentArr(index-1); 
                 document.getElementById('current-arr').value = index;
                 document.getElementById('new-arr').style.opacity = 1;
             }
         } else {
             console.log('Illegal!');
         }
     }

     var validMove = function(sq, callback){
         //calcul nouvelle matrices V et I pour cette position
         let arr = arrangement_to_VI(squares, NB_VERTEX, NB_SQUARE);
         let index = _controlEvents.getSelectedSquareIndex();
         if ( _controlEvents.getArrLocked() == true ){// unlocked mode: we can chanage the current arrangment
             if (arr.valid){
                 let x = sq.center.x - 0.5*sq.a;
                 let y = sq.center.y - 0.5*sq.a;
                 sq.svg.animate({
                     x,
                     y,
                     width: sq.a,
                     height: sq.a,
                     transform: "r"+sq.angle,
                     delay: 1000
                 }, ANIMATION_DURATION);
                
                 // console.log(sq.angle);
                 // sq.svg.attr({
                 //     x, 
                 //     y, 
                 //     width: sq.a, 
                 //     height: sq.a,
                 //     transform: "r"+sq.angle,
                 // });

                 updateMatrices(arr);
                 
             } else {
                 //Reverse the modification  
                 callback(sq);             
             }
             
         } else { // locked mode: we cannot chanage the current arrangment
             if (arr.valid && are_VI_Equivalents(arrangments[_controlEvents.getCurrentArr()], arr) ) {               
                 //and we update the svg square  
                 let x = sq.center.x - 0.5*sq.a;
                 let y = sq.center.y - 0.5*sq.a;
                 squares[index].svg.animate({ 
                     x,
                     y,
                     width: sq.a,
                     height: sq.a,
                     transform: "r"+sq.angle,
                     delay: 1000
                 }, ANIMATION_DURATION); 

                 // Mettre a jour arrangments[currentArr] pour pouvoir exporter la modif plus tard
                 let square = arrangments[_controlEvents.getCurrentArr()].squares[index];
                 square.a = sq.a; //edge length
                 square.center.x = sq.center.x;
                 square.center.y = sq.center.y;
                 square.angle = sq.angle; 
                 square.vertex = [];
                 for (let i=0;i<NB_VERTEX;i++){
                     square.vertex[i] = {};
                     square.vertex[i].x = sq.vertex[i].x; 
                     square.vertex[i].y = sq.vertex[i].y;  
                 } 
             } else {
                 //Reverse the modification  
                 callback(sq);             
             }
         }
     }

     // document.getElementById('export_new_arr').addEventListener('click', function(event) {
     //     //{"V":[[0,0,0],[2,0,0],[0,0,0]],"I":[[3,4,4],[4,4,4],[3,2,4],[2,2,4]],"squares":[{"a":94,"center":{"x":250,"y":250},"angle":0},{"a":118,"center":{"x":222.5,"y":242.5},"angle":20},{"a":118,"center":{"x":242.5,"y":247.5},"angle":50}]}
     //     JSON.stringify(arrsLigth);
     // });

     let updateJsonBtn = document.getElementById('update-json');
     updateJsonBtn && document.getElementById('update-json').addEventListener('click', function(event) {
         let arrsLigth = arrangments.map((elem)=>{
             return {
                 V: elem.V,
                 I: elem.I,
                 squares: [
                     {
                         a: elem.squares[0].a,
                         center: elem.squares[0].center,
                         angle: elem.squares[0].angle,
                         //vertex: elem.squares[0].vertex,
                     },
                     {
                         a: elem.squares[1].a,
                         center: elem.squares[1].center,
                         angle: elem.squares[1].angle,
                         //vertex: elem.squares[1].vertex,
                     },
                     {
                         a: elem.squares[2].a,
                         center: elem.squares[2].center,
                         angle: elem.squares[2].angle,
                         //vertex: elem.squares[2].vertex,
                     },               
                 ],
             }
         });
         let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arrsLigth));
         let dlAnchorElem = document.getElementById('downloadAnchorElem');
         var downloadLink = document.createElement("a");
         document.body.appendChild(downloadLink);
         document.body.removeChild(downloadLink);
         downloadLink.setAttribute("href",dataStr);
         let fileName = "arrangments-found-"+Date.now()+".json";
         console.log(fileName);
         downloadLink.setAttribute("download",fileName);
         downloadLink.click();
     });

     // function match(elem) {
     //     return ( ( elem.V[0][1] == 0 && elem.V[1][0] == 0 ) 
     //       || ( elem.V[1][2] == 0 && elem.V[2][1] == 0 )
     //       || ( elem.V[0][2] == 0 && elem.V[2][0] == 0 ) 
     //     )
     // }

     function applyZoom(zoomValue){ 
         const xmin = zoomValue * zoomStep;
         const ymin = zoomValue * zoomStep;
         const _w = W - 2 * zoomValue * zoomStep;
         const _h = H - 2 * zoomValue * zoomStep;
         if ( _w > 0 && _h > 0 && _w <= W && _h <= H)
         paper.setViewBox(xmin, ymin, _w, _h);

         for (let k=0;k<3;k++){
             squares[k].svg.attr({'stroke-width': 2 - zoomValue/14});
         }
     }

     // function getArrangmentBox(squares){
     //     let xmin=999, xmax=-999, ymin=999, ymax=-999;
     //     for (let j=0;j<3;j++){
     //         if ( squares[j].box.xmin < xmin ){
     //             xmin = squares[j].box.xmin;                   
     //         }
     //         if ( squares[j].box.ymin < ymin ){
     //             ymin = squares[j].box.ymin;                   
     //         }
     //         if ( squares[j].box.xmax > xmax ){
     //             xmax = squares[j].box.xmax;                   
     //         }
     //         if ( squares[j].box.ymax > ymax ){
     //             ymax = squares[j].box.ymax;           
     //         }
     //     }
     //     return {xmin, xmax, ymin, ymax};
     // }

     //Load arrangement i: update the local squares objet with it and update displayed svg
     function loadArr(i){                
         let arr = arrangments[i];           
         let label = [];
         //let xmin=999, xmax=-999, ymin=999, ymax=-999;
         
         for (let j=0;j<3;j++){
             //We apply the geometric parameters of arr.squares[j] to squares[j] 
             squares[j].changeState({
                 x: arr.squares[j].center.x, 
                 y: arr.squares[j].center.y}, 
                 arr.squares[j].a, 
                 arr.squares[j].angle
             );             
             
             //and we update the svg square   
             let x = squares[j].center.x - 0.5*squares[j].a;
             let y = squares[j].center.y - 0.5*squares[j].a;
             
             squares[j].svg.animate({ 
                 x,
                 y,
                 width: squares[j].a,
                 height: squares[j].a,
                 transform: "r"+squares[j].angle,
             }, ANIMATION_DURATION, "ease-in-out"); 

             document.getElementById('current-arr').value = parseInt(i + 1);
             updateMatrices(arrangement_to_VI(squares, NB_VERTEX, NB_SQUARE));
         }   
     };

   
     const loadArrangments = (url)=>{
        //  fetch(url)
        //  .then(response => response.text())
        //  .then((data) => {               
        //      arrangments = JSON.parse(data);
             //arrangments = shuffle(JSON.parse(data));    
             //  arrangments = arrangments.filter((elem)=>
             //  (( elem.V[0][1] + elem.V[0][2] == 0 ) && ( elem.I[0][0] + elem.I[1][0] + elem.I[2][0] + elem.I[3][0] == 0 ) ));
             nbArr = arrangments.length;
             
             _controlEvents
             .navEvents()
             .arrangmentLockedEvents()
             .readMoreLessEvents()
             .translationStepEvents()
             .rotationStepEvents()
             .resizeStepEvents()
             .translationEvents(squares, validMove, fadeOut)
             .rotationEvents(squares, validMove, fadeOut)
             .resizeEvents(squares, validMove, fadeOut)
             .selectSquareEvents(squares)
             .arrangmentNavigationEvents(applyZoom, loadArr, nbArr);

             document.getElementById('nbArr').innerHTML = nbArr;
             console.log(nbArr);
             _controlEvents.setCurrentArr(0); //currentArr = 0;
             loadArr(_controlEvents.getCurrentArr());
             //loadArr(3027);
             //_controlEvents.setZoomValue(2); 
             //applyZoom(_controlEvents.getZoomValue());
             document.getElementById('spinner').style.display = "none";
        // });
     }

     //contains the current state of our squares
     var squares = getInitSquares(constants);
   
     let viewportSize = getViewportSize();
     console.log(viewportSize);

     const w = viewportSize.w;
     const h = w;//viewportSize.w > 500 ? 500 : viewportSize.w;
     var paper = Raphael(document.getElementById('result-zone'), w, h);
     //make a rectangle that fills the whole canvas area
     
     let hitZone = paper.rect(0, 0, 500, 500);
     hitZone.attr("fill", "black")
     .click(function() {
         _controlEvents.setSelectedSquareIndex(0);       
         for (let k=0;k<3;k++){
             squares[k].svg.attr({"fill-opacity": 0});
         }
     });

     // var rect1 = paper.rect(250, 250, 2, 2);
     // rect1.attr("fill", "red")
     
     // var rect3 = paper.rect(0, 0, 500, 500);
     // rect3.attr({'stroke-width': 5, stroke:'white',});

     paper.setViewBox(0, 0, 500, 500);
     let btnControl = document.getElementById('btn-control');
     //scaling so that the btn-control take 80% of the viewport width
     setScaleTransform(btnControl, 0.8*w / (btnControl.offsetWidth));
     btnControl.style.top = (w-44)+"px"
    
     //document.getElementById("btn-control").style.width = 0.8*w+"px";
    
     let squareStyle = [
         {stroke:'#0000FF', fill:"#0000FF"},
         {stroke:'#00ff00', fill:"#00ff00"},
         {stroke:'#ff0000', fill:"#ff0000"},
     ];
     squareStyle = squareStyle.map((elem)=>{
         return {...elem, 'stroke-width': 2, 'fill-opacity':0, 'cursor':'pointer'}          
     });
    
     for (let j=0;j<3;j++){
         squares[j].svg = paper.rect(250, 200, 0, 0).attr(squareStyle[j])
         .click(function(){ //Define event when click a svg square        
             _controlEvents.setSelectedSquareIndex(j);
             for (let k=0;k<3;k++){
                 squares[k].svg.attr({"fill-opacity": 0});
             }
             this.attr({"fill-opacity": 0.3}); 
         });
         
         //add glow effect on hover
         let g;
         squares[j].svg.hover(function() {
             g = squares[j].svg.glow().attr('stroke',squareStyle[j].stroke); 
         }, function() {// removing the glow        
             g.remove();
         });
     }

     
     // let arrangmentLocked = true;
     // let scaleFactor = 1.5;
     // let switchBox = paper.rect(0, 0, 60, 30)
     // let switchStyle = {'stroke-width': 1, stroke:'#FFFFFF','fill-opacity':1, 'cursor':'pointer'};
     // switchBox.attr({fill: "white", 'fill-opacity': 0.2,'cursor':'pointer' })
     // let border = paper.path("M14,28h32c7.72,0,14-6.28,14-14S53.72,0,46,0H14C6.28,0,0,6.28,0,14S6.28,28,14,28z");
     // border.attr(switchStyle)
     // let paddle = paper.path("M46,24c5.514,0,10-4.486,10-10S51.514,4,46,4S36,8.486,36,14S40.486,24,46,24z");
     // paddle.attr(switchStyle);
     
     // let set = paper.set([switchBox,border,paddle])
     // .scale(scaleFactor, scaleFactor).translate(50, 100)
     // .click(function(){ 
     //     arrangmentLocked = !arrangmentLocked;
     //     let x = scaleFactor * (arrangmentLocked ? 32 : -32);
     //     paddle.translate(x, 0)
     //     //paddle.animate({transform: "t"+x+",400"}, 200);
     // });

    
     //Load the arrangments from the json file and display the fist one
     loadArrangments('./src/result/arrangments-found-test.json');
 });