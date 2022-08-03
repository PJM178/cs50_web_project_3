document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Sending an email and loading sent emails box
  document.querySelector('#send-mail').addEventListener('click', send_mail);

  // By default, load the inbox
  load_mailbox('inbox');
 
});
 
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#open-mail').style.display = 'none';
  document.querySelector('#hr').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#hr').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#open-mail').style.display = 'none';

  // load mails associated with the mailbox and append them to the "emails-view" element
  get_mails(mailbox)

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 id="test">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function send_mail() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
    // print result
    console.log(result);
  })
  load_mailbox('sent');
}

function get_mails(box) {
  // fetch(`/emails/${box}`) // another way to do it
  fetch('/emails/'+box)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);
    
    let view = document.querySelector('#emails-view');
    let ids = []
    // ... do something else with emails ...
    // Try to make it a table later like gmail does !!!
    emails.forEach(email => {
      const box = document.createElement('div');
      if (email.read === true) {
        box.setAttribute(
          'style',
          'display: flex; border: solid 1px; padding: 5px; background-color: rgba(200, 200, 200, 0.5);'
        )
      }
      else {
        box.setAttribute(
          'style',
          'display: flex; border: solid 1px; padding: 5px;'
        )
      }
      box.setAttribute(
          'id',
          'email'
      )
      const sender = document.createElement('div')
      sender.innerHTML = email.sender
      sender.setAttribute(
        'style',
        'font-weight: bold;'
      )
      const subject = document.createElement('div')
      subject.innerHTML = email.subject
      subject.setAttribute(
        'style',
        'margin-left: 0.5em;'
      )
      const time = document.createElement('div')
      time.innerHTML = email.timestamp
      time.setAttribute(
        'style',
        'margin-left: auto; color: rgba(0, 0, 0, 0.5);'
      )
      // element.innerHTML = `Sender: ${email.sender} ${'\xa0'.repeat(10)} Subject: ${email.subject} ${'\xa0'.repeat(10)} Time: ${email.timestamp}`;
      const id = email.id;
      box.append(sender, subject, time)
      
      // box.addEventListener('click', function () {
      //   fetch('/emails/'+id)
      //   .then(response => response.json())
      //   .then(email => {
      //     // Print email
      //     console.log(email);
      //     // ... do something else with email ...
      //     document.querySelector('#emails-view').style.display = 'none';
      //     document.querySelector('#compose-view').style.display = 'none';
      //     document.querySelector('#open-mail').style.display = 'block';
      //     document.querySelector('#hr').style.display = 'block';
      //     let email_box = document.createElement('div')
      //     email_box.setAttribute(
      //       'id',
      //       'email-box;'
      //     )
      //     let from_box = document.createElement('div')
      //     from_box.setAttribute(
      //       'style',
      //       'display: flex;'
      //     )
      //     let from_text = document.createElement('div')
      //     from_text.innerHTML = "From:"
      //     from_text.setAttribute(
      //       'style',
      //       'font-weight: bold;'
      //     )
      //     let from = document.createElement('div')
      //     from.innerHTML = email.sender
      //     from.setAttribute(
      //       'style',
      //       'margin-left: 0.5em;'
      //     )
      //     from_box.append(from_text, from)
      //     let to_box = document.createElement('div')
      //     to_box.setAttribute(
      //       'style',
      //       'display: flex;'
      //     )
      //     let to_text = document.createElement('div')
      //     to_text.innerHTML = "To:"
      //     to_text.setAttribute(
      //       'style',
      //       'font-weight: bold;'
      //     )
      //     let to = document.createElement('div')
      //     to.innerHTML = email.recipients
      //     to.setAttribute(
      //       'style',
      //       'margin-left: 0.5em;'
      //     )
      //     to_box.append(to_text, to)
      //     let subject_box = document.createElement('div')
      //     subject_box.setAttribute(
      //       'style',
      //       'display: flex;'
      //     )
      //     let subject_text = document.createElement('div')
      //     subject_text.innerHTML = "Subject:"
      //     subject_text.setAttribute(
      //       'style',
      //       'font-weight: bold;'
      //     )
      //     let subject = document.createElement('div')
      //     subject.innerHTML = email.subject
      //     subject.setAttribute(
      //       'style',
      //       'margin-left: 0.5em;'
      //     )
      //     subject_box.append(subject_text, subject)
      //     let timestamp_box = document.createElement('div')
      //     timestamp_box.setAttribute(
      //       'style',
      //       'display: flex;'
      //     )
      //     let timestamp_text = document.createElement('div')
      //     timestamp_text.innerHTML = "Timestamp:"
      //     timestamp_text.setAttribute(
      //       'style',
      //       'font-weight: bold;'
      //     )
      //     let timestamp = document.createElement('div')
      //     timestamp.innerHTML = email.timestamp
      //     timestamp.setAttribute(
      //       'style',
      //       'margin-left: 0.5em;'
      //     )
      //     timestamp_box.append(timestamp_text, timestamp)
      //     let body = email.body
          
      //     email_box.append(from_box, to_box, subject_box, timestamp_box, hr)
      //     document.querySelector('#open-mail').append(email_box);

      //   });
      // })

      
      view.append(box)
      ids.push(id)
      
    });
    email_view(view);
    console.log(email);
  });
}

function email_view (id) {
  document.querySelector('#email').addEventListener('click', function () {
    fetch('/emails/'+id)
    .then(response => response.json())
    .then(email => {
      // Print email
      console.log(email);
      // ... do something else with email ...
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#open-mail').style.display = 'block';
      document.querySelector('#hr').style.display = 'block';
      let email_box = document.createElement('div')
      email_box.setAttribute(
        'id',
        'email-box;'
      )
      let from_box = document.createElement('div')
      from_box.setAttribute(
        'style',
        'display: flex;'
      )
      let from_text = document.createElement('div')
      from_text.innerHTML = "From:"
      from_text.setAttribute(
        'style',
        'font-weight: bold;'
      )
      let from = document.createElement('div')
      from.innerHTML = email.sender
      from.setAttribute(
        'style',
        'margin-left: 0.5em;'
      )
      from_box.append(from_text, from)
      let to_box = document.createElement('div')
      to_box.setAttribute(
        'style',
        'display: flex;'
      )
      let to_text = document.createElement('div')
      to_text.innerHTML = "To:"
      to_text.setAttribute(
        'style',
        'font-weight: bold;'
      )
      let to = document.createElement('div')
      to.innerHTML = email.recipients
      to.setAttribute(
        'style',
        'margin-left: 0.5em;'
      )
      to_box.append(to_text, to)
      let subject_box = document.createElement('div')
      subject_box.setAttribute(
        'style',
        'display: flex;'
      )
      let subject_text = document.createElement('div')
      subject_text.innerHTML = "Subject:"
      subject_text.setAttribute(
        'style',
        'font-weight: bold;'
      )
      let subject = document.createElement('div')
      subject.innerHTML = email.subject
      subject.setAttribute(
        'style',
        'margin-left: 0.5em;'
      )
      subject_box.append(subject_text, subject)
      let timestamp_box = document.createElement('div')
      timestamp_box.setAttribute(
        'style',
        'display: flex;'
      )
      let timestamp_text = document.createElement('div')
      timestamp_text.innerHTML = "Timestamp:"
      timestamp_text.setAttribute(
        'style',
        'font-weight: bold;'
      )
      let timestamp = document.createElement('div')
      timestamp.innerHTML = email.timestamp
      timestamp.setAttribute(
        'style',
        'margin-left: 0.5em;'
      )
      timestamp_box.append(timestamp_text, timestamp)
      let body = email.body
      
      email_box.append(from_box, to_box, subject_box, timestamp_box, hr)
      document.querySelector('#open-mail').append(email_box);
      // let view = document.getElementById("#open-mail");
      // view.innerHTML = "kalllee";
    });
  })
}
