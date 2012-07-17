var cur_url,
	def_ip = 'No&nbsp;network&nbsp;traffic&nbsp;for&nbsp;this&nbsp;tab&nbsp;yet.',
	cur_ip = def_ip;
function parse_url(l_url) {
	return l_url.replace(/^(([^:/?#]+):)?(\/\/([^/?#]*)|\/\/\/)?([^?#]*)(\\?[^#]*)?(#.*)?/,'$3').replace('//', '');
}
function set_badge(ip) {
	var bdg = (ip) ? ip.substr(ip.lastIndexOf('.') + 1) : '',
		mnems = JSON.parse(localStorage.getItem('mnems')) || {};
	if (mnems[ip]) {
		bdg = mnems[ip].mnem;
	}
	chrome.browserAction.setBadgeText({'text':bdg});
}
function show_cur_ip() {
	if (! cur_ip) {
		cur_ip = def_ip;
		set_badge('');
	} else {
		set_badge(cur_ip);
	}
}
function tab_changed_now_update (tab_id) {
	chrome.tabs.get(tab_id, function (ctab) {
		// just change the badge and popup if the current url either wasn't present or it changed
		if (ctab && ctab.url && (ctab.url.length > 0) && ((! cur_url || cur_url.length === 0) || ((cur_url.length > 0) && cur_url !== parse_url(ctab.url)))) {
			cur_url = parse_url(ctab.url);
			cur_ip = localStorage.getItem(cur_url);
			show_cur_ip();
		}
	});
}
chrome.webRequest.onCompleted.addListener(function (d) {
	if (d.url && d.ip) {
		cur_url = parse_url(d.url);
		cur_ip = d.ip;
		try {
			localStorage.setItem(cur_url, cur_ip);
		} catch (e) {
			// storage full - figure out how to delete 'old' url's
		}
		show_cur_ip();
	}
}, {'urls' : [], 'types' : ['main_frame']});
chrome.tabs.onUpdated.addListener(function (tab_id, tab) {
	tab_changed_now_update(tab_id);
});
chrome.tabs.onActivated.addListener(function (active_info) {
	tab_changed_now_update(active_info.tabId);
});
