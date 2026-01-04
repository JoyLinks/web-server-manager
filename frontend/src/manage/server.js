import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import apply from './apply';
import host from './host';
import hostCreate from './host-create';
import hostDelete from './host-delete';

import servletCreate from './servlet-create';
import servletModify from './servlet-modify';
import servletDelete from './servlet-delete';

import authentCreate from './authent-create';
import authentModify from './authent-modify';
import authentDelete from './authent-delete';

import create from './server-create';
import modify from './server-modify';
import remove from './server-delete';
import html from './server.html';

let element, target, server;
export default {
	/**
	 * @param {Object} server 选中的服务
	 * @param {Object} refresh 主界面刷新
	 */
	show: function(s, refresh) {
		server = s;
		if (element) {} else {
			element = eno.append("main", html);
			eno.bind(element, "nav", "click",
				function(event) {
					const item = eno.target(event, "target");
					if (item) {
						target = item.getAttribute("target");
						eno.toggle(item, "selected", "hover");
						eno.toggle(element, target);
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
					if ("#hosts" == target) {
						hostCreate.open(server,
							function(host) {
								eno.sets(element, "#hosts", server.hosts);
								refresh(server);
							}
						);
					} else
					if ("#server" == target) {
						create.open(
							function(server) {
								refresh(server);
							}
						);
					} else
					if ("#servlets" == target) {
						servletCreate.open(server, null, serverRefresh);
					} else
					if ("#authentications" == target) {
						authentCreate.open(server, null, serverRefresh);
					}
				}
			);
			eno.bind(element, "#delete", "click",
				function(event) {
					remove.open(server,
						function(server) {
							refresh();
						}
					);
				}
			);
			eno.bind(element, "#modify", "click",
				function(event) {
					modify.open(server, null,
						function(server) {
							eno.sets(element, "#server", server, serverConvert);
							refresh(server);
						}
					);
				}
			);
			eno.bind(element, "#server", "click",
				function(event) {
					const name = eno.target(event, "name");
					if (name) {
						modify.open(server,
							name.getAttribute("name"),
							function(server) {
								eno.sets(element, "#server", server, serverConvert);
								refresh(server);
							}
						);
					}
				}
			);
			eno.bind(element, "#hosts", "click",
				function(event) {
					const h = eno.entity(event);
					if (h) {
						const target = eno.target(event, "target", "delete");
						if (target) {
							hostDelete.open(server, h,
								function(h) {
									serverRefresh();
									refresh(server);
								}
							);
						} else {
							host.show(server, h, refresh);
						}
					}
				}
			);
			eno.bind(element, "#servlets", "click",
				function(event) {
					const s = eno.entity(event);
					if (s) {
						const target = eno.target(event, "target", null);
						if ("delete" == target) {
							servletDelete.open(server, null, s, serverRefresh);
						} else
						if ("folder" == target) {
							// 打开文件夹：浏览、下载、上传、删除、改名、移动、新建
						} else {
							servletModify.open(server, null, s, null, serverRefresh);
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
							authentDelete.open(server, null, a, serverRefresh);
						} else {
							authentModify.open(server, null, a, null, serverRefresh);
						}
					}
				}
			);
			// 默认选中
			eno.select(element, "nav div:first-child").click();
		}
		eno.toggle(element);
		serverRefresh();
	},
	hide: function() {
		eno.hide(element);
	}
}

function serverRefresh() {
	// 设置标题
	eno.set(element, ".title", server);
	// 设置页卡项目数量
	eno.set(element, "nav", {
		hosts: server.hosts.length,
		servlets: server.servlets.length,
		authentications: server.authentications.length
	});
	// 填充列表项
	eno.set(element, "#server", server, serverConvert);
	eno.sets(element, "#hosts", server.hosts);
	eno.sets(element, "#servlets", server.servlets, servletConvert);
	eno.sets(element, "#authentications", server.authentications);
}

function serverConvert(tag, entity, name) {
	if ("ip" == name) {
		if (entity.ip) {
			return entity.ip;
		} else {
			return "任何";
		}
	}
	if ("state" == name) {
		if (entity.state) {
			return "运行";
		} else {
			return "停止";
		}
	}
	if ("backlog" == name) {
		if (entity.backlog) {
			return entity.backlog;
		} else {
			return "默认";
		}
	}
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