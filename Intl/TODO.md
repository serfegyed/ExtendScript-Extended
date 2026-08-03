# Intl subset backlog

## Collator

- Decide whether `numeric: true` is worth implementing. Keep it explicit `RangeError` until then.
- Decide whether any locale-specific tailoring is worth adding beyond the current small accent tables.
- Keep full Hungarian digraph/trigraph collation out of scope unless there is a concrete use case and a reliable word-boundary strategy.
- Revisit German phonebook collation only as a deliberately small, separately tested option.

## DateTimeFormat

- `Intl.DateTimeFormat.prototype.formatToParts()` exists as a narrow subset. Keep future changes scoped to the currently implemented date/time fields unless a later Temporal use case needs more.

## Temporal integration policy

- Preserve the current fallback rule for every Temporal `toLocaleString()` path: if the matching Intl formatter is not included, return the stable Temporal `toString()` output instead of throwing.
- Keep `Temporal.Instant.prototype.toLocaleString()` conservative: no IANA time-zone handling; it uses the current host-local Date projection and no selectable time zone.
