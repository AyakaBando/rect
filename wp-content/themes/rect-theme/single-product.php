<?php
// Template Name: Single Product Template
get_header();

$product_image = get_field('product_image')
?>

<div class="product-image">
    <img src="<?php echo esc_url($product_image['url']); ?>" alt="<?php echo esc_attr($product_image['alt']); ?>">
    <div class="product-buttons">
        <button class="product-button" data-product-id="1"></button>
        <button class="product-button" data-product-id="2"></button>
    </div>
</div>

<script>
    jQuery(document).ready(function($) {
        $('.product-button').click(function() {
            let productId = $(this).data('product-id');

            fetchProductDetails(productId);
        });
    });

    function fetchProductDetails(productId) {
        $.ajax({
            url: '<?php echo admin_url('admin-ajax.php'); ?>',
            type: 'POST',
            data: {
                action: 'get_product_details',
                product_id: productId
            },
            success: function(response) {
                $('#product-details').html(response);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        })
    }
</script>

<div id="product-details"></div>
<?php
get_footer();
?>