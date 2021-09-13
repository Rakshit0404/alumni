const signup=document.querySelector('#signup');
const formbody=document.querySelector('.formbody');
const background=document.querySelector('.background');
const back=document.querySelector('#back');
const section1=document.querySelector('#section1');
const section2=document.querySelector('#section2');
const leftsection=document.querySelector('#leftsection');
const loginform=document.querySelector('.loginform');
const backl=document.querySelector('#backl');
const login=document.querySelector('#login');


signup.addEventListener("click",function(){

    formbody.classList.remove('selected');
    background.classList.add('selected');
});

back.addEventListener("click" ,function(){
    formbody.classList.add('selected');
    background.classList.remove('selected');

});

login.addEventListener("click",function(){
    loginform.classList.remove('selected');
    background.classList.add('selected');
})

backl.addEventListener("click" ,function(){
    loginform.classList.add('selected');
    background.classList.remove('selected');

});
// window.addEventListener('resize',()=>{
//     if(window.innerWidth<=){
//          section1.style.
//     }
// })