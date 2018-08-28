var skincareOptions = '<option value="cleansers">Cleansers</option><option value="eyeCare">Eye Care</option><option value="lipTreatments">Lip Treatments</option><option value="masks">Masks</option><option value="moisturizers">Moisturizers</option><option value="selfTannersForFace">Self Tanners For Face</option><option value="shaving">Shaving</option><option value="sunCareForFace">Sun Care For Face</option><option value="treatments">Treatments</option>';
var makeupOptions = '<option value="cheek">Cheek</option><option value="eye">Eye</option><option value="face">Face</option><option value="lip">Lip</option>';   
var hairOptions = '<option value="hairStylingAndTreatments">Hair Styling and Treatments</option><option value="shampooAndConditioner">Shampoo And Conditioner</option>'
var fragranceOptions = '<option value="forMen">For men</option><option value="forWomen">For women</option><option value="unisex">Unisex</option>'
var bathAndBodyOptions = '<option value="selfTannersForBody">Self Tanners For Body</option><option value="sunCareForBody">Sun Care For Body</option>'

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
    var category = $("#category option:selected").val();
    var product_type = $("#product_type option:selected").val();
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
                    console.log("Products add product success")
                });
            }
            else {
                console.log("cannot find user");
            }
        });
    });
});