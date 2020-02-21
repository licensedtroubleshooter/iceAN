let qls_predict = [1, 3, 6, 12];
let qls_hist = [6, 12, 18, 24];

var pl = 1;
var ql = 6;
var counter = 0;

function predict_button_click(ql_) {
    ql = ql_;
    for (let i = 0; i < qls_predict.length; i++) {
        if (ql_ === qls_predict[i]) {
            document.getElementById("predict_but" + ql_).className = 'btn btn-primary';

        } else {
            document.getElementById("predict_but" + qls_predict[i]).className = 'btn btn-secondary';

        }
    }
}

function hist_button_click(ql_) {
    ql = ql_;
    for (let i = 0; i < qls_hist.length; i++) {
        if (ql_ === qls_hist[i]) {
            document.getElementById("hist_but" + ql_).className = 'btn btn-primary';
        } else {
            document.getElementById("hist_but" + qls_hist[i]).className = 'btn btn-secondary';

        }
    }
}


function addOneRow() {
    let content_city = document.getElementById("content_city");
    let content_business = document.getElementById("content_business");

    console.log(content_city, content_business);
    let form1Name = `ch1-${rowsNumber}`;
    let form2Name = `ch2-${rowsNumber}`;

    rowsNumber++;

    let array1 = ["NY", "Москва", 'Лондон'];
    let array2 = ["Amusement Arcade",
        "Amusement Device Permanent",
        "Amusement Device Portable",
        "Amusement Device Temporary",
        "Auction House Premises",
        "Bingo Game Operator",
        "Car Wash",
        "Dealer In Products",
        "Debt Collection Agency",
        "Electronic & Appliance Service",
        "Electronic Cigarette Dealer",
        "Electronics Store",
        "Employment Agency",
        "Games of Chance",
        "Gaming Cafe",
        "Garage",
        "Garage and Parking Lot",
        "Home Improvement Contractor",
        "Horse Drawn Cab Owner",
        "Laundries",
        "Newsstand",
        "Parking Lot",
        "Pawnbroker",
        "Pedicab Business",
        "Pool or Billiard Room",
        "Process Serving Agency",
        "Scale Dealer Repairer",
        "Scrap Metal Processor",
        "Secondhand Dealer - Auto",
        "Secondhand Dealer - General",
        "Sidewalk Cafe",
        "Sightseeing Bus",
        "Special Sale",
        "Stoop Line Stand",
        "Storage Warehouse",
        "Ticket Seller Business",
        "Tobacco Retail Dealer",
        "Tow Truck Company"];

    let newField1 = document.createElement("select");
    newField1.id = form1Name;
    newField1.className = "form-control form-control-lg";

    let newField2 = document.createElement("select");
    newField2.id = form2Name;
    newField2.className = "form-control form-control-lg";


    //Create and append the options
    if (counter < 1) {
        for (let i = 0; i < array1.length; i++) {
            let option = document.createElement("option");
            option.value = array1[i];
            option.text = array1[i];
            if (array1[i] !== "NY") {
                option.disabled = true;
            }
            newField1.appendChild(option);
        }
        for (let i = 0; i < array2.length; i++) {
            let option = document.createElement("option");
            option.value = array2[i];
            option.text = array2[i];
            newField2.appendChild(option);
        }
        counter++;
        document.getElementById('add_row').className = 'btn btn-light';
        document.getElementById('add_row').textContent = 'Извините, это лимит ;(';
    } else {
        onclick.alert("Увы, но больше добавить нельзя :с");
    }
    content_city.appendChild(newField1);
    content_business.appendChild(newField2);
}