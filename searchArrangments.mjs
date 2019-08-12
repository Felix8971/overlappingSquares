      
import { are_VI_Equivalents } from './compare-arrangements.mjs';
import { arrangement_to_VI } from './calculVI.mjs';
import { getInitSquares } from './initSquares.mjs';
import { createSVGSquare, updateSVGSquare, drawPoint, drawBox } from './draw.mjs';

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
var getSizes = (step, max) => {//peut depasser la valeur max
    let sizes = [];
    let size = 0;
    while ( size < max){
        size += step;
        sizes.push(size);
    }
    return sizes;
}

//Ajoute l'arrangement arr dans la liste arrsN3 si il n'y pas d'equivalent deja present
var updateArrsN3 = (arr, arrsN3) => {
    if ( arr.valid ){
        //regarder si cet arrangement est deja dans arrsN3
        let n = arrsN3.length;
        let found = false;
        //for(let i=0;i<n;i++){// comparer le temps execution dans chaque cas 
        for(let i=n-1;i>=0;i--){
            if ( are_VI_Equivalents(arrsN3[i], arr) ){
                found = true;
                break;
            }
        }
        if (!found){
            arrsN3.push(arr);                  
            //console.log(arrsN3.length + ' arrangments found');
        }
    }
    return arrsN3;
}

export function searchArrangments_V1(squares) {
    //Principe: on place un carre fixe au centre de la zone de simulation puis on 
    //balaye la zone avec 2 autres carres (taille et rotation variables)
    const t0 = Date.now(); 
    //Liste des configurations N=3 trouvées  
    let arrsN3 = [
       /*{
           id: 0,
           V: [ 
               [0, 0, 0],
               [0, 0, 0],
               [0, 0, 0]
           ],
           I: [ 
               [0, 0, 0],
               [0, 0, 0],
               [0, 0, 0],
               [0, 0, 0]
           ],
       }*/
   ];
  
   //let squares = getInitSquares();

    let scanArea = {
        xmin: squares[0].box.xmin - squares[0].a/2,
        xmax: squares[0].box.xmax + squares[0].a/2,
        ymin: squares[0].box.ymin - squares[0].a/2,
        ymax: squares[0].box.ymax + squares[0].a/2
    };
    const step = 7;//squares[0].a/20;

    //scan zone
    const nx = parseInt((scanArea.xmax - scanArea.xmin)/step);
    const ny = parseInt((scanArea.ymax - scanArea.ymin)/step);
    const nxny = nx*ny;
    //const nx_half = Math.ceil(nx/2) + step;
    //const ny_half = Math.ceil(ny/2) + step;

    let x2, y2, x3, y3;

    const angles = [0, 5, 10, 20, 45, 50, 60, 70, 80, 85];//getAngles(45, 90);
    const sizes = [2.1, 10.2, 40.3, 60.7, 80.4, 100.5, 160.5];//getSizes(50, 150);

    const n_angles = angles.length;
    const n_size = sizes.length;

    let positionsTested = 0;
    let count = 0;

    for(let i0=0;i0<nx;i0++){
        x2 = scanArea.xmin + i0*step;
        for(let j0=0;j0<ny;j0++){
            y2 = scanArea.ymin + j0*step;
            count++;
            let delta_t = (Date.now() - t0)/(1000*60);
            console.log(100*count/nxny + '% : '+arrsN3.length + ' arrangments found in '+ delta_t + ' minutes');
            //drawPoint({x:x2,y:y2});
            //squares[1].moveTo({x:x2,y:y2}, false);
            for(let p=0;p<n_size;p++){
                //squares[1].changeSize(sizes[p], false);
                for(let k=0;k<n_angles;k++){                                                       
                    //squares[1].rotate(angles[k], true);
                    //let arr = arrangement_to_VI(squares);
                    //let n3 = arrsN3.length; 
                    //updateSVGSquare(squares[1],1);                      
                    //updateArrsN3(arr, arrsN3); 
                    squares[1].changeState({x:x2,y:y2}, sizes[p], angles[k]);   
                    for(let i1=i0;i1<nx;i1++){// i1=i0
                        x3 = scanArea.xmin + i1*step;
                        for(let j1=j0;j1<ny;j1++){// j1=j0
                            y3 = scanArea.ymin + j1*step;
                            //drawPoint({x:x3,y:y3});
                            //squares[2].moveTo({x:x3,y:y3}, false);   
                            for(let q=0;q<n_size;q++){                       
                                //squares[2].changeSize(sizes[q], false); 
                                for(let m=0;m<n_angles;m++){                                 
                                    //squares[2].rotate(angles[m], true);   
                                    squares[2].changeState({x:x3,y:y3}, sizes[q], angles[m]);                                                                                                              
                                    let arr = arrangement_to_VI(squares);
                                    let n3 = arrsN3.length; 
                                    updateArrsN3(arr, arrsN3);
                                    //updateSVGSquare(squares[1],1);  
                                    //updateSVGSquare(squares[2],2);      
                                    positionsTested++;                                                       
                                    //if ( arrsN3.length > n3 ){ 
                                        //updateSVGSquare(squares[1],1);  
                                        //updateSVGSquare(squares[2],2);      
                                        //console.log("xxxx");
                                    //}
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
    console.log(arrsN3.length + ' arrangments found in '+ delta_t + ' minutes');

    //Export result 
    console.log('Download result...');
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arrsN3));
    //let dlAnchorElem = document.getElementById('downloadAnchorElem');
    var downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    document.body.removeChild(downloadLink);
    downloadLink.setAttribute("href",dataStr);
    let fileName = "arrangments-found-"+Date.now()+".json";
    console.log(fileName);
    downloadLink.setAttribute("download",fileName);
    downloadLink.click();

    // 7562500 positionsTested
    // 783 arrangments found in 66.8529 minutes

    console.log('========= END =========');

}

var getScanArea = function(box){
    let scanArea = {};
    scanArea.xmin = box.xmin - 0.5*(box.xmax - box.xmin);
    scanArea.xmax = box.xmax + 0.5*(box.xmax - box.xmin);
    scanArea.ymin = box.ymin - 0.5*(box.ymax - box.ymin);
    scanArea.ymax = box.ymax + 0.5*(box.ymax - box.ymin);
    return scanArea;
}

//calculer la box de l'ensemble arrangmentsSelection[k][0] + arrangmentsSelection[k][1]
var getArrangementN2Box = function(arr){
    let box = {
        xmin: 9999, 
        xmax: -9999, 
        ymin: 9999,
        ymax: -9999
    };
    if ( arr[0].box.xmin < box.xmin ){
        box.xmin = arr[0].box.xmin;
    }
    if ( arr[1].box.xmin < box.xmin ){
        box.xmin = arr[1].box.xmin;
    }
    if ( arr[0].box.xmax > box.xmax ){
        box.xmax = arr[0].box.xmax;
    }
    if ( arr[1].box.xmax > box.xmax ){
        box.xmax = arr[1].box.xmax;
    }


    if ( arr[0].box.ymin < box.ymin ){
        box.ymin = arr[0].box.ymin;
    }
    if ( arr[1].box.ymin < box.ymin ){
        box.ymin = arr[1].box.ymin;
    }
    if ( arr[0].box.ymax > box.ymax ){
        box.ymax = arr[0].box.ymax;
    }
    if ( arr[1].box.ymax > box.ymax ){
        box.ymax = arr[1].box.ymax;
    }

    return box;
}


export function searchArrangments_V2(arrangmentsSelection) {
    //Liste des configurations N=3 trouvées  
    
    let arrsN3 = [];
   
    let scanArea = {
        xmin: 9999, 
        xmax: -9999, 
        ymin: 9999,
        ymax: -9999
    };
    let step = 10;//_squares[0].a/20;//1.52

    //scan zone
    //let nx_half = Math.ceil(nx/2) + step;
    //let ny_half = Math.ceil(ny/2) + step;

    let x3, y3;

    let angles = getAngles(10, 90);//must be an integer ! //2
    let n_angles = angles.length;

    let nbArr = arrangmentsSelection.length;
    let _squares = getInitSquares();

    let positionsTested= 0;

    for(let k=0;k<nbArr;k++){
        //2 static squares
        _squares[0].copy(arrangmentsSelection[k][0]);
        _squares[0].majBox();
        _squares[1].copy(arrangmentsSelection[k][1]);
        _squares[1].majBox();

        //moving square    
        _squares[2].initRotZero(100, {x:999,y:999});
        _squares[2].majBox();

        //Scan area around the squares 0 and 1 used to move square 2
        
        let arrBox = getArrangementN2Box(arrangmentsSelection[k]);  
        let scanArea = getScanArea(arrBox);

        let sizes = getSizes(10, (scanArea.xmax - scanArea.xmin) + 4*step); //2
        //sizes.push(1);
        let n_size = sizes.length;

        let nx = parseInt((scanArea.xmax - scanArea.xmin)/step);
        let ny = parseInt((scanArea.ymax - scanArea.ymin)/step);
        let count = 0;
        
        let total = nx*ny;
        for(let i=0;i<nx;i++){
            x3 = scanArea.xmin + i*step;
            count++;
            console.log(100*count/nx + '%');
            for(let j=0;j<ny;j++){
                y3 = scanArea.ymin + j*step;
                //drawPoint({x:x3,y:y3});
                _squares[2].initRotZero(100,{x:x3,y:y3});//a tester !!!!!!!!!!!!!!!!!!!!!
                for(let q=0;q<n_size;q++){                                          
                    _squares[2].changeSize(sizes[q], true);
                    for(let m=0;m<n_angles;m++){
                        _squares[2].rotate(angles[m], false);   
                        //updateSVGSquare(_squares[2],2);                                                                                                       
                        let arr = arrangement_to_VI(_squares);
                        let n3 = arrsN3.length;
                      
                        arrsN3 = updateArrsN3(arr, arrsN3);
                        positionsTested++;
                        // if ( arrsN3.length > n3 ){ 
                        //     updateSVGSquare(_squares[2],2);
                        //     debugger;
                        //     //console.log("xxxx");
                        // }
                    }
                }
            }
        }
        let n3 = arrsN3.length; 
        console.log('arrangmentsSelection '+k + ': found '+n3);
    }
    console.log(positionsTested + ' positionsTested');
    console.log(arrsN3.length + ' arrangments found');//71, 149
    console.log('========= END =========');
}