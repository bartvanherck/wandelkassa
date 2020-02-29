const EURO = "\u20ac";

function isPositiveInteger(x) {
    return 0 === x % (!isNaN(parseFloat(x)) && 0 <= ~~x);
}

const CLASSNAMES = {
    "1" : "yellow",
    "2" : "green",
    "3" : "blue",
    "4" : "white",
    "5" : "red",
    "6" : "gray",
    "7" : "purple"
};

const TypeBons = function (value, color, index){
    let self = this;
    self.total = 0;
    self.initialValue = value;
    self.initialColor = color;
    self.plusButton = "add_kol" + index;
    self.minButton = "min_kol" + index;
    self.totaalButton = "totaal_kol" + index;
    self.colorBoxId = "kleurenbox_kol" + index;
    self.eurocentsInput = "inputEurocents_" + index;
    self.storeCent = "cent_" + index;
    self.storeColor = "color_" + index;
    self.colors = [];
    self.colorButton = "col_" + index + "_color_";
    self.callback = null;
    
    self.increment = function(){
        self.total ++;
    }

    self.decrement = function() {
        if (self.total > 0){
            self.total --;
        } else {
            self.total=0;
        }
    }

    self.setColor = function(value){
        window.localStorage.setItem(self.storeColor, value);
    }

    self.getColor = function(){
        return window.localStorage.getItem(self.storeColor,);
    }

    self.setCent = function(value){
        window.localStorage.setItem(self.storeCent, value);
    }

    self.getCent = function(){
        return window.localStorage.getItem(self.storeCent);
    }

    self.getTotal = function(){
        return self.total * self.getCent();
    }

    self.getTotalBons = function(){
        return self.total;
    }

    self.reset = function(){
        self.total = 0;
        self.updateViewKassa();
    }

    self.updateViewKassa = function(){
        self.setColorKassaView(self.getColor());
        document.getElementById(self.totaalButton).textContent=self.getTotalBons();
    }

    self.updateViewConfiguration = function(){
        document.getElementById(self.eurocentsInput).value = self.getCent();
        self.setColorConfigView(self.getColor());
    }

    self.clickPlusButton = function(event){
        self.increment();
        self.updateViewKassa();
        if (self.callback){
            self.callback();
        }
    }

    self.clickMinButton = function(){
        self.decrement();
        self.updateViewKassa();
        if (self.callback){
            self.callback();
        }
    }

    self.inputChanged = function(){
        if (isPositiveInteger(this.value)){
            self.setCent(this.value);
        }
    }

    self.removeAllColors = function(element){
        element.classList.remove("yellow");
        element.classList.remove("green");
        element.classList.remove("blue");
        element.classList.remove("white");
        element.classList.remove("red");
        element.classList.remove("gray");
        element.classList.remove("purple");
    }

    self.setColorConfigView = function(color){
        let element = document.getElementById(self.colorBoxId);
        self.removeAllColors(element);
        element.classList.add(color);
    }

    self.setColorKassaView = function(color){
        let element = document.getElementById(self.totaalButton);
        self.removeAllColors(element);
        element.classList.add(color);
    }

    self.clickColorButton = function(){
        let res = this.id.split("_");
        self.setColorConfigView(CLASSNAMES[res[3]]);
        self.setColorKassaView(CLASSNAMES[res[3]]);
        self.setColor(CLASSNAMES[res[3]]);
    }

    self.register_events = function(callback){
        document.getElementById(self.plusButton).addEventListener("click", self.clickPlusButton);
        document.getElementById(self.minButton).addEventListener("click", self.clickMinButton);
        document.getElementById(self.eurocentsInput).addEventListener("change", self.inputChanged);
        for(const key in CLASSNAMES) {
            document.getElementById(self.colorButton + key).addEventListener("click", self.clickColorButton);
        }
        
        self.callback = callback;
    }

    self.initialiseData = function(){
        self.setCent(self.initialValue);
        self.setColor(self.initialColor);
    }
};

const Kassa = function(bons) {
    let self = this;
    self.totals = bons;

    self.getTotal = function(){
        let total =0;
        let count;
        for (count = 0; count < self.totals.length; count++) {
            total += self.totals[count].getTotal();
        } 
        return total;
    }

    self.loadData = function () {
        if (window.localStorage.getItem("kassa") == null){
            window.localStorage.setItem("kassa", true);
            
            for(count = 0; count < self.totals.length; count++){
                self.totals[count].initialiseData();
            }
        }
    }

    self.setCent = function(index, value){
        self.totals[index].setCent(value);
    }

    self.show = function(){
        let count;
        for(count=0; count < self.totals.length; count++){
            self.totals[count].updateViewKassa();
        }
        self.updateTotal();
        document.getElementById("viewKassa").style.display = 'block';
    }

    self.hide = function(){
        document.getElementById("viewKassa").style.display = 'none';
    }

    self.updateTotal = function(){
        let total = self.getTotal();
        const euros = Math.floor(total / 100);
        const eurocents = total % 100;
        if (eurocents > 0){
            document.getElementById("totaal").textContent= euros + " " + EURO + " " + eurocents;
        } else if (eurocents == 0) {
            document.getElementById("totaal").textContent= euros + " " + EURO;
        }
    }

    self.eraseAll = function(){
        let count;
        for (count = 0; count < self.totals.length; count++) {
            self.totals[count].reset();
        } 
        self.updateTotal();
    }

    self.register_events = function(){
        let count;
        for (count=0; count < self.totals.length; count++){
            self.totals[count].register_events(self.updateTotal);
        }
        document.getElementById("wissen").addEventListener("click", self.eraseAll);
    }
};

const Configuration = function(bons){
    let self = this;
    this.bons = bons

    self.show = function(){
        document.getElementById("viewConfiguratie").style.display = 'block';
        let count;
        for(count=0; count < self.bons.length; count++){
            self.bons[count].updateViewConfiguration();
        }
    }

    self.hide = function(){
        document.getElementById("viewConfiguratie").style.display = 'none';
    }

    self.loadData = function(){
        let index = 0;
        for (index=0; index < self.bons.length; index++){
            self.bons[index].updateViewConfiguration();
        }
    }
};

const Menu = function(kassa, config){
    let self = this;
    self.kassa = kassa;
    self.configuration = config;

    self.clickKassa = function(){
        document.getElementById("navConfiguratie").classList.remove("active");
        document.getElementById("navKassa").classList.remove("active");
        document.getElementById("navKassa").classList.add("active");
        self.kassa.show();
        self.configuration.hide();
    }

    self.clickConfiguration = function(){
        document.getElementById("navConfiguratie").classList.remove("active");
        document.getElementById("navConfiguratie").classList.add("active");
        document.getElementById("navKassa").classList.remove("active");
        self.kassa.hide();
        self.configuration.show();
    }

    self.register_events = function(){
        document.getElementById("mnukassa").addEventListener("click", self.clickKassa);
        document.getElementById("mnuconfiguratie").addEventListener("click", self.clickConfiguration);
    }
};

const register_service_worker = function(){
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
          navigator.serviceWorker
            .register("/wandelkassa/serviceWorker.js")
            .then(res => console.log("service worker registered with scope", res.scope ))
            .catch(err => console.log("service worker not registered", err))
        })
    }
};

let bons = [new TypeBons(140, "green", 1), new TypeBons(160, "yellow", 2), new TypeBons(250, "gray", 3)];
let kassa = new Kassa(bons);
let config = new Configuration(bons);
let menu = new Menu(kassa, config);
kassa.loadData();
kassa.register_events();
config.loadData();
menu.register_events();
kassa.show();
register_service_worker();
