import { MIN, MAX, W, H, NB_SQUARE, NB_VERTEX, COS, SIN } from './constants.mjs';
//init simulation's squares

export function getInitSquares(){ 
    let _squares = [];
    for (let i=0;i<NB_SQUARE;i++) {
        _squares.push({
            a: 0,//edge length
            center: { x: 0, y: 0},//c'est lui qu'on va deplacer
            angle: 0,// angle de rotation par rapport à l'horizontal 
            vertex:[ 
                { x: 0, y: 0},//point 2d
                { x: 0, y: 0},
                { x: 0, y: 0},
                { x: 0, y: 0},
            ],
            box: {xmin: 0, xmax: 0, ymin:0, ymax:0}, //sera utile pour optimiser les calculs d'intersection
            boxEdge: [// boite englobante de chaque segment du carre
                {xmin: 0, xmax: 0, ymin:0, ymax:0},
                {xmin: 0, xmax: 0, ymin:0, ymax:0},
                {xmin: 0, xmax: 0, ymin:0, ymax:0},
                {xmin: 0, xmax: 0, ymin:0, ymax:0},
            ],
            //Methods
            majBox: function() {
                this.box.xmin = this.box.ymin = MAX;
                this.box.xmax = this.box.ymax = MIN;
                for (let i=0;i<NB_VERTEX;i++){
                    if ( this.vertex[i].x < this.box.xmin ){
                        this.box.xmin = this.vertex[i].x;
                    }
                    if ( this.vertex[i].y < this.box.ymin ){
                        this.box.ymin = this.vertex[i].y;
                    }
                    if ( this.vertex[i].x > this.box.xmax ){
                        this.box.xmax = this.vertex[i].x;
                    }
                    if ( this.vertex[i].y > this.box.ymax ){
                        this.box.ymax = this.vertex[i].y;
                    }
                }
                this.majBoxEdge();
            },
            majBoxEdge: function() { //a tester
                //box segment 0 : [0,1]
                if ( this.vertex[0].x > this.vertex[1].x ){
                    this.boxEdge[0].xmax = this.vertex[0].x;
                    this.boxEdge[0].xmin = this.vertex[1].x;
                } else {
                    this.boxEdge[0].xmin = this.vertex[0].x;
                    this.boxEdge[0].xmax = this.vertex[1].x;
                }
                if ( this.vertex[0].y > this.vertex[1].y ){
                    this.boxEdge[0].ymax = this.vertex[0].y;
                    this.boxEdge[0].ymin = this.vertex[1].y;
                } else {
                    this.boxEdge[0].ymin = this.vertex[0].y;
                    this.boxEdge[0].ymax = this.vertex[1].y;
                }
                //translation to get box segment [2,3]
                this.boxEdge[2].xmin = this.boxEdge[0].xmin + (this.vertex[2].x - this.vertex[1].x)
                this.boxEdge[2].ymin = this.boxEdge[0].ymin + (this.vertex[2].y - this.vertex[1].y)
                this.boxEdge[2].xmax = this.boxEdge[0].xmax + (this.vertex[2].x - this.vertex[1].x)
                this.boxEdge[2].ymax = this.boxEdge[0].ymax + (this.vertex[2].y - this.vertex[1].y)
                
                //box segment [1,2]
                if ( this.vertex[1].x > this.vertex[2].x ){
                    this.boxEdge[1].xmax = this.vertex[1].x;
                    this.boxEdge[1].xmin = this.vertex[2].x;
                } else {
                    this.boxEdge[1].xmin = this.vertex[1].x;
                    this.boxEdge[1].xmax = this.vertex[2].x;
                }
                if ( this.vertex[1].y > this.vertex[2].y ){
                    this.boxEdge[1].ymax = this.vertex[1].y;
                    this.boxEdge[1].ymin = this.vertex[2].y;
                } else {
                    this.boxEdge[1].ymin = this.vertex[1].y;
                    this.boxEdge[1].ymax = this.vertex[2].y;
                }
                //translation to get box segment [3,0]
                this.boxEdge[3].xmin = this.boxEdge[1].xmin + (this.vertex[0].x - this.vertex[1].x)
                this.boxEdge[3].ymin = this.boxEdge[1].ymin + (this.vertex[0].y - this.vertex[1].y)
                this.boxEdge[3].xmax = this.boxEdge[1].xmax + (this.vertex[0].x - this.vertex[1].x)
                this.boxEdge[3].ymax = this.boxEdge[1].ymax + (this.vertex[0].y - this.vertex[1].y)
            },
            //calcul vertices en fct de a et de "center" pour rotation = 0
            initRotZero: function (a, center) {
                this.a = a;
                this.moveTo(center, false);
                // this.angle = 0;
                // this.center.x = center.x;
                // this.center.y = center.y;
                // let half_a = 0.5 * this.a;
                // //this.vertex = [{},{},{},{}];
                // this.vertex[0].x = this.vertex[3].x = this.center.x - half_a;
                // this.vertex[0].y = this.vertex[1].y  = this.center.y - half_a;
                // this.vertex[1].x = this.vertex[2].x = this.center.x + half_a;
                // this.vertex[2].y = this.vertex[3].y  = this.center.y + half_a;
            },
            //move the square and rotate it to the initial position (this.angle = 0)
            moveTo: function (M, majBox) {
                this.angle = 0;
                this.center.x = M.x;  
                this.center.y = M.y;
                let half_a = 0.5 * this.a;
                this.vertex[0].x = this.vertex[3].x = this.center.x - half_a;
                this.vertex[0].y = this.vertex[1].y  = this.center.y - half_a;
                this.vertex[1].x = this.vertex[2].x = this.center.x + half_a;
                this.vertex[2].y = this.vertex[3].y  = this.center.y + half_a;
                majBox && this.majBox();// translater les box plutot que de recalculer!?
            },
            translate: function (u, majBox) {
                this.center.x += u.x;  
                this.center.y += u.y;  
                for (let i=0;i<NB_VERTEX;i++){
                    this.vertex[i].x += u.x;  
                    this.vertex[i].y += u.y;  
                }
                majBox && this.majBox();//translater les box plutot que de recalculer!?
            },
            rotate: function (angle, majBox) {// angle must be an integer in degres!
                angle = angle < 0 ? 180*100 + angle : angle;
                angle = angle - parseInt(angle/90)*90;
                this.initRotZero(this.a, this.center);// angle zero                
                for (let i=0;i<NB_VERTEX;i++){ //rotation to angle
                    let vx = this.vertex[i].x;
                    let vy = this.vertex[i].y;
                    this.vertex[i].x = this.center.x + (vx  - this.center.x)*COS[angle] - (vy  - this.center.y)*SIN[angle]
                    this.vertex[i].y = this.center.y + (vx  - this.center.x)*SIN[angle] + (vy  - this.center.y)*COS[angle]
                }
                this.angle = angle;
                majBox && this.majBox();
            },
            //will work whatever the rotation angle 
            changeSize: function (a, majBox) {
                if ( a > 0 ){
                    for (let i=0;i<NB_VERTEX;i++){
                        this.vertex[i].x = this.center.x + (a/this.a)*(this.vertex[i].x - this.center.x);  
                        this.vertex[i].y = this.center.y + (a/this.a)*(this.vertex[i].y - this.center.y);  
                    }
                    this.a = a;
                    majBox && this.majBox();
                }
            },
            copy: function (square) {
                this.a = square.a;//edge length
                this.center.x = square.center.x;
                this.center.y = square.center.y;
                this.angle = square.angle; 
                for (let i=0;i<NB_VERTEX;i++){
                    this.vertex[i].x += square.vertex[i].x;  
                    this.vertex[i].y += square.vertex[i].y;  
                }
                this.box.xmin = square.box.xmin;
                this.box.xmax = square.box.xmax;
                this.box.ymin = square.box.ymin;
                this.box.ymax = square.box.ymax;
            }
        });
    }
    return _squares;
}

