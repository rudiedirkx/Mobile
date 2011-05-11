
(function() {

	/** config **/
	var speed = 500,
		orientation = false;
	var scripts = document.getElementsByTagName('script'),
		config = (scripts[scripts.length-1].getAttribute('src') || '').split('#'),
		config = '&' + (config[1] || '') + '&';
	if ( config ) {
		if ( /&once&/.test(config) ) {
			speed = 0;
		}
		else {
			if ( (m = config.match(/&speed=(\d+)&/)) ) {
				speed = parseInt(m[1]);
			}
		}
		if ( config && 0 <= config.indexOf('orientation') ) {
			orientation = true;
		}
	}
//console.log('orientation: ' + orientation + "\nspeed: " + speed);

	/** support functions **/
	function each(list, fn) {
		for ( var k=0; k<list.length; k++ ) {
			fn(list[k], k, list);
		}
		return list;
	}

	/** test stylesheets **/
	function evalLinkScripts(sss) {
		if ( orientation ) {
			var html = document.documentElement, no = document.documentElement.clientWidth > document.documentElement.clientHeight ? 'landscape' : 'portrait';
			html.className = html.className.replace(/(^|\s)(landscape|portrait)(\s|$)/g, '$1$3').replace(/\s+$/, '') + ' ' + no;
		}
		each(sss, function(ss) {
			if ( ss.mqsupport ) {
				var enabled = ss.mqsupport();
				if ( enabled === ss.disabled ) {
					ss.disabled = !enabled;
				}
			}
		});
	}
	/** initiate tests **/
	function initLinkScripts() {
		var sss = each(document.getElementsByTagName('link'), function(ss) {
			var m = ss.getAttribute('media');
			if ( m && m.match(/^only \(/) ) {
				var media, fn = m.substr(5);
				fn = fn.replace(/\((min|max)\-width:\s*(\d+)(?:px|)\)/g, function(match, minmax, width){
					return '(document.documentElement.clientWidth ' + ( 'min' == minmax ? '>' : '<' ) + '= ' + width + ')';
				}).replace(/\(orientation:(portrait|landscape)\)/g, function(match, orientation) {
					return '(document.documentElement.clientWidth ' + ( 'landscape' == orientation ? '>' : '<' ) + ' document.documentElement.clientHeight)';
				}).replace(/\s+and\s+/g, ' && ');
				eval('fn = function(){ return ' + fn + '; }');
				try {
					var enabled = fn();
					ss.disabled = !enabled;
					ss.removeAttribute('media');
					ss.mqsupport = fn;
				}
				catch (ex) {
					// 'invalid' media query, so do nothing, so let the browser handle this
				}
			}
		});
		if ( !isNaN(speed) && 0 < speed ) {
			setInterval((function(ss) { return function() { evalLinkScripts(ss); }; })(sss), speed);
		}
	}
	initLinkScripts();

})();
