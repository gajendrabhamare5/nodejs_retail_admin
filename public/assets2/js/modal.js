var modal = document.getElementById("myModal");


var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function storeshippingdata(shipadd_id, uid) {
   
    var uid = uid
    var AddressType = "Shipping";
    var Action = "4";
    var shipadd_id = shipadd_id
    $.ajax({
        type: "POST",
        url: "ajaxfiles/save_address.php",
        dataType: "JSON",
        data: {
            UserID: uid,
            AddressType: AddressType,
            Action: Action,
            shipadd_id: shipadd_id
        },
        success: function(data) {


            if (data.status == "ok") {
                var countbill = data.address.length;
                $("#shipdiff").show();
                for (i = 0; i < countbill; i++) {
                    var shipping_id = data.address[i].shipping_id;
                    var shipping_first_name = data.address[i].shipping_first_name;
                    var shipping_last_name = data.address[i].shipping_last_name;
                    var shipping_address = data.address[i].shipping_address_1;
                    var shipping_address2 = data.address[i].shipping_address_2;
                    var shipping_city = data.address[i].shipping_city;
                    var shipping_company_name = data.address[i].shipping_company_name;
                    var shipping_state = data.address[i].shipping_state;
                    var shipping_pincode = data.address[i].shipping_pincode;
                    var shipping_country = data.address[i].shipping_country;
                    var shipping_phone_no = data.address[i].shipping_phone_no;
                    var shipping_countrycode = data.address[i].shipping_countrycode;
                    $("#shippingphone").val(shipping_phone_no);
                    var name = shipping_first_name + " " + shipping_last_name;
                    $("#shippingfirstname").val(shipping_first_name);
                    $("#shippinglastname").val(shipping_last_name);
                    $("#shippingaddress").val(shipping_address);
                    $("#shippingaddress2").val(shipping_address2);
                    /*  $("#shippingcountry1").val(shipping_country); */
                    $("select[name=shippingcountry1]").val(shipping_country);
                    if (shipping_country == "INDIA") {
                        console.log(shipping_country);
                        $("#shippingpincode1").val(shipping_pincode);
                        $("#shippingpincodebox").show();
                    } else {
                        $("#shippingpincode1").val("0");
                        $("#shippingpincodebox").hide();
                    }
                    var statename = shipping_state.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                        return letter.toUpperCase();
                    });
                    $("#shippingstate").val(statename);
                    $("#shippingcity").val(shipping_city);
                    $("#shipping_company_name").val(shipping_company_name);
                    $("#shipping_countrycode").val("+" + shipping_countrycode);
                    $("#shippingaddressid").val(shipping_id);

                    $(".modal").css('display', 'block');

                }


            } else {
                $("#shipdiff").hide();
            }
        }
    });
}