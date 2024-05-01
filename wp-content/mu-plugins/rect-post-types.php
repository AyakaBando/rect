<?php
function register_project_post_type() {
    register_post_type('project',
        array(
            'capability_type' => 'post',
            'map_meta_cap' => true,
            'supports' => array('title', 'editor', 'excerpt', 'thumbnail','custom-fields'),
            'rewrite' => array('slug' => 'projects'),
            'has_archive' => true,
            'public' => true,
            'show_in_rest' => true,
            'labels' => array(
                'name' => 'Projects',
                'add_new_item' => 'Add New Project',
                'edit_item' => 'Edit Project',
                'all_items' => 'All Projects',
                'singular_name' => 'Project'
            ),
            'menu_icon' => 'dashicons-portfolio'
        )
    );

    register_taxonomy(
        'project-tag',
        'project',
        array(
            'label' => 'Tag',
            'rewrite' => array('slug' => 'example'),
            'hierarchical' => true,
        )
        );
};

function register_news_post_type() {
    register_post_type('news',
        array(
            'capability_type' => 'post',
            'map_meta_cap' => true,
            'supports' => array('title', 'editor', 'excerpt', 'thumbnail','custom-fields'),
            'rewrite' => array('slug' => 'news'),
            'has_archive' => true,
            'public' => true,
            'show_in_rest' => true,
            'labels' => array(
                'name' => 'News',
                'add_new_item' => 'Add New News',
                'edit_item' => 'Edit News',
                'all_items' => 'All News',
                'singular_name' => 'News'
            ),
            'menu_icon' => 'dashicons-admin-site-alt3'
        )
    );

    register_taxonomy(
        'news-tag',
        'news',
        array(
            'label' => 'Tag',
            'rewrite' => array('slug' => 'example'),
            'hierarchical' => true,
        )
        );
};

// function register_photo_post_type() {
//     $labels = array(
        
//             'name' => 'Photos',
//             'add_new_item' => 'Add New Photo',
//             'edit_item' => 'Edit Photo',
//             'new_item'=>'New Photo',
//             'all_items' => 'All Photo',
//             'singular_name' => 'Photo',
//             'search_items' => 'Search Photos',
//             'menu_name' => 'Photos',
//         );

//     $args = array(
//             'labels' => $labels,
//             'capability_type' => 'post',
//         'map_meta_cap' => true,
//         'supports' => array('title', 'editor', 'excerpt', 'thumbnail','custom-fields'),
//         'rewrite' => array('slug' => 'photo'),
//         'has_archive' => true,
//         'public' => true,
//         'show_in_rest' => true,

//             'menu_icon' => 'dashicons-format-gallery'
//         );

//         register_post_type('photo', $args);

// };

add_action('init', 'register_project_post_type');
add_action('init', 'register_news_post_type');
// add_action('init', 'register_photo_post_type');

?>
