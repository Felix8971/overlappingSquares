

const fs = require('fs');
const path = require('path');
const { getInitSquares } = require('./initSquares.js');
const CTE = require('./constants.js');
const { searchArrangments } = require('./searchArrangments.js');
const { tests } =  require('./test.js');
let squares = getInitSquares(CTE);

let nbError = tests();
if ( nbError > 0 ){
    return;
}
//Simulation
//We place the first square on the center, it will not change.
squares[0].initRotZero(80, {x: CTE.W/2, y: CTE.H/2});

//Define how far the center of the moving squares can go from the fixed central square
const excursion = (3/4)*squares[0].a;

let params = {
    nbSquare: 3,
    step: 10,
    angles: [0, 10, 20, 30, 40, 50, 60, 70, 80],
    sizes: [30, 40, 50, 80, 90, 100, 110],
    excursion,
    scanArea: {
        xmin: squares[0].box.xmin - excursion,
        xmax: squares[0].box.xmax + excursion,
        ymin: squares[0].box.ymin - excursion,
        ymax: squares[0].box.ymax + excursion
    },
    resultPath: path.join(__dirname+'/result'),
};

//The 2 other squares will change overtime (position, size, angle)  
for (let i=1;i<params.nbSquare;i++){ 
  squares[i].initRotZero(80, {x:0, y:0});
}
//number od step on the scan zone
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
    squares[0].initRotZero(2, {x:-9999, y:9999});
}

const t0 = Date.now();
//Find the last result file calculated and start the calcul from there
let lastFile = null;
fs.readdir(params.resultPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //Listing all result files and find the last one
    let i0_start = 0;
    files.forEach(function (file) {
        if ( file.indexOf("arrangments-found") === 0 ){
            console.log(file);
            let i = parseInt(file.split('.')[0].split('-')[3]);
            if ( i >= i0_start ) {
                i0_start = i;
                lastFile = file;
            }
        }
    });

    console.log('Last File=',lastFile);
    let data = fs.readFileSync(params.resultPath+'/'+lastFile);
    //let data = fs.readFileSync('arrangments-found-4337-29-31.json');
    let arrangments = JSON.parse(data);
    searchArrangments(squares, params, arrangments, i0_start+1);
});


