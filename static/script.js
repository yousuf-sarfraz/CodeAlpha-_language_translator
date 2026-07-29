async function translateText(){

let text=document.getElementById("text").value;

let source=document.getElementById("source").value;

let target=document.getElementById("target").value;

let formData=new FormData();

formData.append("text",text);
formData.append("source",source);
formData.append("target",target);

let response=await fetch("/translate",{

method:"POST",

body:formData

});

let data=await response.json();

document.getElementById("result").innerHTML=data.translated;

}