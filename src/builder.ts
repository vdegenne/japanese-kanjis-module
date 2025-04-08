import data from 'kanjidic2-json';
import fs from 'fs/promises';
import {KanjiDic2Character} from '../../kanjidic2-json/lib/types.js';

interface CharacterValues {
	grade?: Kanji['gr'];

	/**
	 * Use `undefined` for non-jlpt kanjis
	 */
	jlpt?: Kanji['jlpt'];

	strokeCounts?: Kanji['strc'];

	frequency?: Kanji['frq'];
}

interface BuildOptions {
	/**
	 * If ommited, the data is not saved and returned by the function.
	 * E.g.
	 * ```js
	 * const kanjis = await buildData({...})
	 * ```
	 */
	output?: string | undefined;

	/**
	 * @default false
	 */
	jlpt: boolean;

	/**
	 * @default false
	 */
	grade: boolean;

	/**
	 * @default false
	 */
	frequency: boolean;

	/**
	 * @default false
	 */
	strokeCounts: boolean;

	/**
	 * @default false
	 */
	onYomi: boolean;
	/**
	 * @default false
	 */
	kunYomi: boolean;

	/**
	 * @default false
	 */
	english: boolean;

	/**
	 * @default false
	 */
	koreanRoman: boolean;
	/**
	 * @default false
	 */
	koreanHangul: boolean;

	/**
	 * Used to filter numerical values.
	 * Returning false will keep the character out of the result.
	 *
	 * @default () => true
	 */
	filter: (values: CharacterValues) => boolean;

	/**
	 * Mega filter if you need to filter more properties that are not implemented yet.
	 *
	 * @default () => true
	 */
	rawFilter: (character: KanjiDic2Character) => boolean;
}

const defaultOptions: BuildOptions = {
	english: false,
	grade: false,
	jlpt: false,
	frequency: false,
	strokeCounts: false,

	kunYomi: false,
	onYomi: false,

	koreanRoman: false,
	koreanHangul: false,

	filter() {
		return true;
	},
	rawFilter() {
		return true;
	},
};

export async function buildData(options?: Partial<BuildOptions>) {
	const _options: BuildOptions = {
		...defaultOptions,
		...(options ?? {}),
	};

	const kanjis = data
		.filter((char) => _options.rawFilter(char))
		.filter((char) =>
			_options.filter({
				grade: char.grade,
				jlpt: char.jlpt,
				frequency: char.freq,
				strokeCounts: char.strokeCounts,
			}),
		)
		.map((char) => {
			const kanji: Kanji = {
				c: char.literal,
			};

			if (_options.grade && char.grade) {
				kanji.gr = char.grade;
			}
			if (_options.jlpt && char.jlpt) {
				kanji.jlpt = char.jlpt;
			}
			if (_options.frequency && char.freq) {
				kanji.frq = char.freq;
			}
			if (_options.strokeCounts && char.strokeCounts) {
				kanji.strc = char.strokeCounts;
			}
			if (_options.kunYomi && char.readings?.ja_kun) {
				kanji.kun = char.readings?.ja_kun;
			}
			if (_options.onYomi && char.readings?.ja_on) {
				kanji.on = char.readings?.ja_on;
			}
			if (_options.koreanRoman && char.readings?.korean_r) {
				kanji.krr = char.readings?.korean_r;
			}
			if (_options.koreanHangul && char.readings?.korean_h) {
				kanji.krh = char.readings?.korean_h;
			}
			if (_options.english && char.meanings?.en) {
				kanji.en = char.meanings?.en;
			}

			return kanji;
		});

	if (_options.output) {
		await fs.writeFile(_options.output, JSON.stringify(kanjis));
	} else {
		return kanjis;
	}
}
