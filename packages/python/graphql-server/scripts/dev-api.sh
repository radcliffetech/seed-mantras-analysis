# dev-api.sh
source ../../../.venv-graphql-server/bin/activate
uvicorn src.main:app --reload