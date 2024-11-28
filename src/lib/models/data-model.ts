import type { Models } from 'node-appwrite';

// Define the Category interface
export interface Category extends Models.Document {
	name: string;
	description?: string;
	ordering: number;
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
}

// Define the Choice interface
export interface Choice extends Models.Document {
	question_id: string;
	text: string;
	isCorrect: boolean;
}

// Organized interfaces for nested data structures
export interface CategorizedQuestions extends Category {
	questions: QuestionWithChoices[];
}

export interface QuestionWithChoices extends Question {
	choices: Choice[];
}
