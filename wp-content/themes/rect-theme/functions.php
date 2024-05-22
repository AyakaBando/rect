<?php
function rect_files()
{
    wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('google-font', 'https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
    wp_enqueue_style('maincss', get_theme_file_uri('./build/style-index.css'));
    wp_enqueue_style('indexcss', get_theme_file_uri('./build/index.css'));
};

add_action('wp_enqueue_scripts', 'rect_files');


function rect_features()
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
}

add_action('after_setup_theme', 'rect_features');

function rect_adjust_queries($query)
{
    if (!is_admin() && is_post_type_archive('projects') && $query->is_main_query()) {
        $query->set('orderby', 'title');
        $query->set('order', 'ASC');
        $query->set('posts_per_page', -1);
    } elseif (!is_admin() && is_post_type_archive('photos') && $query->is_main_query()) {
        $query->set('orderby', 'title');
        $query->set('order', 'ASC');
        $query->set('posts_per_page', -1);
    } elseif (!is_admin() && is_post_type_archive('news') && $query->is_main_query()) {
        $query->set('orderby', 'date');
        $query->set('order', 'ASC');
    }
}

add_action('pre_get_posts', 'rect_adjust_queries');

// tags are ordered by description
function taxonomy_orderby_description($orderby, $args)
{

    if ($args['orderby'] == 'description') {
        $orderby = 'tt.description';
    }
    return $orderby;
}

add_filter('get_terms_orderby', 'taxonomy_orderby_description', 10, 2);

// Add categories and tags on media
function add_categories_for_attachments()
{
    register_taxonomy_for_object_type('category', 'attachment');
    register_taxonomy_for_object_type('post_tag', 'attachment');
}

add_action('init', 'add_categories_for_attachments');


// Save meta box data
function save_custom_post_type_meta_boxes($post_id)
{
    // Verify nonce
    if (!isset($_POST['custom_post_type_meta_box_nonce']) || !wp_verify_nonce($_POST['custom_post_type_meta_box_nonce'], 'custom_post_type_meta_box')) {
        return;
    }

    // Check autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Check user capabilities
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // Save meta box data
    if (isset($_POST['group_one_field'])) {
        update_post_meta($post_id, 'group_one_field', sanitize_text_field($_POST['group_one_field']));
    }

    if (isset($_POST['designer'])) {
        update_post_meta($post_id, 'group_two_field', sanitize_text_field($_POST['group_two_field']));
    }
}
add_action('save_post', 'save_custom_post_type_meta_boxes');

function custom_scripts()
{
    // Enqueue your custom script
    wp_enqueue_script('custom-script', get_template_directory_uri() . '/src/index.js', array('jquery'), '1.0', true);

    // Pass data to your script (optional)
    wp_localize_script('custom-script', 'custom_vars', array(
        'ajax_url' => admin_url('admin-ajax.php'),
    ));
}
add_action('wp_enqueue_scripts', 'custom_scripts');

// remove WP's automatic added html tags
function wpautop_filter($content)
{
    if (is_singular('project')) {
        remove_filter('the_content', 'wpautop');
        remove_filter('the_excerpt', 'wpautop');
    }
    return $content;
}
add_filter('the_content', 'wpautop_filter', 9); // Hook into the_content filter with priority 9
add_filter('the_excerpt', 'wpautop_filter', 9); // Hook into the_excerpt filter with priority 9



// Add AJAX action for fetching product details
add_action('wp_ajax_get_product_details', 'get_product_details_callback');
add_action('wp_ajax_nopriv_get_product_details', 'get_product_details_callback');

function get_product_details_callback()
{
    if (isset($_POST['product_id'])) {
        $product_id = intval($_POST['product_id']);
        $product = get_post($product_id);
        if ($product && $product->post_type == 'project') {
            echo '<h2>' . esc_html($product->post_title) . '</h2>';
            echo '<div>' . apply_filters('the_content', $product->post_content) . '</div>';
        };
    };
};

// Delete border on the gallery
add_filter('gallery_style', 'gallery_border_none');
function gallery_border_none($style)
{
    return str_replace('border: 2px solid #cfcfcf;', 'border: none;', $style);
}

// Code for themes
add_action('after_switch_theme', 'flush_rewrite_rules');

function custom_rewrite_rule()
{
    add_rewrite_rule('^project-details/([^/]*)/?', 'index.php?pagename=single-project-details&image_id=$matches[1]', 'top');
}
add_action('init', 'custom_rewrite_rule');

// Flush rewrite rules on plugin/theme activation
function custom_flush_rewrite_rules()
{
    custom_rewrite_rule(); // Add the rewrite rules
    flush_rewrite_rules(); // Flush the rules once
}
register_activation_hook(__FILE__, 'custom_flush_rewrite_rules');


// Save JSON data
function save_project_hotspots_meta($post_id) {
    if (array_key_exists('project_images_hotspots', $_POST)) {
        update_post_meta(
            $post_id,
            'project_images_hotspots',
            sanitize_text_field($_POST['project_images_hotspots'])
        );
    }
}
add_action('save_post', 'save_project_hotspots_meta');

// Add JSON data meta box
function project_images_hotspots_meta_box() {
    add_meta_box(
        'project_images_hotspots_meta_box',
        'Project Images Hotspots',
        'render_project_images_hotspots_meta_box',
        'project',
        'advanced',
        'high'
    );
}
add_action('add_meta_boxes', 'project_images_hotspots_meta_box');

function render_project_images_hotspots_meta_box($post) {
    $value = get_post_meta($post->ID, 'project_images_hotspots', true);
    ?>
    <label for="project_images_hotspots">Hotspots JSON:</label>
    <textarea id="project_images_hotspots" name="project_images_hotspots" rows="10" cols="50"><?php echo esc_textarea($value); ?></textarea>
    <?php
}

// Enqueue scripts and styles in admin
function project_images_hotspots_admin_scripts($hook_suffix) {
    global $post_type;
    if ($post_type === 'project') {
        wp_enqueue_media();
        wp_enqueue_script('project-images-hotspots', get_template_directory_uri() . '/src/project-images-hotspots.js', array('jquery'), null, true);
    }
}
add_action('admin_enqueue_scripts', 'project_images_hotspots_admin_scripts');