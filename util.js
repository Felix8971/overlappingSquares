

export function getViewportSize() {
    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];
    var window_width = w.innerWidth||e.clientWidth||g.clientWidth;
    var window_height = w.innerHeight||e.clientHeight||g.clientHeight;
    return {w:window_width, h:window_height}
}

export function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export function setScaleTransform (element, scale) {
    var transfromString = "scale("+scale+","+scale+")";

    // now attach that variable to each prefixed style
    element.style.webkitTransform = transfromString;
    element.style.MozTransform = transfromString;
    element.style.msTransform = transfromString;
    element.style.OTransform = transfromString;
    element.style.transform = transfromString;
}

