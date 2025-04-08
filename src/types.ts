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
