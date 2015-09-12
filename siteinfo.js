function siteinfo() {
  var currentUrl=$(location).attr('href');

  if(s.include(currentUrl,'twitter')) {
    return {
      loginScreen: $('input#signin-email').length===1,
      loginInput: $('input#signin-email'),
      passwordInput: $('input#signin-password'),
      loginButton: $('.flex-table-secondary button.submit')
    };
  }
  if(s.include(currentUrl,'twitter')) {
    return {
      loginScreen: $('input#signin-email').length===1,
      loginInput: $('input#signin-email'),
      passwordInput: $('input#signin-password'),
      loginButton: $('.Button StreamsLogin js-login')
    };
  }

  if(s.include(currentUrl,'facebook')) {
    return {
      loginScreen: $('input#email').length===1,
      loginInput: $('input#email'),
      passwordInput: $('input#pass'),
      loginButton: $('input#loginbutton')
    };
  }
}
