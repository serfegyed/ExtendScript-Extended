/* Photoshop host-catalog smoke input. Requires an open document to run. */
//@target photoshop

var document = app.activeDocument;
var layers = document.artLayers;
$.writeln(layers.length);
