export const MIN = -999999;
export const MAX = 999999;
export const W = 500;
export const H = 398;
export const NB_SQUARE = 3;
export const NB_VERTEX = 4;//nb vertex per square

//Pre-calculate all the sinus and cosinus to save computational time
const _COS = [];
const _SIN = [];
for(let i=0;i<=90;i++){
    _COS[i] = Math.cos(i*Math.PI/180);
    _SIN[i] = Math.sin(i*Math.PI/180);
}
export const COS = _COS;
export const SIN = _SIN;