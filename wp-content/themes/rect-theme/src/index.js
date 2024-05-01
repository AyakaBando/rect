// import Masonry from './modules/Masonry';
import Glide from "@glidejs/glide";

// const masonry = new Masonry();


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
    function ProjectSlider() {
        if (document.querySelector(".project-slider")) {
            const dotCount = document.querySelectorAll(".project-slider__slide").length;
    
            let dotHTML = "";
            for (let i = 0; i < dotCount; i++) {
                dotHTML += `<button class="slider__bullet glide__bullet" data-glide-dir="=${i}"></button>`;
            }
    
            document.querySelector(".glide__bullets").insertAdjacentHTML("beforeend", dotHTML);
    
            const glide = new Glide(".project-slider", {
                type: "carousel",
                perView: 1,
                autoplay: 3000
            });
    
            glide.mount();
        }
    }
    