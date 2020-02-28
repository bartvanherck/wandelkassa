const EURO = "\u20ac";

const Kassa = function() {
    this.totals = [0, 0, 0];
    this.itemCount = 3;
    this.cents = [140, 160, 250];

    this.add = function(index){
        this.totals[index] ++;
    }

    this.min = function(index){
        if (this.totals[index] > 0){
            this.totals[index] --;
        }
    }

    this.getTotalBons = function(index){
        return this.totals[index];
    }

    this.getTotal = function(){
        let total =0;
        let count;
        for (count = 0; count < this.totals.length; count++) {
            total += this.totals[count] * this.cents[count];
        } 
        return total;
    }

    this.loadData = function () {
        if (window.localStorage.getItem("count") == null){
            window.localStorage.setItem("count", this.itemCount);
            for(count = 0; count < this.itemCount; count++){
                this.setCent(count, this.cents[count]);
            }
        }
        for(count = 0; count < this.itemCount; count++){
            this.cents[count] = window.localStorage.getItem("cent_" + count);
        }
    }

    this.setCent = function(index, value){
        window.localStorage.setItem("cent_" + index, value);
        this.cents[index] = value;
    }

    this.getCent = function(index){
        return this.cents[index];
    }
};

let kassa = new Kassa();
kassa.loadData();

$('#add_kol1').on('click', function(event) {
    kassa.add(0);
    update_kol1();
    update_total();
});

$('#add_kol2').on('click', function(event) {
    kassa.add(1);
    update_kol2();
    update_total();
});

$('#add_kol3').on('click', function(event) {
    kassa.add(2);
    update_kol3();
    update_total();
});

$('#min_kol1').on('click', function(event) {
    kassa.min(0);
    update_kol1();
    update_total();
});

$('#min_kol2').on('click', function(event) {
    kassa.min(1);
    update_kol2();
    update_total();
});

$('#min_kol3').on('click', function(event) {
    kassa.min(2);
    update_kol3();
    update_total();
});

$('#wissen').on('click', function(event) {
    kassa.totals = [0,0,0];
    update_kol1();
    update_kol2();
    update_kol3();
    update_total();
});

$('#mnukassa').on('click', function(event) {
    document.getElementById("navConfiguratie").classList.remove("active");
    document.getElementById("navKassa").classList.remove("active");
    document.getElementById("navKassa").classList.add("active");
    hide_view_configuratie();
    show_view_kassa();
});

$('#mnuconfiguratie').on('click', function(event) {
    document.getElementById("navConfiguratie").classList.remove("active");
    document.getElementById("navConfiguratie").classList.add("active");
    document.getElementById("navKassa").classList.remove("active");
    hide_view_kassa();
    show_view_configuratie();
});


const update_kol1 = function(){
    document.getElementById("totaal_kol1").textContent=kassa.getTotalBons(0);
};

const update_kol2 = function(){
    document.getElementById("totaal_kol2").textContent=kassa.getTotalBons(1);
};

const update_kol3 = function(){
    document.getElementById("totaal_kol3").textContent=kassa.getTotalBons(2);
};

const update_total = function(){
    let total = kassa.getTotal();
    const euros = Math.floor(total / 100);
    const eurocents = total % 100;
    if (eurocents > 0){
        document.getElementById("totaal").textContent= euros + " " + EURO + " " + eurocents;
    } else if (eurocents == 0) {
        document.getElementById("totaal").textContent= euros + " " + EURO;
    }
};

const hide_view_kassa = function(){
    document.getElementById("viewKassa").style.display = 'none';
}

const show_view_kassa = function(){
    document.getElementById("viewKassa").style.display = 'block';
}

const hide_view_configuratie = function(){
    document.getElementById("viewConfiguratie").style.display = 'none';
}

const show_view_configuratie = function(){
    document.getElementById("viewConfiguratie").style.display = 'block';
}

function isPositiveInteger(x) {
    return 0 === x % (!isNaN(parseFloat(x)) && 0 <= ~~x);
}

const input_changed = function(index, value){
    if (isPositiveInteger(value)){
        kassa.setCent(index, value);
    } else {
        return kassa.getCent(index);
    }
    update_total();
    return value;
}

const input_1_changed = function(){
    this.value = input_changed(0, this.value);
}

const input_2_changed = function(){
    this.value = input_changed(1, this.value);
}

const input_3_changed = function(){
    this.value = input_changed(2, this.value);
}

const fill_in_euro_cents = function(){
    document.getElementById("inputEurocents_1").value = kassa.getCent(0);
    document.getElementById("inputEurocents_2").value = kassa.getCent(1);
    document.getElementById("inputEurocents_3").value = kassa.getCent(2);
}

document.getElementById("inputEurocents_1").addEventListener("change", input_1_changed);
document.getElementById("inputEurocents_2").addEventListener("change", input_2_changed);
document.getElementById("inputEurocents_3").addEventListener("change", input_3_changed);
fill_in_euro_cents();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("js/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
  }
