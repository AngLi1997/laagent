import config
from app.app_init import app

if __name__ == '__main__':
    app.run('0.0.0.0', config.Config.PORT, threaded=True)