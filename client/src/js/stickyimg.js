import { camera } from './canvas_renderer.js';
import { elements } from './main.js';
import { eventSys } from './global.js';
import { EVENTS as e } from './conf.js';
export function stickyimg(path, w, h, o) {
	// if (OWOP.spawnbanner) {
	//     return;
	// }
	// OWOP.spawnbanner = true;

	var elem = document.createElement('div');
	var shown = false;
	var ismag = false;
	elem.style.position = 'fixed';
	elem.style.transformOrigin = 'left top 0px';
	elem.style.overflow = 'hidden';
	elem.style.width = `${w}px`;
	elem.style.height = `${h}px`;
	elem.style.opacity = `${o}%`;
	elem.style.backgroundRepeat = 'no-repeat';
	// elem.style.backgroundSize = 'contain';
	elem.style.backgroundImage = `url("${path}")`;
	var move = function () {
		var sc = camera.zoom / 16;
		var tx = ((-camera.x - 29) * camera.zoom);
		var ty = ((-camera.y - 25) * camera.zoom);
		if (tx > -w * sc && ty > -h * sc && tx < window.innerWidth && ty < window.innerHeight) {
			if (sc > 1.0 && !ismag) {
				ismag = true;
				elem.style.imageRendering = 'pixelated';
			} else if (sc <= 1.0 && ismag) {
				ismag = false;
				elem.style.imageRendering = 'auto';
			}

			elem.style.transform = 'matrix(' + sc + ',0,0,' + sc + ',' + Math.round(tx) + ',' + Math.round(ty) + ')';
			if (!shown) {
				elements.viewport.appendChild(elem);
				shown = true;
			}
		} else {
			if (shown) {
				elem.remove();
				shown = false;
			}
		}
	};
	eventSys.on(e.camera.moved, move);
	move();
}
