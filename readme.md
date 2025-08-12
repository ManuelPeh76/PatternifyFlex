
# Patternify Flex...
...is a pixel editor that is able to put all your creativity in a JSON formated file, or plays a previous created record file.<br />
        Patternify was originally developed by Sacha Greiff as a pattern generator (<a href="http://www.patternify.com">http://www.patternify.com</a>) and allowed it to create patterns with max. 10x10 pixels.
        Now, the tool grew to this extended version with a variety of ways to draw shapes, text, or record it all to a file, on a grid sized up to 400 x 400 pixels.
        After downloading the tool, it's recommended to run it on a local server, but it should also run locally with the file protocol (depending upon browser settings, I use it on firefox with file protocol without problems).
        You will find more informations to the tool inside the tools menu (menu -> information).

##### HTTP_GET Variables or HASH

The tool comes with some GET / HASH variables, to call it with a preconfigurated size or matrix.

Available variables are:

* idleTime
* width
* height
* xcursor
* ycursor
* size
* cursors
* matrix
* color
* destroybackup
* destroykeys
* lang

#### Examples
```
idleTime=3000               <- Delay after minimizing, before hidden eyes wake up
width=32                    <- Width of the grid
height=32                   <- Height of the grid
xcursor=10                  <- Use only the first 10 pixels per row
ycursor=10                  <- Use only the first 10 pixels per column
size=[width, height]        <- Shortcut to set width and height
cursors=[x,y]               <- shortcut to set x and y limiter
color={r:255,g:255,b:0,a:1} <- Preselect draw color and opacity
destroybackup=1             <- Remove backup from the LocalStorage
destroykeys=1               <- Remove custom keybindings from LocalStorage
lang=de                     <- Sets the language to german (available: german, english)
matrix={matrix:[matrix],... <- Sets the whole pattern

...so you could do this (reloading the tool)...
  .../index.html?width=32&height=32                         Start up with a 32x32 pixels grid.
  .../index.html?xcursor=16&ycursor=16                      Set x and y limiter to 16x16 pixels.
  .../index.html?width=32&height=32&xcursor=16&ycursor=16   Combines the last described.
  .../index.html?size=[32,32]&cursors=[16,16]               Does the same as before, a shorter notation.
  
  When you use the hash (#) instead the ? in the url, changes are done without reloading.
```

#### Matrix-Example

This shows a 10x10 pixel grid, limiters set
    to 8x8 pixel, holding a 5x5 pixel matrix,
    which shows a black border (1 pixel wide) with a transparent filling
```sh
matrix={
 [
  [[255,255,255,1],[255,255,255,1],[255,255,255,1],[255,255,255,1],[255,255,255,1]],
  [[255,255,255,1],0,0,0,[255,255,255,1]],
  [[255,255,255,1],0,0,0,[255,255,255,1]],
  [[255,255,255,1],0,0,0,[255,255,255,1]],
  [[255,255,255,1],[255,255,255,1],[255,255,255,1],[255,255,255,1],[255,255,255,1]]
 ],
 pixelsX:10,
 pixelsY:10,
 xcursor:8,
 ycursor:8
}

Of course this is written in one line in the url, avoiding spaces, as a _GET variable.
```
#### Please read the infos inside this tool! There is much more to discover!

# About the recLog file *.rec

###### The Rec data parent element ('recLog') is an array. This array consists of three child arrays:

```
recLog = [a: record number][b: item number][c: [item]]

recLog[a][b]    = [delay, mode, [item]]
recLog[a][b][0] = delay,     // in milliseconds
recLog[a][b][1] = mode,      // explained below
recLog[a][b][2] = [property (, property2 (, property3)...)]
```

###### An example in JSON notation (the format of the recorded files):

```
recLog = [                                  <-- record array
           [                                <-- items array
             [0,0,[matrix]],                <-- all records start with a header,
                                                consisting of a delay of 0,
                                                item number 0 and a starting matrix
             [100,1,[0,0,1]],               <-- wait 100ms,
                                                then draw Pixel at x/y coordinate 0/0
             [100,4,[18,10,0,1,null,null]], <-- wait 100ms, then call the line tool(4)
                                                and set the starting point for the
                                                erasing line at x/y coordinate 18/10

             Rectangle   Erase
                  | StartY |  EndY
                  |    |   |    |
             [275,6,[1,2,1,0,16,23,0]]      <-- wait 275ms, then finish an unfilled
              |      |   |    |    |            rectangle from x1/y2 to x16/y23
              |  StartX  |   EndX  |
            Delay      Finish     Fill
            EndX and EndY === NULL means this is the start of the item
            ]
        ];

```
The following list shows the possible content of recLog[x][x][2] for all items:

    0: HEADER
            0: Date
            1: Name
            2: Matrix
            3: X-Limit
            4: Y-Limit
            5: X-Fields total
            6: Y-Fields total
            7: Color Red (0-255)
            8: Color Green (0-255)
            9: Color Blue (0-255)
            10: Opacity (0.01-1.00)
            11: Status of the resize checkbox 'Take Pattern'
            12: Status of the image load checkbox 'Original size'
    1: SINGLE PIXEL
            0: X Coordinate
            1: Y Coordinate
            2: Erase
    2: WHOLE PATTERN
            0: Matrix incl. pixelsX, pixelsY, xcursor and ycursor
    3: X and Y CURSOR
            0: X Cursor
            1: Y Cursor
    4: MOVE CURSOR
            0: X Coordinate
            1: Y Coordinate
    5: CALL JQUERY
            0: Left Hand part (Replacements: '#' => ~id~, '.' => ~class~)
            1: Right hand part
    6: RECTANGLE
            0: Start X
            1: Start Y
            2: Finish
            3: Erase
            4: Target X
            5: Target Y
            6: Filled
    7: LINE
            0: Start X
            1: Start Y
            2: Finish
            3: Erase
            4: Target X
            5: Target Y
    8: MOVE GRID
            0: Direction
    9: COLOR CHANGE
            0: Red
            1: Green
            2: Blue
            3: Opacity
    10: OPACITY CHANGE
            0: Opacity (in percent)
    11: TEXT OUTPUT
            0: Input Field number
                    0: Resize: X value
                    1: Resize: Y value
                    2: Base64 Textfield
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
                    3: Eyedropper
                    4: Line
                    5: (none)
                    6: Rectangle
                    7: (none)
                    8: Ellipse
                    9: (none)
                    10: Move
                    11: Parallelogramm
                    12: (none)
                    13: (none)
                    14: Polygon
                    15: (none)
                    16: Open Image
                    17: Get Matrix
    13: ELLIPSE
            0: Start X
            1: Start Y
            2: Finish
            3: Erase
            4: Target X
            5: Target Y
    14: OPEN / CLOSE AREA
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
                    3: Show Preview
                    4: Hide Tools
                    5: Show Tools
                    6: Hide Presets
                    7: Show Presets
                    8: Set playback speed
                            0: Speed value
                    9: Run pattern as marquee
                            0: Matrix object incl. pixelsX = pixelsY ('Window' size) and marquee (total length of the image)
                    10: User command
                            0: command
                    11: Jump to Item
                            0: Item number
    16: CALL FUNCTION
            0: function name
            1: function parameter
            2: async function
    17: LOAD NEW GRID CONFIGURATION
            0: Matrix (array)
            1: X-Limit
            2: Y-Limit
            3: X-Fields total
            4: Y-Fields total
    18: PARALLELOGRAM
            0: a X coordinate
            1: a Y coordinate
            2: b X coordinate
            3: b Y coordinate
            4: Line ab finished
            5: c X coordinate
            6: c Y coordinate
            7: finish
    19: POLYGON
            0: (array) [ (object/s) {xc: X coordinate, yc: Y coordinate}, {xc: ...} ]
            1: finish
    20: RUN TEXT MARQUEE
            0: Text
            1: Font Family
            2: Font Size
    21: DRAW TEXT
            0: Text
            1: Font Family
            2: Font Size
    22: CHANGE TEXTAREA VALUE
            0: Id
                    draw-text
                    font
                    text-size
            1: Content
                    draw-text: Text
                    font: Name of the Font Family
                    text-size: (size in pixels)px

### Have fun!
