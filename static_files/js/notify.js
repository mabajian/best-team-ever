var app = (function() {
  'use strict';

  var isSubscribed = false;
  var swRegistration = null;

  var notifyButton = document.querySelector('.js-notify-btn');
  var pushButton = document.querySelector('.js-push-btn');

  function checkMonth(month) {
    switch (month) {
      case 'Jan':
        return 0;
        break;
      case 'Feb':
        return 1;
        break;
      case 'Mar':
        return 2;
        break;
      case 'Apr':
        return 3;
        break;
      case 'May':
        return 4;
        break;
      case 'Jun':
        return 5;
        break;
      case 'Jul':
        return 6;
        break;
      case 'Aug':
        return 7;
        break;
      case 'Sep':
        return 8;
        break;
      case 'Oct':
        return 9;
        break;
      case 'Nov':
        return 10;
        break;
      case 'Dec':
        return 11;
        break;
      default:
        0;
    }
  }
  // check for notification support
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications!');
    return;
  }

  // request permission to show notifications
  Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
  });

  function displayNotification() {

    // display a Notification
    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(function(reg) {

        // Add 'options' object to configure the notification
        var options = {
          title: 'Notification',
          body: 'First notification!',
          icon: 'images/notification-flat.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },

          // add actions to the notification
          actions: [{
              action: 'explore',
              title: 'Go to the site',
              icon: 'images/checkmark.png'
            },
            {
              action: 'close',
              title: 'Close the notification',
              icon: 'images/xmark.png'
            },
          ]


        }

        reg.showNotification(options.title, options);
      });
    }

  }

  function updateSubscriptionOnServer(subscription) {
    // Here's where you would send the subscription to the application server

    var subscriptionJson = document.querySelector('.js-subscription-json');
    var endpointURL = document.querySelector('.js-endpoint-url');
    var subAndEndpoint = document.querySelector('.js-sub-endpoint');

    if (subscription) {
      subscriptionJson.textContent = JSON.stringify(subscription);
      endpointURL.textContent = subscription.endpoint;
      subAndEndpoint.style.display = 'block';
    } else {
      subAndEndpoint.style.display = 'none';
    }
  }

  function updateBtn() {
    if (Notification.permission === 'denied') {
      pushButton.textContent = 'Push Messaging Blocked';
      pushButton.disabled = true;
      updateSubscriptionOnServer(null);
      return;
    }

    if (isSubscribed) {
      pushButton.textContent = 'Disable Push Messaging';
    } else {
      pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
  }

  function urlB64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  notifyButton.addEventListener('click', function() {

    // need to call ajax here
    $.ajax({
      // need to change profile_id
      // as "localStorage.profile_id"
      // test value
      url: '/api/profiles/' + localStorage.profile_id + '/history',
      type: 'GET',
      dataType: 'json', // this URL returns data in JSON format
      beforeSend: (xhr) => { //Include the bearer token in header
        xhr.setRequestHeader("Authorization", 'Bearer ' + window.localStorage.getItem("token"));
      },
      success: (data) => {
        console.log('Notify', data);
        for (var i = 0; i < data.length; i++) {
          //console.log(data[i].date);
          let day = data[i].date.substring(0, 2);
          let month = data[i].date.substring(3, 6);
          let year = data[i].date.substring(7, 11);
          let numOfMonth = checkMonth(month);
          for (var j = 0; j < data[i].values.length; j++) {
            let hours = data[i].values[j].time.substring(0, 2);
            let mins = data[i].values[j].time.substring(3, 5);
            let notificationDate = new Date(year, numOfMonth, day);
            notificationDate.setHours(hours, mins);
            let currentDate = new Date();
            //// TODO: need to change it "//let timeDuration = (notificationDate.getTime() - currentDate.getTime());"
            // test value
            //let timeDuration = (currentDate.getTime()- notificationDate.getTime());
            let timeDuration = (notificationDate.getTime() - currentDate.getTime());
            if (timeDuration > 0) { // notification time already passed
              // do nothing
              console.log('notification time already passed ');
            } else {
              //console.log(timeDuration); //in milliseconds
              timeDuration = timeDuration * -1;
              // test
              // timeDuration = 5000; then it will show notification once
              //console.log(timeDuration);
              window.setTimeout(displayNotification, timeDuration);


            }


          }
        }
        alert('Notification Time Set');
        window.location.replace("http://localhost:3000/home");



      },
      error: (xhr, textStatus, error) => {
        console.log(xhr.statusText + ': ' + xhr.responseJSON.error);
      }
    });




  });

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('sw.js')
      .then(function(swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;

      })
      .catch(function(error) {
        console.error('Service Worker Error', error);
      });
  } else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
  }

})();
