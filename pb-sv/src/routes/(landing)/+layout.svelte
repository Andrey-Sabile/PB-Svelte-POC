<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<header class="navbar bg-base-100 border-base-300 shadow-sm">
	<div class="flex-1"><a class="btn btn-ghost text-xl" href="/">Leo</a></div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/login">Login</a></li>
			<li><a href="/todolist">Todolist</a></li>
		</ul>
	</div>
</header>

{@render children()}
