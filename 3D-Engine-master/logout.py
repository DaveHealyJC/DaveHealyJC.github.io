#!/usr/local/bin/python3

from cgitb import enable 
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie

print('Content-Type: text/html')
print()

result = '<p class=pwInf>You are already logged out. Redirecting to the login and registration page in 10 seconds....</p>'
try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in cookie:
            sid = cookie['sid'].value
            session_store = open('sess_' + sid, writeback=True)
            session_store['authenticated'] = False
            session_store.close()
            result = """
                <p class=pwInf>You are now logged out. Thanks for playing! Keep an eye out for future updates.
                Redirecting to the login and registration page in 10 seconds....</p>
                     """
except IOError:
    result="""<p class=pwInf>An error occured. Please try again. If the problem persists then come back later.
            Sorry for any inconvenience! Redirecting to the login and registration page in 10 seconds....</p>"""

print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <script src="reDir.js"></script>
            <link rel="stylesheet" href="walkInd.css">
            <title>Late for Web Dev!</title>
        </head>
        <header>
                <p id=hing1>Late for Web Dev!</p>
                <p id=hing2>Can you make it in time for the sign in sheet?</p>
            </header>
        <body>
            %s
        </body>
    </html>""" % (result))
