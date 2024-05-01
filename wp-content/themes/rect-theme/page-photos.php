<?php
get_header();
?>

<div class="header-img">
    <p class="header-title"><?php the_title(); ?></p>
</div>

<?php
$args = array(
    'post_type'      => 'attachment',
    'post_status'    => 'inherit',
    'posts_per_page' => -1,
    'orderby'        => 'post_parent', // Order by parent post ID to group attachments
    'order'          => 'DESC',         // Sort in descending order
);

$query = new WP_Query($args);

if ($query->have_posts()) : ?>
    <!-- Display filter buttons for each tag -->
    <div class="filter-buttons">
        <?php
        // Get all unique tags associated with media items
        $all_tags = array();
        while ($query->have_posts()) {
            $query->the_post();
            $tags = get_the_tags(get_the_ID()); // Get tags attached to the picture
            if ($tags && !is_wp_error($tags)) {
                foreach ($tags as $tag) {
                    $all_tags[$tag->term_id] = $tag->name;
                }
            }
        }
        wp_reset_postdata();

        // Display tags as filter buttons
        foreach ($all_tags as $tag_id => $tag_name) {
            echo '<button class="filter-button" data-tag="' . esc_attr($tag_name) . '">' . esc_html($tag_name) . '</button>';
        }
        ?>
    </div>

    <!-- Display media items -->
    <div id="primary" class="photo-content-area">
        <main id="main" class="site-main" role="main">
            <?php
            // Reset the query to loop through attachments again
            $query->rewind_posts();

            // Track the parent posts already displayed
            $displayed_parents = array();

            while ($query->have_posts()) :
                $query->the_post();
                $parent_id = get_post_field('post_parent');
                if (!in_array($parent_id, $displayed_parents)) {
                    $displayed_parents[] = $parent_id;
                    $attachments = get_children(array(
                        'post_parent'    => $parent_id,
                        'post_type'      => 'attachment',
                        'numberposts'    => -1,
                        'post_mime_type' => 'image',
                    ));

                    if ($attachments) {
                        echo '<div id="post-' . esc_attr($parent_id) . '" class="entry-content">';
                        echo '<div class="custom-gallery">';
                        foreach ($attachments as $attachment) {
                            $image_url = wp_get_attachment_image_src($attachment->ID, 'full')[0];
                            $image_alt = get_post_meta($attachment->ID, '_wp_attachment_image_alt', true);
                            $tags = get_the_tags($attachment->ID); // Get tags attached to the picture
                            $tag_names = array();
                            if ($tags && !is_wp_error($tags)) {
                                foreach ($tags as $tag) {
                                    $tag_names[] = $tag->name;
                                }
                            }
                                // Construct JSON string for tag names with proper escaping
                                $tag_names_json = '[' . implode(',', array_map('esc_attr', $tag_names)) . ']';
                                echo '<div class="gallery-item" data-tags=\'' . $tag_names_json . '\'>';

                            // echo '<div class="gallery-item" data-tags="' . esc_attr(json_encode($tag_names)) . '">';
                            // Display image
                            echo '<img src="' . esc_url($image_url) . '" alt="' . esc_attr($image_alt) . '">';
                            echo '</div>';
                        }
                        echo '</div>';
                        echo '</div>';
                    } else {
                        echo '<div>No Photos are Found</div>';
                    }
                }
            endwhile;
            ?>
        </main>
    </div>
<?php endif; ?>

<?php
get_footer();
?>
