import './style.css';
import "@joyzl/style";

import eno from "@joyzl/eno";
import manage from 'components/manage';
import alert from 'components/alert';
import visits from './visits.js';
import roster from './roster.js';
import users from './users.js';
import about from './about.js';

import server from './server.js';
import create from './server-create.js';
import host from './host.js';

manage.url("/manage/api/");
manage.settingGet(
	function(servers) {
		settingRefresh();
		// alert.success("服务配置已加载");
	}, alert.error
);

eno.bind("aside", "#create", "click",
	function(event) {
		create.open(settingRefresh);
	}
);
eno.bind("aside", "#servers", "click",
	function(event) {
		const entity = eno.entity(event);
		if (entity) {
			const element = eno.element(event);
			if (element) {
				// 整个服务列表将被标记
				eno.toggle(this, "selected", "hover");

				// 判断选中服务还是虚拟主机
				// 服务器一定有端口
				if (entity.port) {
					server.show(entity, settingRefresh);
					eno.toggle(element, "selec", "hover");

					// 隐藏子元素选中标记
					let host = eno.select(element, ".hosts .selec");
					if (host) {
						host.classList.remove("selec");
						host.classList.add("hover");
					}
				} else {
					let hosts = element.parentElement;
					host.show(eno.entity(hosts), entity, settingRefresh);
					eno.toggle(element, "selec", "hover");

					// 切换服务器标记
					hosts.parentElement.classList.remove("selec");
					hosts.parentElement.classList.add("hover");
				}
			}
		}
	}
);
eno.bind("aside", "#visits", "click",
	function(event) {
		eno.toggle(this, "selected", "hover");
		visits.show();
	}
);
eno.bind("aside", "#roster", "click",
	function(event) {
		eno.toggle(this, "selected", "hover");
		roster.show();
	}
);
eno.bind("aside", "#users", "click",
	function(event) {
		eno.toggle(this, "selected", "hover");
		users.show();
	}
);
eno.bind("aside", "#about", "click",
	function(event) {
		eno.toggle(this, "selected", "hover");
		about.show();
	}
);

function settingRefresh(s, h) {
	eno.sets("aside #servers", manage.servers(),
		function(element, entity, name) {
			if ("hosts" == name) {
				eno.sets(element, entity.hosts);
				return null;
			}
		}
	);
	if (s) {
		if (h) {
			return;
		}
		return;
	}
	if (manage.servers().length) {
		eno.select("aside #servers div:first-child").click();
	} else {
		server.hide();
	}
}