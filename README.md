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

Resulting data will be of the form `Kanji[]`

The `Kanji` object is a simplified data structure representing one kanji and its associated information (of course the information will vary depending on what you decided to keep),

```ts
interface Kanji {
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

	/** Korean Romanization */
	krr?: string[];
	/** Korean Hangul */
	krh?: string[];
}
```

_Note #1: Property names are abbreviated to reduce the final footprint of the data as much as possible._
_Note #2: undefined values are removed from the data also to keep things minimal._

### From here

Once your data is generated on your system, all you need is to import it,

```js
import kanjis from './path/to/your/file.json' with {type: 'json'};
```

**Note: If you are using TypeScript, you need to set `"resolveJsonModule"` to `true` in your configuration file.**

<details>
	<summary>Help! Typings not working :(</summary>

Your IDE should be able to read the content of your JSON file and automatically provides the typings for you.

If it does not type correctly, you can add `japanese-kanjis-module/kanjis` to `"types"` in your `tsconfig.json` (or `jsconfig.json` if you are using vanilla), and change your import to,

```js
import kanjis from './path/to/your/file.json?kanjis' with {type: 'json'};
```

</details>

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
