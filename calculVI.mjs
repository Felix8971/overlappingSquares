      
import { NB_VERTEX } from './constants.mjs';
var arrangementValid = true;
 
// Return true if point is inside the box otherwise return false
var pointInBox = (point, box) => {//test ok
    if (point.x <= box.xmin || point.x >= box.xmax || point.y <= box.ymin || point.y >= box.ymax){
        return false;
    }
    return true;
}

// Return true if point is inside the square otherwise return false
export function pointInSquare(point, square){//test ok
    const epsilon = 0.001;
    if ( !pointInBox(point, square.box) ){
        return false;
    }
    let aa = square.a * square.a;
    let k0 = (point.x - square.vertex[0].x )/aa;
    let k1 = (point.y - square.vertex[0].y )/aa;
    let alpha = k0*(square.vertex[1].x - square.vertex[0].x) + k1*(square.vertex[1].y - square.vertex[0].y);

    if ( (alpha > -epsilon && alpha < epsilon) || ( alpha > 1-epsilon && alpha < 1+epsilon ) ) {
        arrangementValid = false;
    }
    //console.log('alpha=',alpha);
    if ( alpha < 0 || alpha >= 1 ){
        return false;
    }

    let beta = k0*(square.vertex[3].x - square.vertex[0].x) + k1*(square.vertex[3].y - square.vertex[0].y);
    //console.log('beta=',beta);
    if ( (beta > -epsilon && beta < epsilon) || ( beta > 1-epsilon && beta < 1+epsilon ) ) {
        arrangementValid = false;
    }

    if ( beta < 0 || beta >= 1 ){
        return false;
    }
    //console.log(alpha, beta);
    return true;
}

// Return true if the 2 boxes overlapp
export function testBoxesOverlapping(boxA, boxB){//tested
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
export function intersectionSegments(squareA, kA0, squareB, kB0){
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
    //console.log('p0=',p0);
    //console.log('p1=',p1);
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
    //console.log('p2=',p2);
    //console.log('p3=',p3);
    if ( p2 === 0 || p3 === 0 ){
        arrangementValid = false;
     }
    if ( p2*p3 === 0 || Math.sign(p2) === Math.sign(p3) ) { 
        return false;
    }
    return true;
}

export function intersectionSegments2(x1, x2, x3, x4, y1, y2, y3, y4){
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

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
    }
    //Is a segment extremity inside the other segment ?
    if ( ua == 1 || ua == 0 || ub == 1 || ub == 0) {
        arrangementValid = false;
        return false;
    }
    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    return {x, y, ua, ub}
}

//fct qui renvoit false si 2 segments (de longueurs non nulles) ne se croisent pas 
//sinon renvoit le point d'intersection
var intersectionEdges = (squareA, kA, squareB, kB) => {
  
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

    return intersectionSegments2(x1, x2, x3, x4, y1, y2, y3, y4);
}
//var getSquareSegmentBox = (k, square) => { //not good: a precalculer a chaque fois que le carre change,
//     //calculer box pour 01 et transater pour avoir celle de 23, idem pour 12 et 03
//     let box = {};
//     if ( square.vertex[k].x > square.vertex[k+1].x ){
//         box.xmax = square.vertex[k].x;
//         box.xmin = square.vertex[k+1].x;
//     } else {
//         box.xmin = square.vertex[k].x;
//         box.xmax = square.vertex[k+1].x;
//     }
//     if ( square.vertex[k].y > square.vertex[k+1].y ){
//         box.ymax = square.vertex[k].y;
//         box.ymin = square.vertex[k+1].y;
//     } else {
//         box.ymin = square.vertex[k].y;
//         box.ymax = square.vertex[k+1].y;
//     }
// }

// Calculates the number of vertices of the square A in square B
export function nbVertexInside(squareA, squareB){
    let n = 0;
    for(let i=0;i<NB_VERTEX;i++){
        if ( pointInSquare(squareA.vertex[i], squareB) ) {
            n++;
        }
    }
    return n;
}


//Calculates the matrix V and I corresponding to a given arrangements of 3 squares
export function arrangement_to_VI(squares) {
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
    let U = [
        [[], [], []],
        [[], [], []],
        [[], [], []],
        [[], [], []],
    ];
    arrangementValid = true;

    const N = 3;//squares.length;

    //Calculates nbVertexInside(i, j) for each permutation of 2 squares (i, j) 
    for (let i=0;i<N;i++){
        for (let j=i+1;j<N;j++){ 
            if ( testBoxesOverlapping(squares[i].box, squares[j].box) ) {             
                //calculates i vertices inside j 
                V[i][j] = nbVertexInside(squares[j], squares[i]);
                // if ( !arrangementValid ){
                //     return { valid: false }
                // }
                //calculates j vertices inside i     
                //optimisation: to be calculated only if V[i][j] <= 2  !

                V[j][i] = nbVertexInside(squares[i], squares[j]);
                //V[j][i] = V[i][j] <= 2 ? nbVertexInside(squares[i], squares[j]) : 0;//à tester !             
                
                //Count intersections of the 2 squares edges 
                for (let k=0;k<NB_VERTEX;k++){ //pour chaque segment k de square i
                    //console.log('k:'+k);
                    //si la box du segment k de i intercepte la box de square j
                    if ( testBoxesOverlapping(squares[i].boxEdge[k], squares[j].box) ){
                        //Test intersection du segment k avec les segments de j
                        for (let p=0;p<NB_VERTEX;p++){//pour chaque segment p de square j
                            if ( testBoxesOverlapping(squares[i].boxEdge[k], squares[j].boxEdge[p]) ){
                                let res = intersectionEdges(squares[i],k,squares[j],p);
                                if ( res ){
                                    //console.log('k:'+k+ ' p:' + p);
                                    I[k][i] += 1;
                                    I[p][j] += 1;
                                    U[k][i].push(res.ua);
                                    U[p][j].push(res.ub);
                                } 
                            }
                        }
                    }
                }
            }
        }
    }

    //calcul fuzzy factor
    //the smaller fuzzy factor is the better is the arrangment
    //we will select the arrangment with the smallest fuzzy factor
    let fuzzy = 0;
    for (let i=0;i<N;i++){
        for (let p=0;p<NB_VERTEX-1;p++){
            if ( U[i][p].length > 0){
                for (let j=0;j<U[i][p].length;j++){
                    fuzzy += 1/U[i][p][j];
                }
            }
        }
    }
    return {
        V, 
        I,
        fuzzy,
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