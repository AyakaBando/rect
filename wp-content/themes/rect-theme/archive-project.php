<?php
get_header(); 
?>

<div class="header-img">
    <h1 class="header-title"><?php post_type_archive_title(); ?></h1>
</div>

<div class="filter-container">


<form method="get" class="project-filter-form">
    <div class="grid-change">
        <i class="fa fa-th three-column" aria-hidden="true"></i>
        <i class="fa fa-th-large two-column" aria-hidden="true"></i>
    </div>
    
    <div class="project-filter">


        <?php
        $tags = get_terms(array(
            'taxonomy' => 'project-tag',
            'hide_empty' => false,
            'orderby' => 'description',
        ));

        if ($tags) :
            foreach ($tags as $tag) :
        ?>
                <label class="project-filter-label">
                <input type="checkbox" name="tags[]" value="<?php echo esc_attr($tag->slug); ?>" <?php if(isset($_GET['tags']) && in_array($tag->slug, $_GET['tags'])) echo 'checked'; ?>>
                    <?php echo esc_html($tag->name); ?>
                </label>
        <?php
            endforeach;
        endif;
        ?>
            </div>
        <button type="submit" class="search-btn">検索</button>
    </form>

<div class="projects-container">
    

    <?php  
    // Initialize the tax query array
$tax_query = array('relation' => 'AND');

// Check if tags are selected
if (isset($_GET['tags']) && !empty($_GET['tags'])) {
    foreach ($_GET['tags'] as $selected_tag) {
        // Append each selected tag to the tax query
        $tax_query[] = array(
            'taxonomy' => 'project-tag',
            'field' => 'slug',
            'terms' => $selected_tag,
        );
    }
}

// Query posts based on the constructed tax query
$args = array(
    'post_type' => 'project',
    'posts_per_page' => -1,
    'orderby' => 'DESC',
    'tax_query' => $tax_query, // Include the constructed tax query
);

$my_query = new WP_Query($args);


    if ($my_query->have_posts()) :
        while ($my_query->have_posts()) : $my_query->the_post();
    ?>
            <div class="projects">
                <div class="post_thumbnail">
                    <p class="post-title">
                        <?php the_title(); ?>
                    </p>
                    <?php if (has_post_thumbnail()) : ?>
                        <a href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail('full'); ?>
                        </a>
                    <?php endif; ?>
                </div>
            </div>

    <?php
        endwhile;
    else :
        // Display message if no projects found
        ?>
        <p>プロジェクトはまだありません。</p>
    <?php
    endif;

    wp_reset_postdata();
    ?>

</div>
</div>

<?php
get_footer();
?>
