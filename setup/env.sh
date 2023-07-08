echo "Deleting environment variables backend..."
rm -rf .env .env.local

echo "Setting up environment variables backend (development)..."
echo -e "\
NODE_ENV=development\n\
VERSION=1.0.0\n\
PORT=4000\n\
TZ=America/Sao_Paulo\n\
MONGODB_USERNAME=mongodb\n\
MONGODB_PASSWORD=mongodb\n\
MONGODB_HOST=mongodb://mongodb:mongodb@localhost/?appName=nest&authSource=admin\n\
MONGODB_PORT=27017\n\
REDIS_HOST=redis://localhost:6379\n\
REDIS_PORT=6379\n\
REDIS_PASSWORD=\n\
RABBITMQ_HOST=amqp://rabbitmq:rabbitmq@localhost:5672\n\
RABBITMQ_PORT=5672\n\
RABBITMQ_WEB_PORT=15672\n\
RABBITMQ_USER=rabbitmq\n\
RABBITMQ_PASS=rabbitmq\n\
" >> .env

echo -e "\
NODE_ENV=development\n\
VERSION=1.0.0\n\
PORT=4000\n\
TZ=America/Sao_Paulo\n\
MONGODB_USERNAME=mongodb\n\
MONGODB_PASSWORD=mongodb\n\
MONGODB_HOST=mongodb://mongodb:mongodb@172.18.0.3/?appName=nest&authSource=admin\n\
MONGODB_PORT=27017\n\
REDIS_HOST=redis://172.18.0.4:6379\n\
REDIS_PORT=6379\n\
REDIS_PASSWORD=\n\
RABBITMQ_HOST=amqp://rabbitmq:rabbitmq@172.18.0.5:5672\n\
RABBITMQ_PORT=5672\n\
RABBITMQ_WEB_PORT=15672\n\
RABBITMQ_USER=rabbitmq\n\
RABBITMQ_PASS=rabbitmq\n\
" >> .env.local

echo "Environment variables setted up!"
