(function(exports){

//If we run this code in node window will be undefined
//then we load NB_VERTEX via constants.js
//otherwise if we run in the browser we will load constants.js
//via <script type="text/javascript" src="./src/constants.js"></script>
    
// if ( typeof window === 'undefined' ){
//     const CTE = require('./constants.js');
//     var NB_VERTEX = CTE.NB_VERTEX;
// }

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
    if ( !pointInBox(point, square.box) ){
        return false;
    }
    let aa = square.a * square.a;
    let k0 = (point.x - square.vertex[0].x )/aa;
    let k1 = (point.y - square.vertex[0].y )/aa;
    let alpha = k0*(square.vertex[1].x - square.vertex[0].x) + k1*(square.vertex[1].y - square.vertex[0].y);

    //Too close to 0 or 1    
    const epsilon = 0.0001;
    const tooClose = x => (x > -epsilon && x < epsilon) || ( x > 1-epsilon && x < 1+epsilon );

    //point trop proche des extremités
    if ( tooClose(alpha) ) {
        arrangementValid = false;
    }
    if ( alpha <= 0 || alpha >= 1 ){
        return false;
    }
    let beta = k0*(square.vertex[3].x - square.vertex[0].x) + k1*(square.vertex[3].y - square.vertex[0].y);
    
    //console.log('beta=',beta);
    if ( tooClose(beta) ) {
        arrangementValid = false;
    }
    if ( beta <= 0 || beta >= 1 ){
        return false;
    }
    //console.log(alpha, beta);
    return true;
}

exports.pointInSquare = pointInSquare;

// Return true if the 2 boxes overlapp
function testBoxesOverlapping(boxA, boxB){
    return !(  boxA.xmin > boxB.xmax 
            || boxB.xmin > boxA.xmax 
            || boxA.ymin > boxB.ymax 
            || boxB.ymin > boxA.ymax );
}

//Determinant for 2 vectors u and v 
// var Det = (u, v) => {
//   return u.x * v.y - u.y * v.x; 
// }


// intersection segment [A1A2] with [A3A4]
// notation : Ai = (xi,yi)
var intersectionSegments = function(x1, x2, x3, x4, y1, y2, y3, y4){
    //produit vectoriel de A1A2 et A3A4
    let det = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // Lines are parallel
    if (det === 0) {
        return false;
    }

    //Calcul ||A1I||/||A1A2|| length 
    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / det;
    //Calcul ||A2I||/||A2A3|| length 
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / det;

    // is the intersection not along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
    }
    //Is the intersection not on a segment extremity ?
    if ( ua == 1 || ua == 0 || ub == 1 || ub == 0) {
        arrangementValid = false;
        return false;
    }
    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    return {x, y, ua, ub}
}

exports.intersectionSegments = intersectionSegments;

//fct qui renvoit false si 2 segments (de longueurs non nulles) ne se croisent pas 
//sinon renvoit le point d'intersection
var intersectionEdges = (squareA, kA, squareB, kB, NB_VERTEX) => {
  
    //The second vertex of the last edge is the first vertex of the first edge 
    let kAplus1 = kA === NB_VERTEX - 1 ? 0 : kA + 1;
    let kBplus1 = kB === NB_VERTEX - 1 ? 0 : kB + 1;
  
    //edge kA on squareA = [A1A2]
    //A1
    let x1 = squareA.vertex[kA].x;
    let y1 = squareA.vertex[kA].y;
    //A2
    let x2 = squareA.vertex[kAplus1].x;
    let y2 = squareA.vertex[kAplus1].y;

    //edge kB on squareB = [A3A4]
    //A3
    let x3 = squareB.vertex[kB].x;
    let y3 = squareB.vertex[kB].y;
    //A4
    let x4 = squareB.vertex[kBplus1].x;
    let y4 = squareB.vertex[kBplus1].y;

    return intersectionSegments(x1, x2, x3, x4, y1, y2, y3, y4);
    //ua =  ||A1I||/||A1A2|| =  d[squareA.vertex[kA], I] / squareA.a
    //ub =  ||A3I||/||A3A4|| =  d[squareB.vertex[kB], I] / squareB.a
}



// Calculates the number of vertices of the square A in square B
var nbVertexInside = (squareA, squareB, NB_VERTEX) => {
    let n = 0;
    for(let i=0;i<NB_VERTEX;i++){
        if ( pointInSquare(squareA.vertex[i], squareB) ) {
            n++;
        }
    }
    return n;
}

exports.nbVertexInside = nbVertexInside;

//Calculates the matrix V and I corresponding to a given arrangements of 3 squares
exports.arrangement_to_VI = function(squares, NB_VERTEX, NB_SQUARE) {
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
    // let U = [
    //     [[], [], []],
    //     [[], [], []],
    //     [[], [], []],
    //     [[], [], []],
    // ];

    arrangementValid = true;
    
    //Calculates nbVertexInside(i, j) for each permutation of 2 squares (i, j) 
    for (let i=0;i<NB_SQUARE;i++){
        for (let j=i+1;j<NB_SQUARE;j++){ 
            if ( testBoxesOverlapping(squares[i].box, squares[j].box) ) {             
                //calculates i vertices inside j 
                V[i][j] = nbVertexInside(squares[j], squares[i], NB_VERTEX);
                if ( !arrangementValid ) {
                    return { valid: false }
                }
                //calculates j vertices inside i     
                //optimisation: to be calculated only if V[i][j] <= 2  !
                V[j][i] = V[i][j] <= 2 ? nbVertexInside(squares[i], squares[j], NB_VERTEX) : 0;//à tester !             
                if ( !arrangementValid ) {
                    return { valid: false }
                }

                let flag = false;

                //Count intersections of the 2 squares edges 
                for (let k=0;k<NB_VERTEX;k++){ //pour chaque segment k de square i
                    //si la box du segment k de i intercepte la box de square j
                    if ( testBoxesOverlapping(squares[i].boxEdge[k], squares[j].box) ){
                        //Test intersection du segment k avec les segments de j
                        for (let p=0;p<NB_VERTEX;p++){//pour chaque segment p de square j
                            if ( testBoxesOverlapping(squares[i].boxEdge[k], squares[j].boxEdge[p]) ){
                                let res = intersectionEdges(squares[i],k,squares[j],p, NB_VERTEX);
                                if ( res ){
                                    //console.log('k:'+k+ ' p:' + p);
                                    I[k][i] += 1;
                                    I[p][j] += 1;
                                    flag = true;
                                    // U[k][i].push(res.ua);
                                    // U[p][j].push(res.ub);
                                } 
                            }
                        }
                    }
                }
               
                if ( flag ){
                    // if ( V[i][j] === 0 && V[j][i] === 0  ){                  
                    //     console.log("0 ##################");
                    // }
                    if ( (V[i][j] === 4 || V[j][i] === 4)  ){
                        console.log("4 ####### ERROR ########");                    
                    }
                }

            }
        }
    }

    //calcul fuzzy factor
    //the smaller fuzzy factor is the better is the arrangment
    //we will select the arrangment with the smallest fuzzy factor
    // let fuzzy = 0;
    // for (let i=0;i<N;i++){
    //     for (let p=0;p<NB_VERTEX-1;p++){
    //         if ( U[i][p].length > 0){
    //             for (let j=0;j<U[i][p].length;j++){
    //                 fuzzy += 1/U[i][p][j];
    //             }
    //         }
    //     }
    // }
    return {
        V,
        I,
        //fuzzy,
        squares: JSON.parse(JSON.stringify(squares)),//we want to remove the methods from the object squares
        valid: arrangementValid,
    };
}

}(typeof exports === 'undefined' ? this.calculVI = {} : exports));




//Test intersection egde kA of quareA and edge kB of squareB
// var intersectionSegments = (squareA, kA, squareB, kB) => {
//     //Notation: 
//     // - vector AB for squareA edge kA
//     // - vector CD for squareB edge kB

//     //The second vertex of the last edge is the first vertex of the first edge 
//     let kAplus1 = kA === NB_VERTEX - 1 ? 0 : kA + 1;
//     let kBplus1 = kB === NB_VERTEX - 1 ? 0 : kB + 1;

//     //AB vector
//     let AB = { 
//         x: squareA.vertex[kAplus1].x - squareA.vertex[kA].x, 
//         y: squareA.vertex[kAplus1].y - squareA.vertex[kA].y
//     }
//     //AC vector
//     let AC =  { 
//         x: squareB.vertex[kB].x - squareA.vertex[kA].x, 
//         y: squareB.vertex[kB].y - squareA.vertex[kA].y
//     }
//     //AD vector
//     let AD =  { 
//         x: squareB.vertex[kBplus1].x - squareA.vertex[kA].x,
//         y: squareB.vertex[kBplus1].y - squareA.vertex[kA].y 
//     }
//     let p0 = Det(AB, AC);
//     let p1 = Det(AB, AD);
    
//     if ( p0 === 0 || p1 === 0 ){
//        arrangementValid = false;
//     }
//     if ( p0*p1 === 0 || Math.sign(p0) === Math.sign(p1) ) { 
//         return false;
//     }
//     //CD vector
//     let CD =  { 
//         x: squareB.vertex[kBplus1].x - squareB.vertex[kB].x,
//         y: squareB.vertex[kBplus1].y - squareB.vertex[kB].y
//     }
//     //CA vector
//     let CA = {x:-AC.x, y:-AC.y}

//     //CB vector
//     let CB =  { 
//         x: squareA.vertex[kAplus1].x - squareB.vertex[kB].x,
//         y: squareA.vertex[kAplus1].y - squareB.vertex[kB].y
//     }   
//     let p2 = Det(CD, CA);
//     let p3 = Det(CD, CB);
//     if ( p2 === 0 || p3 === 0 ){
//         arrangementValid = false;
//     }
//     if ( p2*p3 === 0 || Math.sign(p2) === Math.sign(p3) ) { 
//         return false;
//     }
//     return true;
// }




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
//         //if ( isPointInSquare({x:i, y:j}, square0) ){
//         if ( testBoxesOverlapping(box, square0.box) )  {
//             drawPoint({x:i,y:j});
//         }
//     }
// }