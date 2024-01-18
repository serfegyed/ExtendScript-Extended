const strings = [
    // Lone high surrogate
    "ab\uD800",
    "ab\uD800c",
    // Lone low surrogate
    "\uDFFFab",
    "c\uDFFFab",
    // Well-formed
    "abc",
    "ab\uD83D\uDE04c",
];

for (const str of strings) {
    $.writeln(str.toWellFormed());
}
// Logs:
// "ab�"
// "ab�c"
// "�ab"
// "c�ab"
// "abc"
// "ab😄c"

var myString = "Hello\uD83D\uDE00world\uD83D\uDCA9"; // Contains lone surrogates
$.writeln(myString);
var wellFormedString = myString.toWellFormed();
$.writeln(wellFormedString); // Output: "Hello😀world�"

var myString2 = ""; // Test empty string
$.writeln("'" + myString2 + "'");