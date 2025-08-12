(function(root) {

    const attributes={global:["accesskey","class","contenteditable","contextmenu","data-*","dir","draggable","dropzone","hidden","id","itemprop","lang","slot","spellcheck","style","tabindex","title","type"],accept:["form","input"],"accept-charset":["form"],action:["form"],align:["applet","caption","col","colgroup","hr","iframe","img","table","tbody","td","tfoot","th","thead","tr"],alt:["applet","area","img","input"],async:["script"],autocomplete:["form","input"],autofocus:["button","input","keygen","select","textarea"],autoplay:["audio","video"],autosave:["input"],bgcolor:["body","col","colgroup","marquee","table","tbody","tfoot","td","th","tr"],border:["img","object","table"],buffered:["audio","video"],cellpadding:["table"],cellspacing:["table"],challenge:["keygen"],charset:["meta","script"],checked:["command","input"],cite:["blockquote","del","ins","q"],code:["applet"],codebase:["applet"],color:["basefont","font","hr"],cols:["textarea"],colspan:["td","th"],content:["meta"],controls:["audio","video"],coords:["area"],crossorigin:["audio","img","link","script","video"],data:["object"],datetime:["del","ins","time"],default:["track"],defer:["script"],dirname:["input","textarea"],disabled:["button","command","fieldset","input","keygen","optgroup","option","select","textarea"],download:["a","area"],enctype:["form"],for:["label","output"],form:["button","fieldset","input","keygen","label","meter","object","output","progress","select","textarea"],formaction:["input","button"],headers:["td","th"],height:["canvas","embed","iframe","img","input","object","svg","video"],high:["meter"],href:["a","area","base","link"],hreflang:["a","area","link"],"http-equiv":["meta"],icon:["command"],integrity:["link","script"],ismap:["img"],keytype:["keygen"],kind:["track"],label:["track"],language:["script"],list:["input"],loop:["audio","bgsound","marquee","video"],low:["meter"],manifest:["html"],max:["input","meter","progress"],maxlength:["input","textarea"],media:["a","area","link","source","style"],method:["form"],min:["input","meter"],multiple:["input","select"],muted:["video"],name:["button","form","fieldset","iframe","input","keygen","object","output","select","textarea","map","meta","param"],novalidate:["form"],open:["details"],optimum:["meter"],pattern:["input"],ping:["a","area"],placeholder:["input","textarea"],poster:["video"],preload:["audio","video"],preserveAspectRatio:["svg"],radiogroup:["command"],readonly:["input","textarea"],rel:["a","area","link"],required:["input","select","textarea"],reversed:["ol"],rows:["textarea"],rowspan:["td","th"],sandbox:["iframe"],scope:["th"],scoped:["style"],seamless:["iframe"],selected:["option"],shape:["a","area"],size:["input","select"],sizes:["link","img","source"],span:["col","colgroup"],src:["audio","embed","iframe","img","input","script","source","track","video"],srcdoc:["iframe"],srclang:["track"],srcset:["img"],start:["ol"],step:["input"],summary:["table"],target:["a","area","base","form"],type:["button","input","command","embed","object","script","source","style","menu"],usemap:["img","input","object"],value:["button","option","input","li","meter","progress","param"],width:["canvas","embed","iframe","img","input","object","svg","video"],wrap:["textarea"],xmlns:["svg"]},each=(e,t)=>{try{e.constructor===Object?Object.entries(e).forEach((([e,a],r)=>{t(e,a,r)})):[...e].forEach(((e,a)=>t(e,a)))}catch(e){}},toCamelCase=e=>e.replace(/-(\w)/g,((e,t)=>t.toUpperCase()));function tag(){const e=Array.isArray(arguments[0])?arguments[0]:[...arguments];let t,a,r,n;return 1===e.length&&"string"==typeof e[0]?e[0].startsWith("<")?(n=document.createElement("div"),n.innerHTML=e[0],n.firstElementChild):tag.fromString(e[0]):(each(e,((n,o)=>(n=Object.keys(n),r=e[o][n[0]],"text"===n[0]&&n[1]?e[o][n[1]].appendChild(document.createTextNode(e[o][n[0]])):"comment"===n[0]&&n[1]?e[o][n[1]].appendChild(document.createComment(e[o][n[0]])):(n[1]&&(a=e[o][n[1]]),t=document.createElement(n[0]),r&&each(r,((e,a)=>{"children"===e?each(a,(e=>"Object"===e.constructor.name?tag({...e,parent:t}):t.append(e))):"data"===e?each(a,((e,a)=>t.dataset[e]=a)):"text"===e?t.appendChild(document.createTextNode(a)):"comment"===e?t.appendChild(document.createComment(a)):"html"===e?t.innerHTML+=a:"for"===e?t.htmlFor=a:"style"===e?"object"==typeof a?each(a,((e,a)=>t.style[e]=a)):each(a.split(";"),(e=>{let[a,r]=e.split(":").map((e=>e.trim()));t.style[toCamelCase(a)]=r})):attributes.global.includes(e)||attributes[e]&&attributes[e].includes(n[0])?t.setAttribute(e,a):t[e]=a})),void(a&&a.appendChild(t)))))),t)}function DOM2Object(e,t,a){const r=[...e.childNodes];let n=[],o={},i="";return each(r,(e=>{[3,8].includes(e.nodeType)?(e.nodeValue||e.textContent||e.innerText).trim()&&n.push({[e.nodeName.substring(1)]:e.nodeValue||e.textContent||e.innerText}):(i=e.nodeName.toLowerCase(),o[i]={},o[i].children=[]),e.attributes?.length&&each([...e.attributes],(({name:e,value:t})=>{"class"===e&&(e="className"),"data-"===e.substring(0,5)?o[i].dataset={...o[i].dataset,[e.substring(5)]:t}:o[i][e]=t})),e.childNodes?.length&&(o[i].children=DOM2Object(e,t,1)),Object.keys(o).length&&(1===o[i].children.length&&o[i].children[0].text?(o[i].text=o[i].children[0].text,delete o[i].children):!o[i].children.length&&delete o[i].children,!a&&t&&(o.parent=t),n.push(o),o={})})),n}tag.stringify=function(e,t,a){let r=a?JSON.stringify(DOM2Object(e,t),null,"string"==typeof a||"number"==typeof a?a:"  "):JSON.stringify(DOM2Object(e,t));return r=r.replace(/"([$a-zA-Z0-9_]+)":/g,"$1:"),r=r.replace(/"?parent"?: ?"(.*?)"/g,"parent:$1"),r=r.substring(1,r.length-1),r},tag.get=e=>{if("string"!=typeof e)return!1;const t=e.match(/(\w+)\[(.*?)\]/);return 3===t?.length?document.querySelectorAll(t[1]+t[2])||!1:document.getElementsByTagName(e)||!1},tag.parse=e=>"object"==typeof e?tag(e):tag.fromString(e),tag.fromString=e=>{let t={},a="",r="",n="",o=0,i=0;return each(e,(e=>{"."===e?(o=1,i=0,r.length&&(r+=" ")):"#"===e?(o=0,i=1):o?r+=e:i?n+=e:a+=e})),t[a]={},n&&(t[a].id=n),r&&(t[a].className=r),tag(t)};

    (function Console() {
        if (window.consoleLoaded) return;
        const originalConsole = console;
        const $console = tag({ 'c-console': { onclick: e => e.target.getAttribute('action') === "use code" && ($input.value = e.target.getAttribute('data-code'), $input.focus())}});
        const $inputContainer = tag({ 'c-input': { style: { position: "sticky", bottom: 0, left: 0 }}, parent: $console});
        const $input = tag({ textarea: { id: '__c-input', onblur: () => setTimeout(() => isFocused = false, 0) }, parent: $inputContainer});

        const counter = {};
        const timers = {};
        let isFocused = false, isMoved = false, isTouch = "ontouchstart" in document;
        if (!window.__objs) window.__objs = {};
        if (!tag.get('c-console').length) {
            const $style = tag({ style: { textContent: css() }, parent: document.head });
            window.addEventListener('error', onError);
            assignCustomConsole();
            $console.setAttribute('title', 'Console');
        }

        function assignCustomConsole() {
            window.console = {
              assert: (condition, msg, ...substituion) => !condition && log('error', getStack(new Error()), msg, ...substituion),
              clear: () => (isFocused && $input.focus(), $console.textContent = '', $console.appendChild($inputContainer)),
              count: (hash = 'default') => (counter[hash] ? ++counter[hash] : counter[hash] = 1, log('log', getStack(new Error()),`${hash}: ${counter[hash]}`)),
              countReset: (hash) => delete counter[hash],
              debug: (...args) => log('log', getStack(new Error()), ...args),
              dir: (...args) => log('log', getStack(new Error()), ...args),
              dirxml: (...args) => log('log', getStack(new Error()), ...args),
              error: (...args) => (originalConsole.error(...args), log('error', getStack(new Error()), ...args)),
              group: (...args) => log('log', getStack(new Error()), ...args),
              groupCollapsed: (...args) => log('log', getStack(new Error()), ...args),
              groupEnd: (...args) => log('log', getStack(new Error()), ...args),
              info: (...args) => (originalConsole.info(...args), log('info', getStack(new Error()), ...args)),
              log: (msg, ...substituion) => (originalConsole.log(msg,...substituion), log('log', getStack(new Error()), msg, ...substituion)),
              table: (...args) => log('log', getStack(new Error()), ...args),
              trace: (...args) => log('trace', getStack(new Error()), ...args),
              warn: (msg, ...substituion) => (originalConsole.warn(msg, ...substituion), log('warn', getStack(new Error()), msg, ...substituion)),
              time: (label = 'default') => (typeof label !== 'string' ? () => { throw new TypeError('label must be a string')} : timers[label] = new Date().getTime(), undefined),
              timeEnd: (label = 'default') => typeof label !== 'string' ? () => { throw new TypeError('label must be a string') } : !timers[label] ? () => { throw new Error(`No such label: ${label}`) } : (log('log', getStack(new Error()), `${label}: ${new Date().getTime() - timers[label]}ms`), delete timers[label], undefined),
              timeLog: (label = 'default') => typeof label !== 'string' ? () => { throw new TypeError('label must be a string') } : !timers[label] ? () => { throw new Error(`No such label: ${label}`) } : (log('log', getStack(new Error()), `${label}: ${new Date().getTime() - timers[label]}ms`), undefined)
            };
        }

        const objValue = (obj, ...keys) => keys.reduce((acc, key) => acc[key], obj);

        function togglestart() {
            document.addEventListener(isTouch ? "touchmove" : "mousemove", togglemove, {passive: false});
            document[isTouch ? "ontouchend" : "onmouseup"] = toggleend;
        }

        function toggleend() {
            document.removeEventListener(isTouch ? "touchmove" : "mousemove", togglemove, {passive: false});
            document[isTouch ? "ontouchend" : "onmouseup"] = null;
            setTimeout(() => isMoved = 0, 100);
        }

        function togglemove(e) {
            e.preventDefault();
            toggler.style.transform = "translate(" + ((e.touches ? e.touches[0].clientX : e.clientX) - 20) + "px, " + ((e.touches ? e.touches[0].clientY : e.clientY) - 20) + "px)";
            isMoved = 1;
        }

        function toggleConsole() {
            if(isMoved) return;
            if($console.isConnected) {
            	$input.removeEventListener('keydown', codeInput);
            	return $console.remove();
            }
            document.body.appendChild($console);
            //$input.focus();
            $input.addEventListener('keydown', codeInput);
        }

        const toggler = tag({ 'c-toggler': { onclick: toggleConsole, [isTouch ? "ontouchstart" : "onmousedown"]: togglestart, html: '>', style: `transform: translate(2px, ${innerHeight / 2}px)`},  parent: document.body });

        function codeInput(e) {
            const key = e.keyCode || e.which;
            isFocused = true;
            if(key === 27) return (isFocused = false, toggleConsole());
            if(key === 13) {
            	const opener = /[\[\{\(]/g;
            	const closer = /[\)\}\]]/g;
            	let code = this.value;
            	let isOdd = (code.length - code.replace(opener, '').length) - (code.length - code.replace(closer, '').length);
            	if(isOdd > 0 || (code.length && code[code.length - 1].match(closer))) {
            		let row = code.split("\n"),
            			i = -1;
            		if([")", "]", "}"].indexOf(row[row.length - 1].trim()[0]) > -1) {
            			let temp = code.split("\n");
            			temp[temp.length - 1] = temp[temp.length - 1].replace(/  /, "");
            			this.value = code = temp.join("\n");
            		}
            		row = row[row.length - 1];
            		let add = 2 * (row.length - row.replace(opener, "").length) + 2 * (row.replace(closer, "").length - row.length);
            		while(row[++i] == " ") {}
            		i += add;
            		i < 0 && (i = 0);
            		if (isOdd > 0) return setTimeout(function() { $input.value += " ".repeat(i); }, 1);
            	}
            	if(!code || code.split("\n").length === code.length + 1) return;

            	e.preventDefault();
            	e.stopPropagation();
            	e.stopImmediatePropagation();
            	log('code', {}, code);
            	$input.value = '';
            	const res = execute(code);
            	if(res.type === 'error') log('error', getStack(new Error()), res.value);
            	else log('log', getStack(new Error()), res.value);
            }
        }

        function getBody(obj, ...keys) {
            if (obj instanceof Promise && !('[[PromiseStatus]]' in obj)) obj = getPromiseStatus(obj);
            let value = objValue(obj, ...keys);
            const $group = tag('c-group');
            const $toggler = tag({'c-type': { type: 'body-toggler', textContent: (value ? value.constructor.name : value + '') }});

            if(value instanceof Object){

              $toggler.onclick = function(){
                if (this.classList.contains('__show-data')) {
                  this.classList.remove('__show-data');
                  $group.textContent = null;
                  return;
                }
                this.classList.toggle('__show-data');
                const possibleKeys = [];
                for(let key in value) possibleKeys.push(key);
                possibleKeys.push(...[...Object.keys(value), ...Object.getOwnPropertyNames(value), ...Object.keys(value['__proto__'] || {})]);
                if(value.__proto__) possibleKeys.push('__proto__');
                if(value.prototype) possibleKeys.push('prototype');
                [...new Set(possibleKeys)].forEach(key => $group.append(appendProperties(obj, ...keys, key)));
              };

              $toggler.textContent = value.constructor.name;
            } else {
              const $val = getElement(value);
              $val.textContent = value ? value.toString() : "";
              $group.append($val);
            }

            return [$toggler, $group];
        }

        function appendProperties(obj, ...keys) {
            const key = keys.pop();
            const value = objValue(obj, ...keys);
            const getter = value.__lookupGetter__(key);
            const $key = tag({ 'c-key': { textContent: key + ':' }});
            let $val;
            if(getter){
              $val = tag({ 'c-span': { style: "textDecoration: underline; color: #39f; margin: 0 10px", textContent: `...`, onclick: () => {
                const $val = getVal(value[key]);
                this.parentElement.replaceChild($val, this);
              }}});
            } else $val = getVal(value[key]);

            return tag({ 'c-line': { children: [$key, $val] }});

            function getVal(val) {
              const type = typeof val;
              const $val = getElement(type);
              type === 'object' && val !== null ? $val.append(...getBody(obj, ...keys, key)) : (
                type === 'function' && (val = parseFuntion(val)),
                $val.textContent = val + ''
            );
              return $val;
            }
        }

        function getPromiseStatus(obj) {
            if (obj.info) return;
            let status = 'pending';
            let value;
            let result = obj.then(val => { status = 'resolved'; value = val; }, val => { status = 'rejected'; value = val; });

            Object.defineProperties(result, {
              '[[PromiseStatus]]': {
                get: () => status,
              },
              '[[PromiseValue]]': {
                get: () => value,
              },
            });

            return result;
        }

        function getElement(type) {
            return tag({'c-text': { className: `__c-${type}` }});
        }

        function parseFuntion(data) {
            return data.toString(); //.replace(/({).*(})/, '$1...$2').replace(/^function\s+[\w_$\d]+\s*/, '').replace(/\s*/g, '');
        }

        function log(mode, options, ...args) {
            let location = options.location || 'console';
            const $messages = tag('c-message');
            $messages.setAttribute('log-level', mode);

            args = format(args);

            if(args.length === 1 && args[0] instanceof Error){
              args.unshift(args[0].message);
            }

            for (let arg of args) {

              const typeofArg = typeof arg;
              arg = arg || "";
              let $msg;

              if (mode === 'code') {

                $msg = tag('c-code');
                $msg.textContent = arg.length > 50 ? arg.substring(0, 50) + '...' : arg;
                $msg.setAttribute('data-code', arg);
                $msg.setAttribute('action', 'use code');

              } else {

                $msg = getElement(typeofArg);

                switch (typeofArg) {

                  case 'object':
                    $msg.append(...getBody(arg));
                    break;

                  case 'function':
                    $msg.innerHTML = parseFuntion(arg);
                    tag({ 'c-line': { children: [getBody(arg)] }, parent: $msg});
                    break;

                  default:
                    $msg.innerHTML = arg;
                    break;
                }
              }
              $messages.appendChild($msg);
            }

            if (location) tag({'c-stack': { html: `<c-date>${new Date().toLocaleString()}</c-date><c-trace>${location}</c-trace>` }, parent: $messages});

            $console.insertBefore($messages, $inputContainer);

            while ($console.childElementCount > 100){
              $console.firstElementChild.remove();
            }
        }

        function format(args) {
            if (args.length <= 1) return args;

            const originalArgs = [].concat(args);
            const styles = [];
            let msg = args.splice(0, 1)[0];

            if (typeof msg !== 'string') return originalArgs;

            let matched = matchRegex(msg);
            let match;
            while ((match = matched.next())) {
              if (match.done) break;
              let value = '';
              const specifier = match.value[0];
              const pos = match.value.index;

              if(!args.length){
                value = specifier;
              }else{
                value = args.splice(0, 1)[0];
                if ([undefined, null].includes(value)) {
                  value = value + '';
                }

                switch (specifier) {
                  case '%c':
                    styles.push({ value, pos });
                    value = '';
                    break;
                  case '%s':
                    if (typeof value === 'object') value = value.constructor.name;
                    break;
                  case '%o':
                  case '%O':
                    let id = new Date().getMilliseconds() + '';
                    window.__objs[id] = value;
                    value = `<c-object onclick='console.log(window.__objs[${id}])'>Object</c-object>`;
                    break;
                  case '%d':
                  case '%i':
                    value = parseInt(value);
                    break;
                  case '%f':
                    value = parseFloat(value);
                    break;
                  default:
                    break;
                }
              }
              msg = msg.substring(0, pos) + escapeHTML(value) + msg.substring(pos + 2);
              matched = matchRegex(msg);
            }

            if(styles.length){
              const toBeStyled = [];
              let remainingMsg = msg;
              styles.reverse().forEach((style, i) => {
                toBeStyled.push(remainingMsg.substring(style.pos));
                remainingMsg = msg.substring(0, style.pos);
                if(i === styles.length - 1) toBeStyled.push(msg.substring(0, style.pos));
              });
              msg = toBeStyled.map((str, i) => {
                if(i === toBeStyled.length - 1) return str;
                const {value} = styles[i];
                return `<c-span style="${value}">${str}</c-span>`;
              }).reverse().join('');
            }

            msg.replace(/%%[oOsdifc]/g, '%');

            args.unshift(msg);
            return args;

            function matchRegex(str) {
              return str.matchAll(/(?<!%)%[oOsdifc]/g);
            }
        }

        function getStack(error){
            let stack = error.stack.split('\n');
            stack.splice(1, 1);
            let regExecRes = /<(.*)>:(\d+):(\d+)/.exec(stack[1]) || [];
            let src = '';
            const location = regExecRes[1];
            const lineno = regExecRes[2];
            const colno = regExecRes[3];

            if(location && lineno){
              src = escapeHTML(`${location} ${lineno}${colno ? ':' + colno : ''}`);
            }else{
              const res = /\((.*)\)/.exec(stack[1])
              src = res && res[1] ? res[1] : '';
            }
            const index = src.indexOf(')');
            src = src.split('/').pop().substring(0, index < 0 ? undefined : index);
            if(src.length > 50) src = '...' + src.substring(src.length - 50);

            return {
              location: src,
              stack: stack.join('\n'),
            }
        }

        function execute(code) {
              let res = null;
              try {
                res = { type: 'result', value: window.eval(code) };
              } catch (error) {
                res = { type: 'error', value: error };
              }
              return res;
        }

        function onError(err) {
            const error = err.error;
            log("error", getStack(error), error);
        }

        function escapeHTML(str) {
            if (typeof str !== 'string') return str;
            const tags = {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '%': '&#37;',
            };
            return str.replace(new RegExp(`[${Object.keys(tags)}]`, 'g'), char => tags[char]) || '';
        }

        function css() {
            return `c-toggler {
              position: fixed;
              top: 0;
              left: 0;
              display: flex;
              height: 40px;
              width: 40px;
              background-color: #99f;
              align-items: center;
              justify-content: center;
              user-select: none;
              transform-origin: center;
              border-radius: 50%;
              color: #fff;
              box-shadow: -2px 2px 8px rgba(0, 0, 0, .4);
              z-index: 99999
            }

            c-object{
              color: #9999ff;
              text-decoration: underline;
            }

            c-toggler:active {
              box-shadow: -1px 1px 4px rgba(0, 0, 0, .4)
            }

            c-line {
              display: block;
            }

            c-console {
              box-sizing: border-box;
              overflow-y: auto;
              position: fixed;
              top: 0;
              left: 0;
              height: 100vh;
              width: 100vw;
              background-color: #313131;
              z-index: 99998;
              color: #eeeeee;
              font-family: "Roboto", sans-serif;
            }

            c-console[title]{
            padding-top: 65px;
            animation: --page-transition .1s ease 1;
            }

            c-console br:last-of-type {
              display: none;
            }

            c-console textarea {
              color: white;
              caret-color: currentColor !important;
              background-color: inherit;
            }

            c-input {
              display: flex;
              width: 100%;
              height: fit-content;
            }

            c-input::before {
              content: '>>';
              margin: 0 5px;
              height: 100%;
            }

            #__c-input {
              position: relative;
              width: 100%;
              border: none;
              background-color: transparent;
              overflow: scroll;
              resize: none;
              height: 200px;
            }

            #__c-input:focus {
            outline: none;
            }

            c-console[title]::before {
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              background-color: inherit;
              z-index: 999999;
              content: attr(title);
              display: flex;
              height: 44px;
              align-items: center;
              justify-content: center;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              font-weight: 900;
              box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
              margin-bottom: 10px;
              color: white;
              font-size: medium;
            }

            c-message {
              position: relative;
              display: flex;
              border-bottom: solid 1px rgba(204, 204, 204, 0.4);
              margin-bottom: 35px;
              font-size: .9rem;
              flex-wrap: wrap;
            }

            c-code {
              position: relative;
              color: rgb(214, 211, 211);
              font-size: 1em;
              font-family: 'Courier New', Courier, monospace;
              overflow-x: auto;
              white-space: pre;
              marginBottom: 0px;
              border: 'none';
            }

            c-code::after {
              content: 'use';
              background-color: #666;
              color: inherit;
              border-radius: 4px;
              padding: 0 0.4rem;
              font-size: 0.6rem;
            }

            c-code::before {
              content: '>>';
              padding: 0 5px;
              font-style: italic;
            }

            c-key {
              font-size: 0.9rem;
              color: #cc66ff;
            }

            c-message[log-level=error] {
              border-bottom: solid 1px rgba(255, 255, 255, 0.4);
              background-color: #422;
              color: inherit;
            }

            c-message[log-level=error]::after {
              background-color: #cc4343;
              color: inherit
            }

            c-message[log-level=warn] {
              border-bottom: solid 1px rgba(255, 255, 255, 0.4);
              background-color: #633;
              color: inherit;
            }

            c-message[log-level=warn]::after {
              background-color: #cc6969;
              color: inherit
            }

            c-stack:not(:empty) {
              content: attr(data-stack);
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              position: absolute;
              top: 100%;
              right: 0;
              display: flex;
              height: 20px;
              align-items: center;
              justify-content: space-between;
              width: 100vw;
              background-color: inherit;
              padding: 0 5px;
              box-sizing: border-box;
              font-size: .8rem;
              color: inherit;
            }

            c-text {
              padding: 2px;
              white-space: pre;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              overflow: auto;
              box-sizing: border-box;
              max-width: 100vw;
              font-size: 0.9rem;
              width: 100%;
              padding-left: 10px;
            }

            c-text.__c-boolean {
              color: rgb(130, 80, 177);
            }

            c-text.__c-number {
              color: rgb(97, 88, 221);
            }

            c-text.__c-symbol {
              color: rgb(111, 89, 172);
            }

            c-text.__c-function {
              color: rgb(145, 136, 168);
              font-family: 'Courier New', Courier, monospace;
              font-size: 0.9rem;
            }

            c-text.__c-function::before {
              content: 'ƒ';
              margin: 0 2px;
              font-style: italic;
              color: #9999ff;
            }

            c-text.__c-object,
            c-text.__c-undefined {
              color: rgb(118, 163, 118);
            }

            c-text.__c-string {
              color: rgb(59, 161, 59);
            }

            c-text.__c-string:not(.no-qoutes)::before {
              content: '"';
              margin-right: 2px;
            }

            c-text.__c-string:not(.no-qoutes)::after {
              content: '"';
              margin-left: 2px;
            }

            c-message.error c-text {
              overflow: unset;
              white-space: pre-wrap;
              word-break: break-word;
              color: white;
            }

            c-group {
              display: none;
              margin-left: 14px;
            }

            c-type[type="body-toggler"].__show-data+c-group {
              display: block;
            }

            c-type[type="body-toggler"]::before {
              display: inline-block;
              content: '▸';
              margin-right: 2.5px;
            }

            c-type[type="body-toggler"]::after {
              content: '{...}';
            }

            c-type[type="body-toggler"].__show-data::before {
              content: '▾';
            }

            c-type[type="body-toggler"].__show-data::after {
              display: none;
            }

            c-table {
              display: table;
              width: 100%;
              border-collapse: collapse;
              border-spacing: 0;
              font-size: 0.9rem;
              color: rgb(214, 211, 211);
              border: solid 1px rgba(204, 204, 204, 0.4);
            }

            c-table c-row {
              display: table-row;
              border-bottom: solid 1px rgba(204, 204, 204, 0.4);
            }

            c-table c-row:last-child {
              border-bottom: none;
            }

            c-table c-row:first-child {
              font-weight: bold;
            }

            c-table c-cell {
              display: table-cell;
              padding: 5px;
              border-bottom: solid 1px rgba(204, 204, 204, 0.4);
            }

            c-table c-cell:not(:last-child) {
            border-left: solid 1px rgba(204, 204, 204, 0.4);
            }

            c-date {
              margin-left: 1px;
            }

            @keyframes --page-transition {
              0% {
                  opacity: 0;
                  transform: translate3d(0, 50%, 0)
              }

              100% {
                  opacity: 1;
                  transform: translate3d(0, 0, 0)
              }
            }`;
        }
    })();
})(window);
