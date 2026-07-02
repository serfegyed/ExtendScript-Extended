/* Linker smoke test: this header must remain before the generated includes. */
var numbers = [1, 2, 3];
numbers.push(4);
var last = numbers.at(-1);
var second = "alpha,beta".split(",").at(1);
var label = "42";
var padded = label.padStart(4, "0");
var hasTwo = label.includes("2");
var iso = new Date(0).toISOString();
var cubeRoot = Math.cbrt(27);
var isInteger = Number.isInteger(3);
var text = JSON.stringify({last: last, second: second, padded: padded, iso: iso, cubeRoot: cubeRoot});
var data = JSON.parse(text);
console.log(data, hasTwo, isInteger);
