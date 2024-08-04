// Map.prototype.groupBy()
const inventory = [
    { name: "asparagus", type: "vegetables", quantity: 9 },
    { name: "bananas", type: "fruit", quantity: 5 },
    { name: "goat", type: "meat", quantity: 23 },
    { name: "cherries", type: "fruit", quantity: 12 },
    { name: "fish", type: "meat", quantity: 22 },
];

const result = Map.groupBy(inventory, function (value, key) { return value.quantity < 6 ? "restock" : "sufficient" });
console.log(result.get("restock"));
console.log();
console.log(result);
// [{ name: "bananas", type: "fruit", quantity: 5 }]

const inventoryMap = new Map()
inventory.forEach(function (value, key) { inventoryMap.set(key, value); return true })
console.log("\r" + inventoryMap.size);

const result2 = Map.groupBy(inventoryMap, function (x) { return x.type })
console.log("\r" + result2.get("meat").toString());

const result3 = Map.groupBy(inventoryMap, function (x) { return (x.quantity) })
console.log("\r" + result3.toString());