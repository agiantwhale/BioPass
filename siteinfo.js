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
}
