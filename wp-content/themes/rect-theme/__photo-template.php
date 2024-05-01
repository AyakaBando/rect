<?php
/*
Template Name: 写真ギャラリー
Template Post Type: project
*/
?>

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
            $tags = wp_get_object_terms(get_the_ID(), 'post_tag');
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
            while ($query->have_posts()) :
                $query->the_post();
                ?>
                <div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <div class="entry-content">
                        <?php
                        // Display multiple images attached to the post
                        $attachments = get_children(array(
                            'post_parent'    => get_the_ID(),
                            'post_type'      => 'attachment',
                            'numberposts'    => -1,
                            'post_mime_type' => 'image',
                        ));

                        if ($attachments) {
                            echo '<div class="custom-gallery">';
                            foreach ($attachments as $attachment) {
                                $image_url = wp_get_attachment_image_src($attachment->ID, 'full')[0];
                                $image_alt = get_post_meta($attachment->ID, '_wp_attachment_image_alt', true);
                                echo '<div class="gallery-item">';
                                // Display image
                                echo '<img src="' . esc_url($image_url) . '" alt="' . esc_attr($image_alt) . '">';
                                echo '</div>';
                            }
                            echo '</div>';
                        }
                        else {
                            echo '<div>No Photos are Found</div>'
                        };
                        ?>
                    </div>
                </div>
            <?php endwhile; ?>
        </main>
    </div>
<?php endif; ?>

<?php
get_footer();
?>
