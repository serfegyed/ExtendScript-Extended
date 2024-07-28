// Example usage to check if two floating-point numbers are approximately equal
function areApproximatelyEqual(a, b, epsilon) {
    return Math.abs(a - b) < epsilon;
}

// Using Number.EPSILON to compare floating-point numbers
console.log(Number.MAX_VALUE)
console.log(Number.MAX_VALUE + Number.EPSILON)
console.log(Number.MAX_VALUE + 1)
console.log(Infinity)
console.log(Number.MIN_VALUE)

console.log(Number.EPSILON)
console.log(((0.1 + 0.2) - 0.3))

console.log(((0.1 + 0.2) - 0.3) === 0) // false
console.log(((0.1 + 0.2) - 0.3) === Number.EPSILON) // false
console.log(((0.1 + 0.2) - 0.3) == Number.EPSILON) // false
console.log(((0.1 + 0.2) - 0.3) < Number.EPSILON) // true
console.log(Number.EPSILON - ((0.1 + 0.2) - 0.3))
console.log(((0.1 + 0.2) - 0.3) > Number.EPSILON) // false
console.log(areApproximatelyEqual(0.1 + 0.2, 0.3, Number.EPSILON)); // true