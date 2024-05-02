
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
    document.addEventListener("DOMContentLoaded", function() {
        const carouselTrack = document.querySelector('.carousel-track');
        const slides = Array.from(document.querySelectorAll('.carousel-slide'));
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;
    
        function goToSlide(index) {
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            currentIndex = index;
        }
    
        function nextSlide() {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        }
    
        function prevSlide() {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        }
    
        const nextButton = document.querySelector('.carousel-next');
        const prevButton = document.querySelector('.carousel-prev');
    
        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
    
        // Show the first slide initially
        goToSlide(0);
    });

// Projects grid layout change
document.addEventListener("DOMContentLoaded", function() {
    const threeColumnIcon = document.querySelector('.three-column');
    const twoColumnIcon = document.querySelector('.two-column');
    const projectsContainer = document.querySelector('.projects-container');
    const projectImage = document.querySelectorAll('.wp-post-image');

    threeColumnIcon.addEventListener('click', function() {
        projectsContainer.classList.remove('grid-two-column');
        projectsContainer.classList.add('grid-three-column');
        projectImage.forEach(image => {
            image.style.width = "30rem";
            image.style.gap = "2rem";
        });
    });

    twoColumnIcon.addEventListener('click', function() {
        projectsContainer.classList.remove('grid-three-column');
        projectsContainer.classList.add('grid-two-column');
        projectImage.forEach(image => {
            image.style.width = "45rem";
        });
    })
})