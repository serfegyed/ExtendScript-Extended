# ExtendScript-String

ES6 String functions for ExtendScript (ES3)

These are possible implementation of the JavaScript built-in String methods.

## The available methods

### Standard methods

- `at()`			:	Retrieves the character at the specified index of the string.
- `codePointAt()`	:	Retrieves the Unicode code point at the specified position in a string.
- `endsWith()`		:	Tests whether the string ends with the specified substring.
- `fromCodePoint()`	:	Returns a string created by using the specified sequence of code points
- `includes()`		:	Checks if the string includes the given substring.
- `isWellFormed()`	:	Checks whether a string is well-formed.
- `matchAll()`		:	Matches a string against a regular expression and returns an iterator
- `padEnd()`		:	Pads the current string from the end with a given string
- `padStart()`		:	Pads the current string from the start with a given string
- `repeat()`		:	Constructs and returns a new string which contains the specified number of copies of the string on which it was called
- `replaceAll()`	:	Replaces all occurrences of a specified search string or regular expression
- `startsWith()`	:	Determines whether a string begins with the characters of a specified string, returning true or false as appropriate
- `trim()`			:	Removes the spaces from both ends of the string.
- `trimEnd()`		:	Removes the spaces from the end of the string.
- `trimStart()`		:	Removes whitespace from the beginning of a string.
- `toWellFormed()`	:	Converts a string to a well-formed string.

### Non-standard methods

*(They are mostly methods in some stage of tc39 proposal phase)*
- `chop()`			:	Removes specified characters from the start and end of a string.
- `chopEnd()`		:	Removes trailing characters from the string until the last occurrence of the specified character.
- `chopStart()`		:	Removes leading characters from the string until the first occurrence of the specified character.
- `contains()`		:	Checks if the string contains a specific substring.
- `format()`		:	Formats a string by replacing placeholders with values.
- `indexAfter()`	:	Returns the index of the character immediately following the first occurrence of the specified substring.
- `insert()`	    :	Inserts the specified element at the specified index in the string.
- `isEmpty()`		:	Checks if a string is empty.
- `reverse()`		:	Reverses the order of the characters in the string
