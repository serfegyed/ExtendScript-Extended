/* InDesign host-catalog smoke test. */
//@target indesign
#targetengine "session"

var document = app.documents.add();
var page = document.pages.item(0);
var frame = page.textFrames.add();
var text = frame.texts.item(0);
var message = ["OMV linker"].at(0);
text.contents = message;
$.writeln(text.contents);
document.close(SaveOptions.NO);
