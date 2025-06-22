import "@joyzl/style";
import './style.css';
import eno from "@joyzl/eno";

import webdav from 'components/webdav';

webdav.url("http://127.0.0.1/webdav/");
webdav.propfind("/", function(files) {
	paths(files.shift());
	eno.sets("main", files, converter);

	const root = eno.select("#root");
	if (root) {
		eno.set(root, {
			href: webdav.url()
		});
		root.href = webdav.url();
	}
});
eno.bind("main", "click", function(event) {
	const file = eno.entity(event);
	if (file) {
		const element = eno.target(event, "action", "open");
		if (element) {
			if (file.resourcetype) {
				webdav.propfind(file.Href, function(files) {
					paths(files.shift());
					eno.sets("main", files, converter);
				});
			} else {

			}
		} else {

		}
	}
});
eno.bind("header", "click", function(event) {
	event.stopPropagation();
	event.preventDefault();
	const file = eno.entity(event);
	if (file) {
		webdav.propfind(file.href, function(files) {
			paths(files.shift());
			eno.sets("main", files, converter);
		});
	}
	return false;
});

function paths(file) {
	let index, path = file.Href;
	const items = new Array();
	while (path.length > webdav.url().length) {
		index = path.lastIndexOf('/');
		items.push({
			href: path,
			name: path.substring(index + 1)
		});
		path = path.substring(0, index);
	}

	eno.sets("#paths", items.reverse());

	if (items.length > 1) {
		eno.set("#up", items[items.length - 1]);
	} else {
		eno.set("#up", {
			href: webdav.url()
		});
	}
}

function converter(element, entity, name) {
	// return 0; 使用返回值
	// return null; 不执行默认行为
	// return; undefined 未处理执行默认行为
	if ("type" == name) {
		if (entity.resourcetype) {
			element.classList.add("folder");
			element.classList.remove("file");
		} else {
			element.classList.add("file");
			element.classList.remove("folder");
		}
		return;
	}
	if ("getcontentlength" == name) {
		if (entity.getcontentlength) {
			return unitBytes(entity.getcontentlength);
		} else {
			return;
		}
	}
	if ("getlastmodified" == name) {
		if (entity.getlastmodified) {
			return localDate(entity.getlastmodified);
		} else {
			return;
		}
	}
	if ("creationdate" == name) {
		return localDate(entity.creationdate);
	}
}

function localDate(datetime) {
	let dt = new Date(datetime);
	return dt.toLocaleString();
}

function unitBytes(bytes) {
	if (bytes < 1024) {
		return bytes + ' B';
	}
	if (bytes < 1024 * 1024) {
		bytes = (bytes / 1024).toFixed(1);
		return bytes + ' KB';
	}
	if (bytes < 1024 * 1024 * 1024) {
		bytes = (bytes / 1024 * 1024).toFixed(1);
		return bytes + ' MB';
	}
	if (bytes < 1024 * 1024 * 1024 * 1024) {
		bytes = (bytes / 1024 * 1024 * 1024).toFixed(1);
		return bytes + ' GB';
	}
	bytes = (bytes / 1024 * 1024 * 1024 * 1024).toFixed(1);
	return bytes + ' TB';
}