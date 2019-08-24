const CTE = require('./constants.js');
const { NB_VERTEX } = CTE;
var arrangementValid = true;
 
// Return true if point is inside the box otherwise return false
var pointInBox = (point, box) => {//test ok
    if (point.x <= box.xmin || point.x >= box.xmax || point.y <= box.ymin || point.y >= box.ymax){
        return false;
    }
    return true;
}

// Return true if point is inside the square (the square can be rotated) otherwise return false
var pointInSquare = (point, square) => {//test ok
    const epsilon = 0;
    if ( !pointInBox(point, square.box) ){
        return false;
    }
    let aa = square.a * square.a;
    let k0 = (point.x - square.vertex[0].x )/aa;
    let k1 = (point.y - square.vertex[0].y )/aa;
    let alpha = k0*(square.vertex[1].x - square.vertex[0].x) + k1*(square.vertex[1].y - square.vertex[0].y);
    if ( alpha < epsilon || alpha >= 1 - epsilon){
        return false;
    }
    let beta = k0*(square.vertex[3].x - square.vertex[0].x) + k1*(square.vertex[3].y - square.vertex[0].y);
    if ( beta < epsilon || beta >= 1 - epsilon ){
        return false;
    }
    //console.log(alpha, beta);
    return true;
}

// Return true if the 2 boxes overlapp
function testBoxesOverlapping(boxA, boxB){//tested
    return !( boxA.xmin > boxB.xmax 
            || boxB.xmin > boxA.xmax 
            || boxA.ymin > boxB.ymax 
            || boxB.ymin > boxA.ymax );
}


//Determinant for 2 vectors u and v 
var Det = (u, v) => {
  return u.x * v.y - u.y * v.x; 
}

//Test intersection egde kA of quareA and edge kB of squareB
var intersectionSegments = (squareA, kA0, squareB, kB0) => {
    //Notation: 
    // - vector AB for squareA edge kA
    // - vector CD for squareB edge kB

    let kA = kA0;
    let kB = kB0;
    let kAplus1 = kA + 1;
    let kBplus1 = kB + 1;

    //The second vertex of the last edge is the first vertex of the first edge
    if ( kA0 === NB_VERTEX-1 ){
        kA = kA0;
        kAplus1 = 0;
    }
    if ( kB0 === NB_VERTEX-1 ){
        kB = kB0;
        kBplus1 = 0;
    }

    //AB vector
    let AB = { 
        x: squareA.vertex[kAplus1].x - squareA.vertex[kA].x, 
        y: squareA.vertex[kAplus1].y - squareA.vertex[kA].y
    }
    //AC vector
    let AC =  { 
        x: squareB.vertex[kB].x - squareA.vertex[kA].x, 
        y: squareB.vertex[kB].y - squareA.vertex[kA].y
    }
    //AD vector
    let AD =  { 
        x: squareB.vertex[kBplus1].x - squareA.vertex[kA].x,
        y: squareB.vertex[kBplus1].y - squareA.vertex[kA].y 
    }
    let p0 = Det(AB, AC);
    let p1 = Det(AB, AD);
    
    if ( p0 === 0 || p1 === 0 ){
       arrangementValid = false;
    }
    if ( p0*p1 === 0 || Math.sign(p0) === Math.sign(p1) ) { 
        return false;
    }
    //CD vector
    let CD =  { 
        x: squareB.vertex[kBplus1].x - squareB.vertex[kB].x,
        y: squareB.vertex[kBplus1].y - squareB.vertex[kB].y
    }
    //CA vector
    let CA = {x:-AC.x, y:-AC.y}

    //CB vector
    let CB =  { 
        x: squareA.vertex[kAplus1].x - squareB.vertex[kB].x,
        y: squareA.vertex[kAplus1].y - squareB.vertex[kB].y
    }   
    let p2 = Det(CD, CA);
    let p3 = Det(CD, CB);
    if ( p2 === 0 || p3 === 0 ){
        arrangementValid = false;
     }
    if ( p2*p3 === 0 || Math.sign(p2) === Math.sign(p3) ) { 
        return false;
    }
    return true;
}

// Calculates the number of vertices of the square A in square B
var nbVertexInside = (squareA, squareB) => {
    let n = 0;
    for(let i=0;i<NB_VERTEX;i++){
        if ( pointInSquare(squareA.vertex[i], squareB, 0) ) {
            n++;
        }
    }
    return n;
}


//Calculates the matrix V and I corresponding to a given arrangements of 3 squares
exports.arrangement_to_VI = function(squares) {
    let V = [ 
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    let I = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    arrangementValid = true;

    const N = 3;//squares.length;

    //Calculates nbVertexInside(i, j) for each permutation of 2 squares (i, j) 
    for (let i=0;i<N;i++){
        for (let j=i+1;j<N;j++){ 
            if ( testBoxesOverlapping(squares[i].box, squares[j].box) ) {             
                //calculates i vertices inside j 
                V[i][j] = nbVertexInside(squares[j], squares[i]);

                //calculates j vertices inside i     
                //optimisation: to be calculated only if V[i][j] <= 2  !
                V[j][i] = V[i][j] <= 2 ? nbVertexInside(squares[i], squares[j]) : 0;//à tester !             
                
                //Count intersections of the 2 squares edges 
                for (let k=0;k<NB_VERTEX;k++){ //pour chaque segment k de square i
                    //console.log('k:'+k);
                    //si la box du segment k de i intercepte la box de square j
                    if ( testBoxesOverlapping(squares[i].boxEdge[k], squares[j].box) ){
                        //Test intersection du segment k avec les segments de j
                        for (let p=0;p<NB_VERTEX;p++){//pour chaque segment p de square j
                            if ( testBoxesOverlapping(squares[i].boxEdge[k], squares[j].boxEdge[p]) ){
                                if ( intersectionSegments(squares[i],k,squares[j],p) ){
                                    //console.log('k:'+k+ ' p:' + p);
                                    I[k][i] += 1;
                                    I[p][j] += 1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return {
        V, 
        I,
        squares: JSON.parse(JSON.stringify(squares)),//we want to remove the methods from the object squares
        valid: arrangementValid
    };
}



//test
// let square0 = {
//     a: 100,//edge length
//     center: { x: 0, y: 0},
//     angle: 0,// angle de rotation par rapport à l'horizontal 
//     vertex:[  
//         { x: 110, y: 110},//point 2d
//         { x: 210, y: 110},
//         { x: 210, y: 210},
//         { x: 110, y: 210},
//     ],
//     box: {xmin: 110, xmax: 210, ymin:110, ymax:210}, 
//     majBox: function() {
//         this.box.xmin = this.box.ymin = MAX;
//         this.box.xman = this.box.yman = MIN;        
//         for (let i=0;i<4;i++){
//             if ( this.vertex.x < this.box.xmin ){
//                 this.box.xmin = this.vertex.x;
//             }
//             if ( this.vertex.y < this.box.ymin ){
//                 this.box.ymin = this.vertex.y;
//             }
//             if ( this.vertex.x > this.box.xmax ){
//                 this.box.xmax = this.vertex.x;
//             }
//             if ( this.vertex.y > this.box.ymax ){
//                 this.box.ymax = this.vertex.y;
//             }
//         }
//         this.box.xmin = 2;
//     },
// }

// for (let i=0;i<W;i++){ 
//     for (let j=0;j<H;j++){ 
//         let box = {xmin:i, xmax: i+1, ymin:j, ymax:j+1};
//         //if ( isPointInSquare({x:i, y:j}, square0, 0) ){
//         if ( testBoxesOverlapping(box, square0.box) )  {
//             drawPoint({x:i,y:j});
//         }
//     }
// }