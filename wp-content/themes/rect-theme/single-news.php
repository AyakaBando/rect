<?php 
get_header(); 
?>


<div>
    <?php if (have_posts()) {
        while(have_posts()){
            the_post(); ?>

    <div class="single-project-container">
        <div>
            <p><?php the_title(); ?></p>

            
            <p><?php the_content(); ?></p>
        </div>
    </div>
    <?php    }
    } ?>
</div>

<?php
get_footer(); 
?>
