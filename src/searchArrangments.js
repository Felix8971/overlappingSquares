      
const util = require('util');
const fs = require('fs');
const { NB_VERTEX, NB_SQUARE } = require('./constants.js');
const { are_VI_Equivalents } = require('./compare-arrangements.js');
const { arrangement_to_VI } = require('./calculVI.js');

// Sum elements of js column in the matrix M
var sumOnColumn = (M, j) => {
    const nbLine = M.length;
    let sum = 0;
    for (let i=0;i<nbLine;i++){ 
      sum += M[i][j];
    }
    return sum;
}
exports.sumOnColumn = sumOnColumn;

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
exports.getArrsN3Length = getArrsN3Length;

// Extract the arrangments from arrsN3 to return a simplified linear array
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

exports.getArrsN3Array = getArrsN3Array;

// Add the arr arrangement into the list arrsN3 if there is 
// no equivalent arrangment already present
var updateArrsN3 = (arr, arrsN3) => {
    
    if ( arr.valid ){

        // For optimisation purpose we store each arrangement in a particular category. 
        // When a new arrangment will be generated we will search his equivalent only inside this category.
        // The category of an arrangment is defined by 2 integers nV and nI calulated as following 
        // (they'll serve as an entry of a 2 dimensional array)
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

        // the sort is important if we want to save the equivalents arr in
        // the same place in arrsN3
        // sV et sI sont invariants au sein d'un groupe d'arrangements equivalents

        //idée: faire le produit des elements non nulls de chaque colonne de V => 
        /*
         let pV = [
           (arr.V[0][1] == 0 ? 1 : arr.V[0][1])*(arr.V[0][2] == 0 ? 1 : arr.V[0][2]),
           (arr.V[1][0] == 0 ? 1 : arr.V[1][0])*(arr.V[0][2] == 0 ? 1 : arr.V[0][2]),
           (arr.V[2][0] == 0 ? 1 : arr.V[2][0])*(arr.V[2][1] == 0 ? 1 : arr.V[2][1]),
        ];
        pV.sort((a, b) => a - b);//ascending sort

        //puis ajouter pV comme une dimension supplementaire à arrsN3

        */

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
}

var _searchArrangments = function (squares, params, arrangments=[], i0_start=0 ) {
    //Principle: we place a fixed square in the center of the simulation zone then sweep
    //the the simulation zone with 2 other squares (by varying their size and their angle of rotation)
    let { step, angles, sizes, scanArea, nx, ny, resultPath } = params;
   
    //List of the N=3 arrangments found
    let arrsN3 = [];
    for (let i=0;i<arrangments.length;i++){
        arrangments[i].valid = true;
        updateArrsN3(arrangments[i], arrsN3);
    }
    
    const t0 = Date.now();
   
    //const step = 5;//squares[0].a/20;
    //==> 80 * 2 = 160, 160/5 = 32

    //on ne balaye que l'intervalle specifié en x
    let i0_end = i0_start + 1;
    let nx0 = i0_end - i0_start;

    const nxny = nx0*ny;//total number of points used to moves squares

    let x2, y2, x3, y3;

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
                                    //let n3 = getArrsN3Length(arrsN3)                                 
                                    updateArrsN3(arrangement_to_VI(squares,NB_VERTEX,NB_SQUARE), arrsN3);                                   
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
    
    fs.writeFile(resultPath+'/'+fileName, JSON.stringify(result), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("File saved successfully!");
        let data = fs.readFileSync(resultPath+'/'+fileName);
        let _arrangments = JSON.parse(data);
        if ( i0_end < nx ){
          _searchArrangments(squares, params, _arrangments, i0_end);
        }
    });
  
    console.log('========= END =========');
}

exports.searchArrangments = _searchArrangments;