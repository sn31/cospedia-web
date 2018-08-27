
// firebase.initializeApp({
//     apiKey: 'AIzaSyCsXeeqQGEXp7WQAB7WU4blJmS0rCIAZaU',
//     authDomain: 'makeup-genius-702f9.firebaseapp.com',
//     projectId: 'makeup-genius-702f9'
// });
    

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: 'AIzaSyCsXeeqQGEXp7WQAB7WU4blJmS0rCIAZaU',
        authDomain: 'makeup-genius-702f9.firebaseapp.com',
        projectId: 'makeup-genius-702f9'
    });
}

// Initialize Cloud Firestore through Firebase

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

// firestore.collection("User").get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         console.log(`${doc.id} => ${doc.data()}`);
//     });
// });

var productsUPC;
firestore.collection("User").doc("idwlRVNg5aWrK1KNd4MPz3unSgC3").get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data()["productsUPC"]);
        productsUPC = doc.data()["productsUPC"];
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
}).then(function() {
    productsUPC.forEach(function(upc) {
        firestore.collection("User").doc("idwlRVNg5aWrK1KNd4MPz3unSgC3").collection("products").doc(upc.toString()).get().then(function(doc) {
            if (doc.exists) {
                console.log(doc.data()["product"]);
                var tag = '<tr><th scope="row">1</th><td><a href="https://www.jomalone.com/product/3588/10066/fragrances/colognes/light-floral/red-roses/red-roses-cologne" target="_blank" class="itemTitleLink">Jo Malone Red Roses Cologne</a></td><td>'+doc.data()["purchaseDate"].toDate()+'</td><td>'+doc.data()["expirationDate"].toDate()+'</td><td><button class="btn">Edit</button></td><td><button class="btn btn-danger">Delete</button></td></tr>';
                $("#itemListBody").append(tag);
            }
        });
    });
    
});



