#!/usr/local/bin/python3

def containsNum(s):
    return any(char.isdigit() for char in s)


#from cgitb import enable 
#enable()

from cgi import FieldStorage, escape
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
    passwordConf=escape(form_data.getfirst('passwordConf','').strip())
    if not username or not password or not passwordConf:
        result='<p class=pwInf>Please fill the required fields</p>'
    elif password.islower() or password.isupper() or not containsNum(password):
        result='<p class=pwInf>Your password is invalid. Passwords must contain a mixture of lowercase letters, uppercase letters and numbers.</p>'
    elif password!=passwordConf:
        result='<p class=pwInf>Please enter matching passwords</p>'
    else:
        try:
            connection=db.connect('localhost','doh2','eipuohag','Dreamhome_doh2')
            cursor=connection.cursor(db.cursors.DictCursor)
            cursor.execute("""SELECT * FROM users WHERE username = %s""",(username))
            if cursor.rowcount>0:
                result='<p class=pwInf>That username is already taken, please pick another.</p>'
            else:
                sha256_password=sha256(password.encode()).hexdigest()
                cursor.execute("""INSERT INTO users (username, password) VALUES (%s, %s)""",(username,sha256_password))
                connection.commit()
                cursor.close()  
                connection.close()
                cookie=SimpleCookie()
                sid=sha256(repr(time()).encode()).hexdigest()
                cookie['sid']=sid
                session_store=open('sess_'+sid,writeback=True)
                session_store['authenticated']=True
                session_store['username']=username
                session_store.close()
                redirBool=True
                print(cookie)
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
                <title>Late for Web Dev!</title>
            </head>
            <header>
                <p id=hing1>Late for Web Dev!</p>
                <p id=hing2>Can you make it in time for the sign in sheet?</p>
            </header>
            <body>
                <p class=pwInf>Passwords must contain a mixture of lowercase letters, uppercase letters and numbers.</p>
                <form action="register.py" method="post">
                    <label for="username">User name: </label>
                    <input type="text" name="username" id="username" value="%s" />
                    <label for="password">Password: </label>
                    <input type="password" name="password" id="password" />
                    <label for="passwordConf">Confirm password: </label>
                    <input type="password" name="passwordConf" id="passwordConf" />
                    <input type="submit" value="Register" />
                </form>
                %s
                <img src="scrn2.JPG" title="Maze" alt="Navigate your way to class!">
            </body>
        </html>"""%(username,result))

 

else:
    print("Location:late.py")
    print()
