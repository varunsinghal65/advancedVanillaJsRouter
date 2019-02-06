var Route = function(url, templateUrl){
    this.url = url;
    this.tplUrl = templateUrl;
};
var router = {
    routes : [],
    tplCache : {},
    isCacheEnabled : false,
    tplBaseDirectory  : "",
    tplDomContainerId : ""
};
router.init = function (tplBaseDirectory, enableTplCache, tplDomContainerId) {
    this.tplBaseDirectory = tplBaseDirectory;
    this.isCacheEnabled = enableTplCache;
    this.tplDomContainerId = tplDomContainerId;
};
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
router.route = function() {
    var url = window.location.href;
    var isValidRouteUrl = this._isValidRouteUrl(url);
    if (isValidRouteUrl) {
        //get the url fragment having route details
        var requestedRouteUrl = url.split("#")[1];
        //retrieve the stored route object corresponding to URL
        var requestedRouteObj = this._findRoute(requestedRouteUrl);
        var tpl = "";
        if (requestedRouteObj) {
            //retrieve the tpl
            tpl = this._retrieveTpl(requestedRouteObj.tplUrl);
        } else {
            console.warn("Route not found");
        }
        // replace the view with tpl contents
        document.getElementById(this.tplDomContainerId).innerHTML = tpl;
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
            this.tplCache[tplUrl] = tpl;
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
router._isValidRouteUrl = function(url) {
    var result = false;
    if (/^[^#]+\#[^#]+$/.exec(url)) {
        result = true;
    }
    return result;
};
router.flushTplAndRoutes = function() {
    this.routes = [];
    this.tplCache = {};
};
window.addEventListener("hashchange", router.route.bind(router), false);
document.addEventListener("DOMContentLoaded", router.route.bind(router), false);
