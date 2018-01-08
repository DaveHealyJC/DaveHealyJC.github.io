#!/usr/local/bin/python3

#from cgitb import enable 
#enable()

from cgi import FieldStorage,escape
from hashlib import sha256
from time import time
from shelve import open
from http.cookies import SimpleCookie
import pymysql as db
redirBool=False
form_data=FieldStorage()
username=''
result=''
if len(form_data)!=0:
    username=escape(form_data.getfirst('username','').strip())
    password=escape(form_data.getfirst('password','').strip())
    if not username or not password:
        result='<p class=pwInf>Please enter both your username and password.</p>'
    else:
        sha256_password=sha256(password.encode()).hexdigest()
        try:
            connection=db.connect('localhost','doh2','eipuohag','Dreamhome_doh2')
            cursor=connection.cursor(db.cursors.DictCursor)
            cursor.execute("""SELECT * FROM users WHERE username = %s AND password = %s""",(username,sha256_password))
            if cursor.rowcount==0:
                result='<p class=pwInf>The details you input are incorrect. Try again or register a new account.</p>'
            else:
                cookie=SimpleCookie()
                sid=sha256(repr(time()).encode()).hexdigest()
                cookie['sid']=sid
                session_store=open('sess_'+sid,writeback=True)
                session_store['authenticated']=True
                session_store['username']=username
                session_store.close()
                redirBool=True
                print(cookie)
            cursor.close()
            connection.close()
        except (db.Error,IOError):
            result='<p class=pwInf>An error occured. Please try again. If the problem persists then come back later. Sorry for any inconvenience!</p>'




if redirBool==False:       
    print('Content-Type: text/html')
    print()
    print("""
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <link rel="stylesheet" href="walkInd.css">
                <title>Late for WebDev</title>
            </head>
            <header>
                <p id=hing1>Late for Web Dev!</p>
                <p id=hing2>Can you make it in time for the sign in sheet?</p>
            </header>
            <body>
                <form action="index.py" method="post">
                    <label for="username">Username: </label>
                    <input type="text" name="username" id="username" value="%s" />
                    <label for="password">Password: </label>
                    <input type="password" name="password" id="password" />
                    <input type="submit" value="Login" />
                </form>
                <form action="register.py" method="post">
                    <label>New user?</label>
                <input type="submit" value="Register here" />
            </form>
                %s
                <img src="scrn1.JPG" title="Hub" alt="Navigate your way to class!">
            </body>
        </html>"""%(username,result))

else:
    print("Location:late.py")
    print()
