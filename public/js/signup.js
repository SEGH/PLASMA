$(document).ready(() => {
    // Getting references to our form and inputs
    const loginButton = $("#loginButton");
    const usernameInput = $("#username");
    const passwordInput = $("#password");
  
    loginButton.on("click", function(event){
      event.preventDefault()
      $.post("/api/signup", {
        username: usernameInput.val(),
        password: passwordInput.val()
      }).then(function(){
        res.redirect(307, "/login")
      })
      .catch(err => {
        res.status(401).json(err);
      });
    });
})