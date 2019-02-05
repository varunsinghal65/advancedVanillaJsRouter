/**
 * Route constructor
 *
 * @param {String} url
 * @param templateUrl
 */
var Route = function(url, templateUrl){
    this.url = url;
    this.tplUrl = templateUrl;
};

/**
 * Vanilla JS router based on super strict matching
 */
var router = {
    routes : [],
    tplCache : [],
    isCacheEnabled : false,
    tplBaseDirectory  : "",
    tplJqueryDomContainerId : ""
};

router.init = function (tplBaseDirectory, enableTplCache, tplJqueryDomContainerId) {
    this.tplBaseDirectory = tplBaseDirectory;
    this.isCacheEnabled = enableTplCache;
    this.tplJqueryDomContainerId = tplJqueryDomContainerId;
};

/**
 * Queries {router.routes} to find a route having the currentUrl
 */
router._findRoute = function(currentUrl) {
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
    var requestedRouteObj = this._findRoute(requestedRouteUrl);
    if (requestedRouteObj) {
        //retrieve the tpl
        var tpl = this._retrieveTpl(requestedRouteObj.tplUrl);
        // replace the view with tpl contents
        $(this.tplJqueryDomContainerId).innerHTML = tpl;
    } else {
        console.warn("Route not found");
    }
};

router.addRoute = function(route) {
    if (route && route.url && route.tplUrl) {
        this.routes.push(route);
    }
    else {
        console.error("Invalid route received for addition");
    }
};

router._retrieveTpl = function(tplUrl) {
    var cachedTpl = this.tplCache[tplUrl];
    var tpl = "Unable to retrieve Template";
    if (cachedTpl) {
        tpl = cachedTpl;
    } else {
        tpl = this._retrieveTplFromServer(tplUrl);
        if (this.isCacheEnabled) {
            this.tplCache.push({tplUrl : tpl});
        }
    }
    return tpl;
};

router._retrieveTplFromServer = function(tplUrl) {
    var tpl = "Unable to retrieve tpl from server";
    var request = $.ajax({
        url: this.tplBaseDirectory + tplUrl,
        async : false
    });
    request.done(function (fetchedTpl) {
        tpl = fetchedTpl;
    });
    return tpl;
};

router.flushTplAndRoutes = function() {
    this.routes = [];
    this.tplCache = [];
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
