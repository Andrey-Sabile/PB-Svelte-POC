How to use
Lucide is built with ES Modules, so it's completely tree-shakable.

Each icon can be imported as a Svelte component, which renders an inline SVG element. This way, only the icons that are imported into your project are included in the final bundle. The rest of the icons are tree-shaken away.

Example
Default usage:


<script>
  import { Skull } from '@lucide/svelte';
</script>

<Skull />
Additional props can be passed to adjust the icon:


<script>
  import { Camera } from '@lucide/svelte';
</script>

<Camera color="#ff3e98" />
For faster builds and load times, you can import icons directly from the @lucide/svelte/icons directory:


<script>
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
</script>

<CircleAlert color="#ff3e98" />
Props
name	type	default
size	number	24
color	string	currentColor
strokeWidth	number	2
absoluteStrokeWidth	boolean	false
Applying props
To customize the appearance of an icon, you can pass custom properties as props directly to the component. The component accepts all SVG attributes as props, which allows flexible styling of the SVG elements. See the list of SVG Presentation Attributes on MDN.


<script>
  import { Phone } from '@lucide/svelte';
</script>

<Phone fill="#333" />
This results a filled phone icon.

Types
The package includes type definitions for all icons. This is useful if you want to dynamically load icons with the svelte:component directive whether you are using TypeScript or JSDoc.

TypeScript Example

Svelte 5

Svelte 4

<script lang="ts">
  import { Home, Library, Cog, type Icon as IconType } from '@lucide/svelte';

  type MenuItem = {
    name: string;
    href: string;
    icon: typeof IconType;
  };

  const menuItems: MenuItem[] = [
    {
      name: 'Home',
      href: '/',
      icon: Home
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: Library
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Cog
    }
  ];
</script>

{#each menuItems as item}
  {@const Icon = item.icon}
  <a href={item.href}>
    <Icon />
    <span>{item.name}</span>
  </a>
{/each}