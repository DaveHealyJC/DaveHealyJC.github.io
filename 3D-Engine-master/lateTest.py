#!/usr/local/bin/python3

from cgitb import enable 
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie
loginBool=False
print('Content-Type: text/html')
print()


   
try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in cookie:
            sid = cookie['sid'].value
            session_store = open('sess_' + sid, writeback=False)
            if session_store.get('authenticated'):
                loginBool=True
            session_store.close()
except IOError:
    result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'

if not loginBool:
    result="""
</head>
        <body>
<p>You do not have permission to access this page.</p>
    <ul>
        <li><a href="register.py">Register</a></li>
        <li><a href="login.py">Login</a></li>
    </ul>
"""

else:
    result="""
<link rel="stylesheet" href="walk.css">
        <script src="maps.js"></script>
        <script src="walk.js"></script>
</head>
        <body>
<section id='controls'>
            <p>
                CONTROLS:
            </p>
            <p>
                W - Move Forward
            </p>
            <p>
                S - Move Backward
            </p>
            <p>
                Q - Strafe Left
            </p>
            <p>
                E - Strafe Right
            </p>
            <p>
                A - Turn Left
            </p>
            <p>
                D - Turn Right
            </p>
            <p class="timer">00:00</p>
        </section>
        <canvas id='game' width="750" height="550">
        </canvas>
         <canvas id='map' width="150" height="150">
        </canvas>
"""



print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>Web Dev 2</title>
            %s
        </body>
    </html>""" % (result))
