[German version](https://github.com/ManuelPeh76/PatternifyFlex/readme_de.md)
# Patternify Flex

**Patternify Flex** is a versatile pixel editor and compact graphics toolkit that lets you design, save, and play pixel patterns, graphics, and animations directly in your browser.

Based on the original [Patternify by Sacha Greiff](http://www.patternify.com), Patternify Flex expands the concept significantly: Instead of a fixed 10x10 pixel grid, Patternify Flex offers flexible grid sizes up to **400x400 pixels**, extensive drawing tools, text tools, and the ability to export your work as a JSON file or play animations.

## Features
- **Extremely flexible grid size:** Adjustable up to 400x400 pixels
- **Various drawing tools:** Shapes, lines, text, patterns
- **JSON export & playback:** Drawings can be saved and played back later
- **Parameter control:** Start the editor with custom settings directly via the URL
- **Backup & keybindings:** Project versions and custom keyboard shortcuts are saved in LocalStorage
- **Multilingual:** User interface available in German and English
- **Live preview and interactive operation**
- **Matrix import:** Drawings can be directly imported and displayed as a matrix

## Quick Start
1. **Download:**
Clone or download the project.


3. **Start:**
Open `index.html` directly in your browser. You can start a local web server (e.g., with Python) and open the tool through it, or simply double-click it, for example, with Firefox (the file protocol often works without problems).

4. **Info:**
Further details and tips, keyboard shortcuts and how to customize them, as well as the recorder, can be found in the tool menu (three lines).

After opening the menu, you'll see three icons at the top:
- i: Information about this tool
- Camera: The recorder is located here
- Keyboard: Here you'll find all the keyboard shortcuts and can also change the key bindings. After changes, the new bindings are saved in the browser's local storage, so your keyboard layout is immediately available every time you open Patternify Flex. You can also download your custom key bindings ("customKeys.js"). Copy this file to the "js" subfolder. But be careful! First, rename the original "customKeys.js" file so it can be restored in case of key binding issues.

## URL Parameters & Configuration
Patternify Flex can be conveniently controlled via URL parameters or hash configurations, for example:

| Parameter | Meaning |
|-------------------|---------------------------------------------------------|
| idleTime | Delay after minimization (e.g., after 3000ms) |
| width | Grid width |
| height | Grid height |
| xcursor | Maximum pixels per row |
| ycursor | Maximum pixels per column |
| size | Shorthand notation for width & height |
| cursors | Shorthand notation for xcursor & ycursor |
| color | Default color & transparency |
| destroybackup | Deletes backups in LocalStorage |
| destroykeys | Deletes keybindings in LocalStorage |
| lang | Language setting (`de`/`en`) |
| matrix | Passes a pattern matrix for the grid |

**Example URLs:**
- Start with a 32x32 pixel grid: `/index.html?width=32&height=32`
- Limit the grid to 16x16 pixels: `/index.html?xcursor=16&ycursor=16`
- Combine: `/index.html?size=[32,32]&cursors=[16,16]`
- Pass the matrix: `/index.html?matrix={...}`

Using a **hash** (`#width=32&height=32`) instead of a **query** (`?width=32&height=32`) allows changes to be applied without reloading.


## Matrix Example
A simple matrix pass that creates a pattern in the grid:

```json
{
"matrix": [
[[255,255,64,1],[255,255,64,1],[255,255,64,1],[255,255,64,1],[255,255,64,1]],
[[255,255,64,1],0,0,0,[255,255,64,1]],
[[255,255,64,1],0,0,0,[255,255,64,1]],
[[255,255,64,1],0,0,0,[255,255,64,1]],
] [[255,255,64,1],[255,255,64,1],[255,255,64,1],[255,255,64,1],[255,255,64,1]]
],
"xcursor":5,
"ycursor":5,
"pixelsX":10,
"pixelsY":10
}
```

Of course, the matrix is ​​appended to the URL WITHOUT spaces or line breaks; the representation here is for clarity only.

This example shows a 10x10 pixel grid with a 5x5 pixel rectangle on it, featuring a yellow border and a transparent interior.

## Installation
No complicated installation:
- Download or git clone:
```sh
git clone https://github.com/ManuelPeh76/PatternifyFlex
```

Open `index.html` in your browser. The file: protocol works perfectly here.

## Using the Recorder and Rec Editor in Patternify Flex
### **1. What is the Recorder?**
The **Recorder** records all drawing actions you perform on the grid: drawing steps, color changes, tool changes, etc. The result is a recording-based “.rec” file that you can export (download), replay, step through, or edit selectively.

**Typical use cases include:**
- Playing back animations of your patterns
- Recording tutorials or demo sequences
- Saving reusable drawing sequences

---

### **2. Recorder Operation**
Open the interface menu (three lines, located at the top behind "Pixel Editor Plus") and click on the camera icon to open the Recorder (F3 serves the same purpose).

#### a) Start/Stop Recording
- Select one of the buttons depending on whether you want to record, play back, pause, etc.
- Alternatively: F11 starts recording, Ctrl+F11 starts playback, Ctrl+F12 stops recording and pauses playback (playback is completely stopped by pressing Ctrl+F12 again, or resumed by pressing Ctrl+F11).
- During recording, all actions (brush strokes, shapes, color changes, etc.) including the elapsed time are saved in a list.
- Finished? Click Stop (or press Ctrl+F12) to end the recording.

#### b) Play/Pause
- The "Play" button in the recorder (or Ctrl+F11) plays the currently recorded .rec file step-by-step on the grid – ideal for previewing!
- You can pause (Pause button, Ctrl+F12), resume, and browse through recordings using "Next/Prev".

#### c) Saving & Loading
- You can download your recording (file extension: ".rec") using the "Save" button in the recorder (or F10).
- You can load and play or edit an existing .rec file (e.g., from previous sessions or other users) using the "Load" button (or F9).

#### d) Speed
- You can adjust the playback speed in the recorder (default: 3x).

--

### **3. Rec Editor – Editing Recordings**
This is where the "pro mode" begins: Every recorded element in your record log can be individually viewed, modified, deleted, moved, or added to.

#### a) Accessing/Editing Recordings
- After stopping the recording, open the editor with F8, or open the recorder with F3 and click "Details" on the far right, which also opens the editor.
- A list view of all recordings will appear (only the demo recording will be visible if you haven't made any of your own recordings yet).
- Clicking on a recording opens the actions that comprise it.

#### b) Step-by-Step Editing
- Each entry can be **viewed, edited, moved, or deleted**:
- Clicking on a list entry opens a modal/editor window with fields for timestamp, action type, coordinates, colors, etc.
- Individual entries can be deleted to remove errors or unwanted actions.
- You can manually add new actions later using the plus symbol – for example, a specific color change or a pause.
- Many actions allow you to add more actions in "Live" mode: Click the plus icon next to an entry and select "Live Mode." The editor will then close and a message will appear ('Press Enter to exit Live Mode'). Everything you do now will be recorded. After pressing Enter, the editor will reopen and the actions will be added to the recording.
- Entries can be rearranged to optimize animation sequences, for example.

#### c) Complex Edits
- The recording editor supports copying entries, pasting patterns (matrix), merging/splitting recordings, and precisely adjusting parameters such as time intervals and coordinates.
- Metadata such as pattern size or cursor limits can also be edited via the context menu or additional settings.

#### d) Preview & Test
- After making changes, the entire recording can be replayed or previewed before you save or export it.

---

### **Practical Tips**
- **Experiment!** The best way to master the Recorder and Editor is to simply record a drawing, save it, and then selectively edit individual steps.
- **Timing:** You can use the Editor to change the playback times of individual steps (e.g., to deliberately set longer pauses).
- **Complex Animations:** You can combine and reuse individual .rec files to create complex pattern videos or pixel films.

---

### **In Short:**
With the Recorder and Rec Editor, you can transform Patternify Flex from a pixel editor into a smoothA versatile animation and sequence toolkit – perfect for creative pixel playbacks, tutorials, showcases, or custom pattern macros.

---

## **Technical Notes (Background, File Format, and Description)**

- Recordings are stored as an array of actions (“recLog”). Each action contains a timestamp, type (e.g., Draw, Fill, Rectangle, Ellipse, MoveCursor, etc.), and various parameters depending on the type.
- Editing is therefore not limited to simple pixel descriptions but allows you to create actual “sequence scripts” for pixel animations or interactive patterns.
- An example of how an extract from a .rec file (JSON) is structured, as well as the basic structure of the rec array, can be found below.  

The parent element of all rec data (the 'recLog' array) consists of arrays corresponding to individual recording sessions. Each array in the Reclog array represents a recording of actions and is displayed as a cassette icon in the UI (in the "Recordings" tab). When you play a recording (e.g., by clicking one of the cassette icons), only the content of that recording is played, and playback stops when the recording ends. You can use the forward and back buttons in the player to play the next or previous recording.
Each recording, in turn, consists of many elements, each corresponding to an array. These are the individual actions the user performed during the recording.

```
recLog = [                                ← Parent Array
             [                            ← First Recording
                 [0, 0, [matrix]],        ← Header (is always the first element of a recording)
                 [delay, mode, [item]],   ← Action 1
                 [delay, mode, [item]],   ← Action 2
                 [delay, mode, [item]],   ← Action 3
                 ....
             ], [                         ← Second Recording
                 [0,0,[matrix]],          ← Header
                 [delay, mode, [item]],   ← Action 1
                 [delay, mode, [item]],   ← Action 2
                 [delay, mode, [item]],   ← Action 3
                 ....
             ]
         ];
```

### An Example Recording

```
recLog = [
           [
               [0, 0, [matrix]],              ← The header of a recording always consists of
                                                the action: Delay 0, Tool 0
                                                and a start matrix. This is rendered onto the grid
                                                at the beginning of playback.
             [100,1,[0,0,1]],                 ← Next action: Delay by 100ms, select the "Pixel" tool (1)
                                                and draw a pixel at x/y coordinate 0/0.
             [100,4,[18,10,0,1,null,null],1]  ← Wait 100ms, then switch to the Line tool (4), activate
                                                the eraser, and set 18/10 as the starting point for the eraser line.
           ]
         ];
```
### Action Structure

```
An action is structured as follows: [Delay in ms, Tool Number, [Action Array](,ID)]

Delay   Details (varies depending on the tool)
 ↓       ↓
[0,0,[matrix]]
   ↑
  Tool
  
The header is ALWAYS the first action of a recording!
It contains the matrix that is rendered onto the grid at the start of playback.
Example of drawing a rectangle:

        Rectangle   Eraser?
             | StartY |   EndY  Shape ID (important for editing in the Rec Editor)
             ↓    ↓   ↓    ↓     ↓
Action: [275,6,[1,2,1,0,16,23,0],1]     ← Wait 275ms, then finish drawing the rectangle
          ↑     ↑   ↑   ↑     ↑           from x1/y2 to x16/y23.
          |  StartX |  EndX   |
        Delay   Finished?  Filled?
        
- EndX == EndY == NULL means: This is the beginning of the shape.
- The eraser is available for pixels, lines, and rectangles.
- The ID exists only for lines, rectangles, polygons, parallelograms, and ellipses.
```

Suppose you want to delete a drawn rectangle (i.e., all individual actions of this shape) in the editor.
The editor searches for the beginning of the shape (where endX=null and endY=null), reads the ID there,
and then deletes all actions with the same ID. This is provided if the "Delete shapes as a whole" checkbox is selected;
otherwise, only the individual action next to which the minus symbol was clicked will be deleted.

### The following list contains all options for all tools:
```
Action:
    [Delay, Tool, [Details]]
              ↓         ↓
              0: HEADER
                        0: Date
                        1: Name
                        2: Matrix
                        3: X-Limit
                        4: Y-Limit
                        5: Total X-Fields
                        6: Total Y-Fields
                        7: Color Red (0-255)
                        8: Color Green (0-255)
                        9: Color Blue (0-255)
                        10: Opacity (0.01-1.00)
                        11: Status of the resize checkbox 'Take Pattern' 
                        12: Status of the image load checkbox 'Original size' 
              
              1: SINGLE PIXEL 
                        0: X coordinate 
                        1: Y coordinate 
                        2: Erase 
              
              2: WHOLE PATTERN 
                        0: Matrix including pixelsX, pixelsY, xcursor and ycursor 
              
              3: X and Y DELIMITER 
                        0: X cursor 
                        1: Y cursor 
              
              4: MOVE CURSOR 
                        0: X coordinate 
                        1: Y coordinate 
              
              5: CALL JQUERY 
                        0: Left Hand part (Replacements: '#' => ~id~, '.' => ~class~) 
                        1: Right hand part 
                    
              6: RECTANGLE 
                        0: Start X 
                        1: Start Y 
                        2: finish 
                        3: Erase 
                        4: Target X 
                        5: Target Y 
                        6: Filled 
              7: LINE 
                        0: Start X 
                        1: Start Y 
                        2: finish 
                        3: Erase 
                        4: Target X 
                        5: Target Y 
              
              8: MOVE GRID 
                        0: Direction 
              
              9: COLOR CHANGE 
                        0: Ed 
                        1: Green 
                        2: Blue 
                        3: Opacity 
              
              10: OPACITY CHANGE 
                        0: Opacity (in percent) 
              
              11: TEXT OUTPUT 
                        0: Input Field number, one of 
                              0: Resize: X value 
                              1: Resize: Y value 
                              2: Base64 text field 
                              3: Image: New Width 
                              4: Image: New Height 
                              5: Color Field (Hex) 
                              6: Opacity Field (0-100) 
                              1: Text Content 
              
              12: HIGHLIGHT TOOL (the 'none' entries are important for compatibility with the draw modes) 
                        0: Tool Number 
                              0: (none) 
                              1: Pencil 
                              2: Eraser 
                              3: Eyedroppers 
                              4: Line 
                              5: (none) 
                              6: Rectangle 
                              7: (none) 
                              8: Ellipse 
                              9: (none) 
                              10: Move 
                              11: Parallelogram 
                              12: (none) 
                              13: (none) 
                              14: Polygon 
                              15: (none) 
                              16: OpenImage 
                              17: Get Matrix 
              
              13: ELLIPSE 
                        0: Start X 
                        1: Start Y 
                        2: finish 
                        3: Erase 
                        4: Target X 
                        5: Target Y 
              
              14: OPEN/CLOSE AREA 
                        0: Area 
                        info 
                        help 
                        keys 
                        record 
                        x (close areas) 
              
              15: EXECUTE INSTRUCTION 
                        0: User Command 
                              0: Preview off 
                              1: Preview on 
                              2: Hide Preview 
                              3: Show preview 
                              4: Hide tools 
                              5: Show Tools 
                              6: Hide presets 
                              7: Show Presets 
                              8: Set playback speed 
                                    0: Speed ​​value 
                              9: Run pattern as marquee 
                                    0: Matrix object incl. 
                                       pixelsX = pixelsY ('Window' size) 
                                       and marquee (total length of the image) 
                              10: User command 
                                    0: command (Javascript) 
                              11: Jump to item 
                                    0: Item number (visible in editor) 
              
              16: CALL FUNCTION 
                        0: function name 
                        1: function parameters 
                        2: async function 
                  
              17: LOAD NEW GRID CONFIGURATION 
                    0: Matrix (array) 
                    1: X limit 
                    2: Y limit 
                    3: X-Fields total 
                    4: Y-Fields total 
                    
              18: PARALLELOGRAM 
                        0: a X coordinate 
                        1: a Y coordinate 
                        2: b X coordinate 
                        3: b Y coordinate 
                        4: Line from finished 
                        5: c X coordinate 
                        6: c Y coordinate 
                        7: finish 
              
              19: POLYGON 
                        0: (array) [ (object/s) {xc: X coordinate, yc: Y coordinate}, {xc: ...} ] 
                        1: finish 
              
              20: RUN TEXT MARQUEE 
                        0: text 
                        1: Font Family 
                        2: Font Size 
              
              21: DRAW TEXT 
                        0: text 
                        1: Font Family 
                        2: Font Size 
              
              22: CHANGE TEXTAREA VALUE 
                        0: ID, one of 
                              draw text 
                              font 
                              text size 
                        1: Content, depending on ID
                              draw-text: text 
                              font: Name of the Font Family 
                              text-size: (size in pixels)px
```

---

## License
MIT License

---

## Further links
- [PatternifyFlex on GitHub](https://github.com/ManuelPeh76/PatternifyFlex)
- [Original Patternify](http://www.patternify.com)
