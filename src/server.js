

const fs = require('fs');
const path = require('path');
const _initSquares = require('./initSquares.js');
const _searchArrangments = require('./searchArrangments.js');
const CTE = require('./constants.js');
const { searchArrangments } = _searchArrangments;
const { getInitSquares } =  _initSquares;

let squares = getInitSquares(CTE); 

//Simulation
//on place le square 0 au centre, il restera invariant
squares[0].initRotZero(80, {x: CTE.W/2, y: CTE.H/2});
squares[0].majBox();
//Les deux autres squares vont bouger    
squares[1].initRotZero(80, {x:-9999, y:-9999});
squares[1].majBox();
squares[2].initRotZero(80, {x:9999, y:9999});
squares[2].majBox();

const excursion = 3*squares[0].a/2;

let params = {
    nbSquare: 3,
    step: 3,
    angles: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80],
    sizes: [80.4, 60.3, 40.2, 20.3, 100.5, 10.1, 150.6, 10.1, 2],
    excursion: squares[0].a/2,
    scanArea: {
        xmin: squares[0].box.xmin - excursion,
        xmax: squares[0].box.xmax + excursion,
        ymin: squares[0].box.ymin - excursion,
        ymax: squares[0].box.ymax + excursion
    },
    resultPath: path.join(__dirname+'/result'),
};
//scan zone
params.nx = parseInt((params.scanArea.xmax - params.scanArea.xmin)/params.step)
params.ny = parseInt((params.scanArea.ymax - params.scanArea.ymin)/params.step)

//save params
let paramsFileName = "parameters.json";
fs.writeFile(params.resultPath+'/'+paramsFileName, JSON.stringify(params), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("Parameters file saved successfully!");
});

//To do the (not efficient) calcul with only 2 squares we just put the square 0 far away
//so that it will never interact with the other squares
if ( params.nbSquare == 2 ){
    squares[0].initRotZero(2, {x:-8999, y: 8999});
    squares[0].majBox();
}

//Find the last file calculated and start the calcul from there
let lastFile = null;
fs.readdir(params.resultPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //Listing all result files and find the last one
    let i0_start = 0;
    files.forEach(function (file) {
        console.log(file); 
        let i = parseInt(file.split('.')[0].split('-')[3]);
        if ( i >= i0_start ) {
            i0_start = i;
            lastFile = file;
        }
    });

    console.log('Last File=',lastFile);
    let data = fs.readFileSync(params.resultPath+'/'+lastFile);
    //let data = fs.readFileSync('arrangments-found-4337-29-31.json');
    let arrangments = JSON.parse(data);
    //i0_start = 51;//!!!!!!!
    searchArrangments(squares, params, arrangments, i0_start+1);
});


