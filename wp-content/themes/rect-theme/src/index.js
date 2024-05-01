
// Photos Filter by Tags
    jQuery(document).ready(function($) {
        // Filter images based on selected tag
        $('.filter-button').on('click', function() {
            const selectedTag = $(this).data('tag');
            if (selectedTag === 'all') {
                $('.gallery-item').show(); // Show all images if 'All' tag is selected
            } else {
                $('.gallery-item').hide(); // Hide all images initially
                $('.gallery-item').each(function() {
                    const tags = $(this).data('tags');
                    if (tags.indexOf(selectedTag) !== -1) {
                        $(this).show(); // Show images with selected tag
                    }
                });
            }
        });
    });
    
    // Photos Slider @single-project page
// $document.ready(() => {
//     $(".slick").slick({
//         infinite: true,
//         dots: false,
//     })
// })
    