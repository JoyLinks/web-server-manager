import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './archive.html';

let element, a, d, p;
export default {
	show: function() {
		if (element) {} else {
			element = eno.append("main", html);
			// 点击归档库
			eno.bind(element, "#archives", "click",
				function(event) {
					const archive = eno.entity(event);
					if (archive) {
						eno.set(element, "#archive", a = archive);
						eno.show(element, "#archive");
						eno.show(element, "#back");
						refreshDirs();
					}
				}
			);
			// 点击归档目录
			eno.bind(element, "#dirs", "click",
				function(event) {
					const dir = eno.entity(event);
					if (dir) {
						eno.set(element, "#dir", d = dir);
						eno.show(element, "#dir");
						refreshPackets();
					}
				}
			);
			//点击文件包
			eno.bind(element, "#packets", "click",
				function(event) {
					const packet = eno.entity(event);
					if (packet) {
						eno.set(element, "#packet", p = packet);
						eno.show(element, "#packet");
						refreshFiles();
					}
				}
			);
			// 点击返回
			eno.bind(element, "#back", "click",
				function(event) {
					if (p) {
						p = null;
						eno.hide(element, "#packet");
						eno.toggle(element, "#packets");
					} else
					if (d) {
						d = null;
						eno.hide(element, "#dir");
						eno.toggle(element, "#dirs");
					} else
					if (a) {
						a = null;
						eno.hide(element, "#back");
						eno.hide(element, "#archive");
						eno.toggle(element, "#archives");
					}
				}
			);
			// 点击归档库
			eno.bind(element, "#archive", "click",
				function(event) {
					if (d) {
						d = p = null;
						eno.hide(element, "#dir");
						eno.hide(element, "#packet");
						eno.toggle(element, "#dirs");
					} else {
						refreshDirs();
					}
				}
			);
			// 点击归档目录
			eno.bind(element, "#dir", "click",
				function(event) {
					if (p) {
						p = null;
						eno.hide(element, "#packet");
						eno.toggle(element, "#packets");
					} else {
						refreshPackets();
					}
				}
			);
			// 点击文件包
			eno.bind(element, "#packet", "click",
				function(event) {
					refreshFiles();
				}
			);
		}

		eno.hide(element, "#archive");
		eno.hide(element, "#packet");
		eno.hide(element, "#back");
		eno.hide(element, "#dir");

		eno.toggle(element);
		refreshArchives();
	}
}

function refreshArchives() {
	a = d = p = null;
	manage.archives(
		function(archives) {
			//	{
			//		"Id": 0,
			//		"Content": "archives",
			//		"Expire": 90,
			//		"Path": "/archive/*"
			//	}
			eno.sets(element, "#archives", archives);
			eno.toggle(element, "#archives");
		},
		alert.error);
}

function refreshDirs() {
	if (a) {
		d = p = null;
		manage.archiveDirs(a.Id,
			function(dirs) {
				//	{
				//		"Name": "20260103",
				//		"Code": 2,
				//		"Size": "3.04 MB"
				//	}
				eno.sets(element, "#dirs", dirs);
				eno.toggle(element, "#dirs");
			},
			alert.error);
	}
}

function refreshPackets() {
	if (a && d) {
		p = null;
		manage.archivePackets(a.Id, d.Name,
			function(packets) {
				//	{
				//		"Name":"20230801085022"
				//	}
				eno.sets(element, "#packets", packets);
				eno.toggle(element, "#packets");
			},
			alert.error);
	}
}

function refreshFiles() {
	if (a && d && p) {
		manage.archiveFiles(a.Path, p.Name,
			function(files) {
				//	{
				//		"Index": 0,
				//		"Time": 1767423216374,
				//		"Size": "2.94 MB",
				//		"Name": "7949554364186635.jpg",
				//		"Number": "GP001"
				//	}
				eno.sets(element, "#files", files,
					function(element, file, name) {
						if ("Name" == name) {
							element.href = manage.archiveFileURL(a.Path, p.Name, file.Name);
						}
					}
				);
				eno.toggle(element, "#files");
			},
			alert.error);
	}
}