<?php
function register_project_post_type()
{
    register_post_type(
        'project',
        array(
            'capability_type' => 'post',
            'map_meta_cap' => true,
            'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'),
            'rewrite' => array('slug' => 'projects'),
            'has_archive' => true,
            'public' => true,
            'show_in_rest' => true,
            'hierarchical' => true,
            'labels' => array(
                'name' => 'プロジェクト',
                'add_new_item' => 'プロジェクトの追加',
                'edit_item' => 'プロジェクトの編集',
                'all_items' => 'すべてのプロジェクト',
                'singular_name' => 'Project'
            ),
            'menu_icon' => 'dashicons-portfolio'
        )
    );

    register_taxonomy(
        'project-tag',
        'project',
        array(
            'label' => 'タグ',
            'rewrite' => array('slug' => 'projects'),
            'hierarchical' => true,
        )
    );
};

function register_news_post_type()
{
    register_post_type(
        'news',
        array(
            'capability_type' => 'post',
            'map_meta_cap' => true,
            'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'),
            'rewrite' => array('slug' => 'news'),
            'has_archive' => true,
            'public' => true,
            'show_in_rest' => true,
            'labels' => array(
                'name' => 'ニュース',
                'add_new_item' => 'ニュースの追加',
                'edit_item' => 'ニュースの編集',
                'all_items' => 'すべてのニュース',
                'singular_name' => 'News'
            ),
            'menu_icon' => 'dashicons-admin-site-alt3'
        )
    );

    register_taxonomy(
        'news-tag',
        'news',
        array(
            'label' => 'タグ',
            'rewrite' => array('slug' => 'news-rewrite'),
            'hierarchical' => true,
        )
    );
};

function register_photo_post_type()
{
    register_post_type(
        'photo',
        array(
            'capability_type' => 'post',
            'map_meta_cap' => true,
            'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'),
            'rewrite' => array('slug' => 'photo'),
            'has_archive' => true,
            'public' => true,
            'show_in_rest' => true,
            'labels' => array(
                'name' => '写真',
                'add_new_item' => '写真の追加',
                'edit_item' => '写真の編集',
                'all_items' => 'すべての写真',
                'singular_name' => 'Photo'
            ),
            'menu_icon' => 'dashicons-format-gallery'
        )
    );

    register_taxonomy(
        'photo_category',
        'photo',
        array(
            'label' => 'Photo Categories',
            'rewrite' => array('slug' => 'photo-category'),
            'hierarchical' => true,
        )
    );
};

function register_product_post_type()
{
    register_post_type(
        'product',
        array(
            'capability_type' => 'post',
            'map_meta_cap' => true,
            'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'),
            'rewrite' => array('slug' => 'products'),
            'has_archive' => true,
            'public' => true,
            'show_in_rest' => true,
            'labels' => array(
                'name' => '商品',
                'add_new_item' => '商品の追加',
                'edit_item' => '商品の編集',
                'all_items' => 'すべての商品',
                'singular_name' => 'Product'
            ),
            'menu_icon' => 'dashicons-products'
        )
    );

    register_taxonomy(
        'product_category',
        'product',
        array(
            'label' => 'Product Categories',
            'rewrite' => array('slug' => 'product-category'),
            'hierarchical' => true,
        )
    );
};



add_action('init', 'register_project_post_type');
add_action('init', 'register_news_post_type');
add_action('init', 'register_photo_post_type');
add_action('init', 'register_product_post_type');
