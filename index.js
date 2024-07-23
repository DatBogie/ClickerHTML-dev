window.onpageshow= function() {
    console.log(window.location.hash);
    let x = document.getElementById("loading");
    if (x && window.location.hash == "#s") {
        window.location.hash = "";
        x.style.display = "block";
        x.innerHTML = "";
        x.style.backgroundColor = "rgba(0,0,0,0)";
        x.style.transition = 'backdrop-filter 200ms cubic-bezier(0,1,1,1)';
        window.getComputedStyle(x).transition;
        setTimeout(() => {
            x.style.backdropFilter = 'blur(0px)';
            window.getComputedStyle(x).transition;
            x.style.transition = 'all 0ms linear';
            setTimeout(() => {
                x.style.display = "none";
                x.style.backdropFilter = 'blur(5px)';
                x.style.backgroundColor = "rgba(0,0,0,0.63)";
                x.innerHTML = "Loading...";
            }, 200);
        },200);
    };
};

const HELP = { // This is used to store text for certain things. Used for help popups with only static text!
    "C": `
        Clicks (C) are the basic currency.<br>
        You can see how many Clicks you have by looking at the first line of text at the top left!<br>
        You gain Clicks by clicking on the Clicker and every second if you have any CPS.<br>
        You can also buy upgrades with them from the shop.
    `,
    "CPS": `
        Clicks Per Second (CPS) is the amount of Clicks you gain every second.<br>
        You can see how many Clicks Per Second you have by looking at the second line of text at the top left!<br>
        You gain Clicks Per Second by purchasing upgrades from the shop such as the Auto Clicker.
    `,
    "CPC": `
        Clicks Per Click (CPC) is the amount of Clicks you gain every time you click the Clicker.<br>
        You can see how many Clicks Per Click you have by looking at the third line of text at the top left!<br>
        You gain Clicks Per Click by purchasing upgrades from the shop such as the Super Click.
    `,
    "CPSV": `
        Clicks Per Second Value (CPSV) is the multiplier applied to each CPS upgrade.<br>
        For example, a CPSV of 2x would make the Auto Clicker upgrade give +10CPS instead of +5CPS.<br>
        You can see what your CPSV multiplier is by looking at the fourth line of text at the top left!<br>
        You gain CPSV by purchasing upgrades from the shop such as the More Efficient Auto Clickers.<br>
        These shop upgrades will also apply the new CPSV value to your current CPS!
    `,
    "CPCV": `
        Clicks Per Click Value (CPCV) is the multiplier applied to each CPS upgrade.<br>
        For example, a CPCV of 2x would make the Super Click upgrade give +2CPC instead of +1CPC.<br>
        You can see what your CPCV multiplier is by looking at the fifth line of text at the top left!<br>
        You gain CPCV by purchasing upgrades from the shop such as the More Efficient Super Clicks.<br>
        These shop upgrades will also apply the new CPCV value to your current CPC!
    `,
    "Home": `
        Welcome to Help!<br>
        Here you can flip through all of the Help pages.<br>
        Instead of using this, you can also just hold CTRL to turn on Help mode and click on a supported element!<br>
        Supported elements will turn add a little '?' to your cursor when hovering over items while in Help mode.<br>
        Also, most elements (both supported and unsupported by Help mode) will show a little tip when hovering over them!<br>
        Some will show keys you can press instead of clicking them (eg. Space will click the clicker)!
    `
};

// theshieldhero : $1M (better than poopcock)
// poopcock : 1MC

// Building block classes
const keys = {"Control":false,"Space":false};
class vector2 {
    x=0;
    y=0;
    pos=[0,0];
    constructor(x=0,y=0) {
        this.x = x
        this.y = y
        this.pos = [x,y]
    };
    add(vector) {
        this.pos = [this.x+vector.x,this.y+vector.y];
        [this.x, this.y] = this.pos;
    };
    sub(vector) {
        this.pos = [this.x-vector.x,this.y-vector.y];
        [this.x, this.y] = this.pos;
    };
    mul(vector) {
        this.pos = [this.x*vector.x,this.y*vector.y];
        [this.x, this.y] = this.pos;
    };
    div(vector) {
        this.pos = [this.x/vector.x,this.y/vector.y];
        [this.x, this.y] = this.pos;
    };
    abs() {
        this.pos = [Math.abs(this.x),Math.abs(this.y)];
        [this.x, this.y] = this.pos;
    };
    neg() {
        this.pos = [-this.x,-this.y];
        [this.x, this.y] = this.pos;
    };
    dist() {
        return Math.abs(this.x-this.y)
    };
};
class elementData {
    tag="";
    units={
        "x":"",
        "y":"",
        "sx":"",
        "sy":""
    };
    id="";
    class="";
    style={};
    constructor(_tag="div",_units={"x":"","y":"","sx":"","sy":""},_id="",_class="",_style={}) {
        this.tag = _tag;
        this.id = _id;
        this.class = _class;
        this.style = _style;
    };
};
class obj {
    pos=new vector2;
    size=new vector2;
    elemData=new elementData;
    constructor(_pos=new vector2,_size=new vector2,_elemData=new elementData) {
        this.pos = _pos;
        this.size = _size;
        this.elemData = _elemData;
    };
    create(parent=document.body) {
        let el = document.createElement(this.elemData.tag);
        if (parent) {
            parent.appendChild(el);
        } else {
            document.body.appendChild(el);
        };
        el.id = this.elemData.id;
        el.className = this.elemData.class;
        for (const key in this.elemData.style) {
            if (Object.prototype.hasOwnProperty.call(this.elemData.style, key)) {
                const value = this.elemData.style[key];
                el.style[key] = value;
            };
        };
    };
};

// Object classes
class button {
    clickEvent=function(){};
    hoverEvent=function(){};
    leaveEvent=function(){};
    text="";
    _obj=new obj;
    constructor(__obj=new obj,_text="",_clickEvent=function(){console.log("Clicked!")},_hoverEvent=function(){console.log("Hover!")},_leaveEvent=function(){console.log("Hover left!")}) {
        this._obj = __obj;
        this._obj.elemData.tag = "button";
        this.text = _text
        this.clickEvent = _clickEvent;
        this.hoverEvent = _hoverEvent;
        this.leaveEvent = _leaveEvent;
    };
    create(parent=document.body) {
        this._obj.create(parent);
        let el = document.getElementById(this._obj.elemData.id);
        if (el) {
            el.id = this._obj.elemData.id
            el.className = this._obj.elemData.class
            el.innerHTML = this.text
            el.onclick = this.clickEvent;
            el.onmouseenter = this.hoverEvent;
            el.onmouseleave = this.leaveEvent;
            el.title = "Space";
        }
    };
};

document.getElementById("prompt").style.scale = 4;
document.getElementById("prI").value = "";

function contains(x,y) {
    return x.includes(y);
};

// Shop Items
class shopItem {
    forceHide=false;
    name="";
    desc="";
    price=0;
    uses=false;
    config = {
        "hideOnMaxUses": false
    };
    setConfig=function(x={},key=null){ // x: {key:value}|value
        if (key != null) {
            if (this.config[key] != null) {
                if (typeof(x) == typeof(this.config[key])) {
                    this.config[key] = x;
                };
            };
        } else if (Object.keys(x).length > 0) {
            for (let i=0; i<Object.keys(x).length;i++) {
                const k = Object.keys(x)[i];
                const v = x[k];
                if (this.config[k] != null) {
                    if (typeof(v) === typeof(this.config[k])) {
                        this.config[k] = v;
                    };
                };
            };
        };
    };
    func=function(){};
    _obj=new button;
    id="";
    updateText(x="") {
        let el = document.getElementById(this.id);
        if (!el) {return};
        this.requirements(this);
        if (x != "") {
            el.innerHTML = x;
        } else {
            let t = `${this.name} (${readableNum(this.price)}C) [${(this.uses == false) ? "x":""}${readableNum(this.owned)}${(this.uses == false) ? "":`/${readableNum(this.uses)}`}]`;
            el.innerHTML = t;
        };
    };
    constructor(_name="Shop Item",_desc="Shop Item",_price=0,_pmul=1.2,_bought=function(){CPS++},_id="",_uses=false,_parentid="shop",_config={},_requirements=function(x){let el = document.getElementById(x.id); el.style.display = "block"; return true;},__obj=new button) { //pmul: float|function, _uses: bool|num
        this.forceHide = false;
        this.name = _name;
        this.desc = _desc;
        this.initPrice = _price;
        this.price = _price;
        this.owned=0;
        this._obj = __obj;
        this._obj.text = this.name;
        this.pmul = _pmul;
        this.bought = _bought;
        this.uses = _uses;
        this.parentid = _parentid;
        this.setConfig(_config);
        this.requirements = _requirements
        this.func = () => {
            // console.log(this.price);
            if (COOKIES >= this.price & (this.uses == false || (this.uses != false & this.owned < this.uses))) {
                if (!this.requirements(this)) {return};
                // console.log(COOKIES-this.price);
                this.bought();
                updateCookies(COOKIES-this.price);
                updateStatus();
                this.owned++;
                console.log(`hideOnMaxUses: ${this.config["hideOnMaxUses"]}`);
                console
                if ((this.uses != false) & (this.owned >= this.uses) & (this.config["hideOnMaxUses"])) {
                    let el = document.getElementById(this.id);
                    el.style.display = "none";
                };
                if (typeof(this.pmul) == "number") {
                    this.price=Math.round(this.price*this.pmul);
                } else if (typeof(this.pmul) == "function") {
                    this.price = this.pmul(this);
                };
                this.updateText();
            };
        };
        this._obj.clickEvent = this.func;
        if (_id && typeof(_id) == "string") {
            this.id = _id;
            this._obj._obj.elemData.id = _id;
        };
        let el = document.getElementById(this.parentid);
        this._obj.create(el? el : document.body);
        let _el = document.getElementById(this.id);
        if (_el) {
            _el.title = this.desc;
        };
        this.updateText();
    };
};

function clamp(x, min=0, max=100) {
    return Math.min(Math.max(this, min), max);
};

const shopItems = [
    new shopItem("Auto Clicker","+5 CPS",50,function(x){const y=[100,165,235,300,425,575,750];console.log(x.owned,y.length);return ((x.owned-1 <= y.length-1) ? y[x.owned-1] : x.price*1.05);},function(){CPS+=(5*CPSV)},"cps1"),
    new shopItem("Super Click","+1 CPC",100,1.4,function(){CPC+=(1*CPCV)},"cpc1"),
    new shopItem("More Efficient Auto Clickers","Double CPS, *4 CPSV",1000,function(x){return Math.round(Math.pow(x.price,1.2));},function(){CPS/=CPSV;CPSV*=4;CPS*=CPSV;},"cps2"),
    new shopItem("More Efficient Super Clicks","Double CPC, *4 CPCV",1750,function(x){return Math.round(Math.pow(x.price,1.2));},function(){CPC/=CPCV;CPCV*=4;CPC*=CPCV;},"cpc2")
];

const upgrItems = [
    new shopItem("Clicker","*2x CPCV",500,1,function(x){CPCV*=2},"u_cpcv1",1,"upgr",{"hideOnMaxUses":true},function(x){
        let el = document.getElementById(x.id);
        if (el) {el.style.display = (shopItems[1].owned >= 10 && (x.owned < x.uses && x.config["hideOnMaxUses"])) ? "block":"none";};
        return shopItems[1].owned >= 10;
    })
];

const updateItems = [
    ...shopItems,...upgrItems
];

function openPrompt(title="Prompt",txt0="Confirm",txt1="Cancel",txt2="Close",txti="",txtb="",f0=closePrompt,f1=closePrompt,f2=closePrompt) {
    let x = document.getElementById("prompt");
    if (x) {
        // Set Data
        let t = document.getElementById("prT");
        let b = document.getElementById("prB");
        let i = document.getElementById("prI");
        let b0 = document.getElementById("pr0");
        let b1 = document.getElementById("pr1");
        let b2 = document.getElementById("pr2");
        t.innerHTML = title;
        b.innerHTML = txtb;
        if (txti != null) {
            i.style.display = "block";
            if (txti.length > 0) {
                i.value = txti;
            };
        } else {
            i.style.display = "none";
        };
        if (txt0.length > 0) {
            b0.style.display = "block";
            b0.innerHTML = txt0;
            b0.onclick = f0;
        } else {
            b0.style.display = "none";
        };
        if (txt1.length > 0) {
            b1.style.display = "block";
            b1.innerHTML = txt1;
            b1.onclick = f1;
        } else {
            b1.style.display = "none";
        };
        if (txt2.length > 0) {
            b2.style.display = "block";
            b2.innerHTML = txt2;
            b2.onclick = f2;
        } else {
            b2.style.display = "none";
        };
        // Prep
        x.style.pointerEvents = "all";
        x.style.transition = 'all 0ms linear';
        x.style.scale = 0;
        x.style.opacity = 0;
        x.offsetWidth;
        // Open
        x.style.transition = 'all 200ms cubic-bezier(0,1,.2,1.25)';
        x.style.scale = 1;
        x.style.opacity = 1;
        // Finish
        x.offsetWidth;
        x.style.transition = 'all 200ms cubic-bezier(0,1,1,1)';
    };
};

var helpPage = Object.keys(HELP).length-1;

function openHelp() {
    openPrompt(`Help: ${Object.keys(HELP)[helpPage]}`,"<<","Close",">>",null,Object.values(HELP)[helpPage],
        function() { // <<
            helpPage--;
            if (helpPage < 0) {
                helpPage = Object.keys(HELP).length-1;
            };
            openHelp();
        },
        closePrompt, // Close
        function() { // >>
            helpPage++;
            if (helpPage > Object.keys(HELP).length-1) {
                helpPage = 0;
            };
            openHelp();
        }
    );
};

function closePrompt() {
    let x = document.getElementById("prompt");
    if (x) {
        x.style.pointerEvents = "none"
        x.style.scale = 4;
        x.style.opacity = 0;
    };
};

const data = {};

// Generate Save Code
function getSaveCode() {
    let dataDict = {
        "COOKIES":COOKIES,
        "CPC":CPC,
        "CPCV":CPCV,
        "CPS":CPS,
        "CPSV":CPSV,
        "OwnedItems":{} // "ItemName":amtOwned
    };
    shopItems.forEach(item => {
        console.log(item.owned);
        dataDict.OwnedItems[item.name] = item.owned;
    });
    if (Object.keys(data).length > 0) {
        dataDict = Object.assign({},dataDict,data);
    };
    let result = JSON.stringify(dataDict);
    result = btoa(result);
    console.log(result);
    openPrompt("Save Code","Copy","Close","",result,"Copy this code and load it later to save keep progress!",function(){
        document.getElementById("prI").select();
        document.getElementById("prI").setSelectionRange(0,result.length);
        navigator.clipboard.writeText(result);
    });
    // alert(result);
    return result;
};

// Load Save Code
function loadSaveCode() {
    // let code = prompt("Enter code");
    openPrompt(
        "Enter Save Code",
        "Load",
        "Cancel",
        "",
        "",
        "Paste your save code in here to load your previous progress!",
        function() {
            let code = document.getElementById("prI").value;
            console.log(code);
            document.getElementById("loading").style.display = "block"
            try {
                if (code && code.length > 0) {
                    let decode = atob(code);
                    let dataDict = JSON.parse(decode);
                    if (dataDict) {
                        COOKIES = dataDict["COOKIES"];
                        CPC = dataDict["CPC"];
                        CPCV = (("CPCV" in dataDict) ? dataDict["CPCV"] : 1);
                        CPS = dataDict["CPS"];
                        CPSV = (("CPSV" in dataDict) ? dataDict["CPSV"] : 1);
                        OwnedItems = dataDict["OwnedItems"];
                        shopItems.forEach(item => {
                            if (item.name in OwnedItems) {
                                item.owned = OwnedItems[item.name];
                                if (item.owned > 0) {
                                    item.price = item.initPrice;
                                    if (typeof(item.pmul) == "number") {
                                        item.price*=(item.pmul*item.owned);
                                    } else if (typeof(item.pmul) == "function") {
                                        for (let i = 0; i < item.owned; i++) {
                                            item.price = item.pmul(item);
                                        }
                                    };
                                } else {
                                    item.price = item.initPrice;
                                };
                            } else {
                                item.owned = 0;
                                item.price = item.initPrice;
                            };
                            item.updateText();
                        });
                        for (const key in dataDict) {
                            let value = dataDict[key];
                            if (key != "COOKIES" && key != "CPC" && key != "CPS" && key != "OwnedItems") {
                                data[key] = value;
                            };
                        };
                    };
                };
            } catch (error) {
                document.getElementById("loading").innerHTML = "Invalid Code!"
            };
            setTimeout(() => {
                document.getElementById("loading").style.display = "none";
                document.getElementById("loading").innerHTML = "Loading..."
            }, 1000);
            closePrompt();
        },

    );
    // if (code && code.length > 0) {
    //     let decode = atob(code);
    //     let dataDict = JSON.parse(decode);
    //     if (dataDict) {
    //         COOKIES = dataDict["COOKIES"];
    //         CPC = dataDict["CPC"];
    //         CPS = dataDict["CPS"];
    //         OwnedItems = dataDict["OwnedItems"];
    //         shopItems.forEach(item => {
    //             item.owned = OwnedItems[item.name];
    //             if (item.owned > 0) {
    //                 item.price*=(item.pmul*item.owned);
    //                 item.updateText();
    //             };
    //         });
    //         for (const key in dataDict) {
    //             let value = dataDict[key];
    //             if (key != "COOKIES" && key != "CPC" && key != "CPS" && key != "OwnedItems") {
    //                 data[key] = value;
    //             };
    //         };
    //     };
    // };

};

// Code
var COOKIES = 0;
var CPC = 1;
var CPCV = 1;
var CPS = 0;
var CPSV = 1;
function readableNum(n = 0) {
    const largeNumbers = [
        { name: "K", value: 1e3 },          // Thousand
        { name: "M", value: 1e6 },          // Million
        { name: "B", value: 1e9 },          // Billion
        { name: "T", value: 1e12 },         // Trillion
        { name: "Qa", value: 1e15 },        // Quadrillion
        { name: "Qi", value: 1e18 },        // Quintillion
        { name: "Sx", value: 1e21 },        // Sextillion
        { name: "Sp", value: 1e24 },        // Septillion
        { name: "Oc", value: 1e27 },        // Octillion
        { name: "N", value: 1e30 },         // Nonillion
        { name: "Dc", value: 1e33 },        // Decillion
        { name: "UDc", value: 1e36 },       // Undecillion
        { name: "DDc", value: 1e39 },       // Duodecillion
        { name: "TDc", value: 1e42 },       // Tredecillion
        { name: "QaDc", value: 1e45 },      // Quattuordecillion
        { name: "QiDc", value: 1e48 },      // Quindecillion
        { name: "SxDc", value: 1e51 },      // Sexdecillion
        { name: "SpDc", value: 1e54 },      // Septendecillion
        { name: "OcDc", value: 1e57 },      // Octodecillion
        { name: "NDc", value: 1e60 },       // Novemdecillion
        { name: "Vg", value: 1e63 },        // Vigintillion
        { name: "UVg", value: 1e66 },       // Unvigintillion
        { name: "DVg", value: 1e69 },       // Duovigintillion
        { name: "TVg", value: 1e72 },       // Trevigintillion
        { name: "QaVg", value: 1e75 },      // Quattuorvigintillion
        { name: "QiVg", value: 1e78 },      // Quinvigintillion
        { name: "SxVg", value: 1e81 },      // Sexvigintillion
        { name: "SpVg", value: 1e84 },      // Septenvigintillion
        { name: "OcVg", value: 1e87 },      // Octovigintillion
        { name: "NVg", value: 1e90 },       // Novemvigintillion
        { name: "Tg", value: 1e93 },        // Trigintillion
        { name: "UTg", value: 1e96 },       // Untrigintillion
        { name: "DTg", value: 1e99 },       // Duotrigintillion
        { name: "TTg", value: 1e102 },      // Tretrigintillion
        { name: "QaTg", value: 1e105 },     // Quattuortrigintillion
        { name: "QiTg", value: 1e108 },     // Quintrigintillion
        { name: "SxTg", value: 1e111 },     // Sextrigintillion
        { name: "SpTg", value: 1e114 },     // Septentrigintillion
        { name: "OcTg", value: 1e117 },     // Octotrigintillion
        { name: "NTg", value: 1e120 },      // Novemtrigintillion
        { name: "Qd", value: 1e123 },       // Quadragintillion
        { name: "UQd", value: 1e126 },      // Unquadragintillion
        { name: "DQd", value: 1e129 },      // Duoquadragintillion
        { name: "TQd", value: 1e132 },      // Trequadragintillion
        { name: "QaQd", value: 1e135 },     // Quattuorquadragintillion
        { name: "QiQd", value: 1e138 },     // Quinquadragintillion
        { name: "SxQd", value: 1e141 },     // Sexquadragintillion
        { name: "SpQd", value: 1e144 },     // Septenquadragintillion
        { name: "OcQd", value: 1e147 },     // Octoquadragintillion
        { name: "NQd", value: 1e150 },      // Novemquadragintillion
        { name: "Qn", value: 1e153 },       // Quinquagintillion
        { name: "UQn", value: 1e156 },      // Unquinquagintillion
        { name: "DQn", value: 1e159 },      // Duoquinquagintillion
        { name: "TQn", value: 1e162 },      // Trequinquagintillion
        { name: "QaQn", value: 1e165 },     // Quattuorquinquagintillion
        { name: "QiQn", value: 1e168 },     // Quinquinquagintillion
        { name: "SxQn", value: 1e171 },     // Sexquinquagintillion
        { name: "SpQn", value: 1e174 },     // Septenquinquagintillion
        { name: "OcQn", value: 1e177 },     // Octoquinquagintillion
        { name: "NQn", value: 1e180 },      // Novemquinquagintillion
        { name: "Sxg", value: 1e183 },      // Sexagintillion
        { name: "USxg", value: 1e186 },     // Unsexagintillion
        { name: "DSxg", value: 1e189 },     // Duosexagintillion
        { name: "TSxg", value: 1e192 },     // Tresexagintillion
        { name: "QaSxg", value: 1e195 },    // Quattuorsexagintillion
        { name: "QiSxg", value: 1e198 },    // Quinsexagintillion
        { name: "SxSxg", value: 1e201 },    // Sexsexagintillion
        { name: "SpSxg", value: 1e204 },    // Septensexagintillion
        { name: "OcSxg", value: 1e207 },    // Octosexagintillion
        { name: "NSxg", value: 1e210 },     // Novemsexagintillion
        { name: "Spg", value: 1e213 },      // Septuagintillion
        { name: "USpg", value: 1e216 },     // Unseptuagintillion
        { name: "DSpg", value: 1e219 },     // Duoseptuagintillion
        { name: "TSpg", value: 1e222 },     // Treseptuagintillion
        { name: "QaSpg", value: 1e225 },    // Quattuorseptuagintillion
        { name: "QiSpg", value: 1e228 },    // Quinseptuagintillion
        { name: "SxSpg", value: 1e231 },    // Sexseptuagintillion
        { name: "SpSpg", value: 1e234 },    // Septenseptuagintillion
        { name: "OcSpg", value: 1e237 },    // Octoseptuagintillion
        { name: "NSpg", value: 1e240 },     // Novemseptuagintillion
        { name: "Og", value: 1e243 },       // Octogintillion
        { name: "UOg", value: 1e246 },      // Unoctogintillion
        { name: "DOg", value: 1e249 },      // Duooctogintillion
        { name: "TOg", value: 1e252 },      // Treoctogintillion
        { name: "QaOg", value: 1e255 },     // Quattuoroctogintillion
        { name: "QiOg", value: 1e258 },     // Quinoctogintillion
        { name: "SxOg", value: 1e261 },     // Sexoctogintillion
        { name: "SpOg", value: 1e264 },     // Septenoctogintillion
        { name: "OcOg", value: 1e267 },     // Octooctogintillion
        { name: "NOg", value: 1e270 },      // Novemoctogintillion
        { name: "Ng", value: 1e273 },       // Nonagintillion
        { name: "UNg", value: 1e276 },      // Unnonagintillion
        { name: "DNg", value: 1e279 },      // Duononagintillion
        { name: "TNg", value: 1e282 },      // Trenonagintillion
        { name: "QaNg", value: 1e285 },     // Quattuornonagintillion
        { name: "QiNg", value: 1e288 },     // Quinnonagintillion
        { name: "SxNg", value: 1e291 },     // Sexnonagintillion
        { name: "SpNg", value: 1e294 },     // Septennonagintillion
        { name: "OcNg", value: 1e297 },     // Octononagintillion
        { name: "NNg", value: 1e300 },      // Novemnonagintillion
        { name: "C", value: 1e303 },        // Centillion
        { name: "UC", value: 1e306 }        // Uncentillion
    ];
    let y = "";
    for (let i = largeNumbers.length - 1; i >= 0; i--) {
        if (n >= largeNumbers[i].value) {
            y = largeNumbers[i].name;
            n = (n / largeNumbers[i].value).toFixed(2); // Adjusts the number to one decimal place
            break;
        }
    }
    return n + y;
};
function updateCookies(x=-1) {
    let el = document.getElementById('tcookie-C');
    if (el && typeof(x) == "number") {
        if (x >= 0) {
            COOKIES = x;
        };
        let r_COOKIES = readableNum(COOKIES.toString());
        el.innerHTML = `${r_COOKIES} C`;
        el.title = `${COOKIES} ${((COOKIES != 1) ? "Clicks" : "Click")} (C)`;
    };
};
function updateStatus(el=["CPS","CPC","CPSV","CPCV"]) {
    if (el) {
        function _r(x="") {
            let e = document.getElementById(`tcookie-${x}`);
            if (e) {
                if (x == "CPS") {
                    let r = readableNum(CPS);
                    e.innerHTML = `${r} C/s`;
                    e.title = `${CPS} ${((CPS != 1) ? "Clicks" : "Click")} Per Second (CPS)`;
                } else if (x == "CPC") {
                    let r = readableNum(CPC);
                    e.innerHTML = `${r} C/c`;
                    e.title = `${CPC} ${((CPC != 1) ? "Clicks" : "Click")} Per Click (CPC)`;
                } else if (x == "CPSV") {
                    let r = readableNum(CPSV);
                    e.innerHTML = `${r} xCPS`;
                    e.title = `${CPSV} x CPS Value Multiplier (CPSV)`;
                } else if (x == "CPCV") {
                    let r = readableNum(CPCV);
                    e.innerHTML = `${r} xCPC`;
                    e.title = `${CPCV} x CPC Value Multiplier (CPCV)`;
                };
            };
        };
        if (typeof(el) == "string") {
            _r(el);
        } else {
            el.forEach(x => {
                _r(x);
            });
        };
    };
    // let r_CPS = readableNum(CPS);
    // let r_CPC = readableNum(CPC);
    // let r_CPSV = readableNum(CPSV);
    // let r_CPCV = readableNum(CPCV);
    // el.innerHTML = `${r_COOKIES}C<br>${r_CPS}C/s<br>${r_CPC}C/c<br>${r_CPSV}xCPS<br>${r_CPCV}xCPC`;
    // el.title = `${COOKIES} ${((COOKIES != 1) ? "Clicks" : "Click")} (C)\n${CPS} ${((CPS != 1) ? "Clicks" : "Click")} Per Second (CPS)\n${CPC} ${((CPC != 1) ? "Clicks" : "Click")} Per Click (CPC)\n${CPSV}x CPS Value Multiplier (CPSV)\n${CPCV}x CPC Value Multiplier (CPCV)`;
};
function statusClick(x="") {
    if (!keys.Control) {return};
    let el = document.getElementById(`tcookie-${x}`);
    if (el) {
        let t = el.title;
        let a = null;
        try {
            a = HELP[x];
        } catch (error) {};
        openPrompt(`Help: ${x}`,"Close","","",null,a || t);
    };
};
updateCookies(0);
updateStatus();

var clickCooldown = false;

function clickCookie() {
    if (!clickCooldown) {
        clickCooldown = true;
        updateCookies(COOKIES + CPC);
        let el = document.getElementById('cookie');
        if (el) {
            el.style.backgroundColor = "rgb(77, 50, 3)";
            el.style.scale = ".75";
            setTimeout(() => {
                clickCooldown = false;
            }, 70);
            setTimeout(function() {
                if (el) {
                    el.style.backgroundColor = "";
                    el.style.scale = "1";
                };
            }, 100);
        };
    };
};

const cookie = new button(
    new obj(
        new vector2(50,50),
        new vector2(50,50),
        new elementData(
            'div',
            {'x':'vw','y':'vh','sx':'vw','sy':'vw'},
            'cookie',
            'player'
        )
    ),
    "",
    clickCookie,
    function() {
        let el = document.getElementById('cookie');
        if (el) {
            el.style.width = "30vw";
            el.style.height = "30vw";
            el.style.left = "calc((50vw - 15vw) - 10vw)";
            el.style.top = "calc(50vh - 15vw)";
        };
    },
    function() {
        let el = document.getElementById('cookie');
        if (el) {
            el.style.width = "25vw";
            el.style.height = "25vw";
            el.style.left = "calc((50vw - 12.5vw) - 10vw)";
            el.style.top = "calc(50vh - 12.5vw)";
        };
    }
);

cookie.create();

const catCtl = {
    "vs": {"collapse":false},
    "vu": {"collapse":false}
};

function dispShownItems(id) {
    if (keys.Control) {
        let el = document.getElementById(id);
        if (el) {
            let t = el.title;
            let count = t.split('/')[0];
            let total = t.split('/')[1].split(' ')[0];
            openPrompt("<span style='line-height: 7vh; font-size: 7vh;'>Help: Hidden Items</span>","Close","","",null,`${count} items are shown out of a total of ${total} items.<br>${(count==total) ? "This means you have already unlocked all items in this category!":"This could mean that some items have yet to be unlocked, or that some items may have already been purchased the maximum amount of times!"}`);
        };
    } else {
        let v = catCtl[id]["collapse"];
        catCtl[id]["collapse"] = !v;
        if (id == "vs") {
            shopItems.forEach(x=>{
                x.forceHide = !v;
            });
        } else if (id == "vu") {
            upgrItems.forEach(x=>{
                x.forceHide = !v;
            });
        };
    };
};

function updateStore() {
    let count = 0;
    for (let i = 0; i < shopItems.length; i++) {
        const x = shopItems[i];
        let el = document.getElementById(x.id);
        if (el && el.style.display != "none") {
            count++;
        };
    };
    let el = document.getElementById("vs");
    el.innerHTML = `${(!catCtl["vs"]["collapse"]) ? "":"<u>"}<hr>v Shop (${count}) v<hr>${(!catCtl["vs"]["collapse"]) ? "":"<u>"}`;
    el.title = `${count}/${shopItems.length} items are currently shown.\nClick to collapse/expand Shop.`;
    count = 0;
    for (let i = 0; i < upgrItems.length; i++) {
        const x = upgrItems[i];
        let el = document.getElementById(x.id);
        if (el && el.style.display != "none") {
            count++;
        };
    };
    el = document.getElementById("vu");
    el.innerHTML = `${(!catCtl["vu"]["collapse"]) ? "":"<u>"}<hr>v Upgrades (${count}) v<hr>${(!catCtl["vu"]["collapse"]) ? "":"</u>"}`;
    el.title = `${count}/${upgrItems.length} items are currently shown.\nClick to collapse/expand Upgrades.`;

    shopItems.forEach(x=>{
        if (x.forceHide) {
            let el = document.getElementById(x.id);
            if (el) {
                el.style.display = "none";
            };
        };
    });
    upgrItems.forEach(x=>{
        if (x.forceHide) {
            let el = document.getElementById(x.id);
            if (el) {
                el.style.display = "none";
            };
        };
    });
};
updateStore();

setInterval(function() {
    updateCookies(COOKIES+CPS);
},1000);

const helpElements = [
    ["vs","pointer"],
    ["vu","pointer"],
    ["tcookie-C","default"],
    ["tcookie-CPS","default"],
    ["tcookie-CPC","default"],
    ["tcookie-CPSV","default"],
    ["tcookie-CPCV","default"]
]

// yuck this is not a good way 2 do this T-T
setInterval(function() {
    updateItems.forEach(x => {
        x.updateText();
    });
    updateStore();
    if (keys.Control) {
        document.body.style.cursor = "help";
        helpElements.forEach(x=>{
            let el = document.getElementById(x[0]);
            if (el) {
                el.style.cursor = "help";
            };
        });
    } else {
        document.body.style.cursor = "default";
        helpElements.forEach(x=>{
            let el = document.getElementById(x[0]);
            if (el) {
                el.style.cursor = x[1];
            };
        });
    };
},75);


const codes = [
    ["cG9vcGNvY2s=",false],
    ["dGhlc2hpZWxkaGVybw==",false]
];
var typed = "";

window.addEventListener('keydown',function(key) {
    if (key.code.startsWith("Key")) {
        typed += key.key;
        console.log(typed);
    };
    if (contains(typed,atob(codes[0][0])) & !codes[0][1]) {
        typed = "";
        codes[0][1] = true;
        updateCookies(COOKIES + 1e6);
    };
    if (contains(typed,atob(codes[1][0])) & !codes[1][1]) {
        typed = "";
        codes[1][1] = true;
        CPC+=1e6;
        updateStatus("CPC");
    };

    if (key.code == "ControlLeft" || key.code == "ControlRight") {
        keys["Control"] = true;
    };
    
    if (key.key == "s") {
        if (keys["Control"]) {
            key.preventDefault();
            getSaveCode();
        };
    };
    if (key.key == "l") {
        if (keys["Control"]) {
            key.preventDefault();
            loadSaveCode();
        };
    };
    if (key.key == "p") {
        if (keys["Control"]) {
            key.preventDefault();
            openPrompt();
        };
    };
    if (key.code == "Space") {
        let x = this.document.getElementById("prompt");
        if (x && x.style.scale <= 1) {
            return;
        };
        key.preventDefault();
        // key.preventDefault();
        if (keys["Space"] == false) {
            clickCookie()
            keys["Space"] = true;
        };
    };
    if (key.code == "Tab" || key.code == "Enter" || key.code == "NumpadEnter") {
        key.preventDefault();
    };
});

window.addEventListener('keyup',function(key) {
    if (key.code == "Space") {
        keys["Space"] = false;
    };
    if (key.code == "ControlLeft" || key.code == "ControlRight") {
        keys["Control"] = false;
    };
});
