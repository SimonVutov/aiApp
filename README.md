For backend

```jsx
python3 -m venv venv
source venv/bin/activate

brew install postgresql@14
brew services start postgresql@14

createdb mydatabase
createuser myuser -P

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

For front end

```jsx
npm install
npm run dev
```

Go to http://localhost:5174/
