var shipmethodprice = 0;
var handling_charge = 0;
var paymentmethodpri = 0;
var coupon_discount_tot = 0;
var totalgst = 0;
var wallet_point = 0;
var wallet_cash_point = 0;
var fullgrandtot = 0;
var seo_id = '';
var totshipweight = 0;
var addresstype = "";
var wallet_method_price = 0;
var combo_discount = 0;
var previosstatte = 0;
function openNavMenuR(){
    alert();
    $(".js-drawer-open-nav").click();
}
function addtocart(product_id,carttype1) {
    $(".customcartbtn").addClass("load-more-overlay loading");
    $(".customcartbtn").removeAttr("onclick");
    var sizename = "";
    var sizeid = "";
    var qty = $(".quantity_" + product_id).val();
    if ($("fieldset").hasClass("sizeavailable")) {
        console.log("size available");

        if ($(".customeclass_" + product_id).hasClass("active")) {
            sizename = $(".customeclass_" + product_id + ".active").val();
            sizeid = $(".customeclass_" + product_id + ".active").data('index');
        } else {

            $(".customcartbtn").removeClass('load-more-overlay loading');
            $(".customcartbtn").attr("onclick", "addtocart(" + product_id + ")");
            toastr.error("", "Please select size", {
                "timeOut": "3000",
                "positionClass": "toast-top-right",
                "extendedTImeout": "0"
            });
            return false;
        }
    }
    if (qty <= 0) {
        $(".customcartbtn").removeClass('load-more-overlay loading');
        $(".customcartbtn").attr("onclick", "addtocart(" + product_id + ")");
        toastr.error("", "0 Quantity not allowed", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        return false;
    }
    var type = "add_to_cart";
    $.ajax({
        type: "POST",
        url:"http://localhost:4000/add_to_cart",
        dataType: "JSON",
        data: { Size: sizename, sizeid: sizeid, carttype1: carttype1, ProId: product_id, Type: type, Qty: qty, Cart_type: "catalog" },
        success: function (data) {
            $(".customcartbtn").removeClass('load-more-overlay loading');
            $(".customcartbtn").attr("onclick", "addtocart(" + product_id + ")");
           /*  $(".customcartbtn").attr("onclick", "gotocart()");
            $(".customcartbtn").html("GO TO CART"); */
            //var returnedData = JSON.parse(data);
            if (data.status == "ok") {
                if (carttype1 == "buy") {
                    location.href = "http://localhost:4000/checkout";
                    return false;
                }
                $('.mfp-close').trigger('click');
                $('.cart-toggle').trigger('click');
               /*  $('.cart-link').trigger('click'); */
                $(".countproduct").html(data.count);
                if(data.count > 0) {
                    $(".countproduct").css("display","block");
                    wishlist(product_id,'addtocart');
                }else{
                    $(".countproduct").css("display","none");
                }
                toastr.success("", "Added To Cart ", {
                    "timeOut": "3000",
                    "positionClass": "toast-top-right",
                    "extendedTImeout": "0"
                });
            }
            else {
                toastr.error("", data.message, {
                    "timeOut": "3000",
                    "positionClass": "toast-top-right",
                    "extendedTImeout": "0"
                });
            }
        },
        error: function (jqXHR, exception) {
            $(".customcartbtn").removeClass('load-more-overlay loading');
            $(".customcartbtn").attr("onclick", "addtocart(" + product_id + ")");
            toastr.error("", "Something is wrong please try again later", {
                "timeOut": "3000",
                "positionClass": "toast-top-right",
                "extendedTImeout": "0"
            });
        }
    });
}
function gotocart() {
    location.href=baseurl +'cart';

}
function get_currency(i) {
    var selected_currency = $("#currency" + i).val();
    $.ajax({
        type: "POST",
        data: {
            selected_currency: selected_currency
        },
        url: baseurl + "ajaxfiles/set_currency.php",
        success: function (response) {
            if (response == "ok") {
                location.reload();
            }
        }
    });
}
function quickshop(id) {
    var ids = id;
    var fd = new FormData();
    fd.append('ids', ids);
    $.ajax({
        url: baseurl + 'ajaxfiles/ajax_quickshop.php',
        type: 'post',
        dataType: "json",
        data: fd,
        contentType: false,
        processData: false,
        success: function (data) {
            var sizelabel = "";
            var sizes = data.size;
            if (sizes != "") {
                sizelabel += `  <div class="sizeavailable product-form product-variation-form product-size-swatch">
                    <label class="mb-1">Size:</label>
                    <div class="flex-wrap d-flex align-items-center product-variations">
              `;
                var size1 = sizes.split(",");
                for (var i = 0; i < size1.length; i++) {
                    var selected = "";
                    /* if(i==0)
                    {
                        selected ="is-selected";
                    } */
                    sizelabel += `<a  class="size customeclass_${data.product_id}" style="cursor: pointer;" data-productid="${data.product_id}">${size1[i]}</a> `;
                }
                sizelabel += ` </div>
                        </div>`;
            }
            var html_img = `<img src="${data.img}" data-zoom-image="${data.img}" alt="${data.product_name}" width="500" height="600">`;
            var html_detail = `<h2 class="product-title">${data.product_name}</h2>
                    <div class="product-price">${currency_symbol}${data.price}</div>
                    <hr class="product-divider">
                   ${sizelabel}
                    <div class="product-variation-price">
                        <span></span>
                    </div>
                    <div class="product-form">
                        <div class="product-qty-form">
                            <div class="input-group">
                                <input class=" quantity_${data.product_id} form-control" type="number" min="1" max="1"  id="proqty${data.product_id}" value="1" readonly>
                                <button class="quantity-plus w-icon-plus"  onclick="onplusmin_product('plus',${data.product_id})"></button>
                                <button class="quantity-minus w-icon-minus"  onclick="onplusmin_product('min',${data.product_id})"></button>
                            </div>
                        </div>
                        <button class="btn btn-primary customcartbtn" style="    flex: 1;
    margin-bottom: 1rem;
    padding-left: 0;
    padding-right: 0;" onclick="addtocart(${data.product_id})">
                            <i class="w-icon-cart"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div>`;
            $("#product_image_quick").html(html_img);
            $("#product_detail_new_quick").html(html_detail);
        }
    });
}
function onplusmin_product(type, product_id,pqty) {
    // $(".quantity-plus").css("pointer-events", "none");
    // $(".quantity-minus").css("pointer-events", "none");
    var qty1 = $("#proqty" + product_id).val();
    var ash = true;
    if (type == "min") {
        var qty = +qty1 - 1;
    } else {
        var qty = +qty1 + 1;
        if(qty > pqty){
            toastr.error("", "only " +pqty + " Stock Available" , {
                "timeOut": "3000",
                "positionClass": "toast-top-right",
                "extendedTImeout": "0"
            });
            ash = false;
            setTimeout(() => {

                $("#proqty" + product_id).val(pqty)
            }, 100);
        }
    }
    if (qty != "0" && ash) {
        $("#proqty" + product_id).val(qty1)
    }
}
function onplusmin(type, cart_id) {
    // $(".quantity-plus").css("pointer-events", "none");
    // $(".quantity-minus").css("pointer-events", "none");
    var qty1 = $("#proqty" + cart_id).val();
    if (type == "min") {
        var qty = +qty1 - 1;
    } else {
        var qty = +qty1 + 1;
    }
    if (qty != "0") {
        $.ajax({
            type: "POST",
            url: baseurl + "ajaxfiles/update_to_cart.php",
            dataType: "JSON",
            data: {
                Qty: qty,
                CID: cart_id
            },
            success: function (data) {
                if (data.status == "error") {
                    $("#proqty" + cart_id).val(data.qty)
                    toastr.error("", data.message, {
                        "timeOut": "3000",
                        "positionClass": "toast-top-right",
                        "extendedTImeout": "0"
                    });
                    $(".quantity-plus").css("pointer-events", "visible");
                    $(".quantity-minus").css("pointer-events", "visible");
                } else {
                    $("#error" + cart_id).hide()
                    $("#error" + cart_id).html("")
                    $("#proqty" + cart_id).val(data.qty)
                    var productgst = data.gst;
                    var progstprice = data.gstperproduct;
                    var prosubtot = data.subtotal;
                    var productrate = data.total;
                    var product_point_update = data.product_point;
                    var productgstval = data.payment_fees;
                    var per_product_weight = data.per_product_weight;
                    var oldsubtot = $("#fullsubtotalcart").val();
                    var oldgst = $("#fullgstcart").val();
                    var oldgrandtot = $("#fullgrandtotcart").val();
                    var currency_cost = c_convert;
                    var oldcarttotal = $("#cartsubtot").val();
                    var ttsubtot = +prosubtot - +progstprice;
                    $("#tt-subtot" + cart_id).html(currency_symbol + Math.round((parseInt(ttsubtot) / parseFloat(currency_cost)) * 100) / 100);
                    $(".cart__price" + cart_id).html(currency_symbol + Math.round((parseInt(ttsubtot) / parseFloat(currency_cost)) * 100) / 100);
                    $("#tt-subtot1" + cart_id).html(currency_symbol + Math.round((parseInt(ttsubtot) / parseFloat(currency_cost)) * 100) / 100);
                    $("#tt-weight" + cart_id).html(per_product_weight + " Kg");
                    $("#tt-weight1" + cart_id).html(per_product_weight + " Kg");
                    $(".pro-weight" + cart_id).html((per_product_weight * qty) + " Kg");
                    $(".pro-point" + cart_id).html(Math.round((parseInt(product_point_update) / parseFloat(currency_cost)) * 100) / 100);
                    if (type == "min") {
                        var subtot = +oldsubtot - +productrate;
                        var newcartsub = +oldcarttotal - +productrate;
                        var gst = +oldgst - +productgstval;
                        var grandtot = +subtot + +gst;
                        $("#subtotcart").html(currency_symbol + Math.round((parseInt(subtot) / parseFloat(currency_cost)) * 100) / 100);
                        $("#gstcart").html(currency_symbol + Math.round((parseInt(gst) / parseFloat(currency_cost)) * 100) / 100);
                        $("#grandtotcart").html(currency_symbol + Math.round((parseInt(grandtot) / parseFloat(currency_cost)) * 100) / 100);
                        $("#fullsubtotalcart").val(subtot);
                        $("#fullgstcart").val(gst.toFixed(0));
                        $("#fullgrandtotcart").val(grandtot);
                        $("#cartsubtot").val(newcartsub);
                        $(".cart_tot_price").html(currency_symbol + Math.round((parseInt(newcartsub) / parseFloat(currency_cost)) * 100) / 100);
                    } else {
                        var subtot = +oldsubtot + +productrate;
                        var newcartsub = +oldcarttotal + +productrate;
                        var gst = +oldgst + +productgstval;
                        var grandtot = +subtot + +gst + -paymentmethodpri;
                        $("#subtotcart").html(currency_symbol + Math.round((parseInt(subtot) / parseFloat(currency_cost)) * 100) / 100);
                        $("#gstcart").html("<?php echo $_SESSION['currency_label']; ?>" + Math.round((parseInt(gst.toFixed(0)) / parseFloat(currency_cost)) * 100) / 100);
                        $("#grandtotcart").html(currency_symbol + Math.round((parseInt(grandtot) / parseFloat(currency_cost)) * 100) / 100);
                        $("#fullsubtotalcart").val(subtot);
                        $("#fullgstcart").val(gst.toFixed(0));
                        $("#fullgrandtotcart").val(grandtot);
                        $("#cartsubtot").val(newcartsub);
                        $(".cart_tot_price").html(currency_symbol + Math.round((parseInt(newcartsub) / parseFloat(currency_cost)) * 100) / 100);
                    }
                    $(".quantity-plus").css("pointer-events", "visible");
                    $(".quantity-minus").css("pointer-events", "visible");
                    $(".js-qty__wrapper").removeClass("is-loading");
                    view_cart_design();
                }
            }
        });
    } else {
        $(".quantity-plus").css("pointer-events", "visible");
        $(".quantity-minus").css("pointer-events", "visible");
        $(".js-qty__wrapper").removeClass("is-loading");
    }
}
function viewcart() {

    location.href = baseurl+'cart';
    return false;
    $(".comman").hide();
    $(".cartsproducts").addClass("load-more-overlay loading");
    var carttype = "";
    var type = "view_cart";
    $.ajax({
        type: "POST",
        url: baseurl + "ajaxfiles/add_to_cart.php",
        dataType: "JSON",
        data: { Type: type, Cart_type: "catalog", carttype: carttype },
        success: function (data) {
            var cart = "";
            $(".cartsproducts").removeClass("load-more-overlay loading");
            if (data.count == "0") {
                $(".cartsproducts").removeClass("load-more-overlay loading");
                $("#CartDrawer").addClass("is-empty");
            }
            else {
                $("#CartDrawer").removeClass("is-empty");
                var cou = data.count;
                $(".countproduct").html(data.count);
                if (data.count > 0) {
                    $(".countproduct").css("display", "block");
                } else {
                    $(".countproduct").css("display", "none");
                }
                var totalprice = 0;
                var subtotal = data.subtotal;
                var payment_fees = data.payment_fees;
                var ss = totalprice + subtotal;
                ss = Math.round((parseInt(ss) / parseFloat(c_convert)) * 100) / 100;
                payment_fees = Math.round((parseInt(payment_fees) / parseFloat(c_convert)) * 100) / 100;
                cart += `<div class="cart__items" data-count="${cou}" data-cart-subtotal="4250">`;
                for (i = 0; i < cou; i++) {
                    var productsubtot = 0;
                    var title = data.products[i].title;
                    var product_point = data.products[i].product_point;
                    var pid = data.products[i].pid;
                    var mrpprice = data.products[i].mrpprice;
                    var mrpprice = Math.round((parseInt(mrpprice) / parseFloat(c_convert)) * 100) / 100;
                    var saleprice = data.products[i].saleprice;
                    var saleprice = Math.round((parseInt(saleprice) / parseFloat(c_convert)) * 100) / 100;
                    var weight = data.products[i].weight;
                    var qty = data.products[i].qty;
                    var stitch_amount = data.products[i].stitch_amount;
                    var stitch_check = data.products[i].stitch_check;
                    var prosize = data.products[i].prosize;
                    var image = data.products[i].image;
                    var cartid = data.products[i].cartid;
                    var gstpersentage = data.products[i].gstpersentage;
                    var gstperproduct = data.products[i].gstperproduct;
                    var gstperproduct = Math.round((parseInt(gstperproduct) / parseFloat(c_convert)) * 100) / 100;
                    var product_seo_url = data.products[i].product_seo_url;
                    var producttot = qty * saleprice;
                    var productsubtot = producttot + gstperproduct;
                    var size = "";
                    var stitch_show = "";
                    if (stitch_check == 1) {
                        var stitch_show = "";
                    }
                    var sizeadd = "";
                    var pointadd = "";
                    if (prosize != "") {
                        var sizeadd = `<div><span >Size:</span> ${prosize}</div>`;
                    } if (product_point != 0) {
                        product_point1 = Math.round((parseInt(producttot) * product_point) / 100);
                        var pointadd = `<div><span >Point:</span> <span class="pro-point${cartid}">${product_point1}</span>(${product_point} %)</div>`;
                    }
                    cart += `<div class="cart__item" data-key="${cartid}">
                      <div class="cart__image">
                        <a href="${product_seo_url}" style="height: 0; padding-bottom: 133.42696629213484%;">
                          <img class="lazyautosizes lazyloaded" data-widths="[180, 360, 540]" data-aspectratio="" data-sizes="auto" alt="${title}" data-srcset="${image}" sizes="100px" srcset="${image}">
                          <noscript>
                            <img class="lazyloaded" src="${image}" alt="${title}">
                          </noscript>
                        </a>
                      </div>
                      <div class="cart__item-details">
                        <div class="cart__item-title">
                          <a href="${product_seo_url}" class="cart__item-name" style="font-size: 16px;">
                            ${title}
                          </a>
                          <div class="cart__item--variants">
                             ${sizeadd}
                            <div><span>Weight:</span> <span class="pro-weight${cartid}">${weight}KG</span></div>
                            ${pointadd}
                          </div>
                          <div class="cart__item--variants">
                            </div>
                        </div>
                        <div class="cart__item-sub">
                          <div>
                            <div class="js-qty__wrapper">
                              <label for="proqty${cartid}" class="hidden-label">Quantity</label>
                              <input type="text" id="proqty${cartid}" name="updates[]" class="js-qty__num" value="${qty}" min="1" max="1"  pattern="[0-9]*" data-id="proqty${cartid}" readonly>
                              <button type="button" onclick="onplusmin('min','${cartid}')"  class="quantity-minus js-qty__adjust js-qty__adjust--minus" aria-label="Reduce item quantity by one">
                                  <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-minus" viewBox="0 0 20 20"><path fill="#444" d="M17.543 11.029H2.1A1.032 1.032 0 0 1 1.071 10c0-.566.463-1.029 1.029-1.029h15.443c.566 0 1.029.463 1.029 1.029 0 .566-.463 1.029-1.029 1.029z"></path></svg>
                                  <span class="icon__fallback-text" aria-hidden="true">−</span>
                              </button>
                              <button type="button" onclick="onplusmin('plus','${cartid}')"  class="quantity-plus js-qty__adjust js-qty__adjust--plus" aria-label="Increase item quantity by one">
                                  <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-plus" viewBox="0 0 20 20"><path fill="#444" d="M17.409 8.929h-6.695V2.258c0-.566-.506-1.029-1.071-1.029s-1.071.463-1.071 1.029v6.671H1.967C1.401 8.929.938 9.435.938 10s.463 1.071 1.029 1.071h6.605V17.7c0 .566.506 1.029 1.071 1.029s1.071-.463 1.071-1.029v-6.629h6.695c.566 0 1.029-.506 1.029-1.071s-.463-1.071-1.029-1.071z"></path></svg>
                                  <span class="icon__fallback-text" aria-hidden="true">+</span>
                              </button>
                            </div>
                                <div class="cartitemremove"><button type="button" class="cartitemremove"onclick="deletecart(${cartid})" aria-label="button" data-type="carts" data-id=" ${cartid}; ">
                          Remove <i class="fa fa-close" style="font-size:18px;color:grey"></i>
                      </button></div>
                            <div class="cart__remove">
                              <a href="/cart/change?id=${cartid}&amp;quantity=0" class="text-link">
                                Remove
                              </a>
                            </div>
                          </div>
                           <div class="cart__item-price-col text-right">
                              <span class="cart__price${cartid}">
                              ${currency_symbol}${producttot}
                              </span>
                          </div>
                        </div>
                      </div>
                    </div>`;
                }
                cart += `</div>`;
                $(".cart_tot_price").html(currency_symbol + "" + ss);
                $("#cartsubtot").val(ss);
                $(".cartsproducts").html(cart);
                $(".comman").show();
            }
        },
        error: function (jqXHR, exception) {
            $(".cartsproducts").removeClass("load-more-overlay loading");
            toastr.error("", "Something is wrong please try again later", {
                "timeOut": "3000",
                "positionClass": "toast-top-right",
                "extendedTImeout": "0"
            });
        }
    });
}
$(function () {
    $("body").on('click', '.size', function (params) {
        var product_id = $(this).data('productid');
        $(".customeclass_" + product_id).removeClass("active");
        $(this).addClass("active");
    });
    $("body").on('click', '.showsummery', function () {
        $("#disclosure_content").css({
            "height": "auto",
            "overflow": "visible"
        })
        if ($("#disclosure_content").hasClass("active")) {
            $("#disclosure_content").css({
                "height": "0px",
                "overflow": "hidden"
            })
            $("#disclosure_content").removeClass("active");
        } else {
            $("#disclosure_content").addClass("active");
        }
    });
    function delete_cart(ctype1, cartid) {
        jQuery("#myLoading").modal('show');
        var ctype = ctype1;
        if (ctype == "One") {
            ctype = "";
        }
        var type = "delete_cart";
        $.ajax({
            type: "POST",
            url: "<?php echo $base_url; ?>ajaxfiles/add_to_cart.php",
            dataType: "JSON",
            data: { Type: type, CID: cartid, CType: ctype },
            success: function (data) {
                window.location.reload();
            }
        });
    }
    $('body').on('click', '.cartitemremove', function () {
        var cartid = $(this).attr("data-id");
        var carttype = $(this).attr("data-type");
        var ctype = "";
        var type = "delete_cart";
        $.ajax({
            type: "POST",
            url: baseurl + "ajaxfiles/add_to_cart.php",
            dataType: "JSON",
            data: { Type: type, CID: cartid, CType: ctype },
            success: function (data) {
                $(".countproduct").html(data.count);
                if (carttype == "popup") {
                    $('.cart-toggle').trigger('click');
                }
                if (carttype == "carts") {
                    location.reload();
                }
            }
        });
    });
});
function generate_link() {
    var first = true;
    var linkGet = '?filter=call&seo_id=' + seo_id;
    if (pagetype == 'search') {
        linkGet += "&searchVal=" + catid;
    }
    if (pagetype == 'cat') {
        linkGet += "&catid=" + catid + "&type=" + cattype;
    }
    if ($('#getprice').val() != "") {
        var priceboth = $('#getprice').val();
        linkGet += "&price=" + priceboth;
    } else {
        // var priceboth = $('#getprice').val();
        var priceboth = minp + "-" + maxp;
        linkGet += "&price=" + priceboth;
    }
    var sortby = $(".sort_by_filter").val();
    if (sortby != "") {
        linkGet += "&order=" + sortby;
    }
    var fil = jQuery.parseJSON(filter_array);
    var filterbyarr = [];
    if (fil.length > 0) {
        for (var k = 0; k < fil.length; k++) {
            var attname = fil[k];
            var attval = $('.' + attname + ':checked').map(function () { return this.value; }).get().join(',');
            if (attval != "") {
                linkGet += "&" + attname + "=" + attval;
                filterbyarr.push(attname);
            }
        }
    }
    if (filterbyarr.length > 0) {
        linkGet += "&filterby=" + filterbyarr.join(',');
    }
    return linkGet;
}
var isloading = true;
$(document).on('click', '.loadBtn', function () {
    $('html, body').animate({
        scrollTop: $("#scroll_section").offset().top
    }, 2000);
    var page = $(this).attr("data-page");
    if (page == 1) {
        window.location.href = baseurl + "" + seo_id;
        return false;
    }
    else {
        history.pushState(null, null, "/" + seo_id + "/page/" + page);
    }
    if (seo_id != '') {
        if (pagetype == 'brand') {
            history.pushState(null, null, "/brands/" + seo_id + "/page/" + page);
        } else if (pagetype == 'search') {
            history.pushState(null, null, "/search/" + seo_id + "/" + page);
        } else {

            history.replaceState(null, null, "/" + seo_id + "/page/" + page);
        }
    }
    var get_link = $('#get_link').html();
    var get_searchVal = $('#get_searchVal').html();
    get_link = get_link.replace(/&amp;/g, '&');
    var newlink = '?';
    if (get_link !== '' & get_searchVal == '') {
        newlink = encodeURI(get_link) + "&";
    } else if (get_link == '' & get_searchVal !== '') {
        newlink = "?searchVal=" + encodeURI(get_searchVal) + "&";
    } else if (get_link !== '' & get_searchVal !== '') {
        newlink = encodeURI(get_link) + "&searchVal=" + encodeURI(get_searchVal) + "&";
    }
    var abc = "";
    if (pagetype == 'search') {
        abc = "&searchVal=" + catid;
    }
    if (pagetype == 'cat') {
        abc = "&catid=" + catid + "&type=" + cattype;
    }
    var order = "";
    var sortby = $('#sort_by_filter').val();
    if (sortby != "" && sortby != undefined) {
        order = "&order=" + sortby;
    } else {
        order = "&order=" + 1;
    }
    var new_fulllink = baseurl + "catalog_filter.php" + newlink + "start=" + page + "&loadmore=call&seo_id=" + seo_id + abc + order;
    $('#next').attr('href', new_fulllink);
    $(".loader").show();
    $.ajax({
        url: new_fulllink,
        dataType: "TEXT",
        beforeSend: function () {
            isloading = false;
        },
    }).done(function (data) {
        $(".loader").hide();
        var filter = "";
        $('#filter_data').html(data);
        if (data == null || data == "") {
            $('#filter_data').html("<span style='text-align: center;'>No more catalog found.</span><br><br>");
        }
        isloading = true;
    });
});
window.addEventListener("popstate", function () {
    var pagenew = window.location.pathname.split("/").pop();
    if (pagenew != seo_id) {
        page = pagenew;
        if (pagetype == 'brand') {
            history.replaceState(null, null, "/brands/" + seo_id + "/" + pagenew);
        } else if (pagetype == 'search') {
            history.replaceState(null, null, "/search/" + seo_id + "/" + pagenew);
        } else {
            /*  history.replaceState(null, null,"/"+seo_id+"/"+pagenew); */
            history.replaceState(null, null, "/" + seo_id + "/page/" + pagenew);
        }
    }
    else {
        page = 1;
        window.location.href = baseurl + seo_id;
        return false;
    }
    $('html, body').animate({
        scrollTop: $("#scroll_section").offset().top
    }, 2000);
    var get_link = $('#get_link').html();
    var get_searchVal = $('#get_searchVal').html();
    get_link = get_link.replace(/&amp;/g, '&');
    var newlink = '?';
    if (get_link != '' & get_searchVal == '') {
        newlink = encodeURI(get_link) + "&";
    } else if (get_link == '' & get_searchVal != '') {
        newlink = "?searchVal=" + encodeURI(get_searchVal) + "&";
    } else if (get_link != '' & get_searchVal != '') {
        newlink = encodeURI(get_link) + "&searchVal=" + encodeURI(get_searchVal) + "&";
    }
    var abc = "";
    if (pagetype == 'search') {
        abc = "&searchVal=" + catid;
    }
    if (pagetype == 'upcoming') {
        abc = "&upcoming=" + upcoming;
    }
    if (pagetype == 'cat') {
        abc = "&catid=" + catid + "&type=" + cattype;
    }
    if (pagetype == 'brand') {
        abc = "&brandid=" + brandid;
    }
    if (pagetype == 'newarri') {
        abc = "&newarri=1";
    }
    var order = "";
    var sortby = $("#sort_by_filter").val();
    if (sortby != "") {
        order = "&order=" + sortby;
    } else {
        order = "&order=" + 1;
    }
    $(".loader").show();
    /*  var new_fulllink = baseurl + "catalog_filter.php" + newlink + "start=" + page + "&loadmore=call" + abc + order; */
    var new_fulllink = baseurl + "catalog_filter.php" + newlink + "start=" + page + "&loadmore=call&seo_id=" + seo_id + abc + order;
    $.ajax({
        url: new_fulllink,
        beforeSend: function () {
            isloading = false;
        },
    }).done(function (data) {
        var filter = "";
        $(".loader").hide();
        /*  $('#filter_data').html(data); */
        if (data.trim() == null || data.trim() == "") {
            $('#filter_data').html("<span style='text-align: center;'>No more catalog found.</span><br><br>");
        } else {
            $('#filter_data').html(data);
        }
        isloading = true;
    });
});
function filterdata() {
    $(".loader").show();
    if ($(".filterbind").hasClass("active")) {
        $(".clearfilterbox").show();
    }
    else {
        $(".clearfilterbox").hide();
    }
    var linkGet = generate_link();
    $.ajax({
        url: baseurl + "catalog_filter.php" + linkGet,
    }).done(function (data) {
        $('#filter_data').html(data);
        if (data == null || data == "") {
            $(".loader").hide();
            $('#filter_data').html("<span style='text-align: center;'>No more catalog found.</span><br><br>");
        }
        if (seo_id != '') {
            if (pagetype == 'brand') {
                history.pushState(null, null, "/brands/" + seo_id + "/" + 1);
            } else if (pagetype == 'search') {
                history.pushState(null, null, "/search/" + seo_id + "/" + 1);
            } else {
                history.pushState(null, null, "/" + seo_id + "/page/" + 1);
            }
        }
        /*  else {
            $(".loader").hide();
            $('#errordiv').html(`  <a id="loadBtn" class="btn btn-black btn-outline btn-rounded btn-icon-right mb-3">Load More<i class="w-icon-long-arrow-down"></i></a>`);
        } */
        $('#pagination-limit-start').val(record_per_page);
        var linkGet = generate_link();
        $('#get_link').html(encodeURI(linkGet));
        isloading = true;
        $(".myLoading").hide();
        $(".loader").hide();
    });
}
/* function filterdata() {
    console.log("ghgfdhfggf");
    if ($(".filterbind").hasClass("active")) {
        $(".clearfilterbox").show();
    }
    else {
        $(".clearfilterbox").hide();
    }
    var linkGet = generate_link();
    jQuery(".myLoading").show();
    $.ajax({
        url: baseurl + "ajaxfiles/catalog_filter.php" + linkGet,
        dataType: "JSON",
    }).done(function (data) {
        $('#errordiv').html("");
        if (data.status == "error") {
            $('#filter_data').html('');
            $('#errordiv').html('No Catalog Found<br><br><span class="btn btn-border" onclick="window.location.reload();">Reload</span>');
            $('#get_link').html(encodeURI(linkGet));
            isloading = false;
        } else if (data.status == "reload") {
            location.reload();
        }
        else {
            var filter1 = "";
            $('#filter_data').html("");
            var cou = data.count;
            for (var i = 0; i < cou; i++) {
                $.ajax({
                    url: baseurl + 'product_design.php',
                    type: 'post',
                    data: { "callFuncdesing": "1", "product_data": data.catalog[i].product },
                    success: function (response) {
                        console.log("gvhgf=", response);
                        filter1 += response;
                        $('#filter_data').append(response);
                    }
                });
            }
            $('#pagination-limit-start').val(record_per_page);
            var linkGet = generate_link();
            $('#get_link').html(encodeURI(linkGet));
            isloading = true;
        }
        $(".myLoading").hide();
    });
} */
$(document).ready(function () {
    $('.clearfilterbox').click(function (e) {
        $(".filterbind").removeClass("active");
        $("#getprice").val("");
        e.preventDefault();
        filterdata();
    });
    // $('ul.filter-items li').click(function (e) {
    //     e.preventDefault();
    //     var att = $(this).find("input").attr("data-name");
    //     var attval = $(this).find("input").attr("data-namevalue");
    //     if ($(this).hasClass("tag--active") && $(this).find("input").is(':checked')) {
    //         $(this).removeClass("tag--active");
    //         $(this).find("input").removeAttr("checked");
    //     }
    //     else {
    //         $(this).addClass("tag--active");
    //         $(this).find("input").attr('checked', true);
    //     }
    //     filterdata();
    // });
    // $('ul.filter-items li').click(function (e) {
    //     e.preventDefault();
    //     var att = $(this).find("a").attr("data-name");
    //     var attval = $(this).find("a").attr("data-namevalue");
    //     if ($(this).hasClass("tag--active") && $(this).find("input").is(':checked')) {
    //                 // location.reload();
    //                 // window.location.reload()
    //                 // var xhr = new XMLHttpRequest();
    //                 // xhr.open('GET', window.location.href, true);
    //                 $(this).find("input").removeAttr("checked");
    //               $(this).removeClass("tag--active");
    //             }
    //             else {
    //                 $(this).addClass("tag--active");
    //                 $(this).find("input").attr('checked', true);
    //             }
    //     if (att == "price") {
    //         console.log("in" + att);
    //         console.log("out=." + attval);
    //         $("#getprice").val("");
    //         if($(".custprice").prop('checked') == true){
    //             $(".custprice").removeClass('active');
    //             $('input.custprice').removeAttr('checked');
    //             $('.tag').removeClass('tag--active');
    //         }
    //         else{
    //             $("#getprice").val(attval);
    //             $("." + attval).addClass('active');
    //         }
    //     }
    //     else {
    //         // console.log("out12=." + attval);
    //         console.log("out12=." + attval);
    //         if ($("." + att + "." + attval).hasClass("active")) {
    //             $("." + att + "." + attval).removeClass("active");
    //         }
    //         else {
    //             $("." + att + "." + attval).addClass("active");
    //         }
    //     }
    //     filterdata();
    // });
    $('ul.filter-items li').click(function (e) {
        e.preventDefault();
        var att = $(this).find("a").attr("data-name");
        var attval = $(this).find("a").attr("data-namevalue");
        if (att == "price") {
            $("#getprice").val("");
        }
        if ($(this).hasClass("tag--active") && $(this).find("input").is(':checked')) {
            $(this).find("input").removeAttr("checked");
            $(this).removeClass("tag--active");
            $(this).find("input").removeClass("tag--active");
        }
        else {
            if (att == "price") {
                $(".custprice").removeClass('active');
                $('input.custprice').removeAttr('checked');
                $('.tag').removeClass('tag--active');
            }
            $("#getprice").val(attval);
            $(this).addClass("tag--active");
            $(this).find("input").attr('checked', true);
            $(this).find("input").addClass('active');
            $(this).find("input").addClass('active');
        }
        filterdata();
    });
    $('.sort_by_filter').on("change", function (e) {
        $("option.kalles_dropdown_option").removeClass("selected");
        $(this).addClass("selected");
        filterdata();
    });
});
function pagination(page) {
    history.pushState(null, null, "/" + page);
    history.replaceState(null, null, "/" + page);
    $('html, body').animate({
        scrollTop: $("#scroll_section").offset().top
    }, 2000);
    $.ajax({
        type: "POST",
        url: baseurl + "ajaxfiles/newarrival_pagination.php",
        data: {
            page: page
        },
        success: function (data) {
            $("#scroll_section").replaceWith(data);
            $("#hidden_pagination").val(page);
        }
    });
}
/* Subsciber process
 */
function subscribe() {
    var subscribe_email = $("#subscribe_email").val();
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (subscribe_email == "") {
        toastr.error("", "Warning : Please Enter Your Email Address", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
    } else if (reg.test(subscribe_email) == false) {
        toastr.error("", "Warning :  Please Enter Valid Email Address", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
    } else {
        jQuery.ajax({
            type: "POST",
            data: {
                subscribe_email: subscribe_email
            },
            url: 'subscribe_process',
            success: function (response) {
                if (response == "ok") {
                    toastr.success("", "Thank You For Subscribing", {
                        "timeOut": "3000",
                        "positionClass": "toast-top-right",
                        "extendedTImeout": "0"
                    });
                    $("#subscribe_email").val("");
                    // $("#subscribe_mobile_mobile").val("");
                }
                if (response == "ok1") {
                    toastr.success("", "Thank You For Subscribing", {
                        "timeOut": "3000",
                        "positionClass": "toast-top-right",
                        "extendedTImeout": "0"
                    });
                    $("#subscribe_email").val("");
                    // $("#subscribe_mobile_mobile").val("");
                }
                if (response == "exist") {
                    toastr.error("", "Warning: you are already subscribed", {
                        "timeOut": "3000",
                        "positionClass": "toast-top-right",
                        "extendedTImeout": "0"
                    });
                }
            }
        });
    }
}
function wishlist(id, type = null) {
    var product_id = id;
    var add_type = '';
    if (type != null) {
        var add_type = "addtocart";
    }
    $.ajax({
        url: baseurl + "add_wishlist_new.php",
        type: "POST",
        dataType: "json",
        data: {
            product_id: product_id,
            cart_type: "catalog",
            add_type: add_type,
        },
        cache: false,
        success: function (data) {
            if (data.message == "add") {
                //  $("#wishlistnew" + id).removeClass('w-icon-heart-full').addClass('w-icon-heart-full');
                // $("#wishlistnew" + id).attr('title','Remove to Wishlist');
                $("#id" + id).html('<i class="fa fa-heart" style="font-size:17px;color:#dc1f26!important;"></i>');
            }
            if (data.message == "remove") {
                // $("#wishlistnew" + id).removeClass('w-icon-heart').addClass('w-icon-heart');
                // $("#wishlistnew" + id).attr('title', 'Add to Wishlist');
                $("#id" + id).html('<i class="fa fa-heart-o" style="font-size:17px;color:#dc1f26!important;"></i>');
            }
            countwish();
        }
    });
}
function delete_wishlist(product_id) {
    $.ajax({
        url: "/add_wishlist_new.php",
        type: "POST",
        dataType: "json",
        data: {
            product_id: product_id,
            cart_type: "remove",
        },
        cache: false,
        success: function (data) {
            $(".countwishlist").html(data.message);
            $("#" + product_id).css("display", "none");
            $(".countwishlist").html(data.message);
            if (data.message == 0) {
                $("#empty_wishlist").html("Your wishlist is empty !");
            } else {
                $("#empty_wishlist").html("");
            }
        }
    });
}
function countwish() {
    $.ajax({
        url: baseurl + "add_wishlist_new.php",
        type: "POST",
        dataType: "json",
        data: {
            cart_type: "count"
        },
        cache: false,
        cache: false,
        success: function (data) {
            $(".countwishlist").html(data.message);
            if (data.message > 0) {
                $(".countwishlist").css("display", "block");
            } else {
                $(".countwishlist").css("display", "none");
            }
        }
    });
}
function chkvalidate() {
    $(".signInBtn").css("pointer-events", "none");
    $(".signInBtn").html("Loading....");
    var loginInputEmail = $("#loginInputEmail").val();
    var loginInputPassword = $("#loginInputPassword").val();
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (loginInputEmail == "") {
        $(".signInBtn").css("pointer-events", "visible");
        $(".signInBtn").html("Sign In");
        $("#loginInputEmail").focus();
        $("#loginpmsg").css("color", "red");
        $("#loginpmsg").html("Enter email Id");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#loginpmsg").html('');
            $(".errors").css("display", "none");
        }, 3000);
    } else if (reg.test(loginInputEmail) == false) {
        $(".signInBtn").css("pointer-events", "visible");
        $(".signInBtn").html("Sign In");
        $("#loginInputEmail").focus();
        $("#loginpmsg").css("color", "red");
        $("#loginpmsg").html("Enter proper email Id");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#loginpmsg").html('');
            $(".errors").css("display", "none");
        }, 3000);
    } else if (loginInputPassword == "") {
        $(".signInBtn").css("pointer-events", "visible");
        $(".signInBtn").html("Sign In");
        $("#loginInputPassword").focus();
        $("#loginpmsg").css("color", "red");
        $("#loginpmsg").html("Enter Password");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#loginpmsg").html('');
            $(".errors").css("display", "none");
        }, 3000);
    } else {
        var Type = "login_with_email";
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url:"http://localhost:4000/account",
            data: {
                Type: Type,
                Email: loginInputEmail,
                Password: loginInputPassword
            },
            success: function (data) {
                //alert();
                if (data.flag == "0") {
                    $(".signInBtn").css("pointer-events", "visible");
                    $(".signInBtn").html("Sign In");
                    $("#loginpmsg").css("color", "red");
                    $("#loginpmsg").html(data.message);
                    $(".errors").css("display", "block");
                    setTimeout(function () {
                        $("#loginpmsg").html('');
                        $(".errors").css("display", "none");
                    }, 3000);
                } else {
                    var url = $("#redirect_url1").val();
                    if (data.member_page == "1") {
                        location.href = baseurl + "membership.php"
                    }
                    else {
                        /* history.back(); */
                        //location.reload();
                         location.href = "http://localhost:4000/";
                    }
                }
            }
        });
    }
}
function chkvalidatereg1() {
    $("#register-submit").val('Loading...');
    $("#register-submit").css('pointer-events','none');
    $("#regbtn").css("pointer-events", "none");
    var membership = '1';
    var fname = $("#loginInputName").val();
    var fname = fname.trim();
    var phonenumber = $("#phonenumber").val();
    var loginInputEmail = $("#loginInputEmail1").val();
    var loginInputPassword = $("#loginInputPassword1").val()
    var lname = $("#LastName").val()
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (fname == "") {
        $("#register-submit").val('Create');
        $("#register-submit").css('pointer-events','auto');
        $("#regbtn").css("pointer-events", "visible");
        $("#loginInputName").focus();
        $("#registermsg").css("color", "red");
        $(".errors").css("display", "block");
        $("#registermsg").html("Enter Full Name");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    }  else if (loginInputEmail == "") {
        $("#register-submit").val('Create');
        $("#register-submit").css('pointer-events','auto');
        $("#regbtn").css("pointer-events", "visible");
        $("#loginInputEmail1").focus();
        $("#registermsg").css("color", "red");
        $("#registermsg").html("Enter Email id");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    } else if (reg.test(loginInputEmail) == false) {
        $("#register-submit").val('Create');
        $("#register-submit").css('pointer-events','auto');
        $("#regbtn").css("pointer-events", "visible");
        $("#loginInputEmail1").focus();
        $("#registermsg").css("color", "red");
        $("#registermsg").html("Enter proper email Id");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    } else if (phonenumber == "") {
        $("#register-submit").val('Create');
        $("#register-submit").css('pointer-events','auto');
        $("#regbtn").css("pointer-events", "visible");
        $("#phonenumber").focus();
        $("#registermsg").css("color", "red");
        $("#registermsg").html("Enter Phone Number");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    } else if (phonenumber.length != "10") {
        $("#register-submit").val('Create');
        $("#register-submit").css('pointer-events','auto');
        $("#regbtn").css("pointer-events", "visible");
        $("#phonenumber").focus();
        $("#registermsg").css("color", "red");
        $("#registermsg").html("Phone number must be 10 digit");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    } else if (loginInputPassword == "") {
        $("#register-submit").val('Create');
        $("#register-submit").css('pointer-events','auto');
        $("#regbtn").css("pointer-events", "visible");
        $("#loginInputPassword").focus();
        $("#registermsg").css("color", "red");
        $("#registermsg").html("Enter Password");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    } else {
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url:  "http://localhost:4000/check_email_id",
            data: {
                Email: loginInputEmail,
                Phone: phonenumber
            },
            success: function (data) {
                if (data.flag == "0") {
                    if (data.type == "email") {
                        $("#loginInputEmail1").focus();
                    }
                    if (data.type == "phone") {
                        $("#phonenumber").focus();
                    }
                    $("#regbtn").css("pointer-events", "visible");
                    $("#register-submit").val('Create');
                    $("#register-submit").css('pointer-events','auto');
                    $("#registermsg").css("color", "red");
                    $("#registermsg").html(data.message);
                    $(".errors").css("display", "block");
                    setTimeout(function () {
                        $("#registermsg").html('');
                        $("#registermsg").css("color", "green");
                        $(".errors").css("display", "none");
                    }, 4000);
                } else {
                    var Type = "sign_with_email";
                    $.ajax({
                        type: "POST",
                        dataType: "JSON",
                        url:  "http://localhost:4000/account",
                        data: {
                            Type: Type,
                            Email: loginInputEmail,
                            Password: loginInputPassword,
                            Firstname: fname,
                            Phone: phonenumber,
                            membership: membership,
                        },
                        success: function (data) {
                            if (data.flag == "0") {
                                $("#otpmsg").css("color", "red");
                                $("#otpmsg").html(data.message);
                                setTimeout(function () {
                                    $("#otpmsg").html('<i class="icon-f-68"></i> Verify OTP');
                                    $("#otpmsg").css("color", "green");
                                }, 3000);
                            } else {
                                var url = $("#redirect_url1").val();
                                if (data.member_page == "1") {
                                    location.href = baseurl + "membership.php"
                                } else {
                                    /* history.back(); */
                                    location.reload();
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}
function chkvalidatereg2() {
    $("#regbtn").css("pointer-events", "none");
    var fname = $("#loginInputName").val();
    var phonenumber = $("#phonenumber").val();
    var loginInputEmail = $("#loginInputEmail1").val();
    var Category = $("#Category").val();
    var loginInputPassword = $("#loginInputPassword1").val()
    var user_lname = $("#user_lname").val()
    var gstNumber = $("#gstNumber").val()
    var state = $("#state").val()
    var city = $("#city").val()
    var pincode = $("#pincode").val()
    var address = $("#address").val()
    var Company_name = $("#Company_name").val()
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (fname == "") {
        $("#regbtn").css("pointer-events", "visible");
        $("#loginInputName").focus();
        $("#registermsg").css("color", "red");
        $(".errors").css("display", "block");
        $("#registermsg").html("Enter First Name");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    } else if (phonenumber == "") {
        $("#regbtn").css("pointer-events", "visible");
        $("#phonenumber").focus();
        $("#registermsg").css("color", "red");
        $("#registermsg").html("Enter Phone Number");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    } else if (Category == "") {
        $("#regbtn").css("pointer-events", "visible");
        $("#phonenCategoryumber").focus();
        $("#registermsg").css("color", "red");
        $("#registermsg").html("select category");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    } else if (phonenumber.length != "10") {
        $("#regbtn").css("pointer-events", "visible");
        $("#phonenumber").focus();
        $("#registermsg").css("color", "red");
        $("#registermsg").html("Phone number must be 10 digit");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    } else if (loginInputEmail == "") {
        $("#regbtn").css("pointer-events", "visible");
        $("#loginInputEmail1").focus();
        $("#registermsg").css("color", "red");
        $("#registermsg").html("Enter Emailid");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    } else if (reg.test(loginInputEmail) == false) {
        $("#regbtn").css("pointer-events", "visible");
        $("#loginInputEmail1").focus();
        $("#registermsg").css("color", "red");
        $("#registermsg").html("Enter proper email Id");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    } else if (loginInputPassword == "") {
        $("#regbtn").css("pointer-events", "visible");
        $("#loginInputPassword").focus();
        $("#registermsg").css("color", "red");
        $("#registermsg").html("Enter Password");
        $(".errors").css("display", "block");
        setTimeout(function () {
            $("#registermsg").html('');
            $("#registermsg").css("color", "green");
            $(".errors").css("display", "none");
        }, 3000);
    } else {
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: baseurl + "ajaxfiles/check_email_id.php",
            data: {
                Email: loginInputEmail,
                Phone: phonenumber
            },
            success: function (data) {
                if (data.flag == "0") {
                    if (data.type == "email") {
                        $("#loginInputEmail1").focus();
                    }
                    if (data.type == "phone") {
                        $("#phonenumber").focus();
                    }
                    if (data.type == "gstNumber") {
                        $("#gstnumber")();
                    }
                    if (data.type == "state") {
                        $("#state")();
                    }
                    if (data.type == "city") {
                        $("#city")();
                    }
                    if (data.type == "Company_name") {
                        $("#Company_name")();
                    }
                    if (data.type == "Category") {
                        $("#Category")();
                    }
                    if (data.type == "pincode") {
                        $("#pincode")();
                    }
                    if (data.type == "address") {
                        $("#address")();
                    }
                    $("#regbtn").css("pointer-events", "visible");
                    $("#registermsg").css("color", "red");
                    $("#registermsg").html(data.message);
                    $(".errors").css("display", "block");
                    setTimeout(function () {
                        $("#registermsg").html('');
                        $("#registermsg").css("color", "green");
                        $(".errors").css("display", "none");
                    }, 4000);
                } else {
                    var Type = "sign_with_email";
                    $.ajax({
                        type: "POST",
                        dataType: "JSON",
                        url: baseurl + "ajaxfiles/account_wholesale.php",
                        data: {
                            Type: Type,
                            Email: loginInputEmail,
                            Password: loginInputPassword,
                            Firstname: fname,
                            Phone: phonenumber,
                            gstNumber: gstNumber,
                            city: city,
                            state: state,
                            pincode: pincode,
                            address: address,
                            user_lname: user_lname,
                            Category: Category,
                            Company_name: Company_name,
                        },
                        success: function (data) {
                            if (data.flag == "0") {
                                $("#otpmsg").css("color", "red");
                                $("#otpmsg").html(data.message);
                                setTimeout(function () {
                                    $("#otpmsg").html('<i class="icon-f-68"></i> Verify OTP');
                                    $("#otpmsg").css("color", "green");
                                }, 3000);
                            } else {
                                var url = $("#redirect_url1").val();
                                if (url == "") {
                                    location.href = baseurl / 'wholesale';
                                } else {
                                    location.href = baseurl + "wholesale_checkout";
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}
function checkout_function_wholesale() {
    var grandtotalmatch = $("#cartsubtot").val();
    if (grandtotalmatch < 25000) {
        toastr.error("", "Your Order is not up to ₹25000", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
    }
    else if (session_userid_new == "") {
        $("#redirect_url1").val("checkout");
        location.href = baseurl + "wholesale_login.php";
        location.href = baseurl + "wholesale_login.php";
    }
    else {
        location.href = baseurl + "wholesale_checkout.php";
    }
}
function checkout_function(type) {
    if (type == 'checkout') {
        if (session_userid_new == "") {
            $("#redirect_url1").val("checkout");
            /* location.href = baseurl + "login.php"; */
            location.href = baseurl + "checkout";
        }
        else {
            location.href = baseurl + "checkout";
        }
    } else {
        location.href = baseurl + "cart";
    }
}
function redirect(data) {
    if (data != "") {
        location.href = data;
    }
}
function placeorder() {
    var uid = session_userid;
    var address_id = billing_address_id;
    var b_fname = $("#b_fname").val();
    var b_phone = $("#b_phone").val();
    var b_whatsapp_no = $("#b_whatsapp_no").val();
    var b_email = $("#b_email").val();
    var b_address = $("#b_address").val();
    var b_country = $("#b_country").val();
    var b_state = $("#b_state").val();
    var b_city = $("#b_city").val();
    var b_postal = $("#b_postal").val();
    var gst_no = $("#gst_no").val();
    var s_fname = $("#s_fname").val();
    var s_phone = $("#s_phone").val();
    var s_whatsapp_no = $("#s_whatsapp_no").val();
    var s_address = $("#s_address").val();
    var s_country = $("#s_country").val();
    var s_state = $("#s_state").val();
    var s_city = $("#s_city").val();
    var s_postal = $("#s_postal").val();
    /*   var addresstype = "Shipping"; */
    if (b_fname == "") {
        toastr.error("", "Please Enter Billing Name.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#b_fname").focus();
        return false;
    }
    if (b_phone == "") {
        toastr.error("", "Please Enter Billing Phone Number.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#b_phone").focus();
        return false;
    }
    /* if (b_email == "") {
        toastr.error("", "Please Enter Billing Email ID.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#b_email").focus();
        return false;
    } */
    if (b_address == "") {
        toastr.error("", "Please Enter Billing Address.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#b_address").focus();
        return false;
    }
    if (b_country == "") {
        toastr.error("", "Please Select Billing Country1.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#b_country").focus();
        return false;
    }
    if (b_postal == "") {
        toastr.error("", "Please Enter Billing Postal Code.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#b_postal").focus();
        return false;
    }
    if (b_state == "") {
        toastr.error("", "Please Enter Billing State.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#b_state").focus();
        return false;
    }
    if (b_city == "") {
        toastr.error("", "Please Enter Billing City.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#b_city").focus();
        return false;
    }
    if (s_fname == "") {
        toastr.error("", "Please Enter Shipping First Name.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#s_fname").focus();
        return false;
    }
    if (s_phone == "") {
        toastr.error("", "Please Enter Shipping Phone Number.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#s_phone").focus();
        return false;
    }
    if (s_address == "") {
        toastr.error("", "Please Enter Shipping Address.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#s_address").focus();
        return false;
    }
    if (s_country == "") {
        toastr.error("", "Please Enter Shipping Country.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#s_country").focus();
        return false;
    }
    if (s_postal == "") {
        toastr.error("", "Please Enter Shipping Postal Code.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#s_postal").focus();
        return false;
    }
    if (s_state == "") {
        toastr.error("", "Please Enter Shipping State.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#s_state").focus();
        return false;
    }
    if (s_city == "") {
        toastr.error("", "Please Enter Shipping City.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        $("#s_city").focus();
        return false;
    }
    var ShippingID = $("input[name='radioship']:checked").val();
    // if (ShippingID == undefined) {
    //     toastr.error("", "Please enter another pincode in shiping address or select shipping method.", {
    //         "timeOut": "3000",
    //         "positionClass": "toast-top-right",
    //         "extendedTImeout": "0"
    //     });
    //     return false;
    // }
    var shiptitle = $("#shiptitle").val();
    var paymentmethod = $("input[name='radiopaymenthod']:checked").val();
    if (paymentmethod == undefined) {
        toastr.error("", "Please Select Payment Method.", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        return false;
    }
    /* var productprice = $("#fullsubtotal").val(); */
    var productprice = fullsubtotal;
    if (productprice <= 0.00) {
        $("#ordererr").show();
        $("#ordererr").html("product is out of stock ! <br> go to <a href=" + baseurl + "'cart' style='color:blue'>Continue Shopping</a>");
        toastr.error("", "Product is out of stock !", {
            "timeOut": "3000",
            "positionClass": "toast-top-right",
            "extendedTImeout": "0"
        });
        return false;
    }
    var productgst = $("#totalgst").val();
    /* var discount_off=$("#discount_off").val(); */
    var discount_off = 0;
    var shipmethodprice = $("#shipping_charge_txt").val();
    var paymentmethodpri = $("#transaction_charge_txt").val();
    var fullgrandtot = $("#fullgrandtot").val();
    $("#confirm_order").css("pointer-events", "none");
    $("#confirm_order").removeAttr("onclick");
    $("#confirm_order").html('Loading...');
    $(".confirm_order").css("pointer-events", "none");
    $(".confirm_order").removeAttr("onclick");
    $(".confirm_order").html('Loading...');
    /*  jQuery(".myLoading").show(); */
    var fd = new FormData();
    fd.append('uid', uid);
    fd.append('address_id', address_id);
    fd.append('b_fname', b_fname);
    fd.append('b_phone', b_phone);
    fd.append('b_whatsapp_no', b_whatsapp_no);
    fd.append('b_email', b_email);
    fd.append('b_address', b_address);
    fd.append('b_country', b_country);
    fd.append('b_state', b_state);
    fd.append('b_city', b_city);
    fd.append('b_postal', b_postal);
    fd.append('gst_no', gst_no);
    fd.append('s_fname', s_fname);
    fd.append('s_phone', s_phone);
    fd.append('s_whatsapp_no', s_whatsapp_no);
    fd.append('s_address', s_address);
    fd.append('s_country', s_country);
    fd.append('s_state', s_state);
    fd.append('s_city', s_city);
    fd.append('s_postal', s_postal);
    fd.append('addresstype', addresstype);
    fd.append('fullsubtotal', fullsubtotal);
    var billingaddid = $("#billing_id").val();
    var shipping_id = $("#shipping_id").val();
    fd.append('shippingid', ShippingID);
    fd.append('shiptitle', shiptitle);
    fd.append('paymentmethod', paymentmethod);
    fd.append('productprice', productprice);
    fd.append('productgst', productgst);
    fd.append('discount_off', discount_off);
    fd.append('shipmethodprice', shipmethodprice);
    fd.append('paymentmethodpri', paymentmethodpri);
    fd.append('fullgrandtot', fullgrandtot);
    fd.append('billingaddid', billingaddid);
    fd.append('shippingaddressid', shipping_id);
    $.ajax({
        type: "POST",
        url: baseurl + "ajaxfiles/place_order.php",
        type: 'post',
        dataType: "json",
        data: fd,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.status == "ok") {
                var orid = data.oid;
                var ordertotal = data.ordertotal;
                var redirect_online = data.redirect_online;
                if (paymentmethod == "Online Payments" && ordertotal != 0 && redirect_online == 'yes') {
                    var oidnew = orid.toString();
                    //window.location.href="payment/ccavenue/index.php?oid="+oid;
                    if (oidnew.length > 0 && oidnew != "0") {
                        //window.location.href = baseurl + "payment/razorpay/razorpay-php-master/index.php?oid=" + orid;
                        window.location.href = baseurl + "payment/ccavenue/index.php?oid=" + orid;
                    }
                    else {
                        $("#confirm_order").css("pointer-events", "unset");
                        $("#confirm_order").attr("onclick", "placeorder()");
                        $("#confirm_order").html('Place Order');
                        $(".confirm_order").css("pointer-events", "unset");
                        $(".confirm_order").attr("onclick", "placeorder()");
                        $(".confirm_order").html('Place Order');
                        /*  jQuery(".myLoading").hide(); */
                        toastr.error("", "Something is wrong please try again !", {
                            "timeOut": "3000",
                            "positionClass": "toast-top-right",
                            "extendedTImeout": "0"
                        });
                        return false;
                    }
                }
                else if (paymentmethod == "PAYPAl") {
                    window.location.href = "payment/paypal/payments.php?oid=" + orid;
                }
                else {
                    window.location.href = baseurl + "order_details/" + orid + "/thank_you";
                }
            }
            else if (data.status == "outofstck") {
                $("#confirm_order").css("pointer-events", "unset");
                $("#confirm_order").attr("onclick", "placeorder()");
                $("#confirm_order").html('Place Order');
                $(".confirm_order").css("pointer-events", "unset");
                $(".confirm_order").attr("onclick", "placeorder()");
                $(".confirm_order").html('Place Order');
                /*  jQuery(".myLoading").hide(); */
                toastr.error("", data.message, {
                    "timeOut": "3000",
                    "positionClass": "toast-top-right",
                    "extendedTImeout": "0"
                });
                // return false;
                window.location.href = baseurl + "order_details/" + orid + "/thnak_you";
            }
            else {
                $("#confirm_order").css("pointer-events", "unset");
                $("#confirm_order").attr("onclick", "placeorder()");
                $("#confirm_order").html('Place Order');
                $(".confirm_order").css("pointer-events", "unset");
                $(".confirm_order").attr("onclick", "placeorder()");
                $(".confirm_order").html('Place Order');
                /*  jQuery(".myLoading").hide(); */
                toastr.error("", data.message, {
                    "timeOut": "3000",
                    "positionClass": "toast-top-right",
                    "extendedTImeout": "0"
                });
                return false;
            }
        }
    });
}
$(".suggesstion-box").hide();
$(function () {
    $(".price-range__slider").on({
    });
    $(document).on('slidestop', '.price-range__slider', function () {
    })
    $(document).on('click', '.icon-close', function () {
        $(".suggesstion-box").hide();
        $(".serchtextbox").val("");
    })
        .on('click', '#RecoverPassword', function () {
            $("#CustomerLoginForm").hide();
            $("#mobileoginForm").hide();
            $("#RecoverPasswordForm").show();
        })
        .on('click', '#HideRecoverPasswordLink', function () {
            $("#CustomerLoginForm").show();
            $("#RecoverPasswordForm").hide();
            $("#mobileoginForm").hide();
            $("#mobilelogin").html('Login With Mobile');
        })
        .on('click', '#mobilelogin', function () {
            $("#mobileoginForm").show();
            $("#CustomerLoginForm").hide();
            $("#RecoverPasswordForm").hide();
        })
        .on('keyup', '.serchtextbox', function () {
            console.log("HERE");
            $(".suggesstion-box").show();
            var search_result = "";
            var search_value = $(this).val().toLowerCase();
            if (search_value == "") {
                $(".suggesstion-box").hide();
                return false;
            }
            $.ajax({
                url: baseurl + "ajaxfiles/search_catalog.php",
                dataType: "JSON",
                data: {
                    search: search_value,
                },
                success: function (data) {
                    if (data.status == "ok") {
                        $.map(data.catalog, function (item) {
                            search_result += `<li>
                                                    <a href="${baseurl}product/${item.product_seo_url}" class="">
                                                        <div class="search-game-name">
                                                            ${item.product_name}
                                                        </div>
                                                    </a>
                                                </li>`;
                        });
                        if (search_value == "") {
                            $(".suggesstion-box").hide();
                        } else {
                            $(".suggesstion-box").show();
                            $(".suggesstion-box").html(search_result);
                        }
                    } else if (data.status == "error") {
                        search_result += `<li>
                                            <div class="search-game-name">
                                                No catlog Found
                                            </div>
                                        </li>`;
                        if (search_value == "") {
                            $(".suggesstion-box").hide();
                        } else {
                            $(".suggesstion-box").html(search_result);
                        }
                    }
                }
            })
        })
        /*  .on('keyup', '.serchtextboxCustom', function () {
             $(".suggesstion-box").show();
             var search_result = "";
             var search_value = $(this).val().toLowerCase();
             if (search_value == "") {
                 $(".suggesstion-box").hide();
                 return false;
             }
             $.ajax({
                 url: baseurl + "ajaxfiles/search_catalog.php",
                 dataType: "JSON",
                 data: {
                     search: search_value,
                 },
                 success: function (data) {
                     if (data.status == "ok") {
                         $.map(data.catalog, function (item) {
                             search_result += `<li>
                                         <a href="${baseurl}product/${item.product_seo_url}" class="">
                                             <div class="search-game-name">
                                                 ${item.product_name}
                                             </div>
                                         </a>
                                 </li>`;
                         });
                         if (search_value == "") {
                             $(".suggesstion-box").hide();
                         } else {
                             $(".suggesstion-box").html(search_result);
                         }
                     } else if (data.status == "error") {
                         search_result += `<li>
                                     <div class="search-game-name">
                                         No catlog Found
                                     </div>
                     </li>`;
                         if (search_value == "") {
                             $(".suggesstion-box").hide();
                         } else {
                             $(".suggesstion-box").html(search_result);
                         }
                     }
                 }
             })
         }) */
        .on('click', '.serchtextbox', function () {
            $(".suggesstion-box").show();
            var search_result = "";
            var search_value = $(this).val().toLowerCase();
            $.ajax({
                url: baseurl + "ajaxfiles/search_catalog_new.php",
                dataType: "JSON",
                data: {
                    // search: search_value,
                },
                success: function (data) {
                    if (data.status == "ok") {
                        $.map(data.catalog, function (item) {
                            search_result += `<a href="${baseurl}${item.product_seo_url}" class="">
                                    <div class="search-game-name">
                                        ${item.product_name}
                                    </div>
                            </a>
                    </li>`;
                        });
                        if (search_value != "") {
                            $(".suggesstion-box").hide();
                        } else {
                            $(".suggesstion-box").html(search_result);
                        }
                    } else if (data.status == "error") {
                        search_result += `<li>
                                    <div class="search-game-name">
                                        No catlog Found
                                    </div>
                    </li>`;
                        if (search_value == "") {
                            $(".suggesstion-box").hide();
                        } else {
                            $(".suggesstion-box").html(search_result);
                        }
                    }
                }
            })
        })
});
function search_enter() {
    if (event.key == 'Enter') {
        var search_name = $("#searchpro_desktop").val();;
        if (search_name != "") {
            window.location.href = baseurl + "search/" + search_name + "/1";
        }
    }
}
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
function get_pincode(type) {
   /*  calculateshipping() */
    var shipping = 0;
    if (type == "billing") {
        var b_postal = $("#b_postal").val();
        /*  $(".shipping-charge").html(currency_symbol + "" + Math.round(((shipping / parseFloat(currency_cost)) * 100) / 100)); */
    }
    if (type == "shipping") {
        var b_postal = $("#s_postal").val();
        /*  $(".shipping-charge").html(currency_symbol + "" + Math.round(((shipping / parseFloat(currency_cost)) * 100) / 100)); */
    }
    if (type == "shipping_edit") {
        var b_postal = $("#shippingpincode1").val();
        /*  $(".shipping-charge").html(currency_symbol + "" + Math.round(((shipping / parseFloat(currency_cost)) * 100) / 100)); */
    }
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: baseurl + "ajaxfiles/get_sc_from_pincode.php",
            data: { pincode: b_postal },
            success: function (data) {
                if (type == "billing") {
                    $("#b_state").val(data.state_name);
                    $("#b_city").val(data.city_name);
                    calculateshipping()
                }
                if (type == "shipping") {
                    $("#s_state").val(data.state_name);
                    $("#s_city").val(data.city_name);
                    calculateshipping()
                }
                if (type == "shipping_edit") {
                    $("#shippingstate").val(data.state_name);
                    $("#shippingcity").val(data.city_name);
                }

            }
        });
}
$(document).on("click", ".showshipblock", function () {
    $("#billing_address_selector-custom_billing_address-collapsible").css({
        "height": "0px",
        "overflow": "hidden"
    })
    var iz_checked = $('input[name="billing_address_selector"]:checked').val();
    var b_fname = $("input[name=b_fname]").val();
    var b_lname = $("input[name=b_lname]").val();
    var b_phone = $("input[name=b_phone]").val();
    /*  var b_email = $("input[name=b_email]").val(); */
    var b_address = $("#b_address").val();
    var b_country = $('select[name=b_country]').find(':selected').text();
    var b_state = $("input[name=b_state]").val();
    var b_city = $("input[name=b_city]").val();
    var b_postal = $("input[name=b_postal]").val();
    if ($(this).hasClass("ship")) {
        $("#billing_address_selector-custom_billing_address-collapsible").css({
            "height": "auto",
            "overflow": "visible"
        });
        if(previosstatte == 0 && iz_checked == 1){
        $("input[name=s_fname]").val('');
        $("input[name=s_lname]").val('');
        $("input[name=s_phone]").val('');
        /*  $("input[name=s_email]").val(b_email); */
        $("#s_address").val('');
        $("select[name=s_country]").val('');
        $("input[name=s_state]").val('');
        $("input[name=s_city]").val('');
        $("input[name=s_postal]").val('');
        }
        previosstatte = 1;
    } else {
        $("input[name=s_fname]").val(b_fname);
        $("input[name=s_lname]").val(b_lname);
        $("input[name=s_phone]").val(b_phone);
        /*  $("input[name=s_email]").val(b_email); */
        $("#s_address").val(b_address);
        $("select[name=s_country]").val(b_country);
        $("input[name=s_state]").val(b_state);
        $("input[name=s_city]").val(b_city);
        $("input[name=s_postal]").val(b_postal);
        previosstatte = 0;
    }
});
function check1() {
    var uid = session_userid;
    var address_id = billing_address_id;
    var b_fname = $("#b_fname").val();
    var new_mobile_no = $("#new_mobile_no").val();
    var b_lname = $("#b_lname").val();
    var b_phone = $("#b_phone").val();
    var b_email = $("#b_email").val();
    var b_address = $("#b_address").val();
    /* var b_country = $("#b_country").val(); */
    var b_country = $('select[name=b_country]').find(':selected').text();
    var b_state = $("#b_state").val();
    var b_city = $("#b_city").val();
    var b_postal = $("#b_postal").val();
    /* var gst_no = $("#gst_no").val(); */
    var iz_checked = $('input[name="billing_address_selector"]:checked').val();
    var iz_checked_shipping = $('input[name="shipping_address_selector"]:checked').val();
    /* $("input:radio[name='billing_address_selector']").each(function(){
    iz_checked = iz_checked && $(this).is(':checked');
    }); */
    addresstype = "Shipping";
    if (iz_checked == "0") {
        $("input[name=s_fname]").val(b_fname);
        $("input[name=s_lname]").val(b_lname);
        $("input[name=s_phone]").val(b_phone);
        $("input[name=s_email]").val(b_email);
        $("#s_address").val(b_address);
        $("select[name=s_country]").val(b_country);
        $("input[name=s_state]").val(b_state);
        $("input[name=s_city]").val(b_city);
        $("input[name=s_postal]").val(b_postal);
        addresstype = "Billing";
    }
    var s_fname = $("#s_fname").val();
    var s_lname = $("#s_lname").val();
    var s_phone = $("#s_phone").val();
    var s_address = $("#s_address").val();
    var s_country = $("#s_country").val();
    var s_state = $("#s_state").val();
    var s_city = $("#s_city").val();
    var s_postal = $("#s_postal").val();
    if (b_fname == "") {
        $("#step1err").html("Please Enter Billing First Name.");
    } else if (b_phone == "") {
        $("#step1err").html("Please Enter Billing Phone Number.");
    } else if (b_phone.length != 10) {
        $("#step1err").html("Length of Billing Phone Number should be 10 digit.");
    }
    else if (b_address == "") {
        $("#step1err").html("Please Enter Billing Address.");
        /*  } else if (b_lname == "") {
             $("#step1err").html("Please Enter Billing Last Name.");
          else if(b_email == ""){
                                 $("#step1err").html("Please Enter Billing Email ID.");
                             }
         } */
    } else if (b_country == "") {
        $("#step1err").html("Please Select Billing Country2.");
    } else if (b_state == "") {
        $("#step1err").html("Please Enter Billing State.");
    } else if (b_city == "") {
        $("#step1err").html("Please Enter Billing City.");
    } else if (b_postal == "") {
        $("#step1err").html("Please Enter Billing Postal Code.");
    }
    else if (iz_checked == undefined && iz_checked_shipping == undefined) {
        $("#step1err").html("Please Select Shipping Address");
    }
    else if (s_country == "") {
        $("#step1err").html("Please Select Shipping Country.");
    }
    else if (s_fname == "") {
        $("#step1err").html("Please Enter Shipping First Name.");
        /* } else if (s_lname == "") {
            $("#step1err").html("Please Enter Shipping Last Name."); */
    } else if (s_phone == "") {
        $("#step1err").html("Please Enter Shipping Phone Number.");
    } else if (s_phone.length != 10) {
        $("#step1err").html("Length of Shipping Phone Number should be 10 digit.");
    } else if (s_address == "") {
        $("#step1err").html("Please Enter Shipping Address.");
    } else if (s_state == "") {
        $("#step1err").html("Please Enter Shipping State.");
    } else if (s_city == "") {
        $("#step1err").html("Please Enter Shipping City.");
    } else if (s_postal == "") {
        $("#step1err").html("Please Enter Shipping Postal Code.");
    } else if (uid == "" && new_mobile_no == "") {
        $("#step1err").html("Enter Mobile No.");
    }
    else if (uid == "" && new_mobile_no.length != 10) {
        $("#step1err").html("Length of mobile no. should be 10 digit.");
    } else {
        $("#step1err").html("");
        $.ajax({
            type: "POST",
            url: "ajaxfiles/insert_address_data.php",
            data: {
                uid: uid,
                address_id: address_id,
                b_fname: b_fname,
                b_lname: b_lname,
                b_phone: b_phone,
                b_email: b_email,
                b_address: b_address,
                b_country: b_country,
                b_state: b_state,
                b_city: b_city,
                b_postal: b_postal,
                /* gst_no: gst_no, */
                s_fname: s_fname,
                s_lname: s_lname,
                s_phone: s_phone,
                s_address: s_address,
                s_country: s_country,
                s_state: s_state,
                s_city: s_city,
                s_postal: s_postal,
                addresstype: addresstype,
                new_mobile_no: new_mobile_no
            },
            dataType: "JSON",
            success: function (response) {
                if (response.status == "ok") {
                    $(".stepOneBtn").hide();
                    $(".step-check-1").show();
                    $(".stepTwoBtn").show();
                    $("#billing_id").val(response.billing_id);
                    $("#shipping_id").val(response.shipping_id);
                    $("#sipadress").val(s_fname + s_address);
                    $("#o_email").val(b_email);
                } else if (response.status == "error") {
                    $("#step1err").html(response.message);
                    $("#new_mobile_no").focus();
                } else {
                    $("#step1err").html("Something went wrong.");
                }
            }
        })
    }
}
function check2() {
    var address_id = billing_address_id;
    var b_fname = $("#b_fname").val();
    var b_lname = $("#b_lname").val();
    var b_phone = $("#b_phone").val();
    var b_email = $("#b_email").val();
    var b_address = $("#b_address").val();
    /* var b_country = $("#b_country").val(); */
    var b_country = $('select[name=b_country]').find(':selected').text();
    var b_state = $("#b_state").val();
    var b_city = $("#b_city").val();
    var b_postal = $("#b_postal").val();
    /* var gst_no = $("#gst_no").val(); */
    var s_fname = $("#s_fname").val();
    var s_lname = $("#s_lname").val();
    var s_phone = $("#s_phone").val();
    var s_address = $("#s_address").val();
    var s_country = $("#s_country").val();
    var s_state = $("#s_state").val();
    var s_city = $("#s_city").val();
    var s_postal = $("#s_postal").val();
    var iz_checked = $('input[name="billing_address_selector"]:checked').val();
    /* $("input:radio[name='billing_address_selector']").each(function(){
    iz_checked = iz_checked && $(this).is(':checked');
    }); */
    addresstype = "Shipping";
    if (iz_checked == "0") {
        $("input[name=s_fname]").val(b_fname);
        $("input[name=s_lname]").val(b_lname);
        $("input[name=s_phone]").val(b_phone);
        $("input[name=s_email]").val(b_email);
        $("#s_address").val(b_address);
        $("select[name=s_country]").val(b_country);
        $("input[name=s_state]").val(b_state);
        $("input[name=s_city]").val(b_city);
        $("input[name=s_postal]").val(b_postal);
        addresstype = "Billing";
    }
    if (b_fname == "") {
        $("#step1err").html("Please Enter Billing First Name.");
    } else if (b_lname == "") {
        $("#step1err").html("Please Enter Billing Last Name.");
    } else if (b_phone == "") {
        $("#step1err").html("Please Enter Billing Phone Number.");
    }
    else if (b_email == "") {
        $("#step1err").html("Please Enter Billing Email ID.");
    }
    else if (b_country == "") {
        $("#step1err").html("Please Select Billing state.");
    }
    else if (b_address == "") {
        $("#step1err").html("Please Enter Billing Address...");
    } else if (b_state == "") {
        $("#step1err").html("Please Enter Billing State.");
    }
    // else if (b_city == "") {
    //     $("#step1err").html("Please Enter Billing City.");
    // } else if (b_postal == "") {
    //     $("#step1err").html("Please Enter Billing Postal Code.");
    // } else if(iz_checked == undefined){
    //     $("#step1err").html("Please Select Shipping Address");
    // }
    // else if (s_country == "") {
    //     $("#step1err").html("Please Select Shipping Country.");
    // }
    else if (s_fname == "") {
        $("#step1err").html("Please Enter Shipping First Name.");
    } else if (s_lname == "") {
        $("#step1err").html("Please Enter Shipping Last Name.");
    } else if (s_phone == "") {
        $("#step1err").html("Please Enter Shipping Phone Number.");
    } else if (s_address == "") {
        $("#step1err").html("Please Enter Shipping Address.");
    } else if (s_state == "") {
        $("#step1err").html("Please Enter Shipping State.");
    } else if (s_city == "") {
        $("#step1err").html("Please Enter Shipping City.");
    } else if (s_postal == "") {
        $("#step1err").html("Please Enter Shipping Postal Code.");
    } else {
        $("#step1err").html("");
        $.ajax({
            type: "POST",
            url: "ajaxfiles/insert_address_data.php",
            data: {
                uid: uid,
                address_id: address_id,
                b_fname: b_fname,
                b_lname: b_lname,
                b_phone: b_phone,
                b_email: b_email,
                b_address: b_address,
                b_country: b_country,
                b_state: b_state,
                b_city: b_city,
                b_postal: b_postal,
                /* gst_no: gst_no, */
                s_fname: s_fname,
                s_lname: s_lname,
                s_phone: s_phone,
                s_address: s_address,
                s_country: s_country,
                s_state: s_state,
                s_city: s_city,
                s_postal: s_postal,
                addresstype: addresstype
            },
            dataType: "JSON",
            success: function (response) {
                if (response.status == "ok") {
                    $(".stepOneBtn").hide();
                    $(".step-check-1").show();
                    $(".stepTwoBtn").show();
                    $("#billing_id").val(response.billing_id);
                    $("#shipping_id").val(response.shipping_id);
                    $("#sipadress").val(s_fname + s_address);
                    $("#o_email").val(b_email);
                }
            }
        })
    }
}



function fetchshipping(shipping_address_id,uid) {


    var shipping_address_id = shipping_address_id;


    $.ajax({
        type: "POST",
        url: baseurl + "ajaxfiles/get_shipping_adress.php",
        dataType: "JSON",
        data: { UserID: uid, shipping_address_id: shipping_address_id},
        success: function (data) {

            if (data.status == "ok") {
                shipping_array = data.shipping_array;
                $("input[name=s_fname]").val(shipping_array.first_name);
                $("input[name=s_lname]").val(shipping_array.last_name);
                $("input[name=s_phone]").val(shipping_array.phone_no);
                $("input[name=s_email]").val(shipping_array.email_id);
                $("#s_address").val(shipping_array.address);
                $("select[name=s_country]").val(shipping_array.country);
                $("input[name=s_state]").val(shipping_array.state);
                $("input[name=s_city]").val(shipping_array.city);
                $("input[name=s_postal]").val(shipping_array.pincode);

            }

            calculateshipping()
        }
    });

}
function calculateshipping() {
    // var b_postal = $("#b_postal").val();
    // var s_postal = $("#s_postal").val();
    var b_country = $("#b_country").val();
    /* if (b_postal == s_postal) {
        return false;
    } */
    // if (s_postal == "" || s_postal == undefined) {
    //     s_postal = b_postal;
    // }
    var paymentmethod = $("input[name='radiopaymenthod']:checked").val();
    var sid = $("#shipping_id").val();
    var UserID = session_userid;
    var s_country = $("#s_country").val();
    var b_country = $("#b_country").val();
    if (s_country == "" || s_country == undefined) {
        s_country = $("#b_country").val();
    }
    $.ajax({
        type: "POST",
        url: baseurl + "ajaxfiles/get_shipping.php",
        dataType: "JSON",
        data: { UserID: UserID, sid: sid, b_country: b_country, paymentmethod: paymentmethod, s_country: s_country },
        success: function (data) {
            var method = "";
            if (data.status == "ok") {
                var shiplength = data.count;
                handling_charge = data.handling_charge;

                for (i = 0; i < shiplength; i++) {
                    var id1 = data.shipping_method[i].id;
                    var title = data.shipping_method[i].title;
                    var shipprice = data.shipping_method[i].price;
                    if (shipprice == "") {
                        shipprice = 0;
                    }
                    shipprice = Math.round(((shipprice / parseFloat(c_convert)) * 100) / 100);
                    /* if(shipprice != "0")
                    { */

                    var check = "";
                    if (i == 0) {
                        check = "checked";
                        storeshipprice(shipprice, `${title}`);
                    }
                    method += `<div class="shipping_method">
                                                <input type="radio" id="radioship${id1}" ${check} class="input-radio" name="radioship" onclick="storeshipprice(${shipprice},'${title}')" value="${id1}">
                                                <label for="">We Will Contact You Soon</label>
                                            </div>`;
                }
                $("#shippingmethod").html("<input type='hidden' id='shiptitle'>" + method);
            }
            else {
                method += `<li class="payment_method">
                                              <label>Courier service is not provided this ${b_country} </label>
                                            </li>`;
                $("#shippingmethod").html(method);
            }
        }
    });
}

function store_value(value, name) {
    $.ajax({
        type: "POST",
        url: baseurl + "ajaxfiles/store_value.php",
        dataType: "JSON",
        data: { value: value, name: name },
        success: function (data) {
            var method = "";
            if (data.status == "ok") {
                name = data.price;
            }
        }
    });
    return value;
}
function calculate_grandtotal() {
    var coupon = coupon_discount_tot;
    var use_point = wallet_point;
    var use_cash_point = wallet_cash_point;
    var scheme_discount = combo_discount;
    var handling_chrg = handling_charge;
    var subtotal = fullsubtotal;
    var shipping_charge11 = shipmethodprice;
    var transaction_charge = paymentmethodpri;
    console.log('ss',shipping_charge11);
    console.log('tt',transaction_charge);
    console.log('hh',handling_chrg);
    var gst = 0;
    handling_chrg = store_value(handling_chrg, 'handlingcharge');
    scheme_discount = store_value(scheme_discount, 'combodiscount');
    var totalgst = parseInt(gst);
    var currency_cost = c_convert;
    var grand_total = parseInt(subtotal) + parseInt(shipping_charge11) + parseInt(transaction_charge) + parseInt(handling_chrg);
    var grand_total_point = parseInt(subtotal) + parseInt(shipping_charge11) + parseInt(transaction_charge) + parseInt(handling_chrg);
    totalgst = 0;

    if (handling_chrg > 0) {
        $(".handling-charge").html(currency_symbol + "" + Math.round((parseInt(handling_chrg) / parseFloat(currency_cost)) * 100) / 100);
        $("#handlingchargemob").show();
        $("#handlingcharge").show();
    } else {
        $("#handlingchargemob").hide();
        $("#handlingcharge").hide();
    }
    fullgrandtot = store_value(grand_total, 'fullgrandtot');
    fullgrandtot = fullgrandtot - +coupon;
    grand_total_point = grand_total_point - +coupon;
    grand_total_point = store_value(grand_total_point, 'grand_total_point');
    fullsubtotal = store_value(fullsubtotal, 'fullsubtotal');
    $(".total-value").html(currency_symbol + "" + Math.round((parseInt(fullgrandtot) / parseFloat(currency_cost)) * 100) / 100);
    $('.shopingcart_total').html(currency_symbol + Math.round((parseInt(fullgrandtot) / parseFloat(currency_cost)) * 100) / 100)
}
function inquiry_popup() {
}
function paymentprice(type) {
    var paymentmethod = $("input[name='radiopaymenthod']:checked").val();
    var cartvalue1 = fullsubtotal;
    var coupon = 0;
    var gst = 0;
    var cartvalue = +cartvalue1 - +coupon + +gst + +shipmethodprice;
    var currency_cost = c_convert;
    // if(cartvalue >= 1000)
    // {
    //     var shipping=0;
    // }
    if (type == "razorpay") {
        // var transaction_charge = (parseInt(cartvalue) * (2.5)) / 100;
        var transaction_charge = (parseInt(cartvalue) * (2)) / 100;
        transaction_charge = 0;
        paymentmethodpri = store_value(Math.round(transaction_charge), 'paymentmethodpri');
        $(".transaction-charge").html(currency_symbol + "" + Math.round(((transaction_charge / parseFloat(currency_cost)) * 100) / 100));
        $("#transaction_charge_txt").val(Math.round(((transaction_charge / parseFloat(currency_cost)) * 100) / 100));
        $(".transaction_charge_text").html("Transection Charges");
        $(".show_cod").hide();
    } else if (type == "paypal") {
        var charge1 = (parseInt(cartvalue) * 7.40) / 100;
        var transaction_charge = charge1 + (charge1 * 18) / 100 + 0.30;
        paymentmethodpri = store_value(Math.round(transaction_charge), 'paymentmethodpri');
        $(".transaction-charge").html(currency_symbol + "" + Math.round(((transaction_charge / parseFloat(currency_cost)) * 100) / 100));
    } else if (type == "direct") {
        var charge1 = (parseInt(cartvalue) * 7.40) / 100;
        var transaction_charge = charge1 + (charge1 * 18) / 100 + 0.30;
        var transaction_charge = 0;
        paymentmethodpri = store_value(Math.round(transaction_charge), 'paymentmethodpri');
        //  $(".shipping-charge").html(currency_symbol + "" + Math.round(((shipping / parseFloat(currency_cost)) * 100) / 100));
        $(".transaction-charge").html(currency_symbol + "" + Math.round(((transaction_charge / parseFloat(currency_cost)) * 100) / 100));
        $(".transaction-charge").html('<i class="fa fa-info-circle" style="cursor:pointer" data-toggle="modal" data-target="#myModalInquiry" onclick="inquiry_popup()" aria-hidden="true"></i> COD');
    }
    else if (type == "cod") {
        /*  var charge1 = (parseInt(cartvalue) * 7.40) / 100;
         var transaction_charge = charge1 + (charge1 * 18) / 100 + 0.30;
         var transaction_charge = 0; */
        /* if(cod_percent <= 0){
            cod_percent = 2;
        }
        if(minimum_charge <= 0){
            minimum_charge = 50;
        } */
        var transaction_charge = 0;
        if (is_apply_cod == 1) {
            var transaction_charge = (parseInt(cartvalue) * cod_percent) / 100;
            if (transaction_charge < minimum_charge) {
                transaction_charge = minimum_charge;
            }
        }

        paymentmethodpri = store_value(Math.round(transaction_charge), 'paymentmethodpri');
        $(".transaction-charge").html(currency_symbol + "" + Math.round(((transaction_charge / parseFloat(currency_cost)) * 100) / 100));
        $(".transaction-charge").html(currency_symbol + "" + Math.round(((transaction_charge / parseFloat(currency_cost)) * 100) / 100));
        /*  $(".transaction-charge").html('<i class="fa fa-info-circle" style="cursor:pointer" data-toggle="modal" data-target="#myModalInquiry" onclick="inquiry_popup()" aria-hidden="true"></i> 0'); */
        $("#transaction_charge_txt").val(Math.round(((transaction_charge / parseFloat(currency_cost)) * 100) / 100));
        $(".transaction_charge_text").html("COD Charges");
        $(".show_cod").show();
    } else {
        var charge1 = (parseInt(cartvalue) * 7.40) / 100;
        var transaction_charge = charge1 + (charge1 * 18) / 100 + 0.30;
        var transaction_charge = 0;
        paymentmethodpri = store_value(Math.round(transaction_charge), 'paymentmethodpri');
        $(".transaction-charge").html(currency_symbol + "" + Math.round(((transaction_charge / parseFloat(currency_cost)) * 100) / 100));
    }
    calculate_grandtotal()
}
function storeshipprice(shipprice, title) {
    // $("#shiptitle").val(title);
    // if (b_country != "DELHI"){
    //     shipprice == 10;
    // }else{
    //     shipprice == 10
    //     ;
    // }
    // if (shipprice == "") {
    //     shipprice == 10;
    // }
    //  if(cartvalue1 >= '10000'){
    // shipprice= 50;
    //  }
    // else{
    //     shipprice= 0;
    // }
    var ShippingID = $("input[name='radioship']:checked").val();
    shipmethodprice = store_value(shipprice, 'shipmethodprice');
    store_value(title, 'shipmethodtitle');
    $(".shipping-charge").html(currency_symbol + " " + Math.round((parseInt(shipprice) / parseFloat(c_convert)) * 100) / 100);
    calculate_grandtotal();
}
function store_value(value, name) {
    $.ajax({
        type: "POST",
        url: baseurl + "ajaxfiles/store_value.php",
        dataType: "JSON",
        data: { value: value, name: name },
        success: function (data) {
            var method = "";
            if (data.status == "ok") {
                name = data.price;
            }
        }
    });
    return value;
}

function paymentpricewholesale(type) {
    var paymentmethod = $("input[name='radiopaymenthod']:checked").val();
    var cartvalue1 = fullsubtotal;
    var coupon = 0;
    var gst = fullgst;
    var cartvalue = +cartvalue1 - +coupon + +gst + +shipmethodprice;
    var currency_cost = c_convert;
    if (cartvalue1 <= 50000) {
        var transaction_charge1 = (parseInt(cartvalue1) * (0)) / 100;
    }
    else if (cartvalue1 >= 50000) {
        var transaction_charge1 = (parseInt(cartvalue1) * (2)) / 100;
    }
    else if (cartvalue1 >= 100000) {
        var transaction_charge1 = (parseInt(cartvalue1) * (5)) / 100;
    }
    if (type == "razorpay") {
        // var transaction_charge = (parseInt(cartvalue) * (2.5)) / 100;
        var transaction_charge = (parseInt(cartvalue) * (transaction_charge1)) / 100;
        // var transaction_charge = 0;
        paymentmethodpri = store_value(Math.round(transaction_charge1), 'paymentmethodpri');
        $(".transaction-charge").html(currency_symbol + "" + Math.round(((transaction_charge1 / parseFloat(currency_cost)) * 100) / 100));
        $("#transaction_charge_txt").val(Math.round(((transaction_charge1 / parseFloat(currency_cost)) * 100) / 100));
    }
    else if (type == "paypal") {
        var charge1 = (parseInt(cartvalue) * 7.40) / 100;
        var transaction_charge = charge1 + (charge1 * 18) / 100 + 0.30;
        paymentmethodpri = store_value(Math.round(transaction_charge), 'paymentmethodpri');
        $(".transaction-charge").html(currency_symbol + "" + Math.round(((transaction_charge / parseFloat(currency_cost)) * 100) / 100));
    } else if (type == "direct") {
        var charge1 = (parseInt(cartvalue) * 7.40) / 100;
        var transaction_charge = charge1 + (charge1 * 18) / 100 + 0.30;
        var transaction_charge = 0;
        paymentmethodpri = store_value(Math.round(transaction_charge), 'paymentmethodpri');
        $(".transaction-charge").html(currency_symbol + "" + Math.round(((transaction_charge / parseFloat(currency_cost)) * 100) / 100));
    } else {
        var charge1 = (parseInt(cartvalue) * 7.40) / 100;
        var transaction_charge = charge1 + (charge1 * 18) / 100 + 0.30;
        var transaction_charge = 0;
        paymentmethodpri = store_value(Math.round(transaction_charge), 'paymentmethodpri');
        $(".transaction-charge").html(currency_symbol + "" + Math.round(((transaction_charge / parseFloat(currency_cost)) * 100) / 100));
    }
    calculate_grandtotal_wholesale()
}

function paymentpricewholesalewallet(type) {
    if (type == "wallet") {
        wallet_method_price = (wallet_ammount);
        // $(".wallet_amount_txt").html(Math.round(wallet_method_price ));
        $(".wallet_amount_txt").html(Math.round(wallet_method_price));
        var wallet_method_price1 = $(".wallet_amount_txt").html();
        var fullgrandtot = $("#fullgrandtot").val();
        var fullgrandtot1 = $("#fullgrandtot").val();
        var cartvalue = 5;
        var charge1 = (parseInt(cartvalue) * 7.40) / 100;
        walletmethodprice1 = store_value(Math.round(wallet_method_price1), 'walletmethodprice');
        // var transaction_charge = charge1 + (charge1 * 18) / 100 + 0.30;
        var transaction_charge = 0;
        paymentmethodpri = store_value(Math.round(transaction_charge), 'paymentmethodpri');
        $(".transaction-charge").html(currency_symbol + "" + Math.round((transaction_charge)));
    }
    calculate_grandtotal_wholesalewallet()
}
function check_coupon_new() {
    var uid = session_userid;
    $("#coupon_list").html("");
    $.ajax({
        type: "POST",
        url: baseurl + "ajaxfiles/check_coupon.php",
        dataType: "JSON",
        data: { UserID: uid },
        success: function (data) {
            if (data.count == "0") {
                var emptdsf = ` <span class="product-price">Coupon is Not Available</span>`;
                $("#coupon_list").html(emptdsf);
            }
            else {
                var coupon_list = `<table>
                                    <tr>
                                        <th></th>
                                        <th style="font-size: 15px;">Coupon Name</th>
                                        <th class="mobcol" style="font-size: 15px;">Remark</th>
                                    </tr>`;
                var coup = data.count;
                for (i = 0; i < coup; i++) {
                    var coupon_name = data.coupon_list[i].coupon_name;
                    var remark = data.coupon_list[i].remark;
                    var visible = data.coupon_list[i].visible;
                    var coupon_id = data.coupon_list[i].coupon_id;
                    var discounted_amount_cost = data.coupon_list[i].discounted_amount_cost;
                    var colorr = "";
                    var apply = `<a href="javascript:void(0)" data-couponid="${coupon_id}" data-couponamt="${discounted_amount_cost}" class="buttonbig buynow-but hvr-grow pull-right m-floatnone m-w100 m-mrg-top10 couponnew"> Apply</a>`;
                    if (visible == 1) {
                        colorr = "color:red;";
                        apply = '';
                    }
                    coupon_list += `
                                        <tbody>
                                            <tr>
                                                <td>${apply}</td>
                                                <td style="font-size: 15px;">
                                                    ${coupon_name}
                                                </td>
                                                <td class="mobcol" style="font-size: 15px;${colorr}">
                                                   ${remark}
                                                </td>
                                        </tbody>
                               `;
                }
                coupon_list += `</table>`;
                $("#coupon_list").html(coupon_list);
            }
            $(".coupon-popup").click();
        }
    });
}
$(document).on('click', '.couponnew', function () {
    var coupon_id = $(this).attr('data-couponid');
    var coupon_discount = $(this).attr('data-couponamt');
    var currency_cost = c_convert;
    store_value(coupon_discount, 'discount');
    store_value(coupon_id, 'coupon');
    coupon_discount_tot = coupon_discount;
    $("#coupon_discount").html(currency_symbol + Math.round((parseInt(coupon_discount) / parseFloat(currency_cost)) * 100) / 100);
    calculate_grandtotal();
    $("#coupon_error").show();
    $("#removediscount").show();
    $("#discount_section").show();
    $("#coupon_error").css('color', 'green');
    $("#coupon_error").html("You got discount of " + coupon_discount + " Rs.");
    $(".couponremov").show();
    setTimeout(function () {
        $(".coupon_close").click();
    }, 3000);
});
function storeshippingdata(shipadd_id, uid) {
    $("#user_id").val(uid);
    var uid = uid
    var AddressType = "Shipping";
    var Action = "4";
    var shipadd_id = shipadd_id
    $.ajax({
        type: "POST",
        url: baseurl + "ajaxfiles/save_address.php",
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
                for (i = 0; i < countbill; i++) {
                    var shipping_id = data.address[i].shipping_id;
                    var shipping_first_name = data.address[i].shipping_first_name;
                    var shipping_last_name = data.address[i].shipping_last_name;
                    var shipping_address = data.address[i].shipping_address_1;

                    var shipping_city = data.address[i].shipping_city;

                    var shipping_state = data.address[i].shipping_state;
                    var shipping_pincode = data.address[i].shipping_pincode;
                    var shipping_country = data.address[i].shipping_country;
                    var shipping_phone_no = data.address[i].shipping_phone_no;

                    $("#shippingphone").val(shipping_phone_no);
                    var name = shipping_first_name + " " + shipping_last_name;
                    $("#shippingfirstname").val(shipping_first_name);
                    $("#shippingaddress").val(shipping_address);
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
                    $("#shippingaddressid").val(shipping_id);
                    $("#openshippingbox").click();

                }


            }
        }
    });
}

function saveshipping() {

    $("#shippingsavebtn").hide();
    $("#shiploading").show();
    var uid = $("#user_id").val();
    var fname = $("#shippingfirstname").val();
    var shippingaddress = $("#shippingaddress").val();

    var shippingcountry = $("#shippingcountry1").val();
    var shippingphone = $("#shippingphone").val();
    if (shippingcountry == "INDIA") {
        var shippingpincode = $("#shippingpincode1").val();
    }
    if (shippingcountry != "INDIA") {
        var shippingpincode = "0";
    }
    var shippingstate = $("#shippingstate").val();
    var shippingcity = $("#shippingcity").val();

    if (fname == "") {
        $("#shippingsavebtn").show();
        $("#shiploading").hide();
        $("#shippingfirstname").focus();
        $("#shippingmsg").css("color", "red");
        $("#shippingmsg").html("Enter First Name");
        setTimeout(function() {
            $("#shippingmsg").html('Shipping Address');
            $("#shippingmsg").css("color", "green");
        }, 3000);


    } else if (shippingphone == "") {
        $("#shippingsavebtn").css("pointer-events", "visible");
        $("#shippingphone").focus();
        $("#shippingmsg").css("color", "red");
        $("#shippingmsg").html("Enter Phone Number");
        setTimeout(function() {
            $("#shippingmsg").html('Shipping Address');
            $("#shippingmsg").css("color", "green");
        }, 3000);

    } else if (shippingaddress == "") {
        $("#shippingsavebtn").show();
        $("#shiploading").hide();
        $("#shippingaddress").focus();
        $("#shippingmsg").css("color", "red");
        $("#shippingmsg").html("Enter Address");
        setTimeout(function() {
            $("#shippingmsg").html('Shipping Address');
            $("#shippingmsg").css("color", "green");
        }, 3000);


    } else if (shippingcountry == "") {
        $("#shippingsavebtn").show();
        $("#shiploading").hide();
        $("#shippingcountry").focus();
        $("#shippingmsg").css("color", "red");
        $("#shippingmsg").html("Select Country");
        setTimeout(function() {
            $("#shippingmsg").html('Shipping Address');
            $("#shippingmsg").css("color", "green");
        }, 3000);


    } else if (shippingpincode == "") {
        $("#shippingsavebtn").show();
        $("#shiploading").hide();
        $("#shippingpincode1").focus();
        $("#shippingmsg").css("color", "red");
        $("#shippingmsg").html("Enter Pincode");
        setTimeout(function() {
            $("#shippingmsg").html('Shipping Address');
            $("#shippingmsg").css("color", "green");
        }, 3000);


    } else if (shippingstate == "") {
        $("#shippingsavebtn").show();
        $("#shiploading").hide();
        $("#shippingstate").focus();
        $("#shippingmsg").css("color", "red");
        $("#shippingmsg").html("Enter State ");
        setTimeout(function() {
            $("#shippingmsg").html('Shipping Address');
            $("#shippingmsg").css("color", "green");
        }, 3000);


    } else if (shippingcity == "") {
        $("#shippingsavebtn").show();
        $("#shiploading").hide();
        $("#shippingcity").focus();
        $("#shippingmsg").css("color", "red");
        $("#shippingmsg").html("Enter City ");
        setTimeout(function() {
            $("#shippingmsg").html('Shipping Address');
            $("#shippingmsg").css("color", "green");
        }, 3000);


    } else {
        var shipaddid = $("#shippingaddressid").val();
        var checked_shipaddid = $('input[name="shipping_address_selector"]:checked').val();


        if (shipaddid == "") {
            var Action = "0";
        } else {
            var Action = "2";
        }
        var AddressType = "Shipping";

        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: baseurl + "ajaxfiles/save_address.php",
            data: {
                shipadd_id: shipaddid,
                Action: Action,
                AddressType: AddressType,
                UserID: uid,
                shipping_first_name: fname,
                shipping_address_1: shippingaddress,
                shipping_country: shippingcountry,
                shipping_pincode: shippingpincode,
                shipping_state: shippingstate,
                shipping_city: shippingcity,
                shipping_phone_no: shippingphone,

            },
            success: function(data) {
                if (data.status == "ok") {

                 var countbill = data.address.length;
                   for (i = 0; i < countbill; i++) {
                    var shipping_id = data.address[i].shipping_id;
                    var shipping_first_name = data.address[i].shipping_first_name;
                    var shipping_address = data.address[i].shipping_address_1;
                    var shipping_city = data.address[i].shipping_city;
                    var shipping_state = data.address[i].shipping_state;
                    var shipping_pincode = data.address[i].shipping_pincode;
                    var shipping_country = data.address[i].shipping_country;
                    var shipping_phone_no = data.address[i].shipping_phone_no;
                    var shipping_countrycode = data.address[i].shipping_countrycode;
                    $(".shipping_address_"+shipaddid).html(shipping_first_name+','+shipping_address+','+shipping_state);
                }

                    $("#shipclose").click();
                    $("#shippingsavebtn").show();
                    $("#shiploading").hide();
                    if (shipaddid == checked_shipaddid) {
                        toastr.success("", "Address Updated", {
                            "timeOut": "3000",
                            "positionClass": "toast-top-right",
                            "extendedTImeout": "0"
                        });

                        fetchshipping(shipaddid, uid);
                    } else {
                        toastr.success("", "Address Updated", {
                            "timeOut": "3000",
                            "positionClass": "toast-top-right",
                            "extendedTImeout": "0"
                        });

                    }

                } else {
                    toastr.error("", "Something Went Wrong Try After Some Time", {
                        "timeOut": "3000",
                        "positionClass": "toast-top-right",
                        "extendedTImeout": "0"
                    });

                }
            }
        });

    }
}
