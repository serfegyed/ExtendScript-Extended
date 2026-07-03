/* Illustrator host-catalog smoke input. Requires an open document to run. */
//@target illustrator

var document = app.activeDocument;
var items = document.pathItems;
$.writeln(items.length);
