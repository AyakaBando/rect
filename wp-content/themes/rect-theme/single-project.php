<?php get_header(); ?>

<div class="single-project-details">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
        <?php
        // Check if an image ID is provided in the URL
        $image_id = isset($_GET['image_id']) ? intval($_GET['image_id']) : 0;

        // Display main project content if no specific image is selected
        if (!$image_id) :
        ?>
            <h2 class="project-title"><?php the_title(); ?></h2>
            <div class="project-details-content">
                <div class="project-images custom-project-gallery">
                    <?php
                    // Get attached images
                    $images = get_attached_media('image', get_the_ID());
                    // Loop through images
                    foreach ($images as $image) {
                        // Get the image URL with the custom query parameter
                        $image_url = add_query_arg('image_id', $image->ID, get_permalink());
                    ?>
                        <div class="gallery-item">
                            <a href="<?php echo esc_url($image_url); ?>">
                                <?php echo wp_get_attachment_image($image->ID, 'large'); ?>
                            </a>
                        </div>
                    <?php } ?>
                </div>
                <div class="project-description">
                    <?php the_content(); ?>
                </div>
            </div>
        <?php else :
            ?>
            <div class="wp-block-group single-project-pic project-slider">
            <div class="carousel">   
                <div class="carousel-track">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=".5" stroke="#707070" class="w-4 h-4 carousel-prev" width="50">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    <div class="single-carousel-image">

                        <?php
                    $images = get_attached_media('image', get_the_ID());
                    foreach ($images as $index => $image) {
                        $image_url = add_query_arg('image_id', $image->ID, get_permalink());
                    ?>
                        <div class="carousel-slide php echo $index === 0 ? 'active' : ''; ?>">
                                <?php echo wp_get_attachment_image($image->ID, 'large'); ?>
                        </div>
                    <?php } ?>
                    ?>

                    
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=".5" stroke="#707070" class="w-4 h-4 carousel-next" width="50">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>

                <div class="content">
                    <?php the_content();?>
                </div>
            </div>
            <?php
        endif;
        ?>

    <?php endwhile;
    endif; ?>
</div>

<?php get_footer(); ?>


<!-- php get_header(); ?>

<div class="single-project-details">
    php if (have_posts()) : while (have_posts()) : the_post(); ?>
            php
            // Check if an image ID is provided in the URL
            $image_id = isset($_GET['image_id']) ? intval($_GET['image_id']) : 0;

            // Display main project content if no specific image is selected
            if (!$image_id) :
            ?>
                <h2 class="project-title">php the_title(); ?></h2>
                <div class="project-details-content">
                    <div class="project-images custom-project-gallery">
                        php
                        // Get attached images
                        $images = get_attached_media('image', get_the_ID());
                        // Loop through images
                        foreach ($images as $image) {
                            // Get the image URL with the custom query parameter
                            $image_url = add_query_arg('image_id', $image->ID, get_permalink());
                        ?>
                            <div class="gallery-item">
                                <a href="php echo esc_url($image_url); ?>">
                                    php echo wp_get_attachment_image($image->ID, 'large'); ?>
                                </a>
                            </div>
                        php } ?>
                    </div>
                    <div class="project-description">
                        php the_content(); ?>
                    </div>
                </div>
            php else :
            ?>
                <div class="wp-block-group single-project-pic project-slider">
                    <div class="carousel">
                        <div class="carousel-track">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=".5" stroke="#707070" class="w-4 h-4 carousel-prev" width="50">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>

                            php
                            $images = get_attached_media('image', get_the_ID());
                            foreach ($images as $index => $image) {
                                $image_url = add_query_arg('image_id', $image->ID, get_permalink());
                            ?>
                                <div class="carousel-slide php echo $index === 0 ? 'active' : ''; ?>">
                                        php echo wp_get_attachment_image($image->ID, 'large'); ?>
                                </div>
                            php } ?>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=".5" stroke="#707070" class="w-4 h-4 carousel-next" width="50">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </div>

                        <div class="content">
                            php the_content(); ?>
                        </div>
                    </div>
                </div>
            php
            endif;
            ?>

    php endwhile;
    endif; ?>
</div>

php get_footer(); ?> -->


<!-- <div>
    php if (have_posts()) {
        while(have_posts()){
            the_post(); 

            <div class="custom-project-gallery">
                php
                // Get attached images
                $images = get_attached_media('image', get_the_ID());
                // Loop through images
                foreach ($images as $image) :
                ?>
                    <div class="gallery-item">
                        <a href="php echo esc_url(wp_get_attachment_url($image->ID)); ?>" target="_blank" rel="noopener">
                            php echo wp_get_attachment_image($image->ID, 'large'); ?>
                        </a>
                    </div>
                php endforeach; ?>
            </div>

    php }
    } ?>
</div> -->

<!-- php get_header(); ?>

<div class="single-project-details">
    php if (have_posts()) : while (have_posts()) : the_post(); ?>
        <h2 class="project-title">php the_title(); ?></h2>
        <div class="project-details-content">
            <div class="project-images custom-project-gallery">
                php
                // Get attached images
                $images = get_attached_media('image', get_the_ID());
                // Loop through images
                foreach ($images as $image) :
                ?>
                    <div class="gallery-item">
                        <a href="php echo esc_url(wp_get_attachment_url($image->ID)); ?>" target="_blank" rel="noopener">
                            php echo wp_get_attachment_image($image->ID, 'large'); ?>
                        </a>
                    </div>
            php endforeach; ?>
            </div>
            <div class="project-description">
                php the_content(); ?>
            </div>
        </div>
    php endwhile; endif; ?>
</div>

php get_footer(); ?> -->