

const fs = require('fs');
const path = require('path');
const { getInitSquares } = require('./initSquares.js');
const CTE = require('./constants.js');
const { sumOnColumn, getArrsN3Length, getArrsN3Array, updateArrsN3 } = require('./searchArrangments.js');
const { arrangement_to_VI, pointInSquare, nbVertexInside, intersectionSegments } = require('./calculVI.js');
const { areEqual, det33, getEquivalent_VI_List, getEquivalent_I_List, are_VI_Equivalents } = require('./compare-arrangements.js');

var tests = function(){ 
    let nbError = 0;
    let squares = getInitSquares(CTE);

    //We place the first square on the center, it will not change.
    squares[0].initRotZero(1, {x: 0.5, y: 0.5});
    squares[1].initRotZero(1, {x: 0.5, y: 0.5});
    squares[2].initRotZero(1, {x: 100, y: 100});

    if ( pointInSquare({x:0.5,y:0.5}, squares[0]) != true ){
        console.log("ERROR 1");
        nbError++;
    }
    if ( pointInSquare({x:0,y:0}, squares[0]) != false ){
        console.log("ERROR 2");
        nbError++;
    }
    if ( pointInSquare({x:1,y:1}, squares[0]) != false ){
        console.log("ERROR 3");
        nbError++;
    }
    if ( pointInSquare({x:0.99,y:0.99}, squares[0]) != true ){
        console.log("ERROR 4");
        nbError++;
    }

    if ( pointInSquare({x:0.9999,y:0.9999}, squares[0]) != true ){
        console.log("ERROR 4.2");
        nbError++;
    }
    if ( pointInSquare({x:1.001,y:0.5}, squares[0]) != false ){
        console.log("ERROR 5");
        nbError++;
    } 
    
    squares[0].changeState({x: 0.5, y: 0.5}, 1, 45);

    if ( pointInSquare({x:0.1,y:0.1}, squares[0]) != false ){
        console.log("ERROR 6");
        nbError++;
    }
    if ( pointInSquare({x:1,y:0.5}, squares[0]) != true ){
        console.log("ERROR 7");
        nbError++;
    } 
    if ( pointInSquare({x:0.5 + Math.sqrt(2)/2,y:0.5}, squares[0]) != false ){
        console.log("ERROR 8");
        nbError++;
    } 

    if ( nbVertexInside(squares[0], squares[1], CTE.NB_VERTEX) != 0 ){
        console.log("ERROR 9");
        nbError++;
    }
    if ( nbVertexInside(squares[0], squares[2], CTE.NB_VERTEX) != 0 ){
        console.log("ERROR 10");
        nbError++;
    }


    squares[1].changeState({x: 1, y: 0.5}, 1, 0);
    if ( nbVertexInside(squares[1], squares[0], CTE.NB_VERTEX) != 2 ){
        console.log("ERROR 11");
        nbError++;
    }
    if ( nbVertexInside(squares[0], squares[1], CTE.NB_VERTEX) != 1 ){
        console.log("ERROR 12");
        nbError++;
    }

    if ( !!intersectionSegments(0, 1, 0, 0.5, 0, 0, 1, 0.5) != false ){
        console.log("ERROR 13");
        nbError++;
    }
    if ( !!intersectionSegments(0, 1, 0.5, 0.5, 0, 0, 1, -1) != true ){
        console.log("ERROR 14");
        nbError++;
    }
    if ( !!intersectionSegments(0, 1, 0.5, 0.5, 0, 0, 0, 1) != false ){
        console.log("ERROR 15");
        nbError++;
    }
    if ( !!intersectionSegments(0, 1, 1, 1, 0, 0, 0, 1) != false ){
        console.log("ERROR 16");
        nbError++;
    }
    let res = intersectionSegments(0, 0.5, 0, 0.5, 1, 0.5, 0, 2);
    if ( !( res.x == 0.2 && res.y == 0.8 && res.ua == 0.4  && res.ub == 0.4 ) ){
        console.log("ERROR 17");
        nbError++;
    }


    squares[0].initRotZero(1, {x: 0.5, y: 0.5}); 
    squares[1].changeState({x: 0.5, y: 0.5}, 1, 45);
    squares[2].initRotZero(1, {x: 100, y: 100});
    let VI = arrangement_to_VI(squares, CTE.NB_VERTEX, CTE.NB_SQUARE);

    let V = [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ];
    let I = [ [ 2, 2, 0 ], [ 2, 2, 0 ], [ 2, 2, 0 ], [ 2, 2, 0 ] ];

    if ( !VI.valid || JSON.stringify(VI.V) != JSON.stringify(V)){
        console.log("ERROR 18");
        nbError++;
    }
    if ( JSON.stringify(VI.I) != JSON.stringify(I)){
        console.log("ERROR 19");
        nbError++;
    }

    squares[1].changeState({x: 0.5, y: 0.5}, 10, 45);
    VI = arrangement_to_VI(squares, CTE.NB_VERTEX, CTE.NB_SQUARE);
    //console.log(VI);
    V = [ [0, 0, 0], [4, 0, 0], [0, 0, 0] ];
    I = [ [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];

    if ( !VI.valid || JSON.stringify(VI.V) != JSON.stringify(V)){
        console.log("ERROR 20");
        nbError++;
    }
    if ( JSON.stringify(VI.I) != JSON.stringify(I)){
        console.log("ERROR 21");
        nbError++;
    }


    squares[0].changeState({x: 210, y: 119}, 100, 84);
    squares[1].changeState({x: 250, y: 160}, 80, 12);
    squares[2].changeState({x: 210, y: 119}, 60, 18);
    VI = arrangement_to_VI(squares, CTE.NB_VERTEX, CTE.NB_SQUARE);
    V = [ [0, 1, 4], [1, 0, 1], [0, 1, 0] ];
    I = [ [1, 2, 0], [1, 0, 1], [0, 0, 1], [0, 2, 0]];
    if ( !VI.valid || JSON.stringify(VI.V) != JSON.stringify(V)){
        console.log("ERROR 22");
        nbError++;
    }
    if ( JSON.stringify(VI.I) != JSON.stringify(I)){
        console.log("ERROR 23");
        nbError++;
    }

    squares[0].changeState({x: 210, y: 119}, 100, 84);
    squares[1].changeState({x: 250, y: 160}, 170, 48);
    squares[2].changeState({x: 196, y: 104}, 70, 66);
    VI = arrangement_to_VI(squares, CTE.NB_VERTEX, CTE.NB_SQUARE);
    V = [ [0, 0, 2], [3, 0, 2], [0, 0, 0] ];
    I = [ [0, 0, 2], [0, 0, 0], [3, 0, 2], [3, 4, 2]];
    if ( !VI.valid || JSON.stringify(VI.V) != JSON.stringify(V)){
        console.log("ERROR 24");
        nbError++;
    }
    if ( JSON.stringify(VI.I) != JSON.stringify(I)){
        console.log("ERROR 25");
        nbError++;
    }

    squares[0].changeState({x: 0, y: 0}, 100, 50);
    squares[1].changeState({x: 0, y: 0}, 100, 50);
    squares[2].changeState({x: 0, y: 0}, 100, 50);
    VI = arrangement_to_VI(squares, CTE.NB_VERTEX, CTE.NB_SQUARE);
    if ( VI.valid ){
        console.log("ERROR 26");
        nbError++;
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
        nbError++;
    }
    let sI = [
        sumOnColumn(I, 0), 
        sumOnColumn(I, 1),  
        sumOnColumn(I, 2)
    ];
    sI.sort((a, b) => a - b);//ascending sort
    if ( JSON.stringify(sI) != JSON.stringify([4,7,9]) ){
        console.log("ERROR 28");
        nbError++;
    }


    // test getArrsN3Length function
    let a = {};

    a["12_22"] = [{V:1,U:5},{V:0,U:2}];
    a["132_433"] = [{V:1,U:5},{V:0,U:2},{V:1,U:5},{V:0,U:2}];
    if ( getArrsN3Length(a) != 6 ){
        console.log("ERROR 29");
        nbError++;
    }

    //Check that we can only add a given arrangment just one time in arrsN3
    let arrsN3 = [];
    squares[0].changeState({x: 0, y: 0}, 10, 0);
    squares[1].changeState({x: 100, y: 100}, 30, 0);
    squares[2].changeState({x: 200, y: 200}, 60, 0);

    for (let i=0;i<10;i++){
        updateArrsN3(arrangement_to_VI(squares,CTE.NB_VERTEX,CTE.NB_SQUARE), arrsN3);
    }

    if ( getArrsN3Length(arrsN3) != 1 ){
        console.log("ERROR 30");
        nbError++;
    }

    //add a diferent arrangment
    squares[0].changeState({x: 210, y: 119}, 100, 84);
    squares[1].changeState({x: 250, y: 160}, 170, 48);
    squares[2].changeState({x: 196, y: 104}, 70, 66);
    // V = [ [0, 0, 2], [3, 0, 2], [0, 0, 0] ];=>34
    // I = [ [0, 0, 2], [0, 0, 0], [3, 0, 2], [3, 4, 2]];=>466
    updateArrsN3(arrangement_to_VI(squares,CTE.NB_VERTEX,CTE.NB_SQUARE), arrsN3);

    if ( getArrsN3Length(arrsN3) != 2 ){
        console.log("ERROR 31");
        nbError++;
    }

    let arrangments = [
        {"V":[[0,0,0],[0,0,0],[0,0,0]],"I":[[0,2,2],[0,2,2],[0,2,2],[0,2,2]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":80.1,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":124.95,"y":58.95},{"x":205.05,"y":58.95},{"x":205.05,"y":139.05},{"x":124.95,"y":139.05}]},{"a":80.1,"center":{"x":165,"y":99},"angle":20,"vertex":[{"x":141.0632,"y":47.6674},{"x":216.3326,"y":75.0632},{"x":188.9368,"y":150.3326},{"x":113.6674,"y":122.9368}]}]},
        {"V":[[0,0,0],[0,0,4],[0,0,0]],"I":[[0,0,0],[0,0,0],[0,0,0],[0,0,0]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":80.1,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":124.95,"y":58.95},{"x":205.05,"y":58.95},{"x":205.05,"y":139.05},{"x":124.95,"y":139.05}]},{"a":70.3,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":129.85,"y":63.85},{"x":200.15,"y":63.85},{"x":200.15,"y":134.15},{"x":129.85,"y":134.15}]}]},
        {"V":[[0,0,0],[0,0,1],[0,1,0]],"I":[[0,0,1],[0,2,2],[0,1,0],[0,1,1]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":80.1,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":124.95,"y":58.95},{"x":205.05,"y":58.95},{"x":205.05,"y":139.05},{"x":124.95,"y":139.05}]},{"a":80.1,"center":{"x":165,"y":114},"angle":20,"vertex":[{"x":141.0632,"y":62.6674},{"x":216.3326,"y":90.0632},{"x":188.9368,"y":165.3326},{"x":113.6674,"y":137.9368}]}]},
        {"V":[[0,0,0],[0,0,2],[0,0,0]],"I":[[0,0,0],[0,0,1],[0,2,0],[0,0,1]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":80.1,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":124.95,"y":58.95},{"x":205.05,"y":58.95},{"x":205.05,"y":139.05},{"x":124.95,"y":139.05}]},{"a":70.3,"center":{"x":165,"y":114},"angle":0,"vertex":[{"x":129.85,"y":78.85},{"x":200.15,"y":78.85},{"x":200.15,"y":149.15},{"x":129.85,"y":149.15}]}]},
        {"V":[[0,0,0],[0,0,1],[0,0,0]],"I":[[0,0,1],[0,2,2],[0,2,2],[0,2,1]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":80.1,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":124.95,"y":58.95},{"x":205.05,"y":58.95},{"x":205.05,"y":139.05},{"x":124.95,"y":139.05}]},{"a":70.3,"center":{"x":165,"y":114},"angle":20,"vertex":[{"x":143.9918,"y":68.9478},{"x":210.0522,"y":92.9918},{"x":186.0082,"y":159.0522},{"x":119.9478,"y":135.0082}]}]},
        {"V":[[0,0,0],[0,0,0],[0,2,0]],"I":[[0,2,2],[0,1,0],[0,0,0],[0,1,2]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":80.1,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":124.95,"y":58.95},{"x":205.05,"y":58.95},{"x":205.05,"y":139.05},{"x":124.95,"y":139.05}]},{"a":100.4,"center":{"x":165,"y":114},"angle":20,"vertex":[{"x":134.9968,"y":49.658},{"x":229.342,"y":83.9968},{"x":195.0032,"y":178.342},{"x":100.658,"y":144.0032}]}]},
        {"V":[[0,0,0],[0,0,1],[0,2,0]],"I":[[0,0,1],[0,1,0],[0,0,0],[0,1,1]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":80.1,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":124.95,"y":58.95},{"x":205.05,"y":58.95},{"x":205.05,"y":139.05},{"x":124.95,"y":139.05}]},{"a":100.4,"center":{"x":165,"y":129},"angle":20,"vertex":[{"x":134.9968,"y":64.658},{"x":229.342,"y":98.9968},{"x":195.0032,"y":193.342},{"x":100.658,"y":159.0032}]}]},
        {"V":[[0,0,0],[0,0,1],[0,0,0]],"I":[[0,0,1],[0,2,2],[0,2,0],[0,0,1]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":80.1,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":124.95,"y":58.95},{"x":205.05,"y":58.95},{"x":205.05,"y":139.05},{"x":124.95,"y":139.05}]},{"a":70.3,"center":{"x":165,"y":144},"angle":20,"vertex":[{"x":143.9918,"y":98.9478},{"x":210.0522,"y":122.9918},{"x":186.0082,"y":189.0522},{"x":119.9478,"y":165.0082}]}]},
        {"V":[[0,0,0],[0,0,1],[0,1,0]],"I":[[0,0,1],[0,1,0],[0,1,0],[0,0,1]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":80.1,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":124.95,"y":58.95},{"x":205.05,"y":58.95},{"x":205.05,"y":139.05},{"x":124.95,"y":139.05}]},{"a":80.1,"center":{"x":165,"y":159},"angle":20,"vertex":[{"x":141.0632,"y":107.6674},{"x":216.3326,"y":135.0632},{"x":188.9368,"y":210.3326},{"x":113.6674,"y":182.9368}]}]},
        {"V":[[0,0,0],[0,0,1],[0,0,0]],"I":[[0,0,1],[0,0,0],[0,2,0],[0,0,1]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":80.1,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":124.95,"y":58.95},{"x":205.05,"y":58.95},{"x":205.05,"y":139.05},{"x":124.95,"y":139.05}]},{"a":80.1,"center":{"x":165,"y":174},"angle":20,"vertex":[{"x":141.0632,"y":122.6674},{"x":216.3326,"y":150.0632},{"x":188.9368,"y":225.3326},{"x":113.6674,"y":197.9368}]}]},
        {"V":[[0,0,0],[0,0,0],[0,0,0]],"I":[[0,0,0],[0,0,0],[0,0,0],[0,0,0]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":80.1,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":124.95,"y":58.95},{"x":205.05,"y":58.95},{"x":205.05,"y":139.05},{"x":124.95,"y":139.05}]},{"a":80.1,"center":{"x":165,"y":189},"angle":0,"vertex":[{"x":124.95,"y":148.95},{"x":205.05,"y":148.95},{"x":205.05,"y":229.05},{"x":124.95,"y":229.05}]}]},
        {"V":[[0,0,0],[0,0,0],[0,3,0]],"I":[[0,1,2],[0,1,0],[0,0,0],[0,0,0]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":70.3,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":129.85,"y":63.85},{"x":200.15,"y":63.85},{"x":200.15,"y":134.15},{"x":129.85,"y":134.15}]},{"a":100.4,"center":{"x":165,"y":114},"angle":20,"vertex":[{"x":134.9968,"y":49.658},{"x":229.342,"y":83.9968},{"x":195.0032,"y":178.342},{"x":100.658,"y":144.0032}]}]}
    ];
    arrsN3 = [];
    for (let i=0;i<arrangments.length;i++){
        arrangments[i].valid = true;
        updateArrsN3(arrangments[i], arrsN3);
    }

    debugger;
    if ( Object.keys(arrsN3).length != 12 ){
        console.log("ERROR 32");
        nbError++;
    }

    //I add a fake arrangement in arrsN3["2_44"] just to test that getArrsN3Array will return 13 arrangments
    arrsN3["2_44"][1] = {"V":[[0,0,0],[0,0,0],[0,0,0]],"I":[[0,2,2],[0,2,2],[0,2,2],[0,2,2]],"squares":[{"a":2,"center":{"x":-8999,"y":8999},"angle":0,"vertex":[{"x":-9000,"y":8998},{"x":-8998,"y":8998},{"x":-8998,"y":9000},{"x":-9000,"y":9000}]},{"a":80.1,"center":{"x":165,"y":99},"angle":0,"vertex":[{"x":124.95,"y":58.95},{"x":205.05,"y":58.95},{"x":205.05,"y":139.05},{"x":124.95,"y":139.05}]},{"a":80.1,"center":{"x":165,"y":99},"angle":20,"vertex":[{"x":141.0632,"y":47.6674},{"x":216.3326,"y":75.0632},{"x":188.9368,"y":150.3326},{"x":113.6674,"y":122.9368}]}]};
    let arr = getArrsN3Array(arrsN3);
    if ( arr.length != 13 ){
        console.log("ERROR 33");
        nbError++;
    }
    console.log("test: nbError found =",nbError);
    


    let V0 = [ [0, 2, 4], [2, 0, 1], [5, 3, 0]]; 
    let V1 = [ [0, 2, 4], [2, 0, 1], [5, 3, 0]];
    let I0 = [ [0, 1, 0], [2, 0, 0], [0, 1, 0], [0, 0, 0]];
    let I1 = [ [1, 1, 0], [2, 0, 0], [0, 1, 0], [0, 0, 0]];

    if ( !areEqual(V0, V1)  ){
        console.log("ERROR 34");
        nbError++;
    }
    if ( areEqual(I0, I1)  ){
        console.log("ERROR 35");
        nbError++;
    }

    if ( det33([[0, 2, -1], [-3, 0, 6], [2, 0, 0]]) != 24 ){
        console.log("ERROR 36");
        nbError++;
    }
    if ( det33([ [0, 1, 2], [3, 0, 4], [5, 6, 0]]) != 56 ){
        console.log("ERROR 37");
        nbError++;
    }

    console.log(nbError > 0 ? "Tests failed !" : "All tests passed" )
    return nbError
}

tests();

exports.tests = tests;