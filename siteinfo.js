function siteinfo() {
  var currentUrl=$(location).attr('href');

  if(s.startsWith(currentUrl,siteUrl)) {
    return {
      sharedAuth: true,
      loginScreen: $('.username input#signin-email').length>=1,
      loginInput: $('.username input#signin-email'),
      passwordInput: $('.password input#signin-password'),
      loginButton: $('.flex-table-secondary button.submit')
    };
  }

  if(s.include(currentUrl,'twitter')) {
    return {
      loginScreen: $('.username input#signin-email').length>=1,
      loginInput: $('.username input#signin-email'),
      passwordInput: $('.password input#signin-password'),
      loginButton: $('.flex-table-secondary button.submit')
    };
  }

  if(s.include(currentUrl,'facebook')) {
    return {
      loginScreen: $('input#email').length===1,
      loginInput: $('input#email'),
      passwordInput: $('input#pass'),
      loginButton: $('#loginbutton input')
    };
  }
}
