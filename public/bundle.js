const subject = document.getElementById('subject')
const body = document.getElementById('body')
const button = document.getElementById('button')

button.addEventListener('click', send)

function send() {
  let sub = subject.value
  let bod = body.value
  fetch('/send', {
    method: 'POST',
    body: JSON.stringify({ subject: sub, body: bod }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      alert(`El numero de tu tiquete es: ${data.ticketnumber}`)
    })
}
