
function product_design(product) {
    if (!product) return '';

    return `

     <div class="grid__item grid-product small--one-half medium-up--one-quarter grid-product__has-quick-shop" data-aos="row-of-4" data-product-handle="${product.product_seo_url}" data-product-id="${product._id}" id="${product._id}">
		<div class="grid-product__content">

				<div class="grid-product__tag grid-product__tag--custom" style="margin: 5px 0 5px 5px;padding: 2px; font-size: 10px;line-height: initial;">
					Sold Out
				</div>

			<div class="grid-product__tag grid-product__tag--custom" style="right: 0px;background: #fff;border-radius: 100%; padding: 5px;text-align: center;line-height: 0px; height: 30px;width: 30px; vertical-align: middle;">
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css?display=swap">

					<a href="javascript:void(0);" onClick="wishlist(<?php echo $fetch_data['product_id']; ?>)" class="tt-btn-wishlist iconheart" style="top:35px;" id="id<?php echo $product_id ?>">
								<i class='fa fa-heart-o' style='font-size:17px;color:#dc1f26 !important;'></i>
					</a>


				<style>
					@media only screen and (max-width: 768px) {
                        .mobilecart {
                            display: block !important;
                        }
                    }
				</style>

<a href="javascript:void(0)" onclick="addtocart(<?php echo $product_id; ?>,'add')"  class="mobilecart" style="display: none;
    position: absolute;
    top: 38px;
    left: 0px;
    background-color: white;
    border-radius: 100%;
    padding: 5px 6px 5px 3px;
    text-align: center;
    line-height: 0px;
    height: 30px;
    width: 30px;
    vertical-align: middle;
">

<i class="fa fa-shopping-cart" style="font-size:20px;color: #ef1616;top: 10px;"></i>
</a>
			</div>
			<a href="http://localhost:4000/product/${product.product_seo_url}" class="grid-product__link">
				<div class="grid-product__image-mask">

					<div class="quick-product__btn quick-product__btn--not-ready js-modal-open-quick-modal-${product._id} small--hide">
						<span class="quick-product__label">View Product</span>
					</div>

					<div class="image-wrap" style="height: 0; padding-bottom: 133.42696629213484%;">
						<!-- <img src="${product.product_image}>" alt="Image"> -->
						<img class="grid-product__image lazyload" alt="Image" src="${product.product_image}" data-src="" data-widths="[360, 540, 720, 900, 1080]" data-aspectratio="0.7494736842105263" data-sizes="auto" style="font-family: Corbel;">
						<noscript>
							<img class="grid-product__image lazyloaded" alt="Image" src="${product.product_image}" data-src="" onerror="this.src='${product.product_image}'">
						</noscript>
					</div>
				</div>
			</a>
			<div class="grid-product__meta">
				<h2 class="custom_title grid-product__title--body" style="font-family: Corbel;color:black;">
                        ${product.product_name}
				</h2>
				<div class="grid-product__price">
					<span class="money bacurr-money" style="font-weight:bold;">
                    ${product.product_sale_price}
                    </span>
						<input type="hidden"  class="quantity_${product._id}" value="1">


				</div>
			</div>

		</div>
	</div>
    `;
}
module.exports = {
    // handlebars,
    product_design
}