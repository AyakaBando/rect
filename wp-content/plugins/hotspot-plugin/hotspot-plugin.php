<?php
/*
Plugin Name: Hotspot Plugin
Description: User-friendly hotspot-generating plugin
Version: 1.0.0
Text Domain: Options-plugin
*/

function enqueue_hotspot_scripts()
{
    // Enqueue styles
    wp_enqueue_style('hotspot-style', plugin_dir_url(__FILE__) . 'css/style.css');

    // Enqueue scripts with dependencies on jQuery and WordPress media library
    wp_enqueue_script('hotspot-script', plugin_dir_url(__FILE__) . 'js/hotspot-script.js', array('jquery', 'media-upload', 'thickbox'), null, true);
    wp_enqueue_media();
}
add_action('admin_enqueue_scripts', 'enqueue_hotspot_scripts');


function create_project_post_type()
{
    $labels = array(
        "name" => _x('プロジェクト（仮）', 'Post type general name', "textdomain"),
        "singular_name" => _x('Project', 'Post type singular name', "textdomain"),
    );

    $args = array(
        "labels" => $labels,
        "public" => true,
        "publicly_queryable" => true,
        "show_ui" => true,
        "show_in_menu" => true,
        "query_var" => true,
        "rewrite" => array('slug' => 'projects'),
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
        "hotspot_meta_box", // id
        "ホットスポット", // title
        "render_hotspot_meta_box", // function name
        "project", // post type
        "normal", // where the box should display
        "high" // the priority where the box should show
    );
}

add_action('add_meta_boxes', 'add_hotspot_meta_box');


function render_hotspot_meta_box($post) {
    $hotspots = get_post_meta($post->ID, '_hotspots', true);
    $hotspots_image_url = get_post_meta($post->ID, '_hotspots_image_url', true);
    $hotspots_image_id = get_post_meta($post->ID, '_hotspots_image_id', true);
    $attached_images = get_attached_media('image', $post->ID);
    $initial_x_value = get_post_meta($post->ID, 'hotspot_x', true) ?: 50;
    $initial_y_value = get_post_meta($post->ID, 'hotspot_y', true) ?: 50;

    wp_nonce_field('save_hotspot_data', 'hotspot_meta_box_nonce');
    ?>

    <div id="hotspots-container">
        <label for="hotspots-image-select">プロジェクト写真を選択:</label>
        <select id="hotspots-image-select" name="hotspots_image_id">
            <?php foreach ($attached_images as $image) : 
                $image_id = $image->ID;
                $image_url = wp_get_attachment_image_url($image_id, 'large');
            ?>
                <option value="<?php echo $image_id; ?>" data-image-url="<?php echo esc_attr($image_url); ?>" <?php selected($hotspots_image_id, $image_id); ?>>
                    <?php echo esc_html($image_id); ?>
                </option>
            <?php endforeach; ?>
        </select>

        <div id="hotspot-interface" style="width: 460px; height: 296px;">
            <img id="hotspots-image" src="<?php echo esc_url($hotspots_image_url); ?>" style="width: 100%; height: auto;" />
        </div>
    </div>

    <div id="hotspot-controls-container">
        <div id="hotspot-controls">
            <div id="product-selector">
                <button type="button" id="choose-product-button" class="button">Choose Product</button>
                <div id="chosen-products">
                    <!-- Selected products will be displayed here -->
                </div>
            </div>

            <div id="hotspot-positions">
                <div>
                    <label for="hotspot-x">X Position:</label>
                    <input type="range" id="hotspot-x" class="hotspot-x" name="hotspot_x" min="0" max="100" value="<?php echo $initial_x_value; ?>">
                    <span id="x-range-value" class="range-value"><?php echo $initial_x_value; ?></span>%
                </div>

                <div>
                    <label for="hotspot-y">Y Position:</label>
                    <input type="range" id="hotspot-y" class="hotspot-y" name="hotspot_y" min="0" max="100" value="<?php echo $initial_y_value; ?>">
                    <span id="y-range-value" class="range-value"><?php echo $initial_y_value; ?></span>%
                </div>
                <button type="button" id="add-hotspot" class="button button-primary">Add Hotspot</button>
                <button type="button" id="delete-mode" class="button button-secondary">Toggle Delete Mode</button>
                <button type="button" id="clear-all-data" class="button button-secondary">Clear All Data</button>
                <div id="hotspot-json-display" style="border: 1px solid #ccc; padding: 10px; margin-top: 10px; white-space: pre-wrap;"></div>
                <button id="copy-json-button">Copy to Clipboard</button>
            </div>
        </div>
    </div>

    <button id="create-other-hotspots" class="button">Create Other Hotspots</button>
    <textarea name="hotspots" id="hotspots" rows="5" cols="30" style="display:none;"><?php echo esc_textarea($hotspots); ?></textarea>

    <?php
}



function save_hotspot_data($post_id)
{
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
                    $content .= '<div class="hotspot" style="left:' . esc_attr($hotspot['x_position']) . '%; top:' . esc_attr($hotspot['y_position']) . '%;" data-info="' . esc_attr($hotspot['info']) . '" data-image="' . esc_url($hotspot['product_url']) . '"></div>';
                }
            }

            $content .= '</div>';
        }
    }

    return $content;
}

add_filter('the_content', 'display_hotspots');

?>