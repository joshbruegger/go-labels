<script>
	export let data;

	const { user } = data;
</script>

<ul>
	<li>
		<strong>Email:</strong>
		{user.email}
	</li>
	<li>
		<strong>Name:</strong>
		{user.name}
	</li>
	<li>
		<strong>ID: </strong>
		{user.$id}
	</li>
</ul>

<div class="flex flex-col gap-4">
	<a href="/questionnaire" class="inline-block">
		<button class="bg-primary text-primary-foreground hover:bg-primary/90">
			Start Questionnaire
		</button>
	</a>

	<form method="post">
		<button type="submit">Log out</button>
	</form>
</div>
