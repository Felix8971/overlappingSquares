
const nameSpaceURI = "http://www.w3.org/2000/svg";
const squareStyle = [
    "stroke:blue; stroke-width:0.5;fill-opacity:0;",
    "stroke:green;stroke-width:0.5;fill-opacity:0;",
    "stroke:red;  stroke-width:0.5;fill-opacity:0;",
]
const txtStyle = [
    "stroke:blue;",
    "stroke:green;",
    "stroke:red;",
]
var svg = document.getElementsByTagName('svg')[0]; //Get svg element
import { W, H } from './constants.mjs';
  
svg.setAttribute('width','500px');
svg.setAttribute('height','398px');

//Create label for the squares
let label = [];
for (let i=0;i<3;i++){
    label[i] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label[i].setAttributeNS(null, 'x', 0);
    label[i].setAttributeNS(null, 'y', 0);
    let txt = document.createTextNode(i+'');
    label[i].appendChild(txt);
    label[i].style = txtStyle[i]; 
    svg.appendChild(label[i]);
}

export function createSVGSquare(square, id){//tested             
    let polygon = document.createElementNS(nameSpaceURI, 'polygon'); //Create a path in SVG's namespace
    polygon.setAttribute("id",'square'+id); 
    let points = "";
    for(let i=0;i<4;i++){
        points += square.vertex[i].x + ',' +square.vertex[i].y + ' ';
    }
    polygon.setAttribute("points",points);
    polygon.style = squareStyle[id]; 
    svg.appendChild(polygon);
    label[id].setAttributeNS(null, 'x', square.center.x-5);
    label[id].setAttributeNS(null, 'y', square.center.y+5);
   
}
export function updateSVGSquare(square, id){//tested             
    let polygon = document.getElementById('square'+id);
    let points = "";
    for(let i=0;i<4;i++){
        points += square.vertex[i].x + ',' +square.vertex[i].y + ' ';
    }
    polygon.setAttribute("points",points); 
    polygon.style = squareStyle[id]; 
    label[id].setAttributeNS(null, 'x', square.center.x-5);
    label[id].setAttributeNS(null, 'y', square.center.y+5);
    //svg.appendChild(polygon);
}

export function drawBox(box, style){//tested       
    let polygon = document.createElementNS(nameSpaceURI, 'polygon'); //Create a path in SVG's namespace
    let points = "";
    points +=  box.xmin+ ',' + box.ymin + ' ';
    points +=  box.xmax+ ',' + box.ymin + ' ';
    points +=  box.xmax+ ',' + box.ymax + ' ';
    points +=  box.xmin+ ',' + box.ymax + ' ';
    
    polygon.setAttribute("points",points); 
    polygon.style = style; 
    svg.appendChild(polygon);
}

export function drawPoint(point) {//tested      
    var circle = document.createElementNS(nameSpaceURI,'circle'); // Creates a <circle/>
    circle.setAttribute('fill','red'); // Note: NOT setAttributeNS()
    circle.setAttribute('cx',point.x);     // setAttribute turns 150 into a string
    circle.setAttribute('cy',point.y);    // using a string works, too
    circle.setAttribute('r',2);       // give the circle a radius so we can see it
    circle.setAttribute('opacity',0.5); 
    svg.appendChild(circle);
}

export function saveSvg(svgEl, name) {
    svgEl.setAttribute("xmlns", nameSpaceURI);
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}