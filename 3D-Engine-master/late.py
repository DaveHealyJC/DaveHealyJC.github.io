#!/usr/local/bin/python3

##########
########## No longer have access to database. Login system temporarily commented out. 
##########

#from cgitb import enable 
#enable()

#from os import environ
#from shelve import open
#from http.cookies import SimpleCookie
#loginBool=False
print('Content-Type: text/html')
print()


   
try:
    loginBool=True #placeholder line
    userName='placeHolder'
#    cookie=SimpleCookie()
#    http_cookie_header=environ.get('HTTP_COOKIE')
#    if http_cookie_header:
#        cookie.load(http_cookie_header)
#        if 'sid' in cookie:
#            sid=cookie['sid'].value
#            session_store=open('sess_'+sid,writeback=False)
#            if session_store.get('authenticated'):
#                userName=session_store['username']
#                loginBool=True
#            session_store.close()
except IOError:
    result='<p>An error occured. Please try again. If the problem persists then come back later. Sorry for any inconvenience!</p>'

if not loginBool:
    result="""
        <link rel="stylesheet" href="walkInd.css">
        </head>
        <body>
            <p class=pwInf>You do not have permission to access this page.</p>
            <ul class=pwInf>
                <li><a href="register.py">Register a new account</a></li>
                <li><a href="index.py">Login to an existing account</a></li>
            </ul>
            """

else:
    result=("""
        <link rel="stylesheet" href="walk.css">
        <script src="maps.js"></script>
        <script src="walk.js"></script>
        </head>
        <body>
            <section id='idLogout'>
            <p>You are logged in as <b class="username">%s</b>. (<a href="logout.py">logout</a>)<p>
            </section>
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
            <p>
                L - Skip puzzle
            </p>
        </section>
        <p class="timer">00:00</p>
        <section id='canRes'>
            <canvas id='game' width="750" height="550">
            </canvas>
        </section>
         <canvas id='map' width="150" height="150">
        </canvas>
        """%(userName))



print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>Late for Web Dev!</title>
            %s
        </body>
    </html>""" % (result))
