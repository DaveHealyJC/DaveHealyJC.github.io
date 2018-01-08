#!/usr/local/bin/python3

#from cgitb import enable 
#enable()

from cgi import FieldStorage, escape
import pymysql as db
            
print('Content-Type: text/plain')
print()


    
form_data = FieldStorage()
score = escape(form_data.getfirst('score', '').strip())
username = escape(form_data.getfirst('username', '').strip())
spaces = escape(form_data.getfirst('spaces', '').strip())
turns = escape(form_data.getfirst('turns', '').strip())
errMsg='error'
try:    
    connection=db.connect('localhost','doh2','eipuohag','Dreamhome_doh2')
    cursor = connection.cursor(db.cursors.DictCursor)
    if score and username:
        cursor.execute("""INSERT INTO scores VALUES(%s,%s,SYSDATE());""", (username,score))
        connection.commit()
        result='success'
    if spaces and turns:
        cursor.execute("""INSERT INTO mazes VALUES(%s,%s);""", (spaces,turns))
        connection.commit()
    #errMsg+=Afterinserts
    result='success'
    cursor.execute("SELECT * FROM mazes")
    #errMsg+=Afterselect
    count=0
    spaceSum=0
    turnSum=0
    minSpace=1000
    maxSpace=0
    minTurn=1000
    maxTurn=0
    for row in cursor.fetchall():
        spaceVal=int(row['spaces'])
        turnVal=int(row['turns'])
        if spaceVal>maxSpace:
            maxSpace=spaceVal
        if spaceVal<minSpace:
            minSpace=spaceVal
        if turnVal>maxTurn:
            maxTurn=turnVal
        if turnVal<minTurn:
            minTurn=turnVal
        count+=1
        spaceSum+=int(row['spaces'])
        turnSum+=int(row['turns'])
        result=('%i %i %i %i %i %i %i'%(count,round(spaceSum/count),round(turnSum/count),minSpace,maxSpace,minTurn,maxTurn))
    #errMsg+=Aftercalc
    print(result)
    cursor.close()  
    connection.close()
except db.Error:
    print(errMsg)

