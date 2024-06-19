<?php
get_header();

$project_name = get_query_var('project_name');
$image_id = get_query_var('image_id');

if (!$project_name || !$image_id) {
    echo '<p>Project name or image ID not set.</p>';
    get_footer();
    exit;
}

// Debugging
error_log('Project Name: ' . $project_name);
error_log('Image ID: ' . $image_id);

// Custom query to get the project post by its slug
$args = array(
    'name' => $project_name,
    'post_type' => 'project', // Adjust this to your custom post type
    'posts_per_page' => 1
);
$custom_query = new WP_Query($args);

if ($custom_query->have_posts()) :
    while ($custom_query->have_posts()) : 
        $custom_query->the_post();
?>

<div class="single-project-details">
    <div class="wp-block-group single-project-pic project-slider">
        <img src="<?php echo esc_url(home_url('/wp-content/uploads/2024/05/arrow-expand.png')); ?>" alt="" class="expand-arrow">

        <div class="carousel" data-initial-image-id="<?php echo esc_attr($image_id); ?>">
            <div class="carousel-track">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=".5" stroke="#707070" class="w-4 h-4 carousel-prev" width="50">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <div class="single-carousel-image">
                    <?php
                    $images = get_attached_media('image', get_the_ID());
                    $images_hotspots = get_post_meta(get_the_ID(), 'project_images_hotspots', true);
                    $images_hotspots = json_decode($images_hotspots, true);

                    if ($images) {
                        foreach ($images as $image) {
                            $img_id = $image->ID; // Use a different variable to avoid conflict
                            echo '<div class="carousel-slide" data-image-id="' . $img_id . '">';
                            echo wp_get_attachment_image($img_id, 'large');

                            // Add hotspot container
                            if ($images_hotspots) {
                                foreach ($images_hotspots as $data) {
                                    if ($data['image'] == $img_id) {
                                        $hotspots = $data['hotspots'];
                                        echo '<div class="image-hotspots-container" data-image-id="' . $img_id . '" data-hotspots=\'' . json_encode($hotspots) . '\'></div>';
                                        break;
                                    }
                                }
                            }

                            echo '</div>';
                        }
                    } else {
                        echo '<p>No images found for this project.</p>';
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
            if ($images_hotspots) {
                foreach ($images_hotspots as $data) {
                    $img_id = $data['image'];
                    $hotspots = $data['hotspots'];
            ?>
                    <div class="product-container" data-image-id="<?php echo esc_attr($img_id); ?>">
                        <?php foreach ($hotspots as $hotspot) {
                            $product_id = $hotspot['product'];
                            if ($product_id) { ?>
                                <div class="product-info">
                                    <?php
                                    // Get product information
                                    $product_thumbnail = wp_get_attachment_image_src(get_post_thumbnail_id($product_id), "medium");
                                    $product_description = get_post_field('post_content', $product_id);
                                    ?>
                                    <img src="<?php echo esc_attr($product_thumbnail[0]); ?>" alt="<?php echo esc_attr(get_the_title($product_id)); ?>">
                                    <div class="product-description">
                                        <h2><?php echo esc_html(get_the_title($product_id)); ?></h2>
                                        <?php if (!empty($product_description)) { ?>
                                            <pre><?php echo esc_html(strip_tags($product_description)); ?></pre>
                                        <?php } ?>
                                    </div>
                                </div>
                            <?php } ?>
                        <?php } ?>
                    </div>
            <?php
                }
            } else {
                echo '<p>No hotspots found for this project.</p>';
            }
            ?>
        </div>
    </div>
</div>

<?php 
    endwhile; 
else :
    echo '<p>No project found with the specified name.</p>';
endif; 

wp_reset_postdata(); // Reset the query
?>

<?php get_footer(); ?>
