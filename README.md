# Advanced Vanilla JS router within 100 lines

## What is this ?

A advanced vanilla JS router in the form of a eclipse IDE
Javascript web project

## Versions
- Router.js -> with jsdoc
- RouterNoJsDoc.js -> without jsdoc (93 lines)

##  Features

- Capable of rendering a particular template on URL changes.
- Based on # change logic
- Fetches template only when needed
- This is made possible through a template cache available within the router
- When enabled, template cache ensures templates are requested only once from server
- Super easy to bootstrap in your app
- Extremely small <100 lines when comments removed

## How to configure and use router

###Router can be used in 3 simple steps

#### Step 1: Ensure that you have JQUERY 

Since router relies on jquery for contacting
the server in order to fetch templates.

#### Step 2: init the router

``
	router.init("", true, "tplContainer");
``

The init accepts 3 params :

1. template base directory
2. enable template Cache or not ?
3. id of DOM element which will contain the rendered template
contents

#### Step 3: add the routes

Route constructor takes 2 params :

1. URL fragment after the # in your URL.
2. URL for downloading the template from server.

for e.g :
Let's say you need to render ``starters.html`` present in server
when user clicks on the following tag : ``<a href="#getStarters"></a>``
You will add the route to the router in the following manner in your JS :

``
router.addRoute(new Route("getStarters", "starters.html"));
``

That's it !! **your routing is setup with 2 JS statements.**

## How to import the DEMO project in eclipse

1. Open eclipse IDE
2. File -> Import -> General -> Existing project in workplace -> Browse
3. Point to the cloned directory
4. Click finish

## How to run the DEMO project

1. Right click on the imported project in eclipse
2. Select Run as -> run on server -> select HTTP preview server
3. Click on next -> finish
4. Wait for eclipse to configure server.
5. once config done, navigate to http://localhost:8080/advanced_vanilla_js_router/HTML/index.html