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

$("#addItem").submit(function(event) {
    event.preventDefault();
    
});