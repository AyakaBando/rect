<?php get_header(); ?>

<?php 
    // get the page name
$parent_title = get_the_title($post->post_parent);
 
// display page name
echo $parent_title;
 
?>

<div class="max-auto">
    <?php if (have_posts()) {
        while(have_posts()){
            the_post(); ?>

            <div>
                <p><?php the_title(); ?></p>
                <?php the_content(); ?>
            </div>
    <?php    }
    } ?>
</div>

<?php get_footer();