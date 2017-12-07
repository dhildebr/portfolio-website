function copyStringToClipboard(copyText) {
  var tempTextArea = document.createElement("textarea");
  
  tempTextArea.style.position = "fixed";
  tempTextArea.style.top = 0;
  tempTextArea.style.left = 0;
  
  tempTextArea.style.width = "2em";
  tempTextArea.style.height = "2em";
  
  tempTextArea.style.margin = 0;
  tempTextArea.style.padding = 0;
  tempTextArea.style.border = "none";
  tempTextArea.style.outline = "none";
  tempTextArea.style.boxShadow = "none";
  
  tempTextArea.style.background = "transparent";
  
  tempTextArea.value = copyText;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  
  try {
    var success = document.execCommand("copy");
    var successMessage = success ? "successful" : "unsuccessful";
    console.log("String copy was " + successMessage + ".");
    document.body.removeChild(tempTextArea);
    return success;
  }
  catch (err) {
    console.log("Exception thrown: unable to copy text.");
    document.body.removeChild(tempTextArea);
    return false;
  }
}

jQuery("span.email").click(function() {
  var $email = jQuery(this).text();
  $email = $email.split("").reverse().join("");
  copyStringToClipboard($email);
  jQuery("span.copy-confirmation").show();
});
