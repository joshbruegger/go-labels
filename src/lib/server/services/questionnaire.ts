import type { CategorizedQuestions, Category, Question, Choice } from '$lib/models/data-model';
import { Query, type Databases } from 'node-appwrite';

export async function fetchQuestionnaire(databases: Databases) {
	const categories = await databases.listDocuments('questionnaire', 'categories', [
		Query.orderAsc('ordering')
	]);

	// Process each category and its related data
	const categoriesWithQuestions: CategorizedQuestions[] = await Promise.all(
		categories.documents.map(async (category) => {
			const typedCategory = category as unknown as Category;
			// Fetch questions for this category
			const categoryQuestions = await databases.listDocuments('questionnaire', 'questions', [
				Query.equal('category_id', category.$id),
				Query.orderAsc('ordering')
			]);

			// Fetch and map choices for each question
			const questionsWithChoices = await Promise.all(
				categoryQuestions.documents.map(async (question) => {
					const typedQuestion = question as unknown as Question;
					const questionChoices = await databases.listDocuments('questionnaire', 'choices', [
						Query.equal('question_id', typedQuestion.$id),
						Query.orderDesc('points')
					]);
					const choices: Choice[] = questionChoices.documents.map((choice) => ({
						...choice,
						text: (choice as unknown as Choice).text,
						points: (choice as unknown as Choice).points,
						question_id: question.$id
					}));
					return {
						...typedQuestion,
						choices,
						category_id: category.$id
					};
				})
			);

			return {
				...category,
				name: typedCategory.name,
				ordering: typedCategory.ordering,
				questions: questionsWithChoices
			};
		})
	);
	return categoriesWithQuestions;
}
