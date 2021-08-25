console.clear();
const fs = require('fs');
const $ = require('inquirer');
// const readline = require('readline');
const path = "./users.json"
let init = true;


//object that is store users data
let obj = {
    name: "",
    age: 0
};


    if (fs.existsSync('./users.json')) {

    }else{
        console.log("Creating file...");
        createFile();
    }




// read the file and return file content
// getContentFile will return data in JSON format
function getContetFile(){
    console.log('getContentFile scope \n reading file...')
    return fs.readFileSync(path, 'utf8');

}




// write file with content as parameter
function writeFile(path, data){
    fs.writeFileSync(path, data, 'utf8', (err) => {
        if (err) { throw new err; }
        console.error('Error: ',err);
    });
    console.log('output file modified with successful!!');
}

// create a file to store users
function createFile(){
    let obj = {
        users: []
    };

    try {
        writeFile('users.json', JSON.stringify(obj));
    } catch (err) {
        console.log(err);
    }
}

async function login(){
    let isPassed = false;
    let foundUser = true;
    let userList = JSON.parse(getContetFile());
    try {
       await $.prompt([
            {
                type: 'input',
                name: 'login',
                message: 'Enter your login: '
            },
            {
                type: 'password',
                name: 'password',
                mask: '',
                message: 'enter your passphrase: \n'
            }]).then((answers) => {
                let user = userList.users;
                
            
                    for(let i=0; i < user.length; i++) {
                        if(user[i].login == answers.login){
                            if(user[i].password == answers.password){
                                console.clear();
                                console.log('Congratulations!! You are logged on the system!!!');
                                isPassed = !isPassed;
                                break;
                            }
                        }
                    }
                    
                    console.log('Login or password are invalid!!\nPlease verify login and password!!');
            
                
        })
    } catch (error) {
        console.log(error);
    } finally {
        if(isPassed){
           console.log('You are logged in the system!!');
        }else{
            start();
        }
        
    }
}

// add a new user to file
function addUser(user){
    let data = JSON.parse(getContetFile()); //JSON.parse will parse JSON to OBJ 
    console.log('reading users from output.json');
    data.users.push(user);
    writeFile(path, JSON.stringify(data)); //JSON.stringify will parse OBJ to JSON format
    console.log('New user added with successful!!');
}

async function registerUser(){
    
    try {
        await $.prompt([
            {
                type: 'input',
                name: 'login',
                message: 'Enter new user login: '
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter new password: '

            }
        ]).then((user) => { 
            addUser(user);
        })

    } catch (error) {
        
    }finally {
        start();
    }
    
        
}


// array to use in prompt
let initMsg = [
    {
        type: 'rawlist',
        name: 'action',
        message: 'Welcome to login MgMt 1.0\n  Choose one option:',
        choices: [ 'Login', 'Register User', 'Exit']
    }
];

function start(){
    console.clear;
    let opt = initMsg[0];
    $.prompt((initMsg))
    .then((answers) => {
        

        if(answers.action == opt.choices[0]){
            console.clear();
            login();
            console.log("login with user and password")
        }else if(answers.action == opt.choices[1]){
            console.clear();
            registerUser();
            console.log("register new users");
        }else if(answers.action == opt.choices[2]){
            console.log("See ya!");
            process.exit();
        }
        
    })
}


while(init){
    
    start();
    
   init = !init; 
    
}