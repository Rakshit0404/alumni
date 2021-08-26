var navbar = document.querySelector('#navbar');
const navitems = document.querySelectorAll('.navitems');
const navcontent = document.querySelectorAll('.navcontent');
const toggle = document.querySelector('#toggle');
const shrinkbar = document.querySelector('#shrinkbar');
const body= document.querySelector('body');
// const user=document.querySelector('#user');

window.addEventListener('scroll',()=>{
    if(navbar.getBoundingClientRect().top==body.scrollTop)
    {
        navbar.style.backgroundColor="#C21717";
    }
    else if(navbar.getBoundingClientRect().top>body.scrollTop)
    {
        navbar.style.backgroundColor="rgba(203, 45, 45,0)";
    }
})

window.addEventListener('resize', () => {
    if (window.innerWidth <= 1000) {
        navbar.style.flexDirection = 'column';
        navbar.style.backdropFilter=" blur(20px)";
        for (let navs of navcontent) {
            navs.style.flexDirection = 'column';
        }
        for (let item of navitems) {
            item.style.padding = '13px';
            item.style.display = 'none';
        }
        toggle.style.display = 'initial';
    }
    else{
        navbar.style.flexDirection = 'row';
        navbar.style.backdropFilter="blur(0px)";
        for (let navs of navcontent) {
            navs.style.flexDirection = 'row';
        }
        for (let item of navitems) {
            item.style.padding = '20px';
            item.style.display = 'initial';
        }
        toggle.style.display = 'none';
        for (let item of navitems) {
            item.style.animation= '';
        }
    }
})
window.addEventListener('load', () => {
    if (window.innerWidth <= 1000) {
        navbar.style.flexDirection = 'column';
        navbar.style.backdropFilter=" blur(20px)";
        for (let navs of navcontent) {
            navs.style.flexDirection = 'column';
        }
        for (let item of navitems) {
            item.style.padding = '13px';
            item.style.display = 'none';
        }
        toggle.style.display = 'initial';
    }
    else{
        navbar.style.flexDirection = 'row';
        navbar.style.backdropFilter="blur(0px)";
        for (let navs of navcontent) {
            navs.style.flexDirection = 'row';
        }
        for (let item of navitems) {
            item.style.padding = '20px';
            item.style.display = 'initial';
        }
        toggle.style.display = 'none';
    }
})



toggle.addEventListener('click', () => {
    if (window.innerWidth>1000) {
        for (let item of navitems) {
            if (item.style.display === 'initial') {
                item.style.display = 'none';
            }
            else {
                item.style.display = 'initial';
                item.style.animation= 'phisal 0.8s';
            }
        }
    }
    else{
        for (let item of navitems) {
            if (item.style.display === 'initial') {
                item.style.display = 'none';
            }
            else {
                item.style.display = 'initial';
                item.style.animation= 'phisal 0.8s';
            }
        };
    }
})