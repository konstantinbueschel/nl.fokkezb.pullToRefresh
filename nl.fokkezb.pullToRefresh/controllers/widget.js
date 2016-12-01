var LTAG = '[nl.fokkezb.pullToRefresh]',
    refreshControl, list;

/**
 * SEF to organize otherwise inline code
 *
 * @private
 * @param {Object} args
 * @returns void
 */
(function constructor(args) {
    
    if (args.dontInit || (!OS_IOS && !OS_ANDROID)) {
        
        args.dontInit || Ti.API.warn(LTAG, 'Supports only iOS and Android.');
        
        _.isArray(args.children) && _.map(args.children, $.addTopLevelView);
        
        return;
    }
    
    if (!_.isArray(args.children) || !_.contains([
            
            'Titanium.UI.ListView', 'Titanium.UI.TableView', 'Ti.UI.ListView', 'Ti.UI.TableView', 'de.marcelpociot.CollectionView'
        
        ], args.children[args.children.length - 1].apiName)) {
        
        console.error(LTAG, 'Missing required Ti.UI.ListView or Ti.UI.TableView or de.marcelpociot.CollectionView as first child element.');
        
        return;
    }
    
    list = _.last(args.children);
    delete args.children;
    
    _.extend($, args);
    
    if (OS_IOS) {
        
        refreshControl = Ti.UI.createRefreshControl(args);
        
        refreshControl.addEventListener('refreshstart', onRefreshstart);
        
        list.refreshControl = refreshControl;
        
        $.addTopLevelView(list);
    }
    else if (OS_ANDROID) {
        
        refreshControl = require('com.rkam.swiperefreshlayout').createSwipeRefresh(_.extend({
            
            view: list
            
        }, args));
        
        refreshControl.addEventListener('refreshing', onRefreshstart);
        
        $.addTopLevelView(refreshControl);
    }
    
    
    // PUBLIC INTERFACE
    $.refresh = refresh;
    $.show = show;
    $.hide = hide;
    $.getList = getList;
    $.getControl = getControl;
    
})(arguments[0] || {});


function refresh() {
    
    if (!list) {
        
        return;
    }
    
    show();
    
    onRefreshstart();
    
} // END refresh()


function hide() {
    
    if (!refreshControl) {
        
        return;
    }
    
    if (OS_IOS) {
        
        refreshControl.endRefreshing();
    }
    else if (OS_ANDROID) {
        
        refreshControl.setRefreshing(false);
    }
    
} // END hide()


function show() {
    
    if (!refreshControl) {
        
        return;
    }
    
    if (OS_IOS) {
        
        refreshControl.beginRefreshing();
    }
    else if (OS_ANDROID) {
        
        refreshControl.setRefreshing(true);
    }
    
} // END show()


function getList() {
    
    return list;
    
} // END getList()


function getControl() {
    
    return refreshControl;
    
} // END getControl()


function onRefreshstart() {
    
    $.trigger('release', {
        source: $,
        hide: hide
    });
    
} // END onRefreshstart()
