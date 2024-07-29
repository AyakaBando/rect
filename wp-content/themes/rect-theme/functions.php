<?php

// Enqueue styles and scripts
function rect_files()
{
    error_log('Enqueuing styles and scripts.');
    wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('google-font', 'https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700&display=swap');
    wp_enqueue_style('maincss', get_theme_file_uri('./build/style-index.css'));
    wp_enqueue_style('indexcss', get_theme_file_uri('./build/index.css'));
}
add_action('wp_enqueue_scripts', 'rect_files');

// Theme support features
function rect_features()
{
    error_log('Adding theme support features.');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'rect_features');

// Adjust queries
function rect_adjust_queries($query)
{
    error_log('Adjusting queries.');
    if (!is_admin() && $query->is_main_query()) {
        if (is_post_type_archive('projects') || is_post_type_archive('photos')) {
            $query->set('orderby', 'title');
            $query->set('order', 'ASC');
            $query->set('posts_per_page', -1);
        } elseif (is_post_type_archive('news')) {
            $query->set('orderby', 'date');
            $query->set('order', 'ASC');
        }
    }
}
add_action('pre_get_posts', 'rect_adjust_queries');

// Order taxonomy by description
function taxonomy_orderby_description($orderby, $args)
{
    if ($args['orderby'] == 'description') {
        $orderby = 'tt.description';
    }
    return $orderby;
}
add_filter('get_terms_orderby', 'taxonomy_orderby_description', 10, 2);

// Add categories for attachments
function add_categories_for_attachments()
{
    error_log('Adding categories for attachments.');
    register_taxonomy_for_object_type('category', 'attachment');
    register_taxonomy_for_object_type('post_tag', 'attachment');
}
add_action('init', 'add_categories_for_attachments');

// Enqueue custom scripts
function custom_scripts()
{
    error_log('Enqueuing custom scripts.');
    wp_enqueue_script('custom-script', get_template_directory_uri() . '/src/index.js', array('jquery'), '1.0', true);
    wp_enqueue_script('masonry', 'https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js', null, null, true);
    $image_id = get_query_var('image_id');
    wp_localize_script('custom-script', 'carouselData', array(
        'image_id' => $image_id
    ));
}
add_action('wp_enqueue_scripts', 'custom_scripts');

// Disable wpautop filter for specific post types
function wpautop_filter($content)
{
    error_log('Disabling wpautop filter for specific post types.');
    if (is_singular('project')) {
        remove_filter('the_content', 'wpautop');
        remove_filter('the_excerpt', 'wpautop');
    }
    return $content;
}
add_filter('the_content', 'wpautop_filter', 9);
add_filter('the_excerpt', 'wpautop_filter', 9);

// AJAX callback for product details
function get_product_details_callback()
{
    error_log('AJAX callback for product details.');
    if (isset($_POST['product_id'])) {
        $product_id = intval($_POST['product_id']);
        $product = get_post($product_id);
        if ($product && $product->post_type == 'project') {
            echo '<h2>' . esc_html($product->post_title) . '</h2>';
            echo '<div>' . apply_filters('the_content', $product->post_content) . '</div>';
        }
    }
    wp_die();
}
add_action('wp_ajax_get_product_details', 'get_product_details_callback');
add_action('wp_ajax_nopriv_get_product_details', 'get_product_details_callback');

// Remove border from gallery style
function gallery_border_none($style)
{
    error_log('Removing border from gallery style.');
    return str_replace('border: 2px solid #cfcfcf;', 'border: none;', $style);
}
add_filter('gallery_style', 'gallery_border_none');

// Custom rewrite rules
function custom_rewrite_rules()
{
    error_log('Adding custom rewrite rules.');
    add_rewrite_rule('^projects/([^/]+)/([0-9]+)/?$', 'index.php?project_name=$matches[1]&image_id=$matches[2]', 'top');
}
add_action('init', 'custom_rewrite_rules');

// Add custom query vars
function add_custom_query_vars($vars)
{
    error_log('Adding custom query vars.');
    $vars[] = 'project_name';
    $vars[] = 'image_id';
    return $vars;
}
add_filter('query_vars', 'add_custom_query_vars');

// Load custom template
function load_custom_template($template)
{
    error_log('Loading custom template.');
    if (get_query_var('project_name') && get_query_var('image_id')) {
        return locate_template('single-project-details.php');
    }
    return $template;
}
add_filter('template_include', 'load_custom_template');

// Flush rewrite rules on activation and theme switch
function custom_flush_rewrite_rules()
{
    error_log('Flushing rewrite rules.');
    custom_rewrite_rules();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'custom_flush_rewrite_rules');
add_action('after_switch_theme', 'custom_flush_rewrite_rules');

// Save project hotspots meta
function save_project_hotspots_meta($post_id)
{
    if (array_key_exists('project_images_hotspots', $_POST)) {
        update_post_meta(
            $post_id,
            'project_images_hotspots',
            sanitize_text_field($_POST['project_images_hotspots'])
        );
    }
}
add_action('save_post', 'save_project_hotspots_meta');

// Add meta box for project hotspots
function project_images_hotspots_meta_box()
{
    error_log('Adding meta box for project hotspots.');
    add_meta_box(
        'project_images_hotspots_meta_box',
        'ホットスポット(JSON)',
        'render_project_images_hotspots_meta_box',
        'project',
        'advanced',
        'high'
    );
}
add_action('add_meta_boxes', 'project_images_hotspots_meta_box');

// Render meta box content
function render_project_images_hotspots_meta_box($post)
{
    $value = get_post_meta($post->ID, 'project_images_hotspots', true);
    ?>
    <label for="project_images_hotspots">JSON:</label>
    <textarea id="project_images_hotspots" name="project_images_hotspots" rows="10" cols="50"><?php echo esc_textarea($value); ?></textarea>
    <?php
}

function enqueue_hotspot_plugin_scripts()
{
    error_log('Enqueuing hotspot plugin scripts and styles.');

    // Enqueue the main script and style
    wp_enqueue_script('jquery');
    wp_enqueue_script('hotspot-script', plugins_url('hotspot-plugin/js/hotspot-script.js'), array('jquery'), time(), true); // Using time() to avoid caching
    wp_enqueue_style('hotspot-style', plugins_url('hotspot-plugin/css/style.css'), array(), '1.0', 'all');

    // Add debugging to see if scripts are enqueued correctly
    if (wp_script_is('hotspot-script', 'enqueued')) {
        error_log('hotspot-script is enqueued.');
    } else {
        error_log('hotspot-script is NOT enqueued.');
    }

    // Localize script for AJAX
    wp_localize_script('hotspot-script', 'custom_vars', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('save_hotspot_data_nonce'),
        'post_id' => get_the_ID(),
    ));

    // Add debugging to see if localization is added
    $localized = wp_scripts()->get_data('hotspot-script', 'data');
    if ($localized) {
        error_log('custom_vars is localized: ' . print_r($localized, true));
    } else {
        error_log('custom_vars is NOT localized.');
    }
}
add_action('wp_enqueue_scripts', 'enqueue_hotspot_plugin_scripts');


// Save hotspot data via AJAX
function save_hotspot_data_callback()
{
    error_log('Saving hotspot data via AJAX.');
    check_ajax_referer('save_hotspot_data_nonce', 'nonce');

    if (!current_user_can('edit_posts')) {
        wp_send_json_error('Permission denied');
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $hotspots_json = isset($_POST['hotspots']) ? sanitize_text_field($_POST['hotspots']) : '';

    if (empty($post_id) || empty($hotspots_json)) {
        wp_send_json_error('Invalid data');
    }

    update_post_meta($post_id, 'project_images_hotspots', $hotspots_json);

    // Return the updated JSON data
    wp_send_json_success(json_decode($hotspots_json, true));
}
add_action('wp_ajax_save_hotspot_data', 'save_hotspot_data_callback');
add_action('wp_ajax_nopriv_save_hotspot_data', 'save_hotspot_data_callback');

?>
