# japanese-kanjis-module

Build Kanjis dataset with only the information you need in your app.

## Installation

```bash
npm i -D japanese-kanjis-module
```

## Usage

```js
import {buildData} from 'japanese-kanjis-module';

// Example:

buildData({
	output: './src/kanjis.json',
	jlpt: [5, 3, 0], // jlpt5, jlpt3 and non-jlpt characters only
	english: true, // Includes English meanings
	filter({freq, strokeCounts}) {
		// Only characters with a stroke count lower than 10
		// and a frequency usage higher than 1000
		return strokeCounts < 10 && freq > 1000;
	},
});
```

---

Resulting data will be of the form:

```js
[Kanji[], null, null, Kanji[], null, Kanji[]]
// [jlpt0, jlpt1, jlpt2, jlpt3, jlpt4, jlpt5]
```

With that in mind, you can quickly access a group of kanjis in the same level (e.g. `kanjis[5]` for jlpt5).

### Kanji object

A kanji object will be of the form (depending on the information you decided to keep):

```ts
interface Character {}
```

_Note that the property names are abbreviated to reduce the final footprint of the data as much as possible._

## More examples

```ts
const __dirname = import.meta.dirname;

await buildData({
	output: `${__dirname}/../src/kanjis.json`, // Save relative to the building script

	filter({strokeCounts, jlpt}) {
		// Only keeps 5 and 10 strokes characters.
		// In rare cases, one character can have multiple stroke values
		// For this reason it needs to be treated as an array.
		if ([5, 10].some((v) => strokeCounts.includes(v))) {
			return true;
		}

		// Only keeps JLPT N5 and non-JLPT characters
		if ([5, undefined].includes(jlpt)) {
			return true;
		}
	},

	strokeCounts: true, // Includes stroke counts property
	jlpt: true, // Includes jlpt property
});
```
