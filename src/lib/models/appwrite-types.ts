// THIS FILE IS GENERATED - DO NOT EDIT DIRECTLY
// To regenerate, run: bun run generate:types

import type { Models } from 'node-appwrite';

// questions Collection
export interface $Questions extends Models.Document {
	text: string;
	requires_evidence: boolean;
	explanation?: string;
	category_id: string;
	type: 'multiple-choice' | 'open';
	conditional_on_questions?: string[];
	conditional_on_choices?: string[];
	description?: string;
	allows_na: boolean;
	na_text?: string;
	ordering: string;
}

// categories Collection
export interface $Categories extends Models.Document {
	name: string;
	description?: string;
	ordering: number;
}

// responses Collection
export interface $Responses extends Models.Document {
	submission_id: string;
	question_id: string;
	choice_id?: string;
	evidence_ids?: string[];
	open_text?: string;
	na_reason?: string;
	manual_points?: number;
	manual_points_explanation?: string;
}

// submissions Collection
export interface $Submissions extends Models.Document {
	user_id: string;
	status: 'draft' | 'submitted' | 'reviewed';
}

// choices Collection
export interface $Choices extends Models.Document {
	text: string;
	points: number;
	question_id: string;
	requires_manual_points: boolean;
}
