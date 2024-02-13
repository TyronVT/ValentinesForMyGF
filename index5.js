const gallery = document.getElementById('gallery');
const sentences = document.querySelectorAll('.sentence-container');
const pinkBackground = document.getElementById('pink-background');

const milisecondsPerSentence = 3000;
const totalLength = sentences.length * milisecondsPerSentence;
const CHORUS_TIME = 72*1000 // THIS IS THE CHORUS TIME + ANIMATION OF MOVING PINK BACKGROUND;

const startBtn = document.getElementById('heart-path');

document.addEventListener('DOMContentLoaded', function () {
    startBtn.addEventListener("click", () => {
        startBtn.setAttribute("style", "transform: scale(100)");
        var song = document.getElementById('audio');
        song.currentTime = (CHORUS_TIME - totalLength) / 1000;
        song.play();
        document.getElementById('button-div').setAttribute("style", "opacity: 0");
        showSentences();
        //document.getElementById('actual-content').setAttribute("style", "content-visibility: visible");
    });
})

function showSentences() {
    // Calculate total amount of seconds based on sentences
    document.getElementById('button-div').remove();
    sentences.forEach((sentence, index) => {
        setTimeout(() => {
            if (index > 0) {
                sentences[index - 1].classList.remove('show');
                sentences[index - 1].classList.add('hide');
            }
            sentence.classList.add('show');

            if (index === sentences.length - 1) {
                pinkBackground.classList.add('animate');
            }
        }, index * milisecondsPerSentence);
    });
    
    setTimeout(() => {
        createGallery();
        gallery.setAttribute("style", "z-index: 3");
    }, totalLength);
}

const imagesFolder = './images/';

fetchImages(imagesFolder)
    .then(images => {
        images.forEach(image => {
            const box = createImageBox(image);
            gallery.appendChild(box);
        });
    })
    .catch(error => console.error('Error loading images:', error));

function fetchImages(folder) {
    return new Promise((resolve, reject) => {
        fetch(folder)
            .then(response => response.text())
            .then(text => {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(text, 'text/html');
                const imageElements = htmlDoc.querySelectorAll('a[href$=".jpg"], a[href$=".png"], a[href$=".jpeg"]');
                const imagePaths = Array.from(imageElements).map(element => element.href);
                resolve(imagePaths);
            })
            .catch(reject);
    });
}

function createImageBox(imageSrc) {
    const box = document.createElement('div');
    box.classList.add('box');

    const image = document.createElement('img');
    image.src = imageSrc;
    image.alt = 'Image';
    box.appendChild(image);

    return box;
}

function createGallery () {
    let boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
        box.addEventListener("mousemove", (e) => {
            let halfWidth = box.clientWidth / 2,
                halfHeight = box.clientHeight / 2,
                mouseX = halfWidth + box.offsetLeft - e.pageX,
                mouseY = halfHeight + box.offsetTop - e.pageY,
                maxDeg = 10,
                image = box.querySelector("img");

            let degX = (mouseY / halfHeight) * -maxDeg + "deg";
            let degY = (mouseX / halfWidth) * maxDeg + "deg";
            box.setAttribute(
                "style",
                `transform: perspective(512px) rotateX(${degX}) rotateY(${degY});`
            );

            image.setAttribute(
                "style",
                `object-position: ${
                    (box.offsetLeft + box.clientWidth - e.pageX) / -8 + 20
                }px ${(box.offsetTop + box.clientHeight - e.pageY) / -8 + 20}px`
            );
        });

        box.addEventListener("mouseout", () => {
            box.removeAttribute("style");
            box.querySelector("img").removeAttribute("style");
        });
    });
}
