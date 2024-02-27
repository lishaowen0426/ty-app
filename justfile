docker_compose := "docker compose -f docker/db.yml --env-file .env"

db-up:
    #!/usr/bin/env sh
    {{docker_compose}} up --detach 

db-down:
    #!/usr/bin/env zsh
    {{docker_compose}} down  

db-prune:
    #!/usr/bin/env zsh
    {{docker_compose}} down --volumes
    docker volume prune

css:
    @npx tailwindcss -c ./ui/tailwind.config.js -i ./ui/src/index.css -o ./ui/public/output.css 

who port:
    sudo lsof -i -P | grep LISTEN | grep :{{port}}

# sync prisma schema with db without migration history
db-push:
    npx prisma db push

# generate prisma client
db-generate:
    npx prisma generate
