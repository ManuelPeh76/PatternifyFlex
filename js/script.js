/*jshint esversion:10, -W030, -W033, -W061, -W083, -W084 */

/**************************************************
 **                                              **
 **              PATTERNIFY FLEX                 **
 **  __________________________________________  **
 **      Original Version by Sascha Greif        **
 **       Enhancements to "FLEX" version         **
 **       (c) 2020/21 by Manuel Pelzer           **
 ** ___________________________________________  **
 **  script.js                                   **
 **************************************************/


/**************************************
 **     DECLARE GLOBAL VARIABLES     **
 **************************************/

// DOM ELEMENTS
const
    autoBackup          = get("#auto-backup"),
    autoRestore         = get("#auto-restore"),
    previewTab          = get("#previewTab"),
    codeTab             = get("#codeTab"),
    previewContainer    = get("#preview-container"),
    codeContainer       = get("#code-container"),
    container           = get("#container"),
    code                = get("#code"),
    colorPreview        = get(".color-preview"),
    controlCanvas       = get("#control-canvas"),
    drawText            = get("#draw-text"),
    fwd                 = get("#fwd"),
    textArea            = get("#text-area"),
    textInfo            = get("#text-info"),
    textSize            = get("#text-size"),
    toolContainer       = get("#tool-container"),
    base64Code          = get("#base64-code"),
    codeHead            = get("#code-head"),
    codeTop             = get(".code-top"),
    codeBottom          = get(".code-bottom"),
    colorpicker         = get("#colorpicker"),
    copyCode            = get("#copy-code"),
    downloadPNG         = get("#download-png"),
    menu                = get(".menu_icon"),
    editContent         = get("#editcontent"),
    fixedMessage        = get("#fixed-message"),
    flashMsg            = get("#flash-message"),
    imgInput            = get("#imginput"),
    imgLoad             = get("#imgload"),
    imgHeight           = get("#imgheight"),
    imgWidth            = get("#imgwidth"),
    opacity             = get("#opacity"),
    original            = get("#original"),
    textPin             = get("#textPin"),
    toolPin             = get("#toolPin"),
    tresholdHtml        = get(".treshold"),
    drawOptions         = get(".draw-options"),
    drawOptionsContainer= get(".draw-options-container"),
    previewCanvas       = get("#preview-canvas"),
    infoLink            = get("#info-link"),
    helpLink            = get("#help-link"),
    keysLink            = get("#keys-link"),
    recordLink          = get("#record-link"),
    recorder            = get(".recorder"),
    removeCopy          = get("#remove"),
    resize              = get("#resize"),
    resizeMatrix        = get("#resize-matrix"),
    resizeSubmit        = get("#resize-submit"),
    rew                 = get("#rew"),
    saveMatrix          = get("#savematrix"),
    sizeHeight          = get("#sizeheight"),
    sizeWidth           = get("#sizewidth"),
    copyItems           = get("#copyItems"),
    gradient            = get("#gradient"),
    minimize            = get(".minimize"),
	//sessionButton		= get("#online-session"),
    //sessionButtonB	    = get("#start-session-button"),
    isTouch = "ontouchstart" in document,
    mouseDown = isTouch ? "touchstart" : "mousedown",
    mouseMove = isTouch ? "touchmove" : "mousemove",
    mouseUp = isTouch ? "touchend" : "mouseup",
// HTML CONTENT
    codeBottomHtml = [codeBottom.innerHTML, "&nbsp<br />&nbsp;<br />"],
    codeTopHtml = [codeTop.innerHTML, "&nbsp<br />&nbsp;<br />"],

// OBJECTS
    // GREYSCALE COLORS USED FOR SHAPE PREVIEW (WHILE DRAWING) TO ENSURE THAT THE PREVIEW PIXELS ARE ALWAYS VISIBLE
    colors = ["000", "111", "222", "333", "444", "555", "666", "777", "888", "999", "aaa", "bbb", "ccc", "ddd", "eee", "fff"],
    defaultDrawObject   = { from: 0, to: 0, a: 0, b: 0, c: 0, next: 0, build: 0, eraser: 0, finish: 0, filled: 0, polygon: [], backToZero: 0 },

    callOnEsc = [ // ON ESC KEY PRESS WE WALK THROUGH THIS ARRAY (STEP 2),UNTIL WE FIND A TRUE STATEMENT (AND EXECUTE THE FOLLOWING ONE)
        () => document.querySelector("#keyTable .key").classList.contains("listening"),
        () => Keys.toggleEditKeys(),
        () => Rec.temp.edit.active,
        () => Rec.cancelAddItem(),
        () => toolIsMinimized,
        () => $("footer").slideDown(400, () => autoMinimize = 0, clickMinimize()),
        () => Rec.isPlay,
        () => {Rec.stop(); setTimeout(() => (Rec.stop(), messageId && message()), 400);},
        () => Rec.isRec,
        () => Rec.stopRec(),
        () => getComputedStyle(get("#modal-wrapper")).display !== "none",
        () => {Rec.unhighlightContent(); !copyObject.pasteActive && toolAction(modes[previousMode]); getComputedStyle(get("#copyItems")).display !== "none" && copyObject.cancel(3); closeModal(); get("#reccontent form").tagName && setTimeout(() => get("#reccontent").innerHTML = "", 400);},
        () => getComputedStyle(get("#editcontent")).display !== "none",
        () => $("#editcontent").hide(),
        () => !!clone.m,
        () => {clone.reset(); toolAction(modes[previousMode]);},
        () => copyObject.isNewText,
        () => {copyObject.isNewText = 0; copyObject.array.pop(); copyObject.arrayPointer = copyObject.array.length - 1; copyObject.cancel(3); toolAction(modes[previousMode]);},
        () => !!drawObject.from,
        () => {let e = [drawObject.filled,drawObject.eraser]; drawObject = cloneObject(defaultDrawObject); drawObject.filled = e[0]; drawObject.eraser=e[1]; toolAction(modes[mode]);},
        () => !matrixIsEmpty(copyObject.matrix),
        () => {copyObject.cancel(3); toolAction(modes[previousMode]);temp.previousMode=0;},
        () => Rec.temp.edit.active,
        () => Rec.addItemSpecial(),
        () => !!inputFieldInUse,
        () => {get(`#${inputFieldInUse}`).blur(); inputFieldInUse = 0;},
        () => Keys.listener !== Keys.listeners.prevent,
        () => Keys.prevent(),
        () => infoIsOpen,
        () => slideArea(),
        () => getComputedStyle(previewTab).display !== "none" && getComputedStyle(previewContainer).display !== "none",
        () => togglePreviewContainer,
        () => getComputedStyle(codeTab).display !== "none" && getComputedStyle(codeContainer).display !== "none",
        () => toggleCodeContainer(),
        () => drawCursorIsVisible,
        () => {drawCursorIsVisible=0; clear("move");},
        () => getComputedStyle(get("#text-area")).display !== "none",
        () => toolAction("text")
    ],
    eframe = window.frames.editcontent, // IFRAME HOLDING THE RECORDED DATA TO EDIT THEM
    inputField = ["sizewidth", "sizeheight", "base64-code", "imgwidth", "imgheight", "colorpicker", "opacity", "draw-text"],
    inputTagList = ["INPUT", "TEXTAREA"],
    // AVAILABLE MODES
    modes = ["undo","pencil","eraser","eyedropper","line","line","rectangle","rectangle","ellipse","ellipse","move","parallelogram","parallelogram","parallelogram","polygon","polygon","fileload","getmatrix","rotate","text","change-color","clear-color","color-bw","clone","clone","clone","change-color_ctx","color-area","clear-area","clear-color_ctx","fill","clear","picker", "redo"],
    useLocalStorage = !!window.localStorage, // AVAILABILITY OF LOCAL STORAGE
	useCookies =  navigator.cookieEnabled; // AVAILABILITY OF COOKIES

var actionNumber = 0,           // COUNTER FOR THE UNDO FUNCTION
    activePixel = {},           // CURRENT DRAW POSITION
    areaX,                      // WIDTH OF THE GRID IN PIXEL
    areaY,                      // HEIGHT OF THE GRID IN PIXEL
    autoMinimize = 0,           // IS SET WHEN THE TOOL MINIMIZES ITSELF
    canMinimize = 1,            // WHEN 0, THE MINIMIZE BUTTON IS SWITCHED OFF, TO PREVENT FROM STYLE ERRORS WHEN MAXIMIZING AGAIN TO EARLY
    codeHeadline = str.codeHeadline,
    color = {},                      // DRAW COLOR AND OPACITY
    colorChangeMode = "area",   // YOU CAN DECIDE BETWEEN 'REPLACE THIS SPECIFIC COLOR ON THE WHOLE GRID' (color) OR 'FILL ONLY THIS CONTIGUOUS AREA' (area)
    ctxt,                       // CONTEXT OF THE TEXT CANVAS
    defaultX = 24,              // DEFAULT SIZE OF THE GRID
    defaultY = 24,              // DEFAULT SIZE OF THE GRID
    drawCursorIsVisible = 0,    // FLAG
    drawObject = cloneObject(defaultDrawObject), // HOLDING ALL DATA FOR DRAWING LINES, RECTANGLES AND SO ON....
    fileInputIsOpen = 0,        // FLAG
    global_zIndex = 10,         // FOR OVERLAPPING ELEMENTS
    gridCanvas,                 // DRAW AREA
    helpIsOpen = 0,             // FLAG
    holdKey = 0,                // HOLDS THE PRESSED KEY FOR NOT RESIZING WHEN USING PATTERNS FROM THE PRESETS
    idle = Date.now(),          // IDLELINE : HOLDS THE TIME SINCE LAST USER ACTION
    idleTime = 300000,          // IDLELINE: SETS HOW LONG IT TAKES TO SET THE WIDTH OF THE IDLELINE TO 100% WHEN THE TOOL IS OPEN
    imageInfo = {},             // HOLDS INFORMATION FOR LOADED IMAGES
    infoIsOpen = 0,             // FLAG
    inputFieldInUse = 0,        // CURRENTLY USED INPUT FIELD (NEEDED FOR KEY INPUT)
    isDblClick = 0,             // EXTENDS DOUBLEKLICK FUNCTIONALITY TO THE SPACEBAR
    isMinimized = 0,            // FLAG
    isOpenedEyes = 0,           // PREVENTS THE COUNTER (THAT OPENS THE EYES) FROM COUNTING ON, WHILE THE EYES ARE OPEN :)
    isRunning = 0,              // PREVENTS FROM CALLING THE GRID SETUP FUNCTION WHILE IT IS STILL RUNNING
    isScrolling = 0,            // WHEN SET (BY SCREEN SCROLL FUNCTION), THE SCREEN SCROLL FUNCTION CAN NOT BE CALLED AGAIN TO AVOID FUNNY THINGS TO HAPPEN
    keepAlpha = 0,              // DECIDES IF THE ALPHA CHANNEL IS OVERWRITTEN WHEN FILLING AN AREA
    keysIsOpen = 0,             // AREA STATUS
    keyActions = [],			// TABLE THAT CONTAINS ALL KEY ASSIGNMENTS (IS CREATED INSIDE THE SETUP FUNCTION)
    keysListen = 0,				// FLAG TO SHOW THAT THE KEY-ASSIGN-MODE IS ON
    listenToNewKey = 0,			// FLAG FOR ASSIGNING A NEW KEY TO AN ACTION
    log = [],                   // UNDO / REDO ACTIONS
    logPointer = -1,            // CURRENT POSITION OF THE LOG ENTRIES
    matrix = [],                // COLOR AND OPACITY DATA OF ALL PIXELS OF THE GRID
    messageId = 0,              // IS SET IF A MESSAGE OPENS ON THE SCREEN
    messageIsOpen = 0,          // FLAG
    mode = 1,                   // CURRENT DRAW MODE
    mouseIsDown,                // FLAG TO DRAW CONTINOUSLY
    mouse = {},                 // ALWAYS HOLDS THE MOUSE POSITION
    moveCanvas,                 // CANVAS ELEMENT TO DISPLAY THE CURSOR POSITION AND DRAW PREVIEWS
    patcanvas,                  // CANVAS ELEMENT TO HOLD THE PATTERN
    patcontext,                 //    "
    pixelHeight,                // HEIGHT OF ONE "GRID PIXEL"
    pixelWidth,                 // WIDTH OF ONE "GRID PIXEL"
    pixelsX,                    // AMOUNT OF GRID PIXELS IN X DIRECTION
    pixelsY,                    // AMOUNT OF GRID PIXELS IN Y DIRECTION
    position = {},              // VISUALISATION OF CURRENT PIXEL POSITION
    pressedKey = 0,             // ASCII CODE OF THE PRESSED KEY
    previousMode = 1,           // REMEMBER MODE IN CASE OF CANCEL, EYEDROPPER OR UNDO
    recordIsOpen = 0,           // AREA STATUS
    scrollX = 0,                // IMPORTANT FOR THE AUTO SCROLL IN BIG GRIDS OR IF THE GRID IS ZOOMED
    scrollY = 0,                //  "
    //$ession,					// ONLINE SESSION OBJECT
    shortIdleTime = 30000,      // IDLELINE: SETS HOW LONG IT TAKES TO SET THE WIDTH OF THE IDLELINE TO 100% WHEN THE TOOL IS MINIMIZED
    //onlineSession = 0,			// FLAG IS SET WHEN ONLINE SESSION IS IN PROGRESS
    temp = {},                  // MULTI PURPOSE OBJECT FOR TEMPORARILY USED VARIABLES
    textCanvas,                 // CANVAS ELEMENT TO PREVIEW TEXT
    toolIsMinimized = 0,        // FLAG
    treshold = 5,               // PRECISION OF COLOR VALUE WHEN CHANGING COLORS IN THE WHOLE GRID
    useBase64Code = 1,          // IF 0, DISPLAYING OF CODE IS STOPPED, TO USE THE BOX TO WRITE TEXT WHEN RECORDING / PLAYBACK
    workMatrix,                 // USED TO HOLD THE MATRIX DATA TO RESIZE THE GRID
    xcursor,                    // GRID X LIMIT
    ycursor;                    // GRID Y LIMIT


/***************************************
 **      EVENT HANDLER CALLBACKS      **
 ***************************************/
const clickCursors = e => {
    if (Rec.isPlay) return;
    log.length && log[log.length - 1][0] !== 3 && actionNumber++;
    let index = parseInt(e.target.textContent);
    let ul = e.target.closest("ul").classList.contains("cols");
    setCursors(ul ? index : xcursor, ul ? ycursor : index);
},

gridMouseDown = e => {
    isTouch && e.preventDefault();
    if (Rec.isPlay || (mode === 10 && !copyObject.pasteActive && matrixIsEmpty()) || e.button) return;
    (mode === 15 || mode === 25) && (
        isDblClick ? drawObject.finish = 1 : (
            isDblClick = 1,
            setTimeout(() => isDblClick = 0, 500),
            drawObject.next = 1
        )
    );
    // INCREMENT THE ACTIONNUMBER FOR EVERY CLICK
    // USED TO GROUP ALL THE ACTIONS DONE IN ONE CLICK TOGETHER IN THE LOGS
    [5, 7, 9, 10, 12, 13, 15, 20, 21, 22, 23, 24, 25].indexOf(mode) === -1 && actionNumber++;
    let c = getCursorCoordinates();
    let m = matrix[c.xc][c.yc];
    position = c;
    activePixel.x = c.xc;
    activePixel.y = c.yc;
    // IF WE ARE CURRENTLY IN DRAWING MODE, BUT ARE STARTING FROM A TILE
    // THAT IS THE SAME COLOR AS THE ACTIVE COLOR,
    // SWITCH TO ERASING MODE UNTIL THE NEXT MOUSEUP
    mode === 1 && !copyObject.copyActive && m[0] == color.r && m[1] == color.g && m[2] == color.b && (
        toolAction("eraser"),
        addEventListenerOnce(moveCanvas, mouseUp , () => toolAction("pencil"))
    );
    // EYEDROPPER MODE IS TEMPORARY AND SWITCHES BACK AUTOMATICALLY
    mode === 3 && addEventListenerOnce(this, mouseUp , () => toolAction(modes[previousMode]));
    // START DRAWING THE PREVIEW OF LINE, RECTANGLE, ELLIPSE, POLYGON AND PARALLELOGRAM
    [4, 6, 8, 11, 14, 23].indexOf(mode) > -1 && drawPosition(e, (Rec.isRec ? "rec" : 0));
    // FINISH THE PREVIEW AND SET "FINISH", TO DRAW THEM FINALLY
    [5, 7, 9, 13].indexOf(mode) > -1 && (drawObject.finish = 1);
    // POLYGON AND PARALLELOGRAM ONLY: START OF THE PREVIEW IS DONE, GO TO "NEXT" PREVIEW DRAWING STEP
    [12, 15, 24].indexOf(mode) > -1 && (drawObject.next = 1);
    // BEFORE WE MOVE THE GRID AROUND OR CHANGE ANY COLORS, WE SAVE IT TO GO BACK USING THE "UNDO" FUNCTION
    mode !== 10 && doAction();
    mouseIsDown = 1;
},

gridMouseMove = e => {
    isTouch && e.preventDefault();
    let c = getCursorCoordinates();
    if (Rec.isPlay || (activePixel.x1 === c.xc && activePixel.y1 === c.yc) || (c.xc >= xcursor || c.yc >= ycursor)) return;
    position = c;
    activePixel.x1 = c.xc;
    activePixel.y1 = c.yc;

    // DRAW THE CURSOR POSITION IF IN KEYBOARD MODE
    drawCursorIsVisible && drawPosition(e, 0, 1);
    // DRAW THE SHAPES AND HOLD THE ACTIVE AREA IN VIEW IN CASE OF LARGE GRIDS OR WINDOWED VIEW
    (mouseIsDown || [5, 7, 9, 12, 13, 15, 24].indexOf(mode) > -1) && doAction();
    scrollGrid(e);
},

gridMouseUp = e => {
    isTouch && e.preventDefault();
    [5, 7, 9, 13].indexOf(mode) > -1 ? (drawObject.finish = 1, doAction()) :
    (mode === 12 || mode === 15) && (drawObject.next = 1);
    mouseIsDown = 0;
},

updateSavedCopies = () => {
    if (Rec.isPlay || (!useLocalStorage && !useCookies)) return;
    let b__up;
    (b__up = copyObject.loadCopyArray()) && (
        b__up.constructor === Array && (
            copyObject.array = [],
            b__up.forEach(arr => arr.length && copyObject.array.push(optimizeMatrix(arr)))
        ), copyObject.arrayPointer = copyObject.array.length - 1
    );
    get(".board").textContent = `${str.board}: ${copyObject.array.length} ${str.element}${copyObject.array.length === 1 ? "" : str.elementPlural}`;
},

handleFocusOnInput = e => {
    // SWITCH OFF KEY CAPTURING, IF AN INPUT FIELD IS FOCUSED, IN ORDER TO NOT EXECUTE A KEY BOUND FUNCTION,
    // BUT TO WRITE THE TEXT INTO THE INPUT FIELD
    Keys.on();
    if (!((Rec.temp.edit.active && Rec.temp.edit.mode === 11) || Rec.isRec) || Rec.isPlay) return;
	// THE NEXT PART IS EXECUTED ONLY WHEN RECORDING IS ACTIVE
	let pre, target = window.event ? window.event.target : e;
    inputFieldInUse = typeof target === "string" ? target.substring(1) : target.id;
    if (typeof target === "string") pre = target[0] === "#" ? "~id~" : target[0] === "." ? "~class~" : target[0];
    else pre = "~id~";
    target.value && Rec[(Rec.isRec ? "rec" : "collect")](11, [inputField.indexOf(inputFieldInUse), target.value]);
	Rec[(Rec.isRec ? "rec" : "collect")](5, [pre + inputFieldInUse, /*onlineSession ? "css(\"backgroundColor\", \"#ff9\")" :*/ "focus()"]);
},

handleBlurOnInput = e => {
    // SWITCH THE KEY CAPTURING BACK TO "ON", IF AN INPUT FIELD HAS LOST FOCUS
    Keys.prevent();
    //if (onlineSession) $ession.updateSessionGrid();
    if (!((Rec.temp.edit.active && Rec.temp.edit.mode === 11) || Rec.isRec) || Rec.isPlay) return;
	// THE NEXT PART IS EXECUTED ONLY WHEN RECORDING IS ACTIVE
    let pre, target = window.event ? window.event.target : e;
    inputFieldInUse = typeof target === "string" ? target.substring(1) : target.id;
    if (typeof target === "string") pre = target[0] === "#" ? "~id~" : target[0] === "." ? "~class~" : target[0];
    else pre = "~id~";
	Rec[(Rec.isRec ? "rec" : "collect")](5, [pre + inputFieldInUse, /*onlineSession ? "css(\"backgroundColor\", \"\")" : */"blur()"]);
    Rec.temp.edit.mode === 11 && Rec.addItemSpecial();
    inputFieldInUse = 0;
},

recordInput = e => {
    return ((Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 11)) && e.target.type !== "checkbox" && e.target.type !== "file") ?
        (Rec[(Rec.isRec ? "rec" : "collect")](11, [inputField.indexOf(inputFieldInUse), e.target.value])) : false;
},

blurOpacity = e => {
    if (Rec.isPlay) return;
    let val = parseInt(e.target.value).toString();
    (parseInt(val) < 0 || parseInt(val) > 100 || val === "NaN") && (opacity.value = val = 100);
    moveSlider(val);
    colorPreview.style.opacity = parseFloat((val/100).toFixed(2));
},

changeChecked = e => Rec.isRec && Rec.rec(5, ["~id~" + e.target.id, "prop('checked', "+ (e.target.checked ? 1 : 0) + ")"]),

docMouseup = () => Rec.isPlay || (mouseIsDown = 0),

docMousedown = e => {
    if (Rec.isPlay || e.button || (get(".alert-backdrop").tagName === "DIV" && getComputedStyle(get(".alert-backdrop")).display === "flex")) return;
    if (document.body.classList.contains("modal-open")) {
        if (e.target.classList.contains("modal-wrapper") || e.target.id === "modal")
            return (
                offset(get("#copyItems")).left !== 0 && (
                    message(),
                    !copyObject.pasteActive && (
                        copyObject.cancel(3),
                        toolAction(modes[previousMode])
                    )
                ),
                Rec.unhighlightContent(),
                closeModal(),
                setTimeout(() => {
                    document.getElementById(Rec.recContent).innerHTML = "";
					update.queue.push("log", "tools", "contextmenu");
                }, 400)
            );
    } else if (
        getComputedStyle(editContent).display !== "none" && (
            "BODYHTML".indexOf(e.target.tagName) > -1 || (
                e.target.id !== "editcontent" &&
                e.target.parentElement?.id !== "editcontent"
            )
        )
    ) return Rec.hideContent();
},

idleLine = {
    time: 0,
    line: null,
    create: (time) => {
        time && (idleLine.time = time);
        idleLine.line = document.createElement("div");
        idleLine.line.id = "idleline";
        idleLine.line.style.position = "fixed";
        idleLine.line.style.bottom = 0;
        idleLine.line.style.left = 0;
        idleLine.line.style.height = "2px";
        idleLine.line.style.borderTop = "1px #000 solid";
        idleLine.line.style.borderRight = "2px #f93 solid";
        idleLine.line.style.backgroundColor = "#ff0";
        idleLine.line.style.width = 0;
        idleLine.time ? (
            idleLine.line.style.transition =  `width ${idleLine.time}ms linear 0s`,
            idleLine.line.style.width = "100vw"
        ) : idleLine.line.style.width = 0;
        document.body.appendChild(idleLine.line);
    },
    hide: () => {
        if (!idleLine.line) idleLine.create();
        idleLine.line.style.opacity = 0;
    },
    show: () => {
        if (!idleLine.line) idleLine.create();
        idleLine.line.style.opacity = 1;
    },
    set: (time) => {
        if (!time) return;
        idleLine.time = time;
        idleLine.reset();
    },
    reset: () => {
        if (!idleLine.time) return;
        idleLine.line.style.transition = "";
        idleLine.line.style.width = 0;
        setTimeout(() => {
            idleLine.line.style.transition = `width ${idleLine.time}ms linear 0s`;
            idleLine.line.style.width = "100vw";
        }, 10);
    }
},

clickMinimize = () => {
    if ((Rec.isPlay && !Rec.byRec) || Rec.temp.edit.active || !canMinimize) return;
    canMinimize = 0;
    Rec.isRec && Rec.rec(5, ["~class~minimize", "click()"]);
    (copyObject.copyActive || copyObject.pasteActive) && copyObject.cancel(3);
    toolIsMinimized ? (
        idleLine.set(parseInt(_GET("idletime") || idleTime)),
        container.style.width = "",
        $("footer").slideDown(400, () => {
            $("#funstuff").slideUp(400, () => {
                $(".col1").slideDown(500, () => {
					//$(sessionButton).show(400);
                    $(".col2").slideDown(500);
                    minimize.classList.replace("mini_max", "mini_min");
                    minimize.title = str.minimize;
                    idleLine.show();
                    idle = Date.now();
                    autoMinimize = 0;
                    isOpenedEyes = 0;
                    temp.editContentIsOpen && (
                        $(editContent).show(400),
                        temp.editContentIsOpen = 0
                    );
                });
            });
        })
    ) : (
        time = autoMinimize ? 1000 : parseInt(_GET("shortidletime") || shortIdleTime),
        idleLine.set(time),
        getComputedStyle(editContent).display !== "none" && (temp.editContentIsOpen = 1),
        $(editContent).hide(400, () => {
			//$(sessionButton).hide(400);
            $(".col2").slideUp(500, () => {
                $(".col1").slideUp(500, () => slideArea());
                minimize.classList.replace("mini_min", "mini_max");
                minimize.title = str.restore;
            });
        }),

        isMinimized && clearTimeout(isMinimized),
        isMinimized = setTimeout(() => {
            toolIsMinimized && (
                isOpenedEyes = 1,
                idleLine.hide(),
                [].forEach.call(get(".funstuff div"), a => a.classList.add("opened_eye")),
                $("#funstuff").slideDown((time === 1000 ? 500 : 3000), () => $("footer").slideUp(400, () => container.style.width = "450px")),
                get("#left-eye").style.transform = "translate(50px, 50px)",
                get("#right-eye").style.transform = "translate(50px, 50px)",
                lookAround(),
                twinkle()
            );
        }, time)
    );
    setTimeout(() => canMinimize = 1, 2000);
    toolIsMinimized = !toolIsMinimized;
},

clickInfoLink = () => {
    Rec.temp.edit.active ? slideArea((infoIsOpen ? "" : "info")) :
    Rec.isPlay ? slideArea((recordIsOpen ? "" : "record")) : slideArea("info");
},

clickHelpLink = () => (Rec.isPlay || Rec.temp.edit.active) || slideArea("help"),

clickKeysLink = () => (Rec.isPlay || Rec.temp.edit.active) || slideArea("keys"),

clickRecordLink = () => (Rec.isPlay || Rec.temp.edit.active) || slideArea("record"),

copyCssCode = () => !Rec.temp.edit.active && Rec.isRec ? (Rec.rec(5, ["~id~copy-code", "click()"])) : (!Rec.isPlay || Rec.byRec) && (copyContent(), Rec.byRec = 0),

mouseOverB64CopyCode = () => Rec.isPlay || (copyCode.style.cursor = base64Code.style.cursor = (base64Code.value === "") ? "default" : "pointer"),

clickBase64Code = () => (Rec.isPlay || (Rec.isRec /*&& !onlineSession*/)) || (Rec.temp.edit.active && Rec.temp.edit.mode === 2) ? ( Rec.collect(2, [JSON.stringify(getMatrix())]), Rec.addItemSpecial() ) : copyContent(),

changeImgInput = () => {
    if (Rec.isPlay || Rec.temp.edit.active || !imgInput.files) return;
    let reader = new FileReader();
    reader.readAsDataURL(imgInput.files[0]);
    reader.addEventListener("load", () => {
        let img = document.createElement("img");
		img.src = reader.result;
        img.addEventListener("load", () => {
            imgWidth.placeholder = img.width;
            imgHeight.placeholder = img.height;
        });
    });
},

downloadPng = () => {
    if (Rec.temp.edit.active || matrixIsEmpty()) return;
    let image = "", i = 0,
        url = patcanvas.toDataURL("image/png"),
        a = document.createElement("a");
    Rec.isPlay ? image = "fake_image.png" : (
        typeof a.download !== "undefined" ? (
            image = imageInfo.name || (() => {let image = "", i; for (i = 0; i < 9; i++) image += i < 8 ? String.fromCharCode(rnd(97, 122)) : ".png"; return image;})(image),
            a.href = url,
            a.download = image,
            a.click()
        ) : window.location.href = url
    );
    flashMessage(str.savedAs + " '" + image + "'");
    Rec.isRec && Rec.rec(5, ["~id~download-png", "click()"]);
},

maxImageSize = img => {
    if (!img.width || !img.height) return false;
    let iw, ih, size = {...img},
        maxArea = 67108864, //268435456,
        maxWidth = Math.floor(8192 / pixelWidth),
        maxHeight = Math.floor(8192 / pixelHeight), factor;
    size.keepOriginal ? (
        iw = size.width, ih = size.height
    ) : (
        size.xVal || size.yVal ? (
            iw = size.xVal, ih = size.yVal
        ) : size.xAlt || size.yAlt ? (
            iw = size.xAlt, ih = size.yAlt
        ) : (
            iw = size.width, ih = size.height
        )
    );
    iw && (iw = parseInt(iw));
    ih && (ih = parseInt(ih));
    iw || (iw = size.width / size.height * ih);
    ih || (ih = size.height / size.width * iw);
    size.width = iw;
    size.height = ih;
    if (size.width * size.height < 4) return (flashMessage(str.wrongImageSize), false);
    size.width * pixelWidth * size.height * pixelHeight > maxArea && (
        factor = Math.sqrt(maxArea / (size.width * size.height)),
        size.height = Math.floor(size.height * factor / pixelHeight),
        size.width = Math.floor(size.width * factor / pixelWidth)
    );
    size.width > maxWidth && (
        size.height = Math.floor(size.height / size.width * maxWidth),
        size.width = maxWidth
    );
    size.height > maxHeight && (
        size.width = Math.floor(size.width / size.height * maxHeight),
        size.height = maxHeight
    );
    return {width: size.width, height: size.height};
},

// LOAD AN IMAGE FILE INTO THE EDITOR
loadImage = () => {
    if (Rec.isPlay || !imgInput.files) return;
    setTimeout(() => imgLoad.blur(), 500);
    let image = imgInput.files[0],
        reader = new FileReader();
    typeof image === "object" && reader.readAsDataURL(image);
    reader.addEventListener("load", () => {
        if (reader.result.indexOf("image") === -1) return (imgInput.value = "", flashMessage(str.fileIsNoImage));
        let img = document.createElement("img");
        img.src = reader.result;
        closeModal();
        img.addEventListener("load", () => {
            let i = maxImageSize({width: img.width, height: img.height, xVal: imgWidth.value, yVal: imgHeight.value, xAlt: imgWidth.placeholder, yAlt: imgHeight.placeholder, keepOriginal: original.checked});
            img.width = imgWidth.placeholder = i.width;
            img.height = imgHeight.placeholder = i.height;
            fileInputIsOpen = 0;
            image2Matrix(0, img);
        });
    });
},

focusColorpicker = () => temp.colorpicker = colorpicker.value,

blurColorpicker = () => {
    let i = 0, hex = colorpicker.value, rgb = {} ,l = hex.length;
    for (i = 0; i < l; i++) if ("1234567890abcdefABCDEF".indexOf(hex[i]) === -1) break;
    if (i < l || [3,4,6,8].indexOf(l) === -1) return (colorpicker.value = temp.colorpicker);
    ["r", "g", "b"].forEach((e, index) => rgb[e] = parseInt(l===3 || l===4 ? `${hex[index]}${hex[index]}` : `${hex[index * 2]}${hex[index * 2 + 1]}`, 16));
    rgb.a = parseFloat(l === 4 || l === 8 ?
        (parseInt((l === 4 ? `${hex[3]}${hex[3]}` : `${hex[6]}${hex[7]}`), 16) / 255).toFixed(2) :
        ((opacity.value || 100) * 0.01).toFixed(2)
    );
    colorSubmit(rgb);
},

usePattern = e => {
    if (Rec.isPlay || e.target.innerText.indexOf("rec") > -1) return;
    (copyObject.copyActive || copyObject.pasteActive) && copyObject.cancel(3);
    let grid = JSON.parse(e.target.innerText);
    let action = {
        actionNumber: ++actionNumber,
        matrix: [...matrix],
        newmatrix: [...grid.matrix],
        xcursor,
        ycursor,
        newxcursor: grid.xcursor,
        newycursor: grid.ycursor
    };
    Rec.isRec && Rec.rec(2, [JSON.stringify(grid)]);
    clear("grid");
    (grid.pixelsX > 9 || grid.pixelsY >9) && (holdKey !== 16 || (grid.pixelsX > pixelsX || grid.pixelsY > pixelsY)) ? resizeGrid(grid) :
    (logAction(2, JSON.stringify(action)), loadGrid(grid, 1));
    holdKey = 0;
	update.queue.push("tools", "contextmenu");
},

useTools = e => Rec.isPlay || toolAction(e.target.id || e.target.closest("button").id),

useCopyObject = e => Rec.isPlay || copyAction(e.target.id || e.target.closest("button").id),

useRecContext = e => {
    let action = e.target.closest("button").id;
    switch (action) {
        case "rec_play": Rec.play(); break;
        case "rec_rec" : Rec.startRec(); break;
        case "rec_stop": Rec.isRec ? Rec.stopRec() : (Rec.stop(), setTimeout(() => Rec.stop(), 100)); break;
        case "rec_edit": Rec.showContent(); break;
    }
},

useLangContext = e => {
    document.location.hash = "lang=" + e.target.closest("button").id;
},

colorSubmit = col => {  // COLOR PICKER & OPACITY
    let hex, rgb = (typeof col === "object" && col.hasOwnProperty("_ok")) ?
        { r: col._r, g: col._g, b: col._b, a: col._a } :
        col ? inputToRgb(col) : color, colorField = $(".color-preview").spectrum;
    typeof rgb.a !== "number" && (rgb.a = opacity.value * 0.01);
    delete rgb.ok; delete rgb._ok;
    for (e in rgb) rgb[e] = e === "a" ? parseFloat((parseInt(rgb[e] * 100) * 0.01).toFixed(2)) : parseInt(rgb[e]);
    hex = rgbToHex(rgb);
    Rec.isPlay && $(".color-preview").spectrum("set", rgb);
    color = rgb;
    colorpicker.value = hex;
    colorPreview.style.backgroundColor = "#" + hex;
    colorPreview.style.opacity = rgb.a;
    moveSlider(rgb.a * 100);
    get("#sp-container").style.display !== "none" && $(".color-preview").spectrum("set", color);
    (Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 9)) && Rec[(Rec.isRec ? "rec" : "collect")](9, Object.values(rgb));
    Rec.temp.edit.active && Rec.temp.edit.mode === 10 && Rec.collect(10, [rgb.a * 100]);
},

scrollWindow = () => {
    scrollX = body().scrollLeft;
    scrollY = body().scrollTop;
},

updateVisibility = () => {
    getComputedStyle(toolContainer).position !== "fixed" ? (
        $(".opacity").show(),
        toolContainer.classList.remove("unhide-tool-container"),
        textArea.classList.remove("unhide-text-area"),
        textPin.classList = toolPin.classList = "hidden unpinned"
    ) : (
        !toolContainer.classList.contains("unhide-tool-container") && (
            $(".opacity").hide(),
            toolPin.classList = "hidden unpinned"
        ),
        !textArea.classList.contains("unhide-text-area") && (textPin.classList = "hidden unpinned")
    );
},

toggleContent = function() {
    const hidden = getComputedStyle(this.nextElementSibling).display === "none";
    $(this.nextElementSibling)[hidden ? "slideDown" : "slideUp"](),
    this.id && this.id === "keys-settings" && $("#keySaveInfo")[hidden ? "slideUp" : "slideDown"]();
},

checkHashAndUrlVars = () => {

    let cursors, x, y, _GET_ = _GET_All();

    if (_GET_.color) {
        temp.color = color;
        color = translateColor(_GET_.color);
        color.ok ? colorSubmit() : color = temp.color;
        temp.color = 0;
    }

    if (useLocalStorage || useCookies) {
        _GET_.destroybackup && destroyBackup();
        _GET_.destroykeys && destroyKeys();
    }

    if (_GET_.cursors) {
        try {
            cursors = (_GET_.cursors.split("[")[1].split("]")[0].split(",")).map(e => parseInt(e));
        } catch (err) {}
    }

    _GET_.xcursor && (x = parseInt(_GET_.xcursor));

    _GET_.ycursor && (y = parseInt(_GET_.ycursor));

    _GET_.size || _GET_.width || _GET_.height || _GET_.matrix && setupGrid();

    (cursors || x || y) && setTimeout(() => setCursors(
        Math.min((cursors ? cursors[0] : x ? x : xcursor), pixelsX),
        Math.min((cursors ? cursors[1] : y ? y : ycursor), pixelsY)), 100
    );

    if (_GET_.lang) {
        const lang = _GET_.lang;

        if (language.hasOwnProperty(lang)) {
            language.active = lang;
            str = language[lang];
            [].forEach.call(get("[data-value]"), e => e.tagName === "INPUT" ? e.value = str[e.dataset.value] : e.innerHTML = str[e.dataset.value]);
            [].forEach.call(get("[title]"), e => e.getAttribute("org_title") && (e.title = str[e.getAttribute("org_title")]));
            [].forEach.call(get(".tooltip"), e => {
                e.dataset.tooltip = str[e.getAttribute("org_title")];
                e.title = "";
            });
            Rec.addSpecialMessage = str.addSpecialMessage;
            Rec.toolList = str.toolList;
            Rec.commandList = str.commandList;
            Rec.directions = str.directions;
            Rec.items = str.recItems;
            Rec.inputFields = str.inputFields;
            Rec.modes = str.modes;
            Rec.toolList = str.toolList;
            Rec.edit = 1;
            Rec.createContent();
            Rec.showRecInfo();
            minimize.title = str.minimize;
            codeHeadline = str.codeHeadline;
            document.getElementsByClassName("playbackspeed")[0].innerHTML = `${str.playback} - ${str.speed}`;
            Keys.activate();
            updateSavedCopies();
            setTimeout(activateContent, 200);
        }
    }

    if (_GET_.idleTime) {
        idleTime = parseInt(_GET_.idleTime);
        idle = Date.now();
        !toolIsMinimized && (idleLine.time = idleTime, idleLine.reset());
    }

    if (_GET_.shortIdleTime) {
        shortIdleTime = parseInt(_GET_.shortIdleTime);
        idle = Date.now();
        toolIsMinimized && (idleLine.time = shortIdleTime, idleLine.reset());
    }
},
/****** END EVENT HANDLER CALLBACKS ******/



/****************************
 ***     FUNCTIONS        ***
 ****************************/

// BACKUP SAVES THE CURRENT STATE OF THE TOOL, SO YOU CAN CLOSE THE BROWSER AND WORK ON LATER
backup = e => {
    save("autoBackup", autoBackup.checked);
    save("autoRestore", autoRestore.checked);
    if (e && !autoBackup.checked) return true;
    let tool = get(".tools .active"), isOpen = [];
    tool = (typeof tool.length === "number" ? tool[0] : tool).childNodes[0].id;
    [helpIsOpen, recordIsOpen, keysIsOpen, infoIsOpen].forEach(e => isOpen.push(e ? 1 : 0));
	copyObject.pasteActive && temp.matrix && (pixelsX = temp.x, pixelsY = temp.y, xcursor = temp.xc, ycursor = temp.yc, matrix = temp.matrix);
	matrix.length = pixelsX;
	for(let i = 0; i < pixelsX; i++) matrix[i].length = pixelsY;
	xcursor = Math.min(xcursor, pixelsX);
	ycursor = Math.min(ycursor, pixelsY);
    let ok = save("b_up", {
		isOpen, drawCursorIsVisible, actionNumber, logPointer, previousMode, tool,
		scrollX, scrollY, keepAlpha, color, position, temp, drawObject, log,
		workMatrix: {matrix, pixelsX, pixelsY, xcursor, ycursor},
		pasteActive: copyObject.pasteActive,
		opacity: parseInt(opacity.value),
        isEditable: Rec.isEditable,
        editContent: getComputedStyle(editContent).display === "none" ? 0 : 1,
        textArea: getComputedStyle(textArea).display,
        textFont: get(".record-radio:checked").id,
        drawText: drawText.value,
        gradient: gradient.checked,
        textSize: textSize.value,
		recLog: Rec.recLog
    });
    !matrixIsEmpty(copyObject.array) && copyObject.saveCopyArray();
    return ok;
},

// RESTORES A PREVIOUSLY SAVED BACKUP
restore = e => {
    let aBackup = load("autoBackup"),
        aRestore = load("autoRestore"), b_up;
    autoBackup.checked = aBackup   || 0;
    autoRestore.checked = aRestore  || 0;
    updateSavedCopies();
    if (!autoRestore.checked) return;
    try {
        (b_up = load("b_up")) && (
            {drawCursorIsVisible, actionNumber, log, logPointer, color, drawObject, position, previousMode, keepAlpha, workMatrix} = b_up,
            colorSubmit(),
            Rec.recLog = b_up.recLog,
            Rec.isEditable = b_up.isEditable || 1,
            keepalpha.checked = b_up.keepAlpha,
            gradient.checked = b_up.gradient,
            setTimeout(() => {
                updateTextArea("draw-text", b_up.drawText);
                updateTextArea("font", get(`#${b_up.textFont}`).value);
                updateTextArea("size", b_up.textSize);
                get("#text").closest("span").classList[b_up.textArea === "block" ? "add" : "remove"]("active");
                textArea.style.display = b_up.textArea;
                (b_up.scrollX || b_up.scrollY) && window.scrollTo({left: b_up.scrollX, top: b_up.scrollY,  behavior: "smooth"});
                Rec.recLog && (Rec.edit = 1, Rec.listRecords(), Rec.createContent());
                b_up.editContent && Rec.isEditable && Rec.showContent();
            }, 200)
        );
        setupGrid();
        return true;
	} catch (err) {
        return false;
    }
},

// DELETES A PREVIOUSLY SAVED BACKUP
destroyBackup = () => remove("b_up") && remove("b__up") ? true : false,

destroyKeys = () => remove("customKeys"),

// SETS UP THE BASE64 TEXTAREA FOR SHOWING THE BASE64 CODE, THE MATRIX OR THE LZW ENCODED MATRIX
codeBoxShows = content => {
    if (Rec.isPlay) return;
    let index = (content === "base64") ? 0 : (content === "matrix") ? 1 : 2,
    outerIndex = (index === 0) ? 0 : 1,
    val = index === 0 ? patcanvas.toDataURL("image/png") : (index === 1) ? JSON.stringify(getMatrix()) : encodeGrid(0, 1);
    get("#getmatrix").closest("li").dataset.tooltip = codeHeadline[2][index];
    codeHead.textContent = codeHeadline[0][index];
    copyCode.textContent = codeHeadline[1][index];
    codeTop.innerHTML = codeTopHtml[outerIndex];
    codeBottom.innerHTML = codeBottomHtml[outerIndex];
    base64Code.value = val;
},

// SHOWS OR HIDES RESIZE, INFO, RECORD AND KEYACTIONS AREA
slideArea = (area, showResize, noRec, byRec) => {
    if (toolIsMinimized && !infoIsOpen) return;
    area = toolIsMinimized ? "" : Rec.temp.edit.active ? area ? "info" : "" :
    Rec.isPlay ? area ? byRec ? area : "record" : "" : area;
    !noRec && Rec.isRec && Rec.rec(14, [area || 0, showResize? 1:0, infoIsOpen? 1:0, helpIsOpen? 1:0, keysIsOpen? 1:0, recordIsOpen? 1:0]);
    if(!area || (area === "info" && infoIsOpen)) return (
        $("#info").slideUp(400, () => {
            (temp.scrollX || temp.scrollY) && window.scrollTo({left: temp.scrollX || 0, top: temp.scrollY || 0, behavior: "smooth"});
            temp.scrollX = temp.scrollY = 0;
            document.querySelector("#keyTable .key").classList.contains("listening") && Keys.toggleEditKeys();
        }),
        get(".menu_icon").classList.remove("is-active"),
        infoIsOpen = helpIsOpen = keysIsOpen = recordIsOpen = 0
    );
    window[area + "IsOpen"] = !window[area + "IsOpen"];
    let open =  window[area + "IsOpen"],
    	slide = get(".slide"),
    	slideLink = get(".slidelink.highlighted"), focus;
    showResize && (recordIsOpen = keysIsOpen = helpIsOpen = area = open = 0);
    open && (
        (area === "info" ? area = helpIsOpen ? "help" : keysIsOpen ? "keys" : recordIsOpen ? "record" : area :
			infoIsOpen = 1, recordIsOpen = keysIsOpen = helpIsOpen = 0, window[area + "IsOpen"] = open),
        temp.scrollX = scrollX,
        temp.scrollY = scrollY,
        focus = area
    );
    menu.classList[infoIsOpen ? "add" : "remove"]("is-active");
    menu.title = infoIsOpen ? str.closeMenu : str.openMenu;
    $("#info").slideUp(400, () => {
        document.querySelector("#keyTable .key").classList.contains("listening") && Keys.toggleEditKeys();
        [].forEach.call(slide, item => item.style.display = "none");
        slideLink && slideLink.classList && slideLink.classList.remove("highlighted");
        area !== "info" ? open ? (
			get(`#${area}-link`).classList.add("highlighted"),
			get(`#${area}`).style.display = "block"
		) : resize.style.display = "block" : open && (resize.style.display = "block");
        (area !== "info" || open) && (
			temp.scrollX || (temp.scrollX = scrollX),
			temp.scrollY || (temp.scrollY = scrollY),
			window.scrollTo({left: 0, top: 0, behavior: "smooth"}),
			$("#info").slideDown()
		);
    });

},

flashMessage = msg => {
    //if (onlineSession) return;
    flashMsg.textContent = msg;
    $(".flash").slideDown(400, () => setTimeout(() => $(".flash").slideUp(400, () => flashMsg.textContent = ""), 4000));
},

fixMessage = (msg, ms = 4000) => {
    fixedMessage.innerHTML = msg;
    temp.fixTimeout ? clearTimeout(temp.fixTimeout) : $(fixedMessage).show(400);
    temp.fixTimeout = setTimeout(() => {
        $(fixedMessage).hide(400, () => (fixedMessage.innerHTML = "", temp.fixTimeout = 0));
    }, ms);
},

closeModal = () => {
    Rec.isRec && Rec.rec(15, [10, "closeModal()"]);
    $("#modal-wrapper").slideUp(200, () => {
        get("#modal").style.display = "none";
        get("#modal-overlay").style.display = "none";
        document.body.classList.remove("modal-open");
        [].forEach.call(get(".modal"), a => a.style.display = "none");
    });

},

openModal = (modal, content, focus) => {
    Rec.isRec && Rec.rec(15, [10, "openModal('" + modal + (content ? "','" + content + "'" : "'") + ")"]);
    [].forEach.call(get(".modal"), a => a.style.display = "none");
    if (content) get(`#${modal}`).innerHTML = content;
    get("#modal").style.display = "block";
    get(`#${modal}`).style.display = "block";
    get("#modal-overlay").style.display = "block";
    $("#modal-wrapper").slideDown(400, () => focus !== "auto" && (
		focus = get(focus),
		focus ? focus.length ? focus[0].focus() : focus.focus() : document.body.focus()
	));
    document.body.classList.add("modal-open");

},

copyContent = (from, msg) => {
	//if (onlineSession) return;
    let origin = from ? get(`#${from}`) : base64Code,
        original = origin.value;
    if (original !== "") {
        let text = original.indexOf("image") > -1 ? "background: url('" + original + "') repeat;" : original;
        origin.value = text;
        origin.focus();
        origin.select();
        if (!Rec.isRec && !Rec.isPlay) document.execCommand("copy");
        origin.value = original;
        origin.blur();
        text = original.indexOf("image") > -1 ? "Base64-Code " : msg ? msg + " " : "Matrix ";
        text += str.copiedToClipboard;
        flashMessage(text);
        return document.execCommand("paste");
    }
},

// CUSTOMIZES THE BASE64 CODE FIELD
setBase64Field = o => {
    o.codeHead !== undefined && (codeHead.textContent = o.codeHead);
    o.buttonVisible === 1 ? $("#copy-code").slideDown() : $("#copy-code").slideUp();
    o.codeTopHtml !== undefined && (codeTop.innerHTML = o.codeTopHtml);
    o.codeBottomHtml !== undefined && (codeBottom.innerHTML = o.codeBottomHtml);
    o.content !== undefined && (base64Code.value = o.content);
    o.readonly !== undefined && (base64Code.readOnly = o.readonly);
    typeof o.css === "object" && (base64Code.style[o.css.var] = o.css.val);
},

// SHOWS OR HIDES THE COLORPICKER
showUp = show => {
    get("#sp-container").classList.remove(show ? "slip-out" : "slip-in");
    get("#sp-container").classList.add(show ? "slip-in" : "slip-out");
},

// SETS OPACITY BY KEYPRESS
setOpacity = key => {
    let o = opacity.value;
    key === "opacityUp" && o < 100 && o++;
    key === "opacityDown" && o > 0 && o--;
    moveSlider(o);
    color.a = o * 0.01;
    colorPreview.style.opacity = color.a;
    $(".color-preview").spectrum("set", color);
},

// MOVE OPACITY SLIDER
moveSlider = val => {
    opacity.value = parseInt(val);
    $("#slider").slider("value", val);
},

// STYLES THE MOUSE CURSOR DEPENDING ON CHOSEN TOOL
styleCursor = style => get("#grid-frame").classList = style + "_hover",

// CALCULATES THE POSITION OF THE MOUSE CURSOR
getCursorCoordinates = (elem) => {
    let off = offset(elem || moveCanvas),
        cx = mouse.x,
        cy = mouse.y,
        x = Math.floor(cx + body().scrollLeft - off.left  - 1),
        y = Math.floor(cy + body().scrollTop - off.top  - 1);
    return { xc: (x - x % pixelWidth) / pixelWidth, yc: (y - y % pixelHeight) / pixelHeight, x: x + off.left, y: y + off.top};
},

// CALCULATES THE POSITION OF THE DRAW CURSOR
getDrawCursorCoords = e => {
    e = e || position;
    if (e.constructor !== Object) return;
    let off = offset(moveCanvas),
        x = Math.floor(e.xc * pixelWidth + body().scrollLeft + off.left - scrollX - 1),
        y = Math.floor(e.yc * pixelHeight + body().scrollTop + off.top - scrollY - 1);
    return { xc: e.xc , yc: e.yc, x: x, y: y };
},

setCursors = (x, y, nolog) => {
    if (!/[0-9]+/.test(`${x}${y}`)) return;
    if (x > pixelsX || y > pixelsY) return (
        x === xcursor && (xcursor = pixelsX),
        y === ycursor && (ycursor = pixelsY)
    );
	const [rmask, bmask] = [get(".rightmask"), get(".bottommask")];
    [x, y] = [x || xcursor, y || ycursor];
	if (rmask.clientWidth === areaX - x * pixelWidth && bmask.clientHeight === areaY - y * pixelHeight) return;
	for(let e of get(".cursors .selected")) e.classList.remove("selected");
	get(`.cols li:nth-child(${x})`).classList.add("selected");
	get(`.rows li:nth-child(${y})`).classList.add("selected");
	bmask.style.width = `${x * pixelWidth}px`;
	bmask.style.height = `${areaY - y * pixelHeight}px`;
	rmask.style.width = `${areaX - x * pixelWidth}px`;
	nolog || (
		!Rec.isPlay && !Rec.temp.edit.active && logAction(3, JSON.stringify({actionNumber: ++actionNumber, xcursor, ycursor, newxcursor: x, newycursor: y})),
		(Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 3)) && (
			Rec[Rec.isRec ? "rec" : "collect"](3, [x, y]),
			Rec.temp.edit.mode === 3 && Rec.temp.recLog.length === 2 && Rec.addItemSpecial()
		)
	);
	[xcursor, ycursor] = [x, y];
	redrawPreview();
};


var clear = canvas => {
    let c = get(`#${canvas}-canvas`);
    c.width = c.width;
},

redrawPreview = () => {
    if ((Rec.isPlay && !Rec.usePreview) || !patcanvas) return;
    if (matrixIsEmpty()) return (clear("preview"), base64Code.value = "");
    patcanvas.width = xcursor;
    patcanvas.height = ycursor;
    let i, j;
    for (i = 0; i < xcursor; i++) {
        for (j = 0; j < ycursor; j++) {
            matrix[i] && matrix[i][j] && (
                patcontext.fillStyle = `rgba(${matrix[i][j].join(",")})`,
                patcontext.fillRect(i, j, 1, 1)
            );
        }
    }
    clear("preview");
    let ctx = previewCanvas.getContext("2d");
    ctx.rect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.fillStyle = ctx.createPattern(patcanvas, "repeat");
    ctx.fill();
    Rec.isPlay || updateBase64Code();
},

updateBase64Code = () => {
	//if (onlineSession) return;
    Rec.temp.edit.active && Rec.temp.edit.mode === 2 ? codeBoxShows("matrix") :
    !Rec.isRec && !Rec.isPlay && useBase64Code && (!matrixIsEmpty() ? codeBoxShows("base64") : base64Code.value = "");
    imageInfo.size && !matrixIsEmpty() ? get("#image-info").innerHTML = `<b><u>${imageInfo.name}</u></b><br />${imageInfo.width} x ${imageInfo.height} Pixel (${imageInfo.type}, ${imageInfo.size} Byte)` :
    get("#image-info").innerHTML = "";
},

//     CREATE INLINE CSS
//     (A SIMPLE WAY TO ADAPT SIZES DEPENDING UPON WINDOW SIZE)
// ------------------------------------------------------------------

// CREATE STYLESHEET
createInlineCSS = () => {
    let bottommaskWidth = areaX - pixelWidth * Math.floor(pixelsX/2),
        bottommaskHeight = areaY - pixelHeight * Math.floor(pixelsY/2),
        differenceX = areaX < 480 ? 480 : areaX,
        rightmaskWidth = bottommaskWidth,
        basic = 35 + differenceX,
    createCSS = css => {
        let style = "", i = 0;
        while (i < css.length){
            style += (css[i+1] !== "") ? css[i] + (css[i] === "" ? "\t" : " {\n\t") + css[i+1] + ": " + css[i+2] + ";" + (css[i+3] === "" ? "\n" : "\n}\n") : (css[i-3] === "") ? "\n}\n" : "";
            i += 3;
        }
        return style;
    },
    css = [".frame", "width", (390 + basic) + "px", ":root", "--col1Only", (basic + 15) + "px", "#container", "width", (390 + basic) + "px", ".col1", "width", (basic + 15) + "px", "#grid-frame", "width", areaX + "px", "", "height", areaY + "px", "#grid .cols li", "width", pixelWidth + "px", "", "left", (pixelWidth + 20) + "px", "#grid .rows li", "height", pixelHeight + "px", "", "top", (pixelHeight + 20) + "px", ".rightmask", "width", rightmaskWidth + "px", ".bottommask", "width", bottommaskWidth + "px", "", "height", bottommaskHeight + "px", "#main", "background", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbsAAAAbCAIAAABqYLYTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGVJREFUeNrs1DEBAAAIwzDAv939PAhAQCKhRztJAfAwEgA4JoBjAjgmgGMCOCaAYwLgmACOCeCYAI4J4JgAjgmAYwI4JoBjAjgmgGMCOCaAYwLgmACOCeCYAI4J4JgAjgnAWQEGACdiAxUirdl5AAAAAElFTkSuQmCC) " + (basic + 15) + "px 0 repeat-y", "#message", "top", (get("#frame").clientHeight - 50) + "px"],
    css_media = [
        "@media(max-width:" + (basic + 400) + "px)",
        [".code-top, .code-bottom, .recorder, .col2 hr", "display", "none !important","#img-info", "display", "none",".text-control h4", "top", "-17px","", "left", "3px",".color h4", "position", "relative","", "top", "-2px","", "left", "-5px",".text-area", "height", "205px","", "position", "fixed","", "padding", "0","", "margin", "0","", "background-color", "#f5f5f5","", "border", "#444 1px solid","", "border-radius", "8px","", "opacity", ".5","", "bottom", "-183px","", "right", "unset","", "left", "195px","", "width", "60px","", "cursor", "pointer","", "z-index", "11",".tool-container", "position", "fixed","", "padding", "5px 0 0","", "height", "max-content","", "left", "0","", "border", "#444 1px solid","", "border-radius", "8px","", "background-color", "#f5f5f5","", "opacity", ".5","", "top", "calc(100% - 24px)","", "width", "60px","", "cursor", "pointer","", "z-index", "10",".preview-container", "transition", "all 400ms","", "position", "fixed","", "top", "0","", "right", "0","", "padding", "5px 10px","", "margin", "0 0 0 10px","", "display", "none","#preview, #preview-canvas", "width", "323px","", "height", "136px",".code-container", "position", "fixed","", "top", "0","", "left", "0","", "padding", "5px 10px","", "margin", "0 0 0 10px","", "background-color", "transparent","", "display", "none", "#previewTab, #codeTab", "display", "block", "#container, #frame", "width", "var(--col1Only) !important", "#container", "transition", "all 700ms", "", "width", "var(--col1Only) !important", ".code", "transition", "all 400ms", "", "background-color", "transparent","", "height", "136px", "footer", "font-size", "12px"],
        "@media(min-width:" + (basic + 401) + "px)",
        ["#container", "transition", "all 700ms",".code-top, .code-bottom, #preview-container, #tool-container, #code-container, .col2 hr", "transition", "all 400ms","", "opacity", "1","#img-info", "display", "block",".text-area", "opacity", "1","", "width", "auto","", "left", "unset","", "right", "unset","", "bottom", "unset","", "width", "unset !important","", "cursor", "default","", "box-sizing", "unset",".tool-container", "opacity", "1","", "min-width", "450px","", "top", "unset","", "display", "flex","", "flex-direction", "column","", "align-items", "center",".preview-container", "display", "block !important",".code-container", "display", "block !important","", "transition", "all 400ms","#toolPin, #textPin, #previewTab, #codeTab", "display", "none",".code", "transition", "all 400ms","", "background-color", "#e4e4e4","", "height", "220px"],
        [".unhide-text-area", "opacity", "1","", "left", "unset","", "right", "0","", "bottom", "0","", "width", "340px","", "box-sizing", "content-box","", "cursor", "default",".unhide-tool-container", "opacity", "1","", "top", "unset","", "bottom", "23px","", "width", "530px","", "cursor", "default"]
    ];
    // IN CASE OF ODD COUNT OF COLS OR ROWS, THE RIGHTMASK STARTPOSITION NEEDS ADJUSTMENT
    bottommaskWidth * 2 !== areaX && (rightmaskWidth -= pixelWidth);

    return (createCSS(css) + css_media[0] + " {\n" + createCSS(css_media[1]) + "}\n" + css_media[2] + " {\n" + createCSS(css_media[3]) + "}\n" + createCSS(css_media[4]));
},

/************************************
 *****         MATRIX           *****
 ************************************/

// CREATES A MATRIX FROM AN IMAGE
image2Matrix = (canvas, img, getback) => {
    if (!img) return;
    canvas = canvas || document.createElement("canvas");
    let ctx = canvas.getContext("2d"), {width, height} = img;
    [canvas.width, canvas.height] = [width, height];
    img.data ? ctx.putImageData(img, 0, 0) : ctx.drawImage(img, 0, 0, width, height);
    let imgData = ctx.getImageData(0, 0, width, height),
        id = imgData.data, iw = imgData.width, ih = imgData.height,
        x, y, z, grid = {}, newmatrix = [];
    for (x = 0; x < Math.max(iw, pixelsX); x++) {
        newmatrix[x] = [];
        for (y = 0; y < Math.max(ih, pixelsY); y++) newmatrix[x][y] = x >= iw || y >= ih ? 0 : id[(z = (iw * y + x) * 4) + 3] > 0 ? [id[z++], id[z++], id[z++], parseFloat((Math.floor(id[z] / 2.55) * 0.01).toFixed(2))] : 0;
    }
    grid = {matrix: newmatrix, xcursor: iw, ycursor: ih, pixelsX: Math.max(pixelsX, iw), pixelsY: Math.max(pixelsY, ih)};
    if (getback) return grid;
    Rec.isRec && Rec.rec(17, [JSON.stringify(grid)]);
    logAction(4, JSON.stringify({
        actionNumber: ++actionNumber,
        matrix: [...matrix],
        newmatrix: [...grid.matrix],
        xcursor: xcursor,
        ycursor: ycursor,
        newxcursor: grid.xcursor,
        newycursor: grid.ycursor,
        pixelsX: pixelsX,
        pixelsY: pixelsY,
        newpixelsX: grid.pixelsX,
        newpixelsY: grid.pixelsY
    }));
    workMatrix = grid;
    setupGrid();
},

// MERGES TWO MATRICES
addMatrixToMatrix = (matrix1, matrix2) => {
    if (!matrix1 || !matrix2) return;
    (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) && ([matrix1, matrix2] = adaptMatrixSize(matrix1, matrix2));
    let canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        w = matrix1.length,
        h = matrix1[0].length,
        x, y, z, newmatrix = [];
    canvas.width = w;
    canvas.height = h;
    for (x = 0; x < w; x++) {
        for (y = 0; y < h; y++) {
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
        id = imgData.data,
        iw = imgData.width,
        ih = imgData.height;
    for (x = 0; x < iw; x++) {
        newmatrix[x] = [];
        for (y = 0; y < ih; y++) {
            z = (iw * y + x) * 4;
            newmatrix[x][y] = id[z+3] ? [id[z], id[z+1], id[z+2], parseFloat((Math.floor(id[z+3] / 2.55) * 0.01).toFixed(2))] : 0;
        }
    }
    return newmatrix;
},

// ADAPTS THE SIZE OF A MATRIX TO FIT INTO THE GRID
adaptMatrixSize = (matrix1, matrix2) => {
    let x, y, type = 1;
    !matrix2 && (matrix2 = resetMatrix(), type = 0);
    for (x = 0; x < Math.max(matrix1.length, matrix2.length); x++) {
        !matrix1[x] && (matrix1[x] = []);
        !matrix2[x] && (matrix2[x] = []);
        for (y = 0; y < Math.max(matrix1[x].length, matrix2[x].length); y++) {
            !matrix1[x][y] && (matrix1[x][y] = 0);
            !matrix2[x][y] && (matrix2[x][y] = 0);
        }
    }
    return type ? [matrix1, matrix2] : matrix1;
},

isInRange = (x, y) => x.xc >= 0 && x.xc <= xcursor - 1 && x.yc >= 0 && x.yc <= ycursor - 1,

// CUTS OFF EMPTY BORDERS OUT OF A MATRIX
optimizeMatrix = matrix1 => {
    if (!matrix1 && !copyObject.matrix) return;
    !matrix1 && (matrix1 = copyObject.matrix);
    let x, y, width, height, startX, startY, endX, endY;
    startX = width = matrix1.length;
    startY = height = matrix1[0].length;
    endX = endY = 0;
    for (x = 0; x < width; x++) {
        for (y =0; y < height; y++) {
            typeof matrix1[x][y] === "object" && matrix1[x][y][3] > 0 && (
                startX = Math.min(startX, x),
                  endX = Math.max(  endX, x),
                startY = Math.min(startY, y),
                  endY = Math.max(  endY, y)
            );
        }
    }
    matrix1 = matrix1.slice(startX, endX + 1);
    matrix1.forEach((e, c) => matrix1[c] = matrix1[c].slice(startY, endY + 1));
    return matrix1;
},

// ROTATES THE MATRIX 90 DEG COUNTERCLOCKWISE
rotateMatrix = (matrix1, back) => {
    matrix1 = matrix1 || [...matrix];
    if (matrixIsEmpty(matrix1)) return;
    let i, j, x = matrix1.length, y = matrix1[0].length, newmatrix = [];
    for (j = 0; j < y; j++){
        newmatrix[j] = [];
        for (i = 0; i < x; i++) newmatrix[j][i] = 0;
    }
    for (j = 0; j < y; j++) for (i = 0; i < x; i++) newmatrix[y-j-1][i] = matrix1[i][j];
    if (back) return newmatrix;
    let grid = { matrix: [...newmatrix], pixelsX: y, pixelsY: x, xcursor: y, ycursor: x };
    logAction(4, JSON.stringify({
        actionNumber: ++actionNumber,
        matrix: [...matrix1],
        newmatrix: [...grid.matrix],
        pixelsX: pixelsX,
        pixelsY: pixelsY,
        xcursor: xcursor,
        ycursor: ycursor,
        newpixelsX: grid.pixelsX,
        newpixelsY: grid.pixelsY,
        newxcursor: grid.xcursor,
        newycursor: grid.ycursor
    }));
    workMatrix = grid;
    setupGrid();
},

resetMatrix = function() {
    let i, j, width, height, args = [...arguments],
    newMatrix = [];
    args.length === 1 && args[0].constructor === Array && args[0][0].constructor === Array ? (
        width = args[0].length,
        height = args[0][0].length
    ) : args.length === 2 ? (
        width = args[0],
        height = args[1]
    ) : (
        width = pixelsX,
        height = pixelsY
    );
    for (i = 0; i < width; i++) {
        newMatrix[i] = [];
        for (j = 0; j < height; j++) newMatrix[i][j] = 0;
    }
    return newMatrix;
},

updateMatrix = (grid, x, y) => {
    let i, j, newgrid;
    grid = grid || getMatrix();
    grid && grid.constructor === Array && grid.length && grid[0].length && (grid = {matrix: grid});
    newgrid = grid.matrix;
    matrix = resetMatrix(newgrid);
    x = x || newgrid.length;
    y = y || newgrid[0].length;
    for (i = 0; i < x; i++) {
        if (!newgrid[i]) continue;
        for (j = 0; j < y; j++) {
            if (!newgrid[i][j]) continue;
            matrix[i][j] = newgrid[i][j];
        }
    }
    refreshGrid();
},

stretchMatrix = (matrix, {xc: x, yc: y}) => {
    let xx = matrix.length, yy = matrix[0].length, newMatrix = [], x1, y1;
    for (i = 0; i < x; i++) {
        newMatrix[i] = [];
        for (j = 0; j < y; j++) newMatrix[i][j] = matrix[Math.floor(xx / x * i)][Math.floor(yy / y * j)];
    }
    return newMatrix;
},

getMatrix = () => {
    return Rec.temp.edit.submode === 9 ?
            { matrix: matrix, pixelsX: ycursor, pixelsY: ycursor, marquee: xcursor } :
            { matrix: matrix, xcursor: xcursor, ycursor: ycursor, pixelsX: pixelsX, pixelsY: pixelsY };
},

matrixIsEmpty = (matrix = window.matrix) => !matrix.flat().filter(e => e && e.constructor === Array).length,


/************************************
 *****          GRID            *****
 ************************************/

activateGrid = () => {
    [].forEach.call(get(".cursors a"), a => a.addEventListener("click", clickCursors));
    [].forEach.call(get(".rows a"), a => a.addEventListener("mousedown", e => updateTextArea("text-size", e.target.textContent)));
    let canvas = get("#move-canvas");
    canvas.addEventListener(mouseDown, gridMouseDown);
    canvas.addEventListener(mouseMove, gridMouseMove);
    canvas.addEventListener(mouseUp, gridMouseUp);
},

setupGrid = (start, resizeOnly) => {
    // IF SETUP IS CALLED BY A FUNCTION, BEFORE THE FIRST BASE SETUP HAS BEEN FINISHED, WE GET PROBLEMS
    // SO WE MAKE SURE, ALL CALLS ARE QUEUED, WHEN SETUP IS NOT READY
    if (!start && !isRunning) {
        typeof temp.workMatrix !== "object" && (temp.workMatrix = []);
        temp.workMatrix.push(workMatrix);
        !temp.gridQueue && (temp.gridQueue = setInterval(() => isRunning && (workMatrix = temp.workMatrix.shift(), temp.workMatrix.length === 0 && (clearInterval(temp.gridQueue), temp.gridQueue = 0), setupGrid()), 200));
        return;
    }
    isRunning = 0;
    let _GET_ = _GET_All();
    _GET_ && Object.keys(_GET_).forEach(e => _GET_[e] = decodeURIComponent(_GET_[e]));
    resizeOnly = resizeOnly || _GET_.resizeonly || null;
    let size = _GET_.size ? _GET_.size.split("[")[1].split("]")[0].split(",") : 0,
        cursors = _GET_.cursors ? _GET_.cursors.split("[")[1].split("]")[0].split(",") : 0,
        width = (size && typeof size === "object") ? parseInt(size[0]) : parseInt(_GET_.width),
        height = (size && typeof size === "object") ? parseInt(size[1]) : parseInt(_GET_.height),
        name, type;

    width && width < 2 && (width = 2);
    height && height < 2 && (height = 2);
    if (!start || start === 1) {
        try {
            !resizeOnly && (workMatrix = _GET_.matrix ? decodeGrid(_GET_.matrix) : workMatrix || 0);
        } catch (err) {}
        pixelsX = parseInt(workMatrix.pixelsX || get("#sizewidth").value || get("#sizewidth").placeholder || width || defaultX);
        pixelsY = parseInt(workMatrix.pixelsY || get("#sizeheight").value || get("#sizeheight").placeholder || height || defaultY);
        pixelWidth = pixelHeight = Math.min(Math.max(Math.floor(480 / pixelsX), 8), Math.max(Math.floor(480 / pixelsY), 8));
        areaX = pixelWidth * pixelsX;
        areaY = pixelHeight * pixelsY;
        xcursor = cursors.constructor === Array && cursors[0].match(/[0-9]/).length ? parseInt(cursors[0]) : _GET_.xcursor && _GET_.xcursor.match(/[0-9]/).length ? Math.abs(parseInt(_GET_.xcursor)) : 0;
        ycursor = cursors.constructor === Array && cursors[1].match(/[0-9]/).length ? parseInt(cursors[1]) : _GET_.ycursor && _GET_.ycursor.match(/[0-9]/).length ? Math.abs(parseInt(_GET_.ycursor)) : 0;
        !start && (
            xcursor = Math.min((workMatrix.xcursor ? parseInt(workMatrix.xcursor) : xcursor), pixelsX),
            ycursor = Math.min((workMatrix.ycursor ? parseInt(workMatrix.ycursor) : ycursor), pixelsY)
        );
    }
    start === 1 && (
        xcursor = xcursor ? Math.min(pixelsX, xcursor) : Math.max(Math.floor(pixelsX / 2 + 0.5), 1),
        ycursor = ycursor ? Math.min(pixelsY, ycursor) : Math.max(Math.floor(pixelsY / 2 + 0.5), 1)
    );
    if (!start || start === 2) {
        prepareGrid();
        matrix = resetMatrix();
        scrollGrid(1);
        activateGrid();
        position = getDrawCursorCoords({ xc: 0 , yc: 0 });
        !resizeOnly ? (
            workMatrix.recLog ? Rec.upload(workMatrix) : workMatrix.matrix ? (
                !workMatrix.xcursor && (workMatrix.xcursor = Math.min(workMatrix.pixelsX, workMatrix.matrix.length)),
                !workMatrix.ycursor && (workMatrix.ycursor = Math.min(workMatrix.pixelsY, workMatrix.matrix[0].length)),
                workMatrix.size && workMatrix.size != undefined && (
                    imageInfo.name = workMatrix.name,
                    imageInfo.size = workMatrix.size,
                    imageInfo.type = workMatrix.type,
                    imageInfo.width = workMatrix.xcursor,
                    imageInfo.height = workMatrix.ycursor
                ),
                imageInfo.name && imageInfo.name != undefined && (
                    name = imageInfo.name,
                    size = imageInfo.size,
                    type = imageInfo.type,
                    width = imageInfo.width,
                    height = imageInfo.height
                ),
                name && (get("#image-info").innerHTML = "<b><u>" + name + "</u></b><br /> " + width + " x " + height + " Pixel (" + type + ", " + size + " Byte)"),
                !Rec.isPlay && loadGrid(workMatrix, 1)
            ) : setTimeout(() => setCursors(xcursor, ycursor, 1), 0),
            !Rec.recLog.length && Rec.upload(demo.demo, 1),
            workMatrix = 0
        ) : setTimeout(() => setCursors(xcursor, ycursor, 1), 0);
        !copyObject.matrix && resetMatrix(copyObject.matrix = []);
        for (i = 0; i < pixelsX; i++) {
            !copyObject.matrix[i] && (copyObject.matrix[i] = []);
            for (j = 0; j < pixelsY; j++) !copyObject.matrix[i][j] && (copyObject.matrix[i][j] = 0);
            copyObject.matrix[i].length > pixelsY && (copyObject.matrix[i].length = pixelsY);
        }

        sizeWidth.value = sizeheight.value = imgwidth.value = imgheight.value = "";
        !resizeOnly && redrawPreview();
        !recordIsOpen && slideArea();
        document.body.focus();
        isDblClick = 0;
        isRunning = 1;
    }
    update.queue.push("log", "tools", "contextmenu");
},

resizeGrid = function(e) {
    e = e || { constructor: 0, type: 0, target: 0 };
    setTimeout(() => e.target && e.target.blur(), 500);
    let msg, grid = {}, width, height, resizeOnly = 0;
    if (e.type === "click" || e === "key") {
        slideArea(null, null, 1);
        width = parseInt(sizeWidth.value) || parseInt(sizeWidth.placeholder) || pixelsX;
        height = parseInt(sizeHeight.value) || parseInt(sizeHeight.placeholder) || pixelsY;
        if (width === pixelsX && height === pixelsY) return (sizeWidth.value = "", sizeHeight.value = "");
        if (height * width < 4) return flashMessage(str.minSizeIs4);
        let size = maxImageSize({width, height});
        [width, height]  = [size.width, size.height];
        sizeWidth.value = sizeHeight.value = "";
        [sizeWidth.placeholder, sizeHeight.placeholder] = [width, height];
        grid.matrix = saveMatrix.checked ? addMatrixToMatrix(resetMatrix(width, height), matrix) : resetMatrix(width, height);
        [grid.pixelsX, grid.pixelsY] = [width, height];
        [grid.xcursor, grid.ycursor] = [Math.min(grid.xcursor, width), Math.min(grid.ycursor, height)];
    } else if (e.constructor === Object && e.hasOwnProperty("matrix")) {
        grid = {...e};
        !grid.xcursor && (grid.xcursor = grid.pixelsX || grid.matrix.length);
        !grid.ycursor && (grid.ycursor = grid.pixelsY || grid.matrix[0].length);
        !grid.pixelsX && (grid.pixelsX = grid.xcursor || grid.matrix.length);
        !grid.pixelsY && (grid.pixelsY = grid.ycursor || grid.matrix[0].length);
        [width, height]  = [grid.pixelsX, grid.pixelsY];
    } else if (arguments.length === 2) {
        [width, height]  = [arguments[0], arguments[1]];
        grid = {matrix: "", xcursor: width, ycursor: height, pixelsX: width, pixelsY: height};
        resizeOnly=1;
    } else if (arguments.length === 3) {
        [width, height]  = [arguments[1], arguments[2]];
        grid  = {matrix: [...arguments[0]], pixelsX: width, pixelsY: height, xcursor: width, ycursor: height};
    }
    grid && (workMatrix = grid);
    !copyObject.pasteActive && logAction(4, JSON.stringify({
        actionNumber: ++actionNumber,
        matrix: [...matrix],
        newmatrix: [...grid ? grid.matrix : matrix],
        pixelsX, pixelsY, xcursor, ycursor,
        newpixelsX: grid.pixelsX,
        newpixelsY: grid.pixelsY,
        newxcursor: grid.xcursor,
        newycursor: grid.ycursor
    }));
    setupGrid();
    //if (onlineSession && e.drawId) return;
    Rec.isRec && Rec.rec(17, [workMatrix || {matrix: "", xcursor: width, ycursor: height, pixelsX: width, pixelsY: height}]);

},

prepareGrid = function() { // CALCULATE DYNAMIC ELEMENTS (GRID HTML, STYLE, CANVAS SIZE AND BACKGROUND, TOOLTIPS)
    let playground = "", i, style = "", cols = "", rows = "";

    // CLEAR HTML CONTENT (IN CASE THE PAGE WAS ALREADY LOADED AND THE GRID IS RESIZED)
    document.styleSheets.rules && [].forEach.call(document.styleSheets, a => a.ownerNode.id == "pat-style" && a.removeRule("*"));
    [".cols", ".rows", "#grid-frame", "#pat-style"].forEach(element => get(element).innerHTML = "");

    // TOOLTIPS
    if(get(".tooltip")[0].title){
        // DETECT IF THE SITE IS INITIALLY LOADED OR RESIZED,
        // INITIALLY LOADED -> APPLY ALL TOOLTIPS, RESIZED -> DO NOTHING (TOOLTIPS WERE ALREADY APPLIED BEFORE)
        [].forEach.call(get(".tooltip"), a => {
            a.dataset.tooltip = str[a.title];
            a.setAttribute("org_title", a.title);
            a.title = "";
        });
    }

    // CREATE STYLESHEET
    style = createInlineCSS();

    // CREATE HTML CONTENT FOR COLUMNS AND ROWS
    for (i = 1; i <= pixelsX; i++) cols += `<li${i === xcursor ? " class=\"selected\"" : ""}><a title='${i} ${str.pixel}'>${i}</a></li>`;
    for (i = 1; i <= pixelsY; i++) rows += `<li${i === ycursor ? " class=\"selected\"" : ""}><a title='${i} ${str.pixel}'>${i}</a></li>`;

    //  ALL CANVAS LAYERS (BACKGROUND GRID, TEXT LAYER, DRAW LAYER, COPY LAYER
    // AND POSITION LAYER FOR KEYBOARD) ARE LOCATED AT THE SAME POSITION
    ["grid-background", "text-canvas", "grid-canvas", "copy-canvas", "move-canvas"].forEach(canvas => {
        playground  += `<canvas id="${canvas}" style="position: absolute;" width="${areaX}" height="${areaY}"></canvas>`;
    });
    playground  += "<div class=\"rightmask\"></div><div class=\"bottommask\"></div>";

    // APPLY STYLE AND PLAYGROUND
    get(".cols").innerHTML = cols;
    get(".rows").innerHTML = rows;
    get("#grid-frame").innerHTML = playground;
    get("#pat-style").innerHTML = style;
    sizeWidth.value = sizeHeight.value = "";
    [sizeWidth.placeholder, sizeHeight.placeholder] = [pixelsX, pixelsY];
    textCanvas = get("#text-canvas");
    gridCanvas = get("#grid-canvas");
    moveCanvas = get("#move-canvas");
    ctxt = textCanvas.getContext("2d");

    // CREATE BACKGROUND GRID
    let background = get("#grid-background"),
        ctx = background.getContext("2d");
    [background.width, background.height] = [areaX, areaY];
    ctx.clearRect(0, 0, areaX, areaY);
    ctx.setLineDash([2, 2]);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 0.5;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (i = 0; i <= areaX; i += pixelWidth) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, areaY);
    }
    for (i = 0; i <= areaY; i += pixelHeight) {
        ctx.moveTo(0, i);
        ctx.lineTo(areaX, i);
    }
    ctx.closePath();
    ctx.stroke();
},

loadGrid = (grid, nolog) => {
    setCursors(grid.xcursor, grid.ycursor, nolog);
    updateMatrix(grid, grid.xcursor, grid.ycursor);
},

fillGrid = o => {
    let i, j, oldmatrix = [...matrix];
    for (i = 0; i < xcursor; i++) for (j = 0; j < ycursor; j++) matrix[i][j] = o ? [color.r, color.g, color.b, color.a] : 0;
    logAction(2, JSON.stringify({ actionNumber: ++actionNumber, matrix: oldmatrix, newmatrix: [...matrix], xcursor: xcursor, ycursor: ycursor, newxcursor: xcursor, newycursor: ycursor, pixelsX: pixelsX, pixelsY: pixelsY }));
    Rec.isRec && Rec.rec(2, [JSON.stringify({ matrix: [...matrix], xcursor: xcursor, ycursor: ycursor })]);
    imageInfo = 0;
    refreshGrid();
    redrawPreview();
    updateBase64Code();
},

moveGrid = (d, grid) => {
	    (Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 8)) && Rec[(Rec.isRec ? "rec" : "collect")](8, [d]);
	    grid = adaptMatrixSize(grid || matrix);
	    let newmatrix = resetMatrix(), mx = 0, my = 0, gx = 0, gy = 0, xx = 0, yy = 0, x, y, px = pixelsX, py = pixelsY;
	    d === 0 ? my = yy = 1 : d === 1 ? gy = yy = 1 :
	    d === 2 ? mx = xx = 1 : d === 3 && (gx = xx = 1);
        for(x = 0; x < px; x++) newmatrix[x] = [];
	    for (x = 0; x < px - xx; x++) for (y = 0; y < py - yy; y++) newmatrix[x + gx][y + gy] = grid[x + mx][y + my];
	    mx *= (px - 1); my *= (py - 1);
        gx *= (px - 1); gy *= (py - 1);
	    if (xx === 1) for (y = 0; y < py; y++) newmatrix[mx][y] = grid[gx][y];
	    else for (x = 0; x < px; x++) newmatrix[x][my] = grid[x][gy];
	    return newmatrix;
},

scrollGrid = e => {
    if (isScrolling) return;
    isScrolling = 1;
    let doc = body();
    e === 1 && (doc.scrollLeft = doc.scrollTop = 0);
    let pos = (e && e !== 1) ? getCursorCoordinates() : getDrawCursorCoords(),
        winX  = window.innerWidth,
        winY  = window.innerHeight - 20,
        newX  = pos.x - scrollX,
        newY  = pos.y - scrollY,
		baseX = pos.x - winX / 2,
		baseY = pos.y - winY / 2,
        smoX  = (
			newX + 1.5 * pixelWidth > winX && (pos.xc < pixelsX || newX > winX) ?  3 * pixelWidth :
			newX - 1.5 * pixelWidth < 0    && (pos.xc > 0       || newX < 0)    ?  3 *-pixelWidth : 0
		),
		smoY  = (
			newY + 1.5 * pixelHeight > winY && (pos.yc < pixelsY || newY > winY) ?  3 * pixelHeight :
			newY - 1.5 * pixelHeight < 0    && (pos.yc > 0       || newY < 0)    ?  3 *-pixelHeight : 0
		);
    ((drawCursorIsVisible || mouseIsDown || "579".indexOf(mode) > -1) && (smoX || smoY)) && (
		scrollBy({ top: smoY, left: smoX, behavior: "smooth"}),
    	scrollX = baseX,
        scrollY = baseY
    );
    setTimeout(() => isScrolling = 0, 50);
},

refreshGrid = (grid, matrix) => {
    let ctx, i, j;
    matrix = matrix || window.matrix;
    grid = grid || "grid";
    matrix.constructor === Object && matrix.hasOwnProperty("matrix") && (matrix = matrix.matrix);
    ctx = get(`#${grid}-canvas`).getContext("2d");
    clear(grid);
    for (i = 0; i < xcursor; i++) {
		matrix[i] || (matrix[i] = []);
        for (j = 0; j < ycursor; j++) {
            matrix[i][j] && (
                ctx.fillStyle = `rgba(${matrix[i][j].join(",")})`,
                ctx.fillRect(i * pixelWidth, j * pixelHeight, pixelWidth, pixelHeight)
            );
        }
    }
    !grid && redrawPreview();
},

encodeGrid = (grid, lzw) => {
    return lzw ? grid ? LZW.encode(JSON.stringify(grid)) : LZW.encode(JSON.stringify(getMatrix())) : grid ? JSON.stringify(grid) : JSON.stringify(getMatrix());
},

decodeGrid = encodedGrid => {
	try {
	    encodedGrid = JSON.parse(LZW.decode(decodeURIComponent(encodedGrid)));
	} catch(err) {
		try {
			encodedGrid = JSON.parse(decodeURIComponent(encodedGrid));
		} catch(err) {}
	}
	return encodedGrid;
},


/************************************
 *****      DRAW FUNCTIONS      *****
 ************************************
 **    drawLine,                   **
 **    drawRectangle,              **
 **    drawPolygon,                **
 **    drawParallelogram,          **
 **    drawEllipse,                **
 **    drawPixel,                  **
 **    drawPosition,               **
 **    drawCopyPixel               **
 ************************************/

getDrawColor = (c, val) => [c[0], c[1], c[2], parseFloat((1 - val).toFixed(2))],

// LINE ROUTINE USING THE EXTREME EFFICIENT BRESENHAM ALGORITHM
drawLine = () => {
    if (typeof drawObject.from === "object" && typeof drawObject.to === "object") {
        let x0 = drawObject.from.xc, x1 = drawObject.to.xc,
            y0 = drawObject.from.yc, y1 = drawObject.to.yc,
            dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1,
            dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1,
            err = dx - dy, e2, x2, x = x0, y = y0, m, rgb,
            ed = dx + dy == 0 ? 1 : Math.sqrt(dx * dx + dy * dy),
            rgba = drawObject.eraser ? 0 : [color.r, color.g, color.b, color.a];

    [4,5].indexOf(mode) > -1 && (Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 7)) && Rec[(Rec.isRec ? "rec" : "collect")](7, [x0, y0, (drawObject.finish? 1:0), (drawObject.eraser? 1:0), x1, y1, 0]);

        // CHECK IF START AND TARGET ARE THE SAME PIXEL
        if (!dx && !dy && ([4,5].indexOf(mode) > -1 || drawObject.finish)) {
            drawObject.finish ? (
                sameColor(color, matrix[x0][y0]) && (rgba = 0),
                logAction(1, JSON.stringify({actionNumber: actionNumber, prevColor: matrix[x0][y0], newColor: rgba, c: {xc: x0, yc: y0}})),
                drawPixel(drawObject.from, rgba),
                drawCursorIsVisible && drawPosition(drawObject.from),
                !drawCursorIsVisible && clear("move")
            ) : drawPosition(drawObject.from);
            return;
        }

        // <BRESENHAM ALGORITHM>
        if(antiAliasing) {
            while(true) {
                m = typeof matrix[x0][y0] === "object" ? [...matrix[x0][y0]] : [0, 0, 0, 0];
                rgb = typeof rgba === "object" ? [...rgba] : [0, 0, 0, 0];
                x0 >= 0 && y0 >= 0 && x0 < xcursor && y0 < ycursor && (
                    drawObject.finish ? rgb[3] >= m[3] ? (
                        logAction(1,JSON.stringify({actionNumber: actionNumber, prevColor: m, newColor: rgb, c:{xc:x0,yc:y0}})),
                        drawPixel({xc: x0, yc: y0}, getDrawColor(rgba, Math.abs(err - dx + dy) / ed))
                    ) : null : drawPosition({xc: x0, yc: y0}, x === x0 && y === y0 && !drawObject.build ? 0 : 1)
                );
                e2 = err; x2 = x0;
                if (2 * e2 >= -dx) {
                    if (x0 == x1) break;
                    e2 + dy < ed && (
                        drawObject.finish && isInRange(x0, y0 + sy) && (
                            drawPixel({xc: x0, yc: y0 + sy}, getDrawColor(rgba, (e2 + dy) / ed)),
                            logAction(1,JSON.stringify({actionNumber: actionNumber, prevColor: m, newColor: getDrawColor(rgba, (e2 + dy) / ed), c:{xc:x0,yc: y0 + sy}}))
                        )
                    );
                    err -= dy; x0 += sx;
                }
                if (2 * e2 <= dy) {
                    if (y0 == y1) break;
                    dx - e2 < ed && (
                        drawObject.finish && isInRange(x2 + sx, y0) && (
                            drawPixel({xc: x2 + sx, yc: y0}, getDrawColor(rgba, (dx - e2) / ed)),
                            logAction(1,JSON.stringify({actionNumber, prevColor: m, newColor: getDrawColor(rgba, (dx - e2) / ed), c:{xc: x2 + sx, yc:y0}}))
                        )
                    );
                    err += dx; y0 += sy;
                }
            }
        } else {
            while(true) {
                x0 >= 0 && y0 >= 0 && x0 < xcursor && y0 < ycursor && (
                    drawObject.finish ? (
                        logAction(1,JSON.stringify({actionNumber: actionNumber, prevColor: matrix[x0][y0], newColor: rgba, c:{xc:x0,yc:y0}})),
                        drawPixel({xc:x0,yc:y0},rgba)
                    ) : drawPosition({xc: x0, yc: y0}, (x === x0 && y === y0) && !drawObject.build ? 0 : 1)
                );
                if (x0 === x1 && y0 === y1) break;
                e2 = 2 * err;
                e2 > -dy && (err += -dy, x0 += sx);
                e2 < dx && (err += dx, y0 += sy);
            }
        }
        // </BRESENHAM ALGORITHM>

        if (drawObject.finish) {
            if (Rec.temp.edit.active && Rec.temp.edit.mode === 7) return Rec.addItemSpecial();
            clear("move");
            drawCursorIsVisible && drawPosition(drawObject.c ? drawObject.c : drawObject.to, 0, 1);
        }
    } else {
        (Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 7)) && typeof drawObject.from === "object" && (
            (drawObject.from || drawCursorIsVisible) && drawPosition(drawObject.from || position, 0, 1),
            Rec[(Rec.isRec ? "rec" : "collect")](7, [drawObject.from.xc, drawObject.from.yc, 0, (drawObject.eraser? 1:0), null, null, 0])
        );
    }
},

drawPolygon = () => {
    let i, rec = [], poly = [...drawObject.polygon];
    if (Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 19)) {
        for (i = 0; i < poly.length; i++) {
            if (i <= 1) rec.push([...poly[i]]);
            else if (poly[i].xc !== poly[i-1].xc || poly[i].yc !== poly[i-1].yc) rec.push([...poly[i]]);
        }
        Rec[(Rec.isRec ? "rec" : "collect")](19, [JSON.stringify(rec), (drawObject.finish? 1:0)]);
        if (Rec.temp.edit.active && drawObject.finish) return Rec.addItemSpecial();
    }
    if (poly.length === 1) return drawPosition(poly[0]);
    clear("move");
    drawObject.build = 1;
    for (i = 0; i < poly.length; i++) {
        drawObject.backToZero ? (
            drawObject.from = poly[i],
            drawObject.to = poly[i === poly.length - 1 ? 0 : i + 1],
            drawLine()
        ) : i < poly.length - 1 && (
            drawObject.from = poly[i],
            drawObject.to = poly[i + 1],
            drawLine()
        );
    }
    drawObject.finish && (
        drawObject.from = drawObject.to,
        drawObject.to = poly[0],
        drawLine()
    );
    drawObject.build = 0;
},

drawParallelogram = () => {
    let a = drawObject.a, b = drawObject.b, c = drawObject.c;
    (Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 18)) && Rec[(Rec.isRec ? "rec" : "collect")](18, (c? [a.xc, a.yc, b.xc, b.yc, drawObject.next? 1:0, c.xc, c.yc, drawObject.finish? 1:0] : b? [a.xc, a.yc, b.xc, b.yc, drawObject.next? 1:0] : [a.xc, a.yc]));
    if (Rec.temp.edit.active && Rec.temp.edit.mode === 18 && drawObject.finish) return Rec.addItemSpecial();
    if (a && !b && !c) return drawPosition(a);
    if (a && b && !c) {
        drawObject.from = a; drawObject.to = b;
        if (a.xc === b.xc && a.yc === b.yc && drawObject.next) return (
            drawObject.finish = 1,
            drawLine(),
            redrawPreview(),
            drawObject.finish = drawObject.from = drawObject.to = drawObject.a = drawObject.b = drawObject.c = drawObject.next = 0,
            mode = 11
        );
        return drawLine();
    }
    if (a && b && c) {
        clear("move");
        drawObject.build = 1;
        let d = {xc: c.xc + a.xc - b.xc, yc: c.yc + a.yc - b.yc};
        drawObject.from = a; drawObject.to = b;
        drawLine();
        drawObject.from = b; drawObject.to = c;
        drawLine();
        drawObject.from = c; drawObject.to = d;
        drawLine();
        drawObject.from = d; drawObject.to = a;
        drawLine();
        drawObject.build = 0;
    }
},

drawRectangle = (f, t) => {
    f && f.hasOwnProperty("xc") && f.hasOwnProperty("yc") && (drawObject.from.xc = f.xc, drawObject.from.yc = f.yc);
    t && t.hasOwnProperty("xc") && t.hasOwnProperty("yc") && (drawObject.to.xc = t.xc, drawObject.to.yc = t.yc);
    if (typeof drawObject.from === "object" && typeof drawObject.to === "object") {
        clear("move");
        let x1 = drawObject.from.xc, x2 = drawObject.to.xc,
            y1 = drawObject.from.yc, y2 = drawObject.to.yc,
            xDirection = x1 < x2 ? x2 : x1 > x2 ? x1 : 0,
            yDirection = y1 < y2 ? y2 : y1 > y2 ? y1 : 0,
            xFrom, xTo, yFrom, yTo, i, j,
            rgba = drawObject.eraser ? 0 : [color.r,color.g,color.b,color.a];
        (Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 6)) && Rec[(Rec.isRec ? "rec" : "collect")](6, [x1, y1, (drawObject.finish? 1:0), (drawObject.eraser? 1:0), x2, y2, (drawObject.filled? 1:0)]);
        if (!xDirection && !yDirection) {
            drawObject.finish ? (
                logAction(1, JSON.stringify({actionNumber: actionNumber, prevColor: matrix[x1][y1], newColor: rgba, c: {xc: x1, yc: y1}})),
                sameColor(color, matrix[x1][y1]) && (rgba = 0),
                drawPixel(drawObject.from, rgba),
                drawCursorIsVisible && drawPosition(drawObject.from),
                !drawCursorIsVisible && clear("move")
            ) : drawPosition(drawObject.from);
            return;
        }
        !drawCursorIsVisible && clear("move");

        x1 < x2 ? (xFrom = x1, xTo = x2) : (xFrom = x2, xTo = x1);
        y1 < y2 ? (yFrom = y1, yTo = y2) : (yFrom = y2, yTo = y1);
        for (i = xFrom; i <= xTo; i++) {
            for (j = yFrom; j <= yTo; j++) {
                (drawObject.filled || j === yFrom || j === yTo || i === xFrom || i === xTo ) && (
                    drawObject.finish ? (
                        logAction(1, JSON.stringify({actionNumber: actionNumber, prevColor: matrix[i][j], newColor: rgba, c: {xc: i, yc: j}})),
                        drawPixel({xc: i, yc: j}, rgba)
                    ) : drawPosition({xc: i, yc: j}, 1)
                );
            }
        }
        drawObject.finish && (
            Rec.temp.edit.active && Rec.temp.edit.mode === 6 ?
            Rec.addItemSpecial() : (
                clear("move"),
                drawCursorIsVisible && drawPosition(drawObject.to, 0, 1)
            )
        );
    } else {
        (drawObject.from || drawCursorIsVisible) && drawPosition(drawObject.from || position, 0, 1);
        ((Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 6)) && typeof drawObject.from === "object") && Rec[(Rec.isRec ? "rec" : "collect")](6, [drawObject.from.xc, drawObject.from.yc, 0, (drawObject.eraser? 1:0), null, null, (drawObject.filled? 1:0)]);
    }
},

drawSegments = function() {
    let args = [...arguments],
        l = args.length - 2,
        p = args[l + 1], i,
        rgb = args[l], ok = 0;
        rgb[3] = 1 - parseFloat((parseInt(100 * (rgb[3] / 255)) / 100).toFixed(2));
        for (i = 0; i < l; i++) {
            isInRange(args[i]) ? ok = 1 : (
                args[i].xc >= xcursor && args[i].xc < pixelsX && (xcursor++, ok = 1),
                args[i].yc >= ycursor && args[i].yc < pixelsY && (ycursor++, ok = 1),
                ok && setCursors(xcursor, ycursor)
            );
            ok && (
                drawObject.finish ? (
                    logAction(1, JSON.stringify({actionNumber, prevColor: matrix[args[i].xc][args[i].yc], newColor: [...rgb], c: args[i]})),
                    drawPixel(args[i], rgb)
                ) : p && drawPosition(args[i], 1),
                ok = 0
            );
        }
},
// ELLIPSE ROUTINE USING THE EXTREME EFFICIENT BRESENHAM ALGORITHM
drawEllipse = () => {
    if (typeof drawObject.from === "object" && typeof drawObject.to === "object") {
        let x0, x1, y0, y1, a, b;
        if (antiAliasing) {
            let fx = drawObject.from.xc, tx = drawObject.to.xc,
                fy = drawObject.from.yc, ty = drawObject.to.yc;
            x0 = Math.min(fx, tx), x1 = Math.max(fx, tx);
            y0 = Math.min(fy, ty), y1 = Math.max(fy, ty);
            tx < fx ? x1 += (x1 - x0) : x0 -= (x1 - x0);
            ty < fy ? y1 += (y1 - y0) : y0 -= (y1 - y0);
        } else {
            x0 = drawObject.from.xc, x1 = drawObject.to.xc;
            y0 = drawObject.from.yc, y1 = drawObject.to.yc;
        }
        a = Math.abs(x0 - x1); b = Math.abs(y0 - y1);

        let oldcursors = [xcursor, ycursor],
            rgba = drawObject.eraser ? 0 : [color.r,color.g,color.b,color.a], rgb;
        (Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 13)) && Rec[(Rec.isRec ? "rec" : "collect")](13, [x0, y0, (drawObject.finish? 1:0), (drawObject.eraser? 1:0), x1, y1, 0]);
        if (!a && !b) {
            drawObject.finish ? (
                logAction(1, JSON.stringify({actionNumber: actionNumber, prevColor: matrix[x0][y0], newColor: rgba, c: {xc: x0, yc: y0}})),
                sameColor(color, matrix[x0][y0]) && (rgba = 0),
                drawPixel(drawObject.from, rgba),
                drawCursorIsVisible ? drawPosition(drawObject.from) : clear("move")
            ) : drawPosition(drawObject.from);
            return;
        }
        !drawCursorIsVisible && !drawObject.build && !copyObject.copyActive && clear("move");
        /* <BRESENHAM ALGORITHM> */
        if (antiAliasing) { // USING ANTI ALIASING --> SOFT DRAWN ELLIPSES
            let b1 = b & 1,
                dx = 4 * (a - 1) * b * b,
                dy = 4 * (b1 + 1) * a * a,
                f, ed, i, err = b1 * a * a - dx + dy;
            rgb = rgba ? rgba : [0, 0, 0, 0];
            dx = 4 * (a - 1) * b * b, dy = 4 * (b1 + 1) * a * a;
            y0 += (b + 1) >> 1; y1 = y0 - b1;
            a = 8 * a * a; b1 = 8 * b * b;
            while(true) {
            	i = Math.min(dx, dy); ed = Math.max(dx, dy);
            	ed = (y0 === y1 + 1 && err > dy && a > b1 ? (255 * 4 / a) : (255 / (ed + 2 * ed * i * i / (4 * ed * ed + i * i))));
            	rgb[3] = ed * Math.abs(err + dx - dy);
            	drawSegments({ xc: x0, yc: y0 }, { xc: x0, yc: y1 }, { xc: x1, yc: y0 }, { xc: x1, yc: y1 }, rgb, 1);
            	if(f = 2 * err + dy >= 0) {
            		if(x0 >= x1) break;
            		rgb[3] = ed * (err + dx);
            		if(rgb[3] < 256) drawSegments({ xc: x0, yc: y0 + 1 }, { xc: x0, yc: y1 - 1 }, { xc: x1, yc: y0 + 1 }, { xc: x1, yc: y1 - 1 }, rgb, 0);
            	}
            	if(2 * err <= dx) {
            		rgb[3] = ed * (dy - err);
            		if(rgb[3] < 256) drawSegments({ xc: x0 + 1, yc: y0 }, { xc: x0 + 1, yc: y1 }, { xc: x1 - 1, yc: y0 }, { xc: x1 - 1, yc: y1 }, rgb, 0);
            		y0++;
            		y1--;
            		err += dy += a;
            	}
            	f && (x0++, x1--, err -= dx -= b1);
            }
            if(--x0 == x1++) while(y0 - y1 < b) {
        		rgb[3] = 255 * 4 * Math.abs(err + dx) / b1; /* -> finish tip of ellipse */
        		drawSegments({ xc: x0, yc: ++y0 }, { xc: x1, yc: y0 }, { xc: x0, yc: --y1 }, { xc: x1, yc: y1 }, rgb, 1);
        		err += dy += a;
        	}
       } else {
           // NORMALLY DRAWN ELLIPSE
           let dx = 0, dy = b, e2,
            a2 = a * a, b2 = b * b,
            e = b2 - (2 * b - 1) * a2;
            while (dy >= 0) {
                drawSegments({xc: x0 + dx, yc: y0 + dy}, {xc: x0 - dx, yc: y0 + dy}, {xc: x0 - dx, yc: y0 - dy}, {xc: x0 + dx, yc: y0 - dy}, rgba, 1);
                e2 = 2 * e;
                e2 < (2 * dx + 1) * b2 && (dx++, e += (2 * dx + 1) * b2);
                e2 > -(2 * dy - 1) * a2 && (dy--, e -= (2 * dy - 1) * a2);
            }
            while (dx < a) drawSegments({xc: x0 - dx, yc: y0}, {xc: x0 + dx++, yc: y0}, rgba, 1);
            /* </BRESENHAM ALGORITHM> */
        }

        if (drawObject.finish) {
            if (Rec.temp.edit.active && Rec.temp.edit.mode === 13) return Rec.addItemSpecial();
            (oldcursors[0] !== xcursor || oldcursors[1] !== ycursor) && logAction(3, JSON.stringify({actionNumber: actionNumber, xcursor: oldcursors.split(",")[0], ycursor: oldcursors.split(",")[1], newxcursor: xcursor, newycursor: ycursor}));
            clear("move");
            drawCursorIsVisible && drawPosition(drawObject.to, 0, 1);
        }
    } else {
        (drawObject.from || drawCursorIsVisible) && drawPosition(drawObject.from || position, 0, 1);
        ((Rec.isRec || (Rec.temp.edit.active && Rec.temp.edit.mode === 13)) && typeof drawObject.from === "object") && Rec[(Rec.isRec ? "rec" : "collect")](13, [drawObject.from.xc, drawObject.from.yc, 0, (drawObject.eraser? 1:0), null, null, 0]);
    }
},


// DRAW A SINGLE PIXEL ON THE GRID
drawPixel = (c, rgb) => {
    if (copyObject.copyActive) return drawCopyPixel(c);
    let ctx = gridCanvas.getContext("2d"),
        x = c.xc * pixelWidth,
        y = c.yc * pixelHeight,
        m = matrix[c.xc][c.yc];
    drawoverlay.checked ? (
        rgb ? m && rgb[0] === m[0] && rgb[1] === m[1] && rgb[2] === m[2] && (
            rgb[3] = Math.min(parseFloat((m[3] + rgb[3]).toFixed(2)), 1)
        ) : m && color.r === m[0] && color.g === m[1] && color.b === m[2] ? (
            rgb = [color.r, color.g, color.b, Math.max(parseFloat((m[3] - color.a).toFixed(2)), 0)]
        ) : rgb = 0,
        rgb[3] == 0 && (rgb = 0)
    ) : rgb = rgb || 0;
    matrix[c.xc][c.yc] = rgb;
    Rec.isRec && !drawObject.from && !drawObject.to && Rec.rec(1, [c.xc, c.yc, (rgb? 1:0)]);
    ctx.clearRect(x, y, pixelWidth, pixelHeight);
    rgb && (
        ctx.fillStyle = "rgba(" + rgb.join(",") + ")",
        ctx.fillRect(x, y, pixelWidth, pixelHeight)
    );
    drawCursorIsVisible && drawPosition(c, Rec.isRec ? "rec" : 0);
},


// DRAW A POSITION MARKER ON THE GRID (USED WHEN DRAWING SHAPES, OR IN KEYBOARD MODE...)
drawPosition = (c, add, store, canvas) => {
    canvas = canvas ? get(`${canvas}-canvas`) : moveCanvas;
    typeof c.xc !== "number" && (c = getCursorCoordinates(canvas, c));
    c.xc = c.xc >= pixelsX ? pixelsX-1 : c.xc < 0 ? 0 : c.xc;
    c.yc = c.yc >= pixelsY ? pixelsY-1 : c.yc < 0 ? 0 : c.yc;
    let ctx = canvas.getContext("2d"), col, rgb,
        x = (c.xc + 0.5) * pixelWidth,
        y = (c.yc + 0.5) * pixelHeight;
    !add && clear("move");
    rgb = matrix[c.xc][c.yc] || [0, 0, 0, 0];
    col = c.rgb ? "rgba(" + c.rgb.join(",") + ")" : rgb[3] < 0.3 ? "#000000" : "#" + tinycolor.mostReadable("rgba(" + rgb.join(",") + ")", colors).toHex();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x, y, pixelWidth * 0.3, 0, 2 * Math.PI, 0);
    ctx.fill();
    ctx.closePath();
    store && (position = getDrawCursorCoords({ xc: c.xc, yc: c.yc }));
    Rec.isRec && !(add === "rec" || drawObject.from || drawObject.to || drawObject.a || drawObject.polygon[0]) && Rec.rec(4, [c.xc, c.yc]);
},

// MARK THE PIXELS SELECTED FOR COPYING
drawCopyPixel = c => {
    let canvas = moveCanvas,
        ctx = canvas.getContext("2d"), col, ctxx,
        copycanvas = get("#copy-canvas"),
        cctx = copycanvas.getContext("2d"),
        erase = drawObject.eraser || mode === 2,
        finish = drawObject.finish || mode === 1 || mode === 2;
    typeof c.xc !== "number" && (c = getCursorCoordinates(canvas, c));
    c.xc = c.xc >= pixelsX ? pixelsX-1 : c.xc < 0 ? 0 : c.xc;
    c.yc = c.yc >= pixelsY ? pixelsY-1 : c.yc < 0 ? 0 : c.yc;
    let x = (c.xc + 0.5) * pixelWidth,
        y = (c.yc + 0.5) * pixelHeight,
        rgb;
    copyObject.matrix[c.xc] = copyObject.matrix[c.xc] || [];
    finish ? (
        // DRAW THE SELECTION MARKERS ON THE REGULAR CANVAS TO MAKE THEM FIX
        ctxx = cctx,
        copyObject.matrix[c.xc][c.yc] = (erase) ? 0 : matrix[c.xc][c.yc]
    ) : (
        // DRAW THE SELECTION MARKERS ON THE COPY CANVAS
        // TO KEEP THE PREVIOUSLY SELECTED PIXELS AND ADD MORE PIXELS
        ctxx = ctx
    );
    erase ? ctxx.clearRect(c.xc * pixelWidth, c.yc * pixelHeight, pixelWidth, pixelHeight) : (
        rgb = copyObject.matrix[c.xc][c.yc] || matrix[c.xc][c.yc] || [0, 0, 0, 0],
        col = c.rgb ? `rgba(${c.rgb.join(",")})` : rgb[3] < 0.3 ? "#000000" : "#" + tinycolor.mostReadable(`rgba(${rgb.join(",")})`, colors).toHex(),
        ctxx.fillStyle = col,
        ctxx.beginPath(),
        ctxx.arc(x, y, (finish ? pixelWidth * 0.2 : pixelWidth * 0.3), 0, 2 * Math.PI, 0),
        ctxx.fill(),
        ctxx.closePath()
    );
},

Image = function(image) {
    this.canvas = image;
    this.ctx = this.canvas.getContext("2d");
    this.width = image.width;
    this.height = image.height;
    this.channels = 4;
    this.image = image;
    image.attributes?.src ? this.ctx.drawImage(image, 0, 0, image.width, image.height) : this.ctx.putImageData(image, 0, 0);
    this.data = this.ctx.getImageData(0, 0, this.width, this.height);
};

Image.prototype.nearestNeighbor = function(image, newWidth, newHeight) {
	var wRatio = this.width / newWidth;
	var hRatio = this.height / newHeight;
	for(var i = 0; i < newWidth; i++) {
		var w = Math.floor((i + 0.5) * wRatio);
		for(var j = 0; j < newHeight; j++) {
			var h = Math.floor((j + 0.5) * hRatio);
			for(var c = 0; c < this.channels; c++) {
				image.setValueXY(i, j, c, this.getValueXY(w, h, c));
			}
		}
	}
};

Image.prototype.resize = function() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var preserveAspectRatio = options.preserveAspectRatio;
  var width = options.width;
  var height = options.height;

  if (!width) {
    if (height && preserveAspectRatio) width = Math.round(height * (this.width / this.height));
    else width = this.width;
  }

  if (!height) {
    if (preserveAspectRatio) height = Math.round(width * (this.height / this.width));
    else height = this.height;
  }

  if (width === this.width && height === this.height) {
    var _newImage = this.clone();
    return _newImage;
  }
  this.nearestNeighbor(image, width, height);
  return this;
};

Image.prototype.setValueXY = function(x, y, channel, value) {
    this.data[(y * this.width + x) * this.channels + channel] = value;
    this.computed = null;
    return this;
};

Image.prototype.getValueXY = function(x, y, channel) {
    return this.data[(y * this.width + x) * this.channels + channel];
};

const resizeImage = (width, height) => {
    if (!width && !height) return;
    if (width >= xcursor || height >= ycursor) return (
        workMatrix = {
            matrix: stretchMatrix(optimizeMatrix(matrix), {xc: width, yc: height}),
            xcursor: width,
            ycursor: height,
            pixelsX: 24,
            pixelsY: 24
        },
        setupGrid()
    );
    !height && (height = parseInt(ycursor / xcursor * width));
    !width && (width = parseInt(xcursor / ycursor * height));
    awareResize({
        canvas: patcanvas,
        toSize: [width, height],
        onIteration: function(percent) {
            fixMessage(`${str.processed}: ${percent.processed}%`);
        }
    }, finish => {
        fixMessage(`${str.processed}: 100%`, 1000);
        const grid = image2Matrix(null, finish, 1);
        logAction(4, JSON.stringify({
            actionNumber: ++actionNumber,
            matrix: [...matrix],
            newmatrix: [...grid.matrix],
            pixelsX: pixelsX,
            pixelsY: pixelsY,
            xcursor: xcursor,
            ycursor: ycursor,
            newpixelsX: grid.pixelsX,
            newpixelsY: grid.pixelsY,
            newxcursor: grid.xcursor,
            newycursor: grid.ycursor
        }));
        workMatrix = grid;
        setupGrid();
    });
},

/************************************
 *****     COLOR FUNCTIONS      *****
 ************************************/

translateColor = col => {
    // TRANSLATES ONE OF THE FOLLOWING FORMATS TO RGBA FORMAT:
    //    RGB & RGBA: {r: 200, g: 100, b: 50, a: 0.5} (R, G AND B VALUES 0-255, OPACITY (A) 0-1)
    //    ARRAY: [255, 255, 255, 0.75] (R, G AND B VALUES 0-255, OPACITY (A) 0-1)
    //    HEX: FFEE33 (SUPPORTED FORMATS: RGB, RGBA, RRGGBB, RRGGBBAA, ALL VALUES HEX)
    try {
        col = col.replace(/\s+/g, "");
        let rgb, color = {};
        if (col.indexOf("{") > -1 && col.indexOf("}") > -1 && (col.split(",").length === 3 || col.split(",").length === 4)) {
            col = col.match(/[rgb]:[0-9]{1,3}|a:(0(\.[0-9]+)?|1)/g);
            col.forEach(col => color[(rgb = col.split(":"), rgb[0])] = parseFloat(rgb[1]));
            color = inputToRgb({r: color.r, g: color.g, b: color.b, a: color.a || 1});
        } else if (col.indexOf("[") > -1 && col.indexOf("]") > -1 && (col.split(",").length === 3 || col.split(",").length === 4)) {
            col = (col.split("[")[1].split("]")[0].split(",")).map(e => parseFloat(e));
            color = inputToRgb({r: col[0], g: col[1], b: col[2], a: (col.length === 4 ? col[3] : 1)});
        } else if ([3,4,6,8].indexOf(col.match(/[a-f0-9]/gi).length) > -1) {
            color = inputToRgb(col);
        }
        if (color.ok) return color;
        return false;
    } catch(err) {
        return false;
    }
},

colorChange = (c, erase) => {
    let actualColor,
        matrix = window.matrix,
        oldColor = matrix[c.xc][c.yc],
        oldmatrix = [...matrix];
    for (let i = 0; i < xcursor; i++) {
        for (let j = 0; j < ycursor; j++) {
            actualColor = matrix[i][j];
            if (typeof actualColor === typeof oldColor && ((
                typeof actualColor === "object" && Math.abs(actualColor[0] - oldColor[0]) < 5 && Math.abs(actualColor[1] - oldColor[1]) < 5 && Math.abs(actualColor[2] - oldColor[2]) < 5 && (
                    keepAlpha || (!keepAlpha && Math.abs(actualColor[3] - oldColor[3]) <= 0.1)
                )) || typeof actualColor === "number"
            )) matrix[i][j] = erase ? 0 : [color.r, color.g, color.b, (keepAlpha ? actualColor ? actualColor[3] : 1 : color.a)];
        }
    }
    logAction(2, JSON.stringify({
        actionNumber: ++actionNumber,
        matrix: oldmatrix,
        newmatrix: [...matrix],
        xcursor: xcursor,
        ycursor: ycursor,
        newxcursor: xcursor,
        newycursor: ycursor
    }));
    Rec.isRec && Rec.rec(2, [JSON.stringify({matrix: [...matrix], xcursor: xcursor, ycursor: ycursor})]);
    window.matrix = matrix;
    redrawPreview();
    refreshGrid();
},


// FIND ALL PIXELS OF A CONTIGUOUS COLORED AREA AND RE-COLOR THEM IN THE CHOSEN COLOR
colorChangeArea = ([New, Old, Pix, Dir, Map, Itt]) => {
	!Pix && (Pix = getCursorCoordinates());
	let matrix = window.matrix,
    x = Pix.xc, y = Pix.yc, i = 1, ok = 1, This, oldmatrix, temp;
	!New && (New = 0);
    !Dir && (Dir = 1);
	!Itt && (oldmatrix = [...matrix]);
    Old == null && (Old = matrix[x][y]);
    !Map ? Map = resetMatrix() : (
        Dir === 1 ? x-- : Dir === 2 ? x++ : Dir === 3 ? y-- : y++,
        (x < 0 || x >= xcursor || y < 0 || y >= ycursor || Map[x][y]) && (ok = 0),
        Itt = 1
    );
    if (!ok) return;
    Map[x][y] = 1;
    This = matrix[x][y];
	typeof Old !== typeof This && (ok = 0);
    ok && typeof Old == "object" && [].forEach.call(Old, (col, index) => {
        index < 3 ? (This[index] < col - treshold || This[index] > col + treshold) && (ok = 0) :
        !keepAlpha && (This[index] < col - treshold * 0.1 || This[index] > col + treshold * 0.1) && (ok = 0);
    });
    if (!ok) return;
    ok && (
        temp = New ? [New[0], New[1], New[2], (keepAlpha && This ? This[3] : keepAlpha && !This ? 1 : New[3])] : 0,
        matrix[x][y] = temp
    );
    for (; i < 5; i++) colorChangeArea([New, Old, {xc: x, yc: y}, i, Map, Itt]);
    !Itt && (
            logAction(2, JSON.stringify({
                actionNumber: ++actionNumber,
                matrix: oldmatrix,
                newmatrix: [...matrix],
                xcursor: xcursor,
                ycursor: ycursor,
                newxcursor: xcursor,
                newycursor: ycursor
            })),
            Rec.isRec && Rec.rec(2, [JSON.stringify({matrix: [...matrix], xcursor: xcursor, ycursor: ycursor})]),
            window.matrix = matrix,
            redrawPreview(),
            refreshGrid()
    );
},

// CONVERT COLORS INTO GREYSCALE
colorToBW = () => {
    let x, y, col, bw, matrix = [];
    for (x = 0; x < pixelsX; x++) {
        matrix[x] = [];
        for (y = 0; y < pixelsY; y++) {
            col = window.matrix[x][y];
            // IN CONVERTING IN GRAYSCALE, WE CONSIDER THAT THE EYE PERCEIVES
            // THE BASIC COLORS DIFFERENTLY BRIGHT
            bw = col ? Math.sqrt(col[0] * col[0] * 0.299 + col[1] * col[1] * 0.587 + col[2] * col[2] * 0.114) : 0;
            matrix[x][y] = col ? [bw, bw, bw, col[3]] : 0;
        }
    }
    logAction(2, JSON.stringify({
        actionNumber: ++actionNumber,
        matrix: [...window.matrix],
        newmatrix: matrix,
        xcursor: xcursor,
        ycursor: ycursor,
        newxcursor: xcursor,
        newycursor: ycursor
    }));
    window.matrix = matrix;
    refreshGrid();
    redrawPreview();
},


/*************************************
 ***    Text 2 Canvas Functions    ***
 *************************************/
drawNewText = (text, height = ycursor, font = "Acme", mode = 0) => {
    // mode 0 => draw a specific text on the grid
    // mode 1 => return the width of the canvas needed for a specific text
    // mode 2 => return the matrix of a specific text
    if (!text) return;
    height = parseInt(height);
    ctxt.font = `${height}px ${font}`;
    let width = parseInt(ctxt.measureText(text).width) + 1;
    if (mode === 1) return width;
    textCanvas.width = width;
    textCanvas.height = height;
    ctxt.textBaseline = "top";
    ctxt.font = `${height}px ${font}`;
    ctxt.fillText(text, 0, 0);
    let id = ctxt.getImageData(0, 0, width, height).data, g = gradient.checked, a, x, y;
    text = [];
    for (x = 0; x < width; x++) {
        text[x] = [];
        for (y = 0; y < height; y++) {
            a = parseFloat((Math.floor(id[(width * y + x) * 4 + 3] / 2.55) * 0.01).toFixed(2));
            text[x][y] = a ? g ? [255 - Math.round(x * (256 / width)), 0, Math.round(x * (256 / width)), a] : [color.r, color.g, color.b, a] : 0;
        }
    }
    if (mode === 2) return text;
    copyObject.array.push(text);
    copyObject.arrayPointer = copyObject.array.length-1;
    copyObject.isNewText = 1;
    copyObject.pasteItem();
    toolAction("move");
    update.queue.push("log", "tools", "contextmenu");
},

showTextInputArea = (open) => {
    getComputedStyle(textArea).display === "none" || open ? (
        $(textArea).slideDown(400, () => get("#draw-text").focus()),
        updateTextArea()
    ) : $(textArea).slideUp();
},

useText = () => {
    let text = updateTextArea();
    text[0] && text[0].length && (
        (copyObject.copyActive || copyObject.pasteActive) && copyObject.cancel(3),
        drawNewText(text[0], text[1], text[2])
    );
},

updateTextArea = function(id, content) {
    if (content && (content === this.text || content === this.fontSize || content === this.font)) return;
    this.text || (this.text = "");
    this.fontSize || (this.fontSize = ycursor);
    this.font || (this.font = "Acme");
    id && (id === "draw-text" ? this.text = content : id.indexOf("font") > -1 ? this.font = content : this.fontSize = content);
    textInfo.innerText = (
        this.text ? drawNewText(this.text, this.fontSize, this.font, 1) : "1"
    ) + " x " + this.fontSize + " Pixel";
    drawText.style.fontFamily = this.font;
    drawText.value = this.text;
    get(`#${this.font} input`).checked = 1;
    textSize.value = this.fontSize;
    [].forEach.call(get(".font"), a => a.classList.remove("highlighted_text"));
    get(`#${this.font}`).classList.add("highlighted_text");
    if (!id && !content) return [this.text, this.fontSize, this.font];
},


/*************************************
 ***   ADDITIONAL FUNCTIONS  FOR   ***
 ***   @MEDIA (MAX-WIDTH: xxxPX)   ***
 *************************************/
toggleCodeContainer = () => {
    let visible = getComputedStyle(codeContainer).display === "none";
    $(codeContainer).slideToggle(400, () => codeTab.style.opacity = visible ? "1" : "0.5");
},

togglePreviewContainer = () => {
    let visible = getComputedStyle(previewContainer).display === "none";
    $(previewContainer).slideToggle(400, () => previewTab.style.opacity = visible ? "1" : "0.5");
},

togglePin = function() {
    let pinned = this.classList.contains("pinned");
    this.classList = pinned ? "unpinned" : "pinned";
    this.title = pinned ? str.pin : str.unpin;
},

checkToHideContainer = (e, type) => {
    temp.hide = temp.hide || {};
    temp.timeout = temp.timeout || {};
    if (getComputedStyle(e).position !== "fixed" || !e.classList.contains("unhide-" + e.id)) return;
    type === "mouseover" && (temp.hide[e.id] = 0);
    type === "mouseleave" && (
        temp.hide[e.id] = 1,
        temp.timeout[e.id] && clearTimeout(temp.timeout[e.id]),
        temp.timeout[e.id] = setTimeout( () => {
            if (temp.hide[e.id]) return (temp.hide[e.id] = 0, temp.timeout[e.id] = 0, hideContainer(e));
        }, 2000)
    );
},

showContainer = e => {
    let pin = window[e.id.substring(0,4) + "Pin"];
    if (getComputedStyle(e).position !== "fixed") return;
    if (e.classList.contains("unhide-" + e.id)) return (e.style.zIndex < global_zIndex && (e.style.zIndex = ++global_zIndex));
    pin.classList.remove("hidden");
    $(e).addClass("unhide-" + e.id, 400);
    e.id.indexOf("text") === -1 ? $(".opacity").show() : drawText.focus();
},

hideContainer = e => {
    let pin = window[e.id.substring(0,4) + "Pin"];
    getComputedStyle(e).position === "fixed" &&
    e.classList.contains("unhide-" + e.id) &&
    !pin.classList.contains("pinned") && (
        e.id.indexOf("tool") === -1 ||
        getComputedStyle(get("#sp-container")).display === "none"
    ) && (
            pin.title = str.pin,
            pin.classList = "hidden unpinned",
            $(e).removeClass("unhide-" + e.id, 400),
            e.id.indexOf("text") > -1 ? moveCanvas.focus() : $(".opacity").hide()
        );
},

toggleDrawOptions = () => {
    const parentIsTools = drawOptions.parentElement === toolContainer,
        isFixed = getComputedStyle(toolContainer).position === "fixed";
    isFixed ? !parentIsTools && (
        drawOptionsContainer.removeChild(drawOptions),
        toolContainer.appendChild(drawOptions),
        drawOptions.style.position = "relative",
        drawOptions.style.top = "-20px"
    ) : parentIsTools && (
        drawOptions.style.top = "",
        drawOptions.style.position = "",
        toolContainer.removeChild(drawOptions),
        drawOptionsContainer.appendChild(drawOptions)
    );
},


/************************************
 **   UPDATE TOOL ON USER ACTION   **
 ************************************/
update = {
    isUpdating: 0,
    queue: [],
    a: "add",
    r: "remove",
    // CHECK TO ENABLE/DISABLE THE UNDO/REDO TOOL
    log: () => {
        log.length ? (
            logPointer + 1 === log.length ? (toolIcons.redo.classList.add("off"),    menuIcons.redo.classList.add("disabled")) :
                                            (toolIcons.redo.classList.remove("off"), menuIcons.redo.classList.remove("disabled")),
            logPointer === -1 ?             (toolIcons.undo.classList.add("off"),    menuIcons.undo.classList.add("disabled")) :
                                            (toolIcons.undo.classList.remove("off"), menuIcons.undo.classList.remove("disabled"))
        ) : (
            toolIcons.undo.classList.add("off"), menuIcons.undo.classList.add("disabled"),
            toolIcons.redo.classList.add("off"), menuIcons.redo.classList.add("disabled")
        );
    },
    // COLLECT THE CURRENT STATES OF THE SINGLE FUNCTIONS AND VARIABLES, IN ORDER TO ENABLE OR DISABLE BUTTONS / OPTIONS
    check: function() {
        let a = this.a,
            r = this.r;
        // COLLECT BASIC DATA
        this.matrix      = !matrixIsEmpty();
        this.copyMatrix  = !matrixIsEmpty(copyObject.matrix);
        this.boardHidden = offset(get("#copyItems")).left === 0;
        this.pasteActive = copyObject.pasteActive;
        this.copyActive  = copyObject.copyActive;
        this.copyArray   = !!copyObject.array.length;
        this.storage     = useLocalStorage;
        // AND COMBINE
        this.move        = this.matrix || (this.copyMatrix && this.pasteActive) ? r : a;
        this.remove      = this.copyArray && !this.boardHidden ? r : a;
        this.select      = !this.pasteActive && !this.copyActive && this.matrix && this.boardHidden ? r : a;
        this.selectS     = this.copyActive ? a : r;
        this.copy        = this.copyMatrix && this.copyActive ? r : a;
        this.preview     = !this.copyActive && !this.pasteActive && this.copyArray && copyObject.arrayPointer > -1 && !this.boardHidden ? r : a;
        this.paste       = !this.copyActive && this.pasteActive && this.copyMatrix ? r : a;
        this.pasteS      = this.pasteActive ? a : r;
        this.show        = this.copyArray && this.boardHidden ? r : a;
        this.cancel      = this.copyActive || this.pasteActive ? r : a;
        this.cancelS     = this.copyActive || this.pasteActive ? a : r;
        this.removeL     = this.storage && this.copyArray ? r : a;
        this.clear       = this.matrix ? r : a;
        this.cColor      = this.matrix ? r : a;
        this.getMatrix   = this.matrix ? r : a;
        this.clone       = this.matrix ? r : a;
        //ADD SOME INFOS FROM THE RECORDER
        this.stop        = Rec.isRec || Rec.isPlay ? r : a;
        this.play        = (Rec.isRec || Rec.isPlay) && !Rec.isPause ? a : r;
        this.rec         = Rec.isRec || Rec.isPlay ? a : r;
        this.edit        = Rec.isEditable ? str.edit : str.details;
    },
    // DISABLE OR ENABLE THE TOOL ICONS
    tools: function() {
        let a = this.a, r = this.r;
        toolIcons.move      .classList[this.move]       ("off");
        toolIcons.rotate    .classList[this.move]       ("off");
        toolIcons.remove    .classList[this.remove]     ("off");
        toolIcons.select    .classList[this.select]     ("off");
        toolIcons.copy      .classList[this.copy]       ("off");
        toolIcons.paste     .classList[this.paste]      ("off");
        toolIcons.preview   .classList[this.preview]    ("off");
        toolIcons.show      .classList[this.show]       ("off");
        toolIcons.cancel    .classList[this.cancel]     ("off");
        toolIcons.removeL   .classList[this.removeL]    ("off");
        toolIcons.clear     .classList[this.clear]      ("off");
        toolIcons.clearColor.classList[this.cColor]     ("off");
        toolIcons.getMatrix .classList[this.getMatrix]  ("off");
        toolIcons.clone     .classList[this.clone]      ("off");
        toolIcons.selectS   .classList[this.selectS] ("active");
        toolIcons.pasteS    .classList[this.pasteS]  ("active");
        toolIcons.cancelS   .classList[this.cancelS] ("active");
        [].forEach.call(get(".tools a"), e => e.closest("span").classList[e.classList.contains("off") ? a : r]("no_pointer_events"));
        $(".overlay")[mode ===  1 || mode ===  2 ? "slideDown" : "slideUp"]();
        $(".alpha")[mode === 20 || mode === 21 ? "slideDown" : "slideUp"]();
        $(".treshold")[mode === 20 ? "slideDown" : "slideUp"]();
        $(".antialiasing")[[4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15].indexOf(mode) > -1 ? "slideDown" : "slideUp"]();
        getComputedStyle(toolContainer).position === "fixed" ? drawOptions.parentElement === drawOptionsContainer && toggleDrawOptions() : drawOptions.parentElement === toolContainer && toggleDrawOptions();
    },

    // DISABLE OR ENABLE THE CONTEXTMENU OPTIONS
    contextmenu: function() {
        let a = this.a, r = this.r;
        menuIcons.move   .classList[this.move]   ("disabled");
        menuIcons.rotate .classList[this.move]   ("disabled");
        menuIcons.remove .classList[this.remove] ("disabled");
        menuIcons.select .classList[this.select] ("disabled");
        menuIcons.copy   .classList[this.copy]   ("disabled");
        menuIcons.paste  .classList[this.paste]  ("disabled");
        menuIcons.preview.classList[this.preview]("disabled");
        menuIcons.show   .classList[this.show]   ("disabled");
        menuIcons.cancel .classList[this.cancel] ("disabled");
        menuIcons.removeL.classList[this.removeL]("disabled");
        menuIcons.clone  .classList[this.clone]  ("disabled");
        menuIcons.clear  .classList[this.clear]  ("disabled");
        menuIcons.stop   .classList[this.stop]   ("disabled");
        menuIcons.play   .classList[this.play]   ("disabled");
        menuIcons.rec    .classList[this.rec]    ("disabled");
        menuIcons.editS  .innerText = this.edit;
    },
    // UPDATE THE IDLE LINE AT THE BOTTOM OF THE SCREEN AND MINIMIZE THE TOOL IF TIME IS UP
    minimize: () => {
        !Rec.isPlay && !Rec.isRec && !toolIsMinimized && !autoMinimize && idle + idleTime < Date.now() && (autoMinimize = 1, clickMinimize(1));
        if (!autoMinimize && temp.idle !== idle) {
            toolIsMinimized || idleLine.set(parseInt(_GET("idletime") || idleTime));
            temp.idle = idle;
        }
    },
    // THE UPDATE TOOL FOR FUNCTIONS TO ENABLE OR DISABLE, DEPENDING UPON CURRENT STATE
    // (EXAMPLE: IF NOTHING WAS DRAWN, NOTHING CAN BE UNDONE, SO THE UNDO BUTTON WILL BE DISABLED)
    run: () => {
        !toolIsMinimized && (temp.idle !== idle || idle + idleTime < Date.now()) && update.minimize();
        if (!update.queue.length || update.isUpdating) return;
        update.isUpdating = 1;
        update.check();
        while(update.queue.length) update[update.queue.pop()]();
        update.isUpdating = 0;
    }
},


/************************************
 *****         ACTION           *****
 ************************************/
doAction = e => {
    e = e || window.event;
    let rgba, direction,
    c = e.hasOwnProperty("xc") ? e : getCursorCoordinates(),
    oldPixelX = activePixel.x,
    oldPixelY = activePixel.y;
    position = getDrawCursorCoords(c);
    activePixel.x = c.xc = parseInt(Math.abs(c.xc) >= pixelsX ? pixelsX - 1 : Math.abs(c.xc));
    activePixel.y = c.yc = parseInt(Math.abs(c.yc) >= pixelsY ? pixelsY - 1 : Math.abs(c.yc));
    rgba = matrix[c.xc][c.yc];
    drawCursorIsVisible & mode !== 10 && drawPosition(c);
    mode !== 10 && copyObject.pasteActive && copyObject.cancel(3);
    switch (mode) {
        // DRAW PIXEL AND ERASER
        case 1: case 2:
            logAction(1, JSON.stringify({ actionNumber: actionNumber, prevColor: rgba, newColor: (mode === 1 ? [color.r, color.g, color.b, color.a] : 0), c: c }));
            drawPixel(c, (mode === 1 ? [color.r, color.g, color.b, color.a] : 0));
            redrawPreview();
            break;
        // EYEDROPPER
        case 3:
            rgba && (color = {r: rgba[0], g: rgba[1], b: rgba[2], a: rgba[3]});
            !rgba && (color.r = color.g = color.b = color.a = 0);
            colorSubmit(color);
            toolAction(modes[previousMode]);
            break;

        // DRAW LINE / RECTANGLE / PARALLELOGRAM / POLYGON / ELLIPSE START
        case 4: case 6: case 8: case 11: case 14:
            mode === 11 ? (drawObject.a = c) : mode === 14 ? drawObject.polygon[0] = {xc: c.xc, yc: c.yc} : drawObject.from = c;
            mode++;
            mode === 5 ? drawLine() : mode === 7 ? drawRectangle() : mode === 9 ? drawEllipse() : mode === 15 ? drawPolygon() : drawParallelogram();
            break;

        // DRAW LINE / RECTANGLE / PARALLELOGRAM / POLYGON / ELLIPSE FINISH
        case 5: case 7: case 9: case 12: case 13: case 15:
            mode === 12 ? (drawObject.b = c, mode += drawObject.next) : mode === 13 ? drawObject.c = c : mode === 15 ? (
                drawObject.polygon.length === 1 || drawObject.next ? drawObject.polygon.push({xc: c.xc, yc: c.yc}) : drawObject.polygon[drawObject.polygon.length-1] = {xc: c.xc, yc: c.yc}, drawObject.next = 0
            ) : drawObject.to = c;
            drawObject.finish && holdKey === 32 && actionNumber++;
            mode === 5 ? drawLine() : mode === 7 ? drawRectangle() : mode === 9 ? drawEllipse() : mode === 15 ? drawPolygon() : drawParallelogram();
            if (drawObject.finish) {
                redrawPreview();
                // SAVE THE STATUS OF "ERASER" AND "FILLED" FLAG
                let temp = [drawObject.filled, drawObject.eraser];
                // RESET DRAWOBJECT
                drawObject = cloneObject(defaultDrawObject);
                // RESTORE THE STATUS OF "ERASER" AND "FILLED" FLAG
                drawObject.filled = temp[0];
                drawObject.eraser = temp[1];
                mode--;
                mode === 12 && mode--;
            }
            holdKey = 0;
            break;
        // MOVE PATTERN
        case 10:
            direction = oldPixelY > activePixel.y ? 0 :
                        oldPixelY < activePixel.y ? 1 :
                        oldPixelX > activePixel.x ? 2 : 3;
            if (typeof direction === "number") {
                if(copyObject.pasteActive) {
                    xcursor < pixelsX && setCursors(pixelsX, pixelsY, 1);
                    copyObject.matrix = moveGrid(direction, copyObject.matrix);
                    refreshGrid("copy", copyObject.matrix);
                } else {
                    temp.redrawTimeout && clearTimeout(temp.redrawTimeout);
                    temp.matrix = [...matrix];
                    matrix = moveGrid(direction);
                    refreshGrid("grid", matrix);
                    temp.redrawTimeout = setTimeout(() => {
						let grid = JSON.stringify({
                            actionNumber: ++actionNumber,
                            matrix: temp.matrix,
                            newmatrix: [...matrix],
                            xcursor: xcursor,
                            ycursor: ycursor,
                            newxcursor: xcursor,
                            newycursor: ycursor
                        });
                        logAction(2, grid);
                        redrawPreview();
                    }, 500);
                }
            }
            break;
        // COLOR CHANGE
        case 20: case 21:
            colorChangeMode === "area" ?
            colorChangeArea(mode === 20 ? [[color.r, color.g, color.b, color.a]] : [0]) :
            colorChange(c, mode === 20 ? 0 : 1);
            break;
        // SELECT AN AREA TO CLONE
        case 23: case 24:
            mode === 23 ? (drawObject.from = c, mode++) : (drawObject.to = c, mode += drawObject.next);
            drawRectangle();
            mode === 25 && message("info", null, str.positionAndPressEnter);
            break;
        // INSERT THE CLONED AREA
        case 25:
            (xcursor < pixelsX || ycursor < pixelsY) && setCursors(pixelsX, pixelsY, 1);
            !(
                clone.from && clone.to &&
                clone.from.hasOwnProperty("xc") && clone.from.hasOwnProperty("yc") &&
                clone.to.hasOwnProperty("xc") && clone.to.hasOwnProperty("yc")
            ) && clone.getMatrix(drawObject.from, drawObject.to);
            //clear("copy"); clear("move");
            direction = oldPixelY > activePixel.y ? 0 : // up
                        oldPixelY < activePixel.y ? 1 : // down
                        oldPixelX > activePixel.x ? 2 :
                        oldPixelX < activePixel.x ? 3 : null; // left : right
            drawObject.finish ? clone.m ? (clone.finish(), message(), mode = 23) :
            (clone.reset(), message(),toolAction(modes[previousMode])) :
            typeof direction === "number" && clone.moveMatrix(direction);
            break;

        // todo: CASES 28, 29, 30 ARE NOT READY YET. THE FUNCTION IS TO DRAW A RECTANGLE AROUND
        // AN AREA AND THEN THIS AREA CAN BE MOVED OR STRETCHED/SHRINKED IN X AND Y DIRECTION
        case 28: case 29:
            mode === 28 ? (drawObject.from = c, mode++) : (drawObject.to = c, mode += drawObject.next);
            drawRectangle();
            break;
        case 30:
            f = {...drawObject.from};
            t = {...drawObject.to};
            temp.f = {xc: Math.min(f.xc, t.xc), yc: Math.min(f.yc, t.yc)};
            temp.t = {xc: Math.max(f.xc, t.xc), yc: Math.max(f.yc, t.yc)};
            f = temp.f;
            t = temp.t;
            matrixPart.isDraggedAt = (c.xc >= f.xc && c.xc <= t.xc && c.yc >= f.yc && c.yc <= t.yc) ?
                (c.xc === f.xc && c.yc === f.yc) ? "top-left" :
                (c.xc === t.xc && c.yc === t.yc) ? "bottom-right" :
                (c.xc === t.xc && c.yc === f.yc) ? "top-right" :
                (c.xc === f.xc && c.yc === t.yc) ? "bottom-left" :
                (c.xc === f.xc) ? "left" :
                (c.xc === t.xc) ? "right" :
                (c.yc === f.yc) ? "top" :
                (c.yc === t.yc) ? "bottom" : "center" : "";
            matrixPart.isDraggedAt && (
                matrixPart.from = f,
                matrixPart.to = t,
                matrixPart.getMatrix(),
                mode++
            );
            break;
    }
    update.queue.push("log", "tools", "contextmenu");
},

logAction = (mode, action) => {
    !(Rec.isPlay || copyObject.copyActive) && (
        log[++logPointer] = [mode, action],
        log.length > logPointer + 1 && (log.length = logPointer + 1)
    );
},

// UNDO AND REDO
undoAction = redo => {
    if (Rec.isPlay || (redo && logPointer + 1 === log.length) || (!redo && logPointer < 0)) return;
    redo && logPointer++;
    let mode = log[logPointer][0],
        action = JSON.parse(log[logPointer][1]);
    !redo && logPointer--;
    (copyObject.copyActive || copyObject.pasteActive) && copyObject.cancel(3);
    executeLogAction(mode, action, redo);
    (redo && logPointer + 1 < log.length && JSON.parse(log[logPointer + 1][1]).actionNumber == action.actionNumber) ||
    (!redo && logPointer > -1 && JSON.parse(log[logPointer][1]).actionNumber == action.actionNumber) ? undoAction(redo) : redrawPreview();
},

executeLogAction = (mode, action, redo) => {
    switch (mode) {
        case 1: // RESTORE SINGLE PIXEL
            drawPixel(action.c, (redo ? action.newColor : action.prevColor));
            if (Rec.isRec && action.prevColor) Rec.rec(1, [action.c.xc, action.c.yc, action.prevColor.r, action.prevColor.g, action.prevColor.b, action.prevColor.a, action.newColor.r, action.newColor.g, action.newColor.b, action.newColor.a]);
            else if (Rec.isRec) Rec.rec(1, [action.c.xc, action.c.yc]);
            break;
        case 2: // RESTORE WHOLE PATTERN
            redo && (
                action.xcursor = action.newxcursor,
                action.ycursor = action.newycursor,
                action.matrix = action.newmatrix
            );
            action.xcursor = action.xcursor || xcursor;
            action.ycursor = action.ycursor || ycursor;
            loadGrid(action, 1);
            Rec.isRec && Rec.rec(2, [JSON.stringify({matrix: [...action.matrix], newmatrix: [...action.newmatrix], xcursor: (action.xcursor ? action.xcursor : xcursor), ycursor: (action.ycursor ? action.ycursor : ycursor), newxcursor: (action.newxcursor ? action.newxcursor : xcursor), newycursor: (action.newycursor ? action.newycursor : ycursor)})]);
            break;
        case 3: // RESTORE X- AND Y-CURSORS
            position = getDrawCursorCoords({xc: Math.min(position.xc, (redo ? action.newxcursor - 1 : action.xcursor - 1)), yc: Math.min(position.yc, (redo ? action.newycursor - 1 : action.ycursor - 1))});
            drawCursorIsVisible && drawPosition(position);
            setCursors((redo ? action.newxcursor : action.xcursor), (redo ? action.newycursor : action.ycursor), 1);
            Rec.isRec && Rec.rec(3, [action.xcursor, action.ycursor, action.newxcursor, action.newycursor]);
            break;
        case 4: // RESTORE WHOLE GRID CONFIGURATION
            redo && (
                action.matrix = action.newmatrix,
                action.xcursor = action.newxcursor,
                action.ycursor = action.newycursor,
                action.pixelsX = action.newpixelsX,
                action.pixelsY = action.newpixelsY
            );
            workMatrix = action;
            Rec.isRec && Rec.rec(17, [action]);
            setupGrid();
            break;
    }
    update.queue.push("log", "tools", "contextmenu");
},

toolAction = function(tool, byRec, recursive) {
    /* TOOL MODES:
        0: UNDO / REDO
        1: PENCIL
        2: ERASER
        3: EYEDROPPER
        4: LINE START
        5: LINE MOVE
        6: RECTANGLE START
        7: RECTANGLE MOVE
        8: ELLIPSE START
        9: ELLIPSE MOVE
        10: MOVE GRID
        11: PARALLELOGRAM START LINE A
        12: PARALLELOGRAM START LINE B
        13: PARALLELOGRAM START LINE C+D
        14: POLYGON START
        15: POLYGON NEXT
        16: FILELOAD
        17: GETMATRIX
        18: ROTATE
        19: TEXT
        20: CHANGE COLOR / AREA
        21: CLEAR COLOR / AREA
        22: COLOR TO BLACK/WHITE
        23: CLONE - SELECTION START
        24: CLONE - SELECTION FINISH
        25: CLONE - MOVE SELECTION
        26:
        27:
        28:
        29:
        30: PICKER
    */
    tool = modes.indexOf(tool) > -1 ? tool : mode ? modes[mode] : "pencil";
    if (get(`#${tool}`).classList.contains("off") || get(`#${tool}`).classList.contains("disabled")) return;
    // IF RECORDING, RECORD THE CHOSEN TOOL
    Rec.isRec && Rec.rec(12, [modes.indexOf(tool), (("fillclear".indexOf(tool) > -1) || (tool === "text" && getComputedStyle(textArea).display === "none")) ? 1 : 0]);
    let key = holdKey, style;
    // UNHIGHLIGHT ALL TOOLS
    [].forEach.call(get(".tools span"), tool => tool.classList.remove("active"));
    // HIGHLIGHT ACTIVE TOOL
    get(`#${tool}`).closest("span")?.classList.add("active"); // jshint ignore:line
    // IF THE TEXT-TOOL IS VISIBLE, HIGHLIGHT TEXT-TOOL-BUTTON AS WELL
    tool !== "text" && getComputedStyle(textArea).display === "block" && get("#text").closest("span").classList.add("active");
    // IF AN ACTIVE PASTE ACTION IS STILL RUNNING, BUT CHOSEN TOOL IS NOT "MOVE", STOP THE PASTE ACTION
    tool !== "move" && copyObject.pasteActive && copyAction.cancel();
    // RESET MOUSE CURSOR STYLE
    get("#grid-frame").classList = "";
    // RESET DRAW OBJECT WHEN LINE OR RECTANGLE WAS STARTED AND AN OTHER
    // TOOL (EXCEPT ERASER OR EYEDROPPER) IS CHOSEN
    modes[mode] !== tool && "erasereyedropper".indexOf(tool) === -1 && (drawObject.from = drawObject.to = 0);
    // RESET DRAW OBJECT AND MODE WHEN LINE OR RECTANGLE WAS STARTED AND ESC IS PRESSED
    key === 27 && "579".indexOf(mode) > -1 && (
        mode--,
        drawObject.from = drawObject.to = 0,
        mode !== 6 && (drawObject.filled = 0)
    );
    // SAVE CURRENT MODE (IF SHAPE) TO BE ABLE TO GO BACK TO IT IF NECESSARY
    [0, 3, 10, 19, 23, 24, 25, 26].indexOf(mode) === -1 && (previousMode = mode);
    // IF CHOSEN TOOL IS NOT ERASER AND IS NOT EYEDROPPER,...
    "eyedropperaser".indexOf(tool) === -1 && (
        // ... AND IT"S NOT RECTANGLE, THEN RESET RECTANGLE
        tool !== "rectangle" && (
            get("#rectangle").classList = "tool rectangle",
            drawObject.filled = 0
        ),
        // ... AND IT"S NOT LINE, THEN RESET LINE
        tool !== "line" && (get("#line").classList = "tool line")
    );
    // IF NO ACTIVE PASTE ACTION IS TO PERFORM, CLEAR THE MOVE CANVAS
    !copyObject.pasteActive && clear("move");
    // SHOW THE DRAW CURSOR IN KEYBOARD MODE
    drawCursorIsVisible && drawPosition(position);
    // REMEMBER THE MODE NAME FOR STYLING THE MOUSE CURSOR
    style = modes[mode];
    switch (tool) {
        case "fill": case "clear":
            if (tool === "clear" && matrixIsEmpty()) {
                toolAction(modes[mode]);
                break;
            }
            Rec.isPlay && byRec && fillGrid(tool === "fill" ? 1 : 0);
            !Rec.isPlay && confirm(tool === "fill" ? str.fill + "?" : str.clear + "?") && fillGrid(tool === "fill" ? 1 : 0);
            toolAction(modes[mode], 0, 1);
            break;
        case "undo": // mode 0
            undoAction();
            //mode = 0;
            toolAction(modes[mode], 0, 1);
            break;
        case "redo": // mode 0
            undoAction(1);
            //mode = 0;
            toolAction(modes[mode], 0, 1);
            break;
        case "pencil": // mode 1
            styleCursor(tool);
            mode = 1;
            break;
        case "eraser": // mode 2
            if ("4567".indexOf(mode) === -1) {
                styleCursor(tool);
                mode = 2;
                break;
            }
            drawObject.eraser = !drawObject.eraser;
            drawObject.filled && (style += "-filled");
            drawObject.eraser && (style += "-eraser");
            !drawObject.eraser && get("#eraser").closest("span").classList.remove("active");
            styleCursor(style);
            get(`#${modes[mode]}`).classList = "tool " + style;
            get(`#${modes[mode]}`).closest("span").classList = "active";
            drawObject.from && !Rec.isPlay && (
                mode === 5 && drawLine(),
                mode === 7 && drawRectangle()
            );
            break;
        case "eyedropper": // mode 3
            styleCursor(tool);
            mode = 3;
            break;
        case "picker": // COLORPICKER CHOSEN FROM CONTEXTMENU OR KEYPRESS
            setTimeout(() => {
                $(".color-preview").spectrum(getComputedStyle(get("#sp-container")).display === "none" ? "show" : "hide");
                toolAction(modes[mode]);
            }, 50);
            break;
        case "line": // mode 4, 5
            styleCursor(tool);
            drawObject.eraser = 0;
        	mode = 4;
            break;
        case "rectangle": // mode 6, 7
            if (recursive) break;
            if (mode === 6 || mode === 7) {
                key !== 27 && (drawObject.filled = !drawObject.filled);
                drawObject.filled && (style += "-filled");
                drawObject.eraser && (
                    style += "-eraser",
                    get("#eraser").closest("span").classList = "active"
                );
                styleCursor(style);
                get("#rectangle").classList = "tool " + style;
                get("#rectangle").closest("span").classList = "active";
                drawObject.from && !Rec.isPlay && drawRectangle();
            } else {
                styleCursor(tool);
                drawObject.filled = drawObject.eraser = 0;
            }
        	mode !== 7 && (mode = 6);
            break;
        case "ellipse": // mode 8, 9
            styleCursor(tool);
            drawObject.eraser = 0;
            mode = 8;
            break;
        case "move": // mode 10
            styleCursor(tool);
            !copyObject.pasteActive && clear("move");
            Rec.temp.edit.active && Rec.temp.edit.mode === 8 && Rec.temp.recLog.length && Rec.addItemSpecial();
            mode = 10;
            setCursors(pixelsX, pixelsY, (copyObject.pasteActive) ? 1 : 0);
            break;
        case "parallelogram": // mode 11, 12, 13
            styleCursor(tool);
            drawObject.eraser = 0;
            mode = 11;
            break;
        case "polygon": // mode 14, 15
            styleCursor(tool);
            drawObject.eraser = 0;
            mode = 14;
            break;
        case "fileload": // mode 16
            openModal("fileInputForm");
            break;
        case "getmatrix": // mode 17
            if (copyCode.textContent === codeHeadline[1][0]) codeBoxShows("matrix");
            else if (copyCode.textContent === codeHeadline[1][1]) codeBoxShows("lzw");
            else codeBoxShows("base64");
            setTimeout(() => toolAction(modes[mode], 0, 1), 10);
            break;
        case "rotate": // mode 18
            setTimeout(() => toolAction(modes[mode], 0, 1), 10);
            rotateMatrix(matrix);
            break;
        case "text": // mode 19
            toolAction(modes[mode], 0, 1);
            get("#text").closest("span").classList[(getComputedStyle(textArea).display === "none" ? "add" : "remove")]("active");
            showTextInputArea(byRec);
            break;
        case "change-color": case "change-color_ctx": case "color-area": // mode 20
			if (recursive) break;
            ["color-area", "change-color_ctx"].indexOf(tool) > -1 ? (
                mode = 20,
                colorChangeMode = tool === "color-area" ? "area" : "color",
                get("#change-color").closest("span").classList.add("active")
            ) : mode === 20 && (
                colorChangeMode = colorChangeMode === "area" ? "color" : "area"
            );
            mode !== 20 && (
                mode = 20,
                colorChangeMode = "area"
            );
            styleCursor("fill-" + colorChangeMode);
            get("#change-color").classList = "tool change-" + colorChangeMode;
            break;
        case "clear-color": case "clear-area": case "clear-color_ctx": // mode 21
			if (recursive) break;
            ["clear-area", "clear-color_ctx"].indexOf(tool) > -1 ? (
                mode = 21,
                colorChangeMode = tool === "clear-area" ? "area" : "color",
                get("#clear-color").closest("span").classList.add("active")
            ) : mode === 21 && (
                colorChangeMode = colorChangeMode === "area" ? "color" : "area"
            );
            mode !== 21 && (
                mode = 21,
                colorChangeMode = "area"
            );
            styleCursor("clear-" + colorChangeMode);
            get("#clear-color").classList = "tool clear-" + colorChangeMode;
            break;
        case "color-bw": // mode 22
            colorToBW();
            toolAction(modes[mode]);
            break;
        case "clone": // mode 23, 24, 25
            if (mode === 25 && clone.m) {
                clone.finish();
                mode = 23;
            } else if ([23, 24, 25].indexOf(mode) > -1) {
                clone.reset();
                toolAction(modes[previousMode]);
            } else mode = 23;
            break;
    }
    mode !== 20 && mode != 3 && tool != "picker" && get("#change-color").classList.replace("change-color", "change-area");
    mode !== 21 && mode != 3 && tool != "picker" && get("#clear-color").classList.replace("clear-color", "clear-area");
    update.queue.push("log", "tools", "contextmenu");
},

copyAction = function(action) {
    if (get(`#${action}`).classList.contains("off") || get("#m_" + action).classList.contains("disabled")) return;
    [].forEach.call(get(".tab5 span.active"), tool => tool.classList.remove("active"));
    switch (action) {
        case "select":
            if (copyObject.copyActive || copyObject.pasteActive || matrixIsEmpty()) return;
            copyObject.select();
            break;
        case "copy":
            if (copyObject.pasteActive || matrixIsEmpty() || (copyObject.copyActive && matrixIsEmpty(copyObject.matrix))) return;
            get(`#${action}`).closest("span").classList.add("active");
            copyObject.copy();
            break;
        case "drop-item":
            if (copyObject.copyActive || copyObject.pasteActive || !copyObject.array.length || copyObject.arrayPointer < 0) return;
            copyObject.pasteItem();
            break;
        case "paste":
            if (copyObject.copyActive) return;
            copyObject.paste();
            break;
        case "show_items":
            if (!copyObject.array.length) return;
            copyObject.showItems();
            break;
        case "cancel":
            copyObject.cancel(3);
            break;
        case "remove":
            if (!copyObject.array.length) return;
            copyObject.remove();
            break;
        case "remove_local":
            copyObject.saveLocal();
            break;
    }
    update.queue.push("log", "tools", "contextmenu");
},

activateContent = (e) => {
    const selectors = e === "keys" ? "#keys h3, #keys h4" : e === "help" ? "#help h3, #help h4" : "#help h3, #help h4, #keys h3, #keys h4";
    [].forEach.call(get(selectors), a => {
        a.style.cursor = "pointer";
        a.removeEventListener("mousedown", toggleContent);
        a.addEventListener("mousedown", toggleContent);
    });
},


/************************************
 *****       SETUP MAIN         *****
 *****                          *****
 ************************************/
setup = () => {

    /************************************
     *****      EVENT-HANDLERS       *****
     ************************************/
     resizeSubmit.addEventListener("click", resizeGrid);
     base64Code.addEventListener("click", clickBase64Code);
     base64Code.addEventListener("mouseover", mouseOverB64CopyCode);
     copyCode.addEventListener("click", copyCssCode);
     copyCode.addEventListener("mouseover", mouseOverB64CopyCode);
     colorpicker.addEventListener("focus", focusColorpicker);
     colorpicker.addEventListener("blur", blurColorpicker);
     opacity.addEventListener("blur", blurOpacity);
     imgInput.addEventListener("change", changeImgInput);
     imgLoad.addEventListener("click", loadImage);
     textPin.addEventListener("click", togglePin);
     toolPin.addEventListener("click", togglePin);
     textArea.addEventListener("mouseover", e => checkToHideContainer(textArea,e.type));
     textArea.addEventListener("mouseleave", e => checkToHideContainer(textArea,e.type));
     textArea.addEventListener("mousedown", () => showContainer(textArea));
     toolContainer.addEventListener("mouseover", e => checkToHideContainer(toolContainer,e.type));
     toolContainer.addEventListener("mouseleave", e => checkToHideContainer(toolContainer,e.type));
     toolContainer.addEventListener("mousedown", () => showContainer(toolContainer));
     previewTab.addEventListener("mousedown", togglePreviewContainer);
     codeTab.addEventListener("mousedown", toggleCodeContainer);
     infoLink.addEventListener("click", clickInfoLink);
     helpLink.addEventListener("click", clickHelpLink);
     keysLink.addEventListener("click", clickKeysLink);
     recordLink.addEventListener("click", clickRecordLink);
     downloadPNG.addEventListener("click", downloadPng);
     controlCanvas.addEventListener("mousedown", copyObject.pasteItem);
     rew.addEventListener("mousedown", () => copyObject.showItem(-1));
     fwd.addEventListener("mousedown", () => copyObject.showItem(1));
     removeCopy.addEventListener("mousedown", (() => copyAction("remove")));
     minimize.addEventListener("click", clickMinimize);
     document.addEventListener("mousedown", docMousedown);
     document.addEventListener("mouseup", docMouseup);
     document.addEventListener("contextmenu", onContextMenu);
     window.addEventListener("scroll", scrollWindow);
     window.addEventListener("resize", updateVisibility);
     window.addEventListener("unload", backup);
     window.addEventListener("mousemove", e => {mouse.x = e.touches ? e.touches[0].clientX : e.x; mouse.y = e.touches ? e.touches[0].clientY : e.y; !toolIsMinimized && (idle = Date.now());});
     document.querySelectorAll(".record-text").forEach(e => e.addEventListener("focus", handleFocusOnInput));
     document.querySelectorAll(".record-text").forEach(e => e.addEventListener("blur", handleBlurOnInput));
     document.querySelectorAll(".record-text").forEach(e => e.addEventListener("input", recordInput));
     document.querySelectorAll(".record-checkbox").forEach(e => e.addEventListener("change", changeChecked));
     document.querySelectorAll(".patterns a").forEach(e => e.addEventListener("click", usePattern));
     document.querySelectorAll(".tools a.tool, menu button.tool").forEach(e => e.addEventListener("click", useTools));
     document.querySelectorAll(".tab5 a.tool, menu button.tab5").forEach(e => e.addEventListener("click", useCopyObject));
     document.querySelectorAll(".recContext").forEach(e => e.addEventListener("click", useRecContext));
     window.addEventListener("hashchange", checkHashAndUrlVars);
     document.querySelectorAll(".lang").forEach(e => e.addEventListener("click", useLangContext));

    // CANVAS ELEMENT TO HOLD THE PIXELS FOR THE PREVIEW
    patcanvas = document.createElement("canvas");
    patcontext = patcanvas.getContext("2d");

    mouseIsDown = activePixel.x = activePixel.y = position.xc = position.yc = 0;

    // ADD ALL LANGUAGE SPECIFIC CONTENT, DEPENDING UPON CHOSEN LANGUAGE
    [].forEach.call(get("[data-value]"), e => e.tagName === "INPUT" ? e.value = str[e.dataset.value] : e.innerHTML = str[e.dataset.value]);

    if (useLocalStorage || useCookies) {
        // CHECK IF THE USER WANTS TO REMOVE THE BACKUP OR KEYBINDINGS
        // SHOW ITEMS THAT BELONG TO THE LOCAL STORAGE OR COOKIES
        $("#remove_local").show();
        $("menu #remove_local").show();
        _GET("destroybackup") && destroyBackup();
        _GET("destroykeys") && destroyKeys();
        updateSavedCopies();
    }

    // START BUILDING THE GRID
    setupGrid(1);

    // FINISH GRID BUILD
    setupGrid(2);

    // START CAPTURING KEYS
    Keys.activate();
    Keys.prevent();

    // INIT COLOR AND OPACITY FIELD
    colorSubmit(color);

    // WE START IN PENCIL MODE, SO THE MOUSECURSOR IS A PENCIL
    toolAction("pencil");

    // INIT TEXTAREA
    updateTextArea();

    // WHEN THE WINDOW IS TO SMALL, SOME ELEMENTS WILL BE HIDDEN. HERE WE INITIALLY CHECK THIS
    updateVisibility();

	// MAKE THE KEY HANDLER GLOBAL, SO IT CAN ALSO BE USED BY AN IFRAME
    // (IF THE IFRAME IS FOCUSED, IT BOUNCES ALL KEYPRESSES BACK TO THE MAIN SCRIPT)
    window.Keys.handle = Keys.handle;

	// IF THE DATABASE IS AVAILABLE, SHOW THE ONLINE SESSION BUTTON
    //firebase && $(sessionButton).show();

    // ACTIVATE LINKS IN THE INFO MENU
    activateContent("help");

    idleLine.create(idleTime);

    checkHashAndUrlVars();
    // ACTIVATE ALL LANGUAGE SPECIFIC TITLE TEXTS
    [].forEach.call(get("[title]"), e => str[e.title] && (e.setAttribute("org_title", e.title), e.title = str[e.title]));

    // REFRESH CONTENT THAT DEPENDS ON USERS BEHAVE (LIKE GREY OUT THE TRASHBIN, IF THE GRID IS EMPTY)
    update.queue.push("log", "tools", "contextmenu");
    setInterval(update.run, 200);
    restore();
};

/****************************** EOF ****************************/
