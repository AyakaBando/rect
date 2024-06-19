<?php

get_header();
?>

<div class="product-container">
<?php
// Query posts based on the constructed tax query
$args = array(
    'post_type' => 'product',
    'posts_per_page' => -1,
    'orderby' => 'DESC',
);

$my_query = new WP_Query($args);


    if ($my_query->have_posts()) :
        while ($my_query->have_posts()) : $my_query->the_post();
    ?>
            <div class="products">
                <div class="product_post_thumbnail">
                    <p class="product_post_title">
                        <?php the_title(); ?>
                    </p>
                    <?php if (has_post_thumbnail()) : ?>
                        <a href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail('large'); ?>
                        </a>
                    <?php endif; ?>
                </div>
            </div>

    <?php
        endwhile;
    else :
        ?>
        <p>商品はまだ登録されていません。</p>
    <?php
    endif;

    wp_reset_postdata();
    ?>

</div>
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