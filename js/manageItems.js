
// Initialize Cloud Firestore through Firebase

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

var productsUPC;

var writeBrandAndNameReturn = function(arr, i) {
    var writeBrandAndName = function(arr, i) {
        firestore.collection("Product").doc(arr[i].toString()).get().then(function(doc) {
            $('#'+doc['id']+' .itemTitleLink').text(doc.data()['brand']+' '+doc.data()['name']);
        });    
    };
    return writeBrandAndName(arr, i);
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
    var month = twoDigits(date.getMonth());
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
                $("#itemListBody").append('<tr id='+doc.data()["product"]['id']+'><th scope="row">'+doc.data()["product"]['id']+'</th><td><a href="'+doc.data()["product"]['url']+'" target="_blank" class="itemTitleLink"></a></td><td>'+dateFormatting(doc.data()['purchaseDate'].toDate())+'</td><td>'+dateFormatting(doc.data()['expirationDate'].toDate())+'</td><td><button class="btn">Edit</button></td><td><button class="btn btn-danger">Delete</button></td></tr>');      
            }
        }).then(writeBrandAndNameReturn(productsUPC, i));
    }
});