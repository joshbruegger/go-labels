We use bun for managing our dependencies and to build and deploy our project.

Our project is developed using SvelteKit. We use Svelte 5, so do not use legacy Svelte 4 syntax.

We use the `svelte-adapter-bun` adapter to use bun as a server.

Our fronted uses `shadcn-svelte@next` (a svelte port of shadcn/ui) for the UI components. Components are saved in the `$lib/components/ui/` directory. We use the command `bun x shadcn-svelte@next add` to add components.

Our backend is Appwrite. We use the `node-appwrite` package to interact with Appwrite.

Follow best practicss, DRY principles and include thorough comments.
