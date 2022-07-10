const express = require("express");

const path = require("path");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,

      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);

    process.exit(1);
  }
};

initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,

    playerName: dbObject.player_name,

    jerseyNumber: dbObject.jersey_number,

    role: dbObject.role,
  };
};

//GET API-1

app.get("/players/", async (request, response) => {
  const { players } = request.params;

  const getAllPlayers = `

    SELECT * FROM cricket_team`;

  const allPlayers = await db.all(getAllPlayers);

  response.send(
    allPlayers.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

//POST API-2

app.post("/players/", async (request, response) => {
  const players = request.body;

  const { player_name, jersey_number, role } = players;

  const postPlayerQuery = `

    INSERT INTO

    cricket_team(player_name,jersey_number,role)

      VALUES

    ('${playerName}', ${jerseyNumber}, '${role}');`;

  const player = await db.run(postPlayerQuery);

  response.send("Player Added to Team");
});

//GET API-3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getPlayerDetails = `

    SELECT * FROM cricket_team

    WHERE  player_id=${playerId}`;

  const playerDetails = await db.get(getPlayerDetails);

  response.send(convertDbObjectToResponseObject(playerDetails));
});

// PUT API-4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const playersDetails = request.body;

  const { player_name, jersey_number, role } = playersDetails;

  const updatePlayers = `

    UPDATE cricket_team

    SET 

    player_name = "${player_name}",

    jersey_number = ${jersey_number},

    role = "${role}"

    WHERE player_id = ${playerId}`;

  await db.run(updatePlayers);

  response.send("Player Details Updated");
});

// DELETE API-5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deletePlayerQuery = `

    DELETE FROM cricket_team

    WHERE player_id = ${playerId}`;

  await db.run(deletePlayerQuery);

  response.send("Player Removed");
});

module.exports = app;
