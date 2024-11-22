<script lang="ts">
	import { Icons } from '$lib/components/ui/icons/index';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { goto } from '$app/navigation';

	let isLoading = false;
	let error: string | null = null;

	function handleEnhance() {
		return async ({ result, update }: { result: ActionResult; update: () => Promise<void> }) => {
			isLoading = false;

			if (result.type === 'failure') {
				// Access the error from the form data
				error = result.data?.error;
			}
			if (result.type === 'redirect') {
				goto(result.location);
				update();
			}
		};
	}
</script>

<Card.Root class="mx-auto max-w-sm">
	<form
		action="?/signup"
		method="POST"
		use:enhance={handleEnhance}
		on:submit={() => {
			isLoading = true;
			error = null;
		}}
	>
		<Card.Header>
			<Card.Title class="text-2xl">Create an account</Card.Title>
			<Card.Description>Enter your name, email, and password below to sign up</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Name</Label>
					<Input
						id="name"
						name="name"
						placeholder="John Doe"
						type="text"
						autocorrect="off"
						disabled={isLoading}
						required
					/>
				</div>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						name="email"
						placeholder="youremail@example.com"
						type="email"
						autocapitalize="none"
						autocomplete="email"
						autocorrect="off"
						disabled={isLoading}
						required
					/>
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
						<!-- <a href="##" class="ml-auto inline-block text-sm underline"> Forgot your password? </a> -->
					</div>
					<Input
						id="password"
						name="password"
						placeholder="Password"
						type="password"
						disabled={isLoading}
						required
					/>
				</div>
				{#if error}
					<Alert.Root variant="destructive">
						<Alert.Description>{error}</Alert.Description>
					</Alert.Root>
				{/if}
				<Button type="submit" disabled={isLoading}>
					{#if isLoading}
						<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Sign Up
				</Button>
			</div>
			<div class="mt-4 text-center text-sm">
				Already have an account?
				<a href="/login" class="underline"> Log in </a>
			</div>
		</Card.Content>
	</form>
</Card.Root>
