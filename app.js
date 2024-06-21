const express = require('express')
const app = express()
const path = require('path')
const dbpath = path.join(__dirname, 'cricketTeam.db')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
let db = null
app.use(express.json())
const intialzeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running on 3000')
    })
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}
intialzeDBAndServer()
app.get('/players/', async (request, response) => {
  const getData = `SELECT * FROM cricket_team`
  const dbArray = await db.all(getData)
  response.send(dbArray)
})
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playername, jerseyNumber, role} = playerDetails
  const addPlayer = `
    INSERT INTO cricket_team(player_name, jersey_number, role)
    VALUES('${playername}', ${jerseyNumber}, '${role}')
    `
  const dbResponse = await db.run(addPlayer)
  const playerId = dbResponse.lastId
  response.send('Player Added to Team')
})
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const player = `SELECT * FROM cricket_team WHERE player_id = 
    ${playerId}`
  const playerData = await db.get(player)
  response.send(playerData)
})
app.put('/player/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerData = request.body
  const {playername, jerseyNumber, role} = playerDetails
  const updateData = `UPDATE cricket_team 
    SET
    player_name = '${playername}'
    jersey_number = ${jerseyNumber}
    role = '${role}'
    `
  const updatePlayer = await db.run(updateData)
  const playerIdd = updateData.lastId
  response.send('Player Details Updated')
})
app.delete('/player/:playerId/', async (request, response) => {
  const playerId = request.params
  const deleteId = `
    DELETE FROM cricket_team WHERE player_id = ${playerId}
    `
  await db.run(deleteId)
  response.send('Player Removed')
})

module.exports = app
