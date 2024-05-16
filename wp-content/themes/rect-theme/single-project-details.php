<?php
// Check if an image ID is provided in the URL
$image_id = isset($_GET['image_id']) ? intval($_GET['image_id']) : 0;

// If no image ID is provided or it's invalid, redirect to the main project page
if (!$image_id || !get_post($image_id)) {
    wp_redirect(home_url('/single-project.php'));
    exit();
}

// Load the WordPress header
get_header();

// Display the details of the selected image
$image = wp_get_attachment_image_src($image_id, 'full');
if ($image) {
    echo '<img src="' . esc_url($image[0]) . '" alt="Project Image">';
} else {
    echo 'Image not found.';
}

// Load the WordPress footer
get_footer();
?>









<!-- <div class="wp-block-group single-project-pic project-slider">
    <div class="carousel">
        <i class="fa fa-arrow-circle-o-left carousel-prev" aria-hidden="true"></i>
        <div class="carousel-track">
             Your carousel slides here 
        </div>
        <i class="fa fa-arrow-circle-o-right carousel-next" aria-hidden="true"></i>
    </div>
</div>

<div class="description-container">
    <div class="wp-block-group group-one-field">
         Your description content here 
    </div>
    <div class="group-two-field">
         Your additional fields here 
    </div>
</div
