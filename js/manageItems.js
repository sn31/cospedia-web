// Initialize Cloud Firestore through Firebase

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

var productsUPC;

var firstLetterUpper = function(text) {
    return text.substring(0, 1).toUpperCase()+text.substring(1, text.length);
}

var textFormatting = function(text) {
    var textArr = text.toLowerCase().split(" ");
    textArr = textArr.map(function(text) {
        return firstLetterUpper(text);
    });
    return textArr.join(" ");
}

var writeBrandAndNameReturn = function(arr, i) {
    var writeBrandAndName = function(arr, i) {
        firestore.collection("Product").doc(arr[i].toString()).get().then(function(doc) {
            $('#'+doc['id']+' .itemTitleLink').text(textFormatting(doc.data()['brand'])+' '+textFormatting(doc.data()['name']));
            $('#'+doc['id']+' .itemTitleLink').attr('href', doc.data()['url']); 
        });
    };
    return writeBrandAndName(arr, i);
}

var skincareOptions = '<option id="cleansers" value="cleansers">Cleansers</option><option id="eyeCare" value="eyeCare">Eye Care</option><option id="lipTreatments" value="lipTreatments">Lip Treatments</option><option id="masks" value="masks">Masks</option><option id="moisturizers" value="moisturizers">Moisturizers</option><option id="selfTannersForFace" value="selfTannersForFace">Self Tanners For Face</option><option id="shaving" value="shaving">Shaving</option><option id="sunCareForFace" value="sunCareForFace">Sun Care For Face</option><option id="treatments" value="treatments">Treatments</option>';
var makeupOptions = '<option id="cheek" value="cheek">Cheek</option><option id="eye" value="eye">Eye</option><option id="face" value="face">Face</option><option id="lip" value="lip">Lip</option>';   
var hairOptions = '<option id="hairStylingAndTreatments" value="hairStylingAndTreatments">Hair Styling and Treatments</option><option id="shampooAndConditioner" value="shampooAndConditioner">Shampoo And Conditioner</option>'
var fragranceOptions = '<option id="forMen" value="forMen">For men</option><option id="forWomen" value="forWomen">For women</option><option id="unisex" value="unisex">Unisex</option>'
var bathAndBodyOptions = '<option id="selfTannersForBody" value="selfTannersForBody">Self Tanners For Body</option><option id="sunCareForBody" value="sunCareForBody">Sun Care For Body</option>'

var updateProductTypeList = function() {
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
}

$("#category").change(function(){
    updateProductTypeList();
});

var editFunctionReturn = function(arr, i) {
    var editFunction = function(arr, i) {
        firestore.collection("Product").doc(arr[i].toString()).get().then(function(doc) {
            $('#'+doc['id']+' button').first().click(function(){
                $("#editItem").show();
                $("#upc").val(doc['id']);
                $("#brand").val(textFormatting(doc.data()['brand']));
                $("#name").val(textFormatting(doc.data()['name']));
                $("#shelfLife").val(doc.data()['shelfLife']);

                $("#"+doc.data()['category']['id']).prop("selected", true);
                updateProductTypeList();
                console.log(doc.data());
                $("#"+doc.data()['product_type']['id']).prop("selected", true);
                
                // firestore.collection("User").doc(userID).collection("products").doc(doc['id']).update(
                //     brand: brand,
                //     name: name,
                //     openingDate: openingDate,
                //     product_type: product_type,
                //     shelfLife: shelfLife,
                // ).then(function() {     
                //     console.log("Document successfully edited!");
                //     // window.location.reload(true);
                // }).catch(function(error) {
                //     console.error("Error editing document: ", error);
                // });
            });
        });

    }
    return editFunction(arr, i);
}

var deleteProductsUPCReturn = function(arr, i) {
    var deleteProductsUPC = function(arr, i) {
        var upc = arr[i];
        productsUPC = productsUPC.filter(function(upcParam){
            return upcParam !== upc;
        });
        firestore.collection("User").doc(userID).update({
            productsUPC: productsUPC,
        }).then(function(){
            console.log("delete productsUPC successful");
        });
    }
    return deleteProductsUPC(arr, i);
}

var deleteFunctionReturn = function(arr, i) {
    var deleteFunction = function(arr, i) {
        firestore.collection("Product").doc(arr[i].toString()).get().then(function(doc) {
            $('#'+doc['id']+' button').last().click(function(){
                firestore.collection("User").doc(userID).collection("products").doc(doc['id']).delete().then(function() {     
                    console.log("Document successfully deleted!");
                    // window.location.reload(true);
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                }).then(deleteProductsUPCReturn(arr, i));;
            });
        });
    }
    return deleteFunction(arr, i);
}

var twoDigits = function(num) {
    num = num.toString();
    if (num.length == 1) {
        num = "0"+num;
    }
    return num;
}

var dateFormatting = function(date) {
    var year = date.getFullYear();
    var month = twoDigits(date.getMonth()+1);
    var date = twoDigits(date.getDate());
    return month+"-"+date+"-"+year;
};

const userID = "idwlRVNg5aWrK1KNd4MPz3unSgC3";

firestore.collection("User").doc(userID).get().then(function(doc) {
    if (doc.exists) {
        productsUPC = doc.data()["productsUPC"];
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
}).then(function() {
    for (var i=0; i<productsUPC.length; i++) {
        firestore.collection("User").doc(userID).collection("products").doc(productsUPC[i].toString()).get().then(function(doc) {
            if (doc.exists) {
                $("#itemListBody").append('<tr id='+doc.data()["product"]['id']+'><td scope="row">'+doc.data()["product"]['id']+'</td><td><span class="itemTitleLink"></span></td><td>'+dateFormatting(doc.data()['openingDate'].toDate())+'</td><td>'+dateFormatting(doc.data()['expirationDate'].toDate())+'</td><td><button class="edit btn">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td></tr>');      
            }
        }).then(writeBrandAndNameReturn(productsUPC, i))
        .then(editFunctionReturn(productsUPC, i))
        .then(deleteFunctionReturn(productsUPC, i));
    }
});