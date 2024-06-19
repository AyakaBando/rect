<?php
get_header();

if (have_posts()) : 
    while (have_posts()) : 
        the_post(); 

        // Get the project name (slug)
        $project_name = sanitize_title(get_the_title());
        print_r($project_name);

        // Display all attached images
        $images = get_attached_media('image', get_the_ID());
        if ($images) {
            echo '<div class="project-custom-gallery">';
            foreach ($images as $image) {
                $image_id = $image->ID;
                // Link each image to the single project page with the appropriate image ID
                echo '<div class="project-gallery-item">';
                echo '<a href="' . esc_url(home_url("/projects/$project_name/$image_id")) . '">';
                echo wp_get_attachment_image($image_id, 'large');
                echo '</a>';
                echo '</div>';
            }
            echo '</div>';
        } else {
            echo '写真が見つかりません。    ';
        }

        // Display the post content (optional)
        echo '<div class="content">';
        the_content();
        echo '</div>';

    endwhile;
else :
    echo 'この投稿は見れません。';
endif;

get_footer();
?>
