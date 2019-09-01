      
const util = require('util');
const fs = require('fs');
const _are_VI_Equivalents = require('./compare-arrangements.js');
const _arrangement_to_VI = require('./calculVI.js');

const { are_VI_Equivalents } = _are_VI_Equivalents;
const { arrangement_to_VI } = _arrangement_to_VI;

//Generate a liste of angles
var getAngles = (step, max) => {
    let angles = [];
    let angle = 0;
    while ( angle < max){
        angles.push(angle);
        angle += step;
    }
    return angles;
}

//Generate a list of size in pixel 
var getSizes = (step, max) => {//sizes[i] can go beyond the max value 
    let sizes = [];
    let size = 0;
    while ( size < max){
        size += step;
        sizes.push(size);
    }
    return sizes;
}


//Sum of the elements of column j on the matrix M
var sumOnColumn = function(M, j) {//ok
    const nbLine = M.length;
    let sum = 0;
    for (let i=0;i<nbLine;i++){ 
      sum += M[i][j];
    }
    return sum;
}

// Sum sizes of all the arrsN3[nV][nI] defined
// to get the total number of arrangement found
var getArrsN3Length = (arrsN3) => {
    let n = arrsN3.length;
    let sum = 0;
    for (let i=0;i<n;i++){
        if (arrsN3[i]) {
            let p = arrsN3[i].length;
            for (let j=0;j<p;j++){
                if (arrsN3[i][j]) {
                    sum += arrsN3[i][j].length;
                }
            }
        }
    } 
    return sum;
}

//Extract the arrangments from arrsN3 to return a simplified linear array
var getArrsN3Array = (arrsN3) => {

    let n = arrsN3.length;
    let arrs = [];
    for (let i=0;i<n;i++){
        if (arrsN3[i]) {
            let p = arrsN3[i].length;
            for (let j=0;j<p;j++){
                if (arrsN3[i][j]) {  
                    let k = arrsN3[i][j].length;   
                    for (let m=0;m<k;m++){
                        arrs.push(arrsN3[i][j][m]); 
                    }              
                }
            }
        }
    } 

    // We only keep the informations useful to draw the arrangement in svg
    let arrsLigth = arrs.map((elem)=>{
        return {
            V: elem.V,
            I: elem.I,
            //fuzzy: elem.fuzzy,
            squares: [
                {
                    a: elem.squares[0].a,
                    center: elem.squares[0].center,
                    angle: elem.squares[0].angle,
                    vertex: elem.squares[0].vertex,
                },
                {
                    a: elem.squares[1].a,
                    center: elem.squares[1].center,
                    angle: elem.squares[1].angle,
                    vertex: elem.squares[1].vertex,
                },
                {
                    a: elem.squares[2].a,
                    center: elem.squares[2].center,
                    angle: elem.squares[2].angle,
                    vertex: elem.squares[2].vertex,
                },               
            ],
        }
    });
    
    // We remove unnecessary decimals, 4 digits after the decimal point should be ok
    n = arrsLigth.length;
    for (let i=0;i<n;i++){
        for (let j=0;j<3;j++){
            for (let k=0;k<4;k++){
                arrsLigth[i].squares[j].vertex[k].x = parseFloat(arrsLigth[i].squares[j].vertex[k].x.toFixed(4));
                arrsLigth[i].squares[j].vertex[k].y = parseFloat(arrsLigth[i].squares[j].vertex[k].y.toFixed(4));
            }
        }
    }
   
    return arrsLigth;
}

// Add the arr arrangement into the list arrsN3 if there is 
// no equivalent arrangment already present
var updateArrsN3 = (arr, arrsN3) => {
    
    if ( arr.valid ){

        //For optimisation purpose we store each arrangement in a particular category. 
        //When a new arrangment will be generated we will search his equivalent only inside this category.
        //The category of an arrangment is defined by 2 integers nV and nI calulated as following 
        //(they will serve as an entry of a 2 dimensional array)
        // this method will reduce drastically the number of arrangement to compared

        let sV = [
            sumOnColumn(arr.V, 0), 
            sumOnColumn(arr.V, 1),  
            sumOnColumn(arr.V, 2)
        ];
        sV.sort((a, b) => a - b);//ascending sort

        let sI = [
            sumOnColumn(arr.I, 0), 
            sumOnColumn(arr.I, 1),  
            sumOnColumn(arr.I, 2)
        ];
        sI.sort((a, b) => a - b);//ascending sort

        //convertion to a decimal number 
        let nV = sV[0]*100 + sV[1]*10 + sV[2];
        let nI = sI[0]*100 + sI[1]*10 + sI[2];

        if ( arrsN3[nV] ){
            if ( arrsN3[nV][nI] ){//the category exist so we search an equivalent of arr inside
                let n = arrsN3[nV][nI].length;
                
                let found = false;
                for(let i=n-1;i>=0;i--){
                    if ( are_VI_Equivalents(arrsN3[nV][nI][i], arr) ){
                        found = true;
                        debugger;
                        // if ( arr.fuzzy < arrsN3[nV][nI][i].fuzzy ){
                        //     //remplacer arrsN3[nV][nI][i] par arr                        
                        //     arrsN3[nV][nI][i] = JSON.parse(JSON.stringify(arr));
                        // }
                        break;
                    }
                }
                if (!found){
                    arrsN3[nV][nI].push(arr); 
                    //console.log(arrsN3.length + ' arrangments found');
                }
            } else {//we create a new arrangment category
                arrsN3[nV][nI] = [];
                arrsN3[nV][nI].push(arr);      
            }
        } else {//we create a new arrangment category
            arrsN3[nV] = [];
            arrsN3[nV][nI] = [];
            arrsN3[nV][nI].push(arr);
        }

    }
    //return arrsN3;
}

exports.searchArrangments = function (squares, arrangments=[], i0_start=0, i0_end=32) {
    //Principle: we place a fixed square in the center of the simulation zone then sweep
    //the the simulation zone with 2 other squares (by varying their size and their angle of rotation)
    
    //List of the N=3 arrangments found
    let arrsN3 = [];
    for (let i=0;i<arrangments.length;i++){
        arrangments[i].valid = true;
        updateArrsN3(arrangments[i], arrsN3);
    }
    
    const t0 = Date.now(); 
   
    let scanArea = {
        xmin: squares[0].box.xmin - squares[0].a/2,
        xmax: squares[0].box.xmax + squares[0].a/2,
        ymin: squares[0].box.ymin - squares[0].a/2,
        ymax: squares[0].box.ymax + squares[0].a/2
    };

    //==> 80 * 2 = 160, 160/5 = 32
    
    //const step = 5;//squares[0].a/20;

    const step = 5;
    
    //scan zone
    const nx = parseInt((scanArea.xmax - scanArea.xmin)/step);
    const ny = parseInt((scanArea.ymax - scanArea.ymin)/step);

    //on ne balaye que l'intervalle specifié en x
    let nx0 = i0_end - i0_start;

    const nxny = nx0*ny;
    //const nx_half = Math.ceil(nx/2) + step;
    //const ny_half = Math.ceil(ny/2) + step;

    let x2, y2, x3, y3;

    const angles = [0, 5, 10, 20, 30, 40, 50, 60, 70, 80];//getAngles(45, 90);
    const sizes = [80.4, 60.3, 40.2, 20.3, 100.5, 10.1, 150.6, 2];

    //const angles = [0, 20, 40];
    //const sizes = [40, 80];
     
    const n_angles = angles.length;
    const n_size = sizes.length;

    let positionsTested = 0;
    let count = 0;

    for(let i0=i0_start;i0<i0_end/*nx*/;i0++){
        x2 = scanArea.xmin + i0*step;
        for(let j0=0;j0<ny;j0++){
            y2 = scanArea.ymin + j0*step;
            count++;
            let delta_t = parseFloat(((Date.now() - t0)/(1000*60)).toFixed(2))  ;
            console.log(100*count/nxny + '% : '+ getArrsN3Length(arrsN3) + ' arrangments found in '+ delta_t + ' minutes');
            for(let p=0;p<n_size;p++){
                for(let k=0;k<n_angles;k++){                                                          
                    squares[1].changeState({x:x2,y:y2}, sizes[p], angles[k]);
                    for(let i1=i0;i1<nx;i1++){// i1=i0
                        x3 = scanArea.xmin + i1*step;
                        for(let j1=j0;j1<ny;j1++){// j1=j0
                            y3 = scanArea.ymin + j1*step;                      
                            for(let q=0;q<n_size;q++){                                     
                                for(let m=0;m<n_angles;m++){                                                              
                                    squares[2].changeState({x:x3,y:y3}, sizes[q], angles[m]);                                                                                                              
                                    //let arr = arrangement_to_VI(squares);
                                    //let n3 = getArrsN3Length(arrsN3)                                   
                                    updateArrsN3(arrangement_to_VI(squares), arrsN3);                                   
                                    positionsTested++;                                                                                        
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    console.log('========= RESULT =========');
    
    console.log('step:'+step);
    console.log('angles:'+angles);
    console.log('sizes:'+sizes);
    let delta_t = (Date.now() - t0)/(1000*60);
    console.log(positionsTested + ' positionsTested');
    const nbArrFound = getArrsN3Length(arrsN3);
    console.log(nbArrFound + ' arrangments found in '+ delta_t + ' minutes');

    //Export result 
    console.log('Save result...');
    const result = getArrsN3Array(arrsN3);
    var log = (obj) => { console.log(util.inspect(obj, {showHidden: false, depth: null})) };
    //log(result);
    let fileName = "arrangments-found-"+nbArrFound+"-"+i0_start+"-"+i0_end+".json";
    fs.writeFileSync(fileName, JSON.stringify(result));
  
    console.log('========= END =========');
}
