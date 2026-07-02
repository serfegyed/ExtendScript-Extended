/**
 * ExtendScript Object extensions bundle.
 *
 * Standard-compatible methods are followed by project-specific extensions.
 * Object.prototype.toString is intentionally loaded last because it replaces
 * native output with a readable ExtendScript Console representation.
 */

// Standard-compatible methods
//@include "./Lib/is.js"
//@include "./Lib/hasOwn.js"
//@include "./Lib/assign.js"
//@include "./Lib/keys.js"
//@include "./Lib/values.js"
//@include "./Lib/entries.js"
//@include "../Array/Lib/isArray.js"
//@include "./Lib/fromEntries.js"
//@include "./Lib/getOwnPropertyNames.js"
//@include "./Lib/getPrototypeOf.js"
//@include "./Lib/create.js"
//@include "./Lib/defineProperty.js"
//@include "./Lib/defineProperties.js"
//@include "./Lib/groupBy.js"

// Non-standard project extensions
//@include "./Lib/isObject.js"
//@include "./Lib/isEmpty.js"
//@include "./Lib/isEquals.js"
//@include "./Lib/isCyclic.js"
//@include "./Lib/deepCopy.js"
//@include "./Lib/compact.js"
//@include "./Lib/flat.js"
//@include "./Lib/merge.js"
//@include "./Lib/toString.js"
