var skincareOptions = '<option id="cleansers" value="cleansers">Cleansers</option><option id="eyeCare" value="eyeCare">Eye Care</option><option id="lipTreatments" value="lipTreatments">Lip Treatments</option><option id="masks" value="masks">Masks</option><option id="moisturizers" value="moisturizers">Moisturizers</option><option id="selfTannersForFace" value="selfTannersForFace">Self Tanners For Face</option><option id="shaving" value="shaving">Shaving</option><option id="sunCareForFace" value="sunCareForFace">Sun Care For Face</option><option id="treatments" value="treatments">Treatments</option>';
var makeupOptions = '<option id="cheek" value="cheek">Cheek</option><option id="eye" value="eye">Eye</option><option id="face" value="face">Face</option><option id="lip" value="lip">Lip</option>';   
var hairOptions = '<option id="hairStylingAndTreatments" value="hairStylingAndTreatments">Hair Styling and Treatments</option><option id="shampooAndConditioner" value="shampooAndConditioner">Shampoo And Conditioner</option>'
var fragranceOptions = '<option id="forMen" value="forMen">For men</option><option id="forWomen" value="forWomen">For women</option><option id="unisex" value="unisex">Unisex</option>'
var bathAndBodyOptions = '<option id="selfTannersForBody" value="selfTannersForBody">Self Tanners For Body</option><option id="sunCareForBody" value="sunCareForBody">Sun Care For Body</option>'

$("#category").change(function(){
    var selectedOption = $("#category option:selected").attr("id");
    var options;
    $("#product_type").html("");
    if (selectedOption === "skincare") {
        options = skincareOptions;
    }
    else if (selectedOption === "makeup") {
        options = makeupOptions;
    }
    else if (selectedOption === "hair") {
        options = hairOptions;
    }
    else if (selectedOption === "fragrance") {
        options = fragranceOptions;
    }
    else {
        options = bathAndBodyOptions;
    }
    $("#product_type").append(options);
});

const userID = "idwlRVNg5aWrK1KNd4MPz3unSgC3";

// Initialize Cloud Firestore through Firebase

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

var productsUPC;

firestore.collection("User").doc(userID).get().then(function(doc){
    if (doc.exists) {
        productsUPC = doc.data()['productsUPC'];
    }
});

var pushItem = function(arr, item) {
    arr.push(item);
    return arr;
}


$("#addItem").submit(function(event) {
    event.preventDefault();
    var upc = $("#upc").val();
    var brand = $("#brand").val().trim().toLowerCase();
    var name = $("#name").val().trim().toLowerCase();
    var category = $("#category option:selected").attr("id");
    var product_type = $("#product_type option:selected").attr("id");
    var openingDate = new Date($("#openingDate").val());
    var shelfLife = parseInt($("#shelfLife").val());

    //search existing db with upc
    firestore.collection("Product").doc(upc).get().then(function(doc){
        if (!doc.exists) {
            firestore.collection("Product").doc(upc).set({
                brand: brand, 
                name: name,
                category: firestore.collection("Category").doc(category),
                product_type: firestore.collection("Product Type").doc(product_type),
                shelfLife: shelfLife,
            })
            .then(function() {
                console.log("Product successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
    }).then(function(){
        firestore.collection("User").doc(userID).get().then(function(doc){
            if (doc.exists) {
                firestore.collection("User").doc(userID).update({
                    productsUPC: pushItem(productsUPC, parseInt(upc)),
                }).then(function() {
                    console.log("ProductsUPC add product success");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                })
                .then(function () {
                    firestore.collection("User").doc(userID).collection("products").doc(upc).set({
                        openingDate: new Date(openingDate),
                        expirationDate: new Date(openingDate.setMonth(openingDate.getMonth()+shelfLife)),
                        product: firestore.collection("Product").doc(upc),
                    });
                    console.log("Products add product success");
                    window.location.href = "manageItems.html";
                });
            }
            else {
                console.log("cannot find user");
            }
        });
    });
});