const nonce = "v8443v73i4";
const username = "default";

// alert("hi");
console.log("hello")

// Create your HTML content here
const htmlToInsert = `<div id="inserted-element-${nonce}">#</div>`;

// Define your CSS rules within the style block
const cssRules = `
  /** BEGIN INSERTED CSS **/
  #inserted-element-${nonce}{
      width: 1lh; 
      height: 100%;
      border-radius: 50%; 
      background-color: black; 
      color:white; 
      text-align:center; 
      display: inline-block; 
      margin-left: 5px;
      cursor:pointer;
  }
  /** END INSERTED CSS **/
`;
function checkDomain(){
  switch(window.location.origin){
    case "https://en.wikipedia.org":
    case "https://wikipedia.org":
      return true;
    default:
      return false;
  }
}
function checkHref(href){
  return href && 
        (href.startsWith("/") || href.startsWith(window.location.origin)) && 
        href !== window.location.pathname &&
        href.match(":[^/]")==null;
}

function extractPath(hrefString){
  // let rtrn = hrefString.match("(?:.{3})?/(.+)");
  // if (rtrn == null) return null;
  let string = hrefString.match("(?:[^\.]{3})?/(.+)")[1]; // only results following the .com/.org etc.
  console.log(string);
  return string.replaceAll("/","-");
}

// Function to insert HTML after <a> tags inside <main>, and style for the same
async function insertHTML() {
  if (!checkDomain()) return;

  // only run function once
  if (hasDoneLinkInserts) return true;
  else var hasDoneLinkInserts = true;

  addStyle();

  let anchorTags = Array.from(document.querySelectorAll('main a[href]'));
  anchorTags = anchorTags.filter((anchorTag) => checkHref(anchorTag.getAttribute("href"))); // process certain links as "valid" gameplay

  links = anchorTags.map((anchorTag) => extractPath(anchorTag.getAttribute('href')));

  const data = await fetch('http://localhost:3000/'+username+"/"+extractPath(window.location.pathname),{
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({neighbors:links})        
      }).then((r)=>r.json());
  console.log("response recieved!");

  anchorTags.forEach(async anchorTag => {
      if (!checkHref(anchorTag.getAttribute("href"))) return;

      const link = extractPath(anchorTag.getAttribute('href'));
      
      // Create a wrapper element to contain the HTML code
      const wrapper = document.createElement('div');
      wrapper.innerHTML = htmlToInsert;

      // Insert the HTML code after the <a> tag
      const insertedElement = anchorTag.parentNode.insertBefore(wrapper.firstChild, anchorTag.nextSibling);
      insertedElement.innerText = data[link]??"#";
  });
}

function addStyle(){
  // Create a style block
  const style = document.createElement('style');

  // Set the CSS rules as the content of the style block
  style.textContent = cssRules;

  // Append the style block to the <head> of the document
  document.head.appendChild(style);
}

// Execute the function when the DOM content is fully loaded, and when this code is executed - code will only run once
window.addEventListener('DOMContentLoaded', insertHTML);
insertHTML();
