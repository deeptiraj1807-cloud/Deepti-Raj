const textarea = document.getElementById("textInput");  
const charCount = document.getElementById("charCount");

textarea.addEventListener("input", function() {
  charCount.textContent = textarea.value.length; 
});
