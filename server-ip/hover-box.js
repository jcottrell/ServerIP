var hov = document.createElement('div'), hovConfig = {},
	hbId = 'server_ip_sips_hover_box_id';
function add_hover_box() {
	var hs = hov.style;
	hs.position = 'fixed';
	hs.top = '10px';
	hs.right = '10px';
	hs.padding = '4px 6px';
	hs.border = '1px solid black';
	hs.backgroundColor = 'rgba(247,85,100,0.75)';
	hs.webkitBorderRadius = '12px';
	hs.fontSize = '10px';
	hs.fontFamily = 'arial';
	hs.fontWeight = 'normal';
	hs.lineHeight = '12px';
	hs.color = '#222';
	hs.zIndex = 100001; /* above WP admin bar */
	hov.id = hbId;
	hov.dataset.sipState = 'right';

	hov.addEventListener('mouseover', mover);
}
function mover (e) {
	var el = this,
		sipRight = el.dataset.sipState === 'right';
	if (! hovConfig.still) {
		e.preventDefault();

		el.style.left = sipRight ? '10px' : 'inherit';
		el.style.right = sipRight ? 'inherit' : '10px';
		el.dataset.sipState = sipRight ? 'left' : 'right';
	}
}
function process_response (ipObj) {
	var el = document.getElementById(hbId);
	hovConfig = ipObj;
	if (ipObj && ipObj.myIP) {
		if (ipObj.visible && (! el)) {
			document.body.appendChild(hov);
		} else if ((! ipObj.visible) && el) {
			document.body.removeChild(el);
		}
		hov.innerText = ipObj.myIP;
	}
}

add_hover_box();

// send message to background.js to load this tab with relevant information
chrome.extension.sendMessage({'load':true}, process_response);
// receive message from the background.js from a person clicking on the badge
chrome.extension.onMessage.addListener(function (request, sender, response_func) {
	process_response({'visible':! hovConfig.visible, 'still':hovConfig.still, 'myURL':hovConfig.myURL, 'myIP':hovConfig.myIP});
});
