import type { $Categories, $Choices, $Questions } from './appwrite-types';

export interface Category extends $Categories {
	questions: Question[];
}

export interface Question extends $Questions {
	choices: Choice[];
}

export type Choice = $Choices;
