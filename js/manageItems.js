
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
                $("#itemListBody").append('<tr id='+doc.data()["product"]['id']+'><th scope="row">'+doc.data()["product"]['id']+'</th><td><span class="itemTitleLink"></span></td><td>'+dateFormatting(doc.data()['openingDate'].toDate())+'</td><td>'+dateFormatting(doc.data()['expirationDate'].toDate())+'</td><td><button class="edit btn">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td></tr>');      
            }
        }).then(writeBrandAndNameReturn(productsUPC, i))
        .then(deleteFunctionReturn(productsUPC, i));
    }
});