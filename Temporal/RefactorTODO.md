# Temporal Refactor TODO

Working rule: handle one item at a time. After each change, run the relevant Node tests and then verify in ESTK before moving to the next item.

## Dead Code / Unused Surface

- [x] `Lib/Temporal.Duration.js`: `isValidParameter()` appears unused. Removed in `Temporal.Duration54.js`.
- [x] `Lib/Temporal.Duration.js`: `isDurationLike()` appears unused; if removed, check whether `isValidParameters()` becomes unused too. Removed both in `Temporal.Duration55.js`.
- [x] `Lib/Temporal.Duration.js`: `isTimeUnit()`, `isTimeUnitWithDay()`, `isDateUnit()`, `isDateUnitWithoutDay()`, and `isDateTimeUnit()` appear unused. Removed in `Temporal.Duration56.js`.
- [x] `Lib/Temporal.Duration.js`: `hasYearsOrMonths()` appears unused. Removed in `Temporal.Duration57.js`.
- [x] `Lib/Temporal-core.js`: `Temporal.__copyThisObject__ = copyFields` appears to be a legacy alias; active code uses `__copyFields__`. Removed in `Temporal-core30.js`.
- [x] `all_tests.js`: `Date/Test/tests-Date.js` cross-project include may be misleading inside the Temporal all-tests runner. Removed the cross-project Date test block.
- [x] `README.md`: `audit-HostLocalDate.js` reference appears stale; the file is no longer present. Removed stale file-list entry.
- [x] `Instant-ReadMe.md`: `LocaleDate` harness references appear stale; `Temporal.LocaleDate.js` and `tests-LocaleDate.js` are no longer active. Removed stale verification lines.

## Multiple Interpretations

- [x] `Lib/Temporal.Instant.js`: `toInstant()` accepts objects by passing them into the string parser, but the error message says only Instant or string. Kept string-coercible object input as supported and documented it in `Temporal.Instant6.js`.
- [x] `Test/tests-LocaleString-Intl.js`: Node currently reports 5 passed / 4 failed. Clarified as an ESTK/local Intl subset test; ESTK reports 9 passed, 0 failed, while Node failures come from native Intl formatting differences.
- [x] `Lib/Temporal.PlainYearMonth.js`: `add()` validates `overflow`, then explicitly ignores it. Kept validation for Node-compatible option errors and removed the no-op assignment in `Temporal.PlainYearMonth7.js`.

## Unnecessary Abstractions

- [x] `Lib/Temporal.PlainDateTime.js`: repeated `validOverflow` validation in `from()`, `with()`, and `add()` may be a small helper candidate, but only if it reduces code without adding conceptual weight. Extracted local `normalizeOverflow()` in `Temporal.PlainDateTime42.js`.
- [x] `Lib/Temporal.Duration.js`: `durationToStringWithOptions()` rounds and then post-processes the ISO string; review for a simpler direct path without changing behavior. Reviewed after Node oracle checks; kept the current structure, then fixed negative-zero fixed-fraction output in `Temporal.Duration59.js`.
- [x] `Test/*.js`: repeated mini test harnesses are intentionally useful for ESTK standalone execution; leave as-is unless we deliberately create an ESTK-safe shared harness.

## Error Handling For Impossible Scenarios

- [x] `Lib/Temporal-core.js`: `roundField()` checks `increment <= 0` even though callers validate increments first. Removed unreachable guard in `Temporal-core31.js`.
- [x] `Lib/Temporal-core.js`: `roundField()` has an `Unknown rounding mode` default branch that may be unreachable after caller validation. Removed unreachable default branch in `Temporal-core32.js`.
- [x] `Lib/Temporal.PlainDate.js`: `createDate()` checks `if (!checked)` after `__validateDate__`, which returns an object or throws. Removed in `Temporal.PlainDate10.js`.
- [x] `Lib/Temporal.PlainDate.js`: `Temporal.PlainDate` constructor checks `if (!checkedDate)` after `__validateDate__`, which returns an object or throws. Removed in `Temporal.PlainDate28.js`.
- [x] `Lib/Temporal.Duration.js`: `Duration.prototype.with()` has a fallback `return this` after `checkInputValues()`, but that helper returns an object or throws. Removed unreachable fallback in `Temporal.Duration58.js`.

## Unnecessary Value Checks

- [x] `Lib/Temporal.Duration.js`: `checkInputValues()` repeats finite/integer validation after `normalizeDurationFields()` has already normalized fields. Removed duplicate validation in `Temporal.Duration60.js`.
- [x] `Lib/Temporal.Duration.js`: `Duration.prototype.round()` checks `roundingIncrement` finite/integer, then calls `validateRoundingIncrement()` for partly overlapping validation. Consolidated into `validateRoundingIncrement()` in `Temporal.Duration61.js`.
- [x] `Lib/Temporal.PlainDateTime.js`: `round()` checks `roundingIncrement`, then calls another validation path; review for overlap. Reused core fixed-time validation in `Temporal.PlainDateTime43.js`.
- [x] `Lib/Temporal.PlainTime.js`: `toString()` validates `fractionalSecondDigits` in two branches; review for duplicate validation. Normalized once in `Temporal.PlainTime19.js`.
