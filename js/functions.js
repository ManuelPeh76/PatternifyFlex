/*jshint esversion: 10, -W030, -W033*/
/**************************************************
 **                                              **
 **              PATTERNIFY FLEX                 **
 **  __________________________________________  **
 **       Enhancements to 'FLEX' version         **
 **         (c) 2020 by Manuel Pelzer            **
 ** ___________________________________________  **
 **  functions.js                                **
 **************************************************/

(function(root) {
    var LZW = {
        encode: function(s) {
            let dict = {}, data = (s + "").split(""), out = [],
            currChar, phrase = data[0], code = 256, i, l;
            for (i = 1, l = data.length; i < l; i++) {
                currChar = data[i];
                dict[phrase + currChar] != null ? phrase += currChar : (
                    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0)),
                    dict[phrase + currChar] = code++,
                    phrase = currChar
                );
            }
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            for (i = 0, l = out.length; i < l; i++) out[i] = String.fromCharCode(out[i]);
            return out.join("");
        },
        decode: function (s) {
            let dict = {}, data = (s + "").split(""), currChar = data[0],
                oldPhrase = currChar, out = [currChar], code = 256, phrase;
            for (var i = 1; i < data.length; i++) {
                var currCode = data[i].charCodeAt(0);
                phrase = (currCode < 256 ? data[i] : dict[currCode] ? dict[currCode] : (oldPhrase + currChar));
                out.push(phrase);
                currChar = phrase.charAt(0);
                dict[code++] = oldPhrase + currChar;
                oldPhrase = phrase;
            }
            return out.join("");
        }
    },

    execAsync = fn => {
    	const worker = new Worker(URL.createObjectURL(new Blob([`postMessage((${fn})());`]), { type: "application/javascript; charset=utf-8"}));
    	return new Promise(function (res, rej) {
    		worker.onmessage = ({data}) => { res(data), worker.terminate(); };
    		worker.onerror = err => { rej(err), worker.terminate(); };
    	});
    },

	// GET DOM ELEMENTS
    get = (target, returnAll) => {
        return (
            !target ? false :
            target instanceof Element ? target :
            returnAll ? document.querySelectorAll(target) :
            /[\s\.\[]/.test(target) ?
                document[document.querySelectorAll(target).length === 1 ? "querySelector" : "querySelectorAll"](target) :
            target[0] === "#" ? document.getElementById(target.substring(1)) : document.getElementsByTagName(target)
        );
	},

    each = (items = [], cb) => {
        items.constructor === Object ?
            Object.entries(items).forEach(([key, value], index) => cb(key, value, index)) :
        items.forEach((key, index) => cb(key, index));
    },

	body = () => document.compatMode && document.compatMode == "CSS1Compat" ? document.documentElement : document.body,

	// STORE DATA TO LOCAL STORAGE OR SAVE IT AS A COOKIE
	save = (item, value, b64) => {
        let d;
	    return (
            useLocalStorage ? (
    			localStorage[item] = b64 ? btoa(JSON.stringify(value)) : JSON.stringify(value), !!localStorage[item]
    		) :  useCookies ? (
    			d = Date.now() + 31536E6,
    		    document.cookie = item + "=" + JSON.stringify(b64 ? btoa(encodeURIComponent(value)) : encodeURIComponent(value)) + ";path=/;expires=" + new Date(d),
    			document.cookie.indexOf(item) > -1
    		) : false
        );
	},

	// LOAD DATA FROM LOCAL STORAGE OR A COOKIE
	load = (item, lzw) => {
		let value;
	    if (useLocalStorage) {
			try {
				return JSON.parse(lzw ? atob(localStorage[item]) : localStorage[item]) || false;
			} catch(err) {}
		} else if (useCookies) {
			value = decodeURIComponent(document.cookie.match("(^|;)\\s*" + item + "\\s*=\\s*([^;]+)"));
			try { value = value !== "null" ? JSON.parse(lzw ? atob(value.pop()) : value.pop()) : false; } catch (err) {}
			return value;
		}
		return false;
	},

	// DELETE DATA FROM LOCAL STORAGE / COOKIE
	remove = item => {
        return (
    	    useLocalStorage ? (
    		    delete localStorage[item], !localStorage[item]
    		) : useCookies ? (
    		    document.cookie = name + "='';path=/;expires=0", true
    		) : false
        );
	},

	// ADD AN EVENT LISTENER THAT FIRES ONE TIME AND REMOVES ITSELF
	addEventListenerOnce = function(element, event, listener) {
        typeof element !== "object" && (element = get(element));
	    event.indexOf(" ") > -1 ? each(event.split(" "), e => element.addEventListener(e, listener, {once: true})) :
	    element.addEventListener(event, listener, {once: true});
	},

	// COLLECT ALL HTTP-GET VARIABLES
	_GET_All = () => {
	    let e = {}, p, pr = location.hash ? decodeURIComponent(location.hash).substring(1).split("&") : location.href.indexOf("?") > -1 ? decodeURIComponent(location.href).split("?")[1].split("&") : null;
	    return pr && pr.length ? (pr.map(e => e.trim()).forEach(i => (p = i.split("="), e[p[0]] = p[1])), e) : false;
	},

	// GET ONE HTTP_GET VARIABLE BY ITS NAME
	_GET = a => _GET_All()[a] || false,

	width = element => parseInt(getComputedStyle(get(element)).width.replace("px", "")) || parseInt(get(element).getBoundingClientRect().width),

	height = element => parseInt(getComputedStyle(get(element)).height.replace("px", "")) || parseInt(get(element).getBoundingClientRect().height),

	offset = element => {
	    let rect = get(element).getBoundingClientRect();
	    return {
	        top: parseInt(rect.top + body().scrollTop),
	        left: parseInt(rect.left + body().scrollLeft)
	    };
	},

    // CREATE A COPY OF A GIVEN OBJECT
    cloneObject = (obj, type = {}) => extend(type, obj),

	// EXTENDS AN OBJECT OR ARRAY
	extend = function(object) {
	    object = object || {};
	    for (let i = 1; i < arguments.length; i++) {
	        let obj = arguments[i];
	        if (!obj) continue;
	        for (let key in obj) obj.hasOwnProperty(key) && (
				typeof obj[key] === "object" ? obj[key] instanceof Array ?
				object[key] = obj[key].slice(0) : extend(object[key], obj[key]) : object[key] = obj[key]
	        );
	    }
	    return object;
	},

    // RETURNS A RANDOM NUMBER, IF a AND b < 1 IT RETURNS 0.xx, DEPENDING ONTO THE GIVEN NUMBERS
    rnd = (a, b) => b > 1 ? Math.floor(Math.random() * (b - a + 1)) + a : parseFloat((Math.floor(Math.random() * (b * 100 - a * 100 + 1) + a * 100) * 0.01).toFixed(2)),

    // DISPLAY MESSAGES USING ALERTISM
	message = function(type, text, HTML, timer) {
	    let btnText, color, showTimeLine;
	    !arguments.length && messageId && (Alertism({ close: true, id: messageId, animation: "bottom" }),messageId = 0);
	    (HTML || text) && (
	        color = type === "error" ? "red" : type === "warning" ? "yellow" : "green",
	        btnText = "-= Ok =-",
	        showTimeLine = !!timer,
	        type !== "info" && type !== "tick" && Alertism({enableIcon: true, icon: {type, position: "center", color}, alertHeadingHTML:  "<font color='" + color + "'>" + type[0].toUpperCase() + type.substring(1) + "</font>", alertHTML: HTML, alertText: text, btnText, theme: "dark", animation: "bottom"}),
	        (type === "info" || type === "tick") && (messageId = Toast({text, HTML, position: "bottom", enableIcon: true, icon: {type, color}, showTimeLine, timer, theme: "dark", animation: "bottom"}))
	    );
	},

    contextMenu = [
        ["undo","undo","tool"],
        ["redo","redo","tool"],
        ["separator"],
        ["copy", "clone", "tool"],
        ["drawTools","menutools",[
            ["pencil","pencil","tool"],
            ["eraser","eraser","tool"],
            ["line","line","tool"],
            ["rectangle","rectangle","tool"],
            ["parallelogram","parallelogram","tool"],
            ["polygon","polygon","tool"],
            ["ellipse","ellipse","tool"],
            ["text","text","tool"]]
        ],["colorTools","color",[
            ["eyedropper","eyedropper","tool"],
            ["colorpicker","picker","tool"],
            ["fill","fill","tool"],
            ["colorArea","color-area","tool"],
            ["changeCol","change-color_ctx","tool"],
            ["colorToBW","color-bw","tool"],
            ["separator"],
            ["clearArea","clear-area","tool"],
            ["clearCol","clear-color_ctx","tool"],
            ["clear","clear","tool"]]
        ],["moveTools","move",[
            ["move","move","tool"],
            ["rotateGrid","rotate","tool"]]
        ],["board","copy-paste",[
            ["showItems","show_items","tab5"],
            ["removeFromLocalStorage","remove_local","tab5"],
            ["separator"],
            ["mark","select","tab5"],
            ["copyToClipboard","copy","tab5"],
            ["previewMatrix", "drop-item", "tab5"],
            ["paste","paste","tab5"],
            ["cancelCopyMatrix","cancel","tab5"],
            ["removeMatrix","remove","tab5"]]
        ],
        ["fileload","fileload","tool"],
        ["getmatrix","getmatrix","tool"],
        ["drawRecorder", "recorded", [
            ["stop", "rec_stop", "recContext"],
            ["play", "rec_play", "recContext"],
            ["record", "rec_rec", "recContext"],
            ["edit", "rec_edit", "recContext"]]
        ],
        ["language", "", [
            ["english", "en", "lang"],
            ["german", "de", "lang"]]
        ]
    ],

    menuItem = "<li id=\"m_%clid%\" class=\"contextmenu-item\"><button type=\"button\" id=\"%clid%\" class=\"%class% contextmenu-btn\"><i class=\"contextmenu-i %clid%\"></i><span class=\"contextmenu-text\" data-value=\"%item%\"></span><span class=\"contextmenu-hotkey\" data-hotkey=\"%hotkey%\"></span></button></li>",
    submenuItem = "<li class=\"contextmenu-item submenu\"><button type=\"button\" class=\"contextmenu-btn\"><i class=\"contextmenu-i %clid%\"></i><span class=\"contextmenu-text\" data-value=\"%item%\"></span></button><menu class=\"contextmenu\">",
    submenuEnd = "</menu></li>",
    separator = "\n  <li class=\"contextmenu-separator\"></li>",

    create = (tag, attr, parent) => {
    	const element = document.createElement(tag);
    	attr && each(attr, (key, value) => {
            key === "dataset" ? element.dataset[([k, v] = Object.entries(value)[0], k)] = v :
            key === "text" ? element.appendChild(document.createTextNode(value)) :
            key === "html" ? element.innerHTML += value :
            key === "style" ? typeof value === "object" ?
                each(value, (k, v) => element.style[k] = v) :
                each((value.indexOf(";") > -1 ? value.split(";") : [value]), entry => {
                    [k, v] = entry.split(":");
                    element.style[k] = v;
                }) :
            key === "children" ? (
                each(value, child => each(child, (k, v) => {
                    k === "text" ? element.appendChild(document.createTextNode(v)) :
                    k === "html" ? element.innerHTML += v :
                    create(k, v, element);
                }))
            ) : element[key] = value;
        });
    	parent && parent.appendChild(element);
    	return element;
    },

    createCheckbox = (headline, containerId = null, containerClass = null, inputId = null, inputClass = "", labelText = "", parent = null, callback = null) => {
        create("div", {
            classList: containerClass,
            id: containerId,
            children: [
                {h4: {innerHTML: headline}},
                {input: {type: "checkbox", classList: inputClass, id: inputId, onchange: callback}},
                {label: {htmlFor: inputId, innerHTML: labelText}}
            ]
        }, parent);
        return document.getElementById(inputId);
    },

    createTool = (liClass = "", title = "", toolId = "", toolClass = "", active = null, parent = null) => {
        let attr = {};
        liClass && (attr.classList = liClass);
        title && (attr.title = title);
        attr.children = [{span: {children: [{a: {classList: "tool"}}]}}];
        active && (attr.children[0].span.classList = active);
        toolId && (attr.children[0].span.children[0].a.id = toolId);
        toolClass && (attr.children[0].span.children[0].a.classList += " " + toolClass);
        return create("li", attr, parent);
    },

    /* createTools([[TOOL1], [TOOL2]....]);
     *  ALL TOOLS ARE INSIDE OF UNORDERED LISTS INSIDE A DIV CONTAINER.THESE ARE CREATED BY CREATETOOLS().
     * [TOOL1] -> [DIVID, DIVCLASS, PARENT, HEADLINE, [TOOLLIST], [ADDITIONALHTML]]
     *          DIVID -> ID FOR THE CREATED TOOL CONTAINER
     *          DIVCLASS -> CLASS FOR THE CREATED CONTAINER
     *          PARENT      -> ELEMENT TO ADD THE TOOLS TO
     *          HEADLINE    -> OPTIONAL; IF A HEADLINE FOR THE TOOLS IS NEEDED
     *          [TOOLLIST]  -> [ulClass, [toolList], active]
     *                  ulClass     -> class of the created unordered list
     *                  [toollist]  -> ONE OF 3 WAYS:
     *                                  1. ARRAYS LIKE [TITLE, TOOLID, TOOLCLASS], REPEATED FOR EVERY TOOL, OR
     *                                  2. STRINGS LIKE "TOOL1", "TOOL2"... WHERE EACH STRING IS USED FOR TITLE, TOOLID AND TOOLCLASS
     *                                  3. A COMBINATION OF 1 AND 2.
     *                  active      -> array index of the activated tool, if a tool should be activated by default
     *          [additionalhtml]    -> [index, html]
     *                  index       -> array index of the tool to add html content to
     *                  html        -> the content to add
    */
    createTools = toolLists => {
        let ul, std, h4, tools = [];
        each(toolLists, (elements, index) => {
            const [divId, divClass, parent, headline, toolList, additionalHtml] = elements;
            tools[index] = create("div", {id: divId, classList: divClass}, document.querySelector(parent));
            headline && (
                h4 = create("h4", null, tools[index]),
                h4.dataset.value = headline
            );
            each(toolList, (attr, i) => {
                ul = create("ul");
                attr[0] && (ul.classList = attr[0]);
                each(attr[1], (e, c) => {
                    std = typeof e === "string";
                    createTool("tooltip", std ? e : e[0], std ? e : e[1], std ? e : e[2], (attr[2] && c === attr[2]), ul);
                });
                typeof additionalHtml === "object" && additionalHtml[0] === i && (ul.innerHTML += additionalHtml[1]);
                tools[index].appendChild(ul);
            });
        });
        return tools;
    },

    // CHECK IF A PIXEL INSIDE OF THE MATRIX EQUALS THE CURRENT DRAW COLOR
	sameColor = (a, b) => a.r === b[0] && a.g === b[1] && a.b === b[2] && a.a === b[3],

    downloadJS = ([out, name]) => {
        let a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([out], { type: "text/javascript" }));
        a.download = name + ".js";
        a.click();
    },

	// CREATES A STRING CONTAINING A WHOLE OBJECT OR CREATES A DOWNLOADABLE FILE FROM IT
	objectToString = ([obj, objName = null, tab = "    ", iterate = []]) => {
	    let result = Object.keys(obj).map(key => [key, obj[key]]).sort((a, b) => a[0] - b[0]),
	        key, value, out, i = 0, j, ok, space = [...iterate], match, str;
        function amount(needle, haystack="") {
            for(let i = 0, c = 0; i < needle.length; i++) c += haystack.indexOf(needle[i]) > -1 ? haystack.split(needle[i]).length - 1 : 0;
            return c;
        }
        function formatStr(str) {
            if (str.indexOf("\n") > -1) {
                str = ((str.replace(/\r/g, "")).split("\n")).map(e => e.trim());
                let k = [...space], x = 0, y = 0;
                for (let i = 0; i < str.length; i++) {
                    ok = 0;
                    x = amount("{(", str[i]) - amount("})", str[i]);
                    (x < 0 || (x === 0 && amount("})", str[i][0]))) && (ok = 1, k.pop());
                    str[i] = k.join("") + str[i];
                    (x > 0 || (x === 0 && ok)) && k.push(tab);
                }
                str[0] = str[0].trim();
                str = str.join("\n");
            }
            return "\n" + space.join("") + key + ": " + str + ",";
        }
	    out = space.join("") + (objName ? (objName + (space.length ? ": {" : " = {")) : "{");
	    space.push(tab);
	    for (; i < result.length; i++) {
	        [key, value] = result[i];
            if (value == null) continue;
            match = key.match(/[a-z0-9$_]/ig);
            match && (match = match.length);
			(parseInt(key) == key || !match || match !== key.length) && (key = `"${key}"`); // jshint ignore: line
			typeof value === "function" ? (
                out += formatStr(value.toString())
            ) : value.constructor === Object ? (
			    out += (Object.keys(value).length ? "\n" + objectToString([value, key, 1, tab, space, log]) : "\n" + space.join("") + key + ": {},")
			) : value.constructor === Array ? (
                value.length && (value = value.map(e => {return typeof e == "function" ? e.toString() : e;})),
                match = value.length > 9 || value.join("").length > 200 ? JSON.stringify(value) : JSON.stringify(value, null, "!#!").replace(/\n!#!/g, "\n" + space.join("") + tab).replace(/!#!/g, tab).replace(/\n]/, "\n" + space.join("") + "]"),
				out += "\n" + space.join("") + key + ": " + match + ","
			) : value.constructor === String ? (
				str = value.indexOf("\n") > -1 && value.length > 250 ? "`" : "\"",
				str === "\"" && (value = value.replace(/"/g, "\\\"").replace(/\n/g, "\\n").replace(/\t/g, "\\t")),
				out += "\n" + space.join("") + key + ": " + str + value + str + ","
			) : (value.constructor === Number || value.constructor === Boolean) && (
				out += "\n" + space.join("") + key + ": " + value + ","
			);
	    }
	    space.pop();
	    return out.substring(0, out.length - 1) + "\n" + space.join("") + "}" + (iterate.length ? "," : ";");
	},

	activateLogo = () => {
	    setTimeout(() => get("h1")[0].classList.add("bounce"), setTimeout(() => get("h1")[0].classList.remove("bounce"), 3000), 3000),
	    setInterval(() => get("h1")[0].classList.add("bounce"), setTimeout(() => get("h1")[0].classList.remove("bounce"), 3000), 60000);
	},

    /***************************
     ***  Color Calculation  ***
     ***************************/
	inputToRgb = function(color) {
		let rgb = { r: 0, g: 0, b: 0 }, a = 1, ok = 0, format = 0;
		typeof color == "string" && (color = stringInputToObject(color));
		typeof color == "object" && (
			color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b") ? (
				rgb = rgbToRgb(color.r, color.g, color.b),
				ok = true,
				format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb"
			) : color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v") ? (
				color.s = convertToPercentage(color.s),
				color.v = convertToPercentage(color.v),
				rgb = hsvToRgb(color.h, color.s, color.v),
				ok = true,
				format = "hsv"
			) : color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l") && (
				color.s = convertToPercentage(color.s),
				color.l = convertToPercentage(color.l),
				rgb = hslToRgb(color.h, color.s, color.l),
				ok = true,
				format = "hsl"
			),
			color.hasOwnProperty("a") && (a = color.a)
		);
		a = parseFloat(a);
		isNaN(a) || a < 0 || a > 1 && (a = 1);

		return {
			ok: ok,
			r: Math.min(255, Math.max(rgb.r, 0)),
			g: Math.min(255, Math.max(rgb.g, 0)),
			b: Math.min(255, Math.max(rgb.b, 0)),
			a: a
		};
	},

	convertToPercentage = function(n) {
		n <= 1 && (n = (n * 100) + "%");
		return n;
	},

	rgbToRgb = function(r, g, b){
		return {
			r: bound01(r, 255) * 255,
			g: bound01(g, 255) * 255,
			b: bound01(b, 255) * 255
		};
	},

	matchers = (function() {
		let css_integer = "[-\\+]?\\d+%?",
			css_number = "[-\\+]?\\d*\\.\\d+%?",
			css_unit = `(?:${css_number})|(?:${css_integer})`,
			match1 = `[\\s|\\(]+(${css_unit})[,|\\s]+(${css_unit})[,|\\s]+(${css_unit})\\s*\\)?`,
			match2 = `[\\s|\\(]+(${css_unit})[,|\\s]+(${css_unit})[,|\\s]+(${css_unit})[,|\\s]+(${css_unit})\\s*\\)?`;
		return {
			rgb: new RegExp("rgb" + match1),
			rgba: new RegExp("rgba" + match2),
			hsl: new RegExp("hsl" + match1),
			hsla: new RegExp("hsla" + match2),
			hsv: new RegExp("hsv" + match1),
			hsva: new RegExp("hsva" + match2),
			hex3: /^([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/,
            hex4: /^([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/,
			hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
			hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
		};

	})(),

	stringInputToObject = function(color) {
		let trimLeft = /^[\s,#]+/, trimRight = /\s+$/;
		color = color.replace(trimLeft,"").replace(trimRight, "").toLowerCase();
		let named = false;
		if (color == "transparent") return { r: 0, g: 0, b: 0, a: 0, format: "name", ok: true };
		var match;
		if ((match = matchers.rgb.exec(color))) return { r: match[1], g: match[2], b: match[3] };
		if ((match = matchers.rgba.exec(color))) return { r: match[1], g: match[2], b: match[3], a: match[4] };
		if ((match = matchers.hsl.exec(color))) return { h: match[1], s: match[2], l: match[3] };
		if ((match = matchers.hsla.exec(color))) return { h: match[1], s: match[2], l: match[3], a: match[4] };
		if ((match = matchers.hsv.exec(color))) return { h: match[1], s: match[2], v: match[3] };
		if ((match = matchers.hsva.exec(color))) return { h: match[1], s: match[2], v: match[3], a: match[4] };
		if ((match = matchers.hex8.exec(color))) return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16), a: parseFloat((parseInt(match[4], 16) /255).toFixed(2)) };
		if ((match = matchers.hex6.exec(color))) return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
        if ((match = matchers.hex4.exec(color))) return { r: parseInt(`${match[1]}${match[1]}`, 16), g: parseInt(`${match[2]}${match[2]}`, 16), b: parseInt(`${match[3]}${match[3]}`, 16), a: parseFloat((parseInt(`${match[4]}${match[4]}`, 16) /255).toFixed(2)) };
		if ((match = matchers.hex3.exec(color))) return { r: parseInt(`${match[1]}${match[1]}`, 16), g: parseInt(`${match[2]}${match[2]}`, 16), b: parseInt(`${match[3]}${match[3]}`, 16) };
		return false;
	},

	bound01 = function(n, to) {
		if (typeof n == "string" && n.indexOf(".") != -1 && parseFloat(n) === 1) n = "100%";
		let processPercent = typeof n === "string" && n.indexOf("%") != -1;
		n = Math.min(to, Math.max(0, parseFloat(n)));
		if (processPercent) n = parseInt(n * to, 10) / 100;
		if ((Math.abs(n - to) < 0.000001)) return 1;
		return (n % to) / parseFloat(to);
	},

	hexToRgb = function(hex) {
		hex = hex.replace("#", "");
		let a = hex.length === 8 ? parseFloat((parseInt(hex.substring(6), 16) / 255).toFixed(2)) : parseFloat((opacity.value/100).toFixed(2));
		hex = parseInt(hex.substring(0,6), 16);
		return {
			r: hex >> 16,
			g: (hex & 65280) >> 8,
			b: hex & 255,
			a: a
		};
	},

	hexToHsb = function(hex) {
		return rgbToHsb(hexToRgb(hex));
	},

	rgb2Hsb = function(rgb) {
		let hsb = {h: 0, s: 0, b: 0};
		let min = Math.min(rgb.r, rgb.g, rgb.b);
		let max = Math.max(rgb.r, rgb.g, rgb.b);
		let delta = max - min;
		hsb.b = max;
		hsb.s = max !== 0 ? 255 * delta / max : 0;
		if (hsb.s) {
			if (rgb.r === max) hsb.h = (rgb.g - rgb.b) / delta;
			else if (rgb.g === max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
			else hsb.h = 4 + (rgb.r - rgb.g) / delta;
		} else hsb.h = -1;
		hsb.h *= 60;
		if (hsb.h < 0) hsb.h += 360;
		hsb.s *= 100 / 255;
		hsb.b *= 100 / 255;
		return hsb;
	},

	hsvToRgb = function (h, s, v) {
		h = bound01(h, 360) * 6;
		s = bound01(s, 100);
		v = bound01(v, 100);

		var i = math.Math.floor(h),
			f = h - i,
			p = v * (1 - s),
			q = v * (1 - f * s),
			t = v * (1 - (1 - f) * s),
			mod = i % 6,
			r = [v, q, p, p, t, v][mod],
			g = [t, v, v, q, p, p][mod],
			b = [p, p, t, v, v, q][mod];

		return { r: r * 255, g: g * 255, b: b * 255 };
	},

	hslToRgb = function(h, s, l) {
		let r, g, b;
		h = bound01(h, 360);
		s = bound01(s, 100);
		l = bound01(l, 100);
		function hue2rgb(p, q, t) {
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}
		if(s === 0) r = g = b = l;
		else {
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		return { r: r * 255, g: g * 255, b: b * 255 };
	},

	rgbToHex = function(rgb) {
		let r = parseInt(rgb._r || rgb.r);
		let g = parseInt(rgb._g || rgb.g);
		let b = parseInt(rgb._b || rgb.b);
		let hex = [r.toString(16), g.toString(16), b.toString(16)];
		hex = hex.map(val => val = val.length === 1 ? `0${val}` : val);
		return hex.join("");
	},

	// ***************** END OF COLOR CALCULATION FUNCTIONS *******************


	// STARTING THE TOOL. TO MAKE SURE, EVERYTHING HAS BEEN LOADED CORRECTLY, WE DOUBLE CHECK THE PRESENCE OF THE CONTENTS
	startup = () => {
	    let int = setInterval(function(){
	        if (
	            typeof Rec === "object" &&
	            typeof jQuery === "function" &&
	            typeof jQuery().slider === "function" &&
	            typeof jQuery().tabs === "function" &&
	            typeof jQuery().spectrum === "function" &&
	            typeof setup === "function"
	        ) {
	            clearInterval(int);

	            /************************************
	             *****      SETUP RECORDER      *****
	             ************************************/
	            Rec.setup({
	                stopButton:         "stop",                   // BUTTON ID
	                prevButton:         "prev",                   // BUTTON ID
	                playButton:         "play",                   // BUTTON ID
	                nextButton:         "next",                   // BUTTON ID
	                recButton:          "rec",                    // BUTTON ID
	                loadButton:         "recload",                // BUTTON ID
	                saveButton:         "recsave",                // BUTTON ID
	                listButton:         "reclist",                // BUTTON ID
	                isEditable:         1,                        // EDIT FLAG
	                recContent:         "reccontent",             // DIV ID FOR DISPLAYING THE CONTENT OF THE RECORD
	                normalStyle:        "recbutton_bg",           // NORMAL BUTTONS STYLE CLASS
	                highlightStyle:     "recbutton_bg_highlight", // HIGHLIGHTED BUTTONS STYLE CLASS
	                styleClass:         "recbutton",              // MAIN BUTTON STYLE CLASS
	                mainDiv:            "record",                 // DIV ID TO USE FOR THE BUTTONS AND CONTROLS
	                spanInfo:           "rec-info",               // ID OF THE SPAN TAG FOR INFORMATION DISPLAY
	                uploadFile:         "recinput",               // ID OF THE FILE INPUT TAG
	                slider_box:         "slider_box",             // CLASS OF THE SLIDER DIV BOX
	                slider:             "rec-slider",             // SLIDER ID TO CONTROL PLAYBACK SPEED
	                slider_value:       "slider_value",           // CLASS OF THE SPAN ELEMENT, WHERE THE SPEED VALUE IS SHOWN
	                speed:              3,                        // PLAYBACK SPEED (1 = NORMAL, 2 = DOUBLE, 0.5 = HALF SPEED...)
	                usePreview:         0,                        // SWITCH OFF THE PREVIEW CANVAS WHILE PLAYBACK?
	                useTools:           1,
	                toolsDiv:           ".tools",
	                usePresets:         1,
	                presetsDiv:         ".presets",
	                printArea:          "base64-code"            // ID OF TEXTAREA FOR TEXT RECORDING
	            });

	            /****************************************
	             ***** JQUERY SPECTRUM COLOR PICKER *****
	             ****************************************/
	            $(".color-preview").spectrum({
	                showAlpha:          1,
	                allowAlpha:         1,
	                showPalette:        1,
	                showButtons:        1,
	                clickoutFiresChange:1,
	                preferredFormat:    "hsl",
	                allowEmpty:         0,
	                showInitial:        1,
	                showInput:          1,
	                move:               colorSubmit,
	                hide:               function (colors) {
	                                      showUp(0);
	                                      colorSubmit(colors);
	                                      if (Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 9)) Rec[(Rec.isRec ? "rec" : "collect")](5, ["~class~color-preview", "spectrum('hide')"]);
	                                      if (Rec.temp.edit.active && Rec.temp.edit.mode === 9) Rec.addItemSpecial();
	                                    },
	                beforeShow:         function() {
	                                      showUp(1);
	                                      let rgb = inputToRgb(colorpicker.value);
	                                      rgb.a = parseFloat((opacity.value *0.01).toFixed(2));
	                                      $(this).spectrum("set", rgb);
	                                      $(this).spectrum("reflow");
	                                      if (Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 9)) Rec[(Rec.isRec ? "rec" : "collect")](5, ["~class~color-preview", "spectrum('show')"]);
	                                    },
	                offset:             offset(".color-preview")
	            });

	            /************************************
	             ***** JQUERY UI OPACITY SLIDER *****
	             ************************************/
	            $("#slider").slider({
	                value:              100,
	                min:                0,
	                max:                100,
	                step:               1,
	                orientation:        "horizontal",
	                animate:            "slow",
	                slide:              (event, {value}) => {
	                                        colorSubmit({ r: color.r, g: color.g, b: color.b, a: parseFloat((value * 0.01).toFixed(2)) });
	                                    },
	                change:             () => {
	                                        if (getComputedStyle(get("#sp-container")).display === "none" && Rec.temp.edit.active && Rec.temp.edit.mode === 10) Rec.addItemSpecial();
	                                    }
	            });

                $("#treshold").slider({
                    value: 5,
                    min: 0,
                    max: 30,
                    step: 1,
                    orientation: "horizontal",
                    animate: "slow",
                    slide: (e, precision) => {
                        treshold = 30 - precision.value;
                        get(".treshold-value").innerHTML = precision.value;
                    },
                    change: (e, precision) => {
                        treshold = 30 - precision.value;
                        get(".treshold-value").innerHTML = precision.value;
                    }
                });

				/************************************
	             *****        PATTERNIFY        *****
	             ************************************/

                 // CREATE DYNAMIC HTML CONTENT
                const keepalpha = createCheckbox(str.keepAlpha, "", "block alpha", "keepalpha", "record-checkbox", str.keepAlphaWhenColoring, get("#checkboxes"), () => {root.keepAlpha = keepalpha.checked;}),
                    drawoverlay = createCheckbox(str.drawOverlay, "", "block overlay", "drawoverlay", "record-checkbox", str.drawOverlayPixel, get("#checkboxes"), () => {root.drawOverlay = drawoverlay.checked;}),
                    antialiasing = createCheckbox(str.antiAliasing, "", "block antialiasing", "antialiasing", "record-checkbox", str.useAntiAliasing, get("#checkboxes"), () => {root.antiAliasing = antialiasing.checked;}),
                    tools = createTools([
                         [null, "tools", "#tool-container", "tools", [
                             ["clearfix tools-row1", ["undo", "redo", "pencil", "eraser", "eyedropper", "line", "rectangle", "parallelogram", "polygon", "ellipse", "clear", "fill"], 2],
                             ["clearfix tools-row2", ["move", "rotate", "clone", "text", "fileload", "getmatrix", ["changeColor", "change-color", "change-area"], ["clearColor", "clear-color", "clear-area"], ["colorToBW", "color-bw", "color-bw"]], null]], [null, null]
                         ],
                         ["tabs-5", "tab5", "#presets-tabs", null, [
                             ["clearfix", [["showItems", "show_items", "show_items"], ["removeFromLocalStorage", "remove_local", "remove_local off"],
                              ["selectMatrix", "select", "select"], ["copyMatrix", "copy", "copy"], ["cancelCopyMatrix", "cancel", "cancel"],
                              ["previewMatrix", "drop-item", "drop-item"], ["pasteMatrix", "paste", "paste"]], null]], [0, "<span class=\"board\"></span>"]
                         ]]);

                root.contextmenu = create("menu", {
                    classList: "contextmenu",
                    innerHTML: createContextMenu(contextMenu)
                }, document.body);

                /************************************
                 *****      JQUERY UI TABS      *****
                 ************************************/
                $("#presets-tabs").tabs();
                $("#presets-tools").tabs();

                // TOOL ITEMS INSIDE THE TOOLS AREA
                root.toolIcons = {
                    undo      : get("#undo"),
                    redo      : get("#redo"),
                    removeL   : get("#remove_local"),
                    select    : get("#select"),
                    selectS   : get("#select").closest("span"),
                    copy      : get("#copy"),
                    paste     : get("#paste"),
                    pasteS    : get("#paste").closest("span"),
                    preview   : get("#drop-item"),
                    remove    : get("#remove"),
                    show      : get("#show_items"),
                    cancel    : get("#cancel"),
                    cancelS   : get("#cancel").closest("span"),
                    clear     : get("#clear"),
                    move      : get("#move"),
                    clone     : get("#clone"),
                    rotate    : get("#rotate"),
                    clearColor: get("#clear-color"),
                    getMatrix : get("#getmatrix")
                },

                root.menuIcons = {
                     undo      : get("#m_undo"),
                     redo      : get("#m_redo"),
                     removeL   : get("#m_remove_local"),
                     select    : get("#m_select"),
                     copy      : get("#m_copy"),
                     paste     : get("#m_paste"),
                     preview   : get("#m_drop-item"),
                     remove    : get("#m_remove"),
                     show      : get("#m_show_items"),
                     cancel    : get("#m_cancel"),
                     clear     : get("#m_clear"),
                     move      : get("#m_move"),
                     clone     : get("#m_clone"),
                     rotate    : get("#m_rotate"),
                     stop      : get("#m_rec_stop"),
                     play      : get("#m_rec_play"),
                     rec       : get("#m_rec_rec" ),
                     editS     : get("#m_rec_edit span")
                };
                root.keepalpha = keepalpha;
                root.keepAlpha = keepalpha.checked;
                root.drawoverlay = drawoverlay;
                root.drawOverlay = drawoverlay.checked;
                root.antialiasing = antialiasing;
                root.antiAliasing = antialiasing.checked;

                setup();
                activateLogo();

                $("#loading").hide();
                $("#frame").fadeIn(300, () => get("#frame").style.display = "grid");
	        }
	    }, 100);
	},

	/****************************
	 ***     CONTEXTMENU      ***
	 ****************************/
	showMenu = function(e) {
	    let box = contextmenu.getBoundingClientRect(),
	    	submenus = contextmenu.querySelectorAll("menu.contextmenu"),
	    	left, top, x, y;
	    e.x > innerWidth / 2 ? (left = parseInt(e.x - box.width + scrollX) + "px", x = 0) : (left = parseInt(e.x + scrollX) + "px", x = 1);
	    e.y > innerHeight / 2 ? (top = parseInt(e.y - box.height + scrollY) + "px", y = 0) : (top = parseInt(e.y + scrollY) + "px", y = 1);
	    contextmenu.style.top = top;
	    contextmenu.style.left = left;
	    [].forEach.call(submenus, function(el) {
	            el.style.left = x ? "99%" : "";
	            el.style.right = x ? "" : "99%";
	            el.style.top = y ? "4px": "";
	            el.style.bottom = y ? "": "4px";
	    });
	    contextmenu.classList.add("show-contextmenu");
	},

	hideMenu = function(){
	    contextmenu.classList.remove("show-contextmenu");
	},

	onContextMenu = function(e){
	    e.preventDefault();
	    showMenu(e);
	    document.addEventListener("click", onContextmenuOut);
	},

	onContextmenuOut = function(e) {
	    if (e.target.closest("button") && e.target.closest("button").id || !e.target.closest("menu")) {
	        e.preventDefault();
	        e.stopPropagation();
	        hideMenu();
	        document.removeEventListener("click", onContextmenuOut);
	    }
	},

	createContextMenu = function(arr) {
	    let entry = "";
	    for (let i = 0; i < arr.length; i++) entry += arr[i][0] === "separator" ? separator : arr[i][2].constructor === Array ?
	    submenuItem.replace(/%item%/g, arr[i][0]).replace(/%clid%/g, arr[i][1]) + createContextMenu(arr[i][2], 1) + submenuEnd :
	    menuItem.replace(/%item%/, arr[i][0]).replace(/%clid%/g, arr[i][1]).replace(/%class%/, arr[i][2]).replace(/%hotkey%/, arr[i][1]);
	    return entry;
	},

    /**************************
     ***   Clone Drawings   ***
     **************************/
    clone = {
        getMatrix: function(f, t) {
            [clone.from, clone.to] = [{xc: Math.min(f.xc, t.xc), yc: Math.min(f.yc, t.yc)}, {xc: Math.max(f.xc, t.xc), yc: Math.max(f.yc, t.yc)}];
            clone.offset = clone.from;
            [f, t] = [clone.from, clone.to];
            clone.matrix = matrix.slice(f.xc, t.xc + 1);
            clone.matrix.forEach(function(e, c) {clone.matrix[c] = clone.matrix[c].slice(f.yc, t.yc + 1);});
            return [clone.from, clone.to];
        },
        moveMatrix: function(direction) {
            let cMatrix = clone.matrix, x1, x2, y1, y2, i, j,
                matrix = resetMatrix(),
                offset = clone.offset,
                width = matrix.length, height = matrix[0].length,
                cWidth = cMatrix.length, cHeight = cMatrix[0].length;
            typeof direction === "number" && (
                direction === 0 && offset.yc >= -cHeight ? offset.yc-- :
                direction === 1 && offset.yc < pixelsY ? offset.yc++ :
                direction === 2 && offset.xc >= -cWidth ? offset.xc-- :
                direction === 3 && offset.xc < pixelsX && offset.xc++
            );
            x1 = Math.max(0, offset.xc);
            x2 = Math.min(width, offset.xc + cWidth);
            y1 = Math.max(0, offset.yc);
            y2 = Math.min(height, offset.yc + cHeight);
            for (i = x1; i < x2; i++) for(j = y1; j < y2; j++) matrix[i][j] = cMatrix[i - offset.xc][j - offset.yc];
            clone.m = matrix;
            refreshGrid("copy", matrix);
            drawRectangle({xc: x1, yc: y1}, {xc: x2 - 1, yc: y2 - 1});
        },
        finish: function() {
            let m = clone.m;
            temp.clone = temp.clone || {};
            if (!m || m.constructor !== Array || m[0].constructor !== Array) return;
            temp.clone.matrix = [...matrix];
            matrix = [...addMatrixToMatrix(matrix, m)];
            let grid = JSON.stringify({
                actionNumber: ++actionNumber,
                matrix: temp.clone.matrix,
                newmatrix: [...matrix],
                xcursor: xcursor,
                ycursor: ycursor,
                newxcursor: xcursor,
                newycursor: ycursor
            });
            logAction(2, grid);
            copyObject.array.push(optimizeMatrix(clone.m));
            copyObject.arrayPointer++;
            copyObject.updateBoard();
            clone.reset();
            refreshGrid();
            redrawPreview();
        },
        reset: function() {
            messageId && message();
            drawObject = cloneObject(defaultDrawObject);
            temp.clone = {};
            clone.m = clone.from = clone.to = clone.offset = 0,
            clear("move");
            clear("copy");
        }
    };

    /********************************************
     ***   Copy & Paste to / from the Board   ***
     ***   patterns and pattern pieces only   ***
     ********************************************/
    class CopyAndPaste {
        constructor() {
            this.matrix = [];
            this.array = [];
            this.pasteActive = 0;
            this.copyActive = 0;
            this.arrayPointer = 0;
            this.previousMode = 0;
            this.isNewText = 0;
        }
        select(){
            this.matrix = resetMatrix();
            this.cancel(1);
            this.copyActive = 1;
        }
        copy() {
            if (matrixIsEmpty(this.matrix)) return;
            this.array.push(optimizeMatrix(this.matrix));
            this.arrayPointer++;
            this.updateBoard();
            this.saveLocal(1);
            this.cancel(1);
        }
        paste() {
            this.pasteActive = 0;
            matrix = this.mergeMatrix();
            logAction(4, JSON.stringify({
                actionNumber: ++actionNumber,
                matrix: temp.copy.matrix ? [...temp.copy.matrix] : [...matrix],
                newmatrix: [...matrix],
                pixelsX: temp.copy.pixelsX,
                pixelsY: temp.copy.pixelsY,
                xcursor: temp.copy.xcursor,
                ycursor: temp.copy.ycursor,
                newpixelsX: matrix.length,
                newpixelsY: matrix[0].length,
                newxcursor: matrix.length,
                newycursor: matrix[0].length
            }));
            temp.copy = {};
            this.isNewText && (
                this.updateBoard(),
                this.isNewText = 0,
                this.saveLocal(1)
            );
            this.matrix = resetMatrix();
            refreshGrid();
            redrawPreview();
            this.cancel(1);
            this.previousMode && (
                toolAction(modes[this.previousMode]),
                this.previousMode = 0
            );

        }
        pasteItem() {
            copyObject.matrix = [...copyObject.array[copyObject.arrayPointer]];
            let w = copyObject.matrix.length,
                h = copyObject.matrix[0].length;
            clear("copy");
            copyObject.pasteActive = 1;
            copyObject.previousMode = mode;
            temp.copy || (temp.copy = {});
            temp.copy.matrix || (
                temp.copy.pixelsX = pixelsX,
                temp.copy.pixelsY = pixelsY,
                temp.copy.xcursor = xcursor,
                temp.copy.ycursor = ycursor,
                temp.copy.matrix = [...matrix]
            );
            resizeGrid({
                matrix: [...matrix],
                pixelsX: Math.max(pixelsX, w),
                pixelsY: Math.max(pixelsY, h)
            });
            setTimeout( function() {
                refreshGrid("copy", copyObject.matrix);
                closeModal();
                toolAction("move");
                messageIsOpen ? AlertismToastText.innerHTML = str.positionAndPressEnter : message("info", null, str.positionAndPressEnter);
            }, 300);
        }
        showItems() {
            !this.copyActive && !this.isNewText && (
                !messageId && message("info", str.showItemsMsg),
                this.displayBoard()
            );
        }
        showItem(e) {
            this.arrayPointer += e;
            this.displayBoard();
        }
        // MERGES TWO MATRICES
        mergeMatrix() {
            if (!this.matrix) return;
            let matrix1 = [...matrix],
                matrix2 = [...this.matrix],
                canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d"),
                w = Math.max(matrix1.length, matrix2.length),
                h = Math.max(matrix1[0].length, matrix2[0].length),
                x, y, z, newmatrix = [];
            canvas.width = w;
            canvas.height = h;
            for (x = 0; x < w; x++) {
                !matrix1[x] && (matrix1[x] = []);
                !matrix2[x] && (matrix2[x] = []);
                for (y = 0; y < h; y++) {
                    !matrix1[x][y] && (matrix1[x][y] = 0);
                    !matrix2[x][y] && (matrix2[x][y] = 0);
                    matrix1[x][y] && (
                        ctx.fillStyle = `rgba(${matrix1[x][y].join(",")})`,
                        ctx.fillRect(x, y, 1, 1)
                    );
                    matrix2[x][y] && (
                        ctx.fillStyle = `rgba(${matrix2[x][y].join(",")})`,
                        ctx.fillRect(x, y, 1, 1)
                    );
                }
            }
            let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height),
                id = imgData.data;
            for (x = 0; x < w; x++) {
                newmatrix[x] = [];
                for (y = 0; y < h; y++) {
                    z = (w * y + x) * 4;
                    newmatrix[x][y] = id[z+3] ? [id[z], id[z+1], id[z+2], parseFloat((Math.floor(id[z+3] / 2.55) * 0.01).toFixed(2))] : 0;
                }
            }
            return newmatrix;
        }
        // e = 1: RESET WHOLE TOOL INCL. BUTTONS
        // e = 2: USE THE MATRIX BACKUP THAT WAS SAVED TO BE RESTORED IN CASE OF CANCEL
        // e = 3: USE BOTH OPTIONS
        cancel(e) {
            (e & 1) && this.resetButtons();
            (e & 2) && temp.copy?.matrix && resizeGrid({matrix: temp.copy.matrix, pixelsX: temp.copy.x, pixelsY: temp.copy.y, xcursor: temp.copy.xc, ycursor: temp.copy.yc});
            this.isNewText && this.array.pop();
            temp.copy = {};
            this.copyActive = 0;
            this.pasteActive = 0;
            this.matrix = resetMatrix();
            clear("copy");
            messageId && message();
        }
        resetButtons() {
            [].forEach.call(get(".tab5 a"), function(tool) { tool.classList.remove("active"); });
        }
        remove() {
            this.array.splice(this.arrayPointer, 1);
            this.array.length && this.arrayPointer === this.array.length && (this.arrayPointer = this.array.length - 1);
            this.saveLocal(this.array.length ? 1 : 0);
            !this.array.length && (closeModal(), messageId && message());
            copyObject.showItems();
        }
        saveLocal(e) {
            useLocalStorage && (
                e ? this.array.length && this.saveCopyArray() : (
                    this.array = [],
                    remove("b__up"),
                    this.cancel(1),
                    flashMessage(str.removedFromLocalStorage),
                    messageId && message()
                ), this.updateBoard()
            );
        }
        // Converts the numbers matrices consist of to a string representing the numbers as chars.
        // i.e. it does this with a whole array.
        // This makes it possible to store larger data arrays
        // in the local storage. The resulting string needs only a third
        // of the space than the JSON-encoded array.
        saveCopyArray() {
            if (!useLocalStorage && !useCookies) return;
            if (!this.array.length) return;
            let arr, str, val = [], c = 0, i, j, k, l;
            for (; c < this.array.length; c++) {
                arr = this.array[c];
		if (!arr.length  || !arr[0]?.length) continue;
                str = String.fromCharCode(arr.length) + String.fromCharCode(arr[0].length);
                for (i = 0; i < arr.length; i++) for (j = 0; j < arr[i].length; j++) for (k = 0; k < 4; k++) str += String.fromCharCode(typeof arr[i][j] === "object" ? k === 3 ? arr[i][j][k] * 255  : arr[i][j][k] : 0);
                val.push(str);
            }
            return save("b__up", val);
        }
        loadCopyArray(array) {
            if (!(typeof array === "object" && array.length) && !(array = load("b__up"))) return;
            let arr, str = [], out = [], I, J, c = 0, d = 0, i, j, k, val;
            while(arr = array[c]) {
                out[c] = [];
                [I, J] = [arr.charCodeAt(0),  arr.charCodeAt(1)];
                arr = arr.substring(2);
                for (i = 0; i < I; i++) {
                    out[c][i] = [];
                    for (j = 0; j < J; j++) {
                        for (k = 0; k < 4; k++) {
                            val = arr.charCodeAt(d++);
                            k === 3 && (val = parseFloat((val / 255).toFixed(2)));
                            str.push(val);
                        }
                        out[c][i][j] = str[0] + str[1] + str[2] === 0 ? 0 : str;
                        str = [];
                    }
                }
                c++;
            }
            this.array = out;
            this.arrayPointer = this.array.length - 1;
            return out;
        }
        updateBoard() {
            get(".board").textContent = `${str.board}: ${this.array.length} ${str.element}${this.array.length === 1 ? "" : str.elementPlural}`;
        }
        displayBoard() {
            if (!copyObject.array.length) return;
            copyObject.arrayPointer = copyObject.arrayPointer >= copyObject.array.length ? 0 : copyObject.arrayPointer < 0 ? copyObject.array.length - 1 : copyObject.arrayPointer;
            let width = 0, height = 0, x, y, startX, startY, rgb,
                ctx = controlCanvas.getContext("2d"),
                ctrl = get("#canvas-control"),
                pos = get("#pos"),
                item = copyObject.array[copyObject.arrayPointer];
            if (!item.length  || !item[0]?.length) return alert("Error: Invalid Board-Array!");
            copyObject.array.forEach(a => a.length && a[0]?.length && (width = Math.max(width, a.length, 120), height = Math.max(height, a[0].length)));
            width *= 2;
            height *= 2;
            controlCanvas.width = width;
            controlCanvas.height = height;
            copyItems.style.border = "#000 1px solid";
            copyItems.style.borderRadius = "10px";
            ctrl.style.margin = "0 " + (0.25 * width) + "px";
            pos.style.width = removeCopy.style.width = fwd.style.width = rew.style.width = (width / 4 - 3) + "px";
            openModal("copyItems");
            startX = parseInt(controlCanvas.width * 0.5 - item.length);
            startY = parseInt(controlCanvas.height * 0.5 - item[0].length);
            for (x = 0; x < item.length; x++) {
                for (y = 0; y < item[0].length; y++) {
                    (rgb = item[x][y]) && (
                        ctx.fillStyle = "rgba(" + rgb.join(",") + ")",
                        ctx.fillRect(x * 2 + startX, y * 2 + startY, 2, 2)
                    );
                }
            }
            pos.textContent = (copyObject.arrayPointer + 1) + "/" + copyObject.array.length;
        }
    }

    root.each = each;
    root.create = create;
    root.createCheckbox = createCheckbox;
    root.createToolList = createTools;
    root.createTool = createTool;
	root.inputToRgb = inputToRgb;
	root.rgbToHex = rgbToHex;
	root.get = get;
	root.message = message;
	root.body = body;
	root.cloneObject = cloneObject;
	root.sameColor = sameColor;
	root.save = save;
    root._GET_All = _GET_All;
	root._GET = _GET;
	root.addEventListenerOnce = addEventListenerOnce;
	root.remove = remove;
	root.load = load;
	root.width = width;
	root.height = height;
	root.offset = offset;
	root.onContextMenu = onContextMenu;
	root.startup = startup;
	root.activateLogo = activateLogo;
	root.copyObject = new CopyAndPaste();
	root.rnd = rnd;
	root.objectToString = objectToString;
    root.clone = clone;
    root.downloadJS = downloadJS;
    root.LZW = LZW;
    root.execAsync = execAsync;
})(window);
