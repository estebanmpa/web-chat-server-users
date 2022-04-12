db.createUser({
    user: "usersdbuser",
    pwd: "usersdbpassword",
    roles: [{ role: "readWrite", db: "users" }]
});
