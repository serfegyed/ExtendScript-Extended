# RegExp polyfills for ExtendScript

RegExp methods for ESTK and Adobe ExtendScript. Each polyfill is an
individually includable file in `Lib` and installs itself only when the method
is missing. This folder currently has no aggregate bundle.

## Included methods

### `RegExp.escape()`

Escapes a string so it can be safely embedded as literal text inside a regular
expression pattern.

- Throws `TypeError` for non-string arguments.
- Escapes a leading ASCII letter or digit with `\xNN` form.
- Escapes regular expression syntax characters with backslash escapes.
- Escapes other punctuators, whitespace, line terminators, and lone surrogates
  with hex or Unicode escapes.

```javascript
//@include "Lib/escape.js"

var userText = "file(name).jsx";
var pattern = new RegExp(RegExp.escape(userText));

pattern.test("file(name).jsx");
// true
```

## Tests

Run `Test/tests-RegExp.js` in ESTK or Node. The harness disables native
`RegExp.escape()` so the project implementation is tested directly.

Current Node checkpoint: **8 passed, 0 failed**.

## Compatibility

The production targets are ESTK and Adobe applications using ExtendScript.
Node is used only as a convenient behavior reference during testing.
