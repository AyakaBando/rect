<?php 
function rect_files() {
    wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('google-font', 'https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
    wp_enqueue_style('maincss', get_theme_file_uri('./build/style-index.css'));
    wp_enqueue_style('indexcss', get_theme_file_uri('./build/index.css'));

};

add_action('wp_enqueue_scripts', 'rect_files');


function rect_features(){
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
}

add_action('after_setup_theme', 'rect_features');

function rect_adjust_queries($query){
    if(!is_admin() && is_post_type_archive('projects') && $query->is_main_query()){
        $query->set('orderby', 'title');
        $query->set('order', 'ASC');
        $query->set('posts_per_page', -1);
    }
    elseif (!is_admin() && is_post_type_archive('photos') && $query->is_main_query()) {
        $query->set('orderby', 'title');
        $query->set('order', 'ASC');
        $query->set('posts_per_page', -1);
    }
    elseif (!is_admin() && is_post_type_archive('news') && $query->is_main_query()) {
        $query->set('orderby', 'date');
        $query->set('order', 'ASC');
    }
}

add_action('pre_get_posts', 'rect_adjust_queries');

// tags are ordered by description
function taxonomy_orderby_description( $orderby, $args ) {

    if ( $args['orderby'] == 'description' ) {
        $orderby = 'tt.description';
    }
    return $orderby;
}

add_filter( 'get_terms_orderby', 'taxonomy_orderby_description', 10, 2 );

// Add categories and tags on media
function add_categories_for_attachments(){
    register_taxonomy_for_object_type('category', 'attachment');
    register_taxonomy_for_object_type('post_tag', 'attachment');
}

add_action('init', 'add_categories_for_attachments');


// Add meta-box to custom post type
function custom_post_type_meta_boxes() {
    add_meta_box(
        'group_one_meta_box',
        'Group One',
        'group_one_meta_box_callback',
        'project',
        'normal',
        'high'
    );

    add_meta_box(
        'group_two_meta_box',
        'Group Two',
        'group_one_meta_box_callback',
        'project',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'custom_post_type_meta_boxes');

// Meta box callback function
function group_one_meta_box_callback($post) {
    // Retrieve the value of the 'group_one_field' meta field
    $group_one_field_value = get_post_meta($post->ID, 'group_one_field', true);
    ?>
    <label for="group_one_field"><?php esc_html_e( 'グループ名:', 'text-domain' ); ?></label>
    <input type="text" id="group_one_field" name="group_one_field" value="<?php echo esc_attr($group_one_field_value); ?>">
    <?php
}

// Save meta box data
function save_custom_post_type_meta_boxes($post_id) {
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

function custom_scripts() {
    // Enqueue your custom script
    wp_enqueue_script( 'custom-script', get_template_directory_uri() . '/src/index.js', array( 'jquery' ), '1.0', true );

    // Pass data to your script (optional)
    wp_localize_script( 'custom-script', 'custom_vars', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
    ));
}
add_action( 'wp_enqueue_scripts', 'custom_scripts' );
