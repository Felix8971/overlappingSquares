      
import { NB_VERTEX } from './constants.mjs';
  
var pointInBox = (point, box) => {//test ok, add margin ?
    if (point.x <= box.xmin || point.x >= box.xmax || point.y <= box.ymin || point.y >= box.ymax){
        return false;
    }
    return true;
}

const epsilon = 0;// a tester
var pointInSquare = (point, square, marge) => {//test ok
    if ( !pointInBox(point, square.box) ){ 
        return false;
    }
    let aa = square.a*square.a;
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


export function testBoxesOverlapping(boxA, boxB){//tested
    return !(boxA.xmin > boxB.xmax 
        || boxB.xmin > boxA.xmax 
        || boxA.ymin > boxB.ymax 
        || boxB.ymin > boxA.ymax );
}


//signe du determinant de 2 vecteurs u et v se trouvant dans le plan (x,y)
var Det = (u, v) => {
  return u.x * v.y - u.y * v.x; 
}

//Test intersection segment kA de squareA avec segment kB de squareB
var intersectionSegments = (squareA, kA0, squareB, kB0) => {
    //Notation: 
    //vecteur AB pour squareA cote kA
    //vecteur CD pour squareB cote kB

    // il faut interdire A == B ou 

    let kA = kA0;
    let kB = kB0;
    let kAplus1 = kA + 1;
    let kBplus1 = kB + 1;

    //Le 2 eme point du dernier segment est le 1 er point du premier segment
    if ( kA0 === NB_VERTEX-1 ){
        kA = kA0;
        kAplus1 = 0;
    }
    if ( kB0 === NB_VERTEX-1 ){
        kB = kB0;
        kBplus1 = 0;
    }

    //vecteur AB 
    let AB = { 
        x: squareA.vertex[kAplus1].x - squareA.vertex[kA].x, 
        y: squareA.vertex[kAplus1].y - squareA.vertex[kA].y
    }
    //vecteur AC 
    let AC =  { 
        x: squareB.vertex[kB].x - squareA.vertex[kA].x, 
        y: squareB.vertex[kB].y - squareA.vertex[kA].y
    }
    //vecteur AD
    let AD =  { 
        x: squareB.vertex[kBplus1].x - squareA.vertex[kA].x,
        y: squareB.vertex[kBplus1].y - squareA.vertex[kA].y 
    }
    let p0 = Det(AB, AC);
    let p1 = Det(AB, AD);
    
    if ( p0 === 0 || p1 === 0 ){// utiliser un epsilon plutot que zero
       //console.log('ERROR: p0='+p0+' p1='+p1);
       arrangementValid = false;
    }
    if ( p0*p1 === 0 || Math.sign(p0) === Math.sign(p1) ) { 
        return false;
    }
    //vecteur CD 
    let CD =  { 
        x: squareB.vertex[kBplus1].x - squareB.vertex[kB].x,
        y: squareB.vertex[kBplus1].y - squareB.vertex[kB].y
    }
    //vecteur CA
    let CA = {x:-AC.x, y:-AC.y}
    //vecteur CB
    let CB =  { 
        x: squareA.vertex[kAplus1].x - squareB.vertex[kB].x,
        y: squareA.vertex[kAplus1].y - squareB.vertex[kB].y
    }   
    let p2 = Det(CD, CA);
    let p3 = Det(CD, CB);
    if ( p2 === 0 || p3 === 0 ){// utiliser un epsilon plutot que zero ?
        //console.log('ERROR: p2='+p2+' p3='+p3);
        arrangementValid = false;
     }
    if ( p2*p3 === 0 || Math.sign(p2) === Math.sign(p3) ) { 
        return false;
    }
    return true;
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

// calcul le nombre de vertex du carre A se trouvant dans le carre B
var nbVertexInside = (squareA, squareB) => {
    let n = 0;
    for(let i=0;i<NB_VERTEX;i++){
        if ( pointInSquare(squareA.vertex[i], squareB, 0) ) {
            n++;
        }
    }
    return n;
}

var arrangementValid = true;

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
    arrangementValid = true;

    let N = squares.length;//3
    
    //Calcul de V et I
    //pour chaque permutation de 2 square (i,j) de arr on calcul nbVertexInside(i,j)
    for (let i=0;i<N;i++){
        for (let j=i+1;j<N;j++){ 
            if ( testBoxesOverlapping(squares[i].box, squares[j].box) ) {
                //console.log('---- i:'+i+ ' j:' + j+ '----');
                V[i][j] = nbVertexInside(squares[j], squares[i]);
                //console.log('square '+i+' dans '+j+':'+val);
                //calcul vertex de j dans i
                //V[j][i] = nbVertexInside(squares[j], squares[i]);
                V[j][i] = nbVertexInside(squares[i], squares[j]);
                //console.log('square '+j+' dans '+i+':'+val);
                
                //Intersection des segmemts de i et de j
                for (let k=0;k<NB_VERTEX;k++){ //pour chaque segment k de i
                    //console.log('k:'+k);
                    //si la box du segment k de i intercepte la box de square j
                    if ( testBoxesOverlapping(squares[i].boxEdge[k], squares[j].box) ){
                        //Test intersection du segment k avec les segments de j
                        for (let p=0;p<NB_VERTEX;p++){
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
        squares: JSON.parse(JSON.stringify(squares)),
        valid:arrangementValid
    };
}



//test
// let square0 = {
//     a: 100,//edge length
//     center: { x: 0, y: 0},//c'est lui qu'on va deplacer
//     angle: 0,// angle de rotation par rapport à l'horizontal 
//     vertex:[  
//         { x: 110, y: 110},//point 2d
//         { x: 210, y: 110},
//         { x: 210, y: 210},
//         { x: 110, y: 210},
//     ],
//     box: {xmin: 110, xmax: 210, ymin:110, ymax:210}, //sera utile pour optimiser les calculs d'intersection
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
//     majVertex : function (){
//         // en fct de angle, cote a et centre
//     }
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