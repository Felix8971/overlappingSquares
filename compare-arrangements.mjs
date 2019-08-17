import { NB_SQUARE } from './constants.mjs';
  

//Fonction qui determine si 2 matrices de meme dimension sont strictement egales (works for V or I)
var areEqual = function( V0, V1){
  let nbLine = V0.length;
  let nbCol = V0[0].length;
  for (let i=0;i<nbLine;i++){
      for (let j=0;j<nbCol;j++){
          if ( V0[i][j] != V1[i][j] ){
              return false;
          }
      }
  }
  return true;
}

// //Fait la somme de tous les elements de la colonne j sur la matrice M
var sumOnColumn = function(M, j) {//ok
  const nbLine = M.length;
  let sum = 0;
  for (let i=0;i<nbLine;i++){ 
    sum += M[i][j];
  }
  return sum;
}

//Calcul determinant d'une matrice 3x3
var Det33 = function(V){//ok
    return V[0][0] * V[1][1] * V[2][2] 
         + V[0][1] * V[1][2] * V[2][0]
         + V[0][2] * V[1][0] * V[2][1] 
         - V[1][1] * V[2][0] * V[0][2] 
         - V[0][0] * V[2][1] * V[1][2] 
         - V[2][2] * V[1][0] * V[0][1];
}

function arraysEqual(a1, a2) {//ok
    if(a1.length !== a2.length)
        return false;
    for(var i = a1.length; i--;) {
        if(a1[i] !== a2[i])
            return false;
    }
    return true;
}

/*
Convention notation:
V = [ 
      [ V[0][0], V[0][1], V[0][2] ], 
      [ V[1][0], V[1][1], V[1][2] ], 
      [ V[2][0], V[2][1], V[2][2] ] 
    ];
*/

//Retourne les 6 formes equivalentes d'une matrice V0
// à tester avec a = 1, b = 2, c = 3, etc.
var getEquivalent_V = function(V0) {//ok
    
    //Calcul des matrices V equivalentes à V0
    let a = V0[0][1]; let b = V0[1][0]; 
    let c = V0[0][2]; let d = V0[2][0]; 
    let e = V0[1][2]; let f = V0[2][1];

    //let V0 = [ [ 0, a, c ], [ b, 0, e ], [ d, f, 0 ] ];//012
    //let V1 = [ [ 0, b, e], [ a, 0, c ], [ f, d, 0 ] ];//102
    //let V2 = [ [ 0, c, a], [ d, 0, f ], [ b, e, 0] ];//021
    //let V3 = [ [ 0, e, b], [ f, 0, d ], [ a, c, 0 ] ];//120
    //let V4 = [ [ 0, f, d ], [ e, 0, b ], [ c, a, 0 ] ];//210
    //let V5 = [ [ 0, d, f ], [ c, 0, a ], [ e, b, 0 ] ];//201

    return [
        { 
            matrix: [ [ 0, a, c ], [ b, 0, e ], [ d, f, 0 ] ],//V0, 
            permutation: [0,1,2] 
        },
        { 
            matrix: [ [ 0, b, e], [ a, 0, c ], [ f, d, 0 ] ],//V1, 
            permutation: [1,0,2] 
        },
        { 
            matrix: [ [ 0, c, a], [ d, 0, f ], [ b, e, 0] ],//V2, 
            permutation: [0,2,1] 
        },
        { 
            matrix: [ [ 0, e, b], [ f, 0, d ], [ a, c, 0 ] ],//V3,
            permutation: [1,2,0] 
        },
        { 
            matrix: [ [ 0, f, d ], [ e, 0, b ], [ c, a, 0 ] ],//V4, 
            permutation: [2,1,0] 
        },
        { 
            matrix: [ [ 0, d, f ], [ c, 0, a ], [ e, b, 0 ] ],//V5, 
            permutation: [2,0,1] 
        },
    ];
}

//Retourne les 6 formes equivalentes d'une matrice V0
// à tester avec a = 1, b = 2, c = 3, etc.
var getEquivalent_VI_List = function(V, I) {
    //Calcul des matrices V equivalentes à V0
    let a = V[0][1]; let b = V[1][0];
    let c = V[0][2]; let d = V[2][0]; 
    let e = V[1][2]; let f = V[2][1];

    let g = I[0][0];
    let h = I[1][0];
    let i = I[2][0];
    let j = I[3][0];

    let k = I[0][1];
    let l = I[1][1];
    let m = I[2][1];
    let n = I[3][1];

    let o = I[0][2];
    let p = I[1][2];
    let q = I[2][2];
    let r = I[3][2];

    //let V0 = [ [ 0, a, c ], [ b, 0, e ], [ d, f, 0 ] ];//012
    //let V1 = [ [ 0, b, e], [ a, 0, c ], [ f, d, 0 ] ];//102
    //let V2 = [ [ 0, c, a], [ d, 0, f ], [ b, e, 0] ];//021
    //let V3 = [ [ 0, e, b], [ f, 0, d ], [ a, c, 0 ] ];//120
    //let V4 = [ [ 0, f, d ], [ e, 0, b ], [ c, a, 0 ] ];//210
    //let V5 = [ [ 0, d, f ], [ c, 0, a ], [ e, b, 0 ] ];//201

    return [
        { 
            V: [ [ 0, a, c ], [ b, 0, e ], [ d, f, 0 ] ],//V0, 
            I:  [
                [g, k, o],
                [h, l, p],
                [i, m, q],
                [j, n, r], 
            ],
        },
        { 
            V: [ [ 0, b, e], [ a, 0, c ], [ f, d, 0 ] ],//V1, 
            I:  [
                [k, g, o],
                [l, h, p],
                [m, i, q],
                [n, j, r], 
            ],
        },
        { 
            V: [ [ 0, c, a], [ d, 0, f ], [ b, e, 0] ],//V2, 
            I:  [
                [g, o, k],
                [h, p, l],
                [i, q, m],
                [j, r, n],
            ], 
        },
        { 
            V: [ [ 0, e, b], [ f, 0, d ], [ a, c, 0 ] ],//V3,
            I:  [
                [k, o, g],
                [l, p, h],
                [m, q, i],
                [n, r, j], 
            ],
        },
        { 
            V: [ [ 0, f, d ], [ e, 0, b ], [ c, a, 0 ] ],//V4, 
            I:  [
                [o, k, g],
                [p, l, h],
                [q, m, i],
                [r, n, j], 
            ],
        },
        { 
            V: [ [ 0, d, f ], [ c, 0, a ], [ e, b, 0 ] ],//V5, 
            I:  [
                [o, g, k],
                [p, h, l],
                [q, i, m],
                [r, j, n], 
            ],
        },
    ];
}

//ecrire une fonction qui renvoit les 64 formes equivalentes de I
export function getEquivalent_I_List(I) {
    let equivalent_I_List = [];
    //ecrire une fonction qui permute circulairement une colonne de I d'un cran vers le bas
    let permuteInColumn = function(k) {
        //pivots
        let a0 = I[0][k];
        let a1 = I[1][k];
        let a2 = I[2][k];
        let a3 = I[3][k];
        //permutation circulaire
        I[0][k] = a3;
        I[1][k] = a0;
        I[2][k] = a1;
        I[3][k] = a2;
    }

    for (let i=0;i<4;i++){
        permuteInColumn(0);
        for (let j=0;j<4;j++){
            permuteInColumn(1);
            for (let k=0;k<4;k++){
                permuteInColumn(2);
                equivalent_I_List.push([
                    [I[0][0], I[0][1], I[0][2]],
                    [I[1][0], I[1][1], I[1][2]],
                    [I[2][0], I[2][1], I[2][2]],
                    [I[3][0], I[3][1], I[3][2]],
                ]);
            }
        }
    }

    return equivalent_I_List;

}

//Determine si V1 est dans la liste des matrices equivalentes de V0
//Si oui on retourne la permutation de la forme equivalent par rapport à V0 
//sinon on retourne false
var are_V_Equivalent = function(V0, V1){
    let EquivalentsList = getEquivalent_V(V0);
    //console.log("EquivalentsList V1:",EquivalentsList);
    for (var elem in EquivalentsList) {
        //console.log(EquivalentsList[elem]);
        if ( areEqual(V1, EquivalentsList[elem].matrix) ){
            return EquivalentsList[elem].permutation;
        }
    }
    return false;
}

//Determine si une couple de matrice (V0, I0) est equivalent à un autre couple (V1, I1)
//c'est à dire correspond à la meme configuration


// à corriger: 
export function are_VI_Equivalents(arr0, arr1) {
    //Tester l'egalité stricte pour V0 == V1 et I0 == I1
    //On va le plus souvent comparer des conf sctrictement egales lors du balayage donc
    //autant tester directement l'egalité stricte en premier
    // let V0 = arr0.V;
    // let V1 = arr1.V;
    // let I0 = arr0.I;
    // let I1 = arr1.I;
    
    if ( areEqual(arr0.V, arr1.V) && areEqual(arr0.I, arr1.I) ){
        //console.log('Equivalentes !');
        return true;
    }
    
    //comparer determinant de V0 et V1
    if ( Det33(arr0.V) != Det33(arr1.V) ) {
        //console.log('non equivalentes');
        return false;
    }

    //Vient le vrai test d'equivalence 
    //Pour comparer {V0, I0 } et {V1, I1 }
    const equivalentListV0 = getEquivalent_VI_List(arr0.V, arr0.I);
    for (let i=0;i < 6;i++){
        if ( areEqual(arr1.V, equivalentListV0[i].V) ){
            //boucler sur toutes les permutations circulaires intracolonne possibles sur I 
            //on a 4*4*4= 64 cas à tester
            //ecrire une fonction qui renvoit les 64 formes equivalentes de F
            //puis voir si arr1.I est dedans
            let equivalentListI0 = getEquivalent_I_List(equivalentListV0[i].I);
            debugger;
            for (let j=0;j < 64;j++){         
                if ( areEqual(arr1.I, equivalentListI0[j]) ){
                    return true;
                }
            }
        }
    }

    //console.log('non equivalentes');
    return false;
    
    // let permutation = are_V_Equivalent(arr0.V, arr1.V);
    // if ( permutation ){//on a trouvé V1 parmis les formes equivalents de V0
    //     //console.log(permutation);
    //     let per = permutation; //permutation à remettre sous la forme en [0,1,2]
        
    //     //let cloneI0 = [...(arr10.I)];//pb !
    //     //let cloneI0 = Object.assign({}, arr0.I);//pb !
    //     let cloneI0 = [
    //         [arr0.I[0][0],arr0.I[0][1],arr0.I[0][2]],
    //         [arr0.I[1][0],arr0.I[1][1],arr0.I[1][2]],
    //         [arr0.I[2][0],arr0.I[2][1],arr0.I[2][2]],
    //         [arr0.I[3][0],arr0.I[3][1],arr0.I[3][2]], 
    //     ];

    //     //Permute les colonnes de I0 selon la permutation de I1 (variable per)
    //     for (let line=0;line< 4;line++){
    //         let pivot = [];
    //         pivot[0] = cloneI0[line][0];
    //         pivot[1] = cloneI0[line][1];
    //         pivot[2] = cloneI0[line][2];
    //         cloneI0[line][0] = pivot[per[0]];
    //         cloneI0[line][1] = pivot[per[1]];
    //         cloneI0[line][2] = pivot[per[2]];
    //     }
    //     //Puis regarder si les permutations circulaires sur les colonnes de cloneI1 peuvent donner I0
    //     //const NB_SQUARE = 3;
    //     //const NB_VERTEX = 4;
        
    //     for (let col=0;col<NB_SQUARE;col++){
    //         let cloneI0_col = [ cloneI0[0][col], cloneI0[1][col], cloneI0[2][col], cloneI0[3][col] ];
    //         let I1_col = [ arr1.I[0][col], arr1.I[1][col], arr1.I[2][col], arr1.I[3][col] ];
    //         let found = false;

    //         if ( arraysEqual(cloneI0_col, I1_col ) ){
    //             found = true;
    //         } else {
    //             for (let i=0; i < cloneI0_col.length - 1;i++){
    //                 let a3 = cloneI0_col[3];
    //                 cloneI0_col.pop();// Remove an item from the end of the array
    //                 cloneI0_col.unshift(a3);//Add a3 to the beginning of the array.
    //                 if ( arraysEqual(cloneI0_col, I1_col )  ){
    //                     found = true;
    //                 }
    //                 //console.log(cloneI0_col);
    //             } 
    //         }
    //         if ( !found ) {
    //             //console.log('non equivalentes');
    //             return false;
    //         }
    //     }
    //     //console.log('Equivalentes !'); 
    //     return true; 
    // } else {
    //     //console.log('non equivalentes');
    //     return false;
    // }   
    //Et les comparer à V1
    //Si une egalité est trouvée avec Vi
        //Permuter les colonnes de I1 en 
        //respectant l'ordre de Vi.
        //Si I0 <=> I1 (permutations circulaires...)
        //Alors {V0, I0 } et {V1, I1 } sont des
        //arrangements equivalents.     
    //sinon {V0, I0 } != {V1, I1 }

}