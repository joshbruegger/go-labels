<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import {
		Star,
		TrendingUp,
		BarChart2,
		DollarSign,
		ChevronLeft,
		ChevronRight
	} from 'lucide-svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';

	let timeLeft = {
		days: 21,
		hours: 1,
		minutes: 1,
		seconds: 39
	};

	onMount(() => {
		const timer = setInterval(() => {
			if (timeLeft.seconds > 0) {
				timeLeft.seconds--;
			} else if (timeLeft.minutes > 0) {
				timeLeft.minutes--;
				timeLeft.seconds = 59;
			} else if (timeLeft.hours > 0) {
				timeLeft.hours--;
				timeLeft.minutes = 59;
				timeLeft.seconds = 59;
			} else if (timeLeft.days > 0) {
				timeLeft.days--;
				timeLeft.hours = 23;
				timeLeft.minutes = 59;
				timeLeft.seconds = 59;
			}
			timeLeft = { ...timeLeft };
		}, 1000);

		return () => clearInterval(timer);
	});
</script>

<div class="min-h-screen bg-background">
	<header class="border-b">
		<div class="container mx-auto flex items-center justify-between p-4">
			<img
				src="https://via.placeholder.com/40x160"
				alt="University of Groningen"
				class="h-10 w-auto"
			/>
			<nav class="flex items-center gap-4">
				<Button variant="default" class="bg-[#77c47d] hover:bg-[#68b56e]" href="/signup"
					>Get a Label</Button
				>
				<Button variant="ghost">Results</Button>
				<Button variant="ghost">About</Button>
				<Button variant="ghost">Add your university</Button>
			</nav>
		</div>
	</header>

	<main>
		<section class="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-2 md:items-center">
			<div class="aspect-square rounded-lg bg-[#e5ebe5]">
				<img
					src="https://via.placeholder.com/400x400"
					alt="Placeholder"
					class="h-full w-full object-cover"
				/>
			</div>
			<div class="space-y-6">
				<h1 class="text-4xl font-bold">Certify the sustainability of your student organisation</h1>
				<p class="text-muted-foreground">
					Lorem ipsum dolor sit amet consectetur adipisicing elit mattis sit phasellus mollis sit
					aliquam sit nullam neque ultrices.
				</p>
				<p class="font-medium">Submissions deadline are on 18/01/2024!</p>
				<div class="flex gap-4">
					<Button class="bg-[#77c47d] hover:bg-[#68b56e]" href="/signup"
						>Get a Green Office Label</Button
					>
					<Button variant="outline">See 2024 Rules</Button>
				</div>
				<div class="space-y-2">
					<p>Time to the deadline:</p>
					<div class="flex gap-4 text-3xl font-bold">
						<span>{timeLeft.days.toString().padStart(2, '0')}</span>:
						<span>{timeLeft.hours.toString().padStart(2, '0')}</span>:
						<span>{timeLeft.minutes.toString().padStart(2, '0')}</span>:
						<span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
					</div>
				</div>
			</div>
		</section>

		<section class="container mx-auto px-4 py-16">
			<h2 class="mb-12 text-center text-3xl font-bold">The benefits of a Green Label</h2>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card class="border-2">
					<CardContent class="flex flex-col items-center gap-4 p-6">
						<div class="rounded-full bg-[#77c47d] p-3">
							<Star class="h-6 w-6 text-white" />
						</div>
						<h3 class="text-xl font-bold">Lead by example</h3>
						<p class="text-center text-muted-foreground">
							Lorem ipsum dolor sit amet consectetur adipisicing elit semper dolar elementum tempus
							hac.
						</p>
					</CardContent>
				</Card>
				<Card class="border-2">
					<CardContent class="flex flex-col items-center gap-4 p-6">
						<div class="rounded-full bg-[#77c47d] p-3">
							<TrendingUp class="h-6 w-6 text-white" />
						</div>
						<h3 class="text-xl font-bold">Drive Improvement</h3>
						<p class="text-center text-muted-foreground">
							Lorem ipsum dolor sit amet consectetur adipisicing elit semper dolar elementum tempus
							hac.
						</p>
					</CardContent>
				</Card>
				<Card class="border-2">
					<CardContent class="flex flex-col items-center gap-4 p-6">
						<div class="rounded-full bg-[#77c47d] p-3">
							<BarChart2 class="h-6 w-6 text-white" />
						</div>
						<h3 class="text-xl font-bold">Compare with others</h3>
						<p class="text-center text-muted-foreground">
							Lorem ipsum dolor sit amet consectetur adipisicing elit semper dolar elementum tempus
							hac.
						</p>
					</CardContent>
				</Card>
				<Card class="border-2">
					<CardContent class="flex flex-col items-center gap-4 p-6">
						<div class="rounded-full bg-[#77c47d] p-3">
							<DollarSign class="h-6 w-6 text-white" />
						</div>
						<h3 class="text-xl font-bold">Attract Sponsors</h3>
						<p class="text-center text-muted-foreground">
							Lorem ipsum dolor sit amet consectetur adipisicing elit semper dolar elementum tempus
							hac.
						</p>
					</CardContent>
				</Card>
			</div>
			<div class="mt-8 text-center">
				<Button variant="outline">Learn More</Button>
			</div>
		</section>

		<section class="container mx-auto px-4 py-16">
			<h2 class="mb-12 text-center text-3xl font-bold">Trusted by countless organisations...</h2>
			<Carousel.Root
				opts={{
					align: 'center'
				}}
				class="mx-auto w-full max-w-2xl"
			>
				<Carousel.Content>
					{#each Array(5) as _, i}
						<Carousel.Item>
							<div class="text-center">
								<div class="mb-4 inline-block overflow-hidden rounded-full">
									<img
										src="https://via.placeholder.com/80x80"
										alt="Testimonial"
										class="h-20 w-20 object-cover"
									/>
								</div>
								<p class="mb-4 text-muted-foreground">
									A visual guide could be a wireframe, creative composition, or information
									architecture. A device that enables collaboration will lessen the chance of work
									having to be completely redone.
								</p>
								<p class="font-bold">John Doe {i + 1}</p>
								<p class="text-sm text-muted-foreground">Gyas</p>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		</section>

		<section class="container mx-auto px-4 py-16">
			<h2 class="mb-12 text-center text-3xl font-bold">Our results in numbers</h2>
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
				<div class="text-center">
					<p class="text-4xl font-bold">99%</p>
					<p class="text-muted-foreground">Customer satisfaction</p>
				</div>
				<div class="text-center">
					<p class="text-4xl font-bold">32M</p>
					<p class="text-muted-foreground">Active users</p>
				</div>
				<div class="text-center">
					<p class="text-4xl font-bold">125+</p>
					<p class="text-muted-foreground">Team members</p>
				</div>
				<div class="text-center">
					<p class="text-4xl font-bold">240%</p>
					<p class="text-muted-foreground">Company growth</p>
				</div>
			</div>
		</section>

		<section class="bg-[#f7f9f7] py-16">
			<div class="container mx-auto grid gap-8 px-4 md:grid-cols-2 md:items-center">
				<div class="aspect-square rounded-lg bg-white">
					<img
						src="https://via.placeholder.com/400x400"
						alt="Features"
						class="h-full w-full object-cover"
					/>
				</div>
				<div class="space-y-6">
					<h2 class="text-3xl font-bold">Get your Green Office Label today!</h2>
					<ul class="space-y-4">
						<li class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-[#77c47d]"></div>
							Interaction design
						</li>
						<li class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-[#77c47d]"></div>
							Finding and managing
						</li>
						<li class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-[#77c47d]"></div>
							Information architecture
						</li>
						<li class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-[#77c47d]"></div>
							Usability testing
						</li>
					</ul>
					<Button class="bg-[#77c47d] hover:bg-[#68b56e]" href="/signup"
						>Get a Green Office Label</Button
					>
				</div>
			</div>
		</section>
	</main>

	<footer class="border-t bg-white">
		<div class="container mx-auto px-4 py-12">
			<div class="grid gap-8 md:grid-cols-4">
				<div class="space-y-4">
					<img
						src="https://via.placeholder.com/40x160"
						alt="University of Groningen"
						class="h-10 w-auto"
					/>
					<p class="text-sm text-muted-foreground">
						Lorem ipsum dolor sit amet consectetur adipisicing elit semper dolar elementum tempus
						hac.
					</p>
					<div class="flex items-center gap-2">
						<Input type="email" placeholder="Email address" class="max-w-xs" />
						<Button class="bg-[#77c47d] hover:bg-[#68b56e]">Subscribe</Button>
					</div>
				</div>
				<div>
					<h3 class="mb-4 font-bold">Menu</h3>
					<ul class="space-y-2 text-sm">
						<li>University of Groningen</li>
						<li>Green Office</li>
						<li>Case studies</li>
						<li>Features</li>
						<li>Downloads</li>
						<li>Updates</li>
						<li>Changelog</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-4 font-bold">Menu</h3>
					<ul class="space-y-2 text-sm">
						<li>Home</li>
						<li>Pricing</li>
						<li>Case studies</li>
						<li>Features</li>
						<li>Downloads</li>
						<li>Updates</li>
						<li>Changelog</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-4 font-bold">Follow on Instagram</h3>
					<div class="grid grid-cols-2 gap-2">
						{#each Array(4) as _, i}
							<div class="aspect-square rounded-lg bg-[#e5ebe5]"></div>
						{/each}
					</div>
				</div>
			</div>
			<div class="mt-8 flex items-center justify-between border-t pt-8">
				<p class="text-sm text-muted-foreground">
					Copyright © 2024 University of Groningen | All Rights Reserved
				</p>
				<div class="flex gap-4">
					<Button variant="ghost" size="icon">
						<span class="sr-only">Facebook</span>
						f
					</Button>
					<Button variant="ghost" size="icon">
						<span class="sr-only">Twitter</span>
						t
					</Button>
					<Button variant="ghost" size="icon">
						<span class="sr-only">LinkedIn</span>
						in
					</Button>
				</div>
			</div>
		</div>
	</footer>
</div>
