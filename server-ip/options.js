/* TODO - add wildcards, at least * to ip addresses */
/* Despite the mnemonic being more important to the user, the ip is more important to us since it's the index */
/* mnems structure:
 * mnems = {
 *		10.2.1.88 : {
 *			"mnem" : "dev"
 *		},
 *		127.0.0.1 : {
 *			"mnem" : "lcl"
 *		}
 * }
 */
(function () {
	var mnems = JSON.parse(localStorage.getItem('mnems')) || {}, ip_index, more_boxes, mb = 0, mn_len = 0,
		valid_ip = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
		wrap = document.getElementById('wrap'),
		add_btn = document.getElementById('add_mnem'),
		rm_btns, rb_i = 0, rb_len,
		del_ls_btn = document.getElementById('del_ls');

	function update_mnems() {
		try {
			localStorage.setItem('mnems', JSON.stringify(mnems));
		} catch (e) {
			// storage full
		}
	}

	function is_valid_pair(ip, mnem) {
		return ((!! ip) && ip.match(valid_ip) && mnem && mnem.length && (mnem.length > 0));
	}

	function modify_mnems(ip, mnem) {
		// are we adding or removing an entry?
		if ((mnem && ip) && (mnem.length > 0) && (ip.length > 0)) {
			// must be adding one
			if (! mnems[ip]) {
				mnems[ip] = {};
			}
			mnems[ip].mnem = mnem;
			update_mnems();
		} else if (ip && (ip.length > 0) && ((! mnem) || (mnem.length === 0))) {
			// try to remove one
			if (delete mnems[ip]) {
				update_mnems();
			}
		}
	}

	function show_message(box, message) {
		box.getElementsByClassName('r-message')[0].innerText = message;
	}

	function clear_message(e) {
		show_message(this.parentNode.parentNode, '');
	}

	function change_mnem(e) {
		var my_gparent = this.parentNode.parentNode,
			my_ip_input = my_gparent.getElementsByClassName('ip-index-input')[0],
			my_mnem_input = my_gparent.getElementsByClassName('mnem-input')[0];
		// only change the value if they have entered valid values
		if (is_valid_pair(my_ip_input.value, my_mnem_input.value) && ((my_ip_input.value !== my_ip_input.dataset.prev) || (my_mnem_input.value !== my_mnem_input.dataset.prev))) {
			if (my_ip_input.dataset.prev) {
				modify_mnems(my_ip_input.dataset.prev, null);
			}
			modify_mnems(my_ip_input.value, my_mnem_input.value);
			my_ip_input.dataset.prev = my_ip_input.value;
			my_mnem_input.dataset.prev = my_mnem_input.value;
			show_message(my_gparent, 'saved');
		} else if ((! my_ip_input.value) || (! my_mnem_input.value)) {
			show_message(my_gparent, '');
		} else if (! is_valid_pair(my_ip_input.value, my_mnem_input.value)) {
			show_message(my_gparent, 'not updated, check values');
		} else {
			show_message(my_gparent, '');
		}
	}

	function remove_mnem(e) {
		var my_parent = this.parentNode,
			ip_to_remove = my_parent.getElementsByClassName('ip-index-input')[0].value;
		// if ip_to_remove exists then remove it from the localStorage
		modify_mnems(ip_to_remove, null);
		// remove from view (events first)
		my_parent.getElementsByClassName('remove')[0].removeEventListener('click', remove_mnem, false);
		my_parent.getElementsByClassName('mnem-input')[0].removeEventListener('blur', change_mnem, false);
		my_parent.getElementsByClassName('mnem-input')[0].removeEventListener('focus', clear_message, false);
		my_parent.getElementsByClassName('ip-index-input')[0].removeEventListener('blur', change_mnem, false);
		my_parent.getElementsByClassName('ip-index-input')[0].removeEventListener('focus', clear_message, false);
		my_parent.parentNode.removeChild(my_parent);
	}

	function make_mnem_box(ip, mnem) {
		var mnem_box,
			mnem_box_wrap = document.createElement('span');
		mnem_box = '<span class="mnem-box">';
		mnem_box += '<input placeholder="mnemonic" class="mnem-input" type="text" maxlength="3" data-prev_val="##mnem##" value="##mnem##" /></span>';
		mnem_box+= '<span class="mnem-box last">';
		mnem_box += '<input placeholder="ip address" class="ip-index-input" type="text" maxlength="15" data-prev_val="##ip##" value="##ip##" /></span>';
		mnem_box+= '<button class="remove">&nbsp;&mdash;&nbsp;</button>';
		mnem_box+= '<span class="r-message"></span>';

		mnem_box_wrap.innerHTML = mnem_box.replace(/##ip##/gi, ip || '').replace(/##mnem##/gi, mnem || '');
		mnem_box_wrap.className = 'single-wrap';
		mnem_box_wrap.getElementsByClassName('remove')[0].addEventListener('click', remove_mnem, false);
		mnem_box_wrap.getElementsByClassName('mnem-input')[0].addEventListener('blur', change_mnem, false);
		mnem_box_wrap.getElementsByClassName('mnem-input')[0].addEventListener('focus', clear_message, false);
		mnem_box_wrap.getElementsByClassName('ip-index-input')[0].addEventListener('blur', change_mnem, false);
		mnem_box_wrap.getElementsByClassName('ip-index-input')[0].addEventListener('focus', clear_message, false);
		wrap.appendChild(mnem_box_wrap);
		return mnem_box_wrap;
	}

	for (ip_index in mnems) {
		if (mnems.hasOwnProperty(ip_index)) {
			mn_len += 1;
			make_mnem_box(ip_index, mnems[ip_index].mnem);
		}
	}
	// add at least one and at most 4 boxes
	more_boxes = (mn_len >= 4 ? 1 : 4);
	for (mb = 0; mb < more_boxes; mb += 1) {
		make_mnem_box('', '');
	}

	// set up button to allow user to add more mnem & ip combo boxes
	add_btn.addEventListener('click', function (e) {
		make_mnem_box('', '');
	});

	del_ls_btn.textContent = 'Delete ' + (localStorage.length - 1) + ' items';
	del_ls_btn.addEventListener('click', function (e) {
		var ls_i = 0;
		while (ls_i < localStorage.length ) {
			if (localStorage.key(ls_i) !== 'mnems') {
				localStorage.removeItem(localStorage.key(ls_i));
			} else {
				ls_i += 1;
			}
		}
		del_ls_btn.textContent = 'Delete ' + (localStorage.length - 1) + ' items';
	});
}());
