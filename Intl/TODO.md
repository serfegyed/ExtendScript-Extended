# Intl subset backlog

## Temporal integration policy

- Keep `Temporal.Instant.prototype.toLocaleString()` conservative: no IANA time-zone handling; it uses the current host-local Date projection and no selectable time zone.