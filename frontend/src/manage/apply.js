import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './apply.html';

export default {
	open: function(callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				manage.settingPut(
					function() {
						if (callback) callback(authent);
						alert.success("配置已应用生效");
						eno.remove(element);
					}, alert.error
				);
				return false;
			}
		);
		eno.bind(element, "form", "reset",
			function(event) {
				eno.remove(element);
			}
		);
		element.showModal();

		if (manage.settingChanged()) {
			eno.hide(element, "#nochange");
		} else {
			eno.show(element, "#nochange");
		}
	}
}