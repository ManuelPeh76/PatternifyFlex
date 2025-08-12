/*jshint esversion: 10, -W030*/
const create = element => document.createElement(element);
const append = (parent, children) => (Array.isArray(children) ? children.forEach(child => parent.appendChild(child)) : parent.appendChild(children), parent);


const Alertism = function(args) {
    if (typeof args !== "object") return;
    if (args.close) return (
        args.id && Alertism.ToastId.indexOf(args.id) > -1 && (
            Alertism.Toast.style.animation = args.animation ? args.animation + "-out 1s" : "Zoom-in-out 1s",
            setTimeout(function() { Alertism.ToastContainer.remove(); }, 900),
            args.onClose && args.onClose(),
            Alertism.ToastId.splice(Alertism.ToastId.indexOf(args.id), 1)
        )
    );

    Alertism.CrossBtn.innerText = "X";
    Alertism.Backdrop.className = "alert-backdrop";
    Alertism.AlertContainer.className = "alert-container";
    Alertism.CrossBtn.className = "alert-close alert-hide";
    Alertism.Icon.classList.add("alert-hide");
    Alertism.Heading.classList.add("alert-heading");
    Alertism.Content.classList.add("alert-content");
    Alertism.Input.className = "alert-input alert-hide";
    Alertism.Input.type = "text";
    Alertism.Input.value = "";
    Alertism.Input.placeholder = "Enter Text";
    Alertism.Textarea.className = "alert-input";
    Alertism.Textarea.type = "text";
    Alertism.Textarea.value = "";
    Alertism.Textarea.placeholder = "Enter Text";
    Alertism.Icon.innerHTML = checkIcon.tickIcon;
    Alertism.BtnContainer.classList.add("alert-buttons-container");
    Alertism.CloseBtn.classList.add("alert-hide");
    Alertism.GlassMorphism.className = "alert-glassmorphism alert-hide";
    Alertism.Footer.className = "alert-footer alert-hide";
    Alertism.TimerCountDown.className = "alert-time-line alert-hide";
    Alertism.AlertContainer.style.background = args.background || "#fff";

    document.body.style.overflow = "hidden";
    document.body.appendChild(Alertism.Backdrop);

    Alertism.Backdrop.style.background = args.backdrop === undefined ? "rgb(0 0 0 / 50%)" : args.backdrop;
    Alertism.CrossBtn.classList[args.enableCloseBtn === true ? "remove" : "add"]("alert-hide");
    Alertism.Icon.classList[args.enableIcon === true ? "remove" : "add"]("alert-hide");
    Alertism.Input.classList[args.enableInput === true ? "remove" : "add"]("alert-hide");
    Alertism.OkBtn.innerText = args.btnText === undefined ? "Ok" : args.btnText;
    Alertism.AlertContainer.style.animation = args.animation !== undefined || args.animationIn !== undefined ? (args.animation || args.animationIn) + " 0.5s linear 1" : "";

    args.position !== undefined ? Alertism.Backdrop.classList.add("alert-" + args.position) : Alertism.Backdrop.className = "alert-backdrop";
    args.icon !== undefined && (
        args.icon.type !== undefined && (Alertism.Icon.innerHTML = checkIcon[args.icon.type + "Icon"]),
        args.icon.color !== undefined && (
            document.querySelectorAll(".alert-backdrop .alert-container svg path").forEach(path => path.style.fill = args.icon.color),
            args.icon.type === "warning" || args.icon.type === "error" && (document.querySelector(".alert-backdrop .alert-container svg circle").style.fill = args.icon.color)
        ),
        args.icon.position === "right" ? (
            document.querySelector(".alert-backdrop .alert-container svg").style.left = "100%",
            document.querySelector(".alert-backdrop .alert-container svg").style.transform = "translateX(-100%)"
        ) : args.icon.position === "left" && (
            document.querySelector(".alert-backdrop .alert-container svg").style.left = "0",
            document.querySelector(".alert-backdrop .alert-container svg").style.transform = "translateX(0)"
        )
    );
    args.alertHeading === undefined ? args.alertHeadingHTML === undefined ? Alertism.Heading.innerText = "Alert" : Alertism.Heading.innerHTML = args.alertHeadingHTML : Alertism.Heading.innerText = args.alertHeading;
    args.alertText === undefined ? args.alertHTML === undefined ? Alertism.Content.innerText = "This is an Alert Box. This is made by Alertism.js V2.0.0, The Alertism.js V2.0.0 is version 2 of a JavaScript Library by Assassin." : Alertism.Content.innerHTML = args.alertHTML : Alertism.Content.innerText = args.alertText;
    args.closeBtnText === undefined ? (
        Alertism.CloseBtn.classList.add("alert-hide"),
        Alertism.CloseBtn.innerText = ""
    ) : (
        Alertism.CloseBtn.classList.remove("alert-hide"),
        Alertism.CloseBtn.innerText = args.closeBtnText
    );
    args.alertFooter === undefined ? (
        Alertism.Footer.classList.add("alert-hide"),
        Alertism.Footer.innerHTML = ""
    ) : (
        Alertism.Footer.classList.remove("alert-hide"),
        Alertism.Footer.innerHTML = args.alertFooter
    );
    args.theme === undefined ? Alertism.AlertContainer.className = "alert-container" :
    args.theme === "glass" ? Alertism.GlassMorphism.classList.remove("alert-hide") : (
        Alertism.GlassMorphism.classList.add("alert-hide"),
        Alertism.AlertContainer.classList.add("alert-" + args.theme)
    );
    args.input === undefined ? (
        Alertism.Input.type = "text",
        Alertism.Input.value = "",
        Alertism.Input.placeholder = "Enter Text"
    ) : (
        args.input.type !== undefined && (Alertism.Input.type = args.input.type),
        args.input.type === "textarea" && Alertism.Input.parentNode.replaceChild(Alertism.Textarea, Alertism.Input),
        args.input.value !== undefined && (Alertism.Input.value = Alertism.Textarea.value = args.input.value),
        args.input.placeholder !== undefined && (Alertism.Input.placeholder = Alertism.Textarea.placeholder = args.input.placeholder)
    );
    args.timer === undefined ? (
        Alertism.TimerCountDown.classList.add("alert-hide"),
        Alertism.BtnContainer.classList.remove("alert-hide")
    ) : (
        Alertism.TimerCountDown.classList.remove("alert-hide"),
        Alertism.TimerCountDown.style.animation = "closeTimeLine " + args.timer + "ms linear",
        Alertism.BtnContainer.classList.add("alert-hide"),
        Alertism.CrossBtn.classList.add("alert-hide"),
        Alertism.TimerCountDown.onanimationend = () => Alertism.TimerCountDown.classList.add("alert-hide"),
        setTimeout(() => closeAlertism(args.animation, args.animationOut, args.onAutoClose), args.timer)
    );

    Alertism.OkBtn.onclick = () => closeAlertism(args.animation, args.animationOut, args.onConfirmed);
    Alertism.CloseBtn.onclick = () => closeAlertism(args.animation, args.animationOut, args.onDenied);
    Alertism.CrossBtn.onclick = () => closeAlertism(args.animation, args.animationOut, args.onCanceled);
}

function closeAlertism(Canimation, Oanimation, Event) {
    Canimation ? Alertism.AlertContainer.style.animation = Canimation + "-out 0.5s linear 1" :
    Oanimation ? Alertism.AlertContainer.style.animation = Oanimation + " 0.5s linear 1" :
    Alertism.AlertContainer.style.animation = "";
    setTimeout(() => (Alertism.Backdrop.remove(), document.body.style.overflow = "auto", Event && Event()), 500);
}

function Toast(args) {
    Alertism.Toast.style.background = args.background || "#333";
    Alertism.Toast.style.color = args.color || "#fff";
    append(document.body, Alertism.ToastContainer);

    args.HTML != undefined ? Alertism.ToastText.innerHTML = args.HTML :
    args.text != undefined && (Alertism.ToastText.innerText = args.text);
    args.position !== undefined ? Alertism.ToastContainer.classList.add("alert-" + args.position) : Alertism.ToastContainer.className = "alert-toast-container";
    args.enableIcon !== undefined ? args.enableIcon === true ? Alertism.ToastIcon.classList.remove("alert-hide") : Alertism.ToastIcon.classList.add("alert-hide") : Alertism.ToastIcon.classList.add("alert-hide");
    args.icon !== undefined && (
        args.icon.type !== undefined && (Alertism.ToastIcon.innerHTML = checkIcon[args.icon.type + "Icon"]),
        args.icon.color !== undefined && (
            document.querySelectorAll(".alert-toast-container .alert-toast svg path").forEach(path => path.style.fill = args.icon.color),
            args.icon.type === "warning" || args.icon.type === "error" && (document.querySelector(".alert-toast-container .alert-toast svg circle").style.fill = args.icon.color)
        )
    );
    args.theme !== undefined ? (
        Alertism.ToastGlassMorphism.classList[args.theme === "glass" ? "remove" : "add"]("alert-hide"),
        Alertism.Toast.classList.add("alert-" + args.theme)
    ) : Alertism.Toast.className = "alert-toast";
    args.showTimeLine !== undefined ? (
        args.showTimeLine === true ? (
            Alertism.ToastTimerCountDown.classList.remove("alert-hide"),
            Alertism.ToastTimerCountDown.style.animation = "closeTimeLine " + (args.timer || 1500) + "ms linear",
            Alertism.ToastTimerCountDown.onanimationend = () => Alertism.ToastTimerCountDown.classList.add("alert-hide")
        ) : Alertism.ToastTimerCountDown.classList.add("alert-hide")
    ) : Alertism.ToastTimerCountDown.classList.add("alert-hide");

    Alertism.AnimateOut = args.timer ? ", " + args.animation + "-out 0.5s " + (args.timer || 1500) + "ms" : "";
    Alertism.Toast.style.animation = args.animation !== undefined ? args.animation + " 0.5s" + Alertism.AnimateOut : "Bottom 0.5s, Bottom-out 0.5s" + Alertism.AnimateOut;

    args.timer ? setTimeout(() => (Alertism.ToastContainer.remove(), args.onClose && args.onClose()), (args.timer || 1500) + 350) : Alertism.ToastId.push(Alertism.IdCounter);

    if(!args.timer) return Alertism.IdCounter++;
}



Alertism.Backdrop = create("div"),
Alertism.AlertContainer = create("div"),
Alertism.CrossBtn = create("button"),
Alertism.Icon = create("div"),
Alertism.Heading = create("h2"),
Alertism.Content = create("p"),
Alertism.Input = create("input"),
Alertism.Textarea = create("textarea"),
Alertism.BtnContainer = create("div"),
Alertism.OkBtn = create("button"),
Alertism.CloseBtn = create("button"),
Alertism.GlassMorphism = create("div"),
Alertism.Footer = create("div"),
Alertism.TimerCountDown = create("div"),
Alertism.ToastContainer = create("div"),
Alertism.Toast = create("div"),
Alertism.ToastGlassMorphism = create("div"),
Alertism.ToastIcon = create("div"),
Alertism.ToastId = [],
Alertism.ToastText = create("h4"),
Alertism.ToastTimerCountDown = create("div"),
checkIcon = {
    tickIcon: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 477.867 477.867" style="enable-background:new 0 0 477.867 477.867;" xml:space="preserve"><path fill="#32be46" d="M238.933,0C106.974,0,0,106.974,0,238.933s106.974,238.933,238.933,238.933s238.933-106.974,238.933-238.933    C477.726,107.033,370.834,0.141,238.933,0z M238.933,443.733c-113.108,0-204.8-91.692-204.8-204.8s91.692-204.8,204.8-204.8    s204.8,91.692,204.8,204.8C443.611,351.991,351.991,443.611,238.933,443.733z"/><path fill="#32be46" d="M370.046,141.534c-6.614-6.388-17.099-6.388-23.712,0v0L187.733,300.134l-56.201-56.201    c-6.548-6.78-17.353-6.967-24.132-0.419c-6.78,6.548-6.967,17.353-0.419,24.132c0.137,0.142,0.277,0.282,0.419,0.419    l68.267,68.267c6.664,6.663,17.468,6.663,24.132,0l170.667-170.667C377.014,158.886,376.826,148.082,370.046,141.534z"/></svg>',
    crossIcon: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="512pt" viewBox="0 0 512 512" width="512pt"><path fill="#f03d30" d="m256 512c-141.160156 0-256-114.839844-256-256s114.839844-256 256-256 256 114.839844 256 256-114.839844 256-256 256zm0-475.429688c-120.992188 0-219.429688 98.4375-219.429688 219.429688s98.4375 219.429688 219.429688 219.429688 219.429688-98.4375 219.429688-219.429688-98.4375-219.429688-219.429688-219.429688zm0 0"/><path fill="#f03d30" d="m347.429688 365.714844c-4.679688 0-9.359376-1.785156-12.929688-5.359375l-182.855469-182.855469c-7.144531-7.144531-7.144531-18.714844 0-25.855469 7.140625-7.140625 18.714844-7.144531 25.855469 0l182.855469 182.855469c7.144531 7.144531 7.144531 18.714844 0 25.855469-3.570313 3.574219-8.246094 5.359375-12.925781 5.359375zm0 0"/><path fill="#f03d30" d="m164.570312 365.714844c-4.679687 0-9.355468-1.785156-12.925781-5.359375-7.144531-7.140625-7.144531-18.714844 0-25.855469l182.855469-182.855469c7.144531-7.144531 18.714844-7.144531 25.855469 0 7.140625 7.140625 7.144531 18.714844 0 25.855469l-182.855469 182.855469c-3.570312 3.574219-8.25 5.359375-12.929688 5.359375zm0 0"/></svg>',
    infoIcon: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve"><path fill="#ccc" d="M165,0C74.019,0,0,74.02,0,165.001C0,255.982,74.019,330,165,330s165-74.018,165-164.999C330,74.02,255.981,0,165,0z    M165,300c-74.44,0-135-60.56-135-134.999C30,90.562,90.56,30,165,30s135,60.562,135,135.001C300,239.44,239.439,300,165,300z"/><path fill="#ccc" d="M164.998,70c-11.026,0-19.996,8.976-19.996,20.009c0,11.023,8.97,19.991,19.996,19.991   c11.026,0,19.996-8.968,19.996-19.991C184.994,78.976,176.024,70,164.998,70z"/><path fill="#ccc" d="M165,140c-8.284,0-15,6.716-15,15v90c0,8.284,6.716,15,15,15c8.284,0,15-6.716,15-15v-90C180,146.716,173.284,140,165,140z"/></svg>',
    warningIcon: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><path fill="#ffa500" d="M256,0C114.497,0,0,114.507,0,256c0,141.503,114.507,256,256,256c141.503,0,256-114.507,256-256    C512,114.497,397.493,0,256,0z M256,472c-119.393,0-216-96.615-216-216c0-119.393,96.615-216,216-216    c119.393,0,216,96.615,216,216C472,375.393,375.385,472,256,472z"/><path fill="#ffa500" d="M256,128.877c-11.046,0-20,8.954-20,20V277.67c0,11.046,8.954,20,20,20s20-8.954,20-20V148.877    C276,137.831,267.046,128.877,256,128.877z"/><circle fill="#ffa500" cx="256" cy="349.16" r="27"/></svg>',
    errorIcon: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><path fill="#f03d30" d="M256,0C114.497,0,0,114.507,0,256c0,141.503,114.507,256,256,256c141.503,0,256-114.507,256-256    C512,114.497,397.493,0,256,0z M256,472c-119.393,0-216-96.615-216-216c0-119.393,96.615-216,216-216    c119.393,0,216,96.615,216,216C472,375.393,375.385,472,256,472z"/><path fill="#f03d30" d="M256,128.877c-11.046,0-20,8.954-20,20V277.67c0,11.046,8.954,20,20,20s20-8.954,20-20V148.877    C276,137.831,267.046,128.877,256,128.877z"/><circle fill="#f03d30" cx="256" cy="349.16" r="27"/></svg>',
    questionIcon: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="512pt" viewBox="0 0 512 512" width="512pt"><path fill="#87adbd" d="m277.332031 384c0 11.78125-9.550781 21.332031-21.332031 21.332031s-21.332031-9.550781-21.332031-21.332031 9.550781-21.332031 21.332031-21.332031 21.332031 9.550781 21.332031 21.332031zm0 0"/><path fill="#87adbd" d="m256 512c-141.164062 0-256-114.835938-256-256s114.835938-256 256-256 256 114.835938 256 256-114.835938 256-256 256zm0-480c-123.519531 0-224 100.480469-224 224s100.480469 224 224 224 224-100.480469 224-224-100.480469-224-224-224zm0 0"/><path fill="#87adbd" d="m256 314.667969c-8.832031 0-16-7.167969-16-16v-21.546875c0-20.308594 12.886719-38.507813 32.042969-45.269532 25.492187-8.980468 42.625-36.140624 42.625-55.851562 0-32.363281-26.304688-58.667969-58.667969-58.667969s-58.667969 26.304688-58.667969 58.667969c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16c0-49.984375 40.664063-90.667969 90.667969-90.667969s90.667969 40.683594 90.667969 90.667969c0 35.585938-28.097657 73.367188-63.980469 86.039062-6.398438 2.238282-10.6875 8.316407-10.6875 15.101563v21.527344c0 8.832031-7.167969 16-16 16zm0 0"/></svg>'
};
Alertism.CrossBtn.innerText = "X";
Alertism.Backdrop.className = "alert-backdrop";
Alertism.AlertContainer.classList.add("alert-container");
Alertism.CrossBtn.className = "alert-close alert-hide";
Alertism.Icon.classList.add("alert-hide");
Alertism.Heading.classList.add("alert-heading");
Alertism.Content.classList.add("alert-content");
Alertism.Input.className = "alert-input alert-hide";
Alertism.Input.type = "text";
Alertism.Input.value = "";
Alertism.Input.placeholder = "Enter Text";
Alertism.Textarea.className = "alert-input";
Alertism.Textarea.value = "";
Alertism.Textarea.placeholder = "Enter Text";
Alertism.Icon.innerHTML = checkIcon.tickIcon;
Alertism.ToastIcon.innerHTML = checkIcon.tickIcon;
Alertism.BtnContainer.classList.add("alert-buttons-container");
Alertism.CloseBtn.classList.add("alert-hide");
Alertism.GlassMorphism.className = "alert-glassmorphism";
Alertism.Footer.className = "alert-footer alert-hide";
Alertism.TimerCountDown.className = "alert-time-line alert-hide";
Alertism.ToastContainer.className = "alert-toast-container";
Alertism.Toast.className = "alert-toast";
Alertism.ToastGlassMorphism.className = "alert-glassmorphism alert-hide";
Alertism.ToastIcon.classList.add("alert-hide");
Alertism.ToastTimerCountDown.className = "alert-time-line alert-hide";
Alertism.AnimateOut = "";
Alertism.IdCounter = 1;

append(Alertism.Backdrop, [
    append(Alertism.AlertContainer, [
        Alertism.CrossBtn,
        Alertism.Icon,
        Alertism.Heading,
        Alertism.Content,
        Alertism.Input,
        append(Alertism.BtnContainer, [
            Alertism.OkBtn,
            Alertism.CloseBtn
        ]),
        Alertism.Footer,
        Alertism.GlassMorphism,
        Alertism.TimerCountDown
    ])
]);

append(Alertism.ToastContainer, [
    append(Alertism.Toast, [
        Alertism.ToastGlassMorphism,
        Alertism.ToastIcon,
        Alertism.ToastText,
        Alertism.ToastTimerCountDown
    ])
]);
