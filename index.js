const express = require("express")
const sqlite3 = require("sqlite3")

const app = express()
app.use(express.json())

const db = new sqlite3.Database("./twitter.db") 

//ユーザー登録
app.post("/users", (req, res) => {
	db.serialize(() => {
		const user = req.body
		db.run("INSERT INTO users (username, displayName) VALUES (?, ?)", user.username, user.displayName, (err) => {
			if(err !== null){
				console.log(err)
				res.statusCode = 500
				res.json(err)
			} else {
				res.end()
			}
		})
	})
})

//ユーザー一覧取得
app.get("/users", (req, res) => {
	db.serialize(() => {
		db.all("SELECT * FROM users;", (err, rows) => {
			if(err !== null){
				console.log(err)
					res.statusCode = 500
					res.json(err)
			}
			else{
				const users = rows.map(row => {
					return{
						id: row.id,
						username: row.username,
						displayName: row.displayName
					}
				})
				res.json(users)
			}
		})
	}) 
})

//ユーザー単体取得
app.get("/users/:username", (req, res) => {
	const username = req.params["username"]
	db.serialize(() => {
		db.get("SELECT * FROM users WHERE username = ?",
		username, (err, row) => {
			if(err !== null){
				console.log(err)
				res.statusCode = 500
				res.json(err)
			} else if(row === undefined) {
				res.statusCode = 404
				res.end()
			} else {
				const user = {
					id: row.id,
					username: row.username,
					displayName: row.displayName
				}
				res.json(user)
			}
		})
	})
})

//ユーザー削除
app.delete("/users/:username", (req, res) => {
	const username = req.params["username"]
	db.serialize(() => {
		db.run("DELETE FROM users WHERE username = ?",
		username, (err, row) => {
			if(err !== null){
				console.log(err)
				res.statusCode = 500
				res.json(err)
			} else if(row === undefined){
				res.statusCode = 404
				res.end()
			} else {
				res.end()
			}
		})
	})
})

//ツイート投稿
app.post("/tweets", (req, res) => {
	const tweet = req.body
	db.serialize(() => {
		db.run("INSERT INTO tweets (userId, content) VALUES (?, ?)",tweet.userId, tweet.content, (err) => {
			if(err !== null){
				console.log(err)
				res.statusCode = 500
				res.json(err)
			} else {
				res.end();
			}
		})
	})
})

//ツイート一覧取得
app.get("/tweets", (req, res) => {
	db.serialize(() => {
		db.all("SELECT tweets.id, users.username, users.displayName, tweets.content FROM tweets INNER JOIN users ON tweets.userId = users.id", (err, rows) => {
			if(err !== null){
				callback(err, undefined)
			}
			else{
				const tweets = rows.map(row => {
					return {
						id: row.id,
						username: row.username,
						displayName: row.displayName,
						content: row.content
					}
				})
				res.json(tweets)
			}
		})
	})
})

//ツイート単体取得
app.get("/tweets/:id", (req, res) => {
	const id = Number(req.params["id"])
	db.serialize(() => {
		db.get("SELECT tweets.id, users.username, users.displayName, tweets.content FROM tweets INNER JOIN users ON tweets.userId = users.id WHERE tweets.id = ?", id, (err, row) => {
			if(err !== null){
				console.log(err)
				res.statusCode = 500;
				res.json(err)
			}
			else if(row == undefined){
				res.statusCode = 404
				res.end()
			}
			else{
				const tweet = {
					id: row.id,
					username: row.username,
					displayName: row.displayName,
					content: row.content
				}
				res.json(tweet)
			}
		})
	})
})

//ツイート削除
app.delete("/tweets/:id", (req, res) => {
	const id = Number(req.params["id"])
	db.serialize(() => {
		db.run("DELETE FROM tweets WHERE id = ?", id, (err) => {
			if(err !== null){
				console.log(err)
				res.statusCode = 500
				res.json(err)
			}
			else{
				res.end()
			}
		})
	})
})

app.listen(3000, () => {
	console.log("server start")
})
