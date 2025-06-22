import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import serve from './server';
import apply from './apply';

import servletCreate from './servlet-create';
import servletModify from './servlet-modify';
import servletDelete from './servlet-delete';

import authentCreate from './authent-create';
import authentModify from './authent-modify';
import authentDelete from './authent-delete';

import create from './host-create';
import modify from './host-modify';
import remove from './host-delete';
import html from './host.html';

let element, target, server, host;
export default {
	show: function(s, h, refresh) {
		server = s;
		host = h;
		if (element) {} else {
			element = eno.append("main", html);
			eno.bind(element, "nav", "click",
				function(event) {
					const item = eno.target(event, "target");
					if (item) {
						target = item.getAttribute("target");
						eno.toggle(item, "selected", "hover");
						eno.toggle(element, item.getAttribute("target"));
					}
				}
			);
			eno.bind(element, "#apply", "click",
				function(event) {
					apply.open();
				}
			);
			eno.bind(element, "#create", "click",
				function(event) {
					if ("#host" == target) {
						create.open(server, refresh);
					} else
					if ("#servlets" == target) {
						servletCreate.open(server, host, hostRefresh);
					} else
					if ("#authentications" == target) {
						authentCreate.open(server, host, hostRefresh);
					}
				}
			);
			eno.bind(element, "#server", "click",
				function(event) {
					serve.show(server, refresh);
				}
			);
			eno.bind(element, "#delete", "click",
				function(event) {
					remove.open(server, host,
						function(host) {
							serve.show(server, refresh);
							refresh(server);
						}
					);
				}
			);
			eno.bind(element, "#modify", "click",
				function(event) {
					modify.open(host, null,
						function(host) {
							eno.sets(element, "#host", host, hostConvert);
							refresh(server, host);
						}
					);
				}
			);
			eno.bind(element, "#host", "click",
				function(event) {
					const name = eno.target(event, "name");
					if (name) {
						modify.open(host,
							name.getAttribute("name"),
							function(host) {
								eno.sets(element, "#host", host, hostConvert);
								refresh(server, host);
							}
						);
					}
				}
			);
			eno.bind(element, "#servlets", "click",
				function(event) {
					const s = eno.entity(event);
					if (s) {
						const target = eno.target(event, "target", "delete");
						if (target) {
							servletDelete.open(server, host, s, hostRefresh);
						} else {
							servletModify.open(server, host, s, null, hostRefresh);
						}
					}
				}
			);
			eno.bind(element, "#authentications", "click",
				function(event) {
					const a = eno.entity(event);
					if (a) {
						const target = eno.target(event, "target", "delete");
						if (target) {
							authentDelete.open(server, host, a, hostRefresh);
						} else {
							authentModify.open(server, host, a, null, hostRefresh);
						}
					}
				}
			);
			// 默认选中
			eno.select(element, "nav div:first-child").click();
		}
		eno.toggle(element);
		hostRefresh();
	}
}

function hostRefresh() {
	if (server && host) {
		// 设置标题
		eno.set(element, ".title", {
			server: server,
			host: host
		});
		// 设置页卡项目数量
		eno.set(element, "nav", {
			servlets: host.servlets.length,
			authentications: host.authentications.length
		});
		// 填充列表项
		eno.set(element, "#host", host, hostConvert);
		eno.sets(element, "#servlets", host.servlets, servletConvert);
		eno.sets(element, "#authentications", host.authentications);
	}
}

function hostConvert(element, entity, name) {
	if ("access" == name) {
		if (entity.access) {
			return entity.access;
		} else {
			return "不记录";
		}
	}
}

function servletConvert(tag, entity, name) {
	if ("folder" == name) {
		if (entity.parameters && entity.parameters.content) {
			eno.show(tag);
			return true;
		} else {
			eno.hide(tag);
			return false;
		}
	}
}