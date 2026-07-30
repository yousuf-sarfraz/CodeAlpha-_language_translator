const text=document.getElementById("text");
const result=document.getElementById("result");

// Character Counter
text.addEventListener("input",()=>{

    document.getElementById("count").innerHTML=text.value.length;

});

// Translate
async function translateText(){

    if(text.value.trim()==""){

        alert("Please enter text.");

        return;

    }

    result.innerHTML="⏳ Translating...";

    const formData=new FormData();

    formData.append("text",text.value);
    formData.append("source",source.value);
    formData.append("target",target.value);

    try{

        const response=await fetch("/translate",{

            method:"POST",

            body:formData

        });

        const data=await response.json();

        result.innerHTML=data.translated;

    }

    catch{

        result.innerHTML="Translation Failed.";

    }

}

// Swap Languages
swapBtn.onclick=()=>{

    let temp=source.value;

    source.value=target.value;

    target.value=temp;

}

// Copy
copyBtn.onclick=()=>{

    navigator.clipboard.writeText(result.innerText);

    alert("Copied Successfully!");

}

// Clear
clearBtn.onclick=()=>{

    text.value="";

    result.innerHTML="";

    count.innerHTML=0;

}

// Dark Mode
themeBtn.onclick=()=>{

    document.body.classList.toggle("dark-mode");

}