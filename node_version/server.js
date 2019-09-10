

const fs = require('fs');
const path = require('path');
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
squares[2].initRotZero(80, {x:9999, y:9999});
squares[2].majBox();

let params = {
    step: 15,
    angles: [0, 30, 70, 80],
    sizes: [60.3, 20.3, 10.1],
    scanArea: {
        xmin: squares[0].box.xmin - squares[0].a/2,
        xmax: squares[0].box.xmax + squares[0].a/2,
        ymin: squares[0].box.ymin - squares[0].a/2,
        ymax: squares[0].box.ymax + squares[0].a/2
    },
    resultPath: path.join(__dirname+'/result'),
};
//scan zone
params.nx = parseInt((params.scanArea.xmax - params.scanArea.xmin)/params.step)
params.ny = parseInt((params.scanArea.ymax - params.scanArea.ymin)/params.step)

//Find the last file calculated and start the calcul from there
let lastFile = null;
//passsing directoryPath and callback function
fs.readdir(params.resultPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all result files 
    //and find the last one
    let i0_start = 0;
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
        let i = parseInt(file.split('.')[0].split('-')[3]);
        if ( i > i0_start ) {
            i0_start = i;
            lastFile = file;
        }
    });

    console.log('lastFile=',lastFile);
    let data = fs.readFileSync(params.resultPath+'/'+lastFile);
    //let data = fs.readFileSync('arrangments-found-4337-29-31.json');
    let arrangments = JSON.parse(data);
    searchArrangments(squares, params, arrangments, i0_start+1);
});


