/**
 * Route constructor
 * 
 * @param {String} url 
 * @param {Function} callBackFn 
 * @param {Object} callBackFnScope 
 */
var Route = function(url, callBackFn, callBackFnScope){
    this.url = url;
    this.Fn = {};
    this.Fn.fnObj = callBackFn;
    this.Fn.scope = callBackFnScope;
};

/**
 * Vanilla JS router based on super strict matching
 */
var router = {
    routes : [],
};

/**
 * Queries {router.routes} to find a route having the currentUrl
 */
router.findRoute = function(currentUrl) {
    var noOfRoutes = this.routes.length;
    if (this.routes.length === 0) {
        console.warn("Routes are empty, cant match");
        return;
    }
    for (var i = 0; i < noOfRoutes; i++) {
        var route = this.routes[i];
        if (route.url === currentUrl) {
            return route;
        }       
    }
};

/**
 * Routes control to the relevant callback function
 * depending on the route determined
 */
router.route = function() {
    var requestedRouteUrl = window.location.href.split("#")[1];
    //retrieve the stored route object corresponding to URL
    var requestedRoute = this.findRoute(requestedRouteUrl);
    if (requestedRoute) {
        //call the callback function with current scope
        requestedRoute.Fn.fnObj.apply(requestedRoute.Fn.scope);
    } else {
        console.warn("Route not found");
    }
};

router.addRoute = function(route) {
    if (route && route.Fn && route.Fn.fnObj && route.Fn.scope) {
        this.routes.push(route);
    }
    else {
        console.error("Invalid route received for addition");
    }
};

router.flushRoutes = function() {
    this.routes = [];
};

/**
 * Note : This has to be placed after router.route is defined
 * 
 * This wires the the {router.route} method to HashChange event
 * Whenever # changes in URL, this event is fired, which in turn 
 * fires the route method to compute route and transfer control
 * accordingly
 */
window.addEventListener("hashchange", router.route.bind(router), false);


/**
 * TESTING the router
 */

 var route1CallBack = function() {
     alert("routed to 1 with scope " + this.routeNumber);
 };

 var route2CallBack = function() {
    alert("routed to 2 with scope " + this.routeNumber);
};

var route3CallBack = function() {
    alert("routed to 3 with scope " + this.routeNumber);
};

router.addRoute(new Route("r1",route1CallBack,{"routeNumber":"1"}));
router.addRoute(new Route("r2",route2CallBack,{"routeNumber":"2"}));
router.addRoute(new Route("r3",route3CallBack,{"routeNumber":"3"}));
router.addRoute(new Route());