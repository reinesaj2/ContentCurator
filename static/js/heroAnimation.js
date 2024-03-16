document.addEventListener('DOMContentLoaded', (event) => {
  const svgObject = document.getElementById('animatedSVG');
  svgObject.addEventListener('load', function() {
    // Access the SVG DOM
    const svgDoc = svgObject.contentDocument;
    const shapes = svgDoc.querySelectorAll('.wave-path'); // Assuming your paths have the class "wave-path"

    // Create a timeline for the wave motion using GSAP
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    // Assuming you have multiple wave paths to morph between
    for (let i = 0; i < shapes.length - 1; i++) {
      tl.to(shapes[i], {
        duration: 1.5,
        morphSVG: shapes[i + 1],
        ease: "power1.inOut",
      }, "-=1.25"); // Overlap the animations for a smoother transition
    }

    // Add the last to first morph to complete the loop
    tl.to(shapes[shapes.length - 1], {
      duration: 1.5,
      morphSVG: shapes[0],
      ease: "power1.inOut",
    }, "-=1.25");
  });
});
