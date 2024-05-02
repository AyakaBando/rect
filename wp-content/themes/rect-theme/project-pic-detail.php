<?php get_header(); ?>

<div>
    <?php if (have_posts()) {
        while(have_posts()){
            the_post(); ?>

    <div class="single-project-container">
        <?php the_content(); ?>
    </div>

    <?php    }
    } ?>
</div>

<?php get_footer(); ?>
