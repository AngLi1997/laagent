import os


def safe_run(command: str):
    os.system(command)


safe_run('pybabel extract -F babel.cfg -o messages.pot .')
safe_run('pybabel compile -d app/translations')
