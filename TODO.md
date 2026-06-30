# TODO

- Remove custom error factory functions and use the native `TypeError` and
  `RangeError` constructors directly. Do not patch or normalize platform error
  behavior.
- Remove the ExtendScript-specific `$.global` receiver checks. Accept the
  platform's ES3 `this` binding behavior instead of emulating strict-mode
  nullish receiver handling.
