# mern-course-backend

# mongodb
- Run the following commands inside the mongodb container

`
mongo admin -u 'root' -p 'password123'
`

`
use yourplaces
`

`
db.createUser({ user: "backend", pwd: "backend1234", roles: [{role: "dbAdmin", db: "yourplaces"}] });
`
 