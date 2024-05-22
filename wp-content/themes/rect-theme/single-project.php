<?php get_header(); ?>

<div class="single-project-details">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <?php
            // Check if an image ID is provided in the URL
            $image_id = isset($_GET['image_id']) ? intval($_GET['image_id']) : 0;

            // Display main project content if no specific image is selected
            if (!$image_id) :
            ?>
                <h2 class="project-title"><?php the_title(); ?></h2>
                <div class="project-details-content">
                    <div class="project-images custom-project-gallery">
                        <?php
                        // Get attached images
                        $images = get_attached_media('image', get_the_ID());
                        // Loop through images
                        foreach ($images as $image) {
                            // Get the image URL with the custom query parameter
                            $image_url = add_query_arg('image_id', $image->ID, get_permalink());
                        ?>
                            <div class="gallery-item">
                                <a href="<?php echo esc_url($image_url); ?>">
                                    <?php echo wp_get_attachment_image($image->ID, 'large'); ?>
                                </a>
                            </div>
                        <?php } ?>
                    </div>
                    <div class="project-description">
                        <?php the_content(); ?>
                    </div>
                </div>
            <?php else : ?>
                <div class="wp-block-group single-project-pic project-slider">
                    <button class="expand-arrow">
                        <img src="http://rect.local/wp-content/uploads/2024/05/arrow-expand.png" alt="">
            </button>
                    <div class="carousel">
                        <div class="carousel-track">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=".5" stroke="#707070" class="w-4 h-4 carousel-prev" width="50">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            <div class="single-carousel-image">
                                <?php
                                // Output the clicked image first
                                echo '<div class="carousel-slide active">';
                                echo wp_get_attachment_image($image_id, 'large');
                                echo '</div>';

                                // Load the rest of the images into the carousel
                                $images = get_attached_media('image', get_the_ID());
                                foreach ($images as $image) {
                                    // Skip the clicked image
                                    if ($image->ID === $image_id) {
                                        continue;
                                    }
                                    echo '<div class="carousel-slide">';
                                    echo wp_get_attachment_image($image->ID, 'large');
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
                </div>

                <!-- Hotspot Functionality -->
                <div class="single-project-images">
                    <?php
                    $images_hotspots = get_post_meta(get_the_ID(), 'project_images_hotspots', true);

                    // Debug: Check if meta key exists and its content
                    if (empty($images_hotspots)) {
                        echo 'No hotspots found for this project.';
                    }
                    $images_hotspots = json_decode($images_hotspots, true);

                    if ($images_hotspots) :
                        foreach ($images_hotspots as $data) :
                            $image_id = $data['image'];
                            $hotspots = $data['hotspots'];
                            $image_src = wp_get_attachment_image_src($image_id, 'large')[0];

                            if ($image_src) :
                    ?>

                                <div class="image-hotspots-container">
                                    <?php if ($hotspots) : ?>
                                        <?php foreach ($hotspots as $hotspot) :
                                            $product_id = $hotspot['product'];
                                            $x_position = $hotspot['x_position'];
                                            $y_position = $hotspot['y_position'];
                                            if ($product_id) : ?>

                                                <div class="hotspot" data-product-id="<?php echo esc_attr($product_id); ?>" style="left: <?php echo esc_attr($x_position); ?>%; top: <?php echo esc_attr($y_position); ?>%;">
                                                    <div class="dot"></div>
                                                </div>
                                                <div class="product-info <?php echo $is_active ? 'active' : ''; ?>">
                                                    <?php echo wp_get_attachment_image(get_post_thumbnail_id($product_id), 'thumbnail'); ?>
                                                    <div class="product-description">
                                                        <h2><?php echo get_the_title($product_id); ?></h2>
                                                        <?php
                                                        // Get the attachment ID of the product
                                                        $attachment_id = get_post_thumbnail_id($product_id);

                                                        // Get the attachment description
                                                        $description = get_post_field('post_content', $attachment_id);
                                                        $description_plain_text = strip_tags($description);

                                                        // Check if the description exists and is not empty
                                                        if ($description) {
                                                            echo '<pre>' . esc_html($description_plain_text) . '</pre>';
                                                        }
                                                        ?>
                                                    </div>
                                                </div>
                                            <?php endif; ?>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </div>
                    <?php
                            endif;
                        endforeach;
                    endif;
                    ?>
                </div>
                <!-- End Hotspot Functionality -->

            <?php endif; ?>
    <?php endwhile;
    endif; ?>
</div>

<?php get_footer(); ?>