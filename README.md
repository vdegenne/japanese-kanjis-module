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
	english: true, // Includes English meanings
	filter({freq, strokeCounts}) {
		// Only characters with a grade lower than 3
		// and an usage frequency higher than 1000
		return grade < 3 && freq > 1000;
	},
});
```

---

Resulting data will be of the form `Kanji[]`

The `Kanji` object is a simplified data structure representing one kanji and its associated information (of course the information will vary depending on what you decided to keep),

```ts
export interface Kanji {
	/** Character */
	c: string;

	jlpt?: 5 | 4 | 3 | 2 | 1;

	/** Grade */
	gr?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 9 | 10;

	/** Stroke count */
	strc?: [number] | [number, number] | [number, number, number];

	/** Frequency */
	frq?: number;

	/** English meaning */
	en?: string[];

	/** On'yomi */
	on?: string[];
	/** Kun'yomi */
	kun?: string[];

	krr?: string[];
	krh?: string[];
}
```

_Note that the property names are abbreviated to reduce the final footprint of the data as much as possible._

## More examples

```ts
const __dirname = import.meta.dirname;

await buildData({
	// Save relative to the building script
	output: `${__dirname}/../src/kanjis.json`,

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
