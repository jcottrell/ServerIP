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
	ipToCopy = ip;
}

function tab_changed_now_update (tab_id) {
	chrome.tabs.get(tab_id, function (ctab) {
		if (ctab && ctab.url && (ctab.url.length > 0)) {
			set_badge(localStorage.getItem(parse_url(ctab.url)));
		}
	});
}

function copyToClipboard( text ){
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(copyDiv);
}

// extension button clicked, make sure badge is correct and toggle ip address on page
chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.getSelected(null, function (tab) {
		tab_changed_now_update(tab.id);
		chrome.tabs.sendMessage(tab.id, {'toggle':true}, function () {});
	});
	copyToClipboard(ipToCopy);
});

// response to the content script executed for the page
chrome.extension.onMessage.addListener(function (request, sender, response_func) {
	var response = {},
		sips = JSON.parse(localStorage.getItem('sips')) || {};
	if (request.hasOwnProperty('load') && request.load) {
		response.visible = sips.hb;
		response.my_url = parse_url(sender.tab.url);
		response.my_ip = localStorage.getItem(response.my_url);
		response_func(response);
	}
});

// listeners for the IP address changes
chrome.webRequest.onCompleted.addListener(function (d) {
	if (d.url && d.ip) {
		try {
			localStorage.setItem(parse_url(d.url), d.ip);
		} catch (e) {
			// storage full - figure out how to delete 'old' url's
		}
		set_badge(d.ip);
	}
}, {'urls' : [], 'types' : ['main_frame']});
chrome.tabs.onUpdated.addListener(function (tab_id, tab) {
	tab_changed_now_update(tab_id);
});
chrome.tabs.onActivated.addListener(function (active_info) {
	tab_changed_now_update(active_info.tabId);
});
chrome.windows.onFocusChanged.addListener(function (window_id) {
	chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, {'populate':true}, function (win) {
		var ctab_id, tab_i, tab_len;
		if (win && win.tabs) {
			tab_len = win.tabs.length;
			for (tab_i = 0; tab_i < tab_len; tab_i += 1) {
				if (win.tabs[tab_i].active) {
					ctab_id = win.tabs[tab_i].id;
				}
			}
			if (ctab_id) {
				tab_changed_now_update(ctab_id);
			}
		}
	});
});
