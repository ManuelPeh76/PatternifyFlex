/*jshint esversion: 10, -W030, -W033, -W083, -W084*/
/**************************************************
 **                                              **
 **              PATTERNIFY FLEX                 **
 **  __________________________________________  **
 **       Enhancements to 'FLEX' version         **
 **         (c) 2020 by Manuel Pelzer            **
 ** ___________________________________________  **
 **  lang_en.js                                  **
 **************************************************/

language.en = {
	addByDraw: "Live",
	addItem: "Add Item",
	addItemAfterThisOne: "Add new item after this one",
	addSpecialMessage: [
		"",
		"",
		"Draw a pattern, click on the matrix code after completion",
		"Click the limiter one after the other at the desired position",
		"",
		"",
		"Draw a rectangle ....",
		"Draw a line ....",
		"Move the grid, then click on the 'Move' tool",
		"Change color and opacity, click outside the colorpicker when finished",
		"Change opacity with slider, release slider when finished",
		"Enter text, click outside the text field when finished",
		"",
		"Draw an ellipse....",
		"",
		"Draw a pattern, click on the matrix code after completion",
		"",
		"",
		"Draw a parallelogram....",
		"Draw a polygon....",
		"Enter text...."
	],
	added: "added",
	aFunctionWithResult: "a function with the result",
    anObject: "an object",
    anArray: "an array",
    aString: "a string",
    aNumber: "a number",
    aBoolean:"a boolean",
    theCodeIsValid: "The code is valid.",
    theResponseIs: "The response is",
	alwaysDeleteWholeShape: "Always delete whole shapes",
	antiAliasing: "Anti Aliasing",
	applyChanges: "Apply changes",
	areShown: "are shown!",
	at: "at",
	autoBackupOnUnload: "Auto Backup of Patternify on Browser close",
	autoRestoreOnLoad: "Auto Restore Patternify on load",
	backupAndRestore: "Backup and Restore",
	backupDone: "Backup was saved!",
	backupRemoved: "Backup removed!",
	base64Code: "Base64 Code",
	board: "Board",
	canNotAutoSaveKeys: "Key assignment changed!<br>Unfortunately, the keyboard assignment cannot be saved automatically,<br>please use the download link!",
	cancel: "Cancel",
	cancelCopyMatrix: "Abort Paste action",
	changeCol: "Change Color",
	changeColor: "Change Color\n    1. Select the desired color in the colorpicker\n    2. Click on the color to be changed in the grid\n\n    1. Mode: Only a contiguous area is re-colored\n    2. Mode: The clicked color is removed in the whole Grid",
	checkFormArgsErrorMessage: "Wrong value(s), please check your input!",
	checkFormCase1: "X / Y value must be 0 -%x%/ 0 -%y%!<br />Draw / Erase must be 0 or 1 !",
	checkFormCase10: "Enter an integer value from 0 - 100 !",
	checkFormCase11a: "X / Y value must be 0 - 400 !",
	checkFormCase11b: "Enter a hexadecimal number !",
	checkFormCase11c: "Format is '000', '0000' (000 + opacity) or '000000' !",
	checkFormCase11d: "Value must be 0 - 100 !",
	checkFormCase15: "You have to enter a value !",
	checkFormCase15_11: "The value must be between 0 and%value%!",
	checkFormCase15_8: "Please enter a number from 0.5 - 10 !",
	checkFormCase16a: "The value you entered is not a function !",
	checkFormCase16b: "Enter at least a function name !",
	checkFormCase17: "The values for the fields must be 0 - 400 !",
	checkFormCase18: "The values for the fields must be 0 -%val%!",
	checkFormCase2: "Get the matrix:<br />1. Draw a pattern<br />2. Click 'Show Matrix' inside the tools.<br />3. Click on 'Copy Matrix'.<br />4. Paste it here (&nbsp;&nbsp;&nbsp;<tt><font size=\"-1\"><span style=\"border: yellow 1px solid;border-radius: 4px; padding: 1px 5px\">CTRL</span></font></tt>&nbsp;&nbsp;&nbsp;+&nbsp;&nbsp;<tt><font size=\"-1\"><span style=\"border: yellow 1px solid; border-radius: 4px; margin: 3px; padding: 1px 5px\">V</span></font></tt>&nbsp;&nbsp;).",
	checkFormCase3: "X / Y values must be 0 -%x%/ 0 -%y%!",
	checkFormCase5a: "Please enter a valid jQuery expression !",
	checkFormCase6: "X / Y values must be 0 -%x%/ 0 -%y%!<br />To define the startpoint of a new shape, the target X / Y must be 'null'<br />",
	checkFormCase9: "Color values must be 0 - 255 !<br />Opacity range is 0.00 - 1.00 !",
	checkFormCaseSelection: "Please make a selection !<br />",
    chosenSizeMustBeSmallerThanActualSize: "The new size must be smaller than the actual size!",
	clearArea: "Empty Area",
	clearCol: "Remove Color",
	clearColor: "Delete color\n    1. mode: The clicked color is removed in the clicked area\n    2. mode: The clicked color is removed in the entire grid",
	clear: "Clear Grid",
    clickForColorpicker: "Click to open the color picker",
	clickOutsideWhenFinish: "Click outside the textarea when finished",
	clickToChange: "Click to change",
	clipboard: "Clipboard",
	clone: "Clone",
	closeAreas: "Close Areas",
	closeMenu: "Close",
	code: "B64 Code",
	codeHeadline: [
		[
			"Base64 Code",
			"Matrix Code",
			"LZW-Encoded Matrix Code"
		],
		[
			"Copy CSS Code",
			"Copy Matrix",
			"Copy Matrix(LZW)"
		],
		[
			"Show Matrix",
			"Show Matrix (LZW-Encoded)",
			"Show Base64 Code"
		]
	],
	color: "Color",
	colorArea: "Colorize Area",
	colorToBW: "Colors to B/W",
	colorTools: "Color",
	colorpicker: "Colorpicker",
	commandList: [
		[
			"Preview off",
			"Preview on",
			"Hide Preview",
			"Show Preview",
			"Hide Tools",
			"Show Tools",
			"Hide Presets",
			"Show Presets",
			"Set playback speed",
			"Run pattern as marquee",
			"User command",
			"Jump to Item"
		],
		[
			"this.usePreview=0",
			"this.usePreview=1",
			"$(this.previewDiv).slideUp()",
			"$(this.previewDiv).slideDown()",
			"$(this.toolsDiv).slideUp()",
			"$(this.toolsDiv).slideDown()",
			"$(this.presetsDiv).slideUp()",
			"$(this.presetsDiv).slideDown()",
			"$('#' + this.slider).slider({value:%value%});",
			"await Rec.runMarquee(%value%)",
			"",
			"this.i=%value%"
		]
	],
	content: "Content",
	copiedToClipboard: "copied to clipboard",
	copy: "Copy",
	copyAndPaste: "Copy & Paste",
	copyCssCode: "Copy CSS Code",
	copyMatrix: "Copy selected pixels",
	copyToClipboard: "Copy to board",
	createGrid: "Create Grid",
	createNewGridInSizeOf: "Create a new grid in size of",
	cssPatternGeneratorPlus: "CSS Pattern Generator Plus",
	delete: "Delete",
	delete0ErrorMessage: "Item '0' cannot be removed! This is the record head!",
	deleteThisItem: "Delete this item",
	details: "Details",
	directions: [
		[
			"Up",
			"Down",
			"Left",
			"Right"
		]
	],
	dot: "dot",
	dotPlural: "s",
	down: "Down",
	downloadPng: "Download PNG",
	drawOverlay: "Opacity",
	drawOverlayPixel: "Sum up opacity (in case < 100%)",
	drawRecorder: "Draw Recorder",
	drawRecorderStatus: "Draw Recorder Status",
	drawTools: "Draw",
	edit: "Edit",
	editItemNo: "Edit Item No",
	element: "Element",
	elementPlural: "s",
	ellipse: "Ellipse",
    english: "English",
	entry: "Entry",
	eraser: "Eraser",
	erasing: "erasing",
	error: "Error",
	execCommand: "Specials",
	eyedropper: "Eyedropper",
	fileIsNoImage: "The selected file is no image !",
	fileload: "Pattern from image",
	fill: "Fill Grid",
	filled: "filled",
	finish: "Finish",
	flexCoded: "Flex Version coded in 2020 by <font color='blue'>Manuel Pelzer</font>",
	font: "Font",
	fontSize: "Size",
	from: "from",
	getmatrix: "Show Matrix",
    german: "German",
	gradient: "Color gradient",
	headerData: "Header data",
	helpContent: `
    <h3><a>What is Patternify?</a></h3>
    <p>
        Patternify is a pixel editor that is able to put all your creativity in a JSON formated file, or plays a previous created record file.<br />
        Patternify was originally developed by Sacha Greiff as a pattern generator (<a href="http://www.patternify.com">http://www.patternify.com</a>)<br />and allowed it to create patterns with max. 10x10 pixels.<br />
        In 2020, the tool grew to Patternify Flex, a massively extended version with a variety of ways.
    </p>
    <br />
    <h3><a>New in this version</a></h3>
    <div>
        <ul>
            <li>Different Tools: Pixels, Lines, Rectangles (also filled), Ellipses, Parallelograms, Polygons and Text.</li>
            <li>Lines and Rectangles can also be used as an eraser</li>
            <li>Copy & Paste of grid cutouts, incl. clipboard and storage for later use</li>
            <li>The pattern can be positioned freely on the paint area</li>
            <li>Change the size of the paint area of ​​at least 4 pixels to up to 400x400 pixels.</li>
            <li>Images from HDD/SSD can be edited and changed in size.</li>
            <li>New ColorPicker ('Spectrum') for more flexibility.</li>
            <li>The integrated keyboard assignment is freely configurable.</li>
            <li>Graphical position indicator in keyboard mode.</li>
            <li>Record the progress of your artworks with the integrated recorder.</li>
            <li>The JSON encoded matrix can be displayed and copied to use when editing recordings.</li>
            <li>HTTP GET support for sending your drawings via link (with and without lzw-compression), as well as to select the grid size.</li>
            <li><u>Local Storage support:</u>
                <ul>
                    <li>Backup and restore of the entire tool, including possibly existing recordings</li>
                    <li>Keyboard configuration (can also be downloaded and integrated as a script)</li>
                    <li>Copy & Paste - Snippets</li>
                </ul>
            </li>
            <li><u>Some features of the Draw Recorder:</u>
                <ul>
                    <li>Recordings can be stored and loaded as a file</li>
                    <li>Multiple recordings in a file are supported</li>
                    <li>Playback icons for each single recording are in the 'Records' tab below the toolbar</li>
                    <li>View/edit/delete the individual recording steps (if enabled via config)</li>
                    <li>Add to new elements at any point of recording</li>
                    <li>Complex elements (such as all shapes, texts, operation of the colorpicker, drawing a matrix or changing the opacity) can optionally be inserted 'live' or values-based</li>
                    <li>If necessary, the grid automatically changes the size to play recordings correctly</li>
                    <li>'Special actions' (those you can not draw) can be selected from a list and will be added to the recording (e.g. change play speed, let pattern run like a banner over the screen, instructions or running functions, show or hide areas, and more)</li>
                    <li>There is a demo (press F12)</li>
                    <li>To give you an idea of ​​the possibilities, press F8 and select the demo. Click on one of the '+' icons behind the entries to create a new item.</li>
                </ul>
            </li>
        </ul>
        <hr />
    </div>
    <br />
    <h3><a>Instructions</a></h3>
    <div>
        <h4><u>Drawing</u></h4>
        <div>
            <p>Draw your pattern on the draw area, while you can set the size of the active area with the X and Y limitors.<br>Choose a tool out of the toolbar. If you start drawing a shape (line, rectangle,
            ellipse, parallelogram, polygon), the shape to be drawed appears as a dotted line as soon as the mouse moves. This gives you a preview
            on what will be drawn as soon as you press the left mouse button again. For polygons, each mouse click adds another line to the polygon. The line, that 'hangs' currently on the mouse pointer or position cursor, can
            be reversed with the 'Undo' key / tool. Double-click to finally draw the polygon.<br />You can enter hexadecimal color values manually ​​in the colorpicker, or click on the color box to
            open the color picker and choose the color there. If the entered color value is 4 or 8 digits, the last digit (or the last two digits at 8-digit input) is interpreted as opacity value. Of course you can
            also set the opacity via the slider.<br />If unwanted things happen when drawing, use the 'Undo' tool to undo it.<br> When your work is done, you can download your work as image by clicking on the 'Download PNG' button
            (an 8-digit random name is assigned like 'abcdefgh.png'), or copy the BASE64 code to your CSS file.</p>
            <hr />
        </div>
        <h4><u>Recording</u></h4>
        <div>
            <p>To have fun with friends, the recorder was installed. So you can hold all your actions. You can save the recording as a .prec file. Of course you can also play any recording from your friends.
            If the playback speed is set to 1 (standard is 3), the recording is played in real time! You can set the speed between 0.5 (half speed) and 10. To play recordings, you can press F3
            to open the recorder and click the play button there. Or select 'Records' in the preset tabs under the toolbar. Or press F12 to start playback immediately (starting at the
            first recording, if several recordings are available).</p>
            <hr />
        </div>
        <h4><u>Edit local images</u></h4>
        <div>
            <p>You can open local images. If it should be too big, you can simply specify a new size. The image loader can be found in the toolbar.</p>
            <hr />
        </div>
        <h4><u>Grid Size</u></h4>
        <div>
        <p>You can change the size of the grid at any time. Click on the menu icon (or press F1) to open the appropriate area. If you have already drawn something, make sure that the option 'Take pattern'
            is turned on. If you have forgotten that once, no problem, there is still the 'Undo' button.</p>
            <hr />
        </div>
        <h4><u>Using the keyboard</u></h4>
        <div>
            <p>If you press F4, the keyboard layout table appears. In keyboard mode, you can use keyboard and mouse at the same time. If you draw shapes, move the position cursor to the start position, press the space bar, move to
            end position and press the space bar again. For polygons, you can repeat this process as often as you like. Now the desired shape is drawn (for polygones double tap the space bar). ESC aborts the started oparation.</p>
            <hr />
        </div>
        <h4><u>Share patterns and graphics</u></h4>
        <div>
            <p>When you have finished a graphic that you want to share with friends - nothing easier than that. You send your graphic as a URL.</p>
            <p>It works like this:</p>
            <ul>
                <li>Click 'Show Matrix' in the toolbar (for very large graphics, click a second time to use LZW compression).</li>
                <li>Click in the matrix code. 'Matrix copied' appears and the matrix has copied to the clipboard.</li>
                <li>Click in your browser's address bar at the end of the address after the '...html' and add: '?matrix=' (without the quotation marks, of course).</li>
                <li>Press<tt><span style="vertical-align: baseline; border: #ccd 1px solid; border-radius: 4px; margin: 2px; padding: 1px 5px">CTRL</span></tt> +<tt><span style="vertical-align: baseline; border: #ccd 1px solid; border-radius: 4px; margin: 2px; padding: 1px 5px">V</span></tt> to add the matrix.</li>
            </ul>
            <p>
                That was it. if you now press the<tt><span style="vertical-align: baseline; border: #ccd 1px solid; border-radius: 4px; margin: 2px; padding: 1px 5px">ENTER</span></tt>
                button, Patternify is reloaded and the graphic is already on the grid. You can send this link to your friends (of course this only works if you have saved it locally in the same folder).
            </p>
            <hr />
        </div>
        <h4>
            <u>Defined grid size via HTTP GET</u>
        </h4>
        <div>
            <p>If desired, Patternify Flex can be started with a predefined grid size. The HTTP GET method is used for this. But it also works with the hash methode.</p>
            <ul>Here are the following options:<li>.../index.html<a>?width=32&height=32</a> ...sets the grid to 32 x 32 pixels.</li>
                <li>.../index.html<a>?xcursor=16&ycursor=16</a> ...sets the delimiters to 16 x 16 pixels.</li>
                <li>.../index.html<a>?width=32&height=32&xcursor=16&ycursor=16</a> ...combines all four values ​​from before.</li>
                <li>.../index.html<a>?size=[32,32]&cursor=[16,16]</a> ...an abbreviated notation.</li>
                <li>.../index.html<a>?matrix={matrix: (matrix), pixelsX: 32, pixelsY: 32, xcursor: 16, ycursor: 16}</a> ... for the sake of completeness the HTTP GET method to call an entire matrix, where (matrix) means the matrix (as described previously).</li>
            </ul>
            <p>There are more things you can do using the HTTP GET method as well as using the hash (#). More informations in the readme.md.</p>
            <hr />
        </div>
        <h4>
            <u>A note about the recorder</u>
        </h4>
        <div>There is a possibility to include javascript instructions in the recording (e.g. the demo uses this function). The entered code is checked, but only for function, not for content. Since you can basically enter any kind of code here,
            this method can be described as potentially not entirely harmless. But I also have this option if I open the console and enter code there, which is possible with pretty much every browser. Therefore, through
            this feature doesn't implement anything that wasn't possible before. That's why I chose this role. It is intended for recorder related instructions and nothing else.
            <hr />
        </div>
    </div>
    <br />
    <h3>
        <a>Have fun!</a>
    </h3>
    <p>I hope this tool brings joy! In case of problems or bugs, please send a short Email to <a href="mailto:manuel.pelzer@yahoo.de">me</a>!</p>`,
	highlightTool: "Highlight Tool",
	inHeight: "in height",
	inWidth: "in width",
	information: "Information",
	inputField: "Input Field",
	inputFields: [
		[
			"Resize: X value",
			"Resize: Y value",
			"Base64 Textfield",
			"Image: New Width",
			"Image: New Height",
			"Color Field (Hex)",
			"Opacity Field (0-100)",
			"Text to be drawn",
			"Font size",
			"Font: Acme",
			"Font: Dock11",
			"Font: Sans Serif",
			"Font: Monospace"
		],
		[
			"sizewidth",
			"sizeheight",
			"base64-code",
			"imgwidth",
			"imgheight",
			"colorpicker",
			"opacity",
			"draw-text",
			"font-size",
			"font1",
			"font2",
			"font3",
			"font4"
		]
	],
	invalidFileFormat: "Invalid file format!",
	isNoFunction: "is no function",
	item: "Item",
	items: "Items",
	jumpToItem: "Jump to item",
	keepAlpha: "Alpha Channel",
	keepAlphaWhenColoring: "Do not consider the<br>alpha channel in color change<br>(will retain)",
	keyConfig: "keyboard config",
	keysContent: `
    <h3><a>Using the keyboard</a></h3>
    <div style="padding-left: 10px">
        <h4><u>Draw Cursor</u></h4>
        <div>
            <p>
                After switching to keyboard mode with&nbsp;
                <tt><span style="vertical-align: baseline; border: #ccd 1px solid; border-radius: 4px; margin: 2px; padding: 1px 5px">%toggleDrawCursor%</span></tt>
                &nbsp;the draw cursor appears on the paint area. With the arrow keys, it can be moved around, but it also follows the mouse pointer when it is moved.
            </p>
            <hr>
        </div>
        <h4><u>Using the different erasers</u></h4>
        <div>
            <p>
                Line tool: Press&nbsp;
                <tt><span style="vertical-align: baseline; border: #ccd 1px solid; border-radius: 4px; margin: 2px; padding: 1px 5px">%eraser%</span></tt>
                &nbsp;to switch between drawing and erasing. The same applies to rectangles. For the rectangles, there is another mode: after the rectangle tool has been selected with&nbsp;
                <tt><span style="vertical-align: baseline; border: #ccd 1px solid; border-radius: 4px; margin: 2px; padding: 1px 5px">%rectangle%</span></tt>
                &nbsp;, press&nbsp;
                <tt><span style="vertical-align: baseline; border: #ccd 1px solid; border-radius: 4px; margin: 2px; padding: 1px 5px">%rectangle%</span></tt>
                &nbsp;again. Now the rectangles are filled out. In both modes,&nbsp;
                <tt><span style="vertical-align: baseline; border: #ccd 1px solid; border-radius: 4px; margin: 2px; padding: 1px 5px">%eraser%</span></tt>
                &nbsp;switches between drawing and erasing.
            </p>
            <hr>
        </div>
        <h4><u>Pattern Tabs</u></h4>
        <div>
            <p>
                If you want to use a pattern from the pattern tabs, you have two options:
                <ul>
                    <li>1. Click the pattern, the grid adapts automatically.</li>
                    <li>2. If this is undesirable (because the Grid e.g. is clearly bigger and it should stay), press &nbsp;<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAOCAYAAAA45qw5AAAAX0lEQVQ4je3VQQrAMAhEUQ/3b93DTXclNGNXDoVSwU0WviDGVC0BKJnlApB0RHPDOzRxmQt/QlOdAGQL31syjVu4G4JJfIO7CVzPv9fqH47BrrBbd+PoqyvTPZv0J3ECh1mq48cmZ6QAAAAASUVORK5CYII=" title="Shift key" alt="shift" /> , then click on the pattern. If the pattern is smaller than the grid, this retains its size.</li>
                </ul>
            </p>
            <hr>
        </div>
    </div>
    <br />
    <h3 id="keys-settings"><a>Keyboard Layout</a></h3>
    <div>
        <br>
        <table id="keyTable" width="100%">
            <tr>
                <th style="text-align: left; padding-left: 15px; width: 50%">Only in keyboard mode </th>
                <th style="text-align: right; padding-right: 15px; width: 50%"><a id="editKeysButton" onclick="Keys.toggleEditKeys()" style="position: relative; bottom: 5px; cursor: pointer; border: #999 1px solid; border-radius: 5px; padding: 3px;">Edit</a></th>
            </tr>
            <tr>
                <td colspan="2" align="center">
                    <table align="center" width="90%" class="list" cellspacing="0">
                        <tr>
                            <td width="30%"><span class="key" data-key="draw">%draw%</span></td>
                            <td width="70%">
                                - Draw/erase pixels<br />
                                - Start/finish drawing/erasing shapes<br />
                                - With Polygons: Double tap to draw the polygon
                            </td>
                        </tr>
                        <tr>
                            <td><br /><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAeCAYAAABqpJ3BAAAAmklEQVRYhe2WSw6AMAhEezhu7eFwZwypSi3tAGESlg6+8gmtGYiI+E9Y5DYRETHzMRTuAb6gXAPc2yQcQK/XQwGkaKEC2K0CQKsA0EpxSoQ+5kozsig/1MNiAKEeq5KPrlEzAI0RAuApR/eW9wrQe+zrQ+3QrAbQ/kO+CqSYAW243kKzAG89GwJAQoSrQPgW2u6h3f8yZHKUxwlKd1olPt9T5gAAAABJRU5ErkJggg==" /></td>
                            <td>
                                - Move the draw cursor<br />
                                - Adjust the position of the current draw steps<br />
                                - move the pattern around
                            </td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="up">%up%</span></td>
                            <td>Up</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="down">%down%</span></td>
                            <td>Down</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="left">%left%</span></td>
                            <td>Left</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="right">%right%</span></td>
                            <td>Right</td>
                        </tr>
                    </table>
                    <br>
                </td>
            </tr>
            <tr>
                <th colspan="2" style="text-align: left; padding-left: 15px">Keys available at any time</th>
            </tr>
            <tr>
                <td colspan="2" align="center">
                    <table align="center" width="90%" class="list" cellspacing="0">
                        <tr>
                            <td width="30%"><span class="key" data-key="toggleDrawCursor">%toggleDrawCursor%</span></td>
                            <td width="70%">Toggle keyboard/mouse mode</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="break">%break%</span></td>
                            <td>
                                - Abort drawing a started shape<br />
                                - Close open areas<br />
                                - Stop recording/playback<br />
                                - Left keyboard mode<br />
                                - Close the record editor
                            </td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="pencil">%pencil%</span></td>
                            <td>Pencil</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="eraser">%eraser%</span></td>
                            <td>Eraser</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="eyedropper">%eyedropper%</span></td>
                            <td>Eyedropper</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="line">%line%</span></td>
                            <td>Line</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="rectangle">%rectangle%</span></td>
                            <td>Rectangle</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="parallelogram">%parallelogram%</span></td>
                            <td>Parallelogram</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="polygon">%polygon%</span></td>
                            <td>Polygon</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="ellipse">%ellipse%</span></td>
                            <td>Ellipse</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="move">%move%</span></td>
                            <td>Move draw area</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="fill">%fill%</span></td>
                            <td>Fill all</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="clear">%clear%</span></td>
                            <td>Clear all</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="minimize">%minimize%</span></td>
                            <td>Minimize</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="text">%text%</span></td>
                            <td>Toggle Text Area</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="toggleInfo">%toggleInfo%</span></td>
                            <td>Resize the grid</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="toggleHelp">%toggleHelp%</span></td>
                            <td>Help / Information</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="toggleRecorder">%toggleRecorder%</span></td>
                            <td>Recorder</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="toggleKeys">%toggleKeys%</span></td>
                            <td>Keyboard Assignment</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="reload">%reload%</span></td>
                            <td>Reload site (browser refresh)</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="fileload">%fileload%</span></td>
                            <td>Open image</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="getmatrix">%getmatrix%</span></td>
                            <td>Toggle between base64 code, matrix and<br>LZW coded matrix</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="rec_edit">%rec_edit%</span></td>
                            <td>Open / edit recordings</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="openRecordFile">%openRecordFile%</span></td>
                            <td>Load records from file</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="saveRecordFile">%saveRecordFile%</span></td>
                            <td>Save records to file</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="rec_rec">%rec_rec%</span></td>
                            <td>Start recording</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="rec_play">%rec_play%</span></td>
                            <td>Start playback</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="rec_stop">%rec_stop%</span></td>
                            <td>Stop playback / recording</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="opacityDown">%opacityDown%</span></td>
                            <td>Less opacity</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="opacityUp">%opacityUp%</span></td>
                            <td>More opacity</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="undo">%undo%</span></td>
                            <td>Undo</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="redo">%redo%</span></td>
                            <td>Redo</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="confirm">%confirm%</span></td>
                            <td>Confirm / Run<br />depending on current situation</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="focusColor">%focusColor%</span></td>
                            <td>Enter color manually</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="picker">%picker%</span></td>
                            <td>Toggle color picker</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="focusOpacity">%focusOpacity%</span></td>
                            <td>Enter opacity manually</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="backup">%backup%</span></td>
                            <td>Create backup</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="restore">%restore%</span></td>
                            <td>Load backup</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="destroy">%destroy%</span></td>
                            <td>Erase backup</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="clipboard">%clipboard%</span></td>
                            <td>Toggle clipboard</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="copy">%copy%</span></td>
                            <td>First tap: Select pixels for copying to clipboard<br />Second tap: Copy selected pixels to clipboard</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="paste">%paste%</span></td>
                            <td>Insert last copy from clipboard</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="remove">%remove%</span></td>
                            <td>Delete copy from clipboard</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="change-color">%change-color%</span></td>
                            <td>Replace a specific color in the entire grid with a new color</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="clear-color">%clear-color%</span></td>
                            <td>Remove a specific color from the entire grid</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="color-bw">%color-bw%</span></td>
                            <td>Convert colors to black and white</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="color-area">%color-area%</span></td>
                            <td>Color a contiguous area in chosen color</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="clear-area">%clear-area%</span></td>
                            <td>Delete a contiguous area of the same color</td>
                        </tr>
                        <tr>
                            <td><span class="key" data-key="clone">%clone%</span></td>
                            <td>Clone a part of the grid</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
    <br />
    <p id="keySaveInfo" style="border: #999 3px solid;" align="center">
        To permanently integrate a custom key assignment, you can<br /><a style="cursor: pointer;" onclick="Keys.downloadConfig()"> download the current key layout file </a> and move it to the js subfolder.<br />
        If the browser supports the Local Storage, you don't have to care about it, the key assignment is automatically stored.
    </p>`,
    keyNames: {
		End: "End",
		Home: "Home",
		alt: "Alt",
        tab: "Tab",
		backspace: "Backspace",
		ctrl: "Control",
		ctx: "ContextMenu",
		del: "Delete",
		down: "ArrowDown",
		enter: "Enter",
		esc: "Escape",
		ins: "Insert",
		left: "ArrowLeft",
		pageDown: "PageDown",
		pageUp: "PageUp",
		right: "ArrowRight",
		shift: "Shift",
		space: "Space",
		up: "ArrowUp"
	},
    hotkeyNames: {
        End: "End",
		Home: "Home",
		alt: "Alt",
		backspace: "Bksp",
		ctrl: "Ctrl",
		ctx: "Ctx",
		del: "Del",
        enter: "Enter",
		esc: "Esc",
		ins: "Ins",
        pageDown: "PgDn",
		pageUp: "PgUp",
        shift: "Shft",
		space: "Spc",
        left: "&Larr;",
        up: "&Uarr;",
        right: "&Rarr;",
        down: "&Darr;"
    },
	keysSaved: "Saved",
    language: "Language",
	left: "Left",
	line: "Line",
	lineA: "Start line",
	linesBandC: "Side lines",
	load: "Load",
	loadImage: "Load Image",
	loaded: "loaded",
	madeOf: "consists of",
	mark: "Mark",
	marqueeMatrix: "Banner matrix",
	maxSizeIs400: "Sorry, max. size is 400 x 400 Pixel!",
	mergeTheseRecords: "Merge these records",
	minSizeis4: "Sorry, smallest size is 4 pixel!",
	minimize: "Minimize",
	misc: "Misc",
	modes: [
		"New Record",
		"Pixel",
		"Pattern",
		"Set X- and Y-Limit (Cursors)",
		"Position-Pointer",
		"jQuery Call",
		"Rectangle",
		"Line",
		"Move Grid",
		"Color Change",
		"Opacity Change",
		"Text Input",
		"Highlight Tool",
		"Ellipse",
		"Open and close Areas",
		"Specials",
		"Run Function",
		"New Grid Config",
		"Parallelogram",
		"Polygon",
		"Text marquee"
	],
	move: "Move pattern",
	moveGridDirection: "Move grid in direction",
	moveTools: "Move",
	name: "Name",
	nameForThisRecord: "Name for this Record",
	nessesaryGridSize: "Grid size",
	newHeight: "New height",
	newItem: "New Item",
	newWidth: "New width",
	noBackupAvailable: "No backup available to perform the requested action.",
	noBackupDone: "The backup cannot be saved.",
	noInputFound: "Found no input, action aborted.",
	none: "none",
	of: "of",
	ok: "Ok",
	oldSchool: "Old School",
	onlyTheFirst: "Only the first",
	opacity: "Opacity",
	openArea: "Open Area",
	openMenu: "Open help, key assignment, infos...",
	options: "Options",
	originalCoded: "Original coded and designed by <font color='red'>SachaGreif</font>",
	originalSize: "Original size",
	parallelogram: "Parallelogram",
	paste: "Paste",
	pasteMatrix: "Paste\n\nChoose 'Paste Preview' first, to move the copy to the desired place.",
	pattern: "Pattern",
	pause: "Pause",
	pencil: "Pencil",
	pin: "Fix",
	pixel: "pixel",
	play: "Play",
	playback: "Playback",
	pleaseSelect: "Please Select",
	polygon: "Polygon",
	preview: "Preview",
	previewMatrix: "Insert Preview",
    processed: "Processed",
	ready: "Ready",
    rec_edit: "Edit",
    rec_play: "Play",
    rec_stop: "Stop",
    rec_rec: "Record",
	recItems: [
		[
			"Date",
			"Name",
			"Matrix",
			"X-Limit",
			"Y-Limit",
			"X-Fields total",
			"Y-Fields total",
			"Color Red (0-255)",
			"Color Green (0-255)",
			"Color Blue (0-255)",
			"Opacity (0.01-1.00)",
			"Status of the resize checkbox 'Take Pattern'",
			"Status of the image load checkbox 'Original size'"
		],
		[
			"Pixel X Coordinate",
			"Pixel Y Coordinate",
			"Draw(1) or Erase(0)"
		],
		[
			"Matrix"
		],
		[
			"X Limit",
			"Y Limit"
		],
		[
			"X Coordinate",
			"Y Coordinate"
		],
		[
			"jQuery-Call"
		],
		[
			"Start X Coordinate",
			"Start Y Coordinate",
			"Done? (0=no, 1=yes)",
			"Eraser? (0=no, 1=yes)",
			"Target X Coordinate",
			"Target Y Coordinate",
			"Filled? (0=no, 1=yes)"
		],
		[
			"Start X Coordinate",
			"Start Y Coordinate",
			"Done? (0=no, 1=yes)",
			"Eraser? (0=no, 1=yes)",
			"Target X Coordinate",
			"Target Y Coordinate"
		],
		[
			"Direction"
		],
		[
			"Red (0 - 255)",
			"Green (0 - 255)",
			"Blue (0 - 255)",
			"Opacity (0.01 - 1.00)"
		],
		[
			"Opacity (in%)"
		],
		[
			"Input-Field",
			"Content"
		],
		[
			"Highlight Tool"
		],
		[
			"Start X Coordinate",
			"Start Y Coordinate",
			"Done? (0=no, 1=yes)",
			"Eraser? (0=no, 1=yes)",
			"Target X Coordinate",
			"Target Y Coordinate"
		],
		[
			"Open this Area"
		],
		[
			"Specials"
		],
		[
			"Function name",
			"Function Parameter",
			"1=async function"
		],
		[
			"Matrix",
			"X-Field Limit",
			"Y-Field Limit",
			"X-Fields total",
			"Y-Fields total"
		],
		[
			"Line 1 start X",
			"Line 1 start Y",
			"Line 1 end X <br /> Side lines start X",
			"Line 1 end Y <br /> Side lines start Y",
			"Line 1 finished? (0=no, 1=yes) ",
			" Side lines end X ",
			" Side lines end Y ",
			" Done? (0=no, 1=yes) "
		],
		[
			"Dot #%count%X:",
			"Dot #%count%Y:",
			"Done (0=nein, 1=ja)?"
		],
		[
			"Text",
			"Font",
			"Size"
		],
		[
			"Element-ID",
			"Value"
		]
	],
	record: "Record",
	recordDate: "Record Date",
	recordPlural: "s",
	recorder: "Recorder",
	recording: "Recording",
	records: "Records",
	rectangle: "Rectangle",
	redo: "Redo",
	reloadYourPattern: "Reload your Pattern?",
	removeFromLocalStorage: "Remove all copies from the board",
	removeMatrix: "Remove this copy",
	removedFromLocalStorage: "The board is empty",
	resizeGrid: "Resize Grid",
	restore: "Restore",
	restoreDone: "Backup has been restored",
	restoreSure: "Restore Backup?",
	right: "Right",
	rotate: "Rotate\n    Rotates the grid by 90deg to the right.",
	rotateGrid: "Rotate clockwise",
	savedAs: "Saved as",
	selectMatrix: "Select\n\nSelect the pixels\n     to be copied on the grid.\n 1. Use Pencil, Rectangle, Line\n     or any other draw tool\n     to select an area.\n 2. Click 'Copy', the area is copied.",
    setTreshold: "Specify how precise the value for the color to be replaced should be",
	setupMistake: "Setup Mistake!",
	showContentWarning: "!!! ATTENTION !!!\n\nChanging these items could make the record crash ! \nBe sure that you know, what you do!",
	showItems: "Open Board",
	showItemsMsg: "Esc=Cancel, Click on item=Paste",
	speed: "Speed",
	start: "Start",
	startOnlineSession: "Start online session",
	stop: "Stop",
	storeTemporarily: "Do you want me to store your work temporarily, to go on drawing after Playback?",
	takePattern: "Take pattern",
	text: "Text",
	text2Grid: "Text",
	textAreaAltered: "Text Area altered",
	textMarquee: "Text Marquee",
	time: "Time",
	timeInMs: "Time in ms",
	timeValue: "Time value",
	to: "to",
	toolList: [
		[
			"Undo",
			"Pencil",
			"Eraser",
			"Eyedropper",
			"Line",
			"",
			"Rectangle",
			"",
			"Ellipse",
			"",
			"Move",
			"Parallelogram",
			"",
			"",
			"Polygon",
			"",
			"Load graphic",
			"Show matrix",
			"Rotate",
			"Text",
			"Change color",
			"Delete color"
		],
		[
			"undo",
			"pencil",
			"eraser",
			"eyedropper",
			"line",
			"line",
			"rectangle",
			"rectangle",
			"ellipse",
			"ellipse",
			"move",
			"parallelogram",
			"parallelogram",
			"parallelogram",
			"polygon",
			"polygon",
			"fileload",
			"getmatrix",
			"rotate",
			"text",
			"change-color",
			"clear-color"
		]
	],
	tools: "Tools",
    treshold: "Precision",
	undo: "Undo",
	unpin: "Unfix",
	up: "Up",
	useAntiAliasing: "Use anti aliasing",
	userCommand: "User Command",
	warning: "Warning!",
	wrongFormat: "Wrong format!",
	wrongImageSize: "Wrong image size !"
};
