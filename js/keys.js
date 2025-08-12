/**************************************************
 **                                              **
 **              PATTERNIFY FLEX                 **
 **  __________________________________________  **
 **       Enhancements to 'FLEX' version         **
 **         (c) 2020 by Manuel Pelzer            **
 ** ___________________________________________  **
 **  keys.js                                     **
 **************************************************/
(function(root) {
    const each = (items = [], cb) => {
        items.constructor === Object ?
            Object.entries(items).forEach(([key, value], index) => cb(key, value, index)) :
        items.forEach((key, index) => cb(key, index));
    }
    const Keys = {
        // THE KEY NAMES CORRESPOND WITH THEIR ASCII CODES, UNUSED CODES ARE FILLED UP WITH ZEROS
        names: [0, 0, 0, 0, 0, 0, 0, 0, "backspace", "tab", 0, 0, 0, "enter", 0, 0,
                   "shift", "ctrl", "alt", 0, 0, 0, 0, 0, 0, 0, 0, "esc", 0, 0, 0, 0,
                   "space", "pageUp", "pageDown", "end", "home", "left", "up", "right", "down",
                   0, 0, 0, 0, "ins", "del", 0, "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 0,
                   "ü", "<", 0, 0, "ß", 0, "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
                   "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", 0, 0,
                   "ctx", 0, 0, "0", "1", "2", "3", "4", "5", "6",
                   "7", "8", "9", "*", "+", 0, "-", ",", "/",
                   "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", 0, 0, 0, 0],

        // FOR USING THE CTRL, SHIFT AND ALT KEYS TOGETHER WITH OTHER KEYS
        prefix: /(ctrl|shift|alt) \+ /,

        // TRANSLATION TABLE FOR THOSE KEYS
        metaLevel: {ctrl: 1, shift: 2, alt: 3, 1: "ctrl", 2: "shift", 3: "alt"},

        // IN THIS ARRAY ALL POSSIBLE ACTIONS ARE ACCESSIBLE BY THE ASCII CODE OF THE CORRESPONDING KEY AS INDEX
        actions: [],

        // USED TO SET THE KEYS ON A HASH ACTION (...INDEX.HTML#LANG=EN)
        set: function(keys) {
            this.customKeys = keys;
        },

        // CREATION OF THE ACTION ARRAY AND REPLACEMENT OF THE LOCALIZED CONTENT, INCL. THE HOTKEYS INSIDE THE CONTEXTMENU
        activate: function() {
            let key, keys, match, replacer, meta;
            (keys = load("customKeys")) && keys.constructor === Object && (this.customKeys = keys);
            if (!this.actions.length) {
                for (let k in this.customKeys) {
                    match = k.match(this.prefix) || "";
                    replacer = match[0] || "";
                    meta = this.metaLevel[match[1]] || 0;
                    key = this.names.indexOf(k.replace(replacer, ""));
                    this.actions[key + 128 * meta] = this.customKeys[k];
                }
            }
            for (let i = 0; i < 128; i++) {
                // THE ARROW KEYS ARE ALWAYS USED TO MOVE, SO NO CUSTOMIZATION HERE
                if ([37, 38, 39, 40].indexOf(i) > -1) continue;
                this.actions[i] && (
                    str.keysContent = str.keysContent.replace(new RegExp(`%${this.actions[i]}%`, "g"), str.keyNames[this.names[i]] || this.names[i]).replace(new RegExp(`data-key="${this.actions[i]}"`, "g"), `data-key=0,${i}`),
                    (hotkey = get(`[data-hotkey="${this.actions[i]}"]`)) && (hotkey.innerHTML = str.hotkeyNames[this.names[i]] || this.names[i])
                );
                for (let j = 1; j < 4; j++) {
                    this.actions[i + 128 * j] && (
                        str.keysContent = str.keysContent.replace(new RegExp(`%${this.actions[i + 128 * j]}%`, "g"), `${str.keyNames[this.metaLevel[j]]} + ${str.keyNames[this.names[i]] || this.names[i]}`).replace(new RegExp(`data-key="${this.actions[i + 128 * j]}"`, "g"), `data-key=${j},${i}`),
                        (hotkey = get(`[data-hotkey="${this.actions[i + 128 * j]}"]`)) && (hotkey.innerHTML = `${str.hotkeyNames[this.metaLevel[j]]} + ${str.hotkeyNames[this.names[i]] || this.names[i]}`)
                    );
                }
                get("#keys").innerHTML = str.keysContent;
                activateContent("keys");
            }
        },

        // ENABLES/DISABLES THE ABILITY TO CHANGE THE KEY ASSIGNMENTS
        toggleEditKeys: function() {
            let listening = get("#keyTable .key")[0].classList.contains("listening");
            each(get("#keyTable .key"), key => {
                key[listening ? "removeEventListener" : "addEventListener"]("mousedown", this.listenToKey);
                key.title = listening ? "" : str.clickToChange;
                key.classList[listening ? "remove" : "add"]("listening");
            });
        },

        // WAIT FOR THE NEXT KEYPRESS AND RETURN IT INSTEAD OF EXECUTING THE ACTION IT IS EVENTUALLY BOUND TO
        listenToKey: function() {
            let key = this.dataset.key.split(",");
            this.classList.add("pulse-slow");
            temp.key = [parseInt(key[0]), parseInt(key[1]), this];
            message("info", str.pressNewKey);
            listenToNewKey = 1;
        },

        // ACTIVATE THE CHOSEN KEY
        changeKey: function(meta, key) {
            if (!Keys.names[key]) return;
            // if 'meta' is set and 'key' is the same key as meta, set meta to 0
            if (meta && Keys.metaLevel[meta] === Keys.names[key])  meta = 0;
            const keys = get("#keyTable .key");
            const [tempMeta, tempKey, tempElement] = temp.key;
            const name = (meta ? `${str.keyNames[Keys.metaLevel[meta]]} + ` : "") + (str.keyNames[Keys.names[key]] || Keys.names[key]);
            const action = Keys.actions[128 * tempMeta + tempKey];
            const dataset = `${meta},${key}`;
            const element = document.querySelector(`[data-key="${dataset}"]`);
            const tempName = (tempMeta ? `${str.keyNames[Keys.metaLevel[tempMeta]]} + ` : "") + (str.keyNames[Keys.names[tempKey]] || Keys.names[tempKey]);
            const tempAction = Keys.actions[128 * meta + key];
            const tempDataset = `${tempMeta},${tempKey}`;
            tempElement.classList.remove("pulse-slow");
            tempElement.textContent = name;
            tempElement.dataset.key = dataset;
            if (element) {
                element.textContent = tempName,
                element.dataset.key = tempDataset;
            }
            Keys.actions[128 * meta + key] = action;
            Keys.actions[128 * tempMeta + tempKey] = tempAction;
            temp.key = {};
            listenToNewKey = 0;

            Keys.customKeys = {up: "up", down: "down", left: "left", right: "right"};

            each(keys, k => {
                [meta, key] = k.dataset.key.split(",").map(e => parseInt(e));
                Keys.customKeys[(meta ? `${Keys.metaLevel[meta]} + ` : "") + Keys.names[key]] = Keys.actions[128 * meta + key];
            });

            // STORE THE CONFIG IF POSSIBLE
            if (useLocalStorage || useCookies) {
                try {
                    let Obj = {};
                    each(Object.keys(Keys.customKeys).sort((a, b) => a - b), key => Obj[key] = Keys.customKeys[key]);
                    save("customKeys", Obj) && message("info", str.keysSaved, null, 1000);
                } catch (err) {
                    message("info", null, str.canNotAutoSaveKeys, 4000);
                }
            }
        },

        // DOWNLOAD CURRENT CONFIG AS .JS FILE
        downloadConfig: () => downloadJS(["Keys.customKeys = " + JSON.stringify(Keys.customKeys, null, "    ") + ";", "customKeys"]),

        // ON KEYPRESS, HERE ALL ACTIONS ARE EXECUTED
        handle: x => {
        // A KEY IS PRESSED, CHECK WHAT DO DO
        // WE HAVE TO TAKE INTO ACCOUNT THAT THE INPUT CAN ALSO COME FROM PLAYBACK
            let e = typeof x === "object" ? x : {
                    keyCode: typeof x === "number" ? x : Keys.names.indexOf(x) > -1 ? Keys.names.indexOf(x) : x.charCodeAt(0),
                    key: typeof x === "number" ? Keys.names[x] : x
                },
                key = e.keyCode,
                meta = e.ctrlKey ? 1 : e.shiftKey ? 2 : e.altKey ? 3 : 0;

            // CHANGE A KEY ASSIGNMENT
            if (listenToNewKey) {
                if ([16, 17, 18].indexOf(key) === -1 || temp.keyIsDown)  return (temp.keyIsDown = 0, Keys.changeKey(meta, key));
                else if ([16, 17, 18].indexOf(key) > -1 ) temp.keyIsDown = 1;
            }
            if (meta && Keys.metaLevel[meta] === Keys.names[key])  meta = 0;
            // LOOK INTO THE KEYS TABLE WHAT THE PRESSED KEY IS FOR
            let action = Keys.actions[key + 128 * meta];
            // RESET THE IDLE COUNTER
            idle = Date.now();
            // pressedKey: USED BY FUNCTIONS, WILL BE CLEARED AT THE END OF THIS FUNCTION
            // holdKey: USED BY FUNCTIONS, WILL BE CLEARED AT THE NEXT KEYPRESS
            pressedKey = holdKey = key;
            switch(action) {
                case "backup":
                    if (!useLocalStorage && !useCookies) break;
                    flashMessage(backup() ? str.backupDone : str.noBackupDone);
                    break;
                case "destroy":
                    if (!useLocalStorage && !useCookies) break;
                    flashMessage(destroyBackup() ? str.backupRemoved : str.noBackupAvailable);
                    break;
                case "restore":
                    if (!useLocalStorage && !useCookies) break;
                    flashMessage(restore() ? str.restoreDone : str.noBackupAvailable);
                    break;
                case "clipboard":
                    copyAction("show_items");
                    break;
                case "copy":
                    copyObject.copyActive ? matrixIsEmpty(copyObject.matrix) || copyAction("copy") : copyAction("select");
                    break;
                case "paste":
                    copyObject.pasteActive ? copyObject.paste() : (
                        copyObject.array.length && (
                            copyObject.arrayPointer = copyObject.array.length - 1,
                            copyObject.pasteItem()
                        )
                    );
                    break;
                case "remove":
                    copyAction("remove");
                    break;
                case "undo":
                    // IF IN POLYGON MODE, 'UNDO' DELETES THE LAST POLYGON LINE
                    mode === 15 && drawObject.polygon.length > 1 ? (drawObject.polygon.pop(), drawPolygon()) : toolAction("undo");
                    break;
                case "confirm":
                    Rec.temp.edit.active && [6,7,9,11,13,18,19].indexOf(Rec.temp.edit.mode) === -1 ? Rec.addItemSpecial() :
                    get("#reccontent form").name === "editform" ? Rec.editItem() :
                    get("#reccontent form").name === "addform" ? Rec.addNewItem() :
                    getComputedStyle(get("#fileInputForm")).display!== "none" ? loadImage() :
                    infoIsOpen && sizeWidth.value || sizeHeight.value ? resizeGrid("key") :
                    inputFieldInUse === "draw-text" && drawText.value ? useText() :
                    copyObject.copyActive ? copyAction("copy") :
                    copyObject.pasteActive && (copyAction("paste"), toolAction(modes[previousMode]));
                    clone.m && (clone.finish(), drawObject = cloneObject(defaultDrawObject), clone.reset(), clear("move"), mode = 23);
                    inputFieldInUse && inputFieldInUse !== "base64-code" && get(`#${inputFieldInUse}`).blur();
                    break;
                case "break":
                    let i = 0;
                    while (i < callOnEsc.length && !callOnEsc[i]()) i += 2;
                    callOnEsc[i] && callOnEsc[i + 1]();
                    messageId && message();
                    Keys.prevent();
                    break;
                case "draw": case "up": case "down": case "left": case "right":
                    drawCursorIsVisible && Keys.moveAndDraw(action);
                    break;
                case "toggleDrawCursor":
                    (drawCursorIsVisible = !drawCursorIsVisible) ? drawPosition(position) : clear("move");
                    break;
                case "focusOpacity":
                    opacity.focus();
                    break;
                case "focusColor":
                    colorpicker.focus();
                    break;
                case "toggleInfo":
                    infoIsOpen ? slideArea() : slideArea("info", 1);
                    break;
                case "toggleHelp":
                    slideArea(helpIsOpen ? null : "help");
                    break;
                case "toggleRecorder":
                    slideArea(recordIsOpen ? null : "record");
                    break;
                case "toggleKeys":
                    slideArea(keysIsOpen ? null : "keys");
                    break;
                case "reload":
                    //onlineSession && stopSession();
                    setTimeout(() => location.reload(), 100);
                    break;
                case "rec_edit":
                    Rec.showContent();
                    break;
                case "openRecordFile":
                    get(`#${Rec.loadButton}`).click();
                    break;
                case "saveRecordFile":
                    get(`#${Rec.saveButton}`).click();
                    break;
                case "rec_rec":
                    !Rec.isRec && !Rec.i && Rec.startRec();
                    break;
                case "rec_play":
                    !Rec.isRec && Rec.play();
                    break;
                case "rec_stop":
                    Rec.isRec ? Rec.stopRec() : Rec.stop();
                    break;
                case "redo": case "rotate": case "pencil":
                case "eraser": case "eyedropper": case "line":
                case "rectangle": case "parallelogram": case "polygon":
                case "ellipse": case "move": case "fill":
                case "clear": case "fileload": case "getmatrix":
                case "text": case "picker":
                case "change-color": case "clear-color": case "color-bw": case "color-area": case "clear-area":
                    toolAction(action);
                    break;
                case "opacityUp": case "opacityDown":
                    setOpacity(action);
                    break;
                case "minimize":
                    clickMinimize();
                    break;
                case "clone":
                    break;
            }
            pressedKey = 0;
            update.queue.push("log", "tools", "contextmenu");
        },

        // KEYBOARD LISTENERS
        listeners: {
            on: e => {

                // ALLOW ALL KEYS, HANDLE ONLY ESC, ENTER AND F3

                let key = e.keyCode;
                (key === 27 || key === 114 || key === 13) && (
                    key !== 13 && e.preventDefault(),
                    Keys.handle(e)
                );
            },
            prevent: e => {

                 // USE ALL KEYS FOR CONTROLLING THE TOOL, ALLOW ONLY F12 (TO REACH THE DEV TOOLS)

                let key = e.keyCode, tg =  e.target;
                tg.contentEditable === "inherit" && tg.tagName !=="INPUT" && tg.tagName !=="TEXTAREA" && (
                    key !== 123 && e.preventDefault(),
                    Keys.handle(e)
                );
            },
            off: e => {

                 // ALLOW ONLY ESC AND F3

                e.preventDefault();
                let key = e.keyCode;
                (key === 27 || key === 114) && Keys.handle(e);
            }
        },

        on: function (e) {
            this.set(this.listeners.on);
            e && this.listeners.on(e);
        },

        prevent: function (e) {
            this.set(this.listeners.prevent);
            e && this.listeners.prevent(e);
        },

        off: function(e) {
            this.set(this.listeners.off);
            e && this.listeners.off(e);
        },

        set: function(e) {
            this.listener && document.removeEventListener("keydown", this.listener);
            document.addEventListener("keydown", e);
            this.listener = e;
        },

        // KEYBOARD CONTROL WHEN DRAWING
        moveAndDraw: key => {
            let pos = getDrawCursorCoords(position),
                xc = pos.xc,
                yc = pos.yc,
                x = pos.x,
                y = pos.y,
                left = key === "left",
                right = key === "right",
                up = key === "up",
                down = key === "down";
            left  && xc > 0 && (xc--, x -= pixelWidth);
            up    && yc > 0 && (yc--, y -= pixelHeight);
            right && xc < pixelsX - 1 && (xc++, x += pixelWidth);
            down  && yc < pixelsY - 1 && (yc++, y += pixelHeight);
            position = {xc: xc, yc: yc, x: x, y: y};
            (xc >= xcursor || yc >= ycursor) && (
                setCursors(Math.max(xc + 1, xcursor), Math.max(yc + 1, ycursor)),
                matrix.length < xcursor && matrix.push(resetMatrix()[0]),
                matrix[0].length < ycursor && (() => {for (let i = 0; i < matrix.length; i++) matrix[i].push(0);})()
            );
            scrollGrid();
            switch (mode) {
                // PENCIL
                case 1:
                    drawPosition(position);
                    key === "draw" && (
                        actionNumber++,
                        sameColor(color, matrix[position.xc][position.yc]) ? (
                            mode = 2,
        					doAction(position),
                            mode = 1
        				) : doAction(position)
                    );
                    break;
                //ERASER
                case 2:
                    drawPosition(position);
                    key === "draw" && doAction(position);
                    break;
                // EYEDROPPER
                case 3:
                    drawPosition(position);
        			let prev;
                    key === "draw" && (
                        prev = previousMode,
                        doAction(position),
                        toolAction(modes[prev])
                    );
                    break;
                // LINE/RECTANGLE/ELIPSE/PARALLELOGRAM/POLYGON START
                case 4: case 6: case 8: case 11: case 14:
                    key === "draw" ? doAction(position) : drawPosition(position);
                    break;
                // LINE/RECTANGLE/ELIPSE/PARALLELOGRAM/POLYGON FINISH
                case 5: case 7: case 9: case 12: case 13: case 15:
                    // SIMULATION OF DOUBLE CLICK USING THE SPACE BAR
                	mode === 15 && key === "draw" ? (
                        isDblClick === 0 ? (
                            isDblClick = 1,
                            setTimeout(() => isDblClick = 0, 300),
                            drawObject.next = 1
                        ) : drawObject.finish = 1
                    ) : key === "draw" && (drawObject[(mode === 12 ? "next" : "finish")] = 1);
                    doAction(position);
                    break;
                // MOVE GRID
                case 10:
                    copyObject.pasteActive ? (
                        xcursor < pixelsX && setCursors(pixelsX, pixelsY, 1),
                        copyObject.matrix = moveGrid(up ? 0 : down ? 1 : left ? 2 : 3, copyObject.matrix),
                        refreshGrid("copy", copyObject.matrix)
                    ) : (
                        temp.redrawTimeout && clearTimeout(temp.redrawTimeout),
                        matrix = moveGrid(up ? 0 : down ? 1 : left ? 2 : 3),
                        refreshGrid("grid", matrix),
                        temp.redrawTimeout = setTimeout(redrawPreview, 500)
                    );
                    break;
                // CHANGE COLOR
                case 20: case 21:
                    drawPosition(position);
                    key === "draw" && doAction(position);
                    break;
            }
            update.queue.push("log", "tools", "contextmenu");
        }
    };

    root.Keys = Keys;
}(window));
