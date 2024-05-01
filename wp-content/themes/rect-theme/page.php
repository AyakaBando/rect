<?php

/*
* Template Name: Project template
* Template Post Type: post
*/

get_header();

while (have_posts()){
    the_post();
}
?>

<?php
$theParent = wp_get_post_parent_id(get_the_ID());

if($theParent) ?>

<div>
    <h2>
        <?php the_title();?>
    </h2>
</div>

<?php
$testArray = get_pages(
    array(
        'child_of' => get_the_ID()
    )
    );

    if($theParent or $testArray) { ?>

<div>
    <h2>
        <a href="<?php echo get_permalink($theParent) ?>">
            <?php echo get_the_title($theParent) ?>
        </a>
    </h2>

    <ul>
        <?php
        if($theParent) {
            $findChildrenOf = $theParent;
        } else {
            $findChildrenOf = get_the_ID();
        }

        wp_list_pages(
            array(
                'title_li' => NULL,
                'child_of' => $findChildrenOf,
                'sort_column' => 'menu_order'
            )
        );
        ?>
    </ul>
</div>

<?php    } ?>

<div>
    <?php the_content(); ?>
</div>


<?php
get_footer();
?>