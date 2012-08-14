var hov = document.createElement('div'), hov_config = {},
	hb_id = 'server_ip_sips_hover_box_id';
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
	hov.id = hb_id;
	hov.dataset.sip_state = 'right';

	hov.addEventListener('mouseover', function (e) {
		var el = this,
			sip_right = el.dataset.sip_state === 'right';
		e.preventDefault();

		el.style.left = sip_right ? '10px' : 'inherit';
		el.style.right = sip_right ? 'inherit' : '10px';
		el.dataset.sip_state = sip_right ? 'left' : 'right';
	});
}
function process_response (ip_obj) {
	var el = document.getElementById(hb_id);
	hov_config = ip_obj;
	if (ip_obj && ip_obj.my_ip) {
		if (ip_obj.visible && (! el)) {
			document.body.appendChild(hov);
		} else if ((! ip_obj.visible) && el) {
			document.body.removeChild(el);
		}
		hov.innerText = ip_obj.my_ip;
	}
}
add_hover_box();
chrome.extension.sendMessage({'load':true}, process_response);
chrome.extension.onMessage.addListener(function (request, sender, response_func) {
	process_response({'visible':! hov_config.visible, 'my_url':hov_config.my_url, 'my_ip':hov_config.my_ip});
});
