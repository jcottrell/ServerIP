var ip_div = document.createElement('div'),
	bgPage = chrome.extension.getBackgroundPage(),
	init = function () {
		ip_div.innerHTML = bgPage.cur_ip;
		document.body.appendChild(ip_div);
	};
init();
