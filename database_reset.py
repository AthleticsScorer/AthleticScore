import os
import shutil
import sys
import subprocess

def delete_database():
    db_path = 'db.sqlite3'
    if os.path.exists(db_path):
        os.remove(db_path)

def delete_migrations():
    migrations_dirs = ['events/migrations']
    for migrations_dir in migrations_dirs:
        if os.path.exists(migrations_dir):
            for filename in os.listdir(migrations_dir):
                file_path = os.path.join(migrations_dir, filename)
                if os.path.isfile(file_path) and filename != '__init__.py':
                    os.remove(file_path)

def run_migrations():
    subprocess.run(['python3', 'manage.py', 'makemigrations'], check=True)
    subprocess.run(['python3', 'manage.py', 'migrate'], check=True)

if __name__ == '__main__':
    delete_database()
    delete_migrations()
    run_migrations()