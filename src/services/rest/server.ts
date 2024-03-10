import http from 'http'
import app from './app'

const port = process.env.PORT || '3000'

// @ts-ignore
http.createServer(app.callback()).listen(port, err => {
  if (err) {
    console.log('Error occured while running server')
    console.log(err)
    return
  }
  console.log(`Server started successfully on PORT: ${port}`)
})
