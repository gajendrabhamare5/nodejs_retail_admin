function apply_point(coupon_id) {
    
    $.ajax({
        type: "POST",
        data: {
            fullsubtotal: fullsubtotal,
            uid: uid
        },
        dataType: "JSON",
        url: baseurl + "ajaxfiles/process_point.php",
        success: function(data) {
            if (data.status == "not") {
                $(".coupon_error").show();
                $(".coupon_error").css('color', 'red');
                $(".coupon_error").html("Warning :Point not Available");
                setTimeout(function() {
                    $(".coupon_error").hide();
                }, 3000);
            } else if (data.status == "gift") {
                $(".coupon_error").show();
                $(".coupon_error").css('color', 'red');
                $(".coupon_error").html("Warning :" + data.msg + "");
                setTimeout(function() {
                    $(".coupon_error").hide();
                }, 3000);
            } else if (data.status == "ok") {
              
                var use_point = data.use_point;
                wallet_point = data.use_point;
                if (wallet_point == 0) {
                    $(".coupon_error").show();
                    $(".coupon_error").css('color', 'red');
                    $(".coupon_error").html("Point is not available.");
                    setTimeout(function() {
                        $(".coupon_error").hide();
                    }, 3000);
                } else {
                    $(".point_section").show();
                    $(".point_discount").html(Math.round((
                        parseInt(wallet_point) / parseFloat(c_convert)) * 100) / 100);
                    $(".coupon_discount").html(0);
                    $(".point_discount_wallet").html(0);
                    coupon_discount_tot = 0;
                    wallet_cash_point = 0;
                    wallet_point = store_value(wallet_point, 'wallet_point');
                    wallet_cash_point = store_value(wallet_cash_point, 'wallet_cash_point');
                    var grand_total1 = +fullsubtotal - +wallet_point;
                    var grand_total = grand_total1;
                    console.log("grand_totaldd=", grand_total);
                    console.log("grand_totaldd11=", grand_total1);
                    console.log("wallet_point=", wallet_point);
                    console.log("fullsubtotal=", fullsubtotal);
                    calculate_grandtotal()
                    $(".coupon_error").show();
                    $(".coupon_error").css('color', 'green');
                    $(".coupon_error").html("You used  " + wallet_point + " Gift Point ");
                    setTimeout(function() {
                        $(".coupon_close").click();
                        $(".coupon_error").hide();
                    }, 3000);
                }
            }
        }
    });
}

function apply_wallet_point(coupon_id) {
   
    $.ajax({
        type: "POST",
        data: {
            fullsubtotal: fullsubtotal,
            uid: uid
        },
        dataType: "JSON",
        url: baseurl + "ajaxfiles/process_walet_point.php",
        success: function(data) {
            if (data.status == "not") {
                $(".coupon_error").show();
                $(".coupon_error").css('color', 'red');
                $(".coupon_error").html("Warning :Wallet Point not Available");
                setTimeout(function() {
                    $(".coupon_error").hide();
                }, 3000);
            } else if (data.status == "ok") {
                var use_wallet_amount = data.use_wallet_amount;
                wallet_cash_point = data.use_wallet_amount;
                if (wallet_cash_point == 0) {
                    $(".coupon_error").show();
                    $(".coupon_error").css('color', 'red');
                    $(".coupon_error").html("Point is not available.");
                    setTimeout(function() {
                        $(".coupon_error").hide();
                    }, 3000);
                } else {
                    $(".point_section_wallet").show();
                    wallet_cash_point = Math.round((parseInt(wallet_cash_point) / parseFloat(c_convert)) * 100) / 100;
                    $(".point_discount_wallet").html(wallet_cash_point);
                    wallet_point = 0;
                    wallet_cash_point = store_value(wallet_cash_point, 'wallet_cash_point');
                    wallet_point = store_value(wallet_point, 'wallet_point');
                    var grand_total1 = +fullsubtotal - +wallet_cash_point;
                    var grand_total = grand_total1;
                    console.log("grand_totaldd=", grand_total);
                    console.log("grand_totaldd11=", grand_total1);
                    console.log("wallet_cash_point=", wallet_cash_point);
                    console.log("fullsubtotal=", fullsubtotal);
                    calculate_grandtotal()
                    $(".coupon_error").show();
                    $(".coupon_error").css('color', 'green');
                  
                    $(".coupon_error").html("You used  " + wallet_cash_point + " Wallet Point ");
                    setTimeout(function() {
                        $(".coupon_close").click();
                        $(".coupon_error").hide();
                    }, 3000);
                }
            }
        }
    });
}


function remove_coupen(mobile) {
  
    /* console.log("mobile=", mobile);
    console.log("copen_mpbile=", copen_mpbile); */
    if (copen_mpbile == mobile || coupon_discount_tot == '0') {
        return false;
    }
    $.ajax({
        type: "POST",
        data: {
            fullsubtotal: fullsubtotal,
            new_mobile: mobile,
            uid: uid
        },
        dataType: "JSON",
        url: baseurl + "ajaxfiles/remove_coupon.php",
        success: function(data) {
            if (data.status == "ok") {
                $(".coupon_discount").html(0);
                coupon_discount_tot = 0;

                $(".coupon_error").show();
                $(".coupon_error").css('color', 'red');
                $(".coupon_error").html(data.message);
                setTimeout(function() {
                    $(".coupon_close").click();
                }, 3000);
            } else if (data.status == "error") {
                $(".coupon_error").show();
                $(".coupon_error").css('color', 'red');
                $(".coupon_error").html(data.message);
                setTimeout(function() {
                    $(".coupon_error").hide();
                }, 3000);
            }
            calculate_grandtotal()
        }
    });

}
var copen_mpbile = '';

function apply_coupon(type) {

    var new_mobile = $("#new_mobile_no").val();
    copen_mpbile = $("#new_mobile_no").val();
    // var fullsubtotal = $("#fullsubtotal").val();

    var coupon_id;
    if (type == "desk") {
        coupon_id = $("#coupon_name_desk").val();
    } else if (type == "mob") {
        coupon_id = $("#coupon_name").val();
    }
    $.ajax({
        type: "POST",
        data: {
            coupon_id: coupon_id,
            fullsubtotal: fullsubtotal,
            new_mobile: new_mobile,
            uid: uid
        },
        dataType: "JSON",
        url: baseurl + "ajaxfiles/process_coupon.php",
        success: function(data) {
            if (data.status == "error") {
                $(".coupon_error").show();
                $(".coupon_error").css('color', 'red');
                $(".coupon_error").html(data.message);
                setTimeout(function() {
                    $(".coupon_error").hide();
                }, 3000);
            } else if (data.status == "point") {
                $(".coupon_error").show();
                $(".coupon_error").css('color', 'green');
                $(".coupon_error").html(data.message);
                /* setTimeout(function() {
                    $(".coupon_error").hide();
                }, 3000); */
            } else if (data.status == "ok") {
                
                var discount = data.discount;
                coupon_discount_tot = data.discount;
                var product_gst = data.product_gst;
                fullgst = data.product_gst;
                var sub_total = data.sub_total;
                // var fullsubtotal = $("#fullsubtotal").val();usssss
                if (discount == 0) {
                    $(".coupon_error").show();
                    $(".coupon_error").css('color', 'red');
                    $(".coupon_error").html("Coupon is not available.");
                    setTimeout(function() {
                        $(".coupon_error").hide();
                    }, 3000);
                } else {
                    $(".point_section").hide();
                    $("#discount_section").show();
                    $(".coupon_discount").html('-' + currency_symbol +Math.round((
                        parseInt(discount) / parseFloat(c_convert)) * 100) / 100);
                    wallet_point = store_value(data.point_used, 'wallet_point');
                    $("#gst").html(currency_symbol + Math
                        .round((parseInt(product_gst) / parseFloat(c_convert)) *
                            100) / 100);
                    $("#fullgst").val(product_gst);
                    var grand_total1 = +fullsubtotal - +discount;
                    var grand_total = +grand_total1 + +product_gst;
                    console.log("grand_totaldd=", grand_total);
                    console.log("grand_totaldd11=", grand_total1);
                    console.log("discount=", discount);
                    console.log("fullsubtotal=", fullsubtotal);
                  
                    calculate_grandtotal()
                    $(".coupon_error").show();
                    $(".coupon_error").css('color', 'green');
                    $(".coupon_error").html("You got discount of " + discount + " Rs.");
                    setTimeout(function() {
                        $(".coupon_close").click();
                    }, 3000);
                }
            }
        }
    });
}

function remove_disc() {
    location.reload();
}

$(document).ready(function() {
    let inputText = document.getElementById('new_mobile_no');

    inputText.addEventListener('input', (event) => {
        const thisTarget = event.target;
        /* console.log('input event. (%s)', thisTarget.value); */
        remove_coupen(thisTarget.value);
    });

    inputText.addEventListener('change', (event) => {
        const thisTarget = event.target;
        /* console.log('change event. (%s)', thisTarget.value); */
        remove_coupen(thisTarget.value);
    });

    inputText.addEventListener('paste', (event) => {
        const thisTarget = event.target;
      /*   console.log('paste event. (%s)', thisTarget.value); */
        remove_coupen(thisTarget.value);
    });
});

function view_cart_design() {
    var show_scheme = [];
    $.ajax({
        type: "POST",
        url: baseurl + "ajaxfiles/view_cart_scheme.php",
        dataType: "json",

        success: function(data) {
            $(".showcart").html('');
            var cartitem = data.cartitem;
            var subtotal = data.total;

            var cou = data.cou;
          /*   console.log(cou, 'cou'); */

            var scheme_aplied = [];
            var scheme_array = data.scheme_array;
            for (i = 0; i < cou; i++) {
                var ccid = data.cartitem[i].ccid;

                var catalog_pcs_c = data.cartitem[i].catalog_pcs;

                var img = data.cartitem[i].img;

                var per_product_weight = data.cartitem[i].per_product_weight;

                var title = data.cartitem[i].product_name;

                var product_point1 = data.cartitem[i].product_point1;

                var product_point = data.cartitem[i].product_point;

                var is_point_visible = data.cartitem[i].is_point_visible;

                var Size = data.cartitem[i].Size;

                var c_qty = data.cartitem[i].qty;

                var product_seo_url = data.cartitem[i].product_seo_url;

                var c_convert = "<?php echo $_SESSION['currency_cost']; ?>";

                var qrate = data.cartitem[i].qrate;

                var all_scm = data.cartitem[i].all_scm;


                var offer_applied = data.cartitem[i].offer_applied;
                var offer = data.cartitem[i].offer;
                var text_applied = data.cartitem[i].text_applied;

                var qrate = Math.round((parseInt(qrate) / parseFloat(c_convert)) * 100) / 100;


                if(offer != '' && jQuery.inArray(offer, scheme_aplied) === -1 && offer_applied == true){
                    scheme_aplied.push(offer);
                    scheme_array[offer].sort(function(a, b){return a-b});
                    var count1= all_scm[0]['free_qty']
                        console.log(count1, 'count');
                        for (var index = 0; index < count1; index++) {
                            combo_discount = combo_discount + scheme_array[offer][index];

                        }
                    /* combo_discount = combo_discount + scheme_array[offer][0]; */
                    /* console.log(scheme_array[offer][0], 'offerscn'); */
                }

                var cart_pro_weight = +per_product_weight * +c_qty * +catalog_pcs_c;

            }


            /* console.log(combo_discount,'combo_discount'); */


    if(combo_discount > 0){
        $(".combocart").html(currency_symbol + Math.round((parseInt(combo_discount) / parseFloat(c_convert)) * 100) / 100);
         $(".combodiscount").val(combo_discount);
        $(".combodiv").show();
    }
    calculate_grandtotal();
        }
    });

}