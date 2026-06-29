# Temporal.Duration

`Lib/Temporal.Duration.js` is the duration object for this ExtendScript/InDesign-focused Temporal subset. It handles ISO 8601 duration strings and duration-like objects with millisecond precision, using Node Temporal as a reference for the supported surface.

This is not a full Temporal.Duration polyfill. The goal is practical, inspectable duration handling for InDesign scripting, not complete Node Temporal API parity.

## References

- [TC39 Temporal.Duration documentation](https://tc39.es/proposal-temporal/docs/duration.html)
- [MDN Temporal.Duration reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Duration)

## Files

- Active implementation: `Lib/Temporal.Duration.js`
- Tests: `Test/tests-Duration.js`
- Required includes: `Lib/Temporal-core.js`; `Lib/Temporal.PlainDateTime.js` is also needed for calendar-relative operations.

```javascript
//@include "Lib/Temporal-core.js"
//@include "Lib/Temporal.Duration.js"
//@include "Lib/Temporal.PlainDateTime.js"
```

## Role In This Subset

`Temporal.Duration` stores relative or absolute duration components:

- years, months, weeks, days
- hours, minutes, seconds, milliseconds
- `sign`
- `blank`

The project intentionally stops at millisecond precision. There are no microsecond or nanosecond components.

Some operations involving calendar units (`years`, `months`, `weeks`) require a `relativeTo` reference because the length of a month or year depends on the date.

## Implemented Properties

Each Duration instance has these direct properties:

```javascript
var d = Temporal.Duration.from("P1Y2M3W4DT5H6M7.008S");

d.years;        // 1
d.months;       // 2
d.weeks;        // 3
d.days;         // 4
d.hours;        // 5
d.minutes;      // 6
d.seconds;      // 7
d.milliseconds; // 8
d.sign;         // 1
d.blank;        // false
```

For a zero duration:

```javascript
var zero = Temporal.Duration.from({ days: 0 });

zero.toString(); // "PT0S"
zero.sign;       // 0
zero.blank;      // true
```

## Constructor

### `new Temporal.Duration(...)`

Supported argument order:

```javascript
new Temporal.Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds);
```

Examples:

```javascript
new Temporal.Duration(0, 0, 0, 1).toString();      // "P1D"
new Temporal.Duration(0, 0, 0, -1, -2).toString(); // "-P1DT2H"
new Temporal.Duration(0, 0, 0, 0, 25).toString();  // "PT25H"
```

Notes:

- Calling without `new` throws `TypeError`.
- Fields must be finite integers after coercion.
- Numeric string fields are accepted.
- `null`, `undefined`, `false`, and empty string fields can coerce to zero.
- Mixed positive and negative fields are invalid.
- Time units are not always balanced by the constructor: `25 hours` can remain `PT25H`.

## Static Methods

### `Temporal.Duration.from(thing)`

Accepts:

- ISO 8601 duration strings
- another `Temporal.Duration` instance
- duration-like objects with plural field names

Examples:

```javascript
Temporal.Duration.from("P1Y2M3W4DT5H6M7.008S").toString();
// "P1Y2M3W4DT5H6M7.008S"

Temporal.Duration.from("-P1DT2H").days;
// -1

Temporal.Duration.from({ hours: "2" }).toString();
// "PT2H"

Temporal.Duration.from({ days: 1, banana: 2 }).toString();
// "P1D"
```

Edge cases:

```javascript
Temporal.Duration.from("+P1D").toString(); // "P1D"
Temporal.Duration.from("P0D").toString();  // "PT0S"
Temporal.Duration.from({ hours: null }).toString(); // "PT0S"
```

Errors:

- `undefined` or `null`: `TypeError`
- empty object: `TypeError`
- singular field names, such as `{ day: 1 }`: `TypeError`
- mixed signs, such as `{ days: 1, hours: -1 }`: `RangeError`
- fractional fields, `NaN`, or `Infinity`: `RangeError`

### `Temporal.Duration.compare(one, two, options)`

Returns `-1`, `0`, or `1`.

```javascript
Temporal.Duration.compare("P1D", "PT24H"); // 0
Temporal.Duration.compare("P2D", "PT24H"); // 1
Temporal.Duration.compare("-P1D", "PT0S"); // -1
```

Calendar units require `relativeTo`, unless both duration field sets are identical:

```javascript
Temporal.Duration.compare("P1M", "P1M"); // 0

Temporal.Duration.compare("P1M", "P30D", {
    relativeTo: Temporal.PlainDateTime.from("2024-01-01T00:00:00")
});
// 1

Temporal.Duration.compare("P1M", "P30D", {
    relativeTo: Temporal.PlainDateTime.from("2024-02-01T00:00:00")
});
// -1
```

`P1M` versus `P30D`, or `P1W` versus `P7D`, throws without `relativeTo`.

## Instance Methods

### `duration.with(obj)`

Returns a new Duration with selected fields replaced.

```javascript
Temporal.Duration.from("P1D").with({ hours: 2 }).toString();
// "P1DT2H"

Temporal.Duration.from("P1DT2H").with({ days: 0 }).toString();
// "PT2H"

Temporal.Duration.from("P1D").with({ days: 0 }).toString();
// "PT0S"
```

Unknown keys are ignored only when at least one valid duration field is also present:

```javascript
Temporal.Duration.from("P1D").with({ hours: 2, banana: 1 }).toString();
// "P1DT2H"
```

An empty object, only unknown fields, `null`, invalid integers, or mixed signs throw.

### `duration.add(other)`

Duration-to-Duration addition.

```javascript
Temporal.Duration.from("P3D").add("P2D").toString();
// "P5D"

Temporal.Duration.from("PT23H").add("PT2H").toString();
// "PT25H"

Temporal.Duration.from("PT60M").add("PT1M").toString();
// "PT61M"
```

Intentional limit: if either duration contains calendar units (`years`, `months`, `weeks`), addition throws `RangeError`. Use `Temporal.PlainDateTime.prototype.add()` for calendar-relative addition.

### `duration.subtract(other)`

Negates `other`, then uses the `add()` path.

```javascript
Temporal.Duration.from("P3D").subtract("P1D").toString();
// "P2D"

Temporal.Duration.from("P1D").subtract("PT0.001S").toString();
// "PT23H59M59.999S"
```

### `duration.negated()`

Negates all supported fields.

```javascript
Temporal.Duration.from("P2W").negated().toString();
// "-P2W"
```

### `duration.abs()`

Returns the absolute value.

```javascript
Temporal.Duration.from("-P2W").abs().toString();
// "P2W"
```

### `duration.round(roundTo)`

Supported forms:

```javascript
Temporal.Duration.from("PT1.234S").round("seconds").toString();
// "PT1S"

Temporal.Duration.from("PT7M").round({
    smallestUnit: "minute",
    roundingIncrement: 5
}).toString();
// "PT5M"

Temporal.Duration.from("PT90M").round({
    largestUnit: "hours",
    smallestUnit: "minutes"
}).toString();
// "PT1H30M"
```

Supported `smallestUnit` / `largestUnit` values:

- `year`, `month`, `week`, `day`
- `hour`, `minute`, `second`, `millisecond`
- plural aliases
- `largestUnit: "auto"`

Supported rounding modes:

- `ceil`
- `floor`
- `expand`
- `trunc`
- `halfCeil`
- `halfFloor`
- `halfExpand`
- `halfTrunc`
- `halfEven`

Calendar rounding requires `relativeTo`:

```javascript
Temporal.Duration.from("P1Y2DT12H").round({
    largestUnit: "year",
    smallestUnit: "day",
    relativeTo: Temporal.PlainDateTime.from("2024-02-28T00:00:00")
}).toString();
// "P1Y3D"
```

Validation covers missing `roundTo`, `null`, empty option objects, invalid units or rounding modes, invalid `roundingIncrement`, and calendar `largestUnit` without `relativeTo`.

### `duration.total(totalOf)`

Returns the total length in the requested unit.

Simple time units:

```javascript
Temporal.Duration.from("P1D").total("hour");
// 24

Temporal.Duration.from("PT90M").total({ unit: "minute" });
// 90
```

Calendar units, or durations containing calendar fields, require `relativeTo`:

```javascript
var relative = Temporal.PlainDateTime.from("2024-01-31T00:00:00");

Temporal.Duration.from("P1M").total({
    unit: "day",
    relativeTo: relative
});
// 29

Temporal.Duration.from("P1M2D").total({
    unit: "month",
    relativeTo: relative
});
// 1.064516129032258
```

Supported units: `year`, `month`, `week`, `day`, `hour`, `minute`, `second`, `millisecond`, with plural aliases.

### `duration.toString(options)`

Default ISO 8601 output:

```javascript
Temporal.Duration.from({ seconds: 1, milliseconds: 230 }).toString();
// "PT1.23S"

Temporal.Duration.from({ milliseconds: 10 }).toString();
// "PT0.01S"

Temporal.Duration.from("PT25H").toString();
// "PT25H"
```

Supported options subset:

```javascript
Temporal.Duration.from("PT1H2M3.456S").toString({
    smallestUnit: "second"
});
// "PT1H2M3S"

Temporal.Duration.from("PT1.234S").toString({
    fractionalSecondDigits: 2
});
// "PT1.23S"
```

Intentional simplification: `smallestUnit: "hour"` and `"minute"` are not supported as string-formatting options.

### `duration.toJSON()`

Returns a plain ISO string:

```javascript
Temporal.Duration.from("P1DT2H").toJSON();
// "P1DT2H"
```

ExtendScript does not reliably provide a global `JSON` object, so this project does not rely on `JSON.stringify()` behavior. `toJSON()` itself is supported.

### `duration.toLocaleString()`

Intentionally aliases `toString()`.

```javascript
Temporal.Duration.from("P1DT2H").toLocaleString();
// "P1DT2H"
```

ExtendScript has no `Intl.DurationFormat`, and locale formatting is outside this project's scope.

### `duration.valueOf()`

Always throws `TypeError` to prevent accidental primitive numeric coercion.

```javascript
Temporal.Duration.from("P1D").valueOf();
// TypeError
```

Use `Temporal.Duration.compare()` for comparisons.

## Unsupported Or Omitted Surface

Intentionally absent:

- microsecond and nanosecond properties
- locale-based duration formatting
- `Intl.DurationFormat`
- full calendar/time-zone API
- object-shape parity only for Node compatibility
- `Temporal.Duration.prototype.withCalendar`
- time-zone or ZonedDateTime integration
- standalone Duration add/subtract with calendar units

## Node Temporal Compatibility Notes

The implemented surface has been checked against Node Temporal for:

- object input coercion
- constructor field validation
- derived `sign` and `blank`
- `compare()` calendar `relativeTo` rules
- `with()` edge cases
- time-only `add()` / `subtract()` unit preservation
- `round()` rounding modes and increment validation
- `total()` fractional year/month calculations
- `toString()` millisecond formatting
- `toJSON()` ISO output
- `valueOf()` rejection

Node Temporal is a reference and test oracle, not a full API contract. Features that are not useful for the ExtendScript/InDesign target should remain documented as unsupported instead of being stubbed.

## Known Oddities And Edge Cases

- Duration fields are not automatically balanced everywhere. For example, `PT25H` may remain `PT25H`.
- With a date part, fractional-only seconds can disappear to match Node behavior: `P1Y2DT0.001S` -> `P1Y2D`.
- Calendar unit comparison, totalization, and rounding are date-dependent, so `relativeTo` is required.
- `weeks` is treated as a calendar unit in operations where week length is tied to calendar context.
- Errors are created through `Temporal.__typeError__()` and `Temporal.__rangeError__()` so ExtendScript error names stay stable.

## Quick Example

```javascript
var deadline = Temporal.PlainDateTime.from("2024-01-31T10:00:00");
var duration = Temporal.Duration.from("P1M2DT3H");

var due = deadline.add(duration);
due.toString(); // "2024-03-02T13:00:00"

duration.total({
    unit: "day",
    relativeTo: deadline
});
// 31
```
