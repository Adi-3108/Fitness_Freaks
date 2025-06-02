const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors()) 
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend is working!')
})

app.post('/bmi', (req, res) => {
  const { weight, height } = req.body
  const h = height / 100
  const bmi = (weight / (h * h)).toFixed(2)
  res.json({ bmi })
})

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})
