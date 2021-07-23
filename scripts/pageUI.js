featureContentBox = document.querySelector(".featurepage-content");
backgroundVideo = document.querySelector("#bg-video2");

featureContentBox.addEventListener("scroll", onScroll);

function onScroll(e) {
    let scrollY = e.target.scrollTop;
    let translateY = scrollY === 0 ? 0 : Math.log(scrollY) * 5;
    // console.log(scrollY === 0 ? 0 : Math.log(scrollY).toFixed(1));
    backgroundVideo.style.top = `-${translateY}px`;
}
