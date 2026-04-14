uv run python compile_i18n.py
nohup uv run gunicorn -c gunicorn.config.py run:app > la-agent-py.log 2>&1 &
nohup uv run celery -A app.celery worker -l INFO --pool=solo > celery.log 2>&1 &
echo "start success"
