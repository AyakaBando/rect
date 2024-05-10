<footer>
    <div class="footer-container">
        <div class="footer-container__company">

            <div class="footer-container__name">
                <p><a href="/">レクト設計室</a></p>
                <p>TEL: 03-6300-6551</p>
            </div>
            
            <div class="footer-container__company">〒151-0073 東京都渋谷区笹塚1-52-6　チバビル3F</div>
        </div>

        <div class="footer-container__access">
            <div class="contact"><a href="/contact">&rarr; CONTACT</a></div>
            <div class="access"><a href="/access">&rarr; ACCESS</a></div>
        </div>

        <div class="footer-container_sns">
        <i class="fa fa-instagram" aria-hidden="true"><a href=""></a></i>
        </div>

        <div class="footer-container_privacy">
            <div><a href="/privacy-policy/">Privacy Policy</a></div>
            <div>&copy;2024 rect architects All Rights Reserved.</div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
<script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
<script>
    // mouseover event
// Define the mouseOver function
// function mouseOver() {
//     let singleCarouselImage = document.querySelector('.single-carousel-image');

//     if (singleCarouselImage) {
//         singleCarouselImage.addEventListener("mouseover", function() {
//             singleCarouselImage.classList.add("dot");
//             let dot = document.querySelector('.dot');

//             if (dot) {
//                 dot.style.display = 'block';
//                 dot.style.width = "200px";
//                 dot.style.height = "200px";
//                 dot.style.backgroundColor = "red";
//                 dot.style.borderRadius = "50%";
//                 dot.style.zIndex = "1000";
//             }

//             console.log('successfully entered picture');
//         });
//     }
// }

// // Define the mouseLeave function
// function mouseLeave() {
//     let singleCarouselImage = document.querySelector('.single-carousel-image');
//     if (singleCarouselImage) {
//         singleCarouselImage.addEventListener("mouseleave", function() {
//             let dot = document.querySelector('.dot');
//             if (dot) {
//                 dot.style.display = 'none'; 
//             }
//             singleCarouselImage.classList.remove('dot');
//         });
//     }
// }

// mouseOver();
// mouseLeave();

// Carousel
document.addEventListener("DOMContentLoaded", function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');

    let slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange slides next to each other
    slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    });

    // Function to move slides
    const moveToSlide = (currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('active');
        targetSlide.classList.add('active');
    };

    // Move to the next slide
    nextButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.active');
        const nextSlide = currentSlide.nextElementSibling;
        moveToSlide(currentSlide, nextSlide);
    });

    // Move to the previous slide
    prevButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.active');
        const prevSlide = currentSlide.previousElementSibling;
        moveToSlide(currentSlide, prevSlide);
    });
});

</script>
</body>
</html>