const express = require('express')
const path = require('path')
const parseString = require('xml2js').parseString
const request = require('request')

const app = express()

app.set('port', process.env.PORT || 3000)

app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

app.post('/send', (req, res) => {
  // get uri from db
  let subject = req.body.subject
  let body = req.body.body

  let requestBody = `<?xml version="1.0" encoding="UTF-8"?><soap:Envelope soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soap:Body><TicketCreate xmlns="http://www.otrs.org/TicketConnector/">
<UserLogin>root@localhost</UserLogin>
<Password>ZkIXwfabewFxouSR</Password>
<Ticket>
    <Title>some title</Title>
    <CustomerUser>santi@x.com</CustomerUser>
    <CustomerID>EIA</CustomerID>
    <Queue>ColaEIA</Queue>
    <State>open</State>
    <Priority>3 normal</Priority>
</Ticket>
<Article>
    <Subject>${subject}</Subject>
    <Body>${body}</Body>
    <ContentType>text/plain; charset=utf8</ContentType>
</Article>
</TicketCreate></soap:Body></soap:Envelope>`

  const requestHeaders = {
    //   'cache-control': 'no-cache',
    soapaction: 'http://www.otrs.org/TicketConnector/#TicketCreate',
    'Content-type': 'text/xml;charset=UTF-8',
    'user-agent': 'SantiagoNodeTest'
  }

  var requestOptions = {
    method: 'POST',
    url:
      'http://172.105.22.206/otrs/nph-genericinterface.pl/Webservice/santiago2',
    qs: { wsdl: '' },
    headers: requestHeaders,
    body: requestBody,
    timeout: 5000
  }

  request(requestOptions, function(error, response, body) {
    if (error) {
      console.log(error)
    } else {
      try {
        console.log(body)
        parseString(body, function(err, result) {
          let ticketnumber =
            result['soap:Envelope']['soap:Body'][0]['TicketCreateResponse'][0][
              'TicketNumber'
            ]
          console.log(`Ticket number: ${ticketnumber}`)

          res.json({ ticketnumber })
        })
      } catch (e) {
        console.log(e)
      }
    }
  })
})

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`)
})
