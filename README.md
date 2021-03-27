# Slate-2
Advanced Shopify Theme development toolkit.

_Forked from the now defunct [@Shopify/slate](https://github.com/Shopify/slate)_

## Purpose
Shopify is a SaaS ecommerce platform that offers a basic ability to build a shop
frontend. Through the years Shopify has supported its Liquid templating language
and (now deprecated) SCSS Precompiler, however as the needs of merchants has 
significantly scaled and for advanced, modern theme development the base theme
development tools (themekit) has not been able to fill the needs of developers.

As an intermediary solution until more modern and robust solutons such as 
headless are fully built out, Slate will allow you to build Shopify Themes using
all of your modern tools such as TypeScript, ES6, _Real_ SCSS, etc.


## History

Slate was originally based on a gulp watcher that would bundle scripts and SCSS
into flat files for direct serving to clients. Internally we would refer to this
version as "Slate 0" and had many issues, most commonly still relying upon the
use of Vanilla JavaScript, and non-spec SCSS using Shopify's native Liquid SCSS
compiler.

After some time Shopify released an updated beta version of slate using webpack
under the hood to do precompilation prior to uploading the assets to the Shopify
server for use in a Shopify theme. Internally we refer to this as "Slate 1" and
was well supported throughout 2017 and 2018. Since mid 2019 Shopify has not been
doing active development on Slate 1.

Due to a need for our internal development team to continue to use the Slate 1
toolset, alongside having retrained our staff to use the toolset, it was decided
to update and maintain slate 1 and bring it in line with how our development
process has changed over the last few years.

Slate 2 (this package) is the culmination of our theme development efforts, and
marks the first pillar in our transition to bring the Shopify theme tools up to
a standard that we are happy with.

## Differences between Slate 1
Slate 2 is currently designed to be as close to Slate 1 as possible. Anyone who
is transitioning from Slate 1 should be able to get up and running with Slate 2
fairly easily by simply updating the reference to the node package in the
`package.json` of your theme.

There are a few differences that may make your development flow not (currently)
compatible with Slate 2. These include;
- Removal of custom slate.config.js, which also means no custom webpack compiler
rulesets (such as adding React, etc. in)
- Removal of a few slate packages such as slate-cssvar-loader
- A few minor tweaks to filenames and how scripts/styles themselves are loaded,
mostly to fix some bugs and to make code splitting actually work properly now.
- Removal of the slate unit tests, this is a decision made to allow travis to
focus on new software we're writing as we transition the slate toolkit to our
repo.
- Changes to logging to be "less spammy"
- Change default opened url from the local server to the *.myshopify url
- Nuking of Slate Analytics
- Slate Sections Plugin allows subdirs on sections and snippets, will likely be
renamed to be more appropriate soon

## Roadmap
Bellow is our roadmap, it's in an "ideal" order but priorities do shift and this
will not be absolute.
- ~~Resolve known bugs and update packages to the new decade.~~
- ~~Try and rewrite some of the modules in TypeScript and normalize the codebase~~
- Restore a slate.config.js or similar method of customising the build
- Write some documentation and Unit tests
- Build some common libraries and tools that are being written multiple times
- Remove Browser Sync and replace with something more appropriate
- Segment builds by environments, this will allow for multiple builds to run
concurrently.

## Testing
Testing is automatically done by travis. Currently unit tests are limited to 
only ensuring `package.json` files are setup correctly.