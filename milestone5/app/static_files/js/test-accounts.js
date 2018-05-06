function testauth()
{
  $.ajax({
    type: "POST", //GET, POST, PUT
    url: '/testauth',  //the url to call
    data: {'data': 'data'},     //Data sent to server
    contentType: 'json',           
    beforeSend: function (xhr) {   //Include the bearer token in header
      xhr.setRequestHeader("Authorization", 'Bearer '+window.localStorage.getItem("token"));
    }
  }).done(function (response) 
  {
    $('#loginStatus').text("Signed in: true (username: "+response.username+")");
    $('#getUserInfo').text('Get '+response.username+'\'s info')
    $('#getAllProfiles').text('Get '+response.username+'\'s profiles');
    $('#lookupInfo_hidden').show();
    $('#new_profile_text').text('New profile for '+response.username);
    $('#profile-new').show();
  }).fail(function (err)  
  {
    $('#loginStatus').text("Signed in: false");
  });
}

// jQuery convention for running when the document has been fully loaded:
$(document).ready(() => {

  /*
   * Show list of all users. Don't need to be signed in
   * Makes GET request to /accounts
   */
  $('#allUsersButton').click(() => {
    $.ajax({
      url: 'accounts/',
      type: 'GET',
      dataType : 'json',
      success: (data) => {
        console.log('You received some data!', data);
        $('#infoDiv').html('All users: ' + JSON.stringify(data));
        $('#status').html('Successfully fetched data (GET request) at URL: /users');
      },
      error: (xhr, textStatus, error) => 
      {
        $('#infoDiv').html('');
        $('#status').html(xhr.statusText+': '+xhr.responseJSON.error);
      }
    });
  });

  /*
   * Sign up; don't need to be signed in.
   * Makes POST request to /accounts/signup
   */
  $('#signup').click(() => 
  {
    var body = {
                 'username' : $('#username').val(),
                 'email': $('#email').val(), 
                 'password' : $('#password').val()
               };
    $.ajax({
      url: 'accounts/signup',
      type: 'POST',
      dataType : 'json',
      data: body,
      success: (data) => 
      {
        console.log('sign up success');
        $('#infoDiv').html(JSON.stringify(data));
        $('#status').html('Successfully fetched data (POST request) at URL: accounts/signup');
        window.localStorage.setItem("token", data.token); //store authorization token
        testauth();
        
        // clear fields since signing in as new user; haven't selected profile yet
        $('#medicine-new').hide();
        $('#lookupMedicine_hidden').hide()
        $('#nameBoxFirst').val('');
        $('#nameBoxLast').val('');
        $('#profile_id').val('');
      },
      error: (xhr, textStatus, error) => 
      {
        $('#infoDiv').html('');
        $('#status').html(xhr.statusText+': '+xhr.responseJSON.error);
      }
    });

  });

  /*
   * Login
   * Makes POST request to accounts/login
   */
  $('#login').click(() => 
  {
    var body = {
                 'username' : $('#username').val(),
                 'password' : $('#password').val()
               };
    $.ajax({
      url: 'accounts/login',
      type: 'POST',
      dataType : 'json',
      data: body,
      success: (data) => 
      {
        console.log('login success');
        $('#infoDiv').html(JSON.stringify(data));
        $('#status').html('Successfully fetched data (POST request) at URL: accounts/login');
        window.localStorage.setItem("token", data.token); //store authorization token
        testauth();

        // clear fields since logged in as new user; haven't selected profile yet
        $('#medicine-new').hide();
        $('#lookupMedicine_hidden').hide()
        $('#nameBoxFirst').val('');
        $('#nameBoxLast').val('');
        $('#profile_id').val('');
      },
      error: (xhr, textStatus, error) => 
      {
        $('#infoDiv').html('');
        $('#status').html(xhr.statusText+': '+xhr.responseJSON.error);
      }
    });

  });

  /*
   * Sign out. Clears jwt token 
   */
  $('#signout').click(()=>
  {
    window.localStorage.setItem("token", "");
    window.location.reload();
  });

  /*
   * Gets user's info (ex. username, email, password)
   * Needs to be signed in and access correct user
   * Makes GET request to /accounts/info
   */
  $('#getUserInfo').click(() => {
    const requestURL = 'accounts/info'
    console.log('making ajax request to:', requestURL);

    $.ajax({
      url: requestURL,
      type: 'GET',
      dataType : 'json',
      beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+window.localStorage.getItem("token"));
      },
      success: (data) => {
        console.log('You received some data!', data);
        $('#infoDiv').html(data.username + '\'s info: ' + JSON.stringify(data));
        $('#status').html('Successfully fetched data (GET request) at URL: ' + requestURL);
      },
      error: (xhr, textStatus, error) => 
      {
        $('#infoDiv').html('');
        $('#status').html(xhr.statusText+': '+xhr.responseJSON.error);
      }
    });
  });



});