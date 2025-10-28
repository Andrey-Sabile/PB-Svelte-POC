The missing guide to understanding adapter-static in SvelteKit
Guides & TutorialsStanislav Khromov30th Jul '23
In this guide we will go through the characteristics and quirks of adapter-static, which is unique amongst all SvelteKit adapters because it compiles down to a folder of HTML, CSS and JavaScript instead of a serverless function or Node.js server.

Many wonder how this can work with the server side-oriented nature of SvelteKit – let’s dive into it with practical examples. You can find the companion repo here (in deployed form here) if you want to see the whole project.

This article is divided into multiple topics, feel free to check out the table of contents for things that you might be interested in!

Table of contents  show 
Getting started with adapter-static
To start using the static adapter, we first install it into a brand new SvelteKit project as a dev dependency:

npm i -D @sveltejs/adapter-static
Then we change svelte.config.js file to use it by replacing the adapter config:

- import adapter from '@sveltejs/adapter-auto';
+ import adapter from '@sveltejs/adapter-static';
Now we can run npm run build to build the project. The output will be a folder called build/ with the HTML, CSS and JavaScript files that make up our project.

Fixing the “all routes must be fully prerenderable” error
This is an error that everyone used adapter-static has encountered. The key to fixing the error is to understand how dynamic routes work.

SvelteKit essentially has two modes for routing when using adapter-static. You can either route to known, prerendered routes, or unknown, dynamic ones. The difference is that a known, prerendered route generates an associated .html file that represents the HTML content for that route. For example, if we have a prerendered route under:

src/routes/prerendered/+page.svelte
src/routes/prerendered/+page.js # contains "export const prerender = true;"
This would generate the following HTML structure when built, with a prerendered.html file. Let’s see what the directory would look like after building:

tree build/ -L 1
build/
...
├── index.html
├── prerendered.html
In contrast, if we change our prerendered route to a dynamic one:

src/routes/dynamic/+page.svelte
src/routes/dynamic/+page.js # contains "export const prerender = false;"
…and then try to build the application, we can see that no dynamic.html file is created:

tree build/ -L 1
build/
...
├── index.html
# No dynamic.html file!
The default for SvelteKit is to assume all routes are dynamic, so you either need to set set export const prerender = true in the root +layout.js to get rid of the message (explicitly setting all routes as prerenderable), or enable the fallback option.

How do dynamic routes work?
Before we talk about the fallback option, you might wonder how dynamic routes can work if they don’t exist in the output? The answer is that they use client side rendering and a bit of server-side routing magic. If we look at the official documentation for the fallback option we can read that “The fallback page is an HTML page created by SvelteKit from your page template (e.g. app.html) that loads your app and navigates to the correct route.”

In order to understand the behavior of a prerendered vs dynamic route, let’s look at a diagram:


As we see, dynamic routes work by cooperating with the underlying web server. The web server sees a 404 error (beause the dynamic route does not exist on the file system) and instead loads a fallback page that SvelteKit generates using the fallback option. This special page will then client side render the correct path in the browser. This means that once we configure the fallback option, we no longer need to set all routes as prerenderable.

For end users, the crucial takeaway is that prerendered routes can be SSR rendered with the static adapter, thus getting performance and SEO benefits. Dynamic routes can be used and can even load personalized and dynamic data for each user, but can not use SSR.

Setting up the fallback configuration
Configuring the fallback setting in SvelteKit can be done in your svelte.config.js file:

- adapter: adapter(),
+ adapter: adapter({ fallback : '404.html' }),
Now, you need to tell your web server to load 404.html when it encounters an error. For example, in Apache you can use the configuration:

ErrorDocument 404 /404.html
In our companion repo we use the http-server NPM module to run the project, which defaults to using 404.html as the 404 page fallback.

Understanding trailingSlash
The trailingSlash: 'always' option changes the names of the built output for each route from /route-name.html to /route-name/index.html. This works better for some servers because typically if you navigate to /route-name/ most web servers will look for an index.html file in the /route-name/ folder. In my experience, you typically want to enable this by setting the following in your src/routes/+layout.js:

export const trailingSlash = 'always';
Using SvelteKit as a traditional SPA
To use SvelteKit as a traditional Single Page Application (Like the classic “Create React App”) we need SvelteKit to:

Not try to prerender or SSR anything (ie. not generate any .html files for routes at all)
Always return an empty “shell” HTML file which just loads the associated JavaScript, which then handles all the heavy lifting.
To accomplish this, we need to disable SSR and prerendering altogether. In src/routes/+layout.js, we set:

export const prerender = false;
export const ssr = false;
Now your app will behave just like any SPA. You can even ignore some SvelteKit conventions (for example, you don’t have to wrap browser-only code with if(browser) since SvelteKit will never run your components on the server). However I would not recommend this as it can quickly become a mess if you ever want to enable SSR again.

+server.js endpoints
In any adapter other than the static one, server endpoints will be deployed as dynamic server-side code. On Vercel you’ll get a serverless function and on the Node adapter you’ll get a route in the Polka-based Express.js-like server that is built.

But there is no way we could compile a dynamic server side endpoint into a static JavaScript file. By default, adapter-static will instead strip out +server.js files completely.

But there is a use case where we might want to generate a static output from a +server.js file and SvelteKit exposes this via the export const prerender = true; option. By setting this inside the endpoint file, SvelteKit will create an output file at build time for the endpoint. Let’s illustrate with an example. If we have a file called src/routes/randomNumber.json/+server.js that looks like this:

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
    const randomNumber = Math.random();
    return json({
        randomNumber
    });
}

export const prerender = true;
Once we build the app and inspect the directory, we’ll see that a randomNumber.json file was created:

# npm run build
# ...
# tree build/ -L 1
build/
├── _app
├── favicon.png
├── index.html
└── randomNumber.json
If we open the file, we’ll see it’s exactly what we expect – a random number that was generated at build time:

{
    "randomNumber": 0.44040173838860297
}
While the prerender technique does not allow us to personalize data, it’s still very useful for prefetching data from a CMS or other data source at build time. Whenever the underlying data changes, we can trigger a rebuild of the site to update it with new data.

+page.server.js load functions
The +page.server.js endpoints are supposed to run only on the server, so how can that work with adapter-static? By default, much like +server.js files, server load functions won’t work by using the default configuration. The +page.server.js code will be stripped out of the output. This means if you use these functions they will always fail to load once you build your app. The unfortunate thing is that Vite is not aware of this limitations (or even which adapter we are using), so you cannot test this behavior with npm run preview. But you can test it by running the site on a standalone web server, by building the site and then running npm run build && npx http-server ./build.

But just like with +server.js function, there is a way to use +page.server.js load functions with adapter-static, and it’s the same fix – you need to set them as prerenderable.

What will a prerendered load function look like? Let’s perform an experiment. First let’s create a very simple component that shows a random number coming from a server load function under src/routes/server-load/+page.svelte:

<script>
	export let data;
</script>

<h1>
	A (maybe?) random number: {data.number}
</h1>
And the accompanying load function under src/routes/server-load/+page.server.js. Note that we use prerender = true here, otherwise the function will not work as noted earlier.

export const load = async () => {
	return {
		number: Math.random(),
	};
};

export const prerender = true;
Now let’s build the site and see the output:

# npm run build
# tree build -L 2
build
├── ...
└── server-load
    ├── __data.json
    └── index.html
Aside from the HTML file that was generated, we also got a __data.json file. This is the actual contents of our built load function! Let’s see what it contains:

{
    "type": "data",
    "nodes": [
        null,
        {
            "type": "data",
            "data": [
                {
                    "number": 1
                },
                0.8636617558590938
            ],
            "uses": {}
        }
    ]
}
There is a little bit of boilerplate in here that SvelteKit adds, but we can unmistakably see that we generated a number.

This example highlights the limitations of server load functions with adapter-static – they cannot update their data once built. The above function will always return the same number:

This does not mean server load functions are useless – just like +server.js endpoints, you can use them to build static data like a list of your latest blog posts, and then just rebuild the site once the content changes.

+page.js load functions
+page.js load functions are called “universal” because they run both in the browser and on the server. In any other adapter, this means that the universal load function will be executed on the server as part of SSR. If it performs any fetch calls those will be performed on the server and the results will be sent as serialized data to the client. This is done to avoid performing the request twice – once on the server and once on the client.

When building with adapter-static, the +page.js load function will not work like this, instead it will run twice:

Once when building the site for the first time (on the server) – the output of this function is baked into the generated HTML if SSR is enabled.
Every time the user loads the page (on the client).
This means that a +page.js load function is an excellent place to put client side logic. For example, you can use it to load dynamic user data using fetch. Just keep in mind that it will run once during build. For most applications that have some sort of user login system, this means that it will most likely render the “logged out state”, because there are no user-set cookies or localStorage values available during server build.

How does SSR work with static sites?
SSR works similarly to +page.server.js. During build time, SvelteKit will invoke the load functions in +page.js and +page.server.js if they exist, and generate a HTML output based on this result. This HTML output will never change unless you rebuild the project. This feature is very powerful because it means we can reap the benefits of SEO (Google and other search engines prefer fully rendered HTML sites) thanks to SSR, together with the speed of a fully static site that can be deployed across the globe.

Sometimes we don’t want SSR. For example, if you are building a client-side rendered app that will handle complicated logic client side. In this case, it’s easiest to disable SSR globally by adding the following to your src/routes/+layout.js file, just as we did in the “Using SvelteKit as a traditional SPA” chapter.

export const ssr = false;
What this will do is prevent SvelteKit from generating the HTML output.

Let’s say we have a basic route like this under src/routes/ssr/+page.svelte

<h1>Hello world!</h1>
Let’s now compare the output starting with setting export const ssr = true; in src/routes/ssr/+page.js.

# curl http://localhost:5173/ssr/
<!-- Some output omitted for brevity -->
<!DOCTYPE html>
<html lang="en">
	
<body data-sveltekit-preload-data="hover">
	<div style="display: contents">  
		<h1 data-svelte-h="svelte-1vv3a6r">
			Hello world!
		</h1> 
		<script>
			{
					// SvelteKit hydration initialization
			}
		</script>
	</div>
</body>
As we can see, <h1>Hello world!</h1> is part of the HTML output. Search engines are happy because they can read the content easily and users are happy because the browser will show the content to them immediately!

Let’s now disable SSR with export const ssr = false; and compare:

# curl http://localhost:5173/ssr/
<!-- Some output omitted for brevity -->
<!DOCTYPE html>
<html lang="en">
	
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">
			<script>
			{
					// SvelteKit hydration initialization
			}
			</script>
		</div>
	</body>
</html>
It looks similar but the <h1> tag is completely missing now! It will still show up in the browser if we look at the page, but only after SvelteKit hydrates the page for us.

Prerendering (SSG)
Let’s imagine we are building a blog that will be deployed on a static host like GitHub Pages. We’re going to use the {JSON} Placeholder API for this. First let’s write the +page.server.js load function that will load our blog posts, in src/routes/+page.server.js:

export async function load({ params }) {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    const first10posts = posts.slice(0, 10);
    return {
        posts: first10posts,
    };
}

export const prerender = true;
Now let’s add the frontend in src/routes/+page.svelte:

<script>
    export let data;
</script>
<h1>Blog posts</h1>

{#each data.posts as post}
    <h2>{post.title}</h2>
    <a href="/posts/{post.id}">Read more</a>
{/each}
This gives us a beautiful minimalistic blog page:


Now let’s add the route for individual posts. In src/routes/posts/[id]/+page.server.js:

export async function load({ params }) {
    const id = params.id;
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    const post = await response.json();

    return {
        post
    };
}

export const prerender = true;
And the frontend in src/routes/posts/[id]/+page.svelte:

<script>
    export let data;
</script>

<a href="/">Back</a>
<br/>

<h1>{data.post.title} </h1>
<p>{data.post.body}</p>
And here is the output of a single post page:


Now when we build the project, SvelteKit will crawl our index page and find all the individual blog posts. So in our output it will actually render all our 10 blog posts with full SSR support! Let’s prove it by loooking at the build output:

# npm run build
# tree build -L 3
build
├── # ...
├── posts
│   ├── 1
│   │   ├── __data.json
│   │   └── index.html
│   ├── 2 # All posts have an index.html!
│   ├── 3
│   ├── 4
│   ├── 5
│   ├── 6
│   ├── 7
│   ├── 8
│   └── 9
│   ├── 10
This is a very powerful feature that makes SvelteKit a fanastic fit for SSG sites!

There is one problem however – what if there are no links to some of our dynamic content? To fix this, SvelteKit gives us two different solutions – pick the one that fits best with your use case:

Export an entries function that can generate a list of all your content on a per-route basis.
Set a list of entries under config.kit.prerender.entries in svelte.config.js
A note on dev mode
When we use npm run dev, SvelteKit is not really aware that we have configured adapter-static. So SvelteKit acts like we had any dynamic adapter. For example, data in load function will be reloaded on every page load rather than just once on startup. This is quite convenient because it would get rather annoying if you had to restart the dev server every time you wanted to update the data, but it can give the wrong impression about how the site will function after building.

Conclusion
While adapter-static works differently than other adapters, it allows us to use many powerful features of SvelteKit, like server side rendering (SSR) as well as rendering dynamic routes, thus making it just as powerful as other approaches such as using a custom Vite setup. In fact it’s even easier because you’ll have access to the excellent client-side router and data loading functions present in SvelteKit! If your question is “should I use SvelteKit for static and/or SPA sites?” – the answer is a resounding yes!

Did you enjoy the blog post? Was anything unclear? Leave a comment below!