var button = document.getElementById('say');

if (button) {
  button.addEventListener('click', function (e) {
    var message = prompt('Say Something:', 'Yo yo'),
      echo    = document.createElement('div');

    if (!message) { return; }

    echo.innerHTML = Handlebars.partials['test/echo']({message: message});
    document.body.appendChild(echo);
  }, false);
}
