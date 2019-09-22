

const fs = require('fs');
const path = require('path');
const { getInitSquares } = require('./initSquares.js');
const CTE = require('./constants.js');
const { sumOnColumn, getArrsN3Length } = require('./searchArrangments.js');
const { arrangement_to_VI, pointInSquare, nbVertexInside, intersectionSegments } = require('./calculVI.js');


let squares = getInitSquares(CTE);

//We place the first square on the center, it will not change.
squares[0].initRotZero(1, {x: 0.5, y: 0.5});
squares[1].initRotZero(1, {x: 0.5, y: 0.5});
squares[2].initRotZero(1, {x: 100, y: 100});

if ( pointInSquare({x:0.5,y:0.5}, squares[0]) != true ){
    console.log("ERROR 1");
}
if ( pointInSquare({x:0,y:0}, squares[0]) != false ){
    console.log("ERROR 2");
}
if ( pointInSquare({x:1,y:1}, squares[0]) != false ){
    console.log("ERROR 3");
}
if ( pointInSquare({x:0.99,y:0.99}, squares[0]) != true ){
    console.log("ERROR 4");
}

if ( pointInSquare({x:0.9999,y:0.9999}, squares[0]) != true ){
    console.log("ERROR 4.2");
}
if ( pointInSquare({x:1.001,y:0.5}, squares[0]) != false ){
    console.log("ERROR 5");
} 
  
squares[0].changeState({x: 0.5, y: 0.5}, 1, 45);

if ( pointInSquare({x:0.1,y:0.1}, squares[0]) != false ){
    console.log("ERROR 6");
}
if ( pointInSquare({x:1,y:0.5}, squares[0]) != true ){
    console.log("ERROR 7");
} 
if ( pointInSquare({x:0.5 + Math.sqrt(2)/2,y:0.5}, squares[0]) != false ){
    console.log("ERROR 8");
} 

if ( nbVertexInside(squares[0], squares[1], CTE.NB_VERTEX) != 0 ){
    console.log("ERROR 9");
}
if ( nbVertexInside(squares[0], squares[2], CTE.NB_VERTEX) != 0 ){
    console.log("ERROR 10");
}


squares[1].changeState({x: 1, y: 0.5}, 1, 0);
if ( nbVertexInside(squares[1], squares[0], CTE.NB_VERTEX) != 2 ){
    console.log("ERROR 11");
}
if ( nbVertexInside(squares[0], squares[1], CTE.NB_VERTEX) != 1 ){
    console.log("ERROR 12");
}

if ( !!intersectionSegments(0, 1, 0, 0.5, 0, 0, 1, 0.5) != false ){
    console.log("ERROR 13");
}
if ( !!intersectionSegments(0, 1, 0.5, 0.5, 0, 0, 1, -1) != true ){
    console.log("ERROR 14");
}
if ( !!intersectionSegments(0, 1, 0.5, 0.5, 0, 0, 0, 1) != false ){
    console.log("ERROR 15");
}
if ( !!intersectionSegments(0, 1, 1, 1, 0, 0, 0, 1) != false ){
    console.log("ERROR 16");
}
let res = intersectionSegments(0, 0.5, 0, 0.5, 1, 0.5, 0, 2);
if ( !( res.x == 0.2 && res.y == 0.8 && res.ua == 0.4  && res.ub == 0.4 ) ){
    console.log("ERROR 17");
}


squares[0].initRotZero(1, {x: 0.5, y: 0.5}); 
squares[1].changeState({x: 0.5, y: 0.5}, 1, 45);
squares[2].initRotZero(1, {x: 100, y: 100});
let VI = arrangement_to_VI(squares, CTE.NB_VERTEX, CTE.NB_SQUARE);

let V = [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ];
let I = [ [ 2, 2, 0 ], [ 2, 2, 0 ], [ 2, 2, 0 ], [ 2, 2, 0 ] ];

if ( !VI.valid || JSON.stringify(VI.V) != JSON.stringify(V)){
    console.log("ERROR 18");
}
if ( JSON.stringify(VI.I) != JSON.stringify(I)){
    console.log("ERROR 19");
}

squares[1].changeState({x: 0.5, y: 0.5}, 10, 45);
VI = arrangement_to_VI(squares, CTE.NB_VERTEX, CTE.NB_SQUARE);
//console.log(VI);
V = [ [0, 0, 0], [4, 0, 0], [0, 0, 0] ];
I = [ [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
debugger;
if ( !VI.valid || JSON.stringify(VI.V) != JSON.stringify(V)){
    console.log("ERROR 20");
}
if ( JSON.stringify(VI.I) != JSON.stringify(I)){
    console.log("ERROR 21");
}


squares[0].changeState({x: 210, y: 119}, 100, 84);
squares[1].changeState({x: 250, y: 160}, 80, 12);
squares[2].changeState({x: 210, y: 119}, 60, 18);
VI = arrangement_to_VI(squares, CTE.NB_VERTEX, CTE.NB_SQUARE);
V = [ [0, 1, 4], [1, 0, 1], [0, 1, 0] ];
I = [ [1, 2, 0], [1, 0, 1], [0, 0, 1], [0, 2, 0]];
if ( !VI.valid || JSON.stringify(VI.V) != JSON.stringify(V)){
    console.log("ERROR 22");
}
if ( JSON.stringify(VI.I) != JSON.stringify(I)){
    console.log("ERROR 23");
}

squares[0].changeState({x: 210, y: 119}, 100, 84);
squares[1].changeState({x: 250, y: 160}, 170, 48);
squares[2].changeState({x: 196, y: 104}, 70, 66);
VI = arrangement_to_VI(squares, CTE.NB_VERTEX, CTE.NB_SQUARE);
V = [ [0, 0, 2], [3, 0, 2], [0, 0, 0] ];
I = [ [0, 0, 2], [0, 0, 0], [3, 0, 2], [3, 4, 2]];
if ( !VI.valid || JSON.stringify(VI.V) != JSON.stringify(V)){
    console.log("ERROR 24");
}
if ( JSON.stringify(VI.I) != JSON.stringify(I)){
    console.log("ERROR 25");
}

squares[0].changeState({x: 0, y: 0}, 100, 50);
squares[1].changeState({x: 0, y: 0}, 100, 50);
squares[2].changeState({x: 0, y: 0}, 100, 50);
VI = arrangement_to_VI(squares, CTE.NB_VERTEX, CTE.NB_SQUARE);
if ( VI.valid ){
    console.log("ERROR 26");
}

//test sumOnColumn function
V = [ [0, 1, 2], [3, 1, 2], [2, 1, 0] ];
I = [ [0, 1, 2], [3, 1, 2], [2, 1, 0], [2, 1, 5] ];
let sV = [
    sumOnColumn(V, 0), 
    sumOnColumn(V, 1),  
    sumOnColumn(V, 2)
];
sV.sort((a, b) => a - b);//ascending sort
if ( JSON.stringify(sV) != JSON.stringify([3,4,5]) ){
    console.log("ERROR 27");
}
let sI = [
    sumOnColumn(I, 0), 
    sumOnColumn(I, 1),  
    sumOnColumn(I, 2)
];
sI.sort((a, b) => a - b);//ascending sort
if ( JSON.stringify(sI) != JSON.stringify([4,7,9]) ){
    console.log("ERROR 28");
}


// test getArrsN3Length function
let a = [];
a[2] = [];
a[2][3] = [{V:1,U:5},{V:0,U:2}];
a[12] = [];
a[12][13] = [{V:1,U:5},{V:0,U:2},{V:1,U:5},{V:0,U:2}];

if ( getArrsN3Length(a) != 6 ){
    console.log("ERROR 29");
}
console.log("END");


