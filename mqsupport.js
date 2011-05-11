
(function() {

	function each(list, fn) {
		for ( var k=0; k<list.length; k++ ) {
			fn(list[k], k, list);
		}
		return list;
	}
	function trim(str) {
		return str.replace(/^\s+/, '').replace(/\s+$/, '');
	}
	function vpwidth() {
		return document.documentElement.clientWidth;
	}
	function vpheight() {
		return document.documentElement.clientHeight;
	}
	function filter(list) {
		var r = [];
		each(list, function(v) {
			if ( v ) r.push(v);
		});
		return r;
	}
	function getHandler(name) {
		var handlers = {
			'orientation': function(val) {
				if ( 'portrait' == val && vpwidth() < vpheight() ) {
					return true;
				}
			},
			'max-width': function(val) {
				return vpwidth() <= parseFloat(val);
			},
			'min-width': function(val) {
				return vpwidth() >= parseFloat(val);
			},
			'max-height': function(val) {
				return vpheight() <= parseFloat(val);
			},
			'min-height': function(val) {
				return vpheight() >= parseFloat(val);
			}
		};
		return handlers[name];
	}
	function map(list, fn) {
		var r = [];
		each(list, function(el) {
			r.push(fn(el));
		});
		return r;
	}
	function parseMediaAttribute(media) {
		media = media.replace(/(all|handheld|only|print|projection|screen|device\-)/gi, '');
		var ors = filter(map(media.split(','), trim));
		var enable = true;
		each(ors, function(conditions) {
			var ands = filter(map(conditions.split('and'), trim)), musthave = ands.length, dohave = 0;
			each(ands, function(condition) {
				var x = condition.substr(1, condition.length-2).split(':');
				var h = getHandler(x[0]);
				if ( h && h(x[1]) ) dohave++;
			});
			if ( musthave && dohave < musthave ) enable = false;
		});
		return enable;
	}
	function mediaAttributeDoable(media) {
		return '' != trim(media.replace(/(all|handheld|only|print|projection|screen|and|,)/gi, ''));
	}
	function evalLinkScripts() {
		each(document.getElementsByTagName('link'), function(ss) {
			var mq = ss.getAttribute('xmedia');
			if ( mq ) {
				ss.disabled = !parseMediaAttribute(mq);
			}
			else {
				var mq = ss.getAttribute('media');
				var doable = mq && mediaAttributeDoable(mq);
				if ( doable ) {
					ss.removeAttribute('media');
					ss.setAttribute('xmedia', mq);
					ss.disabled = !parseMediaAttribute(mq);
				}
			}
		});
	}
	evalLinkScripts();
	var ua = navigator.userAgent.toLowerCase();
	function contains(ab, a) {
		return -1 != ab.indexOf(a);
	}
	if ( !contains(ua, 'mobile') && !contains(ua, 'opera mini') ) {
		setInterval(evalLinkScripts, 900);
	}

})();
