# TODO

- Remove the ExtendScript-specific `$.global` receiver checks. Accept the
  platform's ES3 `this` binding behavior instead of emulating strict-mode
  nullish receiver handling.
