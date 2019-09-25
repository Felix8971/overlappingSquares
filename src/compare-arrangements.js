

(function(exports){
    /*
    Convention notation:
    V = [ 
        [ V[0][0], V[0][1], V[0][2] ], 
        [ V[1][0], V[1][1], V[1][2] ], 
        [ V[2][0], V[2][1], V[2][2] ] 
        ];
    */
   
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

    exports.areEqual = areEqual;
    //Calcul determinant d'une matrice 3x3 (simplifié car V[i][i] = 0 )
    var det33 = function(V){
        // return V[0][0] * V[1][1] * V[2][2] 
        //      + V[0][1] * V[1][2] * V[2][0]
        //      + V[0][2] * V[1][0] * V[2][1] 
        //      - V[1][1] * V[2][0] * V[0][2] 
        //      - V[0][0] * V[2][1] * V[1][2] 
        //      - V[2][2] * V[1][0] * V[0][1];
        return  V[0][1] * V[1][2] * V[2][0]+ V[0][2] * V[1][0] * V[2][1];
    }
    exports.det33 = det33;

    //Return the 6 equivalent forms for V matrix
    //we also give the I matrice (but only only one form per V matrice for the moment)
    var getEquivalent_VI_List = function(V, I) {
        //Calcul des matrices V equivalentes à V0
        // let a = V[0][1]; let b = V[1][0];let c = V[0][2];let d = V[2][0]; let e = V[1][2]; let f = V[2][1];
        // let g = I[0][0];let h = I[1][0];let i = I[2][0];let j = I[3][0];
        // let k = I[0][1];let l = I[1][1];let m = I[2][1];let n = I[3][1];
        // let o = I[0][2];let p = I[1][2];let q = I[2][2];let r = I[3][2];
        //let V0 = [ [ 0, a, c ], [ b, 0, e ], [ d, f, 0 ] ];//012
        //let V1 = [ [ 0, b, e], [ a, 0, c ], [ f, d, 0 ] ];//102
        //let V2 = [ [ 0, c, a], [ d, 0, f ], [ b, e, 0] ];//021
        //let V3 = [ [ 0, e, b], [ f, 0, d ], [ a, c, 0 ] ];//120
        //let V4 = [ [ 0, f, d ], [ e, 0, b ], [ c, a, 0 ] ];//210
        //let V5 = [ [ 0, d, f ], [ c, 0, a ], [ e, b, 0 ] ];//201

        return [
            { 
                V: [ [ 0, V[0][1], V[0][2] ], [ V[1][0], 0, V[1][2] ], [ V[2][0], V[2][1], 0 ] ],//V0, 
                I: [
                    [I[0][0], I[0][1], I[0][2]],
                    [I[1][0], I[1][1], I[1][2]],
                    [I[2][0], I[2][1], I[2][2]],
                    [I[3][0], I[3][1], I[3][2]], 
                ],
            },
            { 
                V: [ [ 0, V[1][0], V[1][2]], [ V[0][1], 0, V[0][2] ], [ V[2][1], V[2][0], 0 ] ],//V1, 
                I: [
                    [I[0][1], I[0][0], I[0][2]],
                    [I[1][1], I[1][0], I[1][2]],
                    [I[2][1], I[2][0], I[2][2]],
                    [I[3][1], I[3][0], I[3][2]], 
                ],
            },
            { 
                V: [ [ 0, V[0][2], V[0][1]], [ V[2][0], 0, V[2][1] ], [ V[1][0], V[1][2], 0] ],//V2, 
                I: [
                    [I[0][0], I[0][2], I[0][1]],
                    [I[1][0], I[1][2], I[1][1]],
                    [I[2][0], I[2][2], I[2][1]],
                    [I[3][0], I[3][2], I[3][1]],
                ], 
            },
            { 
                V: [ [ 0, V[1][2], V[1][0]], [ V[2][1], 0, V[2][0] ], [ V[0][1], V[0][2], 0 ] ],//V3,
                I: [
                    [I[0][1], I[0][2], I[0][0]],
                    [I[1][1], I[1][2], I[1][0]],
                    [I[2][1], I[2][2], I[2][0]],
                    [I[3][1], I[3][2], I[3][0]], 
                ],
            },
            { 
                V: [ [ 0, V[2][1], V[2][0] ], [ V[1][2], 0, V[1][0] ], [ V[0][2], V[0][1], 0 ] ],//V4, 
                I: [
                    [I[0][2], I[0][1], I[0][0]],
                    [I[1][2], I[1][1], I[1][0]],
                    [I[2][2], I[2][1], I[2][0]],
                    [I[3][2], I[3][1], I[3][0]], 
                ],
            },
            { 
                V: [ [ 0, V[2][0], V[2][1] ], [ V[0][2], 0, V[0][1] ], [ V[1][2], V[1][0], 0 ] ],//V5, 
                I:  [
                    [I[0][2], I[0][0], I[0][1]],
                    [I[1][2], I[1][0], I[1][1]],
                    [I[2][2], I[2][0], I[2][1]],
                    [I[3][2], I[3][0], I[3][1]], 
                ],
            },
        ];

        // return [
        //     { 
        //         V: [ [ 0, a, c ], [ b, 0, e ], [ d, f, 0 ] ],//V0, 
        //         I:  [ [g, k, o], [h, l, p], [i, m, q], [j, n, r],],  
        //     },
        //     { 
        //         V: [ [ 0, b, e], [ a, 0, c ], [ f, d, 0 ] ],//V1, 
        //         I:  [ [k, g, o], [l, h, p], [m, i, q], ],
        //     },
        //     { 
        //         V: [ [ 0, c, a], [ d, 0, f ], [ b, e, 0] ],//V2, 
        //         I:  [ [g, o, k], [h, p, l],  [i, q, m],  [j, r, n],], 
        //     },
        //     { 
        //         V: [ [ 0, e, b], [ f, 0, d ], [ a, c, 0 ] ],//V3,
        //         I:  [[k, o, g],[l, p, h],[m, q, i], [n, r, j], ],
        //     },
        //     { 
        //         V: [ [ 0, f, d ], [ e, 0, b ], [ c, a, 0 ] ],//V4, 
        //         I:  [ [o, k, g],[p, l, h], [q, m, i], [r, n, j], ],
        //     },
        //     { 
        //         V: [ [ 0, d, f ], [ c, 0, a ], [ e, b, 0 ] ],//V5, 
        //         I:  [[o, g, k],[p, h, l], [q, i, m], [r, j, n], ],
        //     },
        // ];
    }
    exports.getEquivalent_VI_List = getEquivalent_VI_List; 

    //Fonction qui permute circulairement une colonne k de I d'un cran
    //<=> on prend l'element en bas de la colonne et on le met en haut
    let permuteInColumn = function(I, k) {
        const a3 = I[3][k];//pivot
        I[3][k] = I[2][k];
        I[2][k] = I[1][k];
        I[1][k] = I[0][k];
        I[0][k] = a3;
    }
    exports.permuteInColumn = permuteInColumn; 

    //Return  the 128 equivalent for for I (circular permutations + mirror images)
    var getEquivalent_I_List =  function(I) {
        let equivalent_I_List = [];
        
        //4 permutations possibles per colum + mirror images
        for (let i=0;i<4;i++){
            permuteInColumn(I, 0);
            for (let j=0;j<4;j++){
                permuteInColumn(I, 1);
                for (let k=0;k<4;k++){
                    permuteInColumn(I, 2);
                    equivalent_I_List.push([
                        [I[0][0], I[0][1], I[0][2]],
                        [I[1][0], I[1][1], I[1][2]],
                        [I[2][0], I[2][1], I[2][2]],
                        [I[3][0], I[3][1], I[3][2]],
                    ]);
                    //mirror images of I
                    equivalent_I_List.push([
                        [I[3][0], I[3][1], I[3][2]],
                        [I[2][0], I[2][1], I[2][2]],
                        [I[1][0], I[1][1], I[1][2]],
                        [I[0][0], I[0][1], I[0][2]],
                    ]);
                }
            }
        }
        return equivalent_I_List;
    }
    exports.getEquivalent_I_List = getEquivalent_I_List; 

    //Determine si une couple de matrice (V0, I0) est equivalent à un autre couple (V1, I1)
    //c'est à dire correspond à la meme configuration
    exports.are_VI_Equivalents = function(arr0, arr1, sumOnColumn) {
        //Tester l'egalité stricte pour V0 == V1 et I0 == I1
        //On va souvent comparer des conf sctrictement egales lors du balayage donc
        //autant tester directement l'egalité stricte en premier
        if ( areEqual(arr0.V, arr1.V) && areEqual(arr0.I, arr1.I) ){
            //console.log('Equivalentes !');
            return true;
        }
        
        //compare determinant V0 & V1
        if ( det33(arr0.V) != det33(arr1.V) ) {
            //console.log('non equivalentes');
            return false;
        }

        //Vient le vrai test d'equivalence 
        //Pour comparer {V0, I0 } et {V1, I1 }
        const equivalentListVI0 = getEquivalent_VI_List(arr0.V, arr0.I);

        for (let i=0;i<6;i++){
            if ( areEqual(arr1.V, equivalentListVI0[i].V) ){
                //boucler sur toutes les permutations circulaires intracolonne possibles sur I 
                //on a 4*4*4*2 = 128 cas à tester
                //on calcule les 128 formes equivalentes de I
                //puis on regarde si arr1.I est dedans
                
                //let equivalentListI0 = getEquivalent_I_List(equivalentListVI0[i].I); 
                let I = equivalentListVI0[i].I;
                for (let j=0;j<4;j++){
                    permuteInColumn(I, 0);
                    for (let k=0;k<4;k++){
                        permuteInColumn(I, 1);
                        for (let l=0;l<4;l++){
                            permuteInColumn(I, 2);
                            if ( areEqual(arr1.I, [
                                [I[0][0], I[0][1], I[0][2]],
                                [I[1][0], I[1][1], I[1][2]],
                                [I[2][0], I[2][1], I[2][2]],
                                [I[3][0], I[3][1], I[3][2]],
                            ]) ){
                                return true;
                            }
                           
                            //mirror images of I
                            if ( areEqual(arr1.I, [
                                [I[3][0], I[3][1], I[3][2]],
                                [I[2][0], I[2][1], I[2][2]],
                                [I[1][0], I[1][1], I[1][2]],
                                [I[0][0], I[0][1], I[0][2]],
                            ]) ){
                                return true;
                            }                           
                        }
                    }
                }  

                // for (let j=0;j < 128;j++){
                //     if ( areEqual(arr1.I, equivalentListI0[j]) ){
                //         return true;
                //     }
                // }
            }
        }
        //console.log('non equivalentes');
        return false;
    }
}(typeof exports === 'undefined' ? this.compareArrangments = {} : exports));