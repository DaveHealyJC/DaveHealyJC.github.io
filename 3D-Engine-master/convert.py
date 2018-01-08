def Convert( fileName ):
    #Takes a file (like an idle .py) written in windows and performs the linux flip -u command on it
    #so that it can be uploaded to the server from home and not give an error.

    file = open(fileName,"r").read()
    fileHandle = open(fileName,"w", newline="\n")
    fileHandle.write(file)
    fileHandle.close()

#Convert( 'cookietest.py' )




    
