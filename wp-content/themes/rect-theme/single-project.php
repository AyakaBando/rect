<?php get_header(); ?>

<div class="single-project-details">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <div class="wp-block-group single-project-pic project-slider">
                    <img src="http://rect.local/wp-content/uploads/2024/05/arrow-expand.png" alt="" class="expand-arrow">

                <div class="carousel">
                    <div class="carousel-track">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=".5" stroke="#707070" class="w-4 h-4 carousel-prev" width="50">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        <div class="single-carousel-image">
                            <?php
                            $images = get_attached_media('image', get_the_ID());
                            $images_hotspots = get_post_meta(get_the_ID(), 'project_images_hotspots', true);
                            $images_hotspots = json_decode($images_hotspots, true);

                            foreach ($images as $image) {
                                $image_id = $image->ID;
                                echo '<div class="carousel-slide" data-image-id="' . $image_id . '">';
                                echo wp_get_attachment_image($image_id, 'large');

                                // Add hotspot container
                                if ($images_hotspots) {
                                    foreach ($images_hotspots as $data) {
                                        if ($data['image'] == $image_id) {
                                            $hotspots = $data['hotspots'];
                                            echo '<div class="image-hotspots-container" data-image-id="' . $image_id . '" data-hotspots=\'' . json_encode($hotspots) . '\'></div>';
                                            break;
                                        }
                                    }
                                }

                                echo '</div>';
                            }
                            ?>

                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=".5" stroke="#707070" class="w-4 h-4 carousel-next" width="50">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>



                    </div>
                    <div class="content">
                        <?php the_content(); ?>
                    </div>
                </div>

                <!-- Product Information -->
                <div class="single-project-images">
                    <?php
                    $images_hotspots = get_post_meta(get_the_ID(), 'project_images_hotspots', true);
                    $images_hotspots = json_decode($images_hotspots, true);

                    if ($images_hotspots) :
                        foreach ($images_hotspots as $data) :
                            $image_id = $data['image'];
                            $hotspots = $data['hotspots'];
                    ?>
                            <div class="product-container" data-image-id="<?php echo esc_attr($image_id); ?>">
                                <?php foreach ($hotspots as $hotspot) :
                                    $product_id = $hotspot['product'];
                                    if ($product_id) : ?>
                                        <div class="product-info">
                                            <?php
                                            // Get product information
                                            // $product_thumbnail = wp_get_attachment_image_src(get_post_thumbnail_id($product_id), 'thumbnail');
                                            $product_thumbnail = wp_get_attachment_image_src(get_post_thumbnail_id($product_id), "medium");
                                            $product_description = get_post_field('post_content', get_post_thumbnail_id($product_id));
                                            ?>
                                            <img src="<?php echo esc_attr($product_thumbnail[0]); ?>" alt="<?php echo esc_attr(get_the_title($product_id)); ?>">
                                            <div class="product-description">
                                                <h2><?php echo esc_html(get_the_title($product_id)); ?></h2>
                                                <?php if (!empty($product_description)) : ?>
                                                    <pre><?php echo esc_html(strip_tags($product_description)); ?></pre>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    <?php endif; ?>
                                <?php endforeach; ?>
                            </div>
                </div>
        <?php
                        endforeach;
                    endif;
        ?>

            </div>

</div>
<?php endwhile;
    endif; ?>
</div>

<?php get_footer(); ?>