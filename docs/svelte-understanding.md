Routing
All files can run on the server
All files run on the client except +server files
+layout and +error files apply to subdirectories as well as the directory they live in

For my use case
SSG + SPA

SSG

SPA

Svelte Kit
Universal Load
Load and fetch() in +page.js route files

Can hard rerun load functions by using the invalidate() function. Which takes a url and re-runs any load functions that depend on it. (Runes - reactivity magic)
