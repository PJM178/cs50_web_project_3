document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Sending an email and loading sent emails box
  document.querySelector('#send-mail').addEventListener('click', send_mail);

  // By default, load the inbox
  load_mailbox('inbox')

});
 
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#open-mail').style.display = 'none';
  // document.querySelector('#hr').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Check if email details field is empty and make it empty if not
  if (document.querySelector('#open-mail').innerHTML !== "") {
    document.querySelector('#open-mail').innerHTML = "";
  };

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  // document.querySelector('#hr').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#open-mail').style.display = 'none';

  const view = document.querySelector('#emails-view');
  view.innerHTML = `<h3 id="test">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // get_mails(mailbox)
  fetch('/emails/'+mailbox)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);
    
    // --- Perhaps later make it a table like gmail ---
    // load mails associated with the mailbox and append them to the "emails-view" element

    emails.forEach(email => {
      let box = document.createElement('div');
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
      let sender = document.createElement('div')
      sender.innerHTML = email.sender
      sender.setAttribute(
        'style',
        'font-weight: bold;'
      )
      let subject = document.createElement('div')
      subject.innerHTML = email.subject
      subject.setAttribute(
        'style',
        'margin-left: 0.5em;'
      )
      let time = document.createElement('div')
      time.innerHTML = email.timestamp
      time.setAttribute(
        'style',
        'margin-left: auto; color: rgba(0, 0, 0, 0.5);'
      )
      
      box.append(sender, subject, time)

      // On clicking a listed email take the user to that email's details
      box.addEventListener('click', () => load_email(email.id))
      view.append(box)

    });
  });  
}

function send_mail(event) {
  event.preventDefault()

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
  // .then(response => response.json())
  // .then(result => {
  //   // print result
  //   console.log(result);
  // })
  .then(response => load_mailbox('sent'));
}

function load_email(id) {
    fetch('/emails/'+id, {
      method: 'PUT',
      body: JSON.stringify({
          // archived: true
          read: true
      })
    });
    fetch('/emails/'+id)
    .then(response => response.json())
    .then(email => {
      // Print email
      console.log(email);

      // Hide views other than the loaded email
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#open-mail').style.display = 'block';
      // document.querySelector('#hr').style.display = 'block';

      // Creating elements for the desired look of the displayed mail
      let view = document.querySelector('#open-mail')

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
      // email.recipients.forEach(recipient => {
      //   to.append(`${recipient+" "}`)
      // });
      let test = email.recipients;
      let testt = test.join(', ');
      to.innerHTML = testt
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

      let hr = document.createElement('hr');

      let body_box = document.createElement('div')
      body_box.setAttribute(
        'style',
        'display: flex;'
      )
      let body = email.body
      body_box.append(body)
      
      // Reply and archive button container
      let reply_archive_container = document.createElement('div')
      reply_archive_container.setAttribute(
        'style',
        'margin-top: 0.5rem;'
      );

      // Add a reply button
      let reply_button = document.createElement('button');
      reply_button.innerText = "Reply";
      reply_button.setAttribute(
        'class',
        'btn btn-sm btn-outline-primary'
      );
      reply_button.setAttribute(
        'style',
        'margin-right: 0.3rem;'
      );
      reply_button.addEventListener('click', () => {
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#open-mail').style.display = 'none';
        // document.querySelector('#hr').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'block';
      
        // Clear out composition fields
        document.querySelector('#compose-recipients').value = email.sender;
        let reply_subject = document.querySelector('#compose-subject');
        reply_subject.value = email.subject;
        if (reply_subject.value.startsWith('Re: ') === true) {
          document.querySelector('#compose-subject').value = email.subject
        }
        else {
          document.querySelector('#compose-subject').value = "Re: "+email.subject
        }
        document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: `+email.body;
      });

      reply_archive_container.append(reply_button)

      // Add an archive button only to inbox
      if (document.querySelector('#test').innerHTML === 'Inbox') {
        let archive_button = document.createElement('button')
        archive_button.innerText = "Archive"
        archive_button.setAttribute(
          'class',
          'btn btn-sm btn-outline-primary'
        )
        archive_button.addEventListener('click', (event) => {
          event.preventDefault();
          fetch('/emails/'+id, {
            method: 'PUT',
            body: JSON.stringify({
                archived: true
            })
          })
          .then(() => load_mailbox('inbox'));
        });
        reply_archive_container.append(archive_button)
        email_box.append(from_box, to_box, subject_box, timestamp_box, reply_archive_container, hr, body_box)
      }
      else if (document.querySelector('#test').innerHTML === 'Archive') {
        let archive_button = document.createElement('button')
        archive_button.innerText = "Unarchive"
        archive_button.setAttribute(
          'class',
          'btn btn-sm btn-outline-primary'
        )
        archive_button.addEventListener('click', (event) => {
          event.preventDefault();
          fetch('/emails/'+id, {
            method: 'PUT',
            body: JSON.stringify({
                archived: false
            })
          })
          .then(() => load_mailbox('inbox'));
        });
        reply_archive_container.append(archive_button)
        email_box.append(from_box, to_box, subject_box, timestamp_box, reply_archive_container, hr, body_box)
      }
      else {
        email_box.append(from_box, to_box, subject_box, timestamp_box, hr, body_box)
      }
 
      view.append(email_box);

    });
  }

