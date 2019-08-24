

const fs = require('fs');
const _initSquares = require('./initSquares.js');
const _searchArrangments = require('./searchArrangments.js');
const CTE = require('./constants.js');
const { W, H } = CTE;
const { searchArrangments } = _searchArrangments;
const { getInitSquares } =  _initSquares;

let squares = getInitSquares(); 
//console.log(squares);


 //Simulation
//on place le square 0 au centre, il restera invariant
squares[0].initRotZero(80, {x:W/2, y:H/2});
squares[0].majBox();
//Les deux autre squares vont bouger    
squares[1].initRotZero(80, {x:-9999, y:-9999});
squares[1].majBox();
squares[2].initRotZero(80, {x:9999,y:9999});
squares[2].majBox();

let data = fs.readFileSync('arrangments-found-2797-1-3.json');
let arrangments = JSON.parse(data);
searchArrangments(squares, arrangments, 3, 5);