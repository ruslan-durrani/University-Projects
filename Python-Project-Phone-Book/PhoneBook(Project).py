#################################################################################################
def Applications_Games():
    print("\n\t\t**********<| Applications Arena (Games/Apps) |>***********\t\t\n")
    Applications = ["| Snake-Realm |","| Cows & Bulls |","| Vowel Frenzy |"]
    for x in range(len(Applications)):
        print(x+1,":) ",Applications[x],"\n")
    Gam_set = input("\nSelect the game -> Choose number : ")
    #==============================-Game1
    if Gam_set == '1':
        print("\n\n\t\t******************** |Snake -|- Realm| **********************\t\t")
        print("\nRules:\n1)Snake can drink water\n\n2)Water can Swallow Gun\n\n3)Gun can destroy Snake\n\n")
        Play ="YES"
        Count = 0
        win = 0
        while Play != "NO":
            Count +=1                                      #******************************
            import random
            C = random.randint(1,3)                             #Snake-Realm(Game)
            if C==1:                                       
               Comp="S"                                    #******************************
            elif C==2:
               Comp="W"
            elif C==3:
               Comp ="G"
      
            User = input("\nYour turn: Select (S)Snake (W)Water or (G)Gun ").upper()
            if Comp == User:
               print(f"\nYou {User} Computer also {Comp} : Match Tie \n")
               Count -=1
            elif Comp == "S":
               if User =="W":
                  print(f"\nYou Water & Computer Snake:  Computer Won\n")
               elif User =="G":
                  print(f"\nYou Gun & Computer Snake:  You Won\n")
                  win +=1                                                     #******************************
            elif Comp == "W":                                                 
               if User =="S":                                                     #Snakes-Realm (GamePart)
                  print(f"\nYou Snake & Computer Water:  You Won\n")          
                  win +=1                                                     #******************************
               elif User =="G":
                  print(f"\nYou Gun & Computer Water:  Computer Won\n")
            elif Comp == "G":
               if User =="W":
                  print(f"\nYou Water & Computer Gun:  You Won\n")
                  win +=1
               elif User =="S":
                  print(f"\nYou Snake & Computer Gun:  Computer Won\n")
            else:
                print("\nWrong Input\n")
            if Count == 3 and win >= 2:
                print("********You-Win***********\n")
            elif Count == 3 and win < 2:
                print("********You-Lose***********\n")
            if Count == 3:
                Play = input("\nDo you want to play again? (Yes or No) ").upper()
                Count = 0
                win = 0
    
    #==============================-Game2
    elif Gam_set == '2':
        print("\n\t\t\t***********Cows & Bulls***********")
        import random                                   
        Num = random.randint(10,20)                    #******************************     
        String = str(Num)                                                                  
        chance = 5                                        #Gamers-Arena(Cows & Bulls)
        cows = 0                                        
        bulls = 0                                      #******************************
        T = False
        while chance != 0:
            User_guess = str(input("\nGuess number between 10-20 "))
            if User_guess[0] == String[0]  and  User_guess[1] == String[1]:
                print(" 2 cows : 0 bulls")
                T = True
                break
            elif User_guess[0] == String[0]  or  User_guess[1] == String[1]:
                print("1 cow : 1 bull")
                chance -=1
            else:
                print("0 cow : 2 bulls")
                chance -=1
        if T == True:
            print("\nMaster-Mind>>>  You won |-::-| ")
        else:
            print("\nYou Lose Better Luck next time ")
    #==============================-Game3
    elif Gam_set == '3':
        print("\n\t\t\t************Vowel-Frenzy************\n")
        Para = input("\nWrite a paragraph and get the vowel starting words : ").split() #**************
        Vowel = []
        for x in Para:                                                          #Vowel-Frenzy
           if x[0]=="a" or x[0]=="e" or x[0]=="i" or x[0]=="o" or x[0]=="u": 
              Vowel.append(x)                                                  #**************
        print("\nThe Words Starts with Vowel Letters are : ",Vowel)
    
#################################################################################################
def Test_your_Math():
    print("\n\t\t**********<| TEST-YOUR-MATH |>***********\t\t\n")
    import random
    x = "YES"
    while x == "YES" :
        print("\n****Math Quiz Starts****\n")
        correct =0                                                           #************************
        incorrect =0                                        
        print("\nThree Questions Answer Correctly\n")                         #Math Short Quiz Session
        for x in range(3):  
            Ran = random.randint(20,30)                                      #************************
            Ran1 = random.randint(20,30)
            Ran2 = random.randint(20,30)
            U_Answer = input(f"What {Ran}+{Ran1}*{Ran2} is ? = ")
            if int(U_Answer) == Ran+Ran1*Ran2:
                print("\nCorrect answer")
                correct+=1
            else:
                print("Wrong Answer")
                incorrect +=1
        print("*******Correct Answers*******: ",correct,"\n*******Incorrect Answers*******: ",incorrect)
        x = input("\nDo you want to play again? ").upper()
#################################################################################################
def Contact_Book():
    print("\n\t\t**********<| YOU CONTACT BOOK |>***********\t\t\n")
    C_Tuple = ("Save Contacts ","Show Contacts ","Search Contact")
    saved_contact_names = ("RUSLAN BABAR","SAAD IQBAL","MUNEEB ARSHAD")
    saved_contact_data = ("Fa20-BSE-094","Fa20-BSE-059","Fa20-BSE-057")
    Yes = "YES"
    while Yes != "NO":
        for x in range(len(C_Tuple)):                             #************************
            print(x+1,":) ",C_Tuple[x])
        choice = (input("Select your choice : "))                    #Contact-Book
        #===========-Save contact 
        if choice== '1':                                          #************************
            another_contact = "YES"
            while another_contact =="YES":
                Contact_name = input("Enter contact name : ").upper()
                Contact_number = input("Enter contact number : ")
                saved_contact_names +=(Contact_name,)
                saved_contact_data +=(Contact_number,)
                another_contact = input("Do you want to save another contact : Yes/No ").upper() 
        #===========-Display contact info
        elif choice== '2':
            for x in range(len(saved_contact_names)):
                print("\n",x+1,":) Name:",saved_contact_names[x],"\n\t\tDetails: ",saved_contact_data[x])

        #===========-Search contact info
        elif choice== '3':
            search = input("Enter the name of contact to search : ").upper()
            if search in saved_contact_names :
                position = saved_contact_names.index(search)
                print("Found:\nName:",search,"\nDeatils: ",saved_contact_data[position])
            else:
                print("\nData not found\n")
        else:
            print("Wrong Input")
        Yes = input("\nDo you want to use contact book :(Yes or No) ").upper()
#################################################################################################
def Note_Pad():
    print("\n\t\t**********<| NOTE +-+ PAD |>***********\t\t\n")
    Dictionary = {}#Note-Pad
    Lis = ["Write Text & Save ","Search file"]
    Ex = "YES"                                   #_________________________________
    while Ex =="YES":
       for x in range(len(Lis)):                 #NOTE-PAD Save Your Important Text
           print(x+1,":) ",Lis[x],"\n")          #_________________________________
       CH = input("\nSelect integer choice: ")
       if CH =='1':
          Sure = "YES"
          while Sure == "YES":
              Key = input("\nFirstly enter Your name to save file: ").upper()
              Value = input("\nType your Text Here ! ").title() 
              Dictionary[Key] = Value 
              Sure = input("\nFile Saved\nDo you want to type another file? ").upper()
       elif CH=='2':
            if Dictionary != {}:
               find = input("\nEnter the file name : ").upper()
               if find in Dictionary :
                  print("Found\nFilename: ",find,"\nContent: ",Dictionary[find])
               else:
                  print("\nFile not found\n")
            else:
               print("\nNo file available\n")
       else:
           print("\nWrong Selection ")
       Ex = input("\nContinue to Note-Pad ? (Yes or No) ").upper()
       print()
#################################################################################################
def main():
    print("\n\t\t*****************PHONE-BOOK*******************\n")
    import datetime
    DT = datetime.datetime.now()
    print("\t\tDate: ",DT.strftime("%D"),"\t\tDay: ",DT.strftime("%A"),"\n")
    print("\t\t**********************************************\n\n")
    List_Content = ["Applications/Games ","Test your Math ","Contact-Book ","Note-Pad"]
    Start = "SHAYESTA"
    while Start !="EXIT" and Start !="YES":
        for x in range(len(List_Content)):
            print(x+1,":) ",List_Content[x],"\n")
        select = (input("Enter your integer choice: ")).upper()
        if select == '1':
            print()
            Applications_Games()       #________________________________________________________________
        elif select == '2':
            print()                                      #Main Functions
            Test_your_Math()                  #It Consists of Caller statements that call other functions
        elif select == '3':           #________________________________________________________________
            print()
            Contact_Book()
        elif select == '4':
            print()
            Note_Pad()
        else:
            print("\nI'm Sorry You Entered an out-of-range choice ")
        Start = input("\n\nWelcome To Home\n\nSwitch off the phone or use again? (Enter to continue /Exit to quit) ").upper()
        print("\n")
main()

#################################################################################################
