$(document).ready (function() {
    $("#myProfile").click(function() {
        window.location.href = './myProfile.html' 
    })
    $("#addItems").click(function() {
        window.location.href = './addItems.html' 
    })
    $("#manageItems").click(function() {
        window.location.href = './manageItems.html' 
    })

    $("form#contact").submit(function(event) {
        event.preventDefault();
        var contactName = $("#contactName").val();
        var contactEmail = $("#contactEmail").val();
        var contactSub = $("#contactSub").val();
        alert(contactName +", thank you for contacting us. We will get back to you shortly!");
        $("form#contact").trigger('reset');
    })
})
