/*jshint esversion: 10, -W030, -W033*/
/**************************************************
 **                                              **
 **              PATTERNIFY FLEX                 **
 **  __________________________________________  **
 **       Enhancements to 'FLEX' version         **
 **         (c) 2020 by Manuel Pelzer            **
 ** ___________________________________________  **
 **  eyes.js                                     **
 **************************************************/

(function(root) {

    root.temp = root.temp || {eye: {}};

    var temp = root.temp;

    const moveOne = e => {
        let c = e.mouseX > e.x + 30 && e.mouseX < e.x + e.width - 30 && e.mouseY > e.y + 30 && e.mouseY < e.y + e.height - 30;
        !c && (
            e.X = Math.cos(Math.atan2(e.mouseY - (e.y + e.height / 2), e.mouseX - (e.x + e.width / 2))) * e.width * e.dist, //0.22;
            e.Y = Math.sin(Math.atan2(e.mouseY - (e.y + e.height / 2), e.mouseX - (e.x + e.width / 2))) * e.width * e.dist //0.22;
        );
        e.eye.style.transform = c ? "" : `translate(${e.X}px,${e.Y}px)`;
        e.eye.style.left = c ? (e.mouseX - e.x) + "px" : "";
        e.eye.style.top = c ? (e.mouseY - e.y) + "px" : "";
    },

    moveBoth = function () {
        if (temp.eye.waitForEye) return (temp.eye.moveEye = 1);
        temp.eye = temp.eye || {};
        temp.eye.hasMoved = mouse.x !== temp.eye.mouseX || mouse.y !== temp.eye.mouseY;
        if (temp.eye.hasMoved && toolIsMinimized && autoMinimize && canMinimize) return clickMinimize();
        temp.eye.timeout && clearTimeout(temp.eye.timeout);

        function randomDirection(c, x1, x2, y1, y2) {
            let x = rnd(x1, x2); y = rnd(y1, y2);
            while (x > c.left && x < c.right && y > c.top && y < c.bottom) {x = rnd(x1, x2); y = rnd(y1, y2);}
            return [x, y];
        }

        let left = get(".funstuff div")[0].getBoundingClientRect(),
            right = get(".funstuff div")[1].getBoundingClientRect(),
            p = get("#funstuff").getBoundingClientRect(), px1, px2, py1, py2, dist = 0.22;

        p.offset = offset(get("#funstuff"));
        [left.eye, right.eye] = get(".eye");

        !temp.eye.hasMoved ? temp.eye.idle ? temp.eye.rnd ? (
            temp.eye.idle + temp.eye.rnd < Date.now() && (
                px1 = p.offset.left - 400,
                px2 = px1 + p.width + 800,
                py1 = p.offset.top - 300,
                py2 = py1 + p.height + 800,
                temp.eye.idle = Date.now(),
                temp.eye.rnd = rnd(300, 2500),
                [mouse.x, mouse.y] = randomDirection(p, px1, px2, py1, py2),
                dist = rnd(0, 0.23),
                dist * 2 < 0.22 && (dist *= 2),
                temp.eye.hasMoved = true
            )
        ) : temp.eye.rnd = 1000 : temp.eye.idle = Date.now() : (temp.eye.rnd = 10000, temp.eye.idle = 0);
        temp.eye.hasMoved && (
            temp.eye.mouseX = left.mouseX = right.mouseX = mouse.x,
            temp.eye.mouseY = left.mouseY = right.mouseY = mouse.y,
            left.dist = right.dist = dist,
            moveOne(left), moveOne(right)
        );
        temp.eye.timeout = setTimeout(function () { toolIsMinimized && moveBoth(); }, 100);
    },

    moveTo = function ([x, y, wait]) {
        if (temp.eye.waitForEye) return setTimeout(() => moveTo([x, y, wait]), Date.now() - temp.eye.waitForEye);
        let left = get(".funstuff div")[0].getBoundingClientRect(),
            right = get(".funstuff div")[1].getBoundingClientRect();
        [left.eye, right.eye] = get(".eye");
        [left.div, right.div] = get(".funstuff div");
        left.dist = right.dist = 0.22;
        left.mouseY = right.mouseY = Math.floor(offset(left.div).top + (left.height / 100 * y));
        left.mouseX = Math.floor(offset(left.div).left + (left.width / 100 * x));
        right.mouseX = Math.floor(offset(right.div).left + (right.width / 100 * x));
        moveOne(left); moveOne(right);
        temp.eye.waitForEye = wait ? Date.now() + wait : 1000;
        setTimeout(function () {temp.eye.waitForEye = 0; if (temp.eye.moveEye) {temp.eye.moveEye = 0; moveBoth();}}, wait);
    },

    twinkle = () => {
        let wait = temp.eye.forceLids ? 0 :
            temp.eye.waitForEye && Date.now() - temp.eye.waitForEye > 500 ? Date.now() - temp.eye.waitForEye + 500 : rnd(500, 10000);
        temp.eye.forceLids && (temp.eye.forceLids = 0);
        let leftEye = get("#left-eye-outer"), rightEye = get("#right-eye-outer");
        let div = get(".funstuff div");
        temp.eye.lidTimeout && clearTimeout(temp.eye.lidTimeout);
        temp.eye.lidsTwice ? temp.eye.lidsTwice = 0 : wait > 2000 && rnd(1, 4) % 4 === 0 && (temp.eye.lidsTwice = 1);
        temp.eye.lidTimeout = setTimeout(function () {
            toolIsMinimized && (
                leftEye.style.opacity = 0, rightEye.style.opacity = 0,
                div[0].classList.add("closed_eye"), div[1].classList.add("closed_eye"),
                setTimeout(function () {
                    div[0].classList.remove("closed_eye"); div[1].classList.remove("closed_eye");
                    leftEye.style.opacity = 1; rightEye.style.opacity = 1;
                }, 150),
                twinkle()
            );
        }, wait);
        temp.eye.lidsTwice && setTimeout(() => (temp.eye.forceLids = 1) && twinkle(), wait + 250);
    };

    root.lookAround = moveBoth;
    root.twinkle = twinkle;
    root.lookTo = moveTo;
})(window);
