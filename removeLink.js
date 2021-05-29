var div = document.getElementById('link');

function removeLink() {
  // remove this button and its input
  div.removeChild(this.previousElementSibling);
  div.removeChild(this);
}

// attach onclick event handler to 1st remove button
document.getElementById('remove').addEventListener('click', removeLink);