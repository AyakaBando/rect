<div class="main-pic">
    <!-- <img src="" alt="rect_logo"> -->
    <p class="logo-over-main-pic">
        <a href="<?php echo site_url(); ?>"><img src="http://rect.local/wp-content/uploads/2024/05/rect.gif"></a>
    </p>
    <div class="main-container">
        <div class="main-pic__content" style="background-image: url(<?php echo get_theme_file_uri('/images/top-temp.png') ?>);">
            <!-- NEWS -->
            <div class="news-container">
                <div class="news">NEWS</div>
                <div class="news-title">
                    <?php
                    $paged = get_query_var('paged') ? get_query_var('paged') : 1;
                    $args = array(
                        'post_type' => 'news',
                        'post_status' => 'publish',
                        'posts_per_page' => 3,
                        'paged' => $paged,
                    );
                    $arr_posts = new WP_Query($args);
                    ?>


                    <?php if ($arr_posts->have_posts()) :
                        while ($arr_posts->have_posts()) : $arr_posts->the_post();
                    ?>

                            <a href="<?php the_permalink(); ?>">
                                <?php the_time('Y.m.d'); ?>

                                <?php the_title();
                                ?>
                            </a>
                    <?php endwhile;
                    endif;
                    ?>
                </div>
            </div>
        </div>
    </div>

    <?php
    get_header();
    ?>


    <div id="first">
        <div class="first-title">素を生かす。</div>

        <div class="first-content">
            施工事例を見ていただければわかるように、デザインが全く違うのが特徴になっております。
            建築業界の中には自身のつくりたいものをお施主様に勧めてくる方もいるように思います。
            弊社はまずお施主様がどんなおうちに住みたいのかを徹底的に共有し、その理想に近づけ
            るようご提案をしていきます。そのため完成した建物は一つ一つ全く違うものになるのです。
            あなたと合わさることで動き出す、そんな会社です。
        </div>
    </div>

    <!-- Projects -->
    <h6 class="title">Projects</h6>

    <div class="projects-container">
        <?php
        $args = [
            'post_type' => 'project',
            'posts_per_page' => 4,
            'orderby' => 'DESC',
        ];
        $my_query = new WP_Query($args);

        if ($my_query->have_posts()) :
            while ($my_query->have_posts()) : $my_query->the_post(); ?>
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
            <?php endwhile;
        else : ?>
            <p>投稿がありません。</p>
        <?php endif;
        wp_reset_postdata(); ?>

        <div class="view-all">
            <a href="./projects/">
                View All Projects
            </a>
        </div>
    </div>



    <!-- PRODUCTS -->
    <h6 class="title">Products</h6>
    <div class="products-container">
        <?php
        $args = [
            'post_type' => 'product',
            'posts_per_page' => 4,
            'orderby' => 'DESC',
        ];
        $my_query = new WP_Query($args);

        if ($my_query->have_posts()) :
            while ($my_query->have_posts()) : $my_query->the_post(); ?>
                <div class="products">
                    <div class="product_thumbnail">
                        <?php if (has_post_thumbnail()) : ?>
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium'); ?>
                        </a>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endwhile;
        else : ?>
            <p>投稿がありません。</p>
        <?php endif;
        wp_reset_postdata(); ?>


    </div>
    <div class="view-all-products">
        <a href="./products/">
            View All Products
        </a>
    </div>

    <!-- ABOUTUS -->
    <h6 class="title">About Us</h6>
    <div class="aboutus-container">
        <div class="person1">
            <div class="history"></div>
            <div class="portrait"></div>
        </div>
        <div class="person2">
            <div class="history"></div>
            <div class="portrait"></div>
        </div>
    </div>



    <!-- Footer -->
    <?php
    get_footer();
    ?>