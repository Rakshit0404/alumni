const imagecarry=document.querySelector('#imagecarry');
const blogimg=document.querySelector('#blogimg');
const add=document.querySelector('#add');
const text=document.querySelector('#text');
const blogtext=document.querySelector('#blogtext');
const clear=document.querySelector('#clear');
const array=[];
var size;
add.addEventListener('click',()=>{
    blogtext.innerHTML+=text.value;
})

clear.addEventListener('click',()=>{
    text.value="";
    text.value=blogtext.innerHTML;
})

//emoji keyboard
twemoji.parse(document.body);
//emoji keyboard

//export

const butto=document.querySelector("#butto");
const filenames=document.querySelector("#filenames");
butto.addEventListener('click',(e)=>{
    var iframe = document.getElementById('upload_ifr');
    console.log(iframe);
    var images = iframe.contentWindow.document.querySelectorAll('p img');
    console.log(images);
    var str="";
    for(let im of images)
    {
        str+=im.src.substr(33)+"|";
    }
    str=str.replace(/%20/g," ");
    const iframe2 = document.getElementById('justupdate');
    var filenames = iframe2.contentWindow.document.querySelector('#filenames');
    var submit2 = iframe2.contentWindow.document.querySelector('#submit');
    filenames.value=str;
    submit2.click();
    var getcontent=tinyMCE.get("upload").getContent({format : 'raw'});
    var content=document.querySelector("#content");
    content.value=getcontent;
    console.log(array);
    document.querySelector("#submit").click();
})