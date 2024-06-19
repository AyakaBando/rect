<?php
/*
Plugin Name: Hotspot Plugin
Description: User-friendly hotspot-generating plugin
Version: 1.0.0
Text Domain: Options-plugin
*/



function create_project_post_type()
{
    $labels = array(
        "name" => _x('Projects', 'Post type general name', "textdomain"),
        "singular_name" => _x('Project', 'Post type singular name', "textdomain"),
    );



    $args = array(
        "labels" => $labels,
        "public" => true,
        "publicly_queryable" => true,
        "show_ui" => true,
        "show_in_menu" => true,
        "query_var" => true,
        "rewrite" => array('slug' => 'project'),
        "capability_type" => "post",
        "has_archive" => true,
        "hierarchical" => false,
        "menu_position" => null,
        "supports" => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-open-folder'
    );

    register_post_type('project', $args);
}

add_action('init', 'create_project_post_type');



function add_hotspot_meta_box()
{
    add_meta_box(
        "hotspot_meta_box",
        "Hotspots",
        "render_hotspot_meta_box",
        "project",
        "normal",
        "high"
    );
}

add_action('add_meta_boxes', 'add_hotspot_meta_box');



function render_hotspot_meta_box($post)
{
    $hotspots = get_post_meta($post->ID, '_hotspots', true);
    $hotspots_image_url = get_post_meta($post->ID, "_hotspots_image_url", true);
    $hotspots_image_id = get_post_meta($post->ID, "_hotspots_image_id", true);
    $gallery_images = array();

    $gallery = get_post_gallery($post, false);

    if ($gallery) {
        $gallery_images = explode(",", $gallery['ids']);
    }

    wp_nonce_field('save_hotspot_data', 'hotspot_meta_box_nonce');

?>

    <div id="hotspots-container">
        <label for="hotspots-image">Select Project Image:</label>
        <select id="hotspots-image-select" name="hotspots_image_id">
            <?php foreach ($gallery_images as $image_id) :
                $image_url = wp_get_attachment_image_url($image_id, 'large');
            ?>

                <option value="<?php echo $image_id; ?>" data-image-url="<?php echo esc_attr($image_url); ?>" <?php selected($hotspots_image_id, $image_id); ?>><?php echo esc_attr($image_url); ?></option>
            <?php endforeach; ?>
        </select>

        <div id="hotspot-interface">
            <img id="hotspots-image" src="<?php echo esc_url($hotspots_image_url); ?>" style="max-width: 100%;" />
        </div>

    </div>

    <div id="product-selector">
        <button type="button" id="choose-product-button" class="button">Choose Product</button>
        <div id="chosen-products">
            <!-- Selected products will be displayed here -->
        </div>
    </div>

    <div id="hotspot-positions">
        <div>
            <label for="hotspot-x">X Position:</label>
            <input type="range" id="hotspot-x" name="hotspot_x" min="0" max="100" value="50">
            <span class="range-value">50</span>%

        </div>

        <div>
            <label for="hotspot-y">Y Position:</label>
            <input type="range" id="hotspot-y" name="hotspot_y" min="0" max="100">
            <span class="range-value">50</span>%
        </div>
        <button type="button" id="add-hotspot" class="button button-primary">Add Hotspot</button>
    </div>
    <button id="create-other-hotspots">Create Other Hotspots</button>
    <textarea name="hotspots" id="hotspots" rows="5" cols="30" style="display:none;"><?php echo esc_textarea($hotspots); ?></textarea>

<?php

}



function enqueue_hotspots_scripts()
{
    wp_enqueue_style('hotspot-style', plugin_dir_url(__FILE__) . "css/style.css");
    wp_enqueue_script('hotspot-script', plugin_dir_url(__FILE__) . 'js/hotspot-script.js', array('jquery'), null, true);
    wp_enqueue_media();
}

add_action("admin_enqueue_scripts", "enqueue_hotspots_scripts");



function save_hotspot_data($post_id)
{
    if (array_key_exists("hotspots", $_POST)) {
        update_post_meta($post_id, '_hotspots', $_POST['hotspots']);
    }
    if (!isset($_POST['hotspot_meta_box_nonce']) || !wp_verify_nonce($_POST['hotspot_meta_box_nonce'], 'save_hotspot_data')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['hotspots_image_id'])) {
        update_post_meta($post_id, '_hotspots_image_id', sanitize_text_field($_POST['hotspots_image_id']));
    }

    if (isset($_POST['hotspots_image_url'])) {
        update_post_meta($post_id, '_hotspots_image_url', esc_url_raw($_POST['hotspots_image_url']));
    }

    if (isset($_POST['hotspots'])) {
        update_post_meta($post_id, '_hotspots', sanitize_textarea_field($_POST['hotspots']));
    }
}

add_action('save_post', 'save_hotspot_data');



function display_hotspots($content)
{

    if (is_singular('project')) {
        $post_id = get_the_ID();
        $hotspots = get_post_meta($post_id, '_hotspots', true);
        $hotspots_image_url = get_post_meta($post_id, '_hotspots_image_url', true);

        if (!empty($hotspots_image_url)) {
            $content .= "<div id='hotspot-display'>";
            $content .= '<img src="' . esc_url($hotspots_image_url) . '" id="hotspot-image-display">';



            if (!empty($hotspots)) {
                $hotspot_data = json_decode($hotspots, true);
                foreach ($hotspot_data as $hotspot) {
                    $content .= '<div class="hotspot" style="left:' . esc_attr($hotspot['x']) . '%; top:' . esc_attr($hotspot['y']) . '%;" data-info="' . esc_attr($hotspot['info']) . '" data-image="' . esc_url($hotspot['image']) . '"></div>';
                }
            }

            $content .= '</div>';
        }
    }

    return $content;
}

add_filter('the_content', 'display_hotspots');

?>