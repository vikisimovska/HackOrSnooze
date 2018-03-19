$(function() {
  let $storyList = $('#story_list');
  let $signInForm = $('#signIn_form');
  let $logInForm = $('#logIn_form');
  let $signInName = $('#signIn_name');
  let $signInUser = $('#signIn_user');
  let $signInPassword = $('#signIn_password');
  let $submitNavBtn = $('#submit_nav_btn');
  let $favoritesNavBtn = $('#favorites_nav_btn');
  let $userNavBtn = $('#user_nav_btn');
  let $logOut = $('#log_out');
  let $signInNavBtn = $('#signIn_nav_btn');
  let $logInNavBtn = $('#logIn_nav_btn');
  let username;

  async function getStories() {
    let stories = await $.getJSON(
      'https://hack-or-snooze.herokuapp.com/stories'
    );
    let title;
    let story_url;
    let story_li;
    let story_link;
    for (let i = 0; i < stories.data.length; i++) {
      title = stories.data[i].title;
      story_url = stories.data[i].url.split('/')[2];
      story_link = stories.data[i].url;
      if (story_link[story_link.length - 1] === '/')
        story_link = story_link.slice(0, story_link.length - 1);
      story_li = `<li><i class="far fa-star"></i> <a href=${story_link}>${title} (${story_url})</a></li>`;
      $storyList.append(story_li);
    }
  }
  //getting the stories
  getStories();
  $signInForm.hide();
  $logInForm.hide();
  $submitNavBtn.hide();
  $favoritesNavBtn.hide();
  $userNavBtn.hide();
  $logOut.hide();

  //toggling the login and logout forms
  $('#signIn_nav_btn').on('click', function() {
    $logInForm.hide();
    $signInForm.fadeToggle();
  });
  $('#logIn_nav_btn').on('click', function() {
    $signInForm.hide();
    $logInForm.fadeToggle();
  });
  //singIn AJAX call
  function sendSignInCredentials() {
    return $.post({
      url: 'https://hack-or-snooze.herokuapp.com/users',
      data: {
        data: {
          name: $signInName.val(),
          username: $signInUser.val(),
          password: $signInPassword.val()
        }
      }
    });
  }
  //gettin Token
  function getToken() {
    return $.post({
      url: 'https://hack-or-snooze.herokuapp.com/auth',
      data: {
        data: {
          username: $signInUser.val(),
          password: $signInPassword.val()
        }
      }
    });
  }
  //signing in a user
  async function signIn() {
    try {
      //sendSignInCredentials() function
      await sendSignInCredentials();
      localStorage.setItem('username', $signInUser.val());
      localStorage.setItem('name', $signInName.val());
      username = localStorage.getItem('username');
      //getToken() function
      let response = await getToken();
      let token = response.data.token;
      localStorage.setItem('token', token);

      //testing!!
      console.log(
        'IN HERE.. ',
        localStorage.getItem('token'),
        localStorage.getItem('username')
      );

      //hide the log in/sign in btn && show the logout/submit/favorites/username btns
      $signInForm.slideUp();
      $signInNavBtn.hide();
      $logInNavBtn.hide();
      $submitNavBtn.show();
      console.log('IN HERE WHERE IT NEEDS TO SHOW THE SUBMIT..');
      $favoritesNavBtn.show();
      $userNavBtn.show();
      $logOut.show();
    } catch (e) {
      alert('ERROR : ', e);
    }
  }
  $signInForm.on('submit', function(event) {
    event.preventDefault();

    signIn();
  });

  // toggling favorite star
  $('ol').on('click', 'i', function() {
    $(this).toggleClass('far fa-star fas fa-star');
    $(this)
      .parent()
      .toggleClass('favorited');
  });
});
