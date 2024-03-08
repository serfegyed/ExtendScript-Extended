var arr = ['ab', 'fg', ['hi', 'jk'], undefined, NaN, 0.25e-11, 'st', 'uv', 'wx', 'yz'];
console.log(arr);
var brr = arr.shuffle();
console.log(brr);
console.log(arr);
console.log([].shuffle());