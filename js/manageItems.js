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

var pushItem = function(arr, item) {
    if (arr[0] === 0) {
        arr = [];
    }
    arr.push(item);
    return arr;
}

var skincareOptions = '<option id="cleansers" value="cleansers" selected>Cleansers</option><option id="eyeCare" value="eyeCare">Eye Care</option><option id="lipTreatments" value="lipTreatments">Lip Treatments</option><option id="masks" value="masks">Masks</option><option id="moisturizers" value="moisturizers">Moisturizers</option><option id="selfTannersForFace" value="selfTannersForFace">Self Tanners For Face</option><option id="shaving" value="shaving">Shaving</option><option id="sunCareForFace" value="sunCareForFace">Sun Care For Face</option><option id="treatments" value="treatments">Treatments</option>';
var makeupOptions = '<option id="cheek" value="cheek" selected>Cheek</option><option id="eye" value="eye">Eye</option><option id="face" value="face">Face</option><option id="lip" value="lip">Lip</option>';   
var hairOptions = '<option id="hairStylingAndTreatments" value="hairStylingAndTreatments" selected>Hair Styling and Treatments</option><option id="shampooAndConditioner" value="shampooAndConditioner">Shampoo And Conditioner</option>'
var fragranceOptions = '<option id="forMen" value="forMen" selected>For men</option><option id="forWomen" value="forWomen">For women</option><option id="unisex" value="unisex">Unisex</option>'
var bathAndBodyOptions = '<option id="selfTannersForBody" value="selfTannersForBody" selected>Self Tanners For Body</option><option id="sunCareForBody" value="sunCareForBody">Sun Care For Body</option>'

var updateProductTypeList = function(addOrEdit) {
    var selectedOption = $(".category_"+addOrEdit+" option:selected").attr("id");
    var options;
    $(".product_type_"+addOrEdit).html("");
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
    $(".product_type_"+addOrEdit).append(options);
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

var editFunctionReturn = function(arr, i) {
    var editFunction = function(arr, i) {
        firestore.collection("Product").doc(arr[i].toString()).get().then(function(doc) {
            $(".upc_edit").val(doc['id']);
            $(".brand_edit").val(textFormatting(doc.data()['brand']));
            $(".name_edit").val(textFormatting(doc.data()['name']));
            $(".shelfLife_edit").val(doc.data()['shelfLife']);

            $(".category_edit").find("#"+doc.data()['category']['id']).prop("selected", true);
            updateProductTypeList("edit");
            $(".product_type_edit").find("#"+doc.data()['product_type']['id']).prop("selected", true);
        }).then(function() {
            firestore.collection("User").doc(userID).collection("products").doc($(".upc_edit").val()).get().then(function(doc) {
                $(".openingDate_edit").val(dateFormatting(doc.data()['openingDate'].toDate()));
            });
        }).then(function(){
            $('#'+arr[i]+' button').first().click(function(){
                firestore.collection("Product").doc(arr[i].toString()).get().then(function(doc) {
                    $(".upc_edit").val(doc['id']);
                    $(".brand_edit").val(textFormatting(doc.data()['brand']));
                    $(".name_edit").val(textFormatting(doc.data()['name']));
                    $(".shelfLife_edit").val(doc.data()['shelfLife']);
        
                    $(".category_edit").find("#"+doc.data()['category']['id']).prop("selected", true);
                    updateProductTypeList("edit");
                    $(".product_type_edit").find("#"+doc.data()['product_type']['id']).prop("selected", true);
                }).then(function() {
                    firestore.collection("User").doc(userID).collection("products").doc($(".upc_edit").val()).get().then(function(doc) {
                        $(".openingDate_edit").val(dateFormatting(doc.data()['openingDate'].toDate()));
                    });
                }).then(function() {
                    $("#editItem").show();
                });
            });
        });

        $("#editItem").submit(function(event){
            event.preventDefault();
            var upc = $(".upc_edit").val();
            var brand = $(".brand_edit").val().trim().toLowerCase();
            var name = $(".name_edit").val().trim().toLowerCase();
            var category = $(".category_edit option:selected").attr("id");
            var product_type = $(".product_type_edit option:selected").attr("id");
            var openingDate = new Date($(".openingDate_edit").val());
            openingDate.setHours(openingDate.getHours()+(new Date().getTimezoneOffset() / 60));
            var shelfLife = parseInt($(".shelfLife_edit").val());

            firestore.collection("Product").doc(upc).update({
                brand: brand,
                name: name,
                category: firestore.collection("Category").doc(category),
                product_type: firestore.collection("Product Type").doc(product_type),
                shelfLife: shelfLife,
            }).then(function(){
                firestore.collection("User").doc(userID).collection("products").doc(upc).update({
                    openingDate: new Date(openingDate),
                    expirationDate: new Date(openingDate.setMonth(openingDate.getMonth()+shelfLife))
                }).then(function() {
                    console.log("update successful");
                    window.location.reload(true);
                });
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
            window.location.reload(true);
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
    return year+"-"+month+"-"+date;
};

// const userID = "idwlRVNg5aWrK1KNd4MPz3unSgC3";

 //Function to take out everything after "@" in e-mail.
 function showEmail(string) {
    var indexNumber = string.indexOf("@");
    var newString = string.slice(0, indexNumber);
    return newString;
 }


 

var userID = "";
var userEmail ="";
var displayName ="";
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        authdata = user;
        userID = firebase.auth().currentUser.uid;
        userEmail = firebase.auth().currentUser.email;
        displayName = showEmail(userEmail);
        $("#email-display").text(displayName);
        
        $(".category_add").change(function() {
            updateProductTypeList("add");
        });
        
        $(".category_edit").change(function(){
            updateProductTypeList("edit");
        });

        firestore.collection("User").doc(userID).get().then(function(doc) {
            if (doc.exists) {
                if (doc.data()['productsUPC'][0] === "0") {
                    productsUPC = [];
                }
                else {
                    productsUPC = doc.data()["productsUPC"];
                }
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
                        $("#itemListBody").append('<tr id='+doc.data()["product"]['id']+'><td scope="row">'+doc.data()["product"]['id']+'</td><td><span class="itemTitleLink"></span></td><td>'+dateFormatting(doc.data()['openingDate'].toDate())+'</td><td>'+dateFormatting(doc.data()['expirationDate'].toDate())+'</td><td><button class="edit btn" data-toggle="modal" data-target="#editItemModal">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td></tr>');      
                    }
                }).then(writeBrandAndNameReturn(productsUPC, i))
                .then(editFunctionReturn(productsUPC, i))
                .then(deleteFunctionReturn(productsUPC, i));
            }
        });

        $("#addItem").submit(function(event) {
            event.preventDefault();
            var upc = $(".upc_add").val();
            var brand = $(".brand_add").val().trim().toLowerCase();
            var name = $(".name_add").val().trim().toLowerCase();
            var category = $(".category_add option:selected").attr("id");
            var product_type = $(".product_type_add option:selected").attr("id");
            var openingDate = new Date($(".openingDate_add").val());
            openingDate.setHours(openingDate.getHours()+(new Date().getTimezoneOffset() / 60));
            var shelfLife = parseInt($(".shelfLife_add").val());

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
                            console.log("ProductsUPC update success");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        })
                        .then(function () {
                            firestore.collection("User").doc(userID).collection("products").doc("0").delete().then(function(){
                                console.log("delete placeholder doc in User:products");
                                firestore.collection("User").doc(userID).collection("products").doc(upc).set({
                                    openingDate: new Date(openingDate),
                                    expirationDate: new Date(openingDate.setMonth(openingDate.getMonth()+shelfLife)),
                                    product: firestore.collection("Product").doc(upc),
                                });
                                console.log("Products add product success");
                                window.location.href = "manageItems.html";
                            });
                        });
                    }
                    else {
                        console.log("cannot find user");
                    }
                });
            });
        });
    }
    else {
        authdata = null;
    }
});

//Sign Out Function
var signOut = function () {
    firebase.auth().signOut().then(function () {
      alert("You have signed out successfully!")
    }).catch(function (err) {
      alert("Unable to sign out!")
    })
  };
  
//Back to homepage button
$(document).ready(function() {
    $("#backToHomePage").click(function() {
        window.location.href = './index.html';
    })
    $("#signOutButton").click(function () {
        signOut();
        window.location.href = './index.html';
      })
})

