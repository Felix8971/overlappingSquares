exports.MIN = -999999;
exports.MAX = 999999;
exports.W = 500;
exports.H = 398;
exports.NB_SQUARE = 3;
exports.NB_VERTEX = 4;//nb vertex per square

//Pre-calculate all the sinus and cosinus to save computational time
const _COS = [];
const _SIN = [];
for(let i=0;i<=90;i++){
    _COS[i] = Math.cos(i*Math.PI/180);
    _SIN[i] = Math.sin(i*Math.PI/180);
}
exports.COS = _COS;
exports.SIN = _SIN;