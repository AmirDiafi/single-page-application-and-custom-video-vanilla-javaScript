
window.addEventListener('load', () => {
    let container = document.querySelector('.container')
    let homeBtn= document.querySelector('.home')
    let profileBtn= document.querySelector('.profile')

    function getHome(videos) {
        let length = videos.length
        let HTMLContent = ''
        container.innerHTML = ""
        if (length != 0) {
            let html;
            videos.forEach(video => {
                html =  `
                <div class="post">
                    <div class="vid">
                        <span class="mute-unmute-icon">
                            <img src='media/images/unmute.png'>
                        </span>
                        <span class="times"></span>
                        <video loop>
                            <source src="media/videos/${video.video}" type="video/mp4">
                            Your browser does not support video element.
                        </video>
                        <span class="play-pause-icon">
                            <img src='media/images/play.png'>
                        </span>
                        <span class="next increase-dicrease">
                            <img src='media/images/fast-forward.png'>
                        </span>
                        <span class="prev increase-dicrease">
                            <img src='media/images/fast-back.png'>
                        </span>
                    </div>
                    <div class="info">
                        <img src="media/images/${video.picture}" alt="">
                        <span class='username'>${video.username}</span> 
                        <span class='videoname' title='${video.videoname}'> * ${video.videoname}</span>
                        <div class='eval'>
                            <span class="counter">${video.likes}</span>
                            <span class="heart">&#10084;</span>
                        </div>
                    </div>
                </div>
                `
                HTMLContent += html
            })
        } else  {
            HTMLContent =  `
                <div class='not-found'>
                    <h2>Sorry.. there is nothing found</h2>
                    <p>Try somthing else</p>
                    <img src="media/images/not-found.png" >
                </div>
            `
        }
        container.innerHTML = HTMLContent
        
        custom()
    }

    function custom() {
        let posts = document.querySelectorAll('.post')
        let btnPlayPause = document.querySelectorAll('.play-pause-icon')
        let btnMuteUnmute = document.querySelectorAll('.mute-unmute-icon')
        let next = document.querySelectorAll('.next.increase-dicrease')
        let prev = document.querySelectorAll('.prev.increase-dicrease')
        let likers = document.querySelectorAll('.heart')
        let times = document.querySelectorAll('.times')
        let videosnameTrim = document.querySelectorAll('.videoname')

        for (const post of posts) {
            post.addEventListener('click', () => {
                window.scrollTo(0, post.offsetTop - 100)
            })
            window.addEventListener('scroll', () => {
                if (window.scrollY > (post.offsetTop + post.offsetHeight - 250) || window.scrollY <= (post.offsetTop - post.offsetHeight - 50)) {
                    let video = post.childNodes[1].childNodes[5]
                    if (video.played) {
                        video.pause()
                        let playBtn = video.nextElementSibling
                        playBtn.firstElementChild.src = `media/images/play.png`
                    }
                }
            })
        }

        for (const videoTrim of videosnameTrim) {
            if (videoTrim.textContent.length > 20) {
                videoTrim.textContent = videoTrim.textContent.slice(0, 20) + "..."
            }
        }

        for (const time of times) {
            let theVideo = time.nextElementSibling
            theVideo.ontimeupdate = function() {
                time.style.display = 'block'
                time.previousElementSibling.style.display = 'block'
                let minutes = Math.floor((theVideo.duration - theVideo.currentTime) / 60)
                let seconds =  Math.floor((theVideo.duration - theVideo.currentTime) % 60)
                let finalMinutes = (minutes < 10)? "0" + minutes :  minutes 
                let finalSeconds = (seconds < 10)? "0" + seconds :  seconds
                time.innerHTML = finalMinutes + ":" + finalSeconds
            }
        }

        for (const button of btnPlayPause) {
            button.addEventListener('click', function() {
                let theVideo = button.previousElementSibling
                if (theVideo.paused) {
                    theVideo.play()
                    button.firstElementChild.src = `media/images/pause.png`
                } else {
                    theVideo.pause()
                    button.firstElementChild.src = `media/images/play.png`
                }
            })
        }

        for (const button of btnMuteUnmute) {
            let theSpan = button.nextElementSibling
            let theVideo = theSpan.nextElementSibling
            button.addEventListener('click', function() {
                if (theVideo.muted) {
                    theVideo.muted = false
                    button.firstElementChild.src = `media/images/unmute.png`
                } else {
                    theVideo.muted = true
                    button.firstElementChild.src = `media/images/mute.png`
                }
            })
        }

        for (const move of next) {
            let theSpan = move.previousElementSibling
            let theVideo = theSpan.previousElementSibling
            move.addEventListener('dblclick', function() {
                if (theVideo.currentTime + 10 < theVideo.duration) {
                    setTimeout(()=>this.style.transform = "scale(1)", 200)
                    this.style.transform = "scale(1.5)"
                    theVideo.currentTime = theVideo.currentTime + 10
                }
            })
        }

        for (const move of prev) {
            let theSpan = move.previousElementSibling
            let theSpan2 = theSpan.previousElementSibling
            let theVideo = theSpan2.previousElementSibling
            move.addEventListener('dblclick', function() {
                theVideo.currentTime = theVideo.currentTime - 10
                setTimeout(()=>this.style.transform = "scale(1)", 200)
                move.style.transform = "scale(1.5)"
            })
        }

        for (const liker of likers) {
            liker.addEventListener('click', function() {
                this.classList.toggle('liked')
                if(this.classList.contains('liked')) {
                    this.style.color = "red"
                    let counter = this.previousElementSibling
                    counter.textContent++
                } else {
                    this.style.color = "rgb(248, 96, 8)"
                    let counter = this.previousElementSibling
                    counter.textContent--
                }
            
            })
        }
    }

    let getVideos = async (hashNow) => {
        try {
            let hash = (hashNow)?(hashNow == 'videos')
            ?hashNow+".json":hashNow+".html"
            :"videos.json";
            let URL = window.location.origin+'/'+hash
            let data = await fetch(URL)
            if (data.ok == true && data.status == 200) {
                if (hash == "profile.html") {
                    let dataHTML = await data.text()
                    container.innerHTML = ''
                    container.innerHTML = dataHTML
                } else if (hash == "videos.json") {
                    let dataJSON = await data.json()
                    getHome(dataJSON)
                }
            } else {
                container.innerHTML = 
                `<h2 class='error'> 404 ERROR PAGE NOT FOUND!</h2>`
            }
        } catch (error) {
            console.error(error)
            container.innerHTML =
            `<div class='error'>
                <h2> 404 ERROR!</h2>
                <p>there is an expected error!</p>
            </div>
            `
        }
    }

    if(window.location.hash == '' || !window.location.hash) {
        window.location.hash = 'videos'
    }
    
    getVideos(window.location.hash.substring(1))

    window.addEventListener('hashchange', function () {
        getVideos(window.location.hash.substring(1))
    })

    homeBtn.addEventListener('click', function () {
        window.location.hash = this.getAttribute('href')
        getVideos(window.location.hash.substring(1))
    })

    profileBtn.addEventListener('click', function () {
        window.location.hash = this.getAttribute('href')
        getVideos(window.location.hash.substring(1))
    })

    let input = document.querySelector('.search')
    let getFilter = document.querySelector('.search-btn')
    input.addEventListener('input', function (e) {
        e.preventDefault()
        if (this.value != "") {
            getFilter.removeAttribute("disabled")
        } else {
            getFilter.setAttribute("disabled", true)
        }
    })
    let filter = async () => {
        try {
            let serachInput = document.querySelector('.search').value
            let URL = `http://127.0.0.1:5500/videos.json`
            let data = await fetch(URL)
            if (data.ok == true && data.status == 200) {
                let videos = await data.json()
                let result = videos.filter(video => video.videoname == serachInput || video.username == serachInput)
                getHome(result)
            } else {
                container.innerHTML = `<h2 class='error'> 404 ERROR PAGE NOT FOUND!</h2>`
            }
        } catch (error) {
            console.error(error)
            container.innerHTML =
            `<div class='error'>
                <h2> 404 ERROR!</h2>
                <p>there is an expected error!</p>
            </div>
            `
        }
    }

    getFilter.addEventListener('click', () => {
        window.location.hash = "videos"
        filter()
    })

})

