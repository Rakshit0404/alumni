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

//drag drop
document.querySelectorAll('.input').forEach(inputElement => {
    const dropZoneElement=inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener('click',e=>{
        inputElement.click();
    });

    dropZoneElement.addEventListener('change',e=>{
        if(inputElement.files.length)
        {
            updateThumbnail(dropZoneElement,inputElement.files[0]);
        }
    });

    dropZoneElement.addEventListener('dragover',(e)=>{
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone__over");
    });

    ['dragleave','dragend'].forEach(type=>{
        dropZoneElement.addEventListener(type,(e)=>{
            e.preventDefault();
            dropZoneElement.classList.remove("drop-zone__over");
        })
    })

    dropZoneElement.addEventListener('drop',(e)=>{
        e.preventDefault();
        if(e.dataTransfer.files.length)
        {
            inputElement.files=e.dataTransfer.files;
            console.log(inputElement.files);
            updateThumbnail(dropZoneElement,e.dataTransfer.files[0]);
        }
        dropZoneElement.classList.remove("drop-zone__over");
    });
});

function updateThumbnail(dropZoneElement,file)
{
    let thumbnailElement=dropZoneElement.querySelector(".thumb");


    //for the first time, promp will be present.
    if(dropZoneElement.querySelector(".prompt"))
    {
        dropZoneElement.querySelector(".prompt").remove();
    }

    //for the first time, thumbnailElement will be empty
    if(!thumbnailElement)
    {
        thumbnailElement=document.createElement("div");
        thumbnailElement.classList.add("thumb");
        dropZoneElement.appendChild(thumbnailElement);
    }
    
    thumbnailElement.dataset.label=file.name;

    if(file.type.startsWith("image/"))
    {
        const reader=new FileReader();
        reader.readAsDataURL(file);

        reader.onload=()=>{
            thumbnailElement.style.backgroundImage=`url(${reader.result})`;
        }
    }
    else{
        thumbnailElement.style.backgroundImage="";
    }
} 
//drag drop

//emoji keyboard
twemoji.parse(document.body);

const emojis=document.querySelectorAll('.emoji');
const navpages=document.querySelectorAll('.navpages');
const pages=document.querySelectorAll('.pages');

for(let i=0;i<navpages.length;i++)
{
    navpages[i].addEventListener('click',(e)=>{
        const num=i*100+2*i+0.2*i;
        pages[0].style.marginLeft=`-${num}%`;
    })
}

for(let emoji of emojis)
{
    emoji.addEventListener('click',(e)=>{
        blogtext.innerHTML+=emoji.alt;
    })
}

//emoji keyboard

//export

const butto=document.querySelector("#butto");
const filenames=document.querySelector("#filenames");
butto.addEventListener('click',(e)=>{
    var iframe = document.getElementById('upload_ifr');
    var images = iframe.contentWindow.document.querySelectorAll('p img');
    // console.log(images);
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

