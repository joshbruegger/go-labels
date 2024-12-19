#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

interface AppwriteSchema {
	collections: Collection[];
}

interface Collection {
	$id: string;
	name: string;
	attributes: Attribute[];
}

interface Attribute {
	key: string;
	type: string;
	required: boolean;
	array: boolean;
	elements?: string[];
	format?: string;
	size?: number;
	min?: number;
	max?: number;
}

function capitalizeFirstLetter(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function getTypeScriptType(attr: Attribute): string {
	let type = '';

	if (attr.elements && attr.format === 'enum') {
		type = attr.elements.map((e) => `'${e}'`).join(' | ');
	} else {
		switch (attr.type) {
			case 'string':
				type = 'string';
				break;
			case 'integer':
				type = 'number';
				break;
			case 'boolean':
				type = 'boolean';
				break;
			default:
				type = 'any';
		}
	}

	if (attr.array) {
		type = `${type}[]`;
	}

	return type;
}

function generateInterface(collection: Collection): string {
	const name = capitalizeFirstLetter(collection.$id);
	const attributes = collection.attributes
		.map((attr) => {
			const type = getTypeScriptType(attr);
			const optional = !attr.required ? '?' : '';
			return `    ${attr.key}${optional}: ${type};`;
		})
		.join('\n');

	return `// ${collection.name} Collection\nexport interface $${name} extends Models.Document {\n${attributes}\n}`;
}

function generateTypes(): void {
	const __dirname = fileURLToPath(new URL('.', import.meta.url));
	const rootDir = join(__dirname, '..', '..', '..');

	// Read the appwrite.json file
	const appwriteJson = JSON.parse(
		readFileSync(join(rootDir, 'appwrite.json'), 'utf-8')
	) as AppwriteSchema;

	// Generate the TypeScript content
	const content = `// THIS FILE IS GENERATED - DO NOT EDIT DIRECTLY\n// To regenerate, run: bun run generate:types\n\nimport type { Models } from 'node-appwrite';\n\n${appwriteJson.collections.map(generateInterface).join('\n\n')}\n`;

	// Write to the output file
	writeFileSync(join(__dirname, 'appwrite-types.ts'), content);
	console.log('Generated TypeScript interfaces in src/lib/models/appwrite-types.ts');
}

// Run the generator
generateTypes();
