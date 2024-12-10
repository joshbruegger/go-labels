import type { Models } from 'node-appwrite';

// Define the Category interface
export interface Category extends Models.Document {
	name: string;
	description?: string;
	ordering: number;
	questions: Question[];
}

// Define the Question interface
export interface Question extends Models.Document {
	category_id: string;
	text: string;
	ordering: number;
	type: 'single' | 'multiple-choice';
	requires_evidence: boolean;
	description?: string;
	explanation?: string;
	choices: Choice[];
}

// Define the Choice interface
export interface Choice extends Models.Document {
	question_id: string;
	text: string;
	points: number;
}

// Organized interfaces for nested data structures
export interface CategorizedQuestions extends Category {
	questions: QuestionWithChoices[];
}

export interface QuestionWithChoices extends Question {
	choices: Choice[];
}
