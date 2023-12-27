const nonce = "AJAFFJEAJRajndg"

// Create your HTML content here
const htmlToInsert = `<div id="inserted-element-${nonce}">#</div>`;

// Define your CSS rules within the style block
const cssRules = `
  /** BEGIN INSERTED JS **/
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
  /** END INSERTED JS **/
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
        href.match(":[^/]")==null;
}

// Function to insert HTML after <a> tags inside <main>, and style for the same
function insertHTML() {
  if (!checkDomain()) return;

  // only run function once
  if (hasDoneLinkInserts) return true;
  else var hasDoneLinkInserts = true;

  addStyle();

  const anchorTags = document.querySelectorAll('main a');

  anchorTags.forEach(async anchorTag => {
    // Make sure to only append the element to links within the same (sub)domain.
    const href = anchorTag.getAttribute('href');
    if (checkHref(href)) {
      // Create a wrapper element to contain the HTML code
      const wrapper = document.createElement('div');
      wrapper.innerHTML = htmlToInsert;

      const data = await fetch('https://random-data-api.com/api/v2/users').then((r)=>r.json());

      // Insert the HTML code after the <a> tag
      anchorTag.parentNode.insertBefore(wrapper.firstChild, anchorTag.nextSibling).innerText = data.id%10??"Empty";
    }
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
