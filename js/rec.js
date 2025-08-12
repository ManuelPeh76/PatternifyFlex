
/**************************************************
 **              PATTERNIFY FLEX                 **
 **     Data Recorder to record draw action      **
 **  __________________________________________  **
 **                                              **
 **       Coded in 2020 by Manuel Pelzer         **
 **                                              **
 ** ___________________________________________  **
 **  rec.js                                      **
 **************************************************/

var Rec = {
    callbacks: {
        buttons: {
            save: function () {
                Rec.recCounter && Rec.download();
            },
            load: function () {
                if (Rec.isRec) return;
                Rec.isPlay && !Rec.isPause && Rec.stop();
                Rec.temp.chooseFile && (
                    get(`#${Rec.uploadFile}`).removeEventListener("change", Rec.callbacks.buttons.chosen),
                    Rec.temp.chooseFile = 0
                );
                get(`#${Rec.uploadFile}`).addEventListener("change", Rec.callbacks.buttons.chosen);
                get(`#${Rec.uploadFile}`).click();
                Rec.temp.chooseFile = 1;
            },
            chosen: function () {
                get(`#${Rec.uploadFile}`).removeEventListener("change", Rec.callbacks.buttons.chosen);
                Rec.temp.chooseFile = 0;
                if (Rec.isRec) return;
                Rec.isPlay && !Rec.isPause && Rec.stop();
                Rec.upload();
            },
            rec: function () {
                !Rec.isRec && !Rec.i && Rec.startRec();
            },
            stop: function () {
                Rec[Rec.isRec ? "stopRec" : "stop"]();
            },
            prev: function () {
                Rec.isPlay && Rec.prev();
            },
            next: function () {
                Rec.isPlay && Rec.next();
            },
            play: function () {
                Rec.isRec && Rec.stopRec();
                !Rec.isRec && Rec.recCounter > 0 && Rec[Rec.isPause ? "resume" : Rec.isPlay ? "stop" : "play"]();
            },
            edit: function () {
                Rec.recCounter > 0 && Rec.showContent();
            }
        }
    },

    activateButtons: function () {

        // EVENT HANDLING OF THE RECORDER BUTTONS

        // DOWNLOAD BUTTON
        get(`#${this.saveButton}`).addEventListener("click", this.callbacks.buttons.save);

        // UPLOAD BUTTON
        get(`#${this.loadButton}`).addEventListener("click", this.callbacks.buttons.load);

        // RECORD BUTTON
        get(`#${this.recButton}`).addEventListener("click", this.callbacks.buttons.rec);

        // STOP BUTTON
        get(`#${this.stopButton}`).addEventListener("click", this.callbacks.buttons.stop);

        // PREV BUTTON
        get(`#${this.prevButton}`).addEventListener("click", this.callbacks.buttons.prev);

        // NEXT BUTTON
        get(`#${this.nextButton}`).addEventListener("click", this.callbacks.buttons.next);

        // PLAY BUTTON
        get(`#${this.playButton}`).addEventListener("click", this.callbacks.buttons.play);

        // CONTENT BUTTON
        get(`#${this.editButton}`).addEventListener("click", this.callbacks.buttons.edit);
    },

    activateSublist: function (e) {

        // OPENS THE ITEM LIST BY CLICKING ON A RECORD INSIDE THE REC EDITOR

        let item;
        try { item = eframe.document.getElementById(`sublist_${parseInt(e.getAttribute("data-id"))}`); }
        catch (err) { return; }
        if (!item) return;
        return getComputedStyle(item).display === "none" ?
            ($(item).show(100), e.parentElement.classList.add("highlighted")) :
            ($(item).hide(100), e.parentElement.classList.remove("highlighted"));
    },

    activateRecords: function(){
        if (!temp.createInterval){
            temp.createInterval = setInterval(function () {
                if (eframe.updateClickables && eframe.scrollBody){
                    return (
                        eframe.updateClickables(),
                        [].forEach.call(eframe.document.querySelectorAll(".deleteWholeShape"), function(e){
                            e.checked = Rec.delWholeShape;
                        }),
                        eframe.scrollBody(Rec.frameScrollTop),
                        clearInterval(temp.createInterval),
                        temp.createInterval = 0
                    );
                }
            }, 300);
        }
    },
    addItem: function (a, b) {

        // CREATE THE SELECT BOX FOR CHOOSING THE NEW ITEM

        let options = `<option>${str.pleaseSelect}</option>`;
        for (let i = 1; i < this.modes.length; i++) options += `<option>${this.modes[i]}</option>`;
        openModal(this.recContent, this.template.add.
            replace(/%new_item%/, str.newItem).
            replace(/%add_item%/g, str.addItem).
            replace(/%cancel%/, str.cancel).
            replace(/%options%/g, options).
            replace(/%a%/g, a).
            replace(/%b%/g, b), "#item");
        this.watchInput("addform");

        // EVENTHANDLER TO CHECK IF AN INPUT FIELD IS EMPTY. IF SO, IT WILL BE MARKED FOR BETTER VISIBILITY

        document.getElementById("add_item").removeEventListener("click", Rec.addNewItem);
        document.getElementById("cancel_add_item").removeEventListener("click", Rec.cancelAddItem);
        document.getElementById("item").removeEventListener("change", Rec.makeNewSelection);
        document.getElementById("add_item").addEventListener("click", Rec.addNewItem);
        document.getElementById("cancel_add_item").addEventListener("click", Rec.cancelAddItem);
        document.getElementById("item").addEventListener("change", Rec.makeNewSelection);
    },

    addItemSpecial: function () {

        // ADDS AN ITEM TO A RECORD BASED ON 'LIVE' MODE

        let a = parseInt(this.temp.edit.args[0]),
            b = parseInt(this.temp.edit.args[1]),
            mode = this.temp.edit.mode,
            submode = this.temp.edit.submode,
            addlength = this.temp.recLog.length, i;
        !addlength || (mode === 11 && addlength < 3) ? message("warning", str.noInputFound) : (
            mode === 2 && (
                $(copyCode).slideDown(),
                codeBoxShows("base64")
            ),
            submode && (
                // SUBMODES ONLY APPEAR IN MODE 15 (EXTRAS), SUBMODE 9 = MARQUEE PATTERN
                mode = 15,
                this.temp.recLog[0][1] = mode,
                this.temp.recLog[0][2].unshift(submode)
            ),
            function(){
                for (i = 0; i < addlength; i++) Rec.recLog[a].splice(b + i + 1, 0, Rec.temp.recLog[i]);
            }(i, addlength, Rec, a, b)
        );

        setTimeout(function () {
            Rec.edit = 1;
            Rec.createContent([a, b], 1);
            Keys.prevent();
        }, 300);
        this.temp.recLog = 0;
        this.temp.edit.active = 0;
        this.temp.edit.submode = 0;
        this.grid ? (
            colorSubmit(rgbToHex(this.grid.rgb), this.grid.rgb),
            workMatrix = this.grid,
            this.grid = 0,
            setupGrid()
        ) : mode === 11 && this.prepareToPlay();
        messageId && message();
    },

    addNewItem: function () {

        // ADDS A NEW ITEM TO A RECORD

        let item = get("#item"),
            addTime = get("#addtime"),
            toAdd = get("#toadd"),
            args = toAdd.value.split("_"),
            a = parseInt(args[0]),
            b = parseInt(args[1]) + 1,
            mode = Rec.modes.indexOf(item.value);
        if (!Rec.checkFormArgs(a)) return message("error", "", Rec.temp.error || str.checkFormArgsErrorMessage), Rec.temp.error = 0, Keys.on();
        if (item.value === str.pleaseSelect) return;
        Rec.watchInput();
        Rec.watchItemChange();
        let time = parseInt(addTime.textContent) || 500, len = Rec.recLog[a].length, log = [], text, pre = 0;
        for (let i = len; i > b; i--) Rec.recLog[a][i] = Rec.recLog[a][i - 1];
        get(".content").selectedIndex !== undefined ? log.push(get(".content").value) :
            [].forEach.call(get(".content"), function (c) {
                text = c.tagName === "DIV" ? c.textContent : c.value;
                text && text == parseFloat(text) && text.indexOf("00") === -1 && (text = parseFloat(text));    // IMPORTANT! '==' , BUT NOT '===' !!
                mode === 5 && text && ".#".indexOf(text[0]) > -1 ? (
                    pre = text[0] === "." ? "~class~" : text[0] === "#" ? "~id~" : text[0],
                    text = pre + text.substring(1)
                ) : mode === 15 && text && typeof text === "string" && (text = text.replace(/#/g, "~id~"));
                text && text === "null" ? text = null :
                text === "" || text === "undefined" || text === "(.none})" && (text = undefined);
                text && typeof text === "string" && (text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/script/g, ""));
                log.push(text);
            });
        mode === 17 && (
            log = JSON.stringify({ matrix: JSON.parse(log[0]), xcursor: log[1], ycursor: log[2], pixelsX: log[3], pixelsY: log[4] })
        );
        Rec.recLog[a][b] = [ time, mode, log ];
        Rec.temp.addItem = 0;
        Rec.edit = 1;
        closeModal();
        Rec.createContent(args);
        Keys.prevent();
    },


    addRecord: function (log, off, decode) {

        // ADD A RECORD FILE TO THE RECLOG AFTER UPLOADING IT

        let i = 0;
		decode && (log = atob(log));
        let newlogs = log.recLog.length;
        this.recLog.push.apply(this.recLog, log.recLog);
        this.recCounter = this.recLog.length;
        off ? this.showRecInfo() : (
            this.out("Ok! " + newlogs + " " + str.record + (newlogs === 1 ? "" : str.recordPlural) + " " + str.added + "....", 1),
            int = setInterval(function () {
                if (i++ < 8) get(`#${Rec.spanInfo}`).classList.toggle("highlight-bg");
                else clearInterval(int);
            }, 200)
        );
        this.edit = 1;
        this.listRecords();
        this.createContent();
    },

    applyRecorder: function () {

        // INSERTS THE RECORDER CONTAINER

        let div = this.spanInfo ? this.template.main.replace("<span id=\"%spanInfo%\"></span>", "") : this.template.main.replace(/%spanInfo%/g, this.spanInfo);
        div = div.replace(/%slider%/g, this.slider).replace(/%slider_value%/g, this.slider_value).replace(/%slider_box%/g, this.slider_box);
        div = div.replace(/%playback%/g, str.playback).replace(/%speed%/g, str.speed);
        div = div.replace(/%stopButton%/g, this.stopButton).replace(/%prevButton%/g, this.prevButton).replace(/%nextButton%/g, this.nextButton);
        div = div.replace(/%playButton%/g, this.playButton).replace(/%recButton%/g, this.recButton).replace(/%loadButton%/g, this.loadButton);
        div = div.replace(/%saveButton%/g, this.saveButton).replace(/%reccontent%/g, this.recContent).replace(/%highlightStyle%/g, this.highlightStyle);
        div = div.replace(/%styleClass%/g, this.styleClass).replace(/%spanInfo%/g, this.spanInfo).replace(/%uploadFile%/g, this.uploadFile);
        div = this.isEditable ? div.replace(/%editButton%/g, this.template.editButton.replace(/%editButton%/g, this.editButton).replace(/%styleClass%/g, this.styleClass)) : div.replace(/%editButton%/g, "");
        get(`#${this.mainDiv}`).innerHTML = div;
    },

    ask: question => window.confirm(question),

    byRec: 0,

    cancelAddItem: function () {

        // IF CURRENTLY ADDING AN ITEM TO A RECORD AND THE
        // USER CANCELS THAT ACTION, SOME STUFF NEEDS TO BE RESETED

        let mode = Rec.temp.edit.mode;
        mode === 2 && ($(copyCode).slideDown(), codeBoxShows("base64"));
        toolAction(modes[previousMode] || "pencil");
        Rec.temp.addItem = Rec.temp.recLog = Rec.temp.edit.active = Rec.temp.edit.submode = 0;
        Rec.grid ? (colorSubmit(Rec.grid.rgb), workMatrix = Rec.grid, setupGrid()) : mode === 11 && Rec.prepareToPlay();
        messageId && message();
        Rec.grid = Rec.temp.addItem = Rec.temp.edit.mode = Rec.temp.edit.recTime = Rec.temp.config = 0;
        Rec.watchItemChange();
        document.getElementById("add_item") && document.getElementById("add_item").removeEventListener("click", Rec.addNewItem);
        document.getElementById("cancel_add_item") && document.getElementById("cancel_add_item").removeEventListener("click", Rec.cancelAddItem);
        document.getElementById("item") && document.getElementById("item").removeEventListener("change", Rec.makeNewSelection);
        Rec.cancelItem();
        Keys.prevent();
    },

    cancelEditItem: () => {

        // SAME AS BEFORE IF EDITING AN EXISTING ITEM

        Rec.temp.editItem = 0;
        document.getElementById("edit_item").removeEventListener("click", Rec.editItem);
        document.getElementById("cancel_edit_item").removeEventListener("click", Rec.cancelEditItem);
        Rec.cancelItem();
    },

    cancelItem: function () {

        // SHARED BETWEEN cancelAddItem AND cancelEditItem

        Rec.watchInput();
        Keys.prevent();
        Rec.unhighlightContent();
        closeModal();
        setTimeout(() => document.getElementById(Rec.recContent).innerHTML = "", 400);
    },

    changeNewItem: function (a) {

        // RE-CREATE MODAL CONTENT WHEN SELECTION BOXES ARE CHANGED

        let mode = parseInt(a.target.value),
            isadd = Rec.temp.editItem === 0, detail,
            tr = isadd ? ["<tr>", "</tr>"] : ["", ""],
            content = isadd ? Rec.temp.addItem : Rec.temp.editItem;
        document.getElementById("errormsg").innerHTML = "";
        mode === 8 ? detail = tr[0] + "<td class=\"right\">" + str.speed + " (0.5 - 10):</td><td width=\"30px\"></td><td><div class=\"empty " + (isadd ? "" : "edit") + "content\" contenteditable>3.0</div></td>" + tr[1] :
        mode === 9 ? detail = tr[0] + "<td class=\"right\">" + str.marqueeMatrix + ":</td><td width=\"30px\"></td><td><div class=\"" + (isadd ? "" : "edit") + "content big border wrap\" contenteditable></div></td>" + tr[1] :
        mode === 10 ? detail = tr[0] + "<td class=\"right\">" + str.userCommand + ":</td><td width=\"30px\"></td><td><div class=\"line_small empty " + (isadd ? "" : "edit") + "content\" contenteditable></div></td>" + tr[1] :
        mode === 11 ? detail = tr[0] + "<td class=\"right\">" + str.jumpToItem + ":</td><td width=\"30px\"></td><td><div class=\"line_small empty " + (isadd ? "" : "edit") + "content\" contenteditable></div></td>" + tr[1] :
        detail = isadd ? "<!--optional-->" : "";
        isadd ? (
            document.getElementById("details").innerHTML = content.replace("<!--optional-->", detail).replace("option value=\"" + mode + "\"", "option value=\"" + mode + "\" selected"),
            mode === 9 ? (
                document.getElementById("addbydraw").innerHTML = Rec.template.addByDraw.replace(/%addbydraw%/, str.addByDraw),
                document.getElementById("draw_add_item").addEventListener("click", Rec.recSingleItem)
            ) : document.getElementById("addbydraw").innerHTML = ""
        ) : (
            openModal(Rec.recContent, content.replace(/ selected.*?>/g, ">").replace("value=\"" + mode + "\"", "value=\"" + mode + "\" selected"), "auto"),
            document.getElementById("tr").innerHTML = detail,
            $("#tr").show(),
            Rec.refreshEditHandler()
        );
        document.querySelector("." + (isadd ? "" : "edit") + "content").focus();
        Rec.watchItemChange(1);
    },

    checkFormArgs: function (a) {

        // CHECK THE SUBMITTED VALUES FROM THE EDIT AND ADD FORM

        let item = JSON.parse(this.recLog[a][0][2]), text = [], ok = 1, val, mode;
        get("#edit_item") ? (
            val = get("#toedit").value.split("_"),
            mode = this.recLog[val[0]][val[1]][1],
            form = ".editcontent"
        ) : (
            val = get("#toadd").value.split("_"),
            mode = this.modes.indexOf(get("#item").value),
            form = ".content"
        );
        // GET THE GRID SIZE OF THE ADDED/EDITED ITEM TO CHECK IF THE VALUES ARE IN THE RIGHT RANGE
        this.recLog[a].findIndex(this.findConfigSize, val[1]);
        this.temp.config && (
            item = JSON.parse(this.recLog[a][this.temp.config][2]),
            this.temp.config = 0
        );
        if (typeof mode !== "number" || mode < 0 || mode > this.modes.length - 1) return 0;
        this.temp.error = "";
        [].forEach.call(document.querySelectorAll(form), function (c) {
            // GET THE VALUES FROM THE FORM AND PUSH THEM INTO AN ARRAY
            val = c.tagName === "DIV" ? c.textContent : c.value;
            val == parseFloat(val) && mode !== 9 && (val = parseFloat(val));
            val !== "(" + str.none + ")" && text.push(val);
        });

        // CHECK THE DATA
        switch (mode) {
        case 0:
            // DATA HEAD
            break;
        case 1:
            // PIXEL
            for (let i = 0; i < text.length; i++) text[i] = parseFloat(text[i]);
            ok = typeof text[0] === "number" && typeof text[1] === "number" && typeof text[2] === "number" && text[0] >= 0 && text[1] >= 0 && text[2] >= 0 && text[2] <= 1 && text[0] <= item.pixelsX && text[1] <= item.pixelsY;
            ok || (this.temp.error = str.checkFormCase1.replace(/%x%/, item.pixelsX).replace(/%y%/, item.pixelsY));
            break;
        case 2:
            // WHOLE PATTERN
            let grid;
            if (text[0] && typeof text[0] === "string") {
                try {
                    grid = JSON.parse(text[0]);
                } catch (err) {
                    return (this.temp.error = str.checkFormCase2);
                }
            } else  return (this.temp.error = str.checkFormCase2);
            let matrix;
            try {
                matrix = [...grid.matrix];
            } catch (err) {
                return (this.temp.error = str.checkFormCase2);
            }
            ok = typeof grid === "object" && grid.xcursor > 0 && grid.xcursor <= 400 && grid.ycursor > 0 && grid.ycursor <= 400 && matrix && typeof matrix === "object";
            ok || (this.temp.error = str.checkFormCase2);
            break;
        case 3:
        case 4:
            // X AND Y CURSORS, MOVE CURSOR
            ok = typeof text[0] === "number" && typeof text[1] === "number" && text[0] >= 0 && text[0] <= item.pixelsX && text[1] >= 0 && text[1] <= item.pixelsY;
            ok || (this.temp.error = str.checkFormCase3.replace(/%x%/, item.pixelsX).replace(/%y%/, item.pixelsY));
            break;
        case 5:
            // CALL JQUERY
            ok = typeof text[0] === "string" && text[0] !== "" && typeof text[1] === "string" && text[1] !== "";
            ok || (this.temp.error = str.checkFormCase5a);
            break;
        case 6:
        case 7:
        case 13:
            // RECTANGLE, LINE, ELLIPSE
            ok = typeof text[0] === "number" && typeof text[1] === "number" && typeof text[2] === "number" && typeof text[3] === "number" && (typeof text[4] === "number" || text[4] === "null") && (typeof text[5] === "number" || text[5] === "null") && text[0] >= 0 && text[0] <= item.pixelsX && text[1] >= 0 && text[1] <= item.pixelsY && "01".indexOf(text[2]) > -1 && "01".indexOf(text[3]) > -1;
            if (ok && mode === 6) ok = "01".indexOf(text[6]) > -1;
            ok || (this.temp.error = str.checkFormCase6.replace(/%x%/, item.pixelsX).replace(/%y%/, item.pixelsY));
            break;
        case 8:
            // MOVE GRID
            ok = "0123".indexOf(text[0]) > -1 && text[0].toString().length === 1;
            ok || (this.temp.error = str.checkFormCaseSelection);
            break;
        case 9:
            // COLOR PICKER, OPACITY VALUE IN RANGE 0 - 1
            ok = (
                text[0] >= 0 && text[0] <= 255 &&
                text[1] >= 0 && text[1] <= 255 &&
                text[2] >= 0 && text[2] <= 255 &&
                text[3] >= 0 && text[3] <= 1
            );
            ok || (this.temp.error = str.checkFormCase9);
            break;
        case 10:
            // OPACITY VALUE IN RANGE 0 - 100 %
            ok = typeof text[0] === "number" && text[0] >= 0 && text[0] <= 100;
            ok || (this.temp.error = str.checkFormCase10);
            break;
        case 11:
            // TEXT OUTPUT
            if (text[0] === -1) {
                this.temp.error = str.checkFormCaseSelection;
                ok = 0;
            } else if ("0134".indexOf(text[0]) > -1) {
                ok = (
                    text[1] > 0 &&
                    text[1] <= 400 &&
                    (
                        "03".indexOf(text[0]) > -1 &&
                        text[1] * item.pixelsY >= 4 ||
                        "14".indexOf(text[0]) > -1 &&
                        text[1] * item.pixelsX >= 4
                    )
                );
                ok || (this.temp.error = str.checkFormCase11a);
            } else if (text[0] === 5) {
                text[1] = text[1].toString();
                for (let i = 0; i < text[1].length; i++) {
                    if ("0123456789abcdef".indexOf(text[1][i]) > -1) continue;
                    else this.temp.error = str.checkFormCase11b;
                }
                if (!this.temp.error) {
                    ok = "346".indexOf(text[1].toString().length) > -1;
                    if (!ok) this.temp.error = str.checkFormCase11c;
                } else
                    ok = 0;
            } else if (text[0] === 6) {
                ok = typeof text[1] === "number" && text[1] >= 0 && text[1] <= 100;
                ok || (this.temp.error = str.checkFormCase11d);
            }
            break;
        case 12:
            // HIGHLIGHT TOOL
            if (text[0] === -1) ok = 0;
            else ok = typeof text[0] === "number" && text[0] >= 0 && text[0] < this.toolList[0].length;
            ok || (this.temp.error = str.checkFormCaseSelection);
            break;
        case 14:
            // AREAS
            if (text[0] === -1) ok = 0;
            else ok = "infohelpkeysrecordx".indexOf(text[0]) > -1;
            ok || (this.temp.error = str.checkFormCaseSelection);
            break;
        case 15:
            // EXECUTE INSTRUCTION
            if (text[0] === -1) {
                this.temp.error = str.checkFormCaseSelection;
                ok = 0;
            } else if ([ 8, 9, 10, 11].indexOf(text[0]) > -1 && text[1].length === 0) {
                this.temp.error = str.checkFormCase15;
                ok = 0;
            } else if (text[0] === 8) {
                // PLAYBACK SPEED
                ok = typeof text[1] === "number" && text[1] >= 0 && text[1] <= 10;
                ok || (this.temp.error = str.checkFormCase15_8);
            } else if (text[0] === 9) {
                // RUN MARQUEE
                let code;
                try {
                    code = JSON.parse(text[1]);
                } catch (err) {
                    this.temp.error = str.checkFormCase2;
                    return;
                }
                ok = (
                    code.matrix &&
                    code.pixelsX &&
                    code.pixelsY &&
                    code.marquee &&
                    code.pixelsX > 0 &&
                    code.pixelsY > 0 &&
                    code.pixelsX <= 400 &&
                    code.pixelsY <= 400 &&
                    code.marquee > 0 &&
                    code.marquee <= 400
                );
                ok || (this.temp.error = str.checkFormCase2);
            } else if (text[0] === 10) {
                // USER COMMAND
                let code = text[1].replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/#/g, "~id~");
                try {
                    let result = this.test(code.replace(/await /g, ""));
                    if (result.indexOf("green") > -1) fixMessage(result.result);
                    else this.temp.error = result;
                } catch (e) {
                    this.temp.error = code + "<br />" + e;
                }
            } else if (text[0] === 11) {
                // JUMP TO ITEM
                let log = this.recLog[a].length;
                ok = typeof text[1] === "number" && text[1] >= 0 && text[1] < log;
                ok || (this.temp.error = str.checkFormCase15_11.replace(/%value%/, log - 1));
            }
            break;
        case 16:
            // CALL FUNCTION
            typeof text[0] === "string" && text[0].length > 0 ? (
                async function(){
                    try {
                        let result = this.test(text[0]);
                        if (result.indexOf(str.aFunction) === -1) {
                            Rec.temp.error = `${text[0]}(${text[1]})<br /> ${str.isNoFunction}!`;
                            ok = 0;
                        } else fixMessage(result);
                    } catch (err) {
                        Rec.temp.error = str.checkFormCase16a;
                        ok = 0;
                    }
                }(text, Rec, str, ok)
            ) : (
                this.temp.error = str.checkFormCase16b,
                ok = 0
            );
            break;
        case 17:
            // LOAD NEW GRID CONFIGURATION
            ok = (
                text[1] && typeof text[1] === "number" &&
                text[2] && typeof text[2] === "number" &&
                text[3] && typeof text[3] === "number" &&
                text[4] && typeof text[4] === "number" &&
                text[1] <= text[3] &&
                text[2] <= text[4] &&
                text[3] > 0 && text[3] <= 400 &&
                text[4] > 0 && text[4] <= 400
            );
            ok || (this.temp.error = str.checkFormCase17);
            break;
        case 18:
        case 19:
            // PARALLELOGRAM, POLYGON
            text.forEach(function (b, a) {
                !(typeof text[a] === "number" && text[a] >= 0 && text[a] <= (a / 2 % 2 === 0 ? item.pixelsX : item.pixelsY)) && (ok = 0);
            });
            ok || (this.temp.error = str.checkFormCase18.replace(/%val%/, item.pixelsX + " / " + item.pixelsY + " (X / Y)"));
            break;
        case 20:
            ok = (
                (typeof text[0] === "number" || typeof text[0] === "string") &&
                typeof text[1] === "string" &&
                text[1] !== "" &&
                typeof text[2] === "number" &&
                text[2] > 8 &&
                text[2] < 400
            );
            break;
        }
        return ok;
    },

    clearPlayground: function () {

        // APPLIES SOME CHANGES TO THE LAYOUT WHEN STARTING OR ENDING A PLAYBACK

        !this.isPause && this.isPlay ? (
            !this.usePresets && $(".presets").slideUp(),
            !this.useTools && $(".tools").slideUp(),
            !this.usePreview && clear("preview"),
            $("#img-info").slideUp()
        ) : (
            getComputedStyle(get(".presets")).display === "none" && $(".presets").slideDown(),
            getComputedStyle(get(".tools")).display === "none" && $(".tools").slideDown(),
            !this.usePreview && redrawPreview(),
            getComputedStyle(get(".preview-container")).display === "none" && $(".preview-container").slideDown()
        );
    },

    collect: function (mode, action) {

        // COLLECTS THE INPUTS IN LIVE ADD MODE

        if (!this.temp.edit.active) return;
        let rec = [(!this.temp.recLog.length ? 500 : Date.now() - this.temp.edit.recTime), mode, action];
        [6, 7, 13, 18, 19].indexOf(mode) > -1 && rec.push("added_" + actionNumber);
        this.temp.recLog.push(rec);
        this.temp.edit.recTime = Date.now();
    },

    createContent: function (args, show) {

        // CREATES A TABLE WITH THE WHOLE CONTENT OF THE RECLOG FILE.
        // MAKES THE WHOLE CONTENT EDITABLE, NEW ELEMENTS CAN BE ADDED ANYWHERE

        if (this.recLog.length) {
            $(".flash #info").hide();
            if (!this.windowContent || this.edit) {
                this.edit = 0;
                let sublist = "", temp = 0, text, playtime, items, item, title = "", content, del, mode, start, a, b = 0,
                    list = this.template.list_top.
                        replace(/%str_record_date%/, str.recordDate).
                        replace(/%str_name%/, str.name).
                        replace(/%str_items%/, str.items).
                        replace(/%str_time%/, str.time).
                        replace(/%str_edit%/, str.edit),
                    list_head = this.template.list.replace(/%str_delete%/, str.delete);

                this.temp.playtime = 0;
                for (a = 0; a < this.recLog.length; a++) {
                    item = JSON.parse(this.recLog[a][0][2]);
                    items = this.recLog[a].length;
                    for (let i = 0; i < items; i++) this.temp.playtime += this.recLog[a][i][0];
                    temp = parseInt(this.temp.playtime * 0.001);
                    playtime = Math.floor(temp / 60) + ":" + (temp % 60 < 10 ? "0" + temp % 60 : temp % 60);
                    sublist = this.template.sublist_top.
                        replace(/%str_alwaysDeleteWholeShape%/, str.alwaysDeleteWholeShape).
                        replace(/%str_item%/g, str.item).
                        replace(/%str_content%/g, str.content).
                        replace(/%str_time%/g, str.time).
                        replace(/%str_options%/g, str.options).
                        replace(/%a%/g, a).
                        replace(/%date%/g, item.date).
                        replace(/%name%/g, item.name || "---");
                    if (args && parseInt(typeof args === "object" ? args[0] : args) === a) {
                        sublist = sublist.replace(/hidden/g, "");
                        list_head = list_head.replace(/%hl%/, "highlighted");
                    } else list_head = list_head.replace(/ %hl%/, "");
                    list += list_head.replace(/%a%/g, a).replace(/%date%/g, item.date).replace(/%name%/g, item.name || "---").replace(/%items%/g, items).replace(/%playtime%/g, playtime);
                    temp = 0;
                    for (b = 0; b < items; b++) {
                        playtime = (this.recLog[a][b][0] * 0.001).toFixed(1) + " sec.";
                        mode = this.recLog[a][b][1];
                        item = this.recLog[a][b][2];
                        actionnumber = this.recLog[a][b][3] || null;
                        switch (mode) {
                        case 0:
                            content = str.headerData;
                            break;
                        case 1:
                        case 3:
                        case 4:
                            content = "X" + item[0] + " Y" + item[1];
                            break;
                        case 2:
                            content = item[0].toString();
                            break;
                        case 5:
                            content = "$('" + item[0].replace(/~id~/, "#").replace(/~class~/, ".") + "')." + item[1];
                            break;
                        case 6:
                        case 7:
                        case 13:
                            start = !this.temp.actionnumber || actionnumber !== this.temp.actionnumber;
                            end = item[2];
                            start ? text = str.start : end && (text = str.finish);
                            start || end ? (
                                text += " " + (mode === 6 ? str.rectangle : mode == 7 ? str.line : str.ellipse),
                                item[6] && (text += ", " + str.filled),
                                item[3] && (text += ", " + str.erasing)
                            ) : text = "&nbsp;".repeat(10) + "\"";
                            content = (start || end ? str.at : str.from) + " X" + (end ? item[4] : item[0]) + " Y" + (end ? item[5] : item[1]) + (!start && !end ? " " + str.to + " X" + item[4] + " Y" + item[5] : "");
                            break;
                        case 8:
                            content = item[0] === 0 ? str.up : item[0] === 1 ? str.down : item[0] === 2 ? str.left : str.right;
                            break;
                        case 9:
                            content = "rgba(" + item[0] + ", " + item[1] + ", " + item[2] + ", " + item[3] + ")";
                            break;
                        case 10:
                            content = item[0] + "%";
                            break;
                        case 11:
                            content = item[1] ? item[1] : "(" + str.none + ")";
                            content && content.length > 50 && (title = "\n" + (item[1] ? item[1] : "(" + str.none + ")") + "\n\n");
                            break;
                        case 12:
                            content = this.toolList[0][item[0]];
                            break;
                        case 14:
                            content = (item[0] === "x" ? str.closeAreas : str.openArea + " ") + (item[0] === "info" ? str.resizeGrid : item[0] === "help" ? str.information : item[0] === "keys" ? str.keyConfig : item[0] === "record" ? str.drawRecorder : "");
                            break;
                        case 15:
                            content = item[0] <= 7 ? this.commandList[0][item[0]] : this.commandList[0][item[0]] + " => " + item[1].toString();
                            break;
                        case 16:
                            content = (item[2] === "wait" ? "await" : "") + " " + item[0] + (item[1] ? "(" + item[1] + ")" : "");
                            break;
                        case 17:
                            let i = JSON.parse(item);
                            content = "New grid: " + i.pixelsX + " x " + i.pixelsY + " (" + i.xcursor + " x " + i.ycursor + ")" + (i.matrix ? " (with matrix)" : " (no matrix)");
                            break;
                        case 18:
                            item.length === 2 ? text = str.start :
                            item[7] && (text = str.finish);
                            text.indexOf(str.start) > -1 || text.indexOf(str.finish) > -1 ? (
                                text += " " + str.parallelogram
                            ) : (
                                text = "&nbsp;".repeat(5),
                                item.length === 5 ? temp !== 1 ? (text += str.lineA, temp = 1) : text += "\"" : item[4] === 1 && item.length === 8 && (
                                    temp !== 2 ? (text += str.linesBandC, temp = 2) : text += "\""
                                )
                            );
                            content = "X" + item[0] + " Y" + item[1] + (item.length > 2 ? " ->  X" + item[2] + " Y" + item[3] : "") + (item.length > 5 ? " -> X" + item[5] + " Y" + item[6] : "") + (item[7] ? " -> X" + (item[5] + item[0] - item[2]) + " Y" + (item[6] + item[1] - item[3]) : "");
                            break;
                        case 19:
                            temp = JSON.parse(item[0]);
                            temp.length === 1 ? text = str.start :
                            item[1] && (text = str.finish);
                            text.indexOf(str.start) > -1 || text.indexOf(str.finish) > -1 ? text += " " + str.polygon : text = "&nbsp;".repeat(5) + "\"";
                            content = str.madeOf + " " + temp.length + " " + str.dot + (temp.length === 1 ? "" : str.dotPlural);
                            break;
                        case 20:
                            text = str.textMarquee;
                            content = "'" + item[0] + "', Font: " + item[2] + "px " + item[1];
                            break;
                        case 21:
                            text = str.text;
                            content = "'" + item[0] + "', Font: " + item[2] + "px " + item[1];
                            break;
                        case 22:
                            text = str.textAreaAltered;
                            content = "ID: " + item[0] + ", Inhalt: " + item[1];
                            break;
                        }
                        if (content && content.length > 50) content = content.substring(0, 50) + "...";
                        del = a + "," + b;
                        text = text || this.modes[mode];

                        sublist += this.template.sublist.
                            replace(/%str_deleteThisItem%/, str.deleteThisItem).
                            replace(/%str_addItemAfterThisOne%/, str.addItemAfterThisOne).
                            replace(/%count%/g, b).
                            replace(/%item%/g, text).
                            replace(/%content%/g, content).
                            replace(/%playtime%/g, playtime).
                            replace(/%a%/g, a).
                            replace(/%b%/g, b).
                            replace(/%del%/g, del).
                            replace(/%title%/g, title);
                        text = content = title = "";
                        this.temp.actionnumber = actionnumber;
                        actionnumber = null;
                    }
                    list += sublist + this.template.sublist_bottom;
                    sublist = "";
                    this.temp.playtime = this.temp.actionnumber = 0;
                }
                list += this.template.list_bottom;
                this.windowContent = this.template.windowContentTop + list + this.template.windowContentBottom;
            }
            this.isEditable && (get(`#${this.editButton}`).style.backgroundImage = this.editButton_open);
            editContent.srcdoc = this.windowContent;
            typeof this.frameScrollTop !== "number" && (this.frameScrollTop = 0);
            show && getComputedStyle(editContent).display === "none" && Rec.showContent();
            setTimeout(this.activateRecords, 500);
        } else {
            get(`#${this.editButton}`).style.backgroundImage = this.editButton_off;
            $(editContent).slideUp();
            editContent.srcdoc = "";
        }
    },

    createTestMatrix: function (x, y) {

        // CREATES A MATRIX FOR 'ADD NEW ITEM' => 'MOVE'

        let m = [], i, j;
        for (i = 0; i < x; i++) {
            m[i] = [];
            for (j = 0; j < y; j++) m[i][j] = testPattern[i % 16][j % 16];
        }
        return m;
    },

    del: function () {

        // REMOVE SINGLE ACTIONS OR A WHOLE RECORD FROM THE RECLOG

        if (!this.isEditable) return 0;
        let args = [...arguments], item;
        args[0] = parseInt(args[0]);
        args[1] && (args[1] = parseInt(args[1]));
        if (args.length === 2 && (args[0] === 0 || this.recLog.length === 1) && args[1] === 0) return message("error", str.delete0ErrorMessage);
        this.edit = 1;
        args.length === 1 ? (
            this.recLog.splice(args[0], 1),
            this.recCounter = this.recLog.length,
            this.listRecords()
        ) : (
            item = this.recLog[args[0]][args[1]][1],
            [6, 7, 13, 18, 19].indexOf(item) === -1 || !this.delWholeShape ? args[1] === 0 ? this.recLog.splice(args[0], 1) : this.recLog[args[0]].splice(args[1], 1) : this.delShape(args)
        );
        this.createContent(args);
        this.showRecInfo();
    },

    delShape: function(args) {

        // REMOVES A WHOLE DRAWN SHAPE

        let to = args[1],
            from = args[1],
            l = this.recLog[args[0]];
        while(l[from].length === 4 && l[args[1]][3] === l[from--][3]){}
        while(l[to] && l[to].length === 4 && l[args[1]][3] === l[to++][3]){}
        return (l = this.recLog[args[0]].splice(++from, to - from), l);
    },

    delWholeShape: 0,

    download: function (log) {

        // SAVE ALL RECORDS TO A SINGLE FILE

        let a = document.createElement("a"), length;
        function createLog(log) {
            let i = 0, total = 0;
            for (; i < log.recLog.length; i++) total += log.recLog[i].length;
            return [JSON.stringify(log), total];
        }
        log && typeof log === "object" ? (
            log = JSON.stringify(log, null, "\t"),
            a.download = "object.txt"
        ) : log ? (
            log = log.toString(),
            a.download = "file.txt"
        ) : Rec.recLog.length && (
            log = [...Rec.recLog],
            log.length > 1 && log[0][0][2][0].indexOf("Demo") > -1 && log.splice(0,1),
            length = log.length, log = { recLog: log },
            [log, total] = createLog(log),
            a.download = `recLog_${length}Record${length === 1 ? "" : "s"}__${total}Items.rec`
        );
        a.href = window.URL.createObjectURL(new Blob([log], { type: "text/plain" }));
        a.click();
        return;
    },

    drawItem: async function (mode, item) {

        // MAIN 'PLAYBACK' ROUTINE, HERE THE ACTION IS EXECUTED

        /*
        MODES:
            0: HEADER
            1: SINGLE PIXEL
            2: WHOLE PATTERN
            3: X and Y CURSOR
            4: MOVE CURSOR
            5: CALL JQUERY
            6: RECTANGLE
            7: LINE
            8: MOVE GRID
            9: COLOR CHANGE
            10: OPACITY CHANGE
            11: TEXT OUTPUT
            12: HIGHLIGHT TOOL
            13: ELLIPSE
            14: OPEN / CLOSE AREA
            15: EXECUTE INSTRUCTION
            16: CALL FUNCTION
            17: LOAD NEW GRID CONFIGURATION
            18: PARALLELOGRAM
            19: POLYGON
            20: TEXT MARQUEE
            21: DRAW TEXT
            22: TEXT AREA
        */

        if (!this.isPlay || this.isPause) return;

        switch (mode) {

            case 0:
                item = JSON.parse(item[0]);
                colorSubmit(item.rgb);
                get("#savematrix").checked = item.savematrix || 0;
                get("#original").checked = item.original || 0;
                resizeGrid(item);
                break;
            case 1:
                // SINGLE PIXEL
                drawPixel({ xc: item[0], yc: item[1] }, item[2] ? [ color.r, color.g, color.b, color.a ] : 0);
                break;
            case 2:
                // WHOLE PATTERN
                item = JSON.parse(item[0]);
                if (item.xcursor > pixelsX || item.ycursor > pixelsY)
                    resizeGrid({ matrix: item.matrix, pixelsX: item.xcursor, pixelsY: item.ycursor, xcursor: item.xcursor, ycursor: item.ycursor });
                else loadGrid(item, 1);
                break;
            case 3:
                // X AND Y CURSORS
                setCursors(item[0], item[1], 1);
                break;
            case 4:
                // MOVE CURSOR
                drawPosition({ xc: item[0], yc: item[1] });
                break;
            case 5:
                // CALL JQUERY
                item[0] = item[0].replace(/~class~/, ".").replace(/~id~/, "#");
                let query = "$('" + item[0] + "')." + item[1];
                this.byRec = 1;
                try { eval(query); } catch (e) {}
                break;
            case 6:
            case 7:
            case 13:
                // RECTANGLE, LINE, ELLIPSE
                drawObject = { from: { xc: item[0], yc: item[1] }, finish: item[2], eraser: item[3] };
                if (typeof item[4] === "number") drawObject.to = { xc: item[4], yc: item[5] };
                drawObject.filled = item[6];
                switch (mode) {
                    case 6: drawRectangle(); break;
                    case 7: drawLine(); break;
                    case 13: drawEllipse(); break;
                }
                break;
            case 8:
                // MOVE GRID
                matrix = moveGrid(item[0]);
                (xcursor < pixelsX || ycursor < pixelsY) && setCursors(pixelsX, pixelsY);
                refreshGrid();
                break;
            case 9:
                // COLOR PICKER
                colorSubmit({r: item[0], g: item[1], b: item[2], a: item[3]});
                break;
            case 10:
                // OPACITY
                moveSlider(item[0]);
                break;
            case 11:
                // TEXT OUTPUT
                let e = get("#" + str.inputFields[1][item[0]]);
                e.focus();
                e.value = item[1];
                break;
            case 12:
                // HIGHLIGHT TOOL
                toolAction(this.toolList[1][item[0]], item[1]);
                break;
            case 14:
                // AREAS
                infoIsOpen = helpIsOpen = keysIsOpen = recordIsOpen = 0;
                slideArea(item[0] === "x" ? "" : item[0], null, null, 1); // slideArea(area, showResize, noRec, byRec)
                break;
            case 15:
                // EXECUTE INSTRUCTION
                let code;
                // RUN MARQUEE
                if (item[0] === 9) {
                    try {
                        await this.runMarquee(item[1]);
                    } catch (err) { console.log(err); }
                } else {
                    if (item[0] === 8 || item[0] === 11) code = this.commandList[1][item[0]].replace(/%value%/g, item[1]);
                    else if (item[0] === 10) code = item[1].replace(/~id~/g, "#");
                    else code = this.commandList[1][item[0]];
                    if (item[0] === 11) {
                        this.recLog[this.entry].findIndex(this.findConfigSize, item[1]);
                        if (this.temp.config) {
                            let size = JSON.parse(this.recLog[this.entry][this.temp.config][2]);
                            this.temp.config = 0;
                            resizeGrid(size.pixelsX, size.pixelsY);
                        }
                    }
                    if (code.indexOf("await") > -1) try { await eval(code.replace(/await /, "")); } catch (err) {}
                    else try { eval(code); } catch (err) {}
                }
                break;
            case 16:
                // CALL FUNCTION
                if (item[2] === 1) {
                    try { await this[item[0]](item[1]); } catch (err) {}
                } else {
                    try {
                        this[item[0]](item[1]);
                    } catch (err) {
                        try { window[item[0]](item[1]); } catch (err) {}
                    }
                }
                break;
            case 17:
                // LOAD NEW GRID CONFIGURATION
                workMatrix = JSON.parse(item[0]);
                imgLoad.style.color = "#fff";
                imgLoad.style.backgroundColor = "#292";
                imgWidth.placeholder = workMatrix.pixelsX;
                imgHeight.placeholder = workMatrix.pixelsY;
                if (document.body && document.body.classList && document.body.classList.contains("modal-open")) closeModal(); // jshint ignore:line
                this.imageInfo = get("#image-info").innerHTML;
                setupGrid();
                break;
            case 18:
                // PARALLELOGRAM
                drawObject = { a: { xc: item[0], yc: item[1] } };
                if (item.length > 2) {
                    drawObject.b = { xc: item[2], yc: item[3] };
                    drawObject.next = item[4];
                }
                if (item.length > 5) {
                    drawObject.c = { xc: item[5], yc: item[6] };
                    drawObject.finish = item[7];
                }
                drawParallelogram();
                break;
            case 19:
                // POLYGON
                drawObject.polygon = JSON.parse(item[0]);
                drawObject.finish = item[1];
                drawPolygon();
                break;
                // TEXT MARQUEE / DRAW TEXT
            case 20: case 21:
                let text = drawNewText(item[0], item[2], item[1], 2);
                if (mode === 20) {
                    get("#grid-background").style.display = "none";
                    get(".bottommask").style.display = "none";
                    get(".rightmask").style.display = "none";
                    await this.runMarquee({ matrix: text, pixelsX: text[0].length, pixelsY: text[0].length, marquee: text.length });
                    get("#grid-background").style.display = "block";
                    get(".bottommask").style.display = "block";
                    get(".rightmask").style.display = "block";
                } else resizeGrid({ matrix: text, pixelsX: Math.max(pixelsX, text.length), pixelsY: Math.max(pixelsY, text[0].length), xcursor: text.length, ycursor: text[0].length });
                break;
            case 22:
                updateTextArea(item[0], item[1]);
        }
        this.byRec = 0;
        redrawPreview();
    },

    edit: 0,

    editItem: function () {

        // CREATE A MODAL WINDOW TO EDIT THE SAVED VALUES OF A SPECIFIC ENTRY

        Keys.prevent();
        Rec.watchInput();
        let args = get("#toedit").value.split("_"),
        content = document.querySelectorAll(".editcontent");
        a = parseInt(args[0]);
        b = parseInt(args[1]);
        mode = Rec.recLog[a][b][1];
        editTime = get("#edittime");
        if (!Rec.checkFormArgs(a)) return message("error", "", Rec.temp.error || str.checkFormArgsErrorMessage), Rec.temp.error = 0;
        if ([8, 11, 12, 14, 15].indexOf(mode) > -1 && parseInt(content[0].value) === -1) return;
        Rec.recLog[a][b][0] = parseInt(editTime.textContent) || 500;
        let log = [], text, temp, pre, items = content.length;
        [].forEach.call(content, function (d, c) {
            text = d.tagName === "DIV" ? d.textContent : d.value;
            text == parseFloat(text) && text.indexOf("00") === -1 && (text = parseFloat(text)); // IMPORTANT! '==' , BUT NOT '===' !
            text === "(" + str.none + ")" ? text = "" :
            text === "null" && (text = null);
            typeof text === "string" && (text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
            mode === 5 && ".#".indexOf(text[0]) > -1 ? (
                pre = text[0] === "." ? "~class~" : text[0] === "#" ? "~id~" : text[0],
                text = pre + text.substring(1)
            ) : mode === 15 && typeof text === "string" ? text = text.replace(/#/g, "~id~") :
            mode === 18 && text === "" ? (
                text = log[log.length - 1],
                log.pop()
            ) : mode === 19 && (
                pre = pre || [],
                c < items - 1 ? c / 2 == parseInt(c / 2) ? temp = { xc: text } : (
                    temp.yc = text, typeof temp.xc === "number" && typeof temp.yc === "number" && pre.push(temp)
                ) : log = [JSON.stringify(pre)]
            );
            log.push(text);
        });
        mode === 0 ? (
            temp = JSON.stringify({ date: log[0], name: log[1], matrix: JSON.parse(log[2]), xcursor: log[3], ycursor: log[4], pixelsX: log[5], pixelsY: log[6], rgb: { r: log[7], g: log[8], b: log[9], a: log[10] }, savematrix: log[11], original: log[12] }),
            log = [temp]
        ) : mode === 17 && (
            temp = JSON.stringify({ matrix: log[0] === "" ? "" : JSON.parse(log[0]), xcursor: log[1], ycursor: log[2], pixelsX: log[3], pixelsY: log[4] }),
            log = [temp]
        );
        Rec.unhighlightContent();
        closeModal();
        Rec.recLog[a][b][2] = log;
        Rec.temp.editItem = 0;
        Rec.edit = 1;
        Rec.windowContent = 0;
        Rec.createContent(args);
    },

    editSub: function (a, b, c) {

        // CREATE AND DISPLAY A MODAL WINDOW TO EDIT A SPECIFIC ENTRY OF THE RECORD

        this.a = a;
        this.b = b;
        if (!this.isEditable) return 0;
        this.watchItemChange();
        this.watchInput();
        $("#" + this.recContent).show();
        let playtime = this.recLog[a][b][0],
            mode = this.recLog[a][b][1],
            value = [...this.recLog[a][b][2]],
            description = this.modes[mode],
            item = this.items[mode],
            codeline = "",
            editcontent = "editcontent",
            contenteditable = "contenteditable",
            options = "", i = 0, wrap, temp,
            spc = "\n" + " ".repeat(36);
        function makePolygonCodelines(value) {
            let i = 0, line = "";
            for (; i < value.length; i++) line += `${spc}<tr>${spc}    <td class="right">${item[0].replace(/%count%/, i + 1)}:</td>${spc}    <td width="30px"></td>${spc}    <td>${spc}        <div class="editcontent" contenteditable>${value[i].xc}</div>${spc}    </td>${spc}</tr>${spc}<tr>${spc}    <td class="right">${item[1].replace(/%count%/, i + 1)}:</td>${spc}    <td width="30px"></td>${spc}    <td>${spc}        <div class="editcontent" contenteditable>${value[i].yc}</div>${spc}    </td>${spc}</tr>`;
            return line;
        }
        mode === 0 ? (
            i = JSON.parse(value[0]),
            value = [ i.date, i.name, JSON.stringify(i.matrix), i.xcursor, i.ycursor, i.pixelsX, i.pixelsY, i.rgb.r, i.rgb.g, i.rgb.b, i.rgb.a, i.savematrix, i.original ]
        ) : mode === 2 ? (
            codeline = spc + "<tr><td>" + item[0] + "</td><td width=\"30px\"></td><td><div class=\"editcontent big border wrap\" contenteditable>" + value[0] + "</div></td></tr>"
        ) : mode === 5 ? (
            value[0] = value[0].replace(/~id~/, "#").replace(/~class~/, "."),
            codeline = spc + "<tr><td class=\"right\">" + item[0] + "</td>" + "<td width=\"30px\">&nbsp;</td>" + "<td class=\"nowrap\">$('<div style=\"padding: 0; margin: 0;\" class=\"editcontent small noborder\" contenteditable>" + value[0] + "</div>').<div style=\"padding: 0; margin: 0;\" class=\"editcontent noborder wrap\" contenteditable>" + value[1] + "</div></td></tr>"
        ) : mode === 8 ? (
            codeline = spc + "<tr><td class=\"right\">" + str.moveGridDirection + "</td><td width=\"30px\"></td><td>" + this.makeSelection(this.directions, value[0], "editcontent") + "</td></tr>"
        ) : mode === 11 ? (
            codeline = spc + "<tr><td class=\"right\">" + str.inputField + "</td><td width=\"30px\"></td><td>" + this.makeSelection(this.inputFields, value[0], "editcontent") + "</td></tr>",
            codeline += spc + "<tr><td class=\"right\">Text</td><td width=\"30px\"></td><td><div class=\"editcontent line_small\" contenteditable>" + value[1] + "</div></td></tr>"
        ) : mode === 12 ? (
            codeline = spc + "<tr><td class=\"right\">" + str.highlightTool + "</td><td width=\"30px\"></td><td>" + this.makeSelection(this.toolList, value[0], "editcontent") + "</td></tr>"
        ) : mode === 14 ? (
            temp = "<select class=\"editcontent box\"><option value=-1>" + str.pleaseSelect + "</option><option value=\"info\"" + (value[0] === "info" ? " selected" : "") + ">" + str.resizeGrid + "</option><option value=\"help\"" + (value[0] === "help" ? " selected" : "") + ">" + str.information + "</option><option value=\"record\"" + (value[0] === "record" ? " selected" : "") + ">" + str.recorder + "</option><option value=\"keys\"" + (value[0] === "keys" ? " selected" : "") + ">" + str.keyConfig + "</option><option value=\"x\"" + (value[0] === "x" ? " selected" : "") + ">" + str.closeAreas + "</option></select>",
            value[0] = temp
        ) : mode === 15 ? (
            value[0] === 10 && value[1].indexOf("~id~") > -1 && (value[1] = value[1].replace(/~id~/g, "#")),
            codeline = spc + "<tr><td class=\"right\">" + str.execCommand + "</td><td width=\"30px\"></td><td>" + this.makeSelection(Rec.commandList, value[0], "editcontent", "newitem") + "</td></tr>",
            value[0] === 8 ? codeline += spc + "<tr id=\"tr\"><td class=\"right\">" + str.speed + " (0.5 - 10):</td><td width=\"30px\"></td><td><div class=\"editcontent\" contenteditable>" + value[1] + "</div></td></tr>" :
            value[0] === 9 ?  codeline += spc + "<tr id=\"tr\"><td class=\"right\">" + str.marqueeMatrix + ":</td><td width=\"30px\"></td><td><div class=\"editcontent big border wrap\" contenteditable>" + value[1] + "</div></td></tr>" :
            value[0] === 10 ? codeline += spc + "<tr id=\"tr\"><td class=\"right\">" + str.userCommand + ":</td><td width=\"30px\"></td><td><div class=\"editcontent\" contenteditable>" + value[1] + "</div></td></tr>" :
            value[0] === 11 ? codeline += spc + "<tr id=\"tr\"><td class=\"right\">" + str.jumpToItem + ":</td><td width=\"30px\"></td><td><div class=\"editcontent\" contenteditable>" + value[1] + "</div></td></tr>" :
            codeline += spc + "<tr id=\"tr\" style=\"display: none\"><td></td><td></td><td><div class=\"editcontent line_small\"></div></td></tr>"
        ) : mode === 17 ? (
            i = JSON.parse(value[0]),
            value = [ JSON.stringify(i.matrix), i.xcursor, i.ycursor, i.pixelsX, i.pixelsY ]
        ) : mode === 19 && (
            value[0] = JSON.parse(value[0]),
            codeline += makePolygonCodelines(value[0]),
            codeline += spc + "<tr><td class=\"right\">" + item[2] + "</td><td width=\"30px\"></td><td><div class=\"editcontent\" contenteditable>" + value[1] + "</div></td></tr>"
        );
        if (!codeline) {
            for (i = 0; i < item.length; i++) {
                if (mode === 14 && i === 0) contenteditable = editcontent = "";
                else {
                    contenteditable = "contenteditable";
                    editcontent = "editcontent";
                }
                if (value[i] === undefined) value[i] = "(" + str.none + ")";
                else if (value[i] === null) value[i] = "null";
                wrap = item[i] === "Matrix" ? "big border wrap" : "wrap";
                codeline += this.template.item.replace(/%editcontent%/g, editcontent).replace(/%wrap%/g, wrap).replace(/%item%/g, item[i]).replace(/%value%/g, value[i]).replace(/%contenteditable%/g, contenteditable);
            }
        }
        options = this.template.edit_sublist.
            replace(/%str_editItemNo%/, str.editItemNo).
            replace(/%str_item%/, str.item).
            replace(/%str_timeValue%/, str.timeValue).
            replace(/%str_applyChanges%/, str.applyChanges).
            replace(/%str_cancel%/, str.cancel).
            replace(/%codeline%/g, codeline).
            replace(/%item%/g, description).
            replace(/%ms%/g, playtime).
            replace(/%toeditid%/g, a + "_" + b).
            replace(/%b%/g, b);
        openModal(this.recContent, options, ".editcontent");
        this.temp.editItem = options;
        this.watchInput("editform");
        this.watchItemChange(1);
        this.refreshEditHandler(c);
        Keys.on();
    },

    entry: 0,

    findConfigSize: function (element, index) {

        // WHEN EDITING AN ENTRY FROM THE RECLOG AND SUBMIT IT, ONE COULD HAVE ENTERED
        // GREATER VALUES THAN ALLOWED (E.G. CURSOR VALUES BIGGER THAN THE GRID SIZE).
        // THAT'S WHY WE RUN BACKWARDS TOWARDS THE RECLOG, FROM THE POSITION OF THE
        // EDITED ENTRY, UNTIL WE FIND THE CORRESPONDING CONFIGURATION (INDEX 1 IS 17)
        // TO FIND THE ALLOWED LIMITS AT THE EDITED ENTRY, TO CHECK THE VALUES.

        index <= this && element[1] === 17 && (Rec.temp.config = index);
    },

    frame: document.createElement("iframe"),

    frameScrollTop: 0,

    grid: {
        pixelsX: 24,
        pixelsY: 24
    },

    highlightStyle: "recbutton_bg_highlight",

    i: 0,

    isEditable: 1,

    isPause: 0,

    isPlay: 0,

    isRec: 0,

    editButton: "reclist",

    editButton_close: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAQUlEQVRIiWNYtWrVf1pihlELBr8FDAwMBDHFFlAkT6wFuFw+6oNRHwxCCwjxKbIAW+4d/JFMapiPWkAyHrWAIAYA7uRGD2fxSnMAAAAASUVORK5CYII=')",

    editButton_off: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAS0lEQVQ4jWNYtWrVf2pjhqFvaFpaGkFMlqH4XEORobhcOOrSkeBSYvnD1FCqRhRcAQODHrKBDAwMegT1EFKAbDAxBhJtKKl46BgKAJ3Urd2B4DyxAAAAAElFTkSuQmCC')",

    editButton_open: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAATElEQVRIiWNYtWrVf1pihlELBr8FDAwMBDHFFlAkT6wFuFw+6oNRH5BuASH+CLaAZpGMZJEemgV6ROkj1gI0S4gynGQLyMGjFgy8BQD3zTrTeVPNaAAAAABJRU5ErkJggg==')",

    lastItemPlayed: 0,

    listRecords: function () {

        // CREATE AN ICON FOR EACH RECORD INSIDE OF THE TABS

        let li = "", item, i;
        for (i in this.recLog) {
            this.recLog[i] != "" && (
                item = JSON.parse(this.recLog[i][0][2]),
                li += "<li><a class='recorded' title='" + (item.name ? item.name : "Record " + (i + 1)) + "'>" + i + "</a></li>\n"
            );
        }
        document.querySelector("#tabs-4 .records").innerHTML = li;
        [].forEach.call(document.querySelectorAll("#tabs-4 a"), function (a) {
            a.removeEventListener("click", function () {
                Rec.play(this.textContent);
            });
            a.addEventListener("click", function () {
                Rec.play(this.textContent);
            });
        });
    },

    loadButton: "recload",

    mainDiv: "record",

    makeNewSelection: function (a) {

        // CREATE A MODAL WINDOW TO ADD NEW ITEMS TO THE RECORD

        get("#errormsg").innerHTML = "";
        if (a.target.value === str.pleaseSelect) return 0;
        Rec.watchInput();
        let mode, item, details, content, value = "", contenteditable;
        mode = Rec.modes.indexOf(a.target.value);
        item = Rec.items[mode];
        details = "<tr><td class=\"right\">" + str.timeInMs + ":</td><td width=\"30px\"></td><td><div id=\"addtime\" class=\"addtime\" contenteditable>200</div></td></tr>";
        if (mode === 5) details += "<tr><td class=\"right\"><font size=\"5\">$( </font></td><td colspan=\"2\"><div style=\"display: inline-block; vertical-align: text-bottom;\" class=\"content line_small empty nowrap\" contenteditable></div> <font size=\"5\">).</font><div style=\"display: inline-block; vertical-align: text-bottom;\" class=\"content line_small empty nowrap\" contenteditable></div></td></tr>";
        else for (i = 0; i < item.length; i++) {
            content = item[i] === "Matrix" ? "content big border wrap" : i === 0 && ([8, 11, 12, 14, 15].indexOf(mode) > -1) ? "wrap" : "content line_small empty wrap";
            if (mode === 8) value = Rec.makeSelection(Rec.directions, -1, "content");
            if (i === 0 && mode === 11) value = Rec.makeSelection(Rec.inputFields, -1, "content");
            else if (i === 0 && mode === 12) value = Rec.makeSelection(Rec.toolList, -1, "content");
            else if (i === 0 && mode === 14) value = "<select class=\"content box\"><option value=-1>" + str.pleaseSelect + "</option><option value=\"info\">" + str.resizeGrid + "</option><option value=\"help\">" + str.information + "</option><option value=\"keys\">" + str.keyConfig + "</option><option value=\"record\">" + str.recorder + "</option><option value=\"x\">" + str.closeAreas + "</option></select>";
            else if (i === 0 && mode === 15) value = Rec.makeSelection(Rec.commandList, -1, "content", "newitem");
            contenteditable = value ? "" : "contenteditable";
            details += Rec.template.item.replace(/%editcontent%/g, content).replace(/%wrap%/g, "").replace(/%item%/g, item[i]).replace(/%value%/g, value).replace(/~id~/g, i).replace(/%contenteditable%/g, contenteditable).replace(/%count%/g, "1");
            value = "";
        }
        details += "<!--optional-->";
        get("#details").innerHTML = details;

        // ADD 'LIVE' BUTTON TO AVAILABLE MODES
        [2, 3, 6, 7, 8, 9, 10, 11, 13, 18, 19].indexOf(mode) > -1 ? (
            get("#addbydraw").innerHTML = Rec.template.addByDraw.replace(/%addbydraw%/, str.addByDraw),
            get("#draw_add_item").removeEventListener("click", Rec.recSingleItem),
            get("#draw_add_item").addEventListener("click", Rec.recSingleItem)
        ) : get("#addbydraw").innerHTML = "";

        Rec.temp.addItem = get("#details").innerHTML;
        Keys.on();
        Rec.watchInput("addform");
        mode === 15 && Rec.watchItemChange(1);
        document.querySelector(".content").focus();
    },

    makeSelection: function (item, selected, itemClass, id) {

        // CREATE A SELECTION BOX WITH ALL AVAILABLE NEW ITEMS

        let code = "<select" + (id ? " id=\"" + id + "\"" : "") + (itemClass ? " class=\"" + itemClass + " box\"" : "") + "><option value=-1>" + str.pleaseSelect + "</option>";
        for (let i = 0; i < item[0].length; i++) {
            item[0][i] !== "" && (code += "<option value=" + i + (i === selected ? " selected" : "") + ">" + item[0][i] + "</option>");
        }
        code += "</select>";
        return code;
    },

    message_mem: "",

    mode: [0,"pencil",0,0,0,0,"rectangle","line","move",0,0,0,0,"ellipse",0,"extras",0,0,"parallelogram","polygon"],

    next: function () {

        // 'PLAY NEXT' ON PLAYBACK

        !this.isRec && this.isPlay && !this.isPause && this.entry < this.recCounter - 1 && (
            this.i = 0,
            this.entry++
        );
    },

    nextButton: "next",

    normalStyle: "recbutton_bg",

    out: function (text, restore) {

        // INFO DISPLAY FOR THE RECORDER

        get(`#${this.spanInfo}`).tagName === "TEXTAREA" ? get(`#${this.spanInfo}`).value = text : get(`#${this.spanInfo}`).textContent = text;
        restore && setTimeout(Rec.showRecInfo, 4000);
    },

    play: function (entry) {

        // START PLAYBACK

        let item, ask;
        if (this.recLog.length && !this.isPlay) {
            if (this.secure && !matrixIsEmpty()) ask = this.ask(str.storeTemporarily);
            if (ask || !this.secure) {
                Rec.grid = {
                    matrix: [...matrix],
                    name: matrix.name || 0,
                    size: matrix.size || 0,
                    type: matrix.type || 0,
                    xcursor: xcursor,
                    ycursor: ycursor,
                    pixelsX: pixelsX,
                    pixelsY: pixelsY,
                    rgb: color
                };
            }
            ask = 0;
            if (this.recLog[this.entry] && this.recLog[this.entry].length) {
                this.entry = parseInt(entry) || 0;
                item = JSON.parse(this.recLog[this.entry][0][2]);
                let x = item.xcursor,
                    y = item.ycursor;
                if (get("#image-info").innerHTML) this.imageInfo = get("#image-info").innerHTML;
                this.isPlay = 1;
                this.press("play");
                if (typeof item.matrix === "string") item.matrix = JSON.parse(item.matrix);
                resizeGrid({ matrix: item.matrix, pixelsX: x, pixelsY: y, xcursor: x, ycursor: y });
                this.i = 0;
                this.message_mem = str.playback + (item.name ? " " + str.of + " " + item.name : "");
                message("info", this.message_mem);
                this.prepareToPlay();
                setTimeout(this.playNext, 50);
            }
        }
    },

    playButton: "play",

    playNext: async function () {

        // PROCESSES THE ENTRIES OF A RECORD

        if (Rec.i < Rec.recLog[Rec.entry].length - 1 && Rec.isPlay) {
            if (Rec.isPause) return;
            Rec.temp.playtime2 = Rec.temp.playtime2 || 0;
            Rec.temp.playtime2 += Rec.recLog[Rec.entry][Rec.i][0];
            let time = parseInt(Rec.temp.playtime2 / 1000), mins = Math.floor(time / 60);
            secs = time % 60 < 10 ? "0" + time % 60 : time % 60;
            Rec.out(str.play + ": " + mins + ":" + secs);
            await Rec.drawItem(Rec.recLog[Rec.entry][Rec.i][1], Rec.recLog[Rec.entry][Rec.i][2]);
            await setTimeout(function() { Rec.playNext(); Rec.i++;}, Rec.recLog[Rec.entry][Rec.i][0] / Rec.speed);
        } else if (parseInt(Rec.entry) < Rec.recCounter - 1 && Rec.isPlay && !Rec.isPause) {
            Rec.i = 0;
            Rec.entry++;
            Rec.playNext();
        } else if (!Rec.isPlay && Rec.isPause || Rec.i === Rec.recLog[Rec.entry].length - 1) {
            Rec.i = Rec.entry = Rec.isPlay = Rec.isPause = 0;
            clear("move");
            Rec.prepareToPlay();
            Rec.press("stop");
            Rec.temp.playtime2 = 0;
            Keys.prevent();
            Rec.showRecInfo();
            messageId && message();
            get(`#${Rec.printArea}`).blur();
            Rec.message_mem = 0;
            if (Rec.grid.matrix) {
                let ask;
                if (Rec.secure) ask = Rec.ask(str.reloadYourPattern);
                if (ask || !Rec.secure) {
                    workMatrix = Rec.grid;
                    colorSubmit(rgbToHex(Rec.grid.rgb), Rec.grid.rgb);
                    Rec.grid = 0;
                    setupGrid();
                }
            }
        }
    },

    prepareMarqueeMatrix: function(grid) {

        // CONCATENATES (EMPTY MATRIX) + (MARQUEE MATRIX) + (EMPTY MATRIX),
        // WHERE THE EMPTY MATRICES HAVE FULL GRID WIDTH

        let size = grid.marquee + pixelsX,
            newmatrix = [], x, y;
        for (x = 0; x < pixelsX; x++) {
            newmatrix[x] = newmatrix[x + size] = [];
            newmatrix[x + pixelsX] = grid.matrix[x];
            for (y = 0; y < pixelsY; y++) newmatrix[x][y] = newmatrix[x + size][y] = 0;
        }
        for (; x < grid.marquee; x++) newmatrix[x + pixelsX] = grid.matrix[x];
        return newmatrix;
    },

    prepareToPlay: function () {

        // CHANGING OF THE STYLE BEFORE AND AFTER PLAYBACK

        if (this.isPlay || this.isRec || this.temp.edit.active) clear("preview");
        else {
            redrawPreview();
            if (this.imageInfo) {
                $("#img-info").show();
                $("#image-info").fadeOut(400, function () {
                    get("#image-info").innerHTML = this.imageInfo;
                    $("#image-info").fadeIn(400);
                    this.imageInfo = 0;
                });
            }
        }
        $(".color-preview").spectrum(this.isPlay || this.temp.edit.active ? "disable" : "enable");
        $("#slider").slider(this.isPlay || this.temp.edit.active ? "disable" : "enable");
        setBase64Field({
            codeHead: this.isPlay || this.isRec || this.temp.edit.active ? "Information" : codeHeadline[0][0],
            buttonVisible: this.isRec || this.isPlay || this.temp.edit.active ? 0 : 1,
            codeTopHtml: this.isPlay || this.isRec ? "" : this.temp.edit.active ? str.clickOutsideWhenFinish : codeTopHtml[0],
            codeBottomHtml: this.isPlay || this.isRec || this.temp.edit.active ? "" : codeBottomHtml[0],
            content: "",
            readonly: this.isRec || this.temp.edit.active ? 0 : 1,
            css: {
                var: "height",
                val: this.isPlay || this.isRec || this.temp.edit.active ? "185px" : "130px"
            }
        });
        Keys[this.isRec ? "on" : this.isPlay ? "off" : "prevent"]();
        this.clearPlayground();
        this.setFont(this.isPlay || this.isRec || this.temp.edit.active ? 1 : 0);
        this.hideContent();
    },

    presetsDiv: ".presets",

    press: function () {

        // 'PRESS' RECORDER BUTTONS

        let args = [...arguments], playButton = get(`#${this.playButton}`), button;
        if (args[0] === "pause") {
            if (!this.temp.press) {
                playButton.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGklEQVQokWNgIAeoKKn8R8aExEc1DFUNpAAAMcNw0YNv9QgAAAAASUVORK5CYII=')";
                this.temp.press = setInterval(function () {
                    if (playButton.classList) playButton.classList.replace(playButton.classList.contains(Rec.highlightStyle) ? Rec.highlightStyle : Rec.normalStyle, playButton.classList.contains(Rec.highlightStyle) ? Rec.normalStyle : Rec.highlightStyle);
                }, 500);
            }
        } else if (this.temp.press) {
            clearInterval(this.temp.press);
            this.temp.press = 0;
            playButton.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAOElEQVQokWNgIAeoKKn8V1FS+a+hoeFAkgaiNaJrIKgRlwacGglpgGHaaSDaSUR7muhgJTriSAEAN4FaXXGhA/sAAAAASUVORK5CYII=')";
        }
        [].forEach.call(document.querySelectorAll("." + Rec.styleClass), function (a) {
            a.classList.remove(Rec.highlightStyle);
            a.classList.add(Rec.normalStyle);
        });
        for (let i in args) {
            if (args[i] === "pause")
                continue;
            button = get("#" + Rec[args[i] + "Button"]);
            button.classList.remove(Rec.normalStyle);
            button.classList.add(Rec.highlightStyle);
        }
    },

    prev: function () {

        // ONE RECORD BACK ON PLAYBACK

        if (!this.isRec && this.isPlay && !this.isPause) {
            this.temp.size = 0;
            this.temp.playtime2 = 0;
            this.isPause = 1;
            this.stop();
            if (this.entry > 0) this.entry--;
            setTimeout(function() { Rec.play(); }, 200);
        }
    },

    prevButton: "prev",

    printArea: "base64-code",

    rec: function(mode, action) {

        // HERE ALL ACTIONS ARE RECORDED

        if (!this.isRec) return;
        //if (onlineSession) return (drawUserId == $ession.db.userId ? $ession.sendDrawing([mode, action]) : drawUserId = $ession.db.userId);
        let recTime = Date.now(),
        rec = [ recTime - Rec.recTime, mode, action ];
        [6, 7, 13, 18, 19].indexOf(mode) > -1 && rec.push(actionNumber);
        Rec.recLog[Rec.recCounter].push(rec);
        Rec.recTime = recTime;
        Rec.out("\n" + str.record + " #" + Rec.recCounter + ",\n" + str.entry + " #" + (Rec.recLog[Rec.recCounter].length - 1));
    },

    recButton: "rec",

    recContent: "reccontent",

    recCounter: 1,

    showRecInfo: function() {
        Rec.out(Rec.isPause ? "..." + str.pause + "..." : "..:: " + str.ready + ", " + Rec.recCounter + " " + str.record + (Rec.recCounter !== 1 ? str.recordPlural : "") + " " + str.loaded + " ::..");
    },

    recLog: [],

    recSingleItem: function() {

        // RECORD A SINGLE ACTION IN 'LIVE' ADD MODE

        get("#draw_add_item").removeEventListener("click", Rec.recSingleItem);
        Rec.temp.edit.args = document.querySelector("#toadd").value.split("_");
        let a = parseInt(Rec.temp.edit.args[0]),
            b = parseInt(Rec.temp.edit.args[1]),
            mode = Rec.modes.indexOf(get("#item").value),
            item;
        Rec.recLog[a].findIndex(Rec.findConfigSize, b),
        closeModal();
        Rec.unhighlightContent();
        $("#editcontent").slideUp();
        message("info", Rec.addSpecialMessage[mode]);
        Rec.temp.edit.mode = mode;
        Rec.temp.recLog = [];
        Rec.temp.edit.active = 1;
        Rec.temp.edit.recTime = Date.now();
        Rec.temp.edit.submode = mode === 15 ? parseInt(get("#newitem").value) : 0;
        Rec.temp.edit.submode === 9 && (Rec.temp.edit.mode = 2);
        Keys.prevent();
        toolAction(mode && mode !== 15 ? Rec.mode[mode] : "pencil");
        Rec.grid = 0;
        [2, 3, 6, 7, 8, 13, 15, 18, 19].indexOf(mode) > -1 ? (
            Rec.grid = {
                matrix: [...matrix],
                name: matrix.name || "",
                size: matrix.size || 0,
                type: matrix.type || "",
                xcursor: xcursor,
                ycursor: ycursor,
                pixelsX: pixelsX,
                pixelsY: pixelsY,
                rgb: color
            },
            mode === 2 || mode === 15 ? (
                $(copyCode).slideUp(),
                codeBoxShows("matrix")
            ) : (
                item = Rec.temp.config ? JSON.parse(Rec.recLog[a][Rec.temp.config][2]) : JSON.parse(Rec.recLog[a][0][2]),
                item.matrix = mode === 8 ? [...Rec.createTestMatrix(item.pixelsX, item.pixelsY)] : JSON.parse(item.matrix),
                resizeGrid(item)
            ),
            Rec.temp.config = 0
        ) : mode === 9 ? (
            setTimeout(() => $(".color-preview").spectrum("show"), 500)
        ) : mode === 11 && (
            Keys.on(),
            Rec.prepareToPlay(),
            base64Code.value = "",
            base64Code.focus()
        );
    },

    recTime: 0,

    refreshEditHandler: function () {

        // UPDATE THE EVENT HANDLERS WHEN OPENING A NEW MODAL WINDOW TO EDIT ITEMS

        document.getElementById("edit_item").removeEventListener("click", Rec.editItem);
        document.getElementById("cancel_edit_item").removeEventListener("click", Rec.cancelEditItem);
        document.getElementById("edit_item").addEventListener("click", Rec.editItem);
        document.getElementById("cancel_edit_item").addEventListener("click", Rec.cancelEditItem);
    },

    resume: function () {

        // RESUME PLAYBACK AFTER PAUSE

        if (this.i < this.recLog[this.entry].length - 1) {
            message("info", this.message_mem);
            this.isPlay = 1;
            this.isPause = 0;
            this.prepareToPlay();
            this.press("play");
            this.temp.size ? this.shiftMatrix() : this.playNext();
        }
    },


    runMarquee: async function (marquee = demo.marquee) {

        // MAKES A PATTERN RUN OVER THE GRID

        return await new Promise(resolve => {
            try {
                typeof marquee === "string" && (marquee = JSON.parse(marquee));
                !(marquee && typeof marquee === "object" && marquee.hasOwnProperty("marquee")) && (marquee = JSON.parse(demo.marquee));
            } catch {}
            this.temp.matrix = this.prepareMarqueeMatrix(marquee);
            this.temp.grid = getMatrix();
            this.temp.size = marquee.marquee + pixelsX;
            this.temp.i = 0;
            this.temp.finish = e => {
                if (Rec.isPlay && Rec.isPause) return;
                resizeGrid(Rec.temp.grid);
                Rec.temp.matrix = Rec.temp.grid = Rec.temp.size = Rec.temp.i = 0;
                const [rmask, bmask] = [get(".rightmask"), get(".bottommask")];
                const [x, y] = [get(".cols li.selected").innerText, get(".rows li.selected").innerText];
                bmask.style.width = `${x * pixelWidth}px`;
                bmask.style.height = `${areaY - y * pixelHeight}px`;
                rmask.style.width = `${areaX - x * pixelWidth}px`;
                $("#grid-background").show();
                $(bmask).show();
                $(rmask).show();
                resolve(clearInterval(e));
                Rec.temp.finish = null;
            };
            resizeGrid(marquee);
            clear("grid");
            $("#grid-background").hide();
            $(".bottommask").hide();
            $(".rightmask").hide();
            this.shiftMatrix();
        });
    },

    saveButton: "recsave",

    secure: 0,

    setFont: function (o) {
        get(`#${this.printArea}`).style.fontFamily = o ? this.playbackCSS[0] : this.printAreaCSS[0];
        get(`#${this.printArea}`).style.fontSize   = o ? this.playbackCSS[1] : this.printAreaCSS[1];
        get(`#${this.printArea}`).style.fontStyle  = o ? this.playbackCSS[2] : this.printAreaCSS[2];
    },

    setup: function (options) {

        // START UP RECORDER

        // CREATE THE HTML CONTENT

        // 1. FILL THE VARIABLES WITH THE DATA SUBMITTED BY THE SETUP({}) CALL
        if (options.constructor === Object) for (let i in options) this[i] = options[i];
        else return;

        // ADD LOCALIZED CONTENT
        this.addSpecialMessage = str.addSpecialMessage;
        this.toolList = str.toolList;
        this.commandList = str.commandList;
        this.directions = str.directions;
        this.items = str.recItems;
        this.inputFields = str.inputFields;
        this.modes = str.modes;
        this.toolList = str.toolList;

        // PREPARE THE IFRAME FOR JAVASCRIPT TESTING
        this.frame.name = "jsframe";
        this.frame.style.display = "none";
        this.frame.srcdoc = this.template.testJs;
        document.body.appendChild(this.frame);

        // APPLY RECORDER, SET EVENT HANDLERS, CREATE THE CONTENT TO EDIT RECLOG
        this.applyRecorder();
        this.activateButtons();
        this.press("stop");
        this.showRecInfo();

        // CREATE THE SPEED SLIDER FOR PLAYBACK
        get(`.${this.slider_value}`).textContent = this.speed;
        $(`#${this.slider}`).slider({
            value: this.speed,
            min: 0.5,
            max: 10,
            step: 0.1,
            orientation: "horizontal",
            animate: "slow",
            slide: (e, speed) => {
                Rec.speed = speed.value;
                get(`.${Rec.slider_value}`).textContent = speed.value;
            },
            change: (e, speed) => {
                get(`.${Rec.slider_value}`).textContent = speed.value;
                Rec.speed = speed.value;
            }
        });

        // SET SOME STYLE
        this.printAreaCSS = [
            getComputedStyle(document.getElementById(this.printArea)).fontFamily,
            getComputedStyle(document.getElementById(this.printArea)).fontSize,
            getComputedStyle(document.getElementById(this.printArea)).fontStyle
        ];
        this.playbackCSS = ["Acme", "20px", "bold"];

        this.delWholeShape = 1;
    },

    shiftMatrix: function() {

        // RECURSIVE FUNCTION THAT SHIFTS THE WHOLE MARQUEE MATRIX TO THE LEFT, PIXEL BY PIXEL

        if (Rec.temp.size > Rec.temp.i) {
            const speed = parseFloat(get("." + Rec.slider_value).textContent);
            if (Rec.isPlay && !Rec.isPause) {
                Rec.temp.i++;
                for (let x = 0; x < pixelsX; x++) matrix[x] = Rec.temp.matrix[Rec.temp.i + x];
                refreshGrid();
                Rec.temp.playtime2 += 16.67 * speed;
                let time = parseInt(Rec.temp.playtime2 / 1000),
                    mins = Math.floor(time / 60),
                    secs = ("0" + time % 60).substr(-2);
                Rec.out(str.play + ": " + mins + ":" + secs);
            }
            setTimeout(Rec.shiftMatrix, 100 / speed);
        } else Rec.temp.finish && Rec.temp.finish();
    },

    showContent: function (ms, func) {

        // SHOWS OR HIDES THE IFRAME THAT CONTAINS THE RECLOG EDITOR

        if ((document.body.classList.length && document.body.classList.contains("modal-open")) || !this.recLog.length) return false;
        if (getComputedStyle(editContent).display !== "none") return this.hideContent();
        if (this.secure && this.isEditable) alert(str.showContentWarning);
        if (!this.isEditable) {
            try {
                [].forEach.call(eframe.document.querySelectorAll(".is_editable"), e => e.style.display = "none");
            } catch (err) {}
        }
        $("#editcontent").show(ms || 400, func || function() {
            if (Rec.isEditable) get(`#${Rec.editButton}`).style.backgroundImage = Rec.editButton_close;
            else get(`#${Rec.editButton}`).style.display = "none";
            try {
                eframe.document.body.querySelectorAll(".overview_content")[0].focus();
            } catch (err) {}
        });
    },

    hideContent: function () {
        $(editContent).hide(400, () => {
            Rec.isEditable && (get(`#${Rec.editButton}`).style.backgroundImage = Rec.editButton_open);
            document.body.focus();
        });
    },

    slider: "rec-slider",

    slider_box: "slider_box",

    slider_value: "slider_value",

    spanInfo: "rec-info",

    speed: 3,

    startRec: function () {

        // START RECORDING A NEW RECORD

        if (!this.isRec) {
            this.name = prompt(str.nameForThisRecord);
            if (this.name === null) return;
            this.isRec = 1;
            this.recLog[this.recCounter] = [];
            this.recTime = Date.now();
            this.rec(0, [JSON.stringify({
                    date: new Date().toLocaleString().split(",")[0],
                    name: this.name,
                    matrix: JSON.stringify(matrix),
                    xcursor: pixelsX,
                    ycursor: pixelsY,
                    pixelsX: pixelsX,
                    pixelsY: pixelsY,
                    rgb: {
                        r: color.r,
                        g: color.g,
                        b: color.b,
                        a: color.a
                    },
                    savematrix: document.querySelector("#savematrix").checked ? 1 : 0,
                    original: document.querySelector("#original").checked ? 1 : 0
                })]);
        }
        this.prepareToPlay();
        this.press("rec");
        message("info", str.recording + " " + (this.name ? "'" + this.name + "'" : ""));
        setCursors(pixelsX, pixelsY, 1);
        this.out("\n" + str.record + " #" + this.recCounter + ",\n" + str.entry + " #" + (this.recLog[this.recCounter].length - 1));
    },

    stop: function () {

        // STOP PLAYBACK

        if (this.isPlay && !this.isPause) {
            holdKey !== 27 && message("info", "..." + str.pause + "...");
            Keys.prevent();
            this.isPause = 1;
            this.prepareToPlay();
            this.press("pause");
            document.getElementById(this.printArea).blur();
        } else if (this.isPlay && this.isPause) {
            this.setFont();
            this.isPlay = 0;
            this.playNext();
        }
        holdKey = 0;
    },

    stopButton: "stop",

    stopRec: function () {

        // STOP RECORDING

        messageId && message();
        this.isRec = 0;
        this.press("stop");
        this.prepareToPlay();
        if (this.recLog[this.recCounter].length > 1) {
            this.edit = 1;
            this.recCounter++;
            this.createContent();
            this.listRecords();
            redrawPreview();
        } else this.recLog[this.recCounter] = [];
        this.showRecInfo();
        Keys.prevent();
    },

    styleClass: "recbutton",

    styleFormOnInput: function (a) {

        // SINCE WE USE CONTENTEDITABLE DIV'S FOR EDITING THE RECORD, THERE ARE
        // NO BOXES VISIBLE. THAT'S WHY WE MAKE THE BOTTOM BORDER VISIBLE
        // WHEN A FIELD IS EMPTY

        a.target.type !== "checkbox" && a.target.classList[a.target.textContent.length === 0 ? "add" : "remove"]("line_small");
    },

    temp: {press: 0, clear: 0, template: "<span title=\"Details\" class=\"recbutton\" id=\"reclist\"></span>\n", addItem: 0, editItem: 0, imgInfo: 0, size: 0, config: 0, edit: {}, recLog: [], error: 0, playtime: 0, playtime2: 0, matrix: 0, grid: 0, i: 0},


    /*************************  BEGIN OF TEMPLATES  *************************/

    template: {

        // THE TEMPLATES SECTION

        // FORM TO ADD NEW ITEMS BY SELECTION
        add: `
                <div class="editsublist">
                <h4>%add_item%</h4><hr><br />
                    <form name="addform">
                        <input type="hidden" id="toadd" value="%a%_%b%" />
                        <table class="border round-edges">
                            <tr>
                                <td class="right nowrap">%new_item%:</td>
                                <td></td>
                                <td><select id="item" class="box" valign="top">%options%</select></td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                    <table id="details"></table>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                    <table width="100%">
                                        <tr>
                                            <td class="padding15"><input class="editbutton" type="button" value="%add_item%" id="add_item" /></td>
                                            <td id="addbydraw" class="padding15"></td>
                                            <td class="padding15"><input class="editbutton" type="button" value=" %cancel% " id="cancel_add_item" /></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr><td colspan="3" id="errormsg"></td></tr>
                        </table>
                    </form>
                </div>`,

        // THE BUTTON THAT LETS THE USER ADD AN ITEM 'BY DOING'
        addByDraw: "<input id=\"draw_add_item\" class=\"editbutton\" type=\"button\" value=\"%addbydraw%\" />",

        // THE RECORDER CONTAINER
        main: `
                    <h4>Recorder</h4>
                    <div class="%slider_box%">
                        <span class="playbackspeed">%playback% - %speed%</span>
                        <span class="%slider_value%"></span>
                        <div id="%slider%"></div>
                    </div>
                    <div class="buttons">
                        <span title="Record" class="rec %styleClass%" id="%recButton%"></span>
                        <span title="Stop / Pause" class="stop %styleClass%" id="%stopButton%"></span>
                        <span title="Previous" class="prev %styleClass%" id="%prevButton%"></span>
                        <span title="Play / Pause" class="play %styleClass%" id="%playButton%"></span>
                        <span title="Next" class="next %styleClass%" id="%nextButton%"></span>
                        <span style="display: inline-block; width: 20px;"></span>
                        <span title="Load" class="recload %styleClass%" id="%loadButton%"></span>
                        <span title="Save" class="recsave %styleClass%" id="%saveButton%"></span>
                        <span style="display: inline-block; width: 20px;"></span>
                        %editButton%
                    </div>
                    <span id="%spanInfo%"></span>
                    <input style="display: none" type="file" accept="text/*,.rec" id="%uploadFile%" />`,

        // THE EDIT BUTTON APPEARS ONLY IF ENABLED
        editButton: `
                    <span title="Details" class="reclist %styleClass%" id="%editButton%"></span>\n`,

        // THE HEADER OF THE LIST OF ALL CURRENT RECORDINGS
        list_top: `
        <div class="overview">
            <span class="overview_head">%str_record_date%</span>
            <span class="overview_head">%str_name%</span>
            <span class="overview_head">%str_items%</span>
            <span class="overview_head">%str_time%</span>
            <span class="overview_head is_editable">%str_edit%</span>
        </div>`,

        // A SINGLE RECORDING
        list: `
        <div class="overview_content %hl%">
            <span class="clickable" data-id="%a%">%date%</span>
            <span class="clickable" data-id="%a%">%name%</span>
            <span class="clickable" data-id="%a%">%items%</span>
            <span class="clickable" data-id="%a%">%playtime%</span>
            <span class="clickable delete is_editable" onclick="del(%a%)" title="%str_delete%"></span>
        </div>`,

        // THE END OF THE RECORD LIST
        list_bottom: "",

        // THE HEADER OF THE LIST OF ALL ITEMS IN ONE RECORDING
        sublist_top: `
        <div class="hidden sublist_top" id="sublist_%a%">
            <div class="sublist_headline">
                <span>%date%: %name%</span>
                <span>%str_alwaysDeleteWholeShape%<input id="deleteWholeShape" class="deleteWholeShape" type="checkbox" onclick="delWholeShape(this)"/></span>
            </div>

            <div class="sublist" data-id="%a%">
                <span class="sublist_head">#</span>
                <span class="sublist_head">%str_item%</span>
                <span class="sublist_head">%str_content%</span>
                <span class="sublist_head">%str_time%</span>
                <span class="sublist_head is_editable">%str_options%</span>
            </div>`,

        // ONE SINGLE ITEM
        sublist: `
            <div class="sublist_item">
                <span onclick="edit(this,%a%,%b%)">#%count%</span>
                <span title="%title%" onclick="edit(this,%a%,%b%)">%item%</span>
                <span title="%title%" onclick="edit(this,%a%,%b%)">%content%</span>
                <span align="center" onclick="edit(this,%a%,%b%)">%playtime%</span>
                <span class="edit header is_editable">
                    <a class="delete clickable" onclick="del('%a%','%b%')" title="%str_deleteThisItem%"></a>
                    <a class="add clickable" onclick="add(%a%,%b%)" title="%str_addItemAfterThisOne%"></a>
                </span>
            </div>`,

            // FINISH OF THE ITEM LIST
            sublist_bottom: `
        </div>`,

        // THE FORM FOR EDITING AN ITEM
        edit_sublist: `
                <div class="editsublist">
                    <h4>%str_editItemNo% #%b%</h4><hr><br />
                    <p class="center head">%str_item%: %item%</p>
                    <form name="editform">
                        <table class="border round-edges">
                            <tr>
                                <td class="right nowrap">%str_timeValue%:</td>
                                <td width="30px"></td>
                                <td>
                                    <div class="edittime" style="display: inline-block" id="edittime" contenteditable>%ms%</div><font size="4" style="vertical-align: baseline;">&nbsp;&nbsp;ms</font>                                </td>
                            </tr>
                            %codeline%
                            <tr>
                                <td><input class="editbutton" type="button" value="%str_applyChanges%" id="edit_item" /></td>
                                <td></td>
                                <td><input class="editbutton" type="button" value=" %str_cancel% " id="cancel_edit_item" /></td>
                            </tr>
                            <tr><td colspan="3" id="errormsg"></td></tr>
                        </table>
                        <input type="hidden" value="%toeditid%" id="toedit" />
                    </form>
                </div>`,

        // THE SPECIFIC ITEM TO EDIT
        item: `
                            <tr>
                                <td class="right nowrap">%item%</td>
                                <td width="30px"></td>
                                <td>
                                    <div class="%editcontent% %wrap%" %contenteditable%>%value%</div>
                                </td>
                            </tr>`,

        // IF AN ITEM CONSISTS OF AN INSTRUCTION IN JAVASCRIPT, AN IFRAME IS CREATED TO CHECK IF THE CODE IS VALID
        testJs: `
            <!DOCTYPE html>
            <html>
            <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head>
            <body>
                <script type="text/javascript">
                    var str = {aFunctionWithResult: "${str.aFunctionWithResult}", anObject: "${str.anObject}", anArray: "${str.anArray}", aString: "${str.aString}", aNumber: "${str.aNumber}", aBoolean: "${str.aBoolean}", theCodeIsValid: "${str.theCodeIsValid}", theResponseIs: "${str.theResponseIs}"};
                    window.onerror = function(err) {document.getElementsByTagName("result")[0].innerHTML = \`<font color="red">$\{err}</font>\`};
                    function checkJs(ex) {
                        var result, ok = 1;
                        try {result = eval(ex);}
                        catch (err) {return \`<font color="red"><b>$\{err}</b></font>\`}
                        var con = result?.constructor ?
                        result.constructor == Function ? str.aFunctionWithResult + ": " + res :
                        result.constructor == Object ? str.anObject :
                        result.constructor == Array ? str.anArray :
                        result.constructor == String ? str.aString :
                        result.constructor == Number ? str.aNumber :
                        typeof result == "boolean" ? str.aBoolean : typeof result : "";
                        var res = typeof result == "object" ? JSON.stringify(result) : typeof result == "function" ? result.toString() : result;
                        res.length > 100 && (res = res.substring(0, 100) + "...");
                        return \`<p><font color="green">$\{str.theCodeIsValid}</font>. $\{str.theResponseIs} <b>$\{con}</b>:</p><p>$\{res}</p>\`;
                    }
                </script>
            </body>
            </html>`,

        // THE HEAD SECTION OF THE IFRAME THAT SHOWS ALL THE CONTENT OF RECORDINGS
        windowContentTop: `
<!doctype html>
<html style="color:#eee;">
    <head>
        <meta charset="utf-8">
        <style type="text/css">
            body, html {position: relative;margin: 1px;font-family: Roboto, Verdana, sans-serif;font-size: 12px;scrollbar-color: #666 #333}
            body {width: 100%; height: 100%; overflow: scroll;}
            .active {background: #f45c2d !important;color: #fff !important}
            .overview, .overview_content {display: grid;grid-template-columns: 2fr 2fr 2fr 1fr 1fr;grid-template-rows: 25px;gap: 0 0;grid-template-areas: ". . . . ."}
            .overview_content, .sublist_headline {grid-template-rows: 30px}
            .overview span, .overview_content span {display: flex;justify-content: center;align-items: center;user-select: none}
            .overview span {padding: 5px 10px;font-size: 12px;font-weight: 700;border-radius: 27px 27px 0 0;background-color: rgba(50, 50, 50, .85);border-top: #888 1px solid;border-left: #888 1px solid;border-right: #888 1px solid}
            .overview_content span {padding: 4px 15px;font-size: 12px;border-top: #8884 1px solid;border-left: #8882 1px solid;border-right: #8882 1px solid;cursor: pointer}
            .sublist_top {position: relative;}
            .sublist_headline {display: grid;grid-template-columns: 25fr 47fr;gap: 0 0;grid-template-areas: ".."}
            .sublist_headline span:first-child {display: flex;padding: 5px 10px;font-size: 12px;justify-content: center;font-weight: 700;border-radius: 27px 27px 0 0;background-color: #f45c2d;border-top: #888 2px solid;border-left: #888 2px solid;border-right: #888 2px solid;user-select: none}
            .sublist_headline span:nth-child(2) {display: flex;padding: 5px 10px;font-size: 12px;justify-content: flex-end;font-weight: 400;user-select: none}
            .sublist span, .sublist_item span:first-child, .sublist_item span:last-child, .sublist_item span:nth-child(4) {justify-content: center}
            .sublist, .sublist_item {display: grid;grid-template-columns: 2fr 8fr 13fr 3fr 3fr;grid-template-rows: 25px;gap: 0 0;grid-template-areas: ". . . . ."}
            .sublist_item:focus, .sublist_item:hover {background-color: #f45c2d;transition: background-color .1s}
            .sublist span {display: flex;padding: 3px;font-size: 12px;font-weight: 700;background-color: rgba(50, 50, 50, .85);border-top: #8884 1px solid;border-left: #8882 1px solid;border-right: #8882 1px solid}
            .sublist span:first-child {border-left: #888 2px solid}
            .sublist span:nth-child(3), .sublist span:nth-child(4), .sublist span:nth-child(5) {border-top: #888 2px solid}
            .sublist span:last-child {border-top-right-radius: 27px;border-right: #888 2px solid}
            .sublist_item span {display: flex;padding: 2px 5px;font-size: 12px;justify-content: start;border-top: #8884 1px solid;border-left: #8882 1px solid;border-right: #8882 1px solid;cursor: pointer}
            .sublist_item span:nth-child(3) {font-family: monospace;white-space: nowrap;font-size: 12px}
            .clickable {padding: 10px;font-size: 20px}
            .clickable:hover {border-radius: 5px;transition: all 50ms;background-color: rgba(244, 92, 45, .7)}
            .editsublist {z-index: 40;text-align: left;white-space: normal;padding: 0 20px}
            .add, .delete {display: inline-block}
            .delete {background: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDQ0OCA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ0OCA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCiAgICA8cGF0aCBmaWxsPSIjZjMzIiBkPSJNNDAwIDMySDQ4QzIxLjUgMzIgMCA1My41IDAgODB2MzUyYzAgMjYuNSAyMS41IDQ4IDQ4IDQ4aDM1MmMyNi41IDAgNDgtMjEuNSA0OC00OFY4MGMwLTI2LjUtMjEuNS00OC00OC00OHpNOTIgMjk2Yy02LjYgMC0xMi01LjQtMTItMTJ2LTU2YzAtNi42IDUuNC0xMiAxMi0xMmgyNjRjNi42IDAgMTIgNS40IDEyIDEydjU2YzAgNi42LTUuNCAxMi0xMiAxMkg5MnoiLz4NCjwvc3ZnPg0K) center/16px no-repeat}
            .add {background: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDQ0OCA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ0OCA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCiAgICA8cGF0aCBmaWxsPSIjM2Y5IiBkPSJNNDAwIDMySDQ4QzIxLjUgMzIgMCA1My41IDAgODB2MzUyYzAgMjYuNSAyMS41IDQ4IDQ4IDQ4aDM1MmMyNi41IDAgNDgtMjEuNSA0OC00OFY4MGMwLTI2LjUtMjEuNS00OC00OC00OHptLTMyIDI1MmMwIDYuNi01LjQgMTItMTIgMTJoLTkydjkyYzAgNi42LTUuNCAxMi0xMiAxMmgtNTZjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOTJIOTJjLTYuNiAwLTEyLTUuNC0xMi0xMnYtNTZjMC02LjYgNS40LTEyIDEyLTEyaDkydi05MmMwLTYuNiA1LjQtMTIgMTItMTJoNTZjNi42IDAgMTIgNS40IDEyIDEydjkyaDkyYzYuNiAwIDEyIDUuNCAxMiAxMnY1NnoiLz4NCjwvc3ZnPg0K) center/16px no-repeat}
            .hidden {display: none}
            .highlighted {background-color: #f22d}
            .edit {justify-content: center}
        </style>
    </head>
    <body>`,

        // THE CODE THAT MAKES THE ADDING AND EDITING OF ITEMS WORK
        windowContentBottom: `
        <!--add-->
        <script>
            var $ = window.parent.jQuery;
            window.scrollBody = function(a) {
                    document.documentElement.scrollTop = a;
            }
            function edit(a,b,c){
                window.parent.Rec.frameScrollTop = document.documentElement.scrollTop;
                if (window.parent.Rec.isEditable) a.parentNode.classList.add("active");
                window.parent.Rec.editSub(b,c,a);
            }
            function add(a,b){
                window.parent.Rec.frameScrollTop = document.documentElement.scrollTop;
                window.parent.Rec.addItem(a,b);
            }
            function del(a,b){
                window.parent.Rec.frameScrollTop = document.documentElement.scrollTop;
                window.parent.Rec.delWholeShape = document.getElementById("deleteWholeShape").checked ? 1 : 0;
                if (b) window.parent.Rec.del(a,b);
                else window.parent.Rec.del(a);
            }
            function showSublist(){
                window.parent.Rec.activateSublist(this);
                [].forEach.call(document.querySelectorAll(".deleteWholeShape"), function(e){
                    e.checked = window.parent.Rec.delWholeShape;
                });
            }
            function delWholeShape(a){
                window.parent.Rec.delWholeShape = a.checked ? 1 : 0;
                [].forEach.call(document.querySelectorAll(".deleteWholeShape"), function(e){
                    e.checked = a.checked;
                });
            }
            function updateClickables(){
                [].forEach.call(document.querySelectorAll(".clickable"), function(e){
                    e.removeEventListener("click", showSublist);
                    e.addEventListener("click", showSublist);
                });
            }
            document.addEventListener("keydown", function(e){window.parent.Keys.handle(e);});
            setTimeout(function() {
                [].forEach.call(document.querySelectorAll(".deleteWholeShape"), function(e){
                    e.checked = window.parent.Rec.delWholeShape;
                });
            }, 1000);
        </script>
    </body>
</html>`
    },

/*************************  END OF TEMPLATES  *************************/


    test: function (expression) {

        // USER CODE IS EXECUTED IN AN IFRAME TO CHECK IF IT IS VALID CODE

        const result = frames.jsframe.checkJs(expression);
        return result;
    },

    toolsDiv: ".tools",

    unhighlightContent: function() {

        // FOR ORIENTATION THE CURRENTLY ACTIVE ITEM OF A RECORDING IS HIGHLIGHTED.
        // HERE THE HIGHLIGHTING IS REMOVED IF NEEDED
        try {
            [].forEach.call(eframe.document.querySelectorAll(".sublist_item.active"), a => a.classList.remove("active"));
        } catch (err) {}
    },

    upload: function(log, off, decode) {

        // LOAD A RECLOG FILE FROM HD OR LOAD THE DEMO LOG ON STARTUP)

        if (log) return this.addRecord(log, off, decode);
        let file = document.getElementById(Rec.uploadFile).files[0];
        if (!file) return document.getElementById(Rec.uploadFile).click();
        let reader = new FileReader();
        reader.readAsText(file);
        reader.addEventListener("load", function () {
            let log;
            try {
                log = JSON.parse(atob(reader.result));
            } catch(e) {
                try {
                    log = JSON.parse(reader.result);
                } catch(e) {
                    try {
                        log = eval(reader.result);
                    } catch(e) {}
                }
            }
            if (log.recLog) {
                let size = JSON.parse(log.recLog[0][0][2]);
                let x = size.xcursor;
                let y = size.ycursor;
                if (typeof x !== "number" || typeof y !== "number") return Rec.out(str.invalidFileFormat, 1);
                Rec.addRecord(log);
            } else return Rec.out(str.invalidFileFormat, 1);
        });
    },

    uploadFile: "recinput",

    usePresets: 0,

    usePreview: 0,

    useTools: 1,

    watchInput: function (form) {

        // WATCH OUT FOR CHANGES OF THE SELECT BOX AND FOR EMPTY DIV'S

        form ? (
            [].forEach.call(document.querySelectorAll(form.indexOf("edit") > -1 ? ".editcontent" : ".content"), a => {
                a.tagName === "DIV" ? a.textContent : a.value && a.classList.remove("line_small");
            }),
            document.forms[form].addEventListener("input", Rec.styleFormOnInput)
        ) : (
            [].forEach.call(document.forms, a => a.removeEventListener("input", Rec.styleFormOnInput))
        );
    },

    watchItemChange: function (a) {

        // ADD OR REMOVE EVENT LISTENER IN MODAL WINDOWS WHEN CHANGING THE 'NEW ITEM' OPTION OF THE SELECT BOX

        document.getElementById("newitem") && (
            document.getElementById("newitem").removeEventListener("change", Rec.changeNewItem),
            a && document.getElementById("newitem").addEventListener("change", Rec.changeNewItem)
        );
    }
};
