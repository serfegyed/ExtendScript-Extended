# Linker TODO

## Type analysis

- [ ] Read JSDoc type hints from application sources for variables, parameters,
  receiver types, and function return values.
- [ ] Resolve computed member access when the property key is statically known,
  such as `value["method"]`.
- [ ] Infer return types from user-defined functions.

## Adobe host catalogs

- [ ] Optionally request or mine a dynamic OMV directly when no existing cache
  is available. The current Linker never launches a host application.
- [ ] Add and test macOS discovery paths for Adobe dictionaries and ESTK OMV
  caches.
- [ ] Validate catalog generation against additional Adobe hosts and document
  host-specific differences.
