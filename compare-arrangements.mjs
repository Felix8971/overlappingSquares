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

//Determine si V1 est dans la liste des matrices equivalentes de V0
//Si oui on retourne la permutation correspondante par rapport à V0 (qui va servir à calculer I1)
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

    //idee: faire la somme de tous les elements des matrices V0 et V1
    //si pas egales alors return false

    //sinon
    //faire la somme de tous les elements des matrices I0 et I1
    //si pas egales alors return false     
    //sinon

    //comparer les matrices I (test preliminaire rapid avant test de permutation circulaire)
    //pour I0
    //faire somme elements colonne 0: s00
    // const s00 = sumOnColumn(arr0.I, 0);
    // //faire somme elements colonne 1: s01
    // const s01 = sumOnColumn(arr0.I, 1);
    // //faire somme elements colonne 2  s02
    // const s02 = sumOnColumn(arr0.I, 2);

    // let s0 = [
    //     sumOnColumn(arr0.I, 0), 
    //     sumOnColumn(arr0.I, 1),  
    //     sumOnColumn(arr0.I, 2)
    // ];

    //pour I1
    //faire somme element colonne 0: s10
    // const s10 = sumOnColumn(arr1.I, 0);
    // //faire somme element colonne 1: s11
    // const s11 = sumOnColumn(arr1.I, 1);
    // //faire somme element colonne 2  s12
    // const s12 = sumOnColumn(arr1.I, 2);

    // let s1 = [
    //     sumOnColumn(arr1.I, 0), 
    //     sumOnColumn(arr1.I, 1), 
    //     sumOnColumn(arr1.I, 2)
    // ];

    // //descending sort
    // s0.sort((a, b) => b - a); 
    // s1.sort((a, b) => b - a); 

    // for (let i=0;i<3;i++){
    //     if ( s0[i] != s1[i] ) {
    //         //console.log('non equivalentes'); 
    //         return false;
    //     }    
    // }
    
    //Le vrai test d'equivalence 
    //Pour comparer {V0, I0 } et {V1, I1 }
    let permutation = are_V_Equivalent(arr0.V, arr1.V);
    if ( permutation ){//on a trouvé V1 parmis les formes equivalents de V0
        //console.log(permutation);
        let per = permutation; //permutation à remettre sous la forme en [0,1,2]
        //permuter les colonnes de I1 (qui est en per) selon la permutation de I0 [0,1,2]
        const cloneI1 = [...arr1.I];
        for (let line=0;line< 4;line++){
            let pivot = [];
            pivot[0] = cloneI1[line][0];
            pivot[1] = cloneI1[line][1];
            pivot[2] = cloneI1[line][2];
            cloneI1[line][0] = pivot[per[0]]; 
            cloneI1[line][1] = pivot[per[1]]; 
            cloneI1[line][2] = pivot[per[2]];
        }
        //Puis regarder si les permutations circulaires sur les colonnes de cloneI1 peuvent donner I0
        //const NB_SQUARE = 3;
        //const NB_VERTEX = 4;
        
        for (let col=0;col<NB_SQUARE;col++){
            let cloneI1_col = [ cloneI1[0][col], cloneI1[1][col], cloneI1[2][col], cloneI1[3][col] ];
            let I0_col = [ cloneI1[0][col], cloneI1[1][col], cloneI1[2][col], cloneI1[3][col] ];
            let found = false;
            for (let i=0; i<cloneI1_col.length;i++){
                let a3 = cloneI1_col[3];
                cloneI1_col.pop();
                cloneI1_col.unshift(a3);
                if ( arraysEqual(cloneI1_col, I0_col )  ){
                    found = true;
                }
                //console.log(cloneI1_col);
            } 
            if ( !found ) {
                //console.log('non equivalentes');
                return false;
            }
        }
        //console.log('Equivalentes !'); 
        return true; 
    } else {
        //console.log('non equivalentes');
        return false;
    }   
    //Et les comparer à V1
    //Si une egalité est trouvée avec Vi
        //Permuter les colonnes de I1 en 
        //respectant l'ordre de Vi.
        //Si I0 <=> I1 (permutations circulaires...)
        //Alors {V0, I0 } et {V1, I1 } sont des
        //arrangements equivalents.     
    //sinon {V0, I0 } != {V1, I1 }

    /*a = [1,2,3,4];
    for (let i=0; i<a.length;i++){
        a3 = a[3];
        a.pop();
        a.unshift(a3);
        console.log(a);
    } */
}